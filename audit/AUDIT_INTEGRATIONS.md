# AUDIT_INTEGRATIONS.md — External Service Integration Status

> Audit date: May 2026 | All evidence cited by file:line

---

## Integration Matrix

| Service | Files | Required Env Vars | Status | Evidence |
|---------|-------|-------------------|--------|---------|
| Stripe | `server/stripe/stripeRouter.ts`, `server/stripe/products.ts`, `server/webhook.ts` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | **LIVE — PARTIAL** | Price IDs use `GvvjXZw2uE` account pattern (live format, not test). Checkout sessions work. But `createProductCheckout` is called from Marketplace but **does not exist** in stripeRouter.ts |
| Nebius AI | `server/services/nebius.ts` | `NEBIUS_API_KEY` | **LIVE (if key set)** | Endpoint: `https://api.studio.nebius.ai/v1/`. Models: Llama-4-Maverick, Llama-3.3-70B, Llama-3.1-8B. Falls back to hardcoded score if API fails. No key = throws. |
| Gemini / Google AI | `server/services/gemini.ts` | `GOOGLE_AI_API_KEY` or `GEMINI_API_KEY` | **LIVE (if key set)** | Uses `@google/generative-ai` SDK. Default model: `gemini-2.5-flash`. |
| Anthropic Claude | `server/_core/llm.ts` | `ANTHROPIC_API_KEY` | **LIVE (if key set)** | Claude Opus 4 hard-coded as model string. No fallback if key missing — LLM router silently falls back to Gemini. |
| LLM Router | `server/_core/llm.ts` | Any of: `GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY`, `NEBIUS_API_KEY`, `OPENAI_API_KEY` | **LIVE — GEMINI PRIMARY** | If `GOOGLE_AI_API_KEY` set → Gemini. Claude fallback if `ANTHROPIC_API_KEY` set. Nebius third. OpenAI fourth. If **none** set → throws `"No AI API keys configured"` at line 231–235. |
| OpenAI | `server/_core/imageGeneration.ts`, `server/_core/voiceTranscription.ts` | `OPENAI_API_KEY` | **UNKNOWN** | Used for image gen and voice transcription only. No fallback for image gen (throws). Voice transcription falls back gracefully. |
| Neon Postgres | `server/db.ts` | `DATABASE_URL` | **LIVE (if URL set)** | Primary DB. Drizzle ORM over pg Pool. 17 tables. Falls back to PlanetScale if Neon fails. Returns `null` if both fail — routers then throw 500. |
| PlanetScale | `server/db.ts` | `PLANETSCALE_DATABASE_URL` | **CRITICAL BUG** | Listed as "backup" but PlanetScale is MySQL, not Postgres. The code uses `drizzle-orm/node-postgres` with a `pg.Pool` regardless of which URL is used. A MySQL URL passed to `pg.Pool` will either fail silently or corrupt queries. This is a false sense of redundancy. |
| AWS S3 | `server/routers/mediaRouter.ts`, `server/_core/storageProxy.ts` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` | **BROKEN IN PROD if keys missing** | When S3 not configured, returns `{ uploadUrl: null, publicUrl: "https://athlynx.ai/placeholder-video.mp4", fallback: true }`. This URL does not exist. All video uploads silently fail. |
| AWS SES | `server/services/ses.ts` (inferred from test files), `send_now.mjs` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | **PARTIALLY LIVE** | `send_now.mjs` has HARDCODED AWS key `AKIA***REDACTED***` at line 4. SES from-email is `cdozier14@athlynx.ai`. Server notifications use SendGrid as primary. |
| AWS SNS | `send_now.mjs` | Same AWS creds | **LIVE for SMS** | `send_now.mjs` sends SMS via SNS. `AWS_SNS_ORIGINATION_NUMBER` env var used elsewhere. |
| SendGrid | `server/_core/notification.ts` | `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_WELCOME_TEMPLATE_ID` | **LIVE (if key set)** | Primary email provider. Falls back gracefully (logs warning, doesn't throw). |
| Twilio | `server/services/twilio.ts` (inferred from env scan) | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_MESSAGING_SERVICE_SID` | **LIVE (if keys set)** | `send-test-sms.mjs` exists at root. No fallback if keys missing. |
| Firebase | `server/_core/firebaseAdmin.ts` | `FIREBASE_PROJECT_ID` (defaults to `"athlynxai"`) | **LIVE** | Uses Google JWKS endpoint for token verification — no service account file needed. Project ID hardcoded as `athlynxai`. Mobile app uses Firebase for auth. |
| Supabase | `server/services/supabase.ts`, `client/src/lib/supabase-realtime.ts` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | **UNKNOWN / BROKEN** | Client uses Supabase for realtime messaging + storage. Server has a Supabase client but it's unclear if it's the primary DB or just realtime. If `VITE_SUPABASE_URL` is not set in client build env, the realtime client will `createClient("", "")` and silently fail — real-time messages won't work. |
| Google Maps | `server/_core/map.ts` | `GOOGLE_MAPS_API_KEY` | **OPTIONAL** | Used for location features. Falls back to null if not set. |
| Twitter/X | `server/routers/autoPostRouter.ts` | `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET` | **CONFIGURED** | OAuth 1.0a signing implemented. Returns `{ success: false, error: "Twitter credentials not configured" }` if missing. |
| Facebook / Instagram | `server/routers/autoPostRouter.ts` | `FB_PAGE_ACCESS_TOKEN`, `FB_PAGE_ID`, `FB_PAGE_ID_2`, `IG_USER_ID` | **CONFIGURED** | Graph API v19.0 used. Returns error if tokens missing. IG posts require an image URL — uses `https://athlynx.ai/og-image.jpg` as fallback for text-only posts. |
| LinkedIn | `server/routers/autoPostRouter.ts` | `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN` | **CONFIGURED** | Returns error if missing. LinkedIn tokens expire — no refresh mechanism. |
| Buffer | `server/routers/autoPostRouter.ts:185`, `server/jobs/socialPostCron.ts` | `BUFFER_ACCESS_TOKEN` | **HARDCODED KEY** | **CRITICAL: Buffer token `BUFFER_TOKEN_***REDACTED***` is hardcoded in source as fallback.** This is a live credential in git. |
| Vexo Analytics | `mobile/app/_layout.tsx:25–45`, `mobile/contexts/AuthContext.tsx:3–9` | None (hardcoded URL) | **LIVE (mobile only)** | Fire-and-forget POST to `https://api.vexo.co/v1/init` and `identify`. No API key used. |
| Sentry | `server/entry.ts`, `client/src/main.tsx` | `SENTRY_DSN`, `VITE_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_TEST_TOKEN` | **LIVE — VERIFIED 2026-05-19** | Perplexity lane confirmed production Vercel env vars are present, `initServerSentry()` is wired in `server/entry.ts`, `initClientSentry()` is wired in `client/src/main.tsx`, and live Weekly Report traffic confirms Sentry is active. No install needed. |
| Apple APN / FCM | — | — | **NOT INTEGRATED** | Mobile app does NOT use APNs or FCM for push notifications. The web uses VAPID (web-push). Mobile notifications are not implemented at all. The `notifications.tsx` mobile tab calls `notificationsApi.getNotifications()` via REST but there is no mobile push delivery mechanism. |
| VAPID Web Push | `server/services/push-notifications.ts` | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | **HARDCODED KEYS** | Both VAPID keys are hardcoded as fallbacks: `BJoVuLS1...` (public) and `PpxF1_SZ...` (private). These are functional but anyone reading the repo can use them. |
| Expo EAS | `.github/workflows/eas-android-build.yml`, `mobile/eas.json` | `EXPO_TOKEN` (GitHub secret) | **CONFIGURED** | Build workflow exists. iOS submission config references `AuthKey_5PTLU5B336.p8` which does **NOT EXIST** in the repo. Google Play service account JSON also missing. |
| Google Play | `mobile/eas.json` | `GOOGLE_SERVICE_ACCOUNT_JSON` (GitHub secret) | **MISSING CREDENTIAL FILE** | `google-service-account.json` not present in `mobile/`. Submit will fail. |
| Gravatar | `server/routers/socialRouter.ts` (inferred) | `GRAVATAR_API_KEY` | **OPTIONAL** | Used for avatar sync. |
| Zapier MCP | `process.env.ZAPIER_MCP_TOKEN` | `ZAPIER_MCP_TOKEN` | **UNKNOWN** | Env var found in grep but no Zapier integration code was located in routers. May be unused. |
| Slack | — | — | **NOT INTEGRATED** | No Slack webhook or API calls found anywhere despite being listed in partner marketing. |

---

## Stripe Deep Dive

### Price IDs vs Live Account
`server/stripe/products.ts` — all price IDs follow the `price_1T...GvvjXZw2uE...` pattern. The account note says `acct_1SkhxSDWqFuLp4sz`. These look like **live-mode** Stripe price IDs (no `_test_` in the URL pattern).

**CRITICAL DISCREPANCY:** The file header lists these price IDs:
- `price_1TQalMGvvjXZw2uEAgeLldvx` (Free)
- `price_1TPlWnGvvjXZw2uERob8Jumv` (Starter monthly)

But the `STRIPE_PLANS` constant actually uses:
- `stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER ?? process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "price_1TTsfWGvvjXZw2uELibMJ9Wb"` — **different ID than the header comment.**

The header comment and actual code have different hardcoded fallback price IDs for Starter. If neither env var is set, the wrong price ID is used.

### Missing `createProductCheckout` Endpoint
`client/src/pages/Marketplace.tsx:274` calls `trpc.stripe.createProductCheckout.useMutation()`. This endpoint **does not exist** in `server/stripe/stripeRouter.ts`. Every Marketplace product purchase will throw a tRPC "procedure not found" error.

---

## Nebius Details
- **Endpoint:** `https://api.studio.nebius.ai/v1/`
- **Default model:** `meta-llama/Llama-3.3-70B-Instruct`
- **Fallback behavior:** If Nebius call fails (JSON parse error), returns hardcoded score object with `score: 75`, `tier: "High Major D1"`. Silent failure.
- **Key:** `NEBIUS_API_KEY` — no fallback, throws if missing.

---

## LLM Router Details
**File:** `server/_core/llm.ts`  
- **Primary:** Gemini 2.5 Flash (if `GOOGLE_AI_API_KEY` set)
- **Fallback 1:** Claude Opus 4 (if `ANTHROPIC_API_KEY` set)  
- **Fallback 2:** Nebius Llama-3.3-70B (if `NEBIUS_API_KEY` set)
- **Fallback 3:** OpenAI (if `OPENAI_API_KEY` set)
- **No keys set:** throws `"No AI API keys configured"` — all AI features break

---

## Database Details
**Tables (from `drizzle/schema.ts`):** 17 tables:
`users`, `athleteProfiles`, `posts`, `postLikes`, `postComments`, `conversations`, `conversationParticipants`, `messages`, `nilDeals`, `trainingLogs`, `transferPortalEntries`, `notifications`, `verificationCodes`, `waitlist`, `crmContacts`, `crmPipeline`, `activityLog`

**Missing columns referenced in code:**
`server/routers/profileRouter.ts:56–58` references `athleteProfiles.recruitingVideos`, `athleteProfiles.filmRoomEnabled`, `athleteProfiles.totalVideoViews` — **none of these columns exist in the schema.** This causes TypeScript errors AND runtime errors when the profile router queries these fields.

**PlanetScale "backup":**
The backup database is labeled PlanetScale (MySQL), but the connection code uses `drizzle-orm/node-postgres` with `pg.Pool`. A MySQL URL fed into a PostgreSQL driver will either fail to connect or behave unpredictably. **The failover is broken.**

**Seeding scripts in root:**
- `delete-all-users.mjs` — deletes ALL users, accessible without restrictions
- `check-db-cols.ts`, `check-db-raw.ts` — diagnostic scripts in root, should not be there

---

## Environment Variable Dependency Summary

### REQUIRED (no fallback — app breaks without these)
- `DATABASE_URL` — without this, the entire DB layer returns null and all data endpoints 500
- `STRIPE_SECRET_KEY` — Stripe router throws on every call
- `JWT_SECRET` — session cookies cannot be signed/verified (users can't stay logged in)
- `GOOGLE_AI_API_KEY` (or `ANTHROPIC_API_KEY` or `NEBIUS_API_KEY`) — at least one AI key required
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` — realtime features break silently

### REQUIRED FOR SPECIFIC FEATURES
- `STRIPE_WEBHOOK_SECRET` — webhook verification fails (subscription events not processed)
- `SENDGRID_API_KEY` — welcome emails don't send
- `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `AWS_S3_BUCKET` — video uploads return placeholder URLs
- `NEBIUS_API_KEY` — Nebius AI routes fail (X-Factor scoring, CRM enrichment)
- `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_PHONE_NUMBER` — SMS notifications break
- `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` — web push breaks (but hardcoded fallbacks exist)

### SHOULD BE ROTATED IMMEDIATELY (exposed in source)
- `AKIA***REDACTED***` — AWS Access Key ID in `send_now.mjs:4`
- `BUFFER_TOKEN_***REDACTED***` — Buffer access token in `server/routers/autoPostRouter.ts:185`
- `BJoVuLS1LQ...` — VAPID public key in `server/services/push-notifications.ts:10`
- `PpxF1_SZdi...` — VAPID private key in `server/services/push-notifications.ts:11`
