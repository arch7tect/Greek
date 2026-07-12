# Greek wiki schema

## Canonical locations

| Content | Path pattern |
|---|---|
| Incoming lesson files | `inbox/lessons/NN/` |
| Incoming homework files | `inbox/homework/NN/` |
| Processed lesson originals | `materials/lessons/NN/` |
| Processed homework originals | `materials/homework/NN/` |
| Processed books | `materials/books/` |
| Lesson | `docs/lessons/lesson-NN-topic.md` |
| Book card | `docs/books/book-title.md` |
| Homework | `docs/homework/lesson-NN-topic.md` |
| Lesson vocabulary | `docs/vocabulary/lesson-NN.md` |
| Cumulative vocabulary | `docs/vocabulary/all.md` |
| Stable reference | `docs/reference/<area>/<topic>.md` or existing section |
| Memory note | `docs/memory/lesson-NN.md` |
| Temporary extraction | `tmp/` |

Use existing pages rather than creating near-duplicates. Start from templates in
`docs/page-templates/` when applicable.

## Material traceability requirements

- Put the lesson-specific inventory in a «Материалы и качество» section on the
  lesson page; do not create a separate lesson source card.
- List exact paths under `materials/`, file sizes, page/slide counts or audio
  durations.
- State whether each PDF is a scan, has a usable text layer, or has broken font
  mapping.
- Map source ranges to resulting wiki pages.
- Record OCR/transcription quality and every unresolved discrepancy.
- When book numbering differs from PDF numbering, record both.
- Create a card in `docs/books/` only for a reusable book. Track all processed
  page ranges and resulting wiki pages there.

## Lesson page requirements

- Use a zero-padded lesson number (`01`, `02`, …) as the primary identifier.
  Do not add calendar dates to filenames, headings, navigation labels, or
  metadata.
- Separate goals, covered topics, performed practice, homework, uncertainties,
  and repetition.
- Explain every contrast that forces a beginner to choose between forms. Give
  meaning, a selection rule, one realistic situation or minimal pair, and a
  common mistake. Do not leave pairs such as `σου/σας` as unexplained lists.
- Do not equate presence in a presentation with proof that it was covered. Mark
  this distinction when the actual scope is unknown.
- Link canonical rules, vocabulary, homework, relevant books, and memory note.

## Reference-page requirements

- State verification status and linked lesson.
- Provide the concise rule, forms or tables, examples, common errors, and
  sources.
- Flag contradictions rather than silently choosing a version.
- Write Modern Greek with stress marks. Preserve articles and important forms.

## Vocabulary requirements

The lesson vocabulary page groups words by exact exercise. Use columns such as:

| Слово | Транскрипция | Значение | Форма | Метка или статус |
|---|---|---|---|---|

The cumulative dictionary has one row per active word:

| Слово | Транскрипция | Значение | Форма / примечание | Впервые встретилось |
|---|---|---|---|---|

Link `Впервые встретилось` to an explicit ASCII anchor on the lesson dictionary
section. Avoid duplicate lemmas; enrich the existing row when a later lesson
adds a meaning or form. Count table data rows mechanically after edits.

Follow `references/transcription.md`. Add transcription to learner-facing Greek
words, phrases, dialogues, and examples. Bibliographic titles, author names, and
raw source inventories do not require it.

## Homework requirements

- Preserve printed page, PDF page when relevant, exercise number, instruction,
  and supplied media links.
- Keep lifecycle state honest: `задано` → `выполнено` → `проверено` →
  `разобрано`.
- Never fill listening answers without audio or a verified answer key.
- Link new vocabulary and the originating lesson.

## Navigation checklist

- Update the relevant section index.
- Add pages to `mkdocs.yml` in lesson order.
- Update `docs/learning-path.md` only with evidence-backed progress.
- Add reciprocal links among lesson, books, homework, references, vocabulary,
  and memory note.
- Prefer explicit anchors like `{ #lesson-02-ex-4 }`; Cyrillic automatic slugs
  may not resolve under strict MkDocs checks.
