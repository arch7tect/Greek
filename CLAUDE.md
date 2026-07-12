# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal Russian-language MkDocs wiki for learning Modern Greek. There is no
application code — the "product" is the Markdown content in `docs/` plus the
MkDocs Material site built from it. Explanations are written in Russian; Greek
examples carry stress marks and a simplified transcription in square brackets
(rules in `docs/reference/transcription.md`).

`AGENTS.md` is the authoritative rules file for all tasks in this repository —
read it first. `CONTRIBUTING.md` describes the content model (page types,
naming, status markers, vocabulary rules).

## Commands

```bash
uv sync                                              # install deps (Python 3.13+, uv)
uv run mkdocs serve                                  # local preview at http://127.0.0.1:8000
uv run mkdocs build --strict                         # required check after any docs change
.agents/skills/deploy-greek-wiki/scripts/deploy.sh --dry-run   # deploy preflight
.agents/skills/deploy-greek-wiki/scripts/deploy.sh             # publish to the live server
```

After changing a project skill, validate it:

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/process-greek-lesson
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/deploy-greek-wiki
```

Do not commit unless the user explicitly asks.

## Required workflow: project skills

Two project skills under `.agents/skills/` drive the main tasks. Use them
instead of improvising:

- **process-greek-lesson** — whenever new or changed material appears under
  `inbox/lessons/` or `inbox/homework/`, or a lesson must be (re)analyzed. It
  defines how to inspect sources (never trust text extraction alone for Greek),
  which pages to create/update, and how to move originals to `materials/`.
- **deploy-greek-wiki** — for publishing or verifying the live site. It uploads
  only `site/` to an SSH server as a versioned release with an atomic
  `current` symlink. Never upload the repo, `materials/`, `inbox/`, `.git/`,
  or `.agents/`; never reset Tailscale Funnel/serve.

## Content architecture

Material lifecycle: `inbox/` (unprocessed queue, originals untouched) →
extraction and verification → original moved unchanged to `materials/` +
knowledge published as cross-linked pages in `docs/`.

The `docs/` sections form a knowledge graph with one canonical home per fact;
other pages link to it instead of duplicating:

- `docs/lessons/` — per-lesson pages (goals, coverage, mistakes, homework, and
  a «Материалы и качество» section tracing exact source files and quality).
- `docs/reference/` — stable rules (grammar, transcription) independent of any
  lesson; lesson pages link here instead of restating.
- `docs/vocabulary/` — per-lesson lists plus a cumulative dictionary. Add words
  only when they occur in an exercise or are explicitly assigned; nouns keep
  article and plural, verbs keep the 1sg dictionary form.
- `docs/homework/`, `docs/memory/` (one-screen cheat sheets),
  `docs/training/` (interactive trainers), `docs/books/` (cards for reusable
  textbooks only).
- `docs/page-templates/` — templates for lesson, homework, book, and
  vocabulary pages.

When adding or renaming pages, update the section index, `mkdocs.yml` nav,
`docs/learning-path.md`, and reciprocal links together — `--strict` builds
catch broken links.

## Hard conventions

- Lesson identifiers are zero-padded (`01`…); files are named
  `lesson-NN-<topic-or-type>.<ext>`. No calendar dates in filenames, headings,
  nav labels, or lesson metadata.
- Never guess illegible OCR, missing audio answers, stress, or transcription —
  mark it `[проверить]` and verify against the source. Teacher corrections
  override textbooks and are explicitly marked.
- Working pages start with one status: `черновик` / `проверено` / `выучено` /
  `повторить`.
- Explain contrasts, not just forms: what differs, how to choose, a realistic
  example, and a common mistake.
