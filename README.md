# AthlynX — Build 1

**The Athlete's Playbook** · One Platform. Every Tool. Unlimited Potential.

This is the single canonical codebase for the AthlynX ecosystem:

- 🌐 **Web** — [athlynx.ai](https://athlynx.ai) (Next.js 14 + Supabase)
- 📱 **iOS** — TestFlight build 1 (Expo Router + Supabase auth)
- 🤖 **Android** — Google Play Internal build 1 (Expo Router + Supabase auth)

## Stack

| Layer | Tech |
|---|---|
| Web | Next.js 14 App Router · React 18 · TypeScript strict · Tailwind |
| Mobile | Expo SDK 53 · Expo Router v4 · React Native 0.79 · TypeScript strict |
| Auth | Supabase Auth (Firebase fully removed) |
| Database | Supabase Postgres · Neon (PR previews) · Prisma |
| Hosting | Vercel (web auto-deploy on push to `main`) · EAS (mobile builds) |
| Monitoring | Sentry (web + mobile) |
| Connectors | GitHub · Vercel · Supabase · Stripe · Sentry · Pipedream · YouTube · Spotify · Vimeo · Google Drive · Google Cloud · AWS · Slack · Monday · Pipedrive · Calendly · Zoom · Fireflies · Superhuman · Outlook · Airtable · Confluence · Jira · Trello · DocuSign · Apple HealthKit |

## Doctrine (do not violate)

✅ **Push only to** `AthlynXAI/Athlynx-V2-Official` on `main`, authored by **AthlynxChad** (`chaddozier75@gmail.com`).
✅ Vercel team `AthlynxChad` (chad-a-doziers-projects) auto-deploys.
✅ Apple App Store / iCloud uses **`chad.dozier@icloud.com`** only.
✅ Google Play uses **`chaddozier75@gmail.com`** only.
✅ `chaddozier75-cmd` allowed only as the Vercel→GitHub deploy creator (never as commit author).

❌ Never push to `AthlynXAI/AthlynXAI` (archived), `chaddozier-bot`, `chaddozier75-bot`.
❌ No Firebase anywhere — Supabase auth only.
❌ No yellow/amber/gold/orange anywhere in client UI (cobalt/granite/electric-blue brand lock).

## Quick start

```bash
git clone https://github.com/AthlynXAI/Athlynx-V2-Official.git
cd Athlynx-V2-Official
cp .env.example .env.local      # fill from Google Drive secrets vault
pnpm install
pnpm dev                        # http://localhost:3000
```

## Project history

The pre-Build-1 codebase (Dec 2025 → Jun 9 2026) lives at
[`AthlynXAI/Athlynx-V2-Official-archived-2026-06-09`](https://github.com/AthlynXAI/Athlynx-V2-Official-archived-2026-06-09) (archived, read-only).

See `HANDOFF.md` for the full session protocol between Manus and Perplexity Computer.

---

© 2026 AthlynX AI Corporation · A Dozier Holdings Group Company · All Rights Reserved
