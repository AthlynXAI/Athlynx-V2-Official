# AthlynX · The Athlete's Playbook

**ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.**

Production repository for the AthlynX platform — the unified identity, recruiting, NIL, brand, and content operating system for every athlete from youth to pro to post-career.

---

## Brand Lock

- **Palette:** cobalt `#1E90FF` + true black + white. No gold, yellow, or orange anywhere.
- **Header lockup:** AthlynX (white) + XAI (cobalt). Sub-tagline: THE ATHLETE'S PLAYBOOK.
- **Tagline:** ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
- **Signoff:** 
---

## Master Admin Doctrine

Locked May 29, 2026. Source of truth: [`client/src/governance.ts`](client/src/governance.ts).

| Person | Role | Access |
|---|---|---|
| Chad A. Dozier Sr. | Founder · CEO · Chairman · sole financial authority | Master Admin |
| Leronious (Lee) Marshall Jr. | V.P. Sales, Marketing & Partnerships · Co-Host | Full Admin · Partner & Team Member |
| Glenn M. Tse | CFO & COO | Full Admin · Partner & Team Member |
| Tony Locey | First Athlete Partner | Full Admin · Partner & Team Member |

All four: Unlimited Credits · Billing Exempt.

Server-side mirror: [`server/_core/adminAllowlist.ts`](server/_core/adminAllowlist.ts).
Database columns (Neon `users` table): `access_tier`, `partner_status`, `full_admin`, `unlimited_credits`, `billing_exempt`, `is_vip`.

---

## Production Lane

- **GitHub:** `AthlynXAI/Athlynx-V2-Official` → `main`
- **Vercel team:** AthlynxChad (`chad-a-doziers-projects`)
- **Project:** `athlynx-platform` (`prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU`)
- **Database:** Neon Postgres (production)
- **Identity:** `chaddozier75@gmail.com` (Master Admin only)

Vercel auto-deploys every push to `main`. No manual deploy step.

---

## Live Mirror Domains

athlynx.ai · athlynx.io · athlynx.net · athlynx.pro · nilportal.ai · nilgateway.com · nilgateway.org · nilportals.com · transferportal.live · transferportal360.com · dozierholdingsgroup.com

All routes resolve identically across every mirror.

---

## Key Routes

| Path | What it is |
|---|---|
| `/` | Seasonal Hero Strip + Road to Omaha |
| `/team` | Unified team profiles (TeamProfileCard with locked doctrine badges) |
| `/brackets` | MCWS + WCWS live bracket dashboard |
| `/brackets/mcws` | Men's College World Series live tracker (auto-routes 11a–5p CT during regional weekend) |
| `/brackets/wcws` | Women's College World Series live tracker |
| `/diamond-grind-iq` | Youth pitcher/catcher battery coach (COPPA-safe) |
| `/api/me/doctrine` | Server endpoint returning the signed-in user's doctrine flag block |
| `/api/doctrine` | The four canonical platform specs (Layer Cake · Sport Matrix · Autonomous OS · Quality Bar) |

---

## Local Development

```bash
npm install
npm run dev
```

Express + Vite on the same port. Drizzle ORM against Neon. TypeScript strict.

---

## Type-Check

```bash
npx tsc --noEmit
```

Must pass before every commit.

---

## Hackathon Track

[`athlynx-adk-agents/`](../athlynx-adk-agents) (separate repo) — two Google ADK multi-agent systems shipped May 29:

1. **AthlynX Recruiting Room** — 5 ADK agents (scout, nil_valuator, eligibility, outreach, parent_concierge)
2. **Diamond Grind IQ Battery Coach** — 5 ADK agents (coppa_guardian, pitch_smart, battery_iq, drill_selector, parent_concierge) with ordered COPPA + Pitch Smart safety gates

Devpost deadline: June 5, 2026 · 7:00 PM CDT.

---

## Lane Discipline

- **Production execution** (Manus): Stripe, Neon writes, Workspace admin, Cloud Run deploys
- **Code + content** (Perplexity Computer + Chad in unison): repo edits, brand, brackets, podcast, investor materials
- **Same source-of-truth file:** `client/src/governance.ts` — only Chad edits it.
- **Every commit:** authored by Chad A. Dozier Sr. `<chaddozier75@gmail.com>`

---

## DEAD LANES (never touch)

- `chaddozier-bot/*` repos
- `chaddozier75-bot/*` repos
- `AthlynXAI/AthlynXAI` (archived — dead)
- `chaddozier75-cmd/AthlynXAI-Launch-2026-14` (dead)
- `chaddozier75-cmd` (dead)
- Netlify (production runs on Vercel only)

---

## Session Doctrine (June 3, 2026 — standing until revoked)

- ✅ **ONLY push target:** `AthlynXAI/Athlynx-V2-Official` → `main`
- ✅ **Vercel auto-deploys** on every push to `main` under team `AthlynxChad`
- ❌ Never: `AthlynXAI/AthlynXAI`, `chaddozier-bot`, `chaddozier75-bot`, `chaddozier75-cmd`

---

****

— Chad A. Dozier Sr., Founder · CEO · Chairman, AthlynX
