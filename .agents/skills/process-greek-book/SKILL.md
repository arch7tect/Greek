---
name: process-greek-book
description: Process reusable Modern Greek textbooks, workbooks, grammar books, and reference books into traceable repository evidence. Use when a new or changed book appears under inbox/books; when asked to inventory, analyze, recheck, or run full-book LLM-OCR; when a docs/books card or source map must be created or updated; or when extracted/books must be generated or repaired. Do not use for a lesson-specific page scan with no reusable book file or for general Greek questions unrelated to supplied course materials.
---

# Process a Greek book

Preserve the original book, build a traceable page-by-page evidence layer, and keep
source inventory, machine recognition, and educational processing as separate
states.

## Prepare

1. Locate the repository root by `mkdocs.yml` and work from it.
2. Read `CONTRIBUTING.md`, the current book index and card, and
   [the shared wiki schema](../process-greek-lesson/references/wiki-schema.md)
   completely before editing.
3. Read [the transcription rules](../process-greek-lesson/references/transcription.md)
   completely before adding learner-facing Greek to `docs/`. Raw OCR under
   `extracted/` is source evidence and does not receive learner transcription.
4. Inspect `git status --short`. Preserve existing edits and staging; do not
   commit unless the user explicitly requests it.
5. Inventory `inbox/books/` and `materials/books/` with `rg --files`. Record the
   exact source path, byte size, PDF page count, and whether the file is new,
   changed, or already represented by a book card.

## Keep three statuses separate

- **Source inventory:** physical file, page count, section boundaries, printed
  numbering, missing or duplicate pages, keys, and technical quality.
- **LLM-OCR:** a searchable machine draft for every requested PDF page.
- **Educational processing:** only ranges actually used in a verified lesson,
  homework assignment, reference page, or vocabulary batch.

Never describe a book as educationally processed merely because all pages were
visually inventoried or recognized by a model.

## Inspect the source

1. Invoke the available PDF skill. Inspect metadata, page geometry, embedded
   fonts, and the text layer before choosing recognition methods.
2. Render pages and visually review the full requested range. For a full source
   inventory, review every page and record exact section boundaries. Contact
   sheets may support navigation, but reopen individual pages for fine print,
   dense tables, accents, and ambiguities.
3. Map PDF pages to printed pages with verified anchor points. Record offset
   changes, unnumbered inserts, missing pages, duplicates, and scan defects;
   never infer a missing page's contents.
4. Distinguish printed content from handwriting. Treat annotations as evidence
   of the physical copy, not as an answer key or teacher correction.
5. Do not trust a nominal text layer when font mapping is broken. Explain its
   limitations in the book card.

## Run page-by-page LLM-OCR

Use the repository script `scripts/llm_ocr_books.py` when the user requests
full-book recognition or when a complete searchable layer is required.

1. Read the script before changing or running it. Add a book configuration only
   when its page count and canonical source path have been verified.
2. Pass the user-requested model explicitly. Otherwise use the script's current
   default and record the actual model in both the output and book card; do not
   silently substitute another model.
3. Keep the source unchanged. Render only temporary images under `tmp/` and
   remove them after successful merging.
4. Preserve visible text rather than translating, correcting, solving, or
   reconstructing it. Require one `## PDF-страница N` section per input page.
5. Mark illegible fragments `[проверить]`. Prefix legible handwritten blocks
   with `[рукописная пометка]`; do not guess unclear handwriting.
6. Store final corpora as `extracted/books/<book-slug>.md`. Include source path,
   model, page range, and machine-draft status in each output.
7. Validate that page headings equal the exact ordered range `1..N`, with no
   omissions or duplicates. Count and report `[проверить]` and handwritten
   markers. Page completeness does not establish character accuracy.

Do not copy raw OCR into `docs/`. Before citing or teaching from a recognized
fragment, reopen its PDF page, visually verify the wording and accents, and add
the required learner transcription in the authored wiki page.

## Update the book knowledge

Create or update `docs/books/<book-slug>.md` with:

- canonical source path, exact size, page count, and technical state;
- separate source-inventory, LLM-OCR, and educational-processing statuses;
- exact OCR path, model, coverage, unresolved count, and draft warning;
- full section map with both PDF and printed page ranges;
- confirmed missing or duplicate pages and numbering discontinuities;
- processed educational ranges linked to lessons, homework, references, and
  vocabulary;
- answer-key coverage, handwriting caveats, and rules for future use.

Update `docs/books/index.md` when the book, coverage, or status changes. Do not
add all visible words to vocabulary: vocabulary remains limited to exercises
actually used or explicitly assigned.

After successful processing, move an unchanged original from `inbox/books/` to
its canonical path under `materials/books/` and update recorded paths. Leave it
in `inbox/` if source identity, requested processing scope, or the canonical
destination remains unresolved. Honest `[проверить]` markers alone do not block
archiving the processed original.

## Validate

1. Reopen every source page used to resolve an OCR ambiguity or publish a fact.
2. Recheck the exact ordered PDF-page headings in every changed OCR corpus.
3. Run `python3 -m py_compile scripts/llm_ocr_books.py` when the script changes.
4. Run `uv run mkdocs build --strict` after documentation changes.
5. Run `git diff --check -- AGENTS.md .agents/skills docs mkdocs.yml
   CONTRIBUTING.md README.md inbox/README.md materials/README.md extracted
   scripts`.
6. Inspect `git status --short` and ensure temporary renders, batch caches, and
   `__pycache__` are not tracked.
7. Report page coverage, unresolved and handwritten marker counts, authored
   pages, validation results, and commit status. Never claim character-perfect
   OCR unless every character was visually verified.
