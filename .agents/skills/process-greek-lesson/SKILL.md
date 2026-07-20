---
name: process-greek-lesson
description: Process Greek lesson materials into this repository's MkDocs wiki. Use when new PDFs, images, text files, homework, handwriting sheets, or audio recordings appear under inbox/lessons or inbox/homework; when asked to analyze or recheck a lesson; or when lesson knowledge, material traceability, homework, memory notes, per-lesson vocabulary, and the cumulative dictionary must be created or updated. Do not use for general Greek questions unrelated to supplied course materials.
---

# Process a Greek lesson

Turn raw lesson files into traceable, cross-linked wiki knowledge organized by
zero-padded lesson number. Distinguish verified content from inference.

## Prepare

1. Locate the repository root by `mkdocs.yml` and work from it.
2. Read `CONTRIBUTING.md`, current lesson/book/vocabulary indexes, and
   [references/wiki-schema.md](references/wiki-schema.md) completely before
   editing the wiki. Read
   [references/transcription.md](references/transcription.md) completely before
   adding any learner-facing Greek words or phrases.
3. Inspect `git status --short`. Preserve existing edits and staging; do not
   commit unless the user explicitly requests it.
4. Inventory the relevant lesson and homework folders with `rg --files` and
   inspect each file's format, size, page count, dimensions, or duration.
5. Treat `inbox/` as the unprocessed queue. Use `lesson-NN-<type>.<ext>` names
   when the user authorizes normalization; never rewrite source contents.

If the request concerns inventorying, recognizing, or mapping a complete
reusable book, invoke `$process-greek-book` instead. This skill consumes only
the exact book pages needed for a lesson.

## Inspect every source

- For PDFs, invoke the available PDF skill. Inspect metadata and the text layer,
  render pages, and visually review them. Never trust extraction alone for
  Greek accents, tables, exercise layout, or scans.
- For a page from a reusable book, consult the matching section in
  `extracted/books/<book-slug>.md` when it exists, then reopen and visually
  verify the original PDF page before using its text. Treat LLM-OCR as a search
  aid, not as authority. Do not rerun full-book OCR as part of a lesson task.
- For images, inspect the original resolution. Upscale only temporary copies
  under `tmp/` when small print needs review.
- For text files, preserve wording and links while normalizing only the wiki
  representation.
- For audio, read [references/audio.md](references/audio.md) completely and
  follow it. Match each recording to the exact exercise.
- For another document format, invoke its format-specific skill when available.

Record contradictions, illegible fragments, and uncertain recognition as
`[проверить]`. Do not repair source content by guessing. Prefer teacher
corrections over a textbook or automated transcription and mark the correction.

## Build the lesson knowledge graph

Create or update only the pages justified by the material:

1. A numbered lesson page describing goals, material actually covered,
   practice, homework, uncertainties, and repetition tasks. Explain how a
   beginner chooses between contrasting forms; include usage context and a
   common mistake instead of only listing translations. Its «Материалы и
   качество» section lists exact original paths, technical quality, processed
   ranges, numbering discrepancies, and resulting pages.
2. A book card in `docs/books/` only for a reusable textbook, workbook, or
   reference book. Do not create a separate card for one lesson's files.
3. Stable reference pages for reusable pronunciation, grammar, or communication
   rules. Keep a fact in one canonical page and link to it elsewhere.
4. A homework page preserving exercise numbers, book and PDF page numbers,
   completion state, media, and verification status.
5. A per-lesson vocabulary page. Treat it as the only manually edited
   vocabulary source; generate the cumulative dictionary and trainer data from
   it.
6. A one-screen memory note when the lesson contains material worth quick
   recall.
7. Training material only when enough verified content exists; do not invent
   exercises merely to fill the section.

Update section indexes, `mkdocs.yml`, the learning path, and reciprocal links.
Use explicit ASCII anchor IDs for headings targeted from other pages.

After the lesson pages are complete, move each processed original without
changing its contents from `inbox/<area>/...` to the matching canonical path
under `materials/<area>/...`. Update all recorded paths. Leave in `inbox/` only
files that remain unprocessed or whose lesson assignment is unresolved.

## Extract vocabulary conservatively

Include only words that occur in an exercise or are explicitly assigned. Do not
inflate the dictionary with every word visible in an explanation or slide.

- Store nouns with article and plural when known.
- Store verbs in the first-person singular dictionary form used by this course.
- Preserve stress marks.
- Add the project's simplified pronunciation transcription to every active
  vocabulary row and learner-facing Greek phrase.
- Keep names in a separate note; do not count them as active vocabulary.
- Cite lesson, printed/PDF page, and exercise for every batch.
- Hold incomplete or audio-dependent forms outside the cumulative dictionary
  until verified.
- Put `Основное` last in every lesson vocabulary table. Use `да` for the first
  learning pass and `—` for the full set only; keep this choice visible to the
  learner on the lesson page.
- After verification, update only the lesson dictionary by hand and confirm
  that its stated total equals its actual data rows. Do not edit
  `docs/vocabulary/all.md` or `docs/assets/data/vocabulary-data.js` manually.
- Run `scripts/build_vocabulary_data.py` after changing lesson vocabulary or
  priority. It generates both derived files. Review the per-lesson totals and
  keep the generated files with the working changes; do not commit any file
  unless the user explicitly requests a commit.

## Validate

1. Re-open rendered source pages or audio segments for every material
   ambiguity resolved during the run.
2. Run `uv run mkdocs build --strict` and fix broken configuration, navigation,
   links, and anchors.
3. Run `scripts/build_vocabulary_data.py --check` and confirm all generated
   vocabulary files are current whenever vocabulary or its priority changes.
4. Check modified authored files for trailing whitespace and run
   `git diff --check -- docs mkdocs.yml .agents/skills AGENTS.md CONTRIBUTING.md README.md inbox/README.md materials/README.md`.
5. Inspect `git status --short` and ensure no temporary output is tracked.
6. Report created pages, vocabulary counts, unresolved items, validation result,
   and commit status. Do not claim that a lesson was completed or homework was
   done unless the materials establish it.
