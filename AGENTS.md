# Greek learning wiki

This repository is a personal Russian-language wiki for learning Modern Greek.
Treat source files as evidence and keep extracted knowledge traceable to them.

## Required workflow

- For new or changed lesson materials under `inbox/lessons/` or
  `inbox/homework/`, use the project skill `$process-greek-lesson` from
  `.agents/skills/process-greek-lesson/`.
- For publishing, updating, or verifying the live wiki, use the project skill
  `$deploy-greek-wiki` from `.agents/skills/deploy-greek-wiki/`.
- Follow `CONTRIBUTING.md` and the skill's references before editing lesson,
  vocabulary, homework, memory, reference, or book pages.
- Keep detailed task procedures in the skill. Keep this file limited to rules
  that apply to every task in the repository.

## Content conventions

- Write explanations in Russian and Modern Greek examples with correct stress
  marks.
- Add simplified pronunciation transcription in square brackets to every
  learner-facing Greek word, form, phrase, example, and dialogue. Follow
  `docs/reference/transcription.md`.
- Explain contrasts instead of only listing forms. State what differs, how to
  choose, give a realistic example, and name a common mistake.
- Add vocabulary only when a word occurs in an exercise or is explicitly
  assigned. Store nouns with article and plural; keep names separate from the
  active word count.
- Never guess illegible OCR, missing audio answers, stress, or transcription.
  Mark uncertainty explicitly and verify it against the source.

## Organization

- Use zero-padded lesson identifiers: `01`, `02`, …, `10`.
- Name lesson-bound files `lesson-NN-<topic-or-type>.<ext>`.
- Do not put calendar dates in filenames, page headings, navigation labels, or
  lesson metadata. Bibliographic publication dates may remain in book cards.
- Treat `inbox/` as a queue. After processing, move unchanged originals to the
  matching path under `materials/`.
- Record lesson-file inventory and verification quality in the lesson page.
  Keep separate cards in `docs/books/` only for reusable books and workbooks.
- Keep stable rules in `docs/reference/`; lesson pages should link to them
  instead of duplicating the full explanation.
- Update indexes, `mkdocs.yml`, the learning path, and reciprocal links whenever
  pages are added or renamed.

## Verification and Git

- Run `uv run mkdocs build --strict` after documentation changes.
- When changing the project skill, also run:
  `python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/process-greek-lesson`.
- When changing the deployment skill, also run:
  `python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/deploy-greek-wiki`.
- Check authored changes with
  `git diff --check -- AGENTS.md .agents/skills docs mkdocs.yml CONTRIBUTING.md README.md inbox/README.md materials/README.md`.
- Preserve unrelated user changes and existing staging.
- Do not commit unless the user explicitly asks.
