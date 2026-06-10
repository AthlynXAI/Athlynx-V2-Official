# Production QA Checklist — AthlynX

Short, opinionated production gate. Run before merging anything to `main` (which auto-deploys to Vercel via GitHub).

## Build / Type Gate

- [ ] `npm run build:vercel` — must pass cleanly. This is the exact command Vercel runs.
- [ ] `npm run check` — `tsc --noEmit` must pass.
- [ ] `npm test` — Vitest run, no regressions.

## Deploy Pipeline

- GitHub `main` → Vercel auto-deploys. There is no other authorized deploy path.
- Do **not** put Cloudflare proxy in front of `athlynx.ai` (DNS only — orange cloud OFF). Vercel handles SSL, CDN, edge.
- Secrets live in Vercel env vars only — never in source. Rotate via Vercel dashboard.

## Mobile / App Store Status

- **PWA:** live now on `athlynx.ai` (iOS + Android).
- **Google Play:** in progress. APK pipeline runs from `mobile/` via EAS. Internal testing pending APK upload.
- **Apple App Store:** deferred. Pending Apple Developer account enrollment (user action).

Do not advertise either native store as live until the listing is public.

## Copy / Trust Invariants

These have caused user-trust regressions before — keep them aligned:

- **Free trial:** Stripe checkout requires a card; user is **not charged for 7 days**. Public copy must say "card required, not charged until day 8" — never "no credit card needed."
- **Market size:** `$135B` for total Sports Tech TAM (by 2035, 21.9% CAGR). The ReverseFunnel investor copy uses `$47B` and is explicitly the **NIL sub-market** — keep it labeled that way.
- **AI engines:** 4 inference engines (Gemini, Claude, Nebius H200, OpenAI). Manus is the autonomous **build agent**, not a 5th model.
- **Demo data:** any named athlete on public pages (e.g. the Home leaderboard) must be labeled `DEMO` / `Sample` / `Illustrative example`.

## Sitemap

`client/public/sitemap.xml` is the canonical sitemap. It currently lists **218 public routes**. Admin / auth / personal / dashboard routes are intentionally excluded. When adding a new public route, add it to the sitemap in the same PR.

## User-Account Actions Required (cannot be done in code)

- Apple Developer account enrollment ($99/yr) — blocking Apple App Store submission.
- Google Play APK upload — blocking external testing release.
- Vercel env var sync — confirm Stripe / Auth0 / Nebius / Gemini / SendGrid keys are populated in production.
