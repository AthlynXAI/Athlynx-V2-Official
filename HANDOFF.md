# AthlynX V2 — Full Project Handoff for Manus
**Generated:** Saturday, June 6, 2026 at 7:51 PM CDT
**Coverage window:** December 26, 2025 → June 6, 2026
**Owner:** Chad A. Dozier (AthlynxChad)
**Email:** chaddozier75@gmail.com
**GitHub login:** AthlynXAI (Pro plan)
**Canonical repo:** `AthlynXAI/Athlynx-V2-Official` (private)
**Branch:** `main`
**Live URL:** https://athlynx.ai
**Vercel team:** AthlynX (`team_7neDSatyrDspOku2p0LxT8zO`)
**Vercel plan:** Pro / Plus migration enabled

---

## 0. STANDING DOCTRINE (every session, every push, both platforms)

### ✅ Allowed
- Push only to `AthlynXAI/Athlynx-V2-Official` on `main`
- All commits authored by AthlynxChad (`chaddozier75@gmail.com`)
- Vercel team `AthlynX` (`team_7neDSatyrDspOku2p0LxT8zO`) auto-deploys
- Always return commit hash + Vercel deployment ID when READY

### ❌ Never push to
- `AthlynXAI/AthlynXAI` (archived)
- `chaddozier-bot`
- `chaddozier75-bot`
- `chaddozier75-cmd`

---

## 1. CO-EXECUTION PROTOCOL — Perplexity Computer × Manus

Operate as a tag team. Zero-fail, fully autonomous.

### Lane split
| Lane | Owner | Responsibilities |
|---|---|---|
| Code writing | **Manus** | Open PRs, run local builds (EAS, `pnpm check`, mobile), iterate on feature branches, drive Xcode/TestFlight |
| Gatekeeping | **Perplexity Computer** | Review CI, merge PRs, verify Vercel deploy = READY, run drift checks, audit secrets, own scheduled tasks, GitHub API operations |
| Shared | Both | Read/update `HANDOFF.md` at repo root, use commit `BASELINE_COMMIT_PLACEHOLDER` as the protection baseline, authenticate as `AthlynXAI` only |

### Handoff mechanism
- `HANDOFF.md` at repo root is the single source of truth.
- Both agents read it on session start, append to it on session end.
- No Slack relay. No manual paste between platforms.

### Conflict rule
- Doctrine wins. If either agent suggests violating Section 0, the other refuses.
- Branch protection (`enforce_admins: true`, required reviews, required checks) is the physical guarantee.
- For ambiguous judgment calls, tag the user in `HANDOFF.md` and wait.

### Drift monitoring
- Owned by Perplexity Computer (cron `51c2a509`).
- Fires weekdays 8 AM CDT (`0 13 * * 1-5` UTC, exact).
- Emails chaddozier75@gmail.com **only on drift** — silence = healthy.
- Will need DST adjustment Oct 31, 2026 (CST = `0 14 * * 1-5` UTC).
- Cancel via "stop the pre-standup check" or https://www.perplexity.ai/computer/tasks

---

## 2. PROJECT TIMELINE — DECEMBER 26, 2025 → JUNE 6, 2026

### December 2025 — Foundation
- **Dec 16, 2025:** AthlynX founded
- **Dec 28, 2025:** Vercel team `AthlynX` created (`team_7neDSatyrDspOku2p0LxT8zO`), team OWNER = `AthlynxChad`
- Stack established: React + Node.js + Python + Julia; Vercel hosting; Supabase / Neon Postgres; Sentry; Stripe; SendGrid; AWS S3/SES/SNS; Firebase auth bridge

### January – March 2026 — Platform build-out
- AthlynXAI repo (now archived) was the initial development repo
- Migration to `AthlynXAI/Athlynx-V2-Official` as the production codebase
- Domain portfolio acquired and deployed via Vercel: `athlynx.ai`, `athlynx.io`, `athlynx.net`, `athlynx.pro`, `nilportal.ai`, `nilgateway.com`, `nilgateway.org`, `nilportals.com`, `transferportal.live`, `transferportal360.com`, `dozierholdingsgroup.com`
- Project: `athlynx-platform` on Vercel — primary deployable

### April – May 2026 — Pre-launch builds
- Apr 27, 2026: Second Vercel team `Cdozier14` created for separate-billing workloads
- May 18, 2026: **Build 5 — "Fort Knox" Master Admin allowlist (PR #52)** — major security gate landed
- HANDOFF report cadence began — bots auto-generated `ATHLYNXAI_HANDOFF_REPORT_*.md` files (later cleaned up in Phase 2)

### Early June 2026 — Buffer token rotation
- **Jun 1, 2026:** Buffer token rotated (`bf0bd39`) — successful production deploy across all 11 attached domains. Source-of-truth commit for "last fully healthy deploy" prior to June 6 incident.

### June 6, 2026 — The Incident & The Fix (today)
Full session reconstruction below.

---

## 3. JUNE 6, 2026 — INCIDENT & RECOVERY

### Incident window
- **16:42–17:41 UTC (11:42 AM – 12:41 PM CDT):** ~15 production deploys failed in a 47-minute window
- All failed at the same line: `client/src/pages/XFactor.tsx:11:7`
- Error: `[vite:esbuild] Expected "as" but found "{"` — `errorCode: lint_or_type_error`
- Vercel notification emails (10+) flooded chaddozier75@gmail.com, collapsed into one Gmail thread `19e9dd51f905bde7`
- Initial commit that introduced the bug: `91c29b75` — "fix: resolve all CI TypeScript errors" — the auto-fix script inserted `import { Activity } from "lucide-react";` **inside** an open import block, breaking esbuild

### Email confusion (root cause Chad noticed first)
- **Failures** → from `notifications@vercel.com` (direct Vercel sender)
- **Successes on PRs/commits** → from `vercel[bot]` via `notifications@github.com` (GitHub integration bot)
- The user's "Cleanup/Archived Noise" Gmail label was silently archiving `notifications@github.com` mail, hiding success notifications while failures kept landing → perception of "no emails at all"

### Recovery sequence (all on `main`, all authored by AthlynxChad)

| SHA | PR | Title |
|---|---|---|
| `0f6ecc9e` | #108 | feat(branch-protection+scripts): enable main branch protection + add bootstrap-repo.sh |
| `2b1f365f` | #107 | fix(hygiene+mobile): remove 55 legacy HANDOFF reports, fix dual-entry mobile conflict |
| `391fdc65` | #106 (merge) | fix(hygiene+security): Phase 2-4 — kill commit-storm, untrack api bundles, security headers, keep-alive fail-closed |
| `db32cd82` | #106 | (squashed source of 391fdc65) |
| `c758f8f6` | #105 | fix(ci-gate, batches 2-5): resolve all 957 TypeScript errors → 0 |
| `4460d283` | #104 | fix(ci-gate, batch 1/N): resolve case collisions + App.tsx duplicate imports |

### Final state at 7:51 PM CDT
- **Latest production deploy:** `dpl_9zTHZEUFgcTxST3RhwUwmyr1kZfR` (READY, commit `BASELINE_COMMIT_PLACEHOLDER`, 00:44:11 UTC June 7)
- **Latest pre-recovery deploys for reference:**
  - `dpl_Ri49asa22UvFYJj58zoi5disLiyw` — READY, commit `391fdc65`, 00:10:01 UTC
  - `dpl_HQ9M6ST1FQTBj7Z9Zb2yJ8wU1i1L` — READY, commit `660ce75f`, 23:50:18 UTC
  - `dpl_HULP37aWo2q4qiw2UZPejwybFhpQ` — READY, commit `c758f8f6` (Phase 1 verification)

---

## 4. ALL COMPLETED PHASES (consolidated)

### PHASE 1 — TypeScript Build Errors (0 errors achieved)
- **Problem:** 962 TypeScript errors across 84 files preventing Vercel from building
- **PR #104 (`4460d283`):** Batch 1 — deleted 3 case-collision duplicate files + fixed 5 duplicate imports in `App.tsx`
- **PR #105 (`c758f8f6`):** Batches 2–5 — fixed all remaining 957 errors (missing imports, garbled icon names like `TrophyRocket` / `GraduationShieldCheck`, broken `useState` declarations, wrong prop types across 70+ page files)
- **Verification:** `pnpm run check` = 0 errors. `pnpm run build` = clean (40.66s)

### PHASE 2 — Repo Hygiene
- **PR #106 (`db32cd82` → merged `391fdc65`):**
  - Deleted `.github/workflows/session-handoff.yml` (was auto-committing `HANDOFF_*.md` every 5 minutes — commit storm)
  - Removed 85 bot-generated `HANDOFF_SERIES1_BUILD1_*.md` files
  - Deleted `.vercel-triggers/` directory
  - Untracked `api/index.js` and all `api/cron/*.js` build artifacts from git
  - Added api bundles to `.gitignore`
- **PR #107 (`2b1f365f`):**
  - Removed 55 additional legacy `ATHLYNXAI_HANDOFF_REPORT_*.md` files (Apr–May 2026)
  - Added `.gitignore` patterns to permanently block handoff report variants
  - Fixed stray `!api/index.js` negation in `.gitignore` that was overriding the ignore rule

### PHASE 3 — Security Headers
**PR #106 (`db32cd82`)** — added to `vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

All 6 headers verified live on https://athlynx.ai via curl.

### PHASE 4 — Keep-Alive Cron Hardening
**PR #106 (`db32cd82`):**
- Cadence changed from `*/5` to `*/30` (every 30 minutes)
- Auth changed from fail-open to fail-closed (returns HTTP 500 if `CRON_SECRET` env var is missing)

### PHASE 5 — Mobile iOS Crash Fix
**PR #107 (`2b1f365f`):**
- **Root cause:** `mobile/package.json` had `"main": "index.js"` pointing to a bare AppRegistry shell (`App.tsx` + `index.js`), while Expo Router file-based routing (`mobile/app/`) was also active. Dual-entry caused iOS SIGABRT crash on launch.
- **Fix:** Changed `"main"` to `"expo-router/entry"` (canonical Expo Router entry point)
- **Removed:** `mobile/App.tsx` and `mobile/index.js`
- **Kept:** `mobile/app/_layout.tsx` already wraps the full app tree in `<ErrorBoundary>`
- **Next step for Chad:** Run `eas build --platform ios --profile preview` and test on a real iPhone

### PHASE 6 — Branch Protection on `main`
**PR #108 (`0f6ecc9e`):**
- Branch protection enabled on `AthlynXAI/Athlynx-V2-Official/main` via `gh api` REST endpoint (after upgrading the `AthlynXAI` GitHub account from Free → Pro)
- Direct push to `main` is now BLOCKED (verified: push rejected with GH006)
- All merges must go through a PR with CI passing

**Branch protection baseline (commit `BASELINE_COMMIT_PLACEHOLDER`):**
- Required status checks: `Web — typecheck + lint + tests`, `Mobile — typecheck`
- `strict` (branch must be up-to-date): `true`
- `enforce_admins`: `true`
- `required_approving_review_count`: `1`
- `dismiss_stale_reviews`: `true`
- `required_linear_history`: `true`
- `allow_force_pushes`: `false`
- `allow_deletions`: `false`
- `required_conversation_resolution`: `true`

Also added `scripts/bootstrap-repo.sh` — utility for bootstrapping future repos with branch protection + Vercel env sync, plus the companion `protect-checks.sh` for adding required status checks after first CI run.

### PHASE 7 — Full 13-Route Smoke Test
All 13 core routes on https://athlynx.ai return HTTP 200:
- `/`, `/dashboard`, `/components`, `/infrastructure-manager`, `/diamond-grind`, `/nil`, `/signin`, `/brackets`, `/transfer-portal`, `/recruiting`, `/training`, `/athlete-card`, `/scouting`

---

## 5. REPO STATE SUMMARY (as of 7:51 PM CDT)

| Field | Value |
|---|---|
| Repo visibility | Private |
| GitHub plan | Pro |
| Branch protection | ACTIVE on `main` |
| TypeScript errors | 0 |
| Build status | Clean |
| Security headers | Live on https://athlynx.ai |
| Handoff files in git | 0 (all removed + gitignored) |
| `api/index.js` tracked | No (gitignored) |
| `session-handoff.yml` | Deleted |
| Mobile dual-entry conflict | Resolved |
| Latest production deploy | `dpl_9zTHZEUFgcTxST3RhwUwmyr1kZfR` (READY) |

---

## 6. EXISTING GITHUB ACTIONS WORKFLOWS

Currently in `.github/workflows/`:
- `build-failure-alert.yml`
- `ci-gate.yml` — owns the two required checks (`Web — typecheck + lint + tests`, `Mobile — typecheck`)
- `eas-android-build.yml`
- `eas-ios-build.yml`
- `lane-discipline.yml`
- `neon-pr-branches.yml`
- `run-db-migration.yml`
- `sync-connector-tokens-to-vercel.yml`
- `vimeo-video-flow.yml`

**Deleted (intentionally):**
- `session-handoff.yml` — was the source of the 5-minute commit storm

---

## 7. PENDING ACTIONS FOR CHAD (manual, cannot be done programmatically)

1. **TestFlight:** Run `eas build --platform ios --profile preview` and test on a real iPhone (not simulator) — **Manus owns this**
2. **Secret rotation:** Rotate `INTERNAL_ADMIN_TOKEN` in Vercel dashboard — **Chad owns this**
3. **Secret deletion:** Delete `VITE_INTERNAL_ADMIN_TOKEN` from Vercel dashboard — **Chad owns this**
4. **PAT revocation:** Revoke leaked PAT `ghp_xXBpyMEhhsQ...50y` at https://github.com/settings/tokens — **Chad owns this**
5. **Vercel env sync:** Run `scripts/bootstrap-repo.sh` locally to sync `.env` to Vercel production + development — **Manus owns this on Chad's laptop**

```bash
cd ~/Athlynx-V2-Official
vercel login                                          # one-time browser flow
vercel link --yes --project athlynx-platform
./scripts/bootstrap-repo.sh athlynx-platform --env-file .env
```

---

## 8. ACTIVE AUTOMATED MONITORING

**Pre-standup branch protection drift check** — scheduled task ID `51c2a509`
- **Cadence:** Weekdays 8:00 AM CDT (`0 13 * * 1-5` UTC, exact)
- **Next run:** Monday, June 8, 2026 at 8:00 AM CDT
- **Behavior:** Silent if healthy; emails chaddozier75@gmail.com only on drift
- **Checks each run:**
  1. All 9 baseline protection fields against commit `BASELINE_COMMIT_PLACEHOLDER`
  2. Last 24h workflow runs on `main` — flags skipped, cancelled, or `workflow_dispatch` overrides
  3. Commits on `main` in last 24h without an approved PR (admin-bypass detection)
- **DST flip:** Update Oct 31, 2026 to `0 14 * * 1-5` UTC

---

## 9. QUICK VERIFICATION COMMANDS (any future session, either agent)

```bash
# Confirm identity is AthlynXAI (NOT a bot account)
gh api user --jq '{login, email, plan: .plan.name}'
# Expected: login=AthlynXAI, email=chaddozier75@gmail.com, plan=pro

# Confirm branch protection still matches baseline
gh api repos/AthlynXAI/Athlynx-V2-Official/branches/main/protection \
  --jq '{contexts: .required_status_checks.contexts,
         strict: .required_status_checks.strict,
         enforce_admins: .enforce_admins.enabled,
         reviews: .required_pull_request_reviews.required_approving_review_count,
         linear: .required_linear_history.enabled,
         force_push: .allow_force_pushes.enabled,
         deletions: .allow_deletions.enabled,
         conv_res: .required_conversation_resolution.enabled}'

# Confirm latest commit chain on main
gh api 'repos/AthlynXAI/Athlynx-V2-Official/commits?sha=main&per_page=5' \
  --jq '.[] | "\(.sha[0:8])  \(.commit.author.name)  \(.commit.message | split("\n")[0])"'

# Confirm live security headers
curl -sSI https://athlynx.ai | grep -iE \
  '^(x-content-type|x-frame|x-xss|referrer-policy|permissions-policy|strict-transport)'

# Confirm latest Vercel production deployment
curl -sS -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?teamId=team_7neDSatyrDspOku2p0LxT8zO&limit=1&target=production" \
  | jq '.deployments[0] | {uid, state, created, commit: .meta.githubCommitSha[0:8]}'
```

---

## 10. KNOWN GOTCHAS (carry forward, do not relearn)

- `[skip ci]` in commit messages ONLY skips GitHub Actions workflows. It does NOT stop Vercel — Vercel listens to git push events, not commit message conventions. Every push to main triggers a Vercel deploy regardless.
- `UID` is a readonly bash variable on Linux — never use as loop variable or assignment target. Use `DEPLOY_ID` / `BUILD_ID` instead. Caused script failure during June 9 incident response.

- `vercel` npm package is blocked in some sandboxes (403 from registry) — fall back to direct REST against `api.vercel.com` using `$VERCEL_TOKEN`, `$HTTPS_PROXY`, and `$NODE_EXTRA_CA_CERTS`
- `api.vercel.com` is TLS-blocked in some sandboxes — must use `--cacert "$NODE_EXTRA_CA_CERTS" -x "$HTTPS_PROXY"` with curl
- `UID` is a readonly bash variable — never use it as a loop variable; use `DEPLOY_ID` instead
- Branch protection on private repos requires GitHub Pro ($4/mo). `AthlynXAI` upgraded June 6, 2026
- Rulesets API has the same Pro gate as classic branch protection on private repos — no free workaround exists short of making the repo public
- The Vercel MCP returns 403 for team-scoped operations — env sync must run from Chad's authenticated laptop
- Bot accounts (`chaddozier-bot`, `chaddozier75-bot`, `chaddozier75-cmd`) are never to touch the repo. Always verify `gh api user` returns `login: AthlynXAI` before any push
- "MCWS score updater" auto-commits (chore: auto-update scores) were a major source of failure spam during the June 6 incident — they do NOT carry `[skip ci]` while "session handoff" commits do. Consider adding `[skip ci]` to score updater commits if spam recurs
- **`[skip ci]` does NOT prevent Vercel deploys.** `[skip ci]` only skips GitHub Actions. Vercel's git integration listens to push events, not commit message conventions. Every push to `main` triggers a Vercel deploy regardless of `[skip ci]`. Confirmed by Perplexity Computer: PR #109 (`[skip ci]`) deployed as `dpl_H3E2tem4ZkPU6RM8s5pSmNCzHFik` 3 seconds after merge (2026-06-07 00:54:55 UTC).

---


## BASELINE UPDATE LOG

| Date | New baseline commit | Reason |
|---|---|---|
| 2026-06-06 | `0f6ecc9e` | Initial branch protection enabled (PR #108) |
| 2026-06-09 | `BASELINE_COMMIT_PLACEHOLDER` | Drift recovery — restored enforce_admins + 1 review + dismiss_stale + linear history; expanded required checks to 4 contexts (added `[skip ci]` guard + brand-color guard) |

## 11. PERPLEXITY COMPUTER SESSION CLOSE — June 6, 2026 8:11 PM CDT

**Author:** Perplexity Computer (gatekeeper lane)
**Verified against live repo at session close:**

| Check | Result |
|---|---|
| Identity = `AthlynXAI` / chaddozier75@gmail.com / Pro | ✅ |
| HEAD of `main` = `115ce941` (PR #109 merged) | ✅ |
| HANDOFF.md present at repo root (15,712 bytes, sha `5d63c78d`) | ✅ |
| PR #109 state = MERGED at 2026-06-07 00:54:52 UTC | ✅ |
| Branch protection 9 fields all match baseline `BASELINE_COMMIT_PLACEHOLDER` | ✅ |
| 6 security headers live on https://athlynx.ai | ✅ |
| Drift-check cron `51c2a509` armed for Monday 8 AM CDT | ✅ |

**Latest production deploy at session close:** `dpl_H3E2tem4ZkPU6RM8s5pSmNCzHFik` · READY · commit `115ce941` · 2026-06-07 00:54:55 UTC

---

**End of handoff. Both agents — start every session by reading this file.**
