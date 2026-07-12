#!/usr/bin/env python3
"""Generate the cumulative dictionary and trainer data from lesson dictionaries."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[4]
VOCABULARY_DIR = REPO_ROOT / "docs/vocabulary"
ALL_OUTPUT = VOCABULARY_DIR / "all.md"
DATA_OUTPUT = REPO_ROOT / "docs/assets/data/vocabulary-data.js"
LESSON_FILE = re.compile(r"^lesson-(\d{2})\.md$")
SOURCE_HEADING = re.compile(r"^## (.+?)\s+\{\s*#([a-z0-9-]+)\s*\}\s*$")
DECLARED_COUNT = re.compile(r"^В активный словарь вошл\S*\s+(\d+)\b")
GREEK_ALPHABET = "αβγδεζηθικλμνξοπρστυφχψω"
GREEK_ORDER = {letter: index for index, letter in enumerate(GREEK_ALPHABET)}
ARTICLES = re.compile(r"^(?:ο|η|το|οι|τα)\s+", re.IGNORECASE)
HEADER_WORDS = {"Слово", "Слово или формула", "Число"}
HEADER_NOTES = {"Форма", "Форма / примечание", "Вариант"}
CORE_VALUES = {"да": True, "—": False}


def table_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def plain(value: str) -> str:
    value = value.strip().replace("`", "")
    return re.sub(r"\[([^]]+)]\([^)]+\)", r"\1", value)


def source_label(lesson: str, title: str) -> str:
    if title.casefold().startswith("диалог"):
        detail = "диалог"
    else:
        exercise = re.search(r"упражнени[ея]\s+([^\s{]+)", title, re.IGNORECASE)
        detail = f"упр. {plain(exercise.group(1))}" if exercise else "раздел"
    return f"Урок {lesson}, {detail}"


def sort_key(greek: str) -> tuple[int, ...]:
    lemma = ARTICLES.sub("", greek.casefold(), count=1).replace("ς", "σ")
    letters = (
        character
        for character in unicodedata.normalize("NFD", lemma)
        if unicodedata.category(character) != "Mn"
    )
    return tuple(GREEK_ORDER.get(character, len(GREEK_ORDER) + ord(character)) for character in letters)


def parse_lesson(path: Path) -> list[dict[str, object]]:
    lesson_match = LESSON_FILE.match(path.name)
    if not lesson_match:
        raise ValueError(f"Unexpected lesson dictionary filename: {path.name}")
    lesson = lesson_match.group(1)
    declared_count: int | None = None
    source: dict[str, str] | None = None
    headers: list[str] | None = None
    words: list[dict[str, object]] = []

    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        count_match = DECLARED_COUNT.match(line)
        if count_match:
            declared_count = int(count_match.group(1))

        heading_match = SOURCE_HEADING.match(line)
        if heading_match:
            title, anchor = heading_match.groups()
            source = {
                "anchor": anchor,
                "label": source_label(lesson, title),
            }
            headers = None
            continue

        if not line.startswith("|"):
            continue
        cells = table_cells(line)
        if cells and cells[0] in HEADER_WORDS:
            if source is None:
                raise ValueError(f"Vocabulary table without source heading at {path}:{line_number}")
            if len(cells) < 5 or cells[1:3] != ["Транскрипция", "Значение"]:
                raise ValueError(f"Unexpected vocabulary columns at {path}:{line_number}")
            if cells[3] not in HEADER_NOTES or cells[-1] != "Основное":
                raise ValueError(f"Vocabulary table must end with Основное at {path}:{line_number}")
            headers = cells
            continue

        if not line.startswith("| `"):
            continue
        if headers is None or source is None:
            raise ValueError(f"Vocabulary row without a recognized header at {path}:{line_number}")
        if len(cells) != len(headers):
            raise ValueError(
                f"Expected {len(headers)} cells at {path}:{line_number}, got {len(cells)}"
            )
        core_value = plain(cells[-1]).casefold()
        if core_value not in CORE_VALUES:
            raise ValueError(
                f"Основное must be да or — at {path}:{line_number}, got {cells[-1]!r}"
            )
        greek, transcription, meaning, note = cells[:4]
        words.append(
            {
                "id": plain(greek),
                "lesson": lesson,
                "greek": plain(greek),
                "transcription": plain(transcription),
                "meaning": plain(meaning),
                "note": plain(note),
                "core": CORE_VALUES[core_value],
                "raw": (greek, transcription, meaning, note),
                "source_anchor": source["anchor"],
                "source_label": source["label"],
            }
        )

    if declared_count is None:
        raise ValueError(f"Lesson dictionary does not declare its total: {path}")
    if len(words) != declared_count:
        raise ValueError(
            f"{path.name} declares {declared_count} entries, but contains {len(words)} rows"
        )
    return words


def parse_words() -> list[dict[str, object]]:
    paths = sorted(VOCABULARY_DIR.glob("lesson-*.md"))
    if not paths:
        raise ValueError("No lesson dictionaries found")
    words = [word for path in paths for word in parse_lesson(path)]
    seen: dict[str, str] = {}
    for word in words:
        greek = str(word["greek"])
        if greek in seen:
            raise ValueError(
                f"Duplicate Greek vocabulary entry {greek!r} in lessons {seen[greek]} and {word['lesson']}"
            )
        seen[greek] = str(word["lesson"])
    return words


def lesson_counts(words: list[dict[str, object]]) -> dict[str, dict[str, int]]:
    counts: dict[str, dict[str, int]] = {}
    for lesson in sorted({str(word["lesson"]) for word in words}):
        lesson_words = [word for word in words if word["lesson"] == lesson]
        counts[lesson] = {
            "total": len(lesson_words),
            "core": sum(bool(word["core"]) for word in lesson_words),
        }
    return counts


def render_all(words: list[dict[str, object]]) -> str:
    lines = [
        "# Общий словарь",
        "",
        f"**Всего активных слов и устойчивых формул:** {len(words)}",
        "",
        "Словарь автоматически собирается из словарей уроков. Внутри каждого урока",
        "записи отсортированы по греческому алфавиту; подробный контекст находится",
        "на странице урока.",
        "",
        "Обозначения: [как читать транскрипцию](../reference/transcription.md).",
        "",
        "Практика: [тренажёр слов по урокам](../training/vocabulary.md).",
        "",
    ]
    for lesson in sorted({str(word["lesson"]) for word in words}):
        lines.extend(
            [
                f"## Впервые встретились на уроке {lesson}",
                "",
                "| Слово | Транскрипция | Значение | Форма / примечание | Впервые встретилось |",
                "|---|---|---|---|---|",
            ]
        )
        lesson_words = sorted(
            (word for word in words if word["lesson"] == lesson),
            key=lambda word: sort_key(str(word["greek"])),
        )
        for word in lesson_words:
            greek, transcription, meaning, note = word["raw"]
            source = (
                f"[{word['source_label']}]"
                f"(lesson-{lesson}.md#{word['source_anchor']})"
            )
            lines.append(f"| {greek} | {transcription} | {meaning} | {note} | {source} |")
        lines.append("")
    return "\n".join(lines)


def render_data(words: list[dict[str, object]]) -> str:
    counts = lesson_counts(words)
    ordered_words = sorted(
        words,
        key=lambda word: (str(word["lesson"]), sort_key(str(word["greek"]))),
    )
    public_words = [
        {key: word[key] for key in ("id", "lesson", "greek", "transcription", "meaning", "note", "core")}
        for word in ordered_words
    ]
    payload = {
        "source": "docs/vocabulary/lesson-*.md",
        "total": len(words),
        "core": sum(bool(word["core"]) for word in words),
        "lessons": counts,
        "words": public_words,
    }
    serialized = json.dumps(payload, ensure_ascii=False, indent=2)
    return f"window.GREEK_VOCABULARY = {serialized};\n"


def write_or_check(path: Path, content: str, check: bool) -> bool:
    current = path.read_text(encoding="utf-8") if path.exists() else None
    if current == content:
        return True
    if check:
        display_path = path.relative_to(REPO_ROOT) if path.is_relative_to(REPO_ROOT) else path
        print(f"Out of date: {display_path}")
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail when generated files are stale")
    args = parser.parse_args()

    words = parse_words()
    counts = lesson_counts(words)
    current = all(
        (
            write_or_check(ALL_OUTPUT, render_all(words), args.check),
            write_or_check(DATA_OUTPUT, render_data(words), args.check),
        )
    )
    if args.check and not current:
        raise SystemExit(1)

    action = "Checked" if args.check else "Generated"
    print(f"{action} {len(words)} words ({sum(bool(word['core']) for word in words)} core)")
    for lesson, count in counts.items():
        print(f"Lesson {lesson}: {count['core']} core / {count['total']} total")


if __name__ == "__main__":
    main()
