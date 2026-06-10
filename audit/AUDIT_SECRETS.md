# AUDIT_SECRETS.md — Environment Variables & Hardcoded Secrets

> Audit date: May 2026

---

## CRITICAL: Hardcoded Credentials in Source Code

These must be rotated **immediately** regardless of whether env vars override them.

| Credential | Value (partial) | File:Line | Risk |
|------------|-----------------|-----------|------|
| AWS Access Key ID | `AKIA***REDACTED***` | `send_now.mjs:4` | **CRITICAL** — Live AWS IAM key in source. Anyone with repo access can use this key to send emails and SMS. Must rotate in AWS IAM now. |
| Buffer Access Token | `BUFFER_TOKEN_***REDACTED***` | `server/routers/autoPostRouter.ts:185` | **HIGH** — Live Buffer API token hardcoded as fallback. Anyone can post to all social channels. |
| VAPID Public Key | `BJoVuLS1LQ9afRTE3XO6ziEQBwIkxP8CyfgwHZeiwZUKrL9K8F4OG8J5ey0sgxQOu88njc2D-nARDqXWcWLlLnM` | `server/services/push-notifications.ts:10` | MEDIUM — Exposed key pair. Can be used to impersonate push notifications. |
| VAPID Private Key | `PpxF1_SZdiPg4hXFasUT4DtLwI38JyvshkMxhYMQeeo` | `server/services/push-notifications.ts:11` | MEDIUM — Same as above. Regenerate VAPID key pair. |

---

## AUTH Category

| Env Var | Used In | Required? | Notes |
|---------|---------|-----------|-------|
| `JWT_SECRET` | `server/_core/env.ts` | **REQUIRED** | Session cookie signing. Empty string fallback means sessions are signed with empty key — insecure but functional. Should be in Vercel. |
| `STRIPE_SECRET_KEY` | `server/stripe/stripeRouter.ts` | **REQUIRED** | Stripe router throws if empty. |
| `STRIPE_WEBHOOK_SECRET` | `server/webhook.ts` | **REQUIRED** | Webhook verification fails without this — subscription events not processed. |
| `SUPABASE_SERVICE_ROLE_KEY` | `server/services/supabase.ts` | REQUIRED for realtime | Server-side Supabase ops. Null client returned if missing. |

---

## DATA Category

| Env Var | Used In | Required? | Notes |
|---------|---------|-----------|-------|
| `DATABASE_URL` | `server/db.ts` | **REQUIRED** | Neon PostgreSQL. Without this, entire DB returns null. All data endpoints return 500. |
| `PLANETSCALE_DATABASE_URL` | `server/db.ts` | OPTIONAL | Supposed MySQL backup. **BROKEN** — MySQL URL fed to pg.Pool driver. Does not work as a real failover. |
| `ENCRYPTION_MASTER_KEY` | NIL contract encryption | REQUIRED for NIL | Without this, NIL contract encryption will use a default or fail. |
| `VITE_SUPABASE_URL` | `client/src/lib/supabase-realtime.ts` | REQUIRED for realtime | Client-side. If missing at build time, realtime features silently fail. |
| `VITE_SUPABASE_ANON_KEY` | `client/src/lib/supabase-realtime.ts` | REQUIRED for realtime | Same as above. |

---

## AI Category

| Env Var | Used In | Required? | Notes |
|---------|---------|-----------|-------|
| `GOOGLE_AI_API_KEY` | `server/services/gemini.ts`, `server/_core/llm.ts` | REQUIRED (primary AI) | Primary LLM. If none of the 4 AI keys are set, all AI breaks. |
| `GEMINI_API_KEY` | `server/_core/llm.ts` | OPTIONAL alias | Same as GOOGLE_AI_API_KEY — checked as fallback. |
| `NEBIUS_API_KEY` | `server/services/nebius.ts` | OPTIONAL (fallback AI) | Nebius AI. Throws if called directly without key. |
| `ANTHROPIC_API_KEY` | `server/_core/llm.ts` | OPTIONAL (fallback AI) | Claude Opus 4. Fallback. |
| `OPENAI_API_KEY` | `server/_core/imageGeneration.ts`, `server/_core/voiceTranscription.ts`, `server/_core/llm.ts` | OPTIONAL | Image gen throws if missing. Voice transcription falls back. |

---

## MESSAGING Category

| Env Var | Used In | Required? | Notes |
|---------|---------|-----------|-------|
| `SENDGRID_API_KEY` | `server/_core/notification.ts` | REQUIRED for email | Email delivery. Logs warning if missing but doesn't throw. |
| `SENDGRID_FROM_EMAIL` | `server/_core/notification.ts` | Optional | Defaults to `noreply@athlynx.ai` |
| `SENDGRID_WELCOME_TEMPLATE_ID` | `server/_core/notification.ts` | Optional | Welcome email template |
| `TWILIO_ACCOUNT_SID` | SMS service | REQUIRED for SMS | No fallback |
| `TWILIO_AUTH_TOKEN` | SMS service | REQUIRED for SMS | No fallback |
| `TWILIO_PHONE_NUMBER` | SMS service | REQUIRED for SMS | No fallback |
| `TWILIO_MESSAGING_SERVICE_SID` | SMS service | OPTIONAL | Messaging service SID |
| `AWS_SNS_ORIGINATION_NUMBER` | SNS service | OPTIONAL | SNS SMS origination |
| `SES_FROM_EMAIL` | SES service | OPTIONAL | Defaults to configured |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` | SMTP fallback | OPTIONAL | SMTP config for email |
| `ETHEREAL_API_KEY` | Dev email testing | OPTIONAL dev-only | |
| `BUFFER_ACCESS_TOKEN` | `server/routers/autoPostRouter.ts:185` | OPTIONAL | **Has hardcoded fallback — rotate immediately** |
| `FB_PAGE_ACCESS_TOKEN` | Facebook/IG posting | REQUIRED for social | |
| `FB_PAGE_ID` | Facebook posting | REQUIRED for social | |
| `FB_PAGE_ID_2` | Facebook posting (page 2) | OPTIONAL | |
| `IG_USER_ID` | Instagram posting | REQUIRED for IG | |
| `TWITTER_API_KEY` | Twitter posting | REQUIRED for Twitter | |
| `TWITTER_API_SECRET` | Twitter posting | REQUIRED for Twitter | |
| `TWITTER_ACCESS_TOKEN` | Twitter posting | REQUIRED for Twitter | |
| `TWITTER_ACCESS_SECRET` | Twitter posting | REQUIRED for Twitter | |
| `LINKEDIN_ACCESS_TOKEN` | LinkedIn posting | REQUIRED for LinkedIn | **LinkedIn tokens expire ~60 days. No refresh mechanism.** |
| `LINKEDIN_PERSON_URN` | LinkedIn posting | REQUIRED for LinkedIn | |

---

## MOBILE Category

| Env Var | Used In | Required? | Notes |
|---------|---------|-----------|-------|
| `EXPO_TOKEN` | `.github/workflows/eas-android-build.yml` | REQUIRED for builds | GitHub Actions secret |
| `GOOGLE_PLAY_ACCOUNT` | EAS submit | OPTIONAL | See eas.json |
| `EAS_APP_PACKAGE` | EAS | OPTIONAL | |
| `VITE_APP_ID` | Client identity | Optional | Defaults to `"athlynx"` |
| `VITE_OAUTH_PORTAL_URL` | Auth redirect | OPTIONAL | |

---

## MONITORING Category

| Env Var | Used In | Required? | Notes |
|---------|---------|-----------|-------|
| (NONE) | — | — | **No monitoring service (Sentry, Datadog, etc.) is integrated.** Production errors are invisible. |
| `CRON_SECRET` | Listed in env scan | OPTIONAL | Cron endpoint protection — **not actually verified in cron handlers** |

---

## INFRASTRUCTURE Category

| Env Var | Used In | Required? | Notes |
|---------|---------|-----------|-------|
| `AWS_ACCESS_KEY_ID` | S3, SES, SNS | REQUIRED for file uploads | |
| `AWS_SECRET_ACCESS_KEY` | S3, SES, SNS | REQUIRED for file uploads | |
| `AWS_REGION` | AWS services | Optional (defaults `us-east-1`) | |
| `AWS_S3_BUCKET` (inferred as `AWS_S`) | S3 upload | REQUIRED for file uploads | |
| `AWS_CLOUDFRONT_URL` | CDN URLs | OPTIONAL | |
| `VAPID_PUBLIC_KEY` | Web push | OPTIONAL | Hardcoded fallback exists |
| `VAPID_PRIVATE_KEY` | Web push | OPTIONAL | Hardcoded fallback exists |
| `FIREBASE_PROJECT_ID` | Firebase auth | Optional (defaults `athlynxai`) | |
| `GOOGLE_MAPS_API_KEY` | Location features | OPTIONAL | |
| `GRAVATAR_API_KEY` | Avatar sync | OPTIONAL | |
| `ZAPIER_MCP_TOKEN` | Zapier | OPTIONAL | No Zapier code found — may be unused |

---

## STRIPE PRICE IDs

All these should be set in Vercel or the hardcoded fallback price IDs will be used (which may be correct live IDs, but is risky):

| Env Var | Hardcoded Fallback | Match header comment? |
|---------|-------------------|----------------------|
| `STRIPE_PRICE_FREE` | `price_1TQalMGvvjXZw2uEAgeLldvx` | YES |
| `STRIPE_PRICE_STARTER` / `STRIPE_PRICE_STARTER_MONTHLY` | `price_1TTsfWGvvjXZw2uELibMJ9Wb` | **NO** — header says `price_1TPlWnGvvjXZw2uERob8Jumv` |
| `STRIPE_PRICE_STARTER_YEARLY` | `price_1TTsfWGvvjXZw2uEzVAxheFn` | Not in header |
| `STRIPE_PRICE_PRO` / `STRIPE_PRICE_PRO_MONTHLY` | `price_1TSbsrGvvjXZw2uENz7ZGGud` | YES |
| `STRIPE_PRICE_PRO_YEARLY` | `price_1TSbssGvvjXZw2uE1vgkuxQy` | YES |
| `STRIPE_PRICE_ELITE` | `price_1TSbstGvvjXZw2uERYqPeuTR` | YES |
| `STRIPE_PRICE_ELITE_YEARLY` | `price_1TSbsuGvvjXZw2uEE2GpcYXs` | YES |
| `STRIPE_PRICE_CHAMPION` | `price_1TRP8fGvvjXZw2uEkSzl2zwi` | YES |
| `STRIPE_PRICE_CHAMPION_YEARLY` | `price_1TTsfXGvvjXZw2uEzXkt98rb` | Not in header |
| `STRIPE_PRICE_MVP` | `price_1TRP8hGvvjXZw2uEeZcjmeaD` | YES |
| `STRIPE_PRICE_MVP_YEARLY` | `price_1TTsfXGvvjXZw2uEVobXl6mO` | Not in header |
| `STRIPE_PRICE_PRO_TEAMS` | `price_1TTaLGGvvjXZw2uE1SEgjs9h` | Not in header |
| `STRIPE_PRICE_PRO_TEAMS_YEARLY` | `price_1TTaLIGvvjXZw2uEsFcEfdWF` | Not in header |
| `STRIPE_PRICE_CREDITS_100` | `price_1TPlWvGvvjXZw2uETBtpFhqU` | YES |
| `STRIPE_PRICE_CREDITS_500` | `price_1TPlWxGvvjXZw2uEW8Ww1qi1` | YES |
| `STRIPE_PRICE_CREDITS_1000` | `price_1TPlWyGvvjXZw2uET83zN0aZ` | YES |

**Stripe Starter monthly price ID mismatch is the biggest concern** — if subscriptions are being created with the wrong price ID, users may be charged at the wrong rate or in test mode.

---

## Additional Observations

1. `OWNER_PHONE` — used in notifications, hardcoded to `+16014985282` in `send_now.mjs`.
2. `OWNER_OPEN_ID` — used as admin identity check. If not set, owner identity fails.
3. `OWNER_EMAIL` — defaults to `cdozier14@athlynx.ai` in code. OK.
4. LinkedIn tokens expire every ~60 days and there is no refresh mechanism. Social posting to LinkedIn will silently fail after token expiry.
5. Facebook Page long-lived tokens expire after 60 days unless refreshed. No refresh mechanism in codebase.
