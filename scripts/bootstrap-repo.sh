#!/usr/bin/env bash
#
# bootstrap-repo.sh — create a GitHub repo, protect main, link Vercel, sync env vars.
# Requires: gh (authenticated via `gh auth login`), vercel (via `vercel login`), jq.
#
# Usage: ./bootstrap-repo.sh <repo-name> [--private] [--env-file .env]

set -euo pipefail
set +x   # ensure no xtrace leaks secret values

# ---------- args & defaults ----------
REPO_NAME="${1:?Usage: $0 <repo-name> [--private] [--env-file .env]}"; shift || true
VISIBILITY="--public"
ENV_FILE=".env"
REQUIRED_REVIEWS=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --private)  VISIBILITY="--private"; shift ;;
    --public)   VISIBILITY="--public"; shift ;;
    --env-file) ENV_FILE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

# ---------- preflight ----------
for cmd in gh vercel jq; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "❌ '$cmd' not found in PATH"; exit 1; }
done
gh auth status >/dev/null 2>&1 || { echo "❌ Run 'gh auth login' first"; exit 1; }

OWNER="$(gh api user --jq '.login')"
echo "▶ Owner: $OWNER  |  Repo: $REPO_NAME  |  Visibility: ${VISIBILITY#--}"

# ---------- 1. create repo ----------
if gh repo view "$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  echo "ℹ Repo already exists, skipping create."
else
  echo "▶ Creating GitHub repository..."
  gh repo create "$REPO_NAME" "$VISIBILITY" --add-readme --clone
fi
cd "$REPO_NAME" 2>/dev/null || true

# Default branch must exist with at least one commit before protection PUT will succeed.
DEFAULT_BRANCH="$(gh api "repos/$OWNER/$REPO_NAME" --jq '.default_branch')"
echo "▶ Default branch: $DEFAULT_BRANCH"

# ---------- 2. branch protection ----------
# gh has no native protection command; PUT a JSON payload to the REST API.
# NOTE: required_status_checks is intentionally null here — set later via protect-checks.sh
# once your CI has reported at least one run (otherwise contexts are silently accepted
# but never enforced).
echo "▶ Applying branch protection to '$DEFAULT_BRANCH'..."
PROTECTION_PAYLOAD="$(jq -n --argjson reviews "$REQUIRED_REVIEWS" '{
  required_status_checks: null,
  enforce_admins: true,
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    require_code_owner_reviews: false,
    required_approving_review_count: $reviews,
    require_last_push_approval: false
  },
  restrictions: null,
  required_linear_history: true,
  allow_force_pushes: false,
  allow_deletions: false,
  block_creations: false,
  required_conversation_resolution: true,
  lock_branch: false,
  allow_fork_syncing: true
}')"

echo "$PROTECTION_PAYLOAD" | gh api \
  -X PUT "repos/$OWNER/$REPO_NAME/branches/$DEFAULT_BRANCH/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - --silent \
  && echo "✅ Branch protection enabled" \
  || { echo "❌ Failed to set branch protection"; exit 1; }

# Break-glass (run manually if you need an emergency force-push):
#   gh api -X DELETE repos/$OWNER/$REPO_NAME/branches/$DEFAULT_BRANCH/protection
#   ...fix...
#   re-run this script to re-apply protection.

# ---------- 3. link to Vercel ----------
echo "▶ Linking project to Vercel..."
vercel link --yes --project "$REPO_NAME" >/dev/null
echo "✅ Vercel project linked"

# ---------- 4. sync .env -> Vercel (production + development) ----------
if [[ ! -f "$ENV_FILE" ]]; then
  echo "⚠ No '$ENV_FILE' found — skipping env sync."
else
  echo "▶ Syncing env vars from '$ENV_FILE' to production & development..."
  while IFS= read -r line || [[ -n "$line" ]]; do
    # skip blanks and comments
    [[ -z "${line// }" || "$line" =~ ^[[:space:]]*# ]] && continue

    KEY="${line%%=*}"
    VAL="${line#*=}"
    KEY="$(echo "$KEY" | xargs)"            # trim whitespace
    # Strip outer single OR double quotes safely
    VAL="${VAL%\"}"; VAL="${VAL#\"}"
    VAL="${VAL%\'}"; VAL="${VAL#\'}"
    [[ -z "$KEY" ]] && continue

    for TARGET in production development; do
      # --force upserts in one atomic call (no rm/add race window)
      printf '%s' "$VAL" | vercel env add "$KEY" "$TARGET" --force >/dev/null \
        && echo "  ✓ $KEY → $TARGET" \
        || echo "  ✗ $KEY → $TARGET (failed)"
    done
  done < "$ENV_FILE"
  echo "✅ Environment variables synced"
fi

echo "🎉 Done: $OWNER/$REPO_NAME bootstrapped, protected, and linked to Vercel."
