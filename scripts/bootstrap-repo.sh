#!/usr/bin/env bash
#
# bootstrap-repo.sh — apply branch protection + sync env vars to Vercel.
# Idempotent — safe to re-run.
# Requires: gh, vercel, jq

set -euo pipefail
set +x

REPO_OWNER="${REPO_OWNER:-AthlynXAI}"
REPO_NAME="${REPO_NAME:-Athlynx-V2-Official}"
BRANCH="${BRANCH:-main}"
ENV_FILE="${1:-.env.local}"

for cmd in gh vercel jq; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "❌ '$cmd' not found"; exit 1; }
done
gh auth status >/dev/null 2>&1 || { echo "❌ Run 'gh auth login' first"; exit 1; }

echo "▶ Applying branch protection to $REPO_OWNER/$REPO_NAME@$BRANCH..."
jq -n '{
  required_status_checks: {
    strict: true,
    contexts: [
      "Web — typecheck + lint + tests",
      "Mobile — typecheck",
      "No [skip ci] in PR commits",
      "STRICT — no yellow/amber/gold/orange anywhere in client/src"
    ]
  },
  enforce_admins: true,
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    require_code_owner_reviews: false,
    required_approving_review_count: 1,
    require_last_push_approval: false
  },
  restrictions: null,
  required_linear_history: true,
  allow_force_pushes: false,
  allow_deletions: false,
  required_conversation_resolution: true,
  lock_branch: false,
  allow_fork_syncing: true
}' | gh api -X PUT \
  "repos/$REPO_OWNER/$REPO_NAME/branches/$BRANCH/protection" \
  -H "Accept: application/vnd.github+json" --input - --silent \
  && echo "✅ Branch protection set."

if [ -f "$ENV_FILE" ]; then
  echo "▶ Syncing env vars from $ENV_FILE to Vercel..."
  while IFS= read -r line || [ -n "$line" ]; do
    [[ -z "${line// }" || "$line" =~ ^[[:space:]]*# ]] && continue
    KEY="${line%%=*}"
    VAL="${line#*=}"
    KEY="$(echo "$KEY" | xargs)"
    VAL="${VAL%\"}"; VAL="${VAL#\"}"
    VAL="${VAL%\'}"; VAL="${VAL#\'}"
    [ -z "$KEY" ] && continue
    for TARGET in production development preview; do
      printf '%s' "$VAL" | vercel env add "$KEY" "$TARGET" --force >/dev/null \
        && echo "  ✓ $KEY → $TARGET"
    done
  done < "$ENV_FILE"
fi
echo "🎉 Bootstrap complete."
