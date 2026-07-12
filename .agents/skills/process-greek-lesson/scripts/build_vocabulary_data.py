#!/usr/bin/env python3
"""Build the browser trainer dataset from the canonical cumulative dictionary."""

from __future__ import annotations

import json
import re
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[4]
SOURCE = REPO_ROOT / "docs/vocabulary/all.md"
CORE_SOURCE = Path(__file__).resolve().parents[1] / "assets/core-vocabulary.txt"
OUTPUT = REPO_ROOT / "docs/assets/data/vocabulary-data.js"
LESSON_HEADING = re.compile(r"^## Впервые встретились на уроке (\d{2})$")
DECLARED_TOTAL = re.compile(
    r"^\*\*Всего активных слов и устойчивых формул:\*\*\s+(\d+)\s*$"
)


def plain(value: str) -> str:
    return value.strip().replace("`", "")


def read_core_words() -> set[str]:
    return {
        line.strip()
        for line in CORE_SOURCE.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    }


def parse_words() -> list[dict[str, object]]:
    # The cumulative dictionary starts directly with lesson 01, then uses
    # explicit headings when the lesson changes.
    lesson = "01"
    words: list[dict[str, object]] = []
    seen: set[str] = set()
    core_words = read_core_words()
    declared_total: int | None = None

    for line_number, line in enumerate(
        SOURCE.read_text(encoding="utf-8").splitlines(), start=1
    ):
        total = DECLARED_TOTAL.match(line)
        if total:
            declared_total = int(total.group(1))
            continue
        heading = LESSON_HEADING.match(line)
        if heading:
            lesson = heading.group(1)
            continue
        if not line.startswith("| `"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) != 5:
            raise ValueError(f"Expected five cells at line {line_number}, got {len(cells)}")
        greek, transcription, meaning, note, _source = map(plain, cells)
        if greek in seen:
            raise ValueError(f"Duplicate Greek vocabulary entry: {greek}")
        seen.add(greek)
        words.append(
            {
                "id": greek,
                "lesson": lesson,
                "greek": greek,
                "transcription": transcription,
                "meaning": meaning,
                "note": note,
                "core": greek in core_words,
            }
        )

    dictionary_words = {str(word["greek"]) for word in words}
    unknown_core = sorted(core_words - dictionary_words)
    if unknown_core:
        raise ValueError("Unknown core entries: " + ", ".join(unknown_core))
    if declared_total is None:
        raise ValueError("The cumulative dictionary does not declare its total")
    if len(words) != declared_total:
        raise ValueError(
            f"The dictionary declares {declared_total} entries, but contains {len(words)} rows"
        )

    return words


def main() -> None:
    words = parse_words()
    lessons: dict[str, dict[str, int]] = {}
    for lesson in sorted({str(word["lesson"]) for word in words}):
        lesson_words = [word for word in words if word["lesson"] == lesson]
        lessons[lesson] = {
            "total": len(lesson_words),
            "core": sum(bool(word["core"]) for word in lesson_words),
        }

    payload = {
        "source": "docs/vocabulary/all.md",
        "total": len(words),
        "core": sum(bool(word["core"]) for word in words),
        "lessons": lessons,
        "words": words,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(payload, ensure_ascii=False, indent=2)
    OUTPUT.write_text(f"window.GREEK_VOCABULARY = {serialized};\n", encoding="utf-8")
    print(f"Wrote {len(words)} words ({payload['core']} core) to {OUTPUT.relative_to(REPO_ROOT)}")
    for lesson, counts in lessons.items():
        print(f"Lesson {lesson}: {counts['core']} core / {counts['total']} total")


if __name__ == "__main__":
    main()
