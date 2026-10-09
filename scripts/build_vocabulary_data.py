#!/usr/bin/env python3
"""Build the cumulative vocabulary page and trainer data from lesson pages."""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VOCAB_DIR = ROOT / "docs" / "vocabulary"
ALL_PATH = VOCAB_DIR / "all.md"
DATA_PATH = ROOT / "docs" / "assets" / "data" / "vocabulary-data.js"
TOPIC_DIR = ROOT / "scripts" / "topic-data"

HEADING_RE = re.compile(r"^##\s+(.+?)\s+\{\s*#([a-z0-9-]+)\s*\}\s*$")
LESSON_RE = re.compile(r"lesson-(\d{2})\.md$")
COUNT_RE = re.compile(r"В активный словарь вош\w*\s+(\d+)")
LINK_RE = re.compile(r"\[([^\]]+)\]\([^)]+\)")
TAG_RE = re.compile(r"<[^>]+>")
ARTICLE_RE = re.compile(r"^(?:ο|η|το|οι|τα)\s+", re.IGNORECASE)


@dataclass(frozen=True)
class Word:
    lesson: str
    greek_md: str
    transcription_md: str
    meaning_md: str
    note_md: str
    core: bool
    anchor: str
    source_label: str

    @property
    def greek(self) -> str:
        return plain(self.greek_md)


def plain(value: str) -> str:
    value = LINK_RE.sub(r"\1", value)
    value = value.replace("`", "")
    value = TAG_RE.sub(" ", value)
    return re.sub(r"\s+", " ", value).strip()


def split_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def source_label(heading: str) -> str:
    if heading.casefold().startswith("диалог"):
        return "диалог"
    match = re.search(
        r"(?:упражнен\w*|упр\.)\s*([0-9]+[а-яα-ω]?(?:[–-][0-9]+)?)",
        heading,
        re.IGNORECASE,
    )
    if match:
        return f"упр. {match.group(1)}"
    return "раздел"


def sort_key(word: Word) -> str:
    value = ARTICLE_RE.sub("", word.greek.casefold())
    value = unicodedata.normalize("NFD", value)
    value = "".join(char for char in value if unicodedata.category(char) != "Mn")
    return value.replace("ς", "σ")


def read_lessons() -> tuple[dict[str, list[Word]], dict[str, int]]:
    lessons: dict[str, list[Word]] = {}
    declared_counts: dict[str, int] = {}
    seen: dict[str, str] = {}

    for path in sorted(VOCAB_DIR.glob("lesson-??.md")):
        lesson_match = LESSON_RE.search(path.name)
        if not lesson_match:
            continue
        lesson = lesson_match.group(1)
        text = path.read_text(encoding="utf-8")
        count_match = COUNT_RE.search(text)
        if not count_match:
            raise ValueError(f"{path}: не найдено заявленное число активных единиц")
        declared_counts[lesson] = int(count_match.group(1))

        heading = ""
        anchor = ""
        rows: list[Word] = []
        for line in text.splitlines():
            heading_match = HEADING_RE.match(line)
            if heading_match:
                heading, anchor = heading_match.groups()
                continue
            if not anchor or not line.startswith("| `"):
                continue

            cells = split_row(line)
            if len(cells) < 5:
                raise ValueError(f"{path}: неполная словарная строка: {line}")
            greek, transcription, meaning, note = cells[:4]
            core_value = cells[-1]
            if core_value not in {"да", "—"}:
                raise ValueError(f"{path}: неизвестное значение «Основное»: {core_value}")

            item = Word(
                lesson=lesson,
                greek_md=greek,
                transcription_md=transcription,
                meaning_md=meaning,
                note_md=note,
                core=core_value == "да",
                anchor=anchor,
                source_label=source_label(heading),
            )
            if item.greek in seen:
                raise ValueError(
                    f"{path}: «{item.greek}» уже встречается в уроке {seen[item.greek]}"
                )
            seen[item.greek] = lesson
            rows.append(item)

        if len(rows) != declared_counts[lesson]:
            raise ValueError(
                f"{path}: заявлено {declared_counts[lesson]}, найдено строк {len(rows)}"
            )
        lessons[lesson] = sorted(rows, key=sort_key)

    return lessons, declared_counts


def render_all(lessons: dict[str, list[Word]]) -> str:
    total = sum(len(words) for words in lessons.values())
    lines = [
        "# Общий словарь",
        "",
        f"**Всего активных слов и устойчивых формул:** {total}",
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

    for lesson, words in lessons.items():
        lines.extend(
            [
                f"## Впервые встретились на уроке {lesson}",
                "",
                "| Слово | Транскрипция | Значение | Форма / примечание | Впервые встретилось |",
                "|---|---|---|---|---|",
            ]
        )
        for word in words:
            source = (
                f"[Урок {lesson}, {word.source_label}]"
                f"(lesson-{lesson}.md#{word.anchor})"
            )
            lines.append(
                f"| {word.greek_md} | {word.transcription_md} | "
                f"{word.meaning_md} | {word.note_md} | {source} |"
            )
        lines.append("")

    return "\n".join(lines)


def render_data(lessons: dict[str, list[Word]]) -> str:
    words = [word for lesson in lessons.values() for word in lesson]
    memberships = {word.greek: [word.lesson] for word in words}
    for lesson, ids in read_reviews(lessons).items():
        for word_id in ids:
            memberships[word_id].append(lesson)
    training_sets = {
        lesson: [word for word in words if lesson in memberships[word.greek]]
        for lesson in lessons
    }
    payload = {
        "source": "docs/vocabulary/lesson-*.md",
        "total": len(words),
        "core": sum(word.core for word in words),
        "topics": read_topics(lessons),
        "lessons": {
            lesson: {
                "total": len(lesson_words),
                "core": sum(word.core for word in lesson_words),
            }
            for lesson, lesson_words in training_sets.items()
        },
        "words": [
            {
                "id": word.greek,
                "lesson": word.lesson,
                "lessons": memberships[word.greek],
                "greek": word.greek,
                "transcription": plain(word.transcription_md),
                "meaning": plain(word.meaning_md),
                "note": plain(word.note_md),
                "core": word.core,
            }
            for word in words
        ],
    }
    return (
        "window.GREEK_VOCABULARY = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n"
    )


def read_topics(lessons: dict[str, list[Word]]) -> dict:
    """Topics select existing lemmas; they never create another vocabulary source."""
    known = {word.greek: word for rows in lessons.values() for word in rows}
    topics = {}
    for path in sorted(TOPIC_DIR.glob("*.json")):
        topic = json.loads(path.read_text())
        ids = [item for group in topic["groups"] for item in group["ids"]]
        if len(ids) != len(set(ids)) or any(item not in known for item in ids):
            raise ValueError(f"{path}: duplicate or unknown vocabulary ids: {set(ids) - set(known)}")
        topics[path.stem] = {"title": topic["title"], "ids": ids, "total": len(ids),
                             "core": sum(known[item].core for item in ids)}
    return topics


def read_reviews(lessons: dict[str, list[Word]]) -> dict[str, list[str]]:
    """Explicit repetitions live in the lesson vocabulary, not duplicated rows."""
    originals = {word.greek: word.lesson for rows in lessons.values() for word in rows}
    reviews = {}
    for lesson in lessons:
        path = VOCAB_DIR / f"lesson-{lesson}.md"
        markers = re.findall(r"<!-- trainer-review: (.*?) -->", path.read_text(), re.S)
        if len(markers) > 1:
            raise ValueError(f"{path}: несколько списков повторения")
        ids = json.loads(markers[0]) if markers else []
        if not isinstance(ids, list) or any(not isinstance(item, str) for item in ids):
            raise ValueError(f"{path}: повторение должно быть списком словарных идентификаторов")
        if len(ids) != len(set(ids)):
            raise ValueError(f"{path}: повторы внутри списка повторения")
        for item in ids:
            if item not in originals or originals[item] >= lesson:
                raise ValueError(f"{path}: «{item}» не найдено в предыдущих уроках")
        reviews[lesson] = ids
    return reviews


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--check",
        action="store_true",
        help="проверить, что производные файлы уже актуальны",
    )
    args = parser.parse_args()

    try:
        lessons, _ = read_lessons()
        expected = {
            ALL_PATH: render_all(lessons),
            DATA_PATH: render_data(lessons),
        }
    except ValueError as error:
        print(error, file=sys.stderr)
        return 1

    stale = [
        path
        for path, content in expected.items()
        if not path.exists() or path.read_text(encoding="utf-8") != content
    ]
    if args.check:
        if stale:
            for path in stale:
                print(f"устарел: {path.relative_to(ROOT)}", file=sys.stderr)
            return 1
        print(
            f"Словарь актуален: {sum(len(words) for words in lessons.values())} единиц"
        )
        return 0

    for path, content in expected.items():
        path.write_text(content, encoding="utf-8")
    for lesson, words in lessons.items():
        print(
            f"Урок {lesson}: {len(words)} единиц, "
            f"основных {sum(word.core for word in words)}"
        )
    print(f"Всего: {sum(len(words) for words in lessons.values())}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
