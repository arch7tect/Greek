#!/usr/bin/env python3
"""Extract traceable page-by-page Markdown from scanned books with Codex vision."""

from __future__ import annotations

import argparse
import concurrent.futures
import re
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TMP_ROOT = ROOT / "tmp" / "llm-ocr"
OUTPUT_ROOT = ROOT / "extracted" / "books"
PAGE_HEADING = re.compile(r"(?m)^## PDF-страница (\d+)\s*$")


@dataclass(frozen=True)
class Book:
    slug: str
    title: str
    source: Path
    pages: int


BOOKS = {
    book.slug: book
    for book in (
        Book(
            "taxidi-stin-ellada-1",
            "Ταξίδι στην Ελλάδα 1",
            ROOT / "materials/books/taxidi-stin-ellada-1.pdf",
            247,
        ),
        Book(
            "taxidi-stin-ellada-1-workbook",
            "Ταξίδι στην Ελλάδα 1+ — Βιβλίο Ασκήσεων",
            ROOT / "materials/books/taxidi-stin-ellada-1-workbook.pdf",
            110,
        ),
        Book(
            "afto-akrivos-a",
            "Αυτό ακριβώς! — Επίπεδο Α΄",
            ROOT / "materials/books/afto-akrivos-a.pdf",
            218,
        ),
    )
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "books",
        nargs="*",
        choices=sorted(BOOKS),
        default=sorted(BOOKS),
        help="Books to process; defaults to all configured books.",
    )
    parser.add_argument("--model", default="gpt-5.6-sol")
    parser.add_argument("--batch-size", type=int, default=4)
    parser.add_argument("--workers", type=int, default=3)
    parser.add_argument("--dpi", type=int, default=150)
    parser.add_argument("--retries", type=int, default=3)
    return parser.parse_args()


def chunks(total: int, batch_size: int) -> list[tuple[int, int]]:
    return [
        (start, min(start + batch_size - 1, total))
        for start in range(1, total + 1, batch_size)
    ]


def batch_path(book: Book, start: int, end: int) -> Path:
    return TMP_ROOT / book.slug / "batches" / f"pages-{start:03d}-{end:03d}.md"


def expected_pages(start: int, end: int) -> list[int]:
    return list(range(start, end + 1))


def validate_batch(path: Path, start: int, end: int) -> bool:
    if not path.is_file() or path.stat().st_size == 0:
        return False
    headings = [int(value) for value in PAGE_HEADING.findall(path.read_text())]
    return headings == expected_pages(start, end)


def normalize_markdown(path: Path) -> None:
    """Remove model-added trailing whitespace without changing visible text."""
    text = path.read_text()
    normalized = "\n".join(line.rstrip() for line in text.splitlines()) + "\n"
    path.write_text(normalized)


def render_batch(book: Book, start: int, end: int, dpi: int) -> tuple[Path, list[Path]]:
    render_dir = TMP_ROOT / book.slug / "rendered" / f"{start:03d}-{end:03d}"
    if render_dir.exists():
        shutil.rmtree(render_dir)
    render_dir.mkdir(parents=True)
    prefix = render_dir / "page"
    command = [
        "pdftoppm",
        "-png",
        "-r",
        str(dpi),
        "-f",
        str(start),
        "-l",
        str(end),
        str(book.source),
        str(prefix),
    ]
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    images = sorted(render_dir.glob("page-*.png"))
    if len(images) != end - start + 1:
        raise RuntimeError(
            f"{book.slug} {start}-{end}: rendered {len(images)} images, expected {end-start+1}"
        )
    return render_dir, images


def ocr_prompt(book: Book, start: int, end: int) -> str:
    page_list = ", ".join(str(page) for page in expected_pages(start, end))
    count = end - start + 1
    return f"""The {count} attached images are PDF pages {page_list} of the Modern Greek book
\"{book.title}\", in exactly that order.

Transcribe every visible printed character exactly. Also transcribe legible handwritten
answers or notes, prefixing each handwritten block with [рукописная пометка]. Preserve
Modern Greek accents, capitalization, punctuation, headings, labels, exercise numbering,
answer choices, tables, footnotes, and reading order. Do not translate, summarize,
normalize, correct, solve exercises, or infer missing text. Mark every illegible fragment
as [проверить]. Do not describe illustrations that contain no text.

Return only Markdown. Produce exactly one section for every image, in order, headed
`## PDF-страница N`, where N is its PDF page number. Do not omit blank pages: for a page
with no visible text, write `[текста нет]` below its heading."""


def run_codex(
    book: Book,
    start: int,
    end: int,
    model: str,
    dpi: int,
    retries: int,
) -> tuple[str, int, int, str]:
    output = batch_path(book, start, end)
    output.parent.mkdir(parents=True, exist_ok=True)
    if validate_batch(output, start, end):
        return book.slug, start, end, "cached"

    last_error = "unknown failure"
    for attempt in range(1, retries + 1):
        render_dir: Path | None = None
        try:
            render_dir, images = render_batch(book, start, end, dpi)
            command = [
                "codex",
                "exec",
                "-m",
                model,
                "--ephemeral",
                "--ignore-user-config",
                "--skip-git-repo-check",
                "--sandbox",
                "read-only",
                "-C",
                "/private/tmp",
                "-i",
                *[str(image) for image in images],
                "-o",
                str(output),
                "--color",
                "never",
                ocr_prompt(book, start, end),
            ]
            result = subprocess.run(
                command,
                stdin=subprocess.DEVNULL,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode != 0:
                raise RuntimeError(result.stderr.strip()[-1500:])
            normalize_markdown(output)
            if not validate_batch(output, start, end):
                headings = PAGE_HEADING.findall(output.read_text()) if output.exists() else []
                raise RuntimeError(f"invalid page headings: {headings}")
            return book.slug, start, end, "done"
        except Exception as exc:  # noqa: BLE001 - report external process failures
            last_error = str(exc)
            if output.exists():
                output.unlink()
            if attempt < retries:
                time.sleep((2, 8, 30)[min(attempt - 1, 2)])
        finally:
            if render_dir and render_dir.exists():
                shutil.rmtree(render_dir)
    if start < end:
        single_results = [
            run_codex(book, page, page, model, dpi, retries)
            for page in expected_pages(start, end)
        ]
        failed_singles = [result for result in single_results if result[3].startswith("failed")]
        if not failed_singles:
            output.write_text(
                "\n\n".join(
                    batch_path(book, page, page).read_text().rstrip()
                    for page in expected_pages(start, end)
                )
                + "\n"
            )
            normalize_markdown(output)
            if validate_batch(output, start, end):
                return book.slug, start, end, "done-split"
        last_error = f"batch failed ({last_error}); single-page failures: {failed_singles}"
    return book.slug, start, end, f"failed: {last_error}"


def merge_book(book: Book, model: str, batch_size: int) -> Path:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_ROOT / f"{book.slug}.md"
    parts = [
        f"# LLM-OCR: {book.title}\n\n",
        f"**Источник:** `{book.source.relative_to(ROOT)}`\n\n",
        f"**Модель:** `{model}`\n\n",
        f"**Охват:** PDF-страницы 1–{book.pages}\n\n",
        "**Статус:** машинный черновик; не считается визуально проверенной цитатой\n\n",
        "Текст разделён по PDF-страницам. `[проверить]` обозначает фрагмент, который "
        "модель не смогла уверенно прочитать. Рукописные пометки отделены от печатного "
        "текста и не считаются ключом или исправлением преподавателя.\n\n",
    ]
    for start, end in chunks(book.pages, batch_size):
        path = batch_path(book, start, end)
        if not validate_batch(path, start, end):
            raise RuntimeError(f"Cannot merge invalid or missing batch: {path}")
        parts.append(path.read_text().rstrip() + "\n\n")
    output.write_text("".join(parts).rstrip() + "\n")
    normalize_markdown(output)
    return output


def main() -> int:
    args = parse_args()
    selected = [BOOKS[slug] for slug in args.books]
    tasks = [
        (book, start, end)
        for book in selected
        for start, end in chunks(book.pages, args.batch_size)
    ]
    print(
        f"OCR model={args.model} books={len(selected)} pages={sum(book.pages for book in selected)} "
        f"batches={len(tasks)} workers={args.workers}",
        flush=True,
    )
    failures: list[tuple[str, int, int, str]] = []
    completed = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = [
            executor.submit(
                run_codex,
                book,
                start,
                end,
                args.model,
                args.dpi,
                args.retries,
            )
            for book, start, end in tasks
        ]
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            completed += 1
            slug, start, end, status = result
            print(f"[{completed}/{len(tasks)}] {slug} pages {start}-{end}: {status}", flush=True)
            if status.startswith("failed"):
                failures.append(result)

    if failures:
        print("Failed batches:", file=sys.stderr)
        for result in failures:
            print("  ", result, file=sys.stderr)
        return 1

    for book in selected:
        output = merge_book(book, args.model, args.batch_size)
        print(f"Merged {output.relative_to(ROOT)}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
