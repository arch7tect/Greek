#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s [--dry-run]\n' "${0##*/}"
}

dry_run=false
case "${1:-}" in
  "") ;;
  --dry-run) dry_run=true ;;
  -h|--help) usage; exit 0 ;;
  *) usage >&2; exit 2 ;;
esac

host="${GREEK_DEPLOY_HOST:-openclaw}"
root="${GREEK_DEPLOY_ROOT:-/srv/greek}"
route="${GREEK_DEPLOY_ROUTE:-/greek}"
service="${GREEK_DEPLOY_SERVICE:-greek-wiki.service}"
health_url="${GREEK_DEPLOY_HEALTH_URL:-http://127.0.0.1:8790/}"
keep_releases="${GREEK_DEPLOY_KEEP_RELEASES:-3}"

root="${root%/}"
route="/${route#/}"
route="${route%/}"

if ! [[ "$root" =~ ^/(srv|opt)/[A-Za-z0-9._/-]+$ ]]; then
  printf 'Refusing unsafe deployment root: %s\n' "$root" >&2
  exit 2
fi
if ! [[ "$route" =~ ^/[A-Za-z0-9._~/-]+$ ]]; then
  printf 'Invalid deployment route: %s\n' "$route" >&2
  exit 2
fi
if ! [[ "$keep_releases" =~ ^[1-9][0-9]*$ ]]; then
  printf 'GREEK_DEPLOY_KEEP_RELEASES must be a positive integer.\n' >&2
  exit 2
fi

for command_name in git uv ssh rsync curl python3; do
  command -v "$command_name" >/dev/null || {
    printf 'Required command not found: %s\n' "$command_name" >&2
    exit 1
  }
done

test -f mkdocs.yml || {
  printf 'Run this script from the repository root.\n' >&2
  exit 1
}

commit="$(git rev-parse --short HEAD)"
if test -n "$(git status --porcelain)"; then
  worktree_state=dirty
else
  worktree_state=clean
fi
release="$(date -u +%Y%m%d%H%M%S)-$commit"

printf 'Commit: %s (%s worktree)\n' "$commit" "$worktree_state"
printf 'Building release %s...\n' "$release"
uv run mkdocs build --strict

ssh "$host" bash -s -- "$root" "$service" "$health_url" "$route" <<'REMOTE'
set -euo pipefail
root="$1"
service="$2"
health_url="$3"
route="$4"
test -d "$root/releases"
test -L "$root/current"
systemctl is-active --quiet "$service"
systemctl is-enabled --quiet "$service"
curl -fsS "$health_url" >/dev/null
tailscale funnel status | grep -F -- "$route" >/dev/null
REMOTE

if "$dry_run"; then
  printf 'Previewing upload only; no remote files will change.\n'
  rsync -an --delete site/ "$host:$root/releases/$release/"
  printf 'Dry run passed for release %s.\n' "$release"
  exit 0
fi

ssh "$host" bash -s -- "$root" "$release" <<'REMOTE'
set -euo pipefail
mkdir -p "$1/releases/$2"
REMOTE
rsync -a --delete site/ "$host:$root/releases/$release/"

ssh "$host" bash -s -- "$root" "$release" "$service" "$health_url" "$keep_releases" <<'REMOTE'
set -euo pipefail
root="$1"
release="$2"
service="$3"
health_url="$4"
keep_releases="$5"
release_dir="$root/releases/$release"
previous="$(readlink -f "$root/current")"
next="$root/.current-next-$$"

test -f "$release_dir/index.html"
ln -s "$release_dir" "$next"
mv -Tf "$next" "$root/current"

if ! systemctl is-active --quiet "$service" || ! curl -fsS "$health_url" >/dev/null; then
  rollback="$root/.current-rollback-$$"
  ln -s "$previous" "$rollback"
  mv -Tf "$rollback" "$root/current"
  printf 'Health check failed; restored %s.\n' "$previous" >&2
  exit 1
fi

mapfile -t releases < <(find "$root/releases" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -r)
for old in "${releases[@]:$keep_releases}"; do
  rm -rf -- "$root/releases/$old"
done
REMOTE

funnel_json="$(ssh "$host" tailscale funnel status --json)"
public_host="$(printf '%s' "$funnel_json" | python3 -c 'import json, sys
data = json.load(sys.stdin)
print(next(iter(data["Web"])).rsplit(":", 1)[0])')"
public_url="https://$public_host$route/"
http_code="$(curl -fsSL -o /dev/null -w '%{http_code}' --max-time 20 "$public_url")"
test "$http_code" = 200

printf 'Published release: %s\n' "$release"
printf 'Public URL: %s\n' "$public_url"
printf 'HTTP status: %s\n' "$http_code"
