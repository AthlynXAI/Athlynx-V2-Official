# OWNERSHIP_RUNBOOK.md — Athlynx Autonomous Operations

> **Owner:** Chad A. Dozier Sr. — Dozier Holdings Group
> **Last updated:** 2026-05-08
> **Purpose:** Single source of truth for how Athlynx runs itself, with zero
> dependency on any external agent (no Manus, no contractor logins). Every
> control listed here is owned by Chad's GitHub + Vercel + Stripe accounts.

---

## TL;DR — What's autonomous now

| Trigger | What happens | Where you see it |
|---|---|---|
| Push to `main` (web/api files) | Vercel deploys `athlynx.ai` automatically | Vercel dashboard |
| Push to `main` (mobile/** files) | iOS build runs on EAS → submitted to TestFlight | TestFlight push notification on your phone |
| Push to `main` (mobile/** files) | Android AAB built on EAS → submitted to Play Internal | Play Console + Slack alert |
| Any PR or push to `main` | CI Gate runs typecheck + lint + tests | GitHub PR checks |
| Any of the above fail | Slack alert fires | Slack channel via webhook |
| Daily 14:00 UTC | `daily-report` cron runs | Vercel cron logs |

Social auto-posting (the rogue Manus thing) is **off** — see "Social Posting Kill Switch" below.

---

## GitHub Actions workflows (all live in `.github/workflows/`)

1. **`ci-gate.yml`** — Strict pre-merge gate. Typecheck, lint, tests run on every PR
   and every push to main. Both web (root) and mobile (`mobile/`) are checked.
2. **`eas-ios-build.yml`** — Auto-build iOS + submit to TestFlight on push to main
   (only when `mobile/**` changes). Manual dispatch also supported.
3. **`eas-android-build.yml`** — Auto-build Android AAB + submit to Play Internal
   on push to main (only when `mobile/**` changes). Manual dispatch supported.
4. **`build-failure-alert.yml`** — Listens for failures of the three workflows
   above and posts a Slack alert via `SLACK_WEBHOOK_URL`.

---

## Required GitHub repo secrets

Add these under **Settings → Secrets and variables → Actions** (repo scope).
The build will fail loudly with a clear error message if any are missing.

### For mobile builds (iOS + Android)
| Secret | What it is | Where to get it |
|---|---|---|
| `EXPO_TOKEN` | Expo account token | https://expo.dev/accounts/[your-account]/settings/access-tokens |
| `ASC_API_KEY_P8` | Contents of `AuthKey_<KEY_ID>.p8` (the .p8 file body, paste verbatim) | Apple App Store Connect → Users and Access → Keys |
| `ASC_API_KEY_ID` | e.g. `5PTLU5B336` | Same screen as above |
| `ASC_API_KEY_ISSUER_ID` | e.g. `ba530e88-4441-4029-bc5a-853abab91a91` | Same screen as above |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full Play service account JSON (one line, paste verbatim) | Google Cloud Console → IAM → Service Accounts → Keys → Create JSON |

### For Slack alerts
| Secret | What it is | Where to get it |
|---|---|---|
| `SLACK_WEBHOOK_URL` | Incoming webhook URL for the `#builds` channel | Slack → Apps → Incoming Webhooks → Add to Workspace |

### For the web/api side (set in Vercel, not GitHub)
See "Vercel env vars" below.

---

## Vercel project — env vars you control

**Confirmed 2026-05-08:** `athlynx.ai` lives on the **AthlynxChad** Vercel team
(scope `chad-a-doziers-projects`), under the project **`athlynx-platform`**.
The production deployment has the full Stripe live + Nebius + Supabase +
Auth0 + Firebase + Twilio + AWS SES + OpenAI/Anthropic/Gemini env stack.

### Zombie projects on the same Vercel team (Manus residue)
These 5 projects exist on `chad-a-doziers-projects` but have **no env vars**
and are auto-deploying empty shells every hour. Safe to delete:
- `athlynx-v2`
- `athlynxai`
- `athlyxai`
- `athlyx`
- `athlynx`

Delete via Vercel dashboard → each project → Settings → Advanced → Delete.
Doing so will stop the noisy hourly build cron and reduce attack surface.

Required env vars (set in Vercel → Project → Settings → Environment Variables):

### Auth + payments
- `JWT_SECRET` — long random string, ≥ 32 chars
- `STRIPE_SECRET_KEY` — `sk_live_…` (Live mode)
- `STRIPE_WEBHOOK_SECRET` — `whsec_…` (from the Stripe webhook endpoint)
- `STRIPE_PRICE_*` — each price ID (see `server/stripe/products.ts` for the list)

### Database
- `DATABASE_URL` — Neon PostgreSQL connection string
- `ENCRYPTION_MASTER_KEY` — 32-byte hex for NIL contract encryption
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase realtime
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase server-side ops

### AI
- `GOOGLE_AI_API_KEY` — Gemini (primary brain)
- `NEBIUS_API_KEY` — Nebius H200 (fallback)
- `ANTHROPIC_API_KEY` — Claude (optional fallback)
- `OPENAI_API_KEY` — image gen + voice transcription

### Email / SMS
- `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`

### Cron protection
- `CRON_SECRET` — a long random string. Vercel cron sends this as a Bearer
  token, and `api/cron/*` endpoints require it.

### Social posting kill switch and communications doctrine
- `SOCIAL_POSTING_ENABLED=false` — **master OFF unless an owner-approved content package is being processed.**
  Social posts may be automated only once per approved media/caption/destination package, with duplicate blocking and platform-format checks.
  Email remains manual-send only after explicit owner approval.
- Permanent doctrine file: `ATHLYNXAI_COMMUNICATIONS_DOCTRINE.md`.

---

## Social posting kill switch

**Why this exists:** An external agent (Manus) wired up multiple auto-posting
paths to Buffer + Facebook + Instagram + X/Twitter + LinkedIn without owner
authorization. As of 2026-05-08, all of those paths are gated behind a single
master flag.

### Layers of defense (defense in depth)

1. **Vercel cron entries removed** — `vercel.json` no longer schedules the
   social-post cron. The 3x/day automatic posts are dead.
2. **`/api/cron/social-post` returns 410 Gone** — even if a cron is added back
   somewhere, the endpoint will not post anything.
3. **`SOCIAL_POSTING_ENABLED` env flag** — every tRPC posting mutation
   (`social.publishToBuffer`, `social.publishToLinkedIn`, `social.publishToAll`,
   `autoPost.postToAll`, `autoPost.generateAndPost`) checks this flag and
   throws `FORBIDDEN` if it's not `true`. Default = OFF.
4. **Hardcoded Buffer fallback token removed** — was previously baked into
   `server/routers/autoPostRouter.ts`. Now reads only from env.

### To run owner-approved social publishing

1. Confirm the exact content package: media asset, caption, destination list, account identity, and platform format.
2. Verify the content has not already been posted to the same destination.
3. Set `SOCIAL_POSTING_ENABLED=true` only for the approved run window.
4. Use the Social OS queue/worker or approved Social Command path to publish one time per approved destination.
5. **Set it back to `false` (or unset) afterwards** so nothing else can fire.
6. Do not send emails from automation. Drafts are allowed; final email sending requires explicit owner approval in the active session.

### Tokens to rotate (action items for owner)

- **Buffer access token** — old token `BUFFER_TOKEN_***REDACTED***…` was hardcoded in source
  (now removed). Rotate at https://publish.buffer.com/account/apps and put the
  new token only in Vercel env as `BUFFER_ACCESS_TOKEN`.
- **AWS IAM key `AKIA***REDACTED***`** — was hardcoded in `send_now.mjs`
  (now removed). Rotate in AWS IAM Console → Users → Your user → Security
  credentials → deactivate + delete the old key, create a new one, store it
  in Vercel as `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`.
- **VAPID keypair** — hardcoded fallback in `server/services/push-notifications.ts`.
  Generate a fresh pair (`npx web-push generate-vapid-keys`) and put both into
  Vercel as `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`.
- **EXPO_TOKEN** — the previously shared one was exposed in chat. Rotate at
  https://expo.dev/accounts/[your-account]/settings/access-tokens
- **Apple ASC API Keys (rotated 2026-05-08):**
  - `5PTLU5B336` (Manus's old EAS Build key) — REVOKED
  - `5CMS8586AG` (briefly leaked in chat) — REVOKED
  - `MT3P665D4W` (Athlynx GitHub Actions, current) — ACTIVE, .p8 stored only
    in GitHub Secrets as `ASC_API_KEY_P8`. Issuer ID
    `ba530e88-4441-4029-bc5a-853abab91a91`.

---

## How to deploy a fix end-to-end (no Manus)

1. Make the change (this Computer agent will edit + commit on a branch).
2. Open a PR to `main` on GitHub. CI Gate runs automatically.
3. When CI is green, merge.
4. Vercel auto-deploys the web/api side.
5. If `mobile/**` was touched, EAS iOS + Android workflows fire and submit to
   TestFlight + Play Internal automatically.
6. If anything fails, you get a Slack alert.

---

## Permanent checklist and blocker-escalation rule

Athlynx operating work must proceed from the active checklist only. Each checklist item may be marked only as **done**, **blocked awaiting Chad**, or **next**. Completed work stays closed unless live verification proves that it is broken, stale, missing, or no longer deployed.

The operating sequence is fixed: read or reconstruct the active checklist, mark completed items, identify the first unchecked item, execute that item only, save evidence, then report the result and the next unchecked item. No rabbit holes, circular revisits, duplicate work, or side quests are permitted unless Chad explicitly changes the checklist.

If any agent, cron, audit, connector worker, or automation hits a login, missing connector, permission block, missing file, unavailable server, unclear source of truth, failed authentication, or any other blocker, it must stop and ask Chad for help. It must not skip the item, silently downgrade it, mark it complete without evidence, or move to a different checklist item.

No task or checklist item may ever be left silently undone.

---

## Known major issues left to fix (from `audit/AUDIT_SUMMARY.md`)

These remain after the autonomy work in this PR. Each is its own follow-up.

1. **`profileRouter.ts` references 3 missing DB columns** (`recruitingVideos`,
   `filmRoomEnabled`, `totalVideoViews`) — every `profile.getProfile` call
   throws a Postgres error. Add the columns + a migration.
2. **`AthleteCard.tsx`, `HighlightReelStudio.tsx`, `AthletePublicProfile.tsx`,
   `Contact.tsx`** crash on load due to lucide-react icon imports that no
   longer exist. Replace with current icons.
3. **Marketplace `trpc.stripe.createProductCheckout` doesn't exist.** Either
   add the endpoint to `stripeRouter.ts` or change the page to use the
   existing `createSubscriptionCheckout` / `createCreditsCheckout`.
4. **`AthleteStore` checkout opens `mailto:`.** Wire it to Stripe Checkout.
5. **`mediaRouter.ts` returns a fake placeholder URL** when S3 is missing —
   should throw a clear error instead so users see "video upload misconfigured."
6. **No error monitoring.** Add Sentry (`@sentry/nextjs` or `@sentry/node`),
   then re-deploy.
7. **PlanetScale "failover" is broken** — uses `pg` driver against a MySQL URL.
   Either remove the dead code or rewrite with a real MySQL driver.
8. **34 TypeScript errors.** CI Gate now runs `tsc --noEmit`, so the next PR
   will surface them — fix them in priority order.

---

## Emergency stop

If you need to halt everything autonomous:

- **Kill auto-deploys to Vercel:** Vercel → Project → Settings → Git →
  Deployment Branches → toggle `main` off.
- **Kill auto mobile builds:** disable both `eas-ios-build.yml` and
  `eas-android-build.yml` workflows in GitHub → Actions → ⋯ menu.
- **Kill all social posting:** ensure `SOCIAL_POSTING_ENABLED` is unset in
  Vercel (already the default).
- **Kill outbound email:** do not approve any manual email send. Automated email sending is not permitted under the permanent communications doctrine.

---

## Contact / accountability

The autonomous pipeline is built so the owner (Chad) can go to bed, push code
in the morning, and have iOS + Android + web all redeploy in lock-step
without anyone else touching anything. No agent — Manus or otherwise —
should ever need write access to this repo, Vercel, Stripe, AWS, or Apple/
Play credentials. If anyone ever asks for those, the answer is no.
