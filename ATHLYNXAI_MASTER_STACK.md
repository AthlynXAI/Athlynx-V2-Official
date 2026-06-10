# ATHLYNXAI — MASTER STACK REFERENCE
## Permanent Session Knowledge — Load Every Session

> **RULE:** Every session MUST push all code to GitHub before ending.
> GitHub → Vercel auto-deploys live. No exceptions.

---

## THE LAYER CAKE — FULL STACK

| Layer | Service | Purpose |
|---|---|---|
| **AI Core** | Nebius AI (Llama-3.3-70B / NVIDIA H200) | Primary AI engine — scouting reports, training plans, wizard advice |
| **AI Core** | Google Gemini (gemini-2.5-flash) | Multimodal AI — image analysis, structured output, long context |
| **AI Core** | Anthropic Claude (claude-3-opus) | Conversational AI, code generation, complex reasoning |
| **AI Core** | OpenAI (gpt-5) | Fallback AI, embeddings, audio |
| **Automation** | Manus | AI agent — builds, deploys, manages the entire platform |
| **Source Control** | GitHub (AthlyXAI/Athlynx-V2-Official) | All code lives here. Main branch = production |
| **Deployment** | Vercel (athlynx-platform / AthlynxChad team) | Auto-deploys on every push to main. Project ID: prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU |
| **Database** | Neon (empty-lake-01820888) | Primary Postgres DB — all user data, profiles, NIL, training |
| **Database** | PlanetScale | MySQL — secondary/analytics DB |
| **Database** | Supabase | Real-time features, file storage, auth backup |
| **Auth** | Firebase | Google OAuth, Apple Sign-In, phone auth |
| **Email** | SendGrid | Transactional email — welcome, password reset, notifications |
| **Email** | Gmail (cdozier14@athlynx.ai) | Primary business email |
| **Email** | Outlook Mail / Office 365 | Microsoft ecosystem integration |
| **Payments** | Stripe (acct_1SqfS0GvvjXZw2uE — AthlynXAI Corporation) | All payments, subscriptions, credits purchases |
| **Payments** | Stripe Atlas | Business formation, banking integration |
| **Storage** | AWS S3 | Media uploads — avatars, highlight reels, documents |
| **Cloud** | AWS | Long-term infrastructure, data centers, enterprise hosting |
| **Automation** | Zapier | Workflow automation — CRM triggers, email sequences, social posting |
| **Social** | Buffer | Social media scheduling — Instagram, X, TikTok, LinkedIn |
| **Workspace** | Google Workspace | Docs, Sheets, Drive, Calendar, Meet — team collaboration |
| **Workspace** | Notion | Project docs, SOPs, knowledge base |
| **Project Mgmt** | Jira (chaddozier75.atlassian.net) | Sprint planning, tickets, roadmap |
| **Docs** | Confluence (dozierholdingsgroup-team.atlassian.net) | Technical docs, runbooks, team wiki |
| **Profiles** | Gravatar | User avatar fallback via email hash |
| **Networking** | Alignable | Local business networking, referrals |
| **Mobile** | Expo / EAS Build | React Native app — ai.athlynx.app (iOS + Android) |
| **Mobile** | Google Play Console | Android distribution (App ID: 4975757299409089037) |
| **Mobile** | Apple App Store | iOS distribution (Apple BM Org ID: 149833785256532752) |

---

## CRITICAL CREDENTIALS

| Item | Value |
|---|---|
| Master Admin | cdozier14@athlynx.ai |
| GitHub Repo | AthlyXAI/Athlynx-V2-Official |
| Vercel Project | athlynx-platform (team: AthlynxChad) |
| Vercel Project ID | prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU |
| Vercel Team ID | team_7neDSatyrDspOku2p0LxT8zO |
| Neon DB | empty-lake-01820888 |
| Stripe Account | acct_1SqfS0GvvjXZw2uE (AthlynXAI Corporation) |
| Stripe Webhook | [redacted Stripe webhook secret] |
| Google Play App ID | 4975757299409089037 |
| Google Play Package | ai.athlynx.app |
| Google Play Account | chaddozier75@gmail.com |
| Apple BM Org ID | 149833785256532752 |
| Jira Site | chaddozier75.atlassian.net |
| Confluence Site | dozierholdingsgroup-team.atlassian.net |
| Business Email | cdozier14@athlynx.ai |
| Business Address | 19039 CLOYANNA LN, HUMBLE, TX 77346-2746 |

---

## CRITICAL RULES — NEVER BREAK

1. **NEVER run `manus-config save-config`** — disables all connectors
2. **DNS for athlynx.ai → Vercel ONLY** — never Cloudflare proxy
3. **Deploy pipeline:** Manus sandbox → `git push` → GitHub main → Vercel auto-deploy
4. **Stripe → AthlynXAI Corporation ONLY** (acct_1SqfS0GvvjXZw2uE)
5. **Chad A. Dozier Sr. = MASTER ADMIN** — only admin. Partners get full access, NOT admin
6. **ALWAYS push ALL code to GitHub before ending session**
7. **Home page — DO NOT MODIFY** (locked since S30)
8. **Build locally first** — `npm run build:vercel` must pass before pushing
9. **NO yellow** on any AthlynXAI branded materials — #0066ff blue and #00c2ff cyan only
10. **Nothing stays in the sandbox** — all work must be pushed to GitHub
11. **Run `bash scripts/session-start.sh`** at the start of every session
12. **Mobile app package name is `ai.athlynx.app`** — NEVER change this
13. **Push to GitHub + Vercel deploys live AFTER EVERY SESSION** — no exceptions

---

## SESSION START CHECKLIST

```bash
cd /home/ubuntu/athlynxai_repo  # or clone fresh
bash scripts/session-start.sh   # pull latest, harden routers, build check
npm run build:vercel             # must pass before any push
```

---

## DOMAINS

| Domain | Routes To |
|---|---|
| athlynx.ai | Main platform |
| athlynx.pro | /pro-teams |
| athlynx.net | /portal |
| athlynx.io | /portal |
| nilportals.com | /nil-portal |
| nilportal.ai | /nil-portal |
| nilgateway.com | /nil-marketplace |
| nilgateway.org | /nil-marketplace |
| transferportal.live | /transfer-portal |
| transferportal360.com | /transfer-portal |
| dozierholdingsgroup.com | /dhg |

---

## CORE TEAM

| Name | Role |
|---|---|
| Chad A. Dozier Sr. | Founder & CEO, Master Admin |
| Glenn Tse | Co-Founder |
| Jimmy Boyd | Team |
| Andy Kustes | Team |
| Lee Marshall | Team |

---

*Iron Sharpens Iron — Proverbs 27:17*
*Chad A. Dozier Sr. — Founder & CEO, AthlynXAI Corporation*
*A Dozier Holdings Group Company · Houston, TX · Founded November 2024*
