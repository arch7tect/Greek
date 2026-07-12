# Claude Code

Read `AGENTS.md` first. It is the authoritative source for repository rules,
content conventions, required project skills, verification, and Git policy.
Read `CONTRIBUTING.md` for the wiki content model.

## Commands

```bash
uv sync
uv run mkdocs serve
uv run mkdocs build --strict
.agents/skills/process-greek-lesson/scripts/build_vocabulary_data.py --check
```

After changing a project skill, validate the corresponding folder:

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/process-greek-lesson
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/deploy-greek-wiki
```

For publication, follow `.agents/skills/deploy-greek-wiki/SKILL.md` and run its
deployment script first with `--dry-run`.
