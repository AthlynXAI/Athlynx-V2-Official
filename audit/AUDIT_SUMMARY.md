# AUDIT_SUMMARY.md — Production Readiness Executive Summary

> Audit date: May 2026 | Repo: Athlynx-V2-Official

---

## BLOCKERS — These Prevent the App from Working Today

1. **profileRouter.ts crashes on every athlete profile view** — The server router references 3 database columns (`recruitingVideos`, `filmRoomEnabled`, `totalVideoViews`) that do not exist in the schema. Every call to `profile.getProfile` throws a PostgreSQL error. The athlete profile — a core product feature — is broken server-side. (`server/routers/profileRouter.ts:56–58`)

2. **AthleteCard.tsx, HighlightReelStudio.tsx, AthletePublicProfile.tsx, Contact.tsx crash on load** — These pages import icons (`Instagram`, `Twitter`, `Youtube`) that were removed from lucide-react in a version update, and/or have duplicate import identifiers. They throw JavaScript errors on render. AthletePublicProfile also has a runtime crash when updating cover photos (`utils` not in scope).

3. **Marketplace product purchases return tRPC 404** — `client/src/pages/Marketplace.tsx` calls `trpc.stripe.createProductCheckout` which **does not exist** in `stripeRouter.ts`. Every Marketplace "Buy Now" click throws a tRPC procedure-not-found error. No product in the Marketplace can be purchased.

4. **AthleteStore checkout is a mailto link** — The store comment says "Real store. Real checkout." The implementation opens `mailto:cdozier14@athlynx.ai`. Zero Stripe integration. Not a real store.

5. **Video upload silently returns a broken placeholder URL when S3 is not configured** — `mediaRouter.ts` returns `{ publicUrl: "https://athlynx.ai/placeholder-video.mp4" }` with no error. This URL does not exist. Any athlete trying to upload a highlight reel silently gets a broken video URL saved to their profile.

6. **Sentry is now verified live, but production crash triage still needs routine review** — Perplexity lane confirmed production Vercel env vars (`SENTRY_DSN`, `VITE_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_TEST_TOKEN`), server/client init calls, and live traffic via Weekly Report on 2026-05-19. This removes the former "no monitoring" blocker; remaining work is operational review of Sentry issues.

7. **AWS IAM key `AKIA***REDACTED***` is hardcoded in `send_now.mjs:4`** — Live AWS credentials committed to source code. Must be rotated in IAM immediately regardless of whether this file is ever executed.

8. **Mobile app has NO push notifications** — No APNs (Apple) or FCM (Google) integration exists. The mobile notification tab polls for data via REST but no real-time mobile push delivery is implemented. The app cannot notify users of messages, recruiter views, or NIL deals in real time.

9. **iOS App Store submission is broken** — `mobile/eas.json` references `./AuthKey_5PTLU5B336.p8` for App Store submission. This file does not exist in the repo. iOS app store submission will fail at the `eas submit` step.

10. **PlanetScale "database failover" is non-functional** — The code claims a MySQL PlanetScale backup, but uses the PostgreSQL `pg` driver to connect to it. A MySQL connection string fed to `pg.Pool` either fails or misbehaves. The redundancy is fake.

---

## MAJOR ISSUES — Important But Not Immediately Fatal

1. **124 of 183 pages (68%) have zero tRPC calls** — They show static or hardcoded content. AthleteDashboard, NILMarketplace, RecruitingHub, Training, and Onboarding are all pure stubs — no real data.

2. **BrowseAthletes shows 12 hardcoded fake athletes** when the database has no real users. New deployments show fiction as real content.

3. **Fake agents, attorneys, advisors, and coaches throughout the platform** — AgentFinder, AthleteLegal, AthleteFinancial, AthleteHealth, AthleteCareer all show fabricated people with invented credentials as real platform data.

4. **connectionsRouter injects fake "seed coaches"** (IDs -1 through -4) into every coach search result, mixed with real users. Clicking a fake coach will produce errors.

5. **34 TypeScript errors** — Vite builds succeed anyway (esbuild doesn't type-check), so broken code ships silently.

6. **Stripe Starter plan price ID mismatch** — The header comment in `products.ts` and the actual hardcoded fallback value use different Stripe price IDs for the Starter monthly plan. If `STRIPE_PRICE_STARTER` is not set in Vercel, subscribers may be charged with the wrong price.

7. **LinkedIn and Facebook tokens expire in ~60 days** with no refresh mechanism. Social auto-posting will silently fail without notice.

8. **RankingsHub draft picks are entirely fake** — `MOCK_DRAFTS` constant, presented as live data.

9. **VAPID keys are hardcoded in source** (`push-notifications.ts:10–11`). Web push notifications use exposed key material.

10. **Cron endpoints have no CRON_SECRET verification** — Any public HTTP request to `/api/cron/social-post` will trigger an automated post to all social platforms.

11. **CommunitySoon.tsx email capture form does nothing** — The email is never sent to the server. It sets `joined = true` in local React state only.

12. **No CI/CD smoke tests or staging environment** — Every commit to `main` goes directly to production with no automated verification.

13. **Mobile `highlight-reel.tsx` tab is completely non-functional** — Shows hardcoded fake reels. No tRPC calls. No video upload.

14. **Mobile `scouting.tsx` tab has no API calls**.

15. **Buffer API token hardcoded in production source** (`autoPostRouter.ts:185`) — `"BUFFER_TOKEN_***REDACTED***"` is a live credential in git history.

---

## GREEN — What Actually Works and Is Production-Ready

1. **Stripe subscription checkout flow** — `createSubscriptionCheckout` and `createCreditsCheckout` in `stripeRouter.ts` are clean. Price IDs look like live-mode IDs. Webhook handler covers all major Stripe events.

2. **Authentication (Supabase Auth)** — Supabase Auth token verification via Google JWKS works without a service account file. Mobile auth via Supabase Auth is clean and TS-clean.

3. **Core AI features** — The LLM router (`server/_core/llm.ts`) is well-designed with Gemini → Claude → Nebius → OpenAI fallback chain. Gemini service is solid. Nebius service is solid with appropriate fallbacks. AI Training Bot, AI Recruiter, AI Content, AI Sales are all wired to real AI backends.

4. **Database schema** — 17 real tables with proper Drizzle ORM schema. Migrations exist. The schema is real, not a mock.

5. **NIL deal flow** — `nilRouter.ts` is clean, uses E2E encryption for contract data, real DB queries.

6. **Social feed + messenger** — Feed, posts, likes, comments, messenger conversations all hit real DB endpoints.

7. **CRM** — `crmRouter.ts` has 20 endpoints and is the most comprehensive router in the codebase. Real contacts, pipeline, activity log.

8. **Social auto-posting architecture** — The code for posting to Facebook, Instagram, Twitter, LinkedIn is properly implemented. If tokens are configured, this works.

9. **Mobile app TypeScript** — Zero TS errors. Mobile codebase is clean.

10. **Mobile core tabs** — Feed, NIL, Training, Messages, Notifications, Profile, Recruiting, TransferPortal all connect to real API endpoints via the mobile API library.

11. **EAS Android build CI** — The GitHub Actions workflow is correct and will build an Android AAB if `EXPO_TOKEN` is set.

12. **Build pipeline** — `build-vercel.sh` is functional. Single-function Vercel deployment pattern is correct.

13. **Drizzle migrations** — 5 migration files exist and cover the schema correctly (except for the 3 missing profile columns referenced in `profileRouter.ts`).

---

## Executive Summary

You paid a contractor $25,000 and got a platform that is perhaps 30–40% production-ready for its core athlete flow. The authentication, database schema, AI integrations, and Stripe subscription checkout are genuinely wired and would work in production if the right environment variables are set. The social feed, messenger, NIL deal tracking, training log, and CRM are real features.

However: 68% of the 183 web pages have zero backend connections. Many core pages that a new user would visit first — the AthleteDashboard, NILMarketplace, RecruitingHub, and Training page — show entirely hardcoded fake data. The athlete profile page is broken server-side (3 missing DB columns crash every profile query). The Marketplace's checkout button throws a tRPC 404 on every click. The AthleteStore checkout opens a mailto link. The mobile app has no push notifications. The iOS App Store submission file is missing. An AWS IAM key is hardcoded in source and must be rotated immediately. Sentry is now verified live as of 2026-05-19, so production crash visibility exists; the next requirement is routine issue triage and release-aware monitoring. The "PlanetScale failover database" uses the wrong driver and doesn't work.

**The app has never worked end-to-end because at least 3 of the 10 blockers above will stop a new user cold before they can complete a single meaningful action.** A focused engineering sprint of 2–3 weeks could fix the blockers and clear the major issues. The foundation is real — it just needs the stubs replaced with implementations.
