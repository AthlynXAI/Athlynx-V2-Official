# AthlynXAI — AI Agent Handoff Report
## Thursday, April 30, 2026 — 11:00 PM CST

---

## FIRST THING — Read This Before Doing Anything

- **Master Reference:** https://github.com/AthlyXAI/Athlynx-V2-Official/blob/main/ATHLYNXAI_MASTER_REFERENCE.md
- **Verify Commits:** https://github.com/AthlyXAI/Athlynx-V2-Official/commits/main
- **Live Site:** https://athlynx.ai

---

## 1. Identity — One of Everything

| Item | Value |
|------|-------|
| **Person** | Chad A. Dozier Sr. — Founder & CEO |
| **Company** | Dozier Holdings Group (DHG) — Houston, TX |
| **Platform** | AthlynXAI |
| **Primary Email** | cdozier14@athlynx.ai |
| **Phone** | +1-601-498-5282 |
| **Address** | 19039 Cloyanna Ln, Humble, TX 77346 |
| **GitHub Account** | chaddozier75@gmail.com |
| **GitHub Org** | AthlyXAI |
| **GitHub Repo** | AthlyXAI/Athlynx-V2-Official |
| **Live Site** | https://athlynx.ai |
| **Vercel Project** | chad-a-doziers-projects/athlynx-platform |

**NEVER USE:** retired-non-chad-lane / cdozier14@dozierholdingsgroup.mx

---

## 2. Tech Stack

| Layer | Service | Status |
|-------|---------|--------|
| Frontend | React + TypeScript + Vite + TailwindCSS | ✅ Live |
| Backend | Node.js + tRPC + Express | ✅ Live |
| Deploy | Vercel (auto-deploys from main branch) | ✅ Live |
| Database Primary | Neon PostgreSQL | ✅ Connected — 27 tables |
| Database Failover | PlanetScale PostgreSQL | ✅ Connected |
| Auth | Firebase (Google, Apple, Facebook, X, Email) | ✅ Live |
| AI Primary | Google Gemini 2.5 Flash | ✅ Wired |
| AI Secondary | Nebius Token Factory (Llama-3.1) | ✅ Wired |
| Email | AWS SES (from cdozier14@athlynx.ai) | ✅ Working |
| SMS | AWS SNS via toll-free +18664502081 | ⏳ PENDING 24-48 hrs |
| Payments | Stripe (5 tiers + AI credits) | ✅ Live |
| Profiles | Gravatar API | ✅ Live |
| Social Posts | Buffer (auto-posts 3x/day) | ✅ Live |

---

## 3. What Was Built This Session (April 30, 2026)

| Commit | Time | What Deployed |
|--------|------|---------------|
| afe220c | 10:00 PM | Session master reference update |
| 355545d | 9:50 PM | Feed seeded — 25 real sport-themed posts into Neon DB |
| 72300c1 | 7:40 PM | CRM upgrade — Salesforce+ZoomInfo level dashboard |
| 39a8213 | 7:26 PM | Daily report cron (8 AM CST) + Neon/PlanetScale dual failover |

**This session also completed:**
- Full investor pitch deck (12 slides, Pre-Seed through Series D)
- Full investor section on Home page with P&L, spend history, corporate structure
- PM-style mind map and whiteboard cloud architecture diagrams
- QC Report PDF with AthlynXAI branding
- Nebius $5K credit email sent with proof (startups@nebius.com)
- AWS SNS spend limit raised to $100/month

---

## 4. What's Working Right Now

| Feature | Status |
|---------|--------|
| athlynx.ai is live | ✅ |
| Google sign-in | ✅ Tested and confirmed |
| Email/password signup | ✅ Tested and confirmed |
| Welcome email on signup | ✅ Admin alert fires to cdozier14@athlynx.ai |
| 7-day free trial | ✅ Sets trialEndsAt on every signup |
| Stripe payment wall | ✅ Redirects to /trial-expired after day 7 |
| Onboarding flow | ✅ signup → /onboarding → /portal |
| Admin CRM | ✅ Live user dashboard, Gravatar, Export CSV |
| Daily report cron | ✅ Fires at 8 AM CST to cdozier14@athlynx.ai |
| Neon database | ✅ Connected, 27 tables, 25 feed posts seeded |
| PlanetScale failover | ✅ Auto-failover if Neon goes down |
| Gemini AI | ✅ Wired as primary AI engine |
| Nebius Token Factory | ✅ API key set, wired as secondary AI |
| X-Factor Feed | ✅ 25 real sport-themed posts live |
| Investor Section | ✅ Full deck, P&L, spend history, corporate structure on Home page |

---

## 5. Pending — Priority Order

### 5.1 Stripe Webhook Secret — CRITICAL
**Status:** NOT SET in Vercel  
**Action needed:** Stripe Dashboard → Webhooks → get signing secret → add as `STRIPE_WEBHOOK_SECRET` in Vercel  
**Why:** Without this, subscription activations after payment do not fire

### 5.2 AWS SMS — Toll-Free Number
**Status:** +18664502081 PENDING carrier activation (24-48 hrs from April 30)  
**Action needed:** None — activates automatically. Test with CloudShell once active.  
**Note:** AWS SNS spend limit raised to $100/month ✅

### 5.3 Nebius $5K Credits
**Status:** Application submitted April 30, 2026. Follow-up email sent to startups@nebius.com with proof of November 2025 award offer.  
**Action needed:** Wait 1-3 business days for approval

### 5.4 Auth0/Okta Decision
**Status:** Board due diligence questions prepared for Tanner Dale (Okta) and James Hong (Anthropic Identity)  
**Meeting:** Tuesday, May 5, 2026 at 3:00 PM  
**Total Year 1 exposure:** $209,010–$344,010  
**Action needed:** Request startup tier pricing and phased entry

### 5.5 Public Launch
**Target:** July 1, 2026  
**Current users:** 247 VIP waitlist  
**Action needed:** Complete AI Training Bot, Media Suite, NIL Vault real data, Stripe webhook

---

## 6. Non-Negotiable Rules

1. Read master reference before doing ANYTHING
2. Push to GitHub before ending every session
3. One repo, one account, one email — no duplicates
4. Never claim something is done unless tested and live
5. No placeholders, no mock data, no empty shells
6. All code goes to AthlyXAI/Athlynx-V2-Official only
7. Vercel auto-deploys from main branch — never manual
8. Firebase keys, Nebius key, Gemini key all set in Vercel env vars
9. Login works on iOS, Android, and Desktop — never break it
10. Iron Sharpens Iron — Proverbs 27:17

---

## 7. Chad's Vision

- AthlynXAI is the #1 AI sports platform for athletes
- A CRM (Salesforce + ZoomInfo level) for managing athletes, teams, and NIL deals
- An AI Trainer ecosystem — every athlete gets a personal AI trainer
- A marketplace — athletes, coaches, brands, and organizations buy/sell through AthlynXAI
- A data center play — Chad is building proprietary data centers to resell compute
- A reverse funnel — money flows TO AthlynXAI from every direction
- Licensed to teams, universities, and sports organizations
- The platform is live. The foundation is built. Now grow it.
- Bigger than Barstool Sports. All-in-one like Facebook + Instagram + TikTok + LinkedIn + WhatsApp

*"Iron Sharpens Iron" — Proverbs 27:17*  
**Chad A. Dozier Sr. — Founder & CEO, AthlynXAI | Dozier Holdings Group | Houston, TX**  
**April 30, 2026 — 11:00 PM CST**
