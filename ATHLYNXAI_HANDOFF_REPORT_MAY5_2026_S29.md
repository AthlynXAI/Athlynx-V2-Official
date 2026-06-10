# ATHLYNX AI — HANDOFF REPORT
## Session 29 — May 5, 2026
---
## SESSION SUMMARY
**TRIPLE AI ENGINE + FULL PROFILES + MEDIA INTEGRATION (YouTube/Spotify/CapCut)**

---

### 1. TRIPLE AI ENGINE STACK — UPGRADED ✅

| Layer | Engine | Model | Purpose |
|-------|--------|-------|---------|
| **Layer 1** | Google Gemini | gemini-2.5-flash | Primary — fastest, sports AI |
| **Layer 2** | Anthropic Claude | claude-opus-4-5 | Deep reasoning, contract analysis |
| **Layer 3** | Nebius Llama | Llama-3.3-70B on H200 | Always-on fallback |

**Files changed:**
- `server/_core/llm.ts` — Rebuilt with `Engine` type, Claude native API integration, `invokeClaudeDirectly()` export
- `server/_core/env.ts` — Added `ANTHROPIC_API_KEY` env var
- `server/routers/aiRouter.ts` — Added `claudeChat` endpoint with 5 task types

**Claude task types:**
- `contract_review` — NIL contract attorney AI
- `nil_analysis` — Deal valuation & brand strategy
- `legal_guidance` — Eligibility, transfer, NCAA compliance
- `academic_planning` — GPA, eligibility, course planning
- `general` — Deep reasoning for any athlete question

**To activate Claude:** Add `ANTHROPIC_API_KEY` to Vercel environment variables.
Without the key, Claude requests automatically fall back to Gemini (zero downtime).

---

### 2. FULL ATHLETE PROFILES — MEDIA INTEGRATION ✅

**New fields added to `athlete_profiles` table:**
- `spotifyUrl` — Athlete playlist / podcast
- `capcutUrl` — CapCut highlight reel link

**Files changed:**
- `drizzle/schema.ts` — Added `spotifyUrl`, `capcutUrl` columns
- `server/routers/profileRouter.ts` — Added to select, input schema, and update data

**Profile.tsx — New tabs added:**
- **🎬 Media tab** — YouTube, Spotify, CapCut, Hudl cards with live links
- **🧠 Claude AI tab** — Direct Claude interface with task type selector

**Edit form — New social links:**
- Spotify playlist URL
- CapCut highlight reel URL

---

### 3. WHAT TO DO NEXT SESSION (Session 30)

1. **Add `ANTHROPIC_API_KEY` to Vercel** — Go to Vercel Dashboard → athlynx-platform → Settings → Environment Variables → Add `ANTHROPIC_API_KEY` with your Anthropic API key
2. **Run DB migration** — The new `spotifyUrl` and `capcutUrl` columns need to be added to the live database. Run: `pnpm drizzle-kit push` or add columns manually via Neon console
3. **Test Claude AI tab** — Sign in at athlynx.ai → Profile → 🧠 Claude AI tab
4. **Test Media tab** — Sign in → Profile → 🎬 Media tab → Edit Profile to add YouTube/Spotify/CapCut links
5. **Joseph Dragone meeting** — May 8, 11am EST — Google Meet: https://meet.google.com/nsh-tpdr-rqk
6. **Nebius finalist** — May 15, 9am CST

---

### 4. DB MIGRATION NEEDED

The following columns are NEW and need to be added to the live `athlete_profiles` table:

```sql
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS "spotifyUrl" text;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS "capcutUrl" text;
```

Run this in the Neon console or via `pnpm drizzle-kit push`.

---

## CRITICAL RULES
- **NEVER run `manus-config save-config`** — disables all connectors
- DNS for athlynx.ai → **Vercel only. Never Cloudflare.**
- Deploy pipeline → **Manus → GitHub → Vercel**
- Stripe → **AthlynXAI Corporation only (`acct_1SqfSOGvvjXZw2uE`)**
- Always push ALL code to GitHub before ending session

---
*Iron Sharpens Iron — Proverbs 27:17*
*Chad A. Dozier Sr. — Founder & CEO, ATHLYNX AI*
