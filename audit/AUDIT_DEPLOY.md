# AUDIT_DEPLOY.md — Build Pipeline & Deployment Configuration

> Audit date: May 2026 | All evidence cited by file:line

---

## Vercel Configuration

**File:** `vercel.json`

### Structure
- **Build command:** `npm run build:vercel` → runs `build-vercel.sh`
- **Output directory:** `dist/public`
- **Install command:** `pnpm install --no-frozen-lockfile`
- **Framework:** null (custom)

### API Entry Pattern
All `/api/*` requests rewrite to `/api/index.js` — a single Vercel serverless function.
```json
{ "source": "/api/:path*", "destination": "/api/index.js" }
```
The API function is bundled with esbuild via `build-vercel.sh` into `.vercel/output/functions/api/index.func/index.cjs`. This is the entire backend.

### Cron Jobs (vercel.json)
| Path | Schedule | Notes |
|------|----------|-------|
| `/api/cron/social-post` | `0 14 * * *` (2pm UTC) | Social media auto-post |
| `/api/cron/social-post` | `0 18 * * *` (6pm UTC) | Social media auto-post |
| `/api/cron/social-post` | `0 0 * * *` (midnight UTC) | Social media auto-post |
| `/api/cron/daily-report` | `0 14 * * *` (2pm UTC) | Daily admin report |

**Issue:** `/api/cron/social-post` posts 3x/day using a pre-built post library (not AI-generated). The Vercel cron path `/api/cron/social-post` is not protected by `CRON_SECRET` verification in the deployed `.js` files found in `api/cron/`. **Any public HTTP request to `/api/cron/social-post` will trigger a post.** (No auth check visible in `api/cron/social-post.js`.)

### Redirects
- `/transfer-portal-redirect` → `/transfer-portal`
- `/nil-portal-redirect` → `/nil-portal`
- `/dhg-redirect` → `/dhg`

---

## Build Script: build-vercel.sh

```bash
# Step 1: Clean previous build
# Step 2: npx vite build --config vite.vercel.config.ts
# Step 3: Create .vercel/output structure
# Step 4: Copy Vite output to .vercel/output/static
# Step 5: npx esbuild server/entry.ts --bundle --platform=node --target=node18 ...
# Step 6: Create .vc-config.json (runtime: nodejs22.x, maxDuration: 30)
# Step 7: Create config.json with routes
```

**Issues:**
1. The `esbuild` command targets `node18` but the `.vc-config.json` specifies `nodejs22.x`. Minor inconsistency but should not cause failures.
2. No error recovery — if any step fails, the entire build fails with `set -e`.
3. `--external:aws-sdk` excludes the old v2 SDK but the code uses `@aws-sdk/client-s3` (v3) — this should be fine.
4. `--define:import.meta.url=__filename` is a shim that may cause issues with modules that check `import.meta.url` for actual module resolution.

---

## GitHub Actions Workflows

**Directory:** `.github/workflows/`

### `eas-android-build.yml` (only workflow found)
- **Trigger:** `workflow_dispatch` only (manual)
- **Purpose:** Build Android AAB on Expo EAS; optionally submit to Google Play Internal Track
- **Required secrets:** `EXPO_TOKEN`
- **Optional secrets:** `GOOGLE_SERVICE_ACCOUNT_JSON` (only needed for Play submit)

**Issues:**
1. **No iOS CI workflow exists.** There is no `eas-ios-build.yml`. iOS builds must be triggered manually via EAS CLI.
2. **No web deployment workflow.** Vercel auto-deploys on `main` push (configured in `vercel.json`), but there's no GitHub Action to run tests before deploy.
3. **No pre-deploy smoke tests.** Zero automated test runs on PR or push.
4. **No staging environment.** Direct push to `main` → production deploy with zero buffer.
5. `google-service-account.json` is expected in `mobile/` for Play submission (see `eas.json`), but this file does not exist in the repo. The workflow handles this via env injection, but `eas.json submit` references `./google-service-account.json` as file path — this must be written at submit time (which the workflow does correctly).
6. `AuthKey_5PTLU5B336.p8` referenced in `eas.json` for iOS App Store submission does **NOT EXIST** in the repo. iOS app store submission will fail.

---

## Cron Jobs

### `/api/cron/social-post.js`
- Pre-compiled JavaScript in `api/cron/`
- Uses a `POST_LIBRARY` of pre-written social posts
- Posts to Buffer channels by channel ID
- **BUFFER_TOKEN** — this file uses a hardcoded BUFFER_ACCESS_TOKEN in the compiled output (inherited from `server/jobs/socialPostCron.ts` which has `const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN!;` — no fallback, will throw if env var missing, but the compiled `autoPostRouter.ts` fallback `kB3L...` may be embedded)

### `/api/cron/daily-report.js`
- Pre-compiled — sends daily admin summary
- Uses SES or SendGrid for delivery

### No CRON_SECRET Protection
The `CRON_SECRET` env var is defined but no cron handler verifies it. Any public request to `/api/cron/social-post` will trigger a post without auth. This could be abused.

---

## Wrangler Config

**File:** `wrangler.jsonc`  
A Cloudflare Workers config exists at root. Suggests the project was at some point intended for Cloudflare deployment as well. This conflicts with the Vercel deployment strategy. If both are active simultaneously, they would fight over the same DNS. **Verify this is not deployed to Cloudflare.**

---

## Build Pipeline Gaps

| Gap | Severity |
|-----|----------|
| No CI on PRs — TypeScript errors merge silently | HIGH |
| No auto-deploy verification (smoke test after Vercel deploy) | HIGH |
| No staging environment — `main` = production | HIGH |
| No iOS build CI workflow | HIGH |
| `AuthKey_5PTLU5B336.p8` missing — iOS App Store submit broken | BLOCKER |
| `google-service-account.json` missing from repo (correct — injected via CI secret) | OK |
| Cron endpoints not protected by CRON_SECRET | MEDIUM |
| wrangler.jsonc conflicts with Vercel config | MEDIUM |
| TypeScript errors (34 errors) not blocking build | HIGH |
| esbuild node18 target vs nodejs22.x runtime mismatch | LOW |
| `pnpm install --no-frozen-lockfile` means lockfile is advisory only | MEDIUM |

---

## Package.json Scripts (root)

Key scripts (from package.json inference):
- `build:vercel` — runs `build-vercel.sh`
- `dev` — starts Vite dev server
- No `test` script found that runs on CI

---

## .vercel/project.json

Vercel project is configured. Auto-deploy on `main` branch push is enabled (`"git": { "deploymentEnabled": { "main": true } }`).
