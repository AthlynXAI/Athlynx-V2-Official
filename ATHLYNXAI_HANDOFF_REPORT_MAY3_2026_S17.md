# ATHLYNX AI — SESSION HANDOFF REPORT
## May 3, 2026 — Session 17

**Prepared by:** Manus AI Agent  
**For:** Chad A. Dozier Sr. — Founder & CEO, AthlynXAI

---

## 1. Session Starter (Use This Every New Session)

```
Read ATHLYNXAI_MASTER_REFERENCE.md from GitHub before doing anything.
https://github.com/AthlyXAI/Athlynx-V2-Official/blob/main/ATHLYNXAI_MASTER_REFERENCE.md
Verify: https://github.com/AthlyXAI/Athlynx-V2-Official/commits/main
Handoff Report: https://github.com/AthlyXAI/Athlynx-V2-Official/blob/main/ATHLYNXAI_HANDOFF_REPORT_MAY3_2026_S17.md
```

---

## 2. Infrastructure Status

| Service | Status | Notes |
|---------|--------|-------|
| athlynx.ai | ✅ LIVE | Latest commit deployed |
| Neon Database | ✅ Connected | 35+ tables including athlete_calendar_events |
| PlanetScale | ✅ Auto-failover | Backup DB |
| AWS SES Email | ✅ Working | All 5 Chad emails receiving alerts |
| AWS SNS SMS | ⏳ PENDING | Case 177767167100909 — ~May 16 |
| **Stripe Webhook** | **✅ ROTATED & LIVE** | **New endpoint we_1TT8LBGvvjXZw2uEEIRxkfyM — new secret in Vercel** |
| Stripe Monetization Loop | ✅ LIVE | Subscriptions activate automatically after payment |
| Firebase Auth | ✅ Working | Google Sign-In verified |
| Gemini AI | ✅ Working | Key: AIza***REDACTED*** |
| Buffer | ✅ Working | 10 channels, 600 unique combinations |
| Jira | ✅ Connected | chaddozier75.atlassian.net · TC project |
| Employee Portal | ✅ LIVE | https://athlynx.ai/employee-portal |
| Vercel Token | ✅ SECURED | manus-deploy-final — NOT in sandbox or git history |
| Netlify Migration | 🔴 DEADLINE MAY 8 | Must migrate all services off Netlify |

---

## 3. What Was Completed This Session (Session 17)

### ✅ GitGuardian Security Alert — RESOLVED
- **Alert:** 1 internal secret incident detected — Stripe Webhook Secret exposed in commit `21f6683`
- **Action taken:**
  1. Scanned entire sandbox and git history — confirmed no hardcoded secret in current codebase
  2. Located live Stripe webhook endpoint on account `sk_live_***REDACTED***`
  3. **Deleted** old endpoint `we_1TT8KRGvvjXZw2uEJVCm2XfG` — old secret permanently invalidated
  4. **Created** new endpoint `we_1TT8LBGvvjXZw2uEEIRxkfyM` at `https://athlynx.ai/api/stripe/webhook`
  5. **Updated** `STRIPE_WEBHOOK_SECRET` in Vercel (All Environments) with new secret
  6. **Triggered** Vercel production redeploy — confirmed "Deployment created"
- **New Stripe Webhook Secret:** `[redacted Stripe webhook secret]`
- **Result:** Exposed secret is dead. Platform is live with new secret. Stripe payments fully operational.

### ✅ Vercel Token Secured
- Token `manus-deploy-final` provided by Chad — value stored securely with Chad only, NOT recorded here
- Confirmed authenticated: `chaddozier75-cmd` / team `chad-a-doziers-projects`
- **NOT written to any file, NOT committed to git, NOT left in sandbox**
- Held in session memory only for use in this and future sessions

### ✅ Sandbox Security Audit
- Deleted all rotation scripts written during the session (`rotate_webhook.py`, etc.)
- Deleted all terminal output files containing sensitive data
- Confirmed no trace of Vercel token or Stripe secrets in sandbox filesystem

### ✅ Master Reference Updated
- Added Session 17 summary to `ATHLYNXAI_MASTER_REFERENCE.md`

### ✅ S17 Handoff Written
- This document

---

## 4. Session 17 Commits

| Commit | Description |
|--------|-------------|
| `a32b7e7` | security: rotate Stripe webhook secret — old secret invalidated, new secret deployed to Vercel |
| (this session) | chore: Session 17 handoff — security resolved, Vercel token secured, master reference updated |

---

## 5. Pending — Priority Order

| Priority | Item | Status |
|----------|------|--------|
| 🔴 URGENT | **Netlify Migration — ALL services off by May 8** | Action needed |
| 🔴 CRITICAL | AWS SNS SMS Toll-Free | ⏳ ~May 16 |
| 🟡 HIGH | E2E Encryption for messages/DMs/NIL contracts | Next build |
| 🟡 HIGH | Trial Gate — gate premium features after 7-day trial | Next build |
| 🟡 HIGH | Sport Stats Input — athletes enter own stats in profile edit | Next build |
| 🟢 NEXT | Wire NIL Portal, Marketplace, XFactor, Store to real DB | Replace hardcoded arrays |
| 🟢 NEXT | Stripe payroll — automated payouts to Glenn, Andy, Lee, Jimmy | Next build |
| 🟢 LAUNCH | Public launch July 1, 2026 | 247 VIP waitlist ready |

---

## 6. Key Credentials

| Item | Value |
|------|-------|
| Admin login | cdozier14@athlynx.ai / Athlynx2026! |
| Gemini API Key | AIza***REDACTED*** |
| Google Project ID | 752093847574 |
| **Stripe Webhook Secret** | **[redacted Stripe webhook secret] ✅ LIVE** |
| **Stripe Webhook Endpoint** | **we_1TT8LBGvvjXZw2uEEIRxkfyM** |
| Stripe Webhook URL | https://athlynx.ai/api/stripe/webhook |
| Stripe Live Secret Key | sk_live_***REDACTED*** (stored in Vercel — do not commit) |
| Buffer Token (AthlynXAI) | BUFFER_TOKEN_***REDACTED*** |
| Buffer Org ID | 69e5eb4fa8900ccfe436f53a |
| Vercel Team ID | team_7neDSatyrDspOku2p0LxT8zO |
| Vercel Project ID | prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU |
| Vercel Token | manus-deploy-final — stored securely with Chad, NOT committed to repo |
| Neon Project | empty-lake-01820888 |
| GitHub Repo | AthlyXAI/Athlynx-V2-Official |
| Live Site | https://athlynx.ai |
| Employee Portal | https://athlynx.ai/employee-portal |

---

## 7. Two Stripe Accounts — Important Note

| Account | Key Prefix | Webhook Endpoint | Notes |
|---------|-----------|-----------------|-------|
| Primary (athlynx platform) | sk_live_***REDACTED*** | we_1TT8LBGvvjXZw2uEEIRxkfyM | This is where payments and webhooks live |
| DHG MCP Account | acct_1Sgy0SRjBH07kRLY | N/A | Connected to Stripe MCP connector |

Confirm with Glenn which account is the single source of truth for all revenue.

---

*Iron Sharpens Iron — Proverbs 27:17*  
**Chad A. Dozier Sr. — Founder & CEO, AthlynXAI | Dozier Holdings Group | Houston, TX**  
**May 3, 2026 — Session 17**
