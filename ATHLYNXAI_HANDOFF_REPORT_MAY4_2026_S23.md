# ATHLYNX AI — HANDOFF REPORT
## Session 23 — May 4, 2026

---

## SESSION SUMMARY

**STRIPE FIXED + INFRASTRUCTURE UPGRADED + ALIGNABLE ADDED + INVESTOR MEETING LOGGED**

---

### 1. STRIPE — FULLY AUDITED & FIXED

**Account:** Athlynx AI Corporation (`acct_1SqfSOGvvjXZw2uE`)
**Keys in use:** `sk_live_***REDACTED***` (provided by Chad — correct account)

**What was fixed via Stripe API (LIVE — already applied):**

| Fix | Status |
|-----|--------|
| Webhook URL updated: `/api/stripe/webhook` → `/api/webhooks/stripe` | ✅ LIVE |
| Webhook ID: `we_1TT8LBGvvjXZw2uEEIRxkfyM` | ✅ LIVE |
| Webhook events expanded (added `payment_intent.payment_failed`) | ✅ LIVE |
| 8 duplicate products archived (old Athlete Starter/Pro/Elite/Credits) | ✅ LIVE |
| Bangladesh unauthorized sessions — signed out by Chad on device | ✅ DONE |

**Webhook code fix (committed this session):**
- `server/stripe/webhook.ts` now registers BOTH paths:
  - `/api/webhooks/stripe` (canonical — matches Stripe dashboard)
  - `/api/stripe/webhook` (legacy — backward compatible)
- Single shared `handleWebhook` function — no code duplication

**⚠️ VERCEL ENV VARS — MUST UPDATE MANUALLY:**
Go to: https://vercel.com/chad-a-doziers-projects/athlynx-platform/settings/environment-variables

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_***REDACTED***` |
| `STRIPE_WEBHOOK_SECRET` | `[redacted Stripe webhook secret]` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `mk_***REDACTED***` |

**Stripe Atlas Identity Verification (STILL PENDING — Chad must do this):**
- Stripe sent a verification email to `chaddozier75@gmail.com`
- **DO NOT open it in Gmail app or Spark** — opens in-app browser → fails
- **Open iPhone Mail → tap the link → it will open in Safari → verification succeeds**
- This completes the Atlas account setup for Athlynx AI Corporation

**Stripe Atlas Business Name:**
- Currently shows: "Athlynx AI Corporation"
- Legal name: "AthlynXAI Corporation"
- To update: Stripe Dashboard → Settings → Business details → Legal business name
- Note: `Account.modify()` cannot be called on your own account via API — must be done in dashboard

---

### 2. INFRASTRUCTURE PAGE — UPGRADED

**File:** `client/src/pages/Infrastructure.tsx`

**What changed:**
- **Nebius entry expanded** — full story: Llama 3.3 70B on H200 GPUs, $5K credits, 24/7 never stops, paired with Gemini + Meta
- **Google Gemini 2.5 Flash** — added as dedicated partner card (Primary AI Engine)
- **NVIDIA H200 GPUs via Nebius** — added as dedicated card with Nebius AI Discovery Award nomination
- **Siemon** — added as infrastructure partner: PAM4 optical transceivers (200G/400G/800G), fiber backbone for AI/HPC data centers — the physical connectivity layer that makes the Nebius GPU clusters possible
- **RunSun Cloud removed** — replaced by the more accurate Siemon + Gemini entries

---

### 3. FOUNDERS PAGE — ALIGNABLE ADDED

**File:** `client/src/pages/Founders.tsx`

**What changed:**
- Chad's card now shows **Alignable** button: `alignable.com/houston-tx/athlynx-ai-corporation`
- Chad's card now shows **LinkedIn** button
- Both open in new tab with proper external link icon
- All other team members unchanged

---

### 4. INVESTOR MEETING — JOSEPH DRAGONE

**Who:** Joseph Dragone — "Building in-public: Dossier" — LinkedIn investor
**How:** Commented on Chad's AthlynXAI LinkedIn post asking about pre-seed raise
**Meeting:** Friday, May 8, 2026 · 11:00am–12:00pm EST
**Link:** https://meet.google.com/nsh-tpdr-rqk
**Dial-in:** +1 216-755-4703 · PIN: 671 118 692#

**Pitch outline Joseph sent:**
- The Problem — 4-bullet NIL gap breakdown
- The Solution — 8-cell app grid (NIL Vault, Transfer Portal, Diamond Grind, AI Recruiter, Warriors Playbook, Messenger, Content Studio + 13 more)
- Market Opportunity — $4B+ · 500K+ athletes TAM · 35%+ CAGR
- Traction & Milestones
- Revenue Model — 4-stream (SaaS, Enterprise, Marketplace, Partnerships)
- Leadership — Chad A. Dozier Sr, Glenn M Tse, Andrew Kustes, Lee Marshall, Jimmy Boyd

---

### 5. APPLE BUSINESS MANAGER — NEXT SESSION

**Status:** 43 days left to verify (org will be deleted if not verified)
**Organization:** AthlynXAI Corporation (org ID: 149833785256532752)
**Verification method:** Domain validation for athlynx.ai
**Issue:** Domain TXT record not yet added to Cloudflare DNS
**Action for Session 24:** Add Apple BM verification TXT record to Cloudflare → athlynx.ai

**DHG Apple account:** Domain update deadline May 18, 2026 → reserved: dozierholdingsgroup.appleaccount.com

---

### 6. SECURITY — BANGLADESH BREACH

- **13 unauthorized sessions** from Bangladesh (IP: 103.124.180.126) on Athlynx AI Corporation Stripe account
- **RESOLVED:** Chad signed out all sessions from his iPhone
- **Recommendation:** Enable 2FA on Stripe if not already active
- **API keys:** The keys Chad provided (`sk_live_***REDACTED***`) are the correct live keys — rotate them in Vercel dashboard as a precaution

---

## CRITICAL RULES (NEVER BREAK)
- **NEVER run `manus-config save-config`** — it overwrites all connector settings
- Always push ALL code to GitHub before ending session
- Never change live site without explicit instruction

---

## WHAT TO DO NEXT SESSION (Session 24)

1. **Apple BM Domain Verification** — add Cloudflare DNS TXT record for athlynx.ai
2. **Stripe Atlas identity verification** — open email in Safari (not Gmail app)
3. **Stripe Atlas business name** — update to "AthlynXAI Corporation" in dashboard
4. **Vercel env vars** — update STRIPE_WEBHOOK_SECRET + STRIPE_SECRET_KEY in dashboard
5. **Joseph Dragone prep** — prepare investor one-pager for May 8 meeting
6. **Nebius AI Discovery Award** — watch for May 15 finalist announcement

---

*Iron Sharpens Iron — Proverbs 27:17*
*Chad A. Dozier Sr. — Founder & CEO, ATHLYNX AI*
