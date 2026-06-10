# Connector and Deployment Checklist

Use this reference when the AthlynXAI task includes GitHub, Vercel, social publishing, podcast accounts, Suno, storage, database writes, or payment rails.

## Proof Before Action

| Rail | Safe proof | Do not do until approved |
|---|---|---|
| GitHub | `gh repo view`, branch, `git status`, `git diff --stat` | Push, force-push, merge, delete branch, change settings |
| Vercel | Team/project list, local `.vercel/project.json`, latest deployment status | Trigger deployment, change domains, print env values |
| Spotify for Creators | Confirm visible show dashboard and non-sensitive status | Publish episode, change show settings, upload final media |
| Suno | Confirm visible workspace/profile and plan label | Generate music if user is conserving credits or has not approved prompt |
| Social | Account/profile read, post list, insights read | Publish, comment, message, ad budget change |
| Storage | File metadata or small folder listing | Public sharing, deletion, bulk upload |
| Database | Schema metadata or read-only count | DDL, DML, migrations, exports |
| Stripe/payment | Account/product/price list | Charges, subscriptions, refunds, invoices |

## Pre-Commit Validation

Run these checks before pushing:

```bash
git status --short
git diff --stat
pnpm run build:vercel
```

Scan changed text files for secrets:

```bash
(git diff --name-only; git ls-files --others --exclude-standard) | sort -u | while read -r f; do
  [ -f "$f" ] || continue
  case "$f" in *.png|*.jpg|*.jpeg|*.mp4|*.webp|*.ico) continue;; esac
  grep -nE '(sk_live|sk_test|ghp_|ghu_|AKIA|SECRET_KEY|PRIVATE KEY|BEGIN RSA|password\s*=|api[_-]?key\s*=)' "$f" || true
done
```

If generated bundles create huge diffs, verify whether the repo expects generated bundles to be committed. If not, revert them before committing focused source changes.

## Closeout Format

```markdown
## Completed
- Repo:
- Branch:
- Commit:
- Build:
- Routes:

## Deployment
- Vercel URL or blocker:
- Verification evidence:

## Not touched
- Social posting:
- Email:
- Database/payment:
```
