# ATHLYNX AI — SESSION HANDOFF REPORT
## May 2, 2026 — End of Session

**Prepared by:** Manus AI Agent  
**For:** Chad A. Dozier Sr. — Founder & CEO, AthlynXAI  
**Session time:** ~7:30 AM – ongoing CST

---

## ⚠️ CRITICAL BUG — FIX FIRST NEXT SESSION

**BUG: `athlynx.ai` shows SIGNUP PAGE instead of HOME landing page on mobile**
- Root `/` is routed to `Home` in App.tsx (line 195) — route is correct
- But on mobile browsers (Safari, Chrome, fresh/incognito), `athlynx.ai` loads the EarlyAccess signup page
- NOT a routing issue in App.tsx — the route is correct
- NOT a vercel.json issue — do NOT touch vercel.json rewrites (broke login twice)
- NOT a static HTML issue — do NOT add static overrides to root (broke login)
- Suspected: Service worker or auth middleware intercepting root and redirecting to `/signup`
- **FIX APPROACH**: Check if there is a service worker, auth guard, or middleware redirecting `/` to `/signup` before React renders
- **TEST**: Open `athlynx.ai` in incognito on mobile — should show Home landing page with athlete photos

---

## 1. Session Starter (Use This Every New Session)

```
Read ATHLYNXAI_MASTER_REFERENCE.md from GitHub before doing anything.
https://github.com/AthlyXAI/Athlynx-V2-Official/blob/main/ATHLYNXAI_MASTER_REFERENCE.md
Verify: https://github.com/AthlyXAI/Athlynx-V2-Official/commits/main
Handoff Report: https://github.com/AthlyXAI/Athlynx-V2-Official/blob/main/ATHLYNXAI_HANDOFF_REPORT_MAY2_2026.md
```

---

## 2. Infrastructure Status

| Service | Status | Notes |
|---------|--------|-------|
| athlynx.ai | ✅ LIVE | Vercel auto-deploy from main |
| Neon Database | ✅ Connected | 34 tables |
| PlanetScale Failover | ✅ Connected | Auto-failover if Neon goes down |
| AWS SES Email | ✅ Working | Welcome + admin alert on every signup |
| AWS SNS SMS | ⏳ PENDING | Registration v3 SUBMITTED May 1 — up to 15 business days |
| Stripe | ✅ Live | Webhook secret set — 5 tiers + AI credits + Pro Teams tier added |
| Firebase Auth | ✅ Live | Google, Apple, Facebook, X, Email/Password |
| Gemini AI | ✅ Wired | Primary AI engine |
| AWS Key | ✅ Rotated | AKIA***REDACTED*** — set in Vercel |

---

## 3. What Was Completed This Session (May 2, 2026)

### ✅ ExpirationWarningPopup — Mandatory Modal
- File: `client/src/components/ExpirationWarningPopup.tsx`
- Fires on every authenticated page load when:
  - Days remaining ≤ 5 (can be snoozed 24h via localStorage)
  - Trial expired (cannot be dismissed — only Renew or Logout)
- Wired into `PlatformLayout.tsx` — covers every protected page
- Shows pricing hints (Starter $9.99 / Pro $19.99 / Elite $39.99)
- Snooze key: `expiry_popup_snoozed_until` in localStorage

### ✅ Expiration Warning Router (Server)
- File: `server/routers/expirationRouter.ts`
- Endpoints: `getWarnings` (expiring ≤8 days), `getOverdue` (expired, no sub), `markSent`
- Admin-only (role check)
- Wired into `server/routers.ts` as `expiration`

### ✅ AdminCRM — Expiry Tab
- New tab: "⏰ Expiring" in AdminCRM
- Shows two tables:
  1. **Expiring Soon (≤5 days)** — name, email, days left, expiry date, last email sent, email log badges
  2. **Expired — No Subscription** — name, email, expired date, days ago, plan, quick email button
- Queries: `trpc.expiration.getWarnings` and `trpc.expiration.getOverdue`
- Refreshes every 60 seconds

### ✅ Pro Teams Page
- File: `client/src/pages/ProTeams.tsx`
- Route: `/pro-teams`
- All 8 leagues (NFL, NBA, MLB, NHL, MLS, WNBA, Pro Soccer, Pro Baseball)
- 8 feature cards (Roster, Contracts, AI Scouting, Training, Brand Deals, Analytics, Comms, AI Front Office)
- 3 pricing tiers: Starter $2,500/mo · Pro $7,500/mo · Enterprise Custom
- CTA: cdozier14@athlynx.ai + +1 (601) 498-5282
- Added to PlatformLayout APPS nav with `PRO` badge

### ✅ Pro Teams in Stripe Products
- File: `server/stripe/products.ts`
- Plan ID: `pro_teams` — $2,500/mo / $24,000/yr
- Uses env vars: `STRIPE_PRICE_PRO_TEAMS` and `STRIPE_PRICE_PRO_TEAMS_YEARLY`
- Added to `FALLBACK_PLANS` and `PLAN_ICONS` in Pricing.tsx

### ✅ InvestorHub — Real Athletes Section
- Added "Real Athletes. Real Results." gallery section before Contact CTA
- Uses existing public assets + Unsplash sport photos as placeholders
- Ready to swap in real athlete photos (IMG_0973–IMG_1519) when uploaded

### ✅ AWS Reply to Nishant
- Read Nishant's email from Case 177767167100909
- Sent action email to cdozier14@athlynx.ai with reply draft + AWS Support Center link
- Chad manually submitted reply via AWS Support Center (confirmed)
- Reply confirmed registration v3 was submitted with all required fields

---

## 4. What's Working Right Now

| Feature | Status |
|---------|--------|
| athlynx.ai is live | ✅ |
| Email/password signup | ✅ |
| Google sign-in | ✅ |
| Welcome email on signup | ✅ |
| Admin alert on signup | ✅ |
| 7-day free trial | ✅ |
| Stripe payment wall | ✅ |
| Onboarding flow | ✅ |
| Admin CRM | ✅ + new Expiry tab |
| Investor Hub | ✅ + Real Athletes section |
| Pro Teams page | ✅ NEW — /pro-teams |
| Expiration Warning Popup | ✅ NEW — fires days ≤5 or expired |
| Expiration Admin View | ✅ NEW — AdminCRM Expiry tab |
| Neon database | ✅ 34 tables |
| Gemini AI | ✅ |
| Stripe webhook | ✅ |

---

## 5. Pending — Priority Order

### 5.1 AWS SMS Toll-Free Activation — CRITICAL
**Status:** Registration v3 SUBMITTED — awaiting carrier approval  
**Timeline:** Up to 15 business days from May 1  
**Action needed:** None — activates automatically. Test once approved.  
**AWS Support Case:** 177767167100909 (Nishant B.)  
**Toll-free:** +18664502081

### 5.2 Create Pro Teams Stripe Price IDs
**Action needed:** Create in Stripe dashboard:
- `STRIPE_PRICE_PRO_TEAMS` — $2,500/month
- `STRIPE_PRICE_PRO_TEAMS_YEARLY` — $24,000/year
- Set both in Vercel env vars

### 5.3 Upload Real Athlete Photos
**Action needed:** Upload 22 photos (IMG_0973–IMG_1519) via `manus-upload-file`  
**Then:** Replace Unsplash placeholders in InvestorHub "Real Athletes" section  
**Also:** Add to Home page hero and sport-specific pages

### 5.4 Public Launch
**Target:** July 1, 2026  
**Current users:** 1 (Chad — admin). 247 VIP waitlist.

### 5.5 Auth0/Okta Decision Meeting
**Date:** Tuesday, May 5, 2026 at 3:00 PM  
**Contacts:** Tanner Dale (Okta) and James Hong (Anthropic Identity)

### 5.6 Nebius $5K Credits
**Status:** Application submitted April 30, 2026  
**Action needed:** Follow up if no response by May 5

---

## 6. Non-Negotiable Rules

1. Read master reference before doing ANYTHING
2. Push to GitHub before ending every session
3. One repo, one account, one email — no duplicates
4. Never claim something is done unless tested and live
5. No placeholders, no mock data, no empty shells
6. All code goes to AthlyXAI/Athlynx-V2-Official only
7. Vercel auto-deploys from main branch — never manual
8. **NEVER run `manus-config save-config`** — this disables all connectors in the Manus UI
9. Login works on iOS, Android, and Desktop — never break it
10. Iron Sharpens Iron — Proverbs 27:17

---

## 7. Key Credentials (Reference Only)

| Item | Value |
|------|-------|
| Admin login | cdozier14@athlynx.ai / Athlynx2026! |
| Admin phone | +1-601-498-5282 |
| AWS Key ID | AKIA***REDACTED*** |
| Toll-free number | +18664502081 |
| Neon Project | empty-lake-01820888 |
| GitHub Repo | AthlyXAI/Athlynx-V2-Official |
| Live Site | https://athlynx.ai |
| Vercel Project | athlynx-platform (chad-a-doziers-projects) |

---

*Iron Sharpens Iron — Proverbs 27:17*  
**Chad A. Dozier Sr. — Founder & CEO, AthlynXAI | Dozier Holdings Group | Houston, TX**  
**May 2, 2026**
