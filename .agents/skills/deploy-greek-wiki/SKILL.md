---
name: deploy-greek-wiki
description: Build, publish, update, and verify this repository's MkDocs site on its configured SSH server using versioned static releases and an atomic current symlink. Use when asked to deploy, publish, redeploy, update the live Greek wiki, check its deployed version, or diagnose this project's publication workflow. Do not use for GitHub Pages or unrelated applications.
---

# Deploy the Greek wiki

Publish only the generated MkDocs site. Keep source materials, repository
history, credentials, and local configuration off the server.

## Safety rules

- Work from the repository root containing `mkdocs.yml`.
- Inspect `git status --short` before deployment. A dirty tree may be deployed,
  but report clearly that the live site does not correspond to a commit.
- Use the existing SSH agent and `~/.ssh/config`. Never read, copy, print, or
  commit private keys, passwords, tokens, `.env` files, IP addresses, or SSH
  configuration.
- Do not run `git pull` on the server and do not upload the repository,
  `materials/`, `inbox/`, `.git/`, or `.agents/`. Upload only `site/`.
- Preserve unrelated Funnel routes and services. Never use `tailscale funnel
  reset`, `tailscale serve reset`, or a command that disables port 443.
- Do not create or replace server infrastructure implicitly. If the configured
  service, release root, or Funnel route is absent, stop and report what needs
  initial setup.

## Configuration

The bundled script uses non-secret environment overrides:

| Variable | Default | Purpose |
|---|---|---|
| `GREEK_DEPLOY_HOST` | `openclaw` | Existing SSH alias |
| `GREEK_DEPLOY_ROOT` | `/srv/greek` | Versioned release root |
| `GREEK_DEPLOY_ROUTE` | `/greek` | Existing Funnel path |
| `GREEK_DEPLOY_SERVICE` | `greek-wiki.service` | Remote systemd unit |
| `GREEK_DEPLOY_HEALTH_URL` | `http://127.0.0.1:8790/` | Server-local check |
| `GREEK_DEPLOY_KEEP_RELEASES` | `3` | Releases retained for rollback |

Do not store credentials in these variables or add machine-specific overrides
to the repository.

## Publish

1. Read `scripts/deploy.sh` before changing the deployment workflow.
2. Run the preflight without remote writes:

   ```bash
   .agents/skills/deploy-greek-wiki/scripts/deploy.sh --dry-run
   ```

3. If the build, SSH checks, route check, and rsync preview succeed, publish:

   ```bash
   .agents/skills/deploy-greek-wiki/scripts/deploy.sh
   ```

The script runs `uv run mkdocs build --strict`, uploads `site/` to a timestamped
directory, atomically switches `/srv/greek/current`, retains recent releases,
and verifies both the server-local endpoint and the public page. It rolls the
symlink back automatically if the server-local health check fails.

## Verify and report

- Confirm the systemd unit is `active` and `enabled`.
- Confirm the configured route remains present alongside unrelated Funnel
  routes.
- Confirm the public homepage returns HTTP 200.
- Report the release identifier, public URL, Git commit, whether the worktree
  was dirty, and validation results. Do not report authentication details.
