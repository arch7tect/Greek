# Greek wiki schema

## Canonical locations

| Content | Path pattern |
|---|---|
| Incoming books | `inbox/books/` |
| Incoming lesson files | `inbox/lessons/NN/` |
| Incoming homework files | `inbox/homework/NN/` |
| Processed books | `materials/books/` |
| Processed lesson originals | `materials/lessons/NN/` |
| Processed homework originals | `materials/homework/NN/` |
| Extracted book OCR | `extracted/books/<book-slug>.md` |
| Book card | `docs/books/<book-slug>.md` |
| Lesson | `docs/lessons/lesson-NN-topic.md` |
| Homework | `docs/homework/lesson-NN-topic.md` |
| Lesson vocabulary | `docs/vocabulary/lesson-NN.md` |
| Cumulative vocabulary | `docs/vocabulary/all.md` |
| Stable reference | `docs/reference/<area>/<topic>.md` or existing section |
| Memory note | `docs/memory/lesson-NN.md` |
| Temporary extraction | `tmp/` |

Sort processed originals by the file's role, not by the inbox folder it
arrived in: class materials (slides, class audio, class exercises) go to
`materials/lessons/NN/`; assignment artifacts (homework notes, assigned
exercise sheets, completed work) go to `materials/homework/NN/`. A dual-use
file lives in `materials/lessons/NN/` and both pages link to the single copy.

Name originals `lesson-NN-<what-it-is>.<ext>`:

- book page scan or photo: `lesson-NN-<book>-page-PPP` with the printed page
  number (`lesson-04-taxidi-page-31.jpeg`,
  `lesson-06-afto-akrivos-page-148.jpeg`);
- standalone exercise sheet without a known book: `lesson-NN-exercise-K`;
- audio: `lesson-NN-exercise-K.mp3` when the exercise number is unambiguous,
  otherwise a content label (`lesson-NN-dialogue.mp3`,
  `lesson-06-listening-form-a.mp3`);
- homework note: `lesson-NN-homework.txt`.
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
- Store full page-by-page machine recognition in `extracted/books/`, not `docs/`.
  Record the model and exact page coverage, and keep OCR status separate from
  educational processing.

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

The lesson vocabulary page is the only manually edited vocabulary source. Group
words by exact exercise and end every vocabulary table with `Основное`:

| Слово | Транскрипция | Значение | Форма / примечание | Основное |
|---|---|---|---|---|

Use `да` for the first learning pass and `—` for the full trainer set only.
Additional columns such as a source label or verification status may appear
before `Основное`.

Generate the cumulative dictionary and trainer data with
`scripts/build_vocabulary_data.py`; do not edit them manually. The cumulative
dictionary has one row per active word:

| Слово | Транскрипция | Значение | Форма / примечание | Впервые встретилось |
|---|---|---|---|---|

Link `Впервые встретилось` to an explicit ASCII anchor on the lesson dictionary
section. Avoid duplicate lemmas; enrich the existing row when a later lesson
adds a meaning or form. State each lesson's active vocabulary total in prose;
the generator validates it against the table rows.

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
