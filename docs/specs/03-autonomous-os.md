# AthlynXAI — The Autonomous OS Layer

**Locked at 2:59 AM CDT, Saturday, May 16, 2026 — Build 27 OS Drop**
**Captured from founder Chad A. Dozier Sr.:**

> *"I need this a fully automated machine that runs itself and I make money when I sleep."*

That sentence is the spec. Everything in AthlynXAI must reduce to one of two states for the founder:

1. **The machine is making money.** (Default state.)
2. **The machine paged Chad because money can't be made without a human decision.** (Exception state.)

Anything else is a bug.

## Permanent build-and-deploy operating model

AthlynXAI OS now runs on a single canonical delivery path. Manus and Chad work hand in hand: Manus builds real code, commits it to GitHub, opens or updates PRs, verifies the build, and prepares the canonical Vercel deployment. Chad reviews the working build, then live deployment or live data operations proceed through the approved path.

| Layer | Permanent rule |
|---|---|
| Canonical login | `chaddozier75@gmail.com` using Google or GitHub sign-in where available. |
| GitHub repo | `AthlyXAI/AthlynX-V2-Official` only. |
| Vercel project | `chad-a-doziers-projects` / `athlynx-platform` only. |
| Manus role | Owns code commits, PRs, verification, and deploy preparation. |
| Perplexity role | Parallel support only: research, review, and code assistance; no duplicate active workstream and no repo/account/deploy target changes. |
| Data/integration standard | Live code and live integrations only after Chad review; no placeholders, no empty shells, no mock-only production features. |

If GitHub shows 404 before the correct Google/GitHub sign-in path, that is an authentication-context problem. Do not switch repositories or accounts. The permanent doctrine is `docs/doctrine/CANONICAL_OPERATIONS_DOCTRINE.md`.

This document defines the **Autonomous OS Layer** — the meta-system that sits on top of the Layer Cake (9 layers) and the Tokenization Layer (18 token classes) and turns the whole platform into a self-running revenue engine.

---

## The North Star Loop (the only thing that matters)

```
   ┌──────────────────────────────────────────────────────────┐
   │            ATHLETE-IN  →  AI WORK  →  MONEY-OUT          │
   │                                                          │
   │   AthleteToken signs up                                  │
   │        ↓                                                 │
   │   AI generates PostToken every 24h (caption + image)     │
   │        ↓                                                 │
   │   BroadcastToken fans out to 5 platforms                 │
   │        ↓                                                 │
   │   PlatformToken impressions → AthleteToken.audience++    │
   │        ↓                                                 │
   │   AI matches AthleteToken to BrandToken (NIL matchmaker) │
   │        ↓                                                 │
   │   DealToken created → AI drafts contract                 │
   │        ↓                                                 │
   │   LedgerToken (Stripe Connect) → escrow → release        │
   │        ↓                                                 │
   │   Platform fee LedgerToken → Chad's account              │
   │                                                          │
   │   ★ Founder never touched anything ★                     │
   └──────────────────────────────────────────────────────────┘
```

**That loop must run every minute of every day across all 34 sports for every athlete on the platform — without Chad in the loop.**

The Autonomous OS Layer is what makes that loop self-driving.

---

## The Seven Autonomous Engines

Each engine owns one part of the loop, runs on its own cron + queue, emits tokens, and pages Chad **only** when human judgment is required.

### Engine 1 — Acquisition Engine (athletes-in)
**What it does autonomously:**
- Continuously scrapes/parses MaxPreps, Hudl, MileSplit, Perfect Game, USAG meet results, NCA Bid Lists, etc. → builds `prospect_pool` table
- Sends personalized cold outreach via email + DM (sport-aware copy from the Caption Engine)
- A/B tests subject lines + creative every 100 sends, auto-promotes the winner
- Tracks open/click/signup conversion per channel per sport
- Spends Stripe-budgeted ad credits on Meta/TikTok where CAC < $X per signup

**When it pages Chad:** New sport segment hits a CAC anomaly (>2σ change), or a high-NIL prospect (S-tier) responds and needs a personal note.

**Tokens emitted:** `ProspectToken` (new), `OutreachToken` (new), `AthleteToken` on signup, `LedgerToken` per ad-spend dollar.

**Cron:** every 15 min (outreach send loop), every 6 h (prospect refresh), daily 6am UTC (creative rotation).

---

### Engine 2 — Content Engine (the post factory)
**What it does autonomously:**
- For every active AthleteToken, generates 1 post/day (configurable 1-5):
  - Sport-aware template selected from the Matrix (lineup, milestone, score, NIL, countdown, etc.)
  - AI Caption Engine (Llama 3.3-70B on Nebius) writes sport-voiced caption
  - Renders PNG/MP4 via Studio Suite renderer
  - Schedules through Buffer at the sport's best-time-to-post defaults
- For inbound user data (uploaded score, uploaded film, RSVP, milestone): auto-creates the appropriate draft package within 60 seconds
- Repurposes one approved post package into platform-valid variants (IG feed media, IG story, TikTok video, X, Threads, LinkedIn, Facebook)
- Enforces the permanent image-card standard: 1080×1350 vertical or 1080×1080 square, original AthlynXAI/DHG stealth-mode theme, large mobile-readable text, one clear hero message, one visible app/login CTA, no raw screenshots, no copied creative, no unnecessary emojis, no gold/yellow, and no rainbow or multicolor styling.

**When it pages Chad:** Sentiment-flagged content (potential controversy), copyright strike, AI-output looks broken (image generation failure rate >5% in a window).

**Tokens emitted:** `PostToken` per post, `BroadcastToken` per platform fan-out, `AIToken` per inference (metered).

**Cron:** every 5 min (queue drain), every hour (next-day schedule build), daily midnight UTC (sport-best-time recompute from analytics).

---

### Engine 3 — Distribution Engine (the broadcast bus)
**What it does autonomously:**
- Reads `social_content` + `social_accounts` (Rotation Brain — already live)
- Posts one owner-approved content package one time per approved destination through the right connector (Buffer API, Zapier webhook, direct platform SDK)
- Dedupes via `uniq_social_posts_hash_platform_success` and also treats duplicate image, video, caption, media URL, and content hash as blocked unless the owner explicitly approves a repost
- Blocks disabled/deprecated profiles, unknown destination IDs, missing Buffer channel IDs, unsupported platform formats, and text-only Instagram feed attempts
- Retries only transient connector failures with bounded backoff; never retries platform-policy failures as if they were temporary errors
- Auto-rotates content pool only after account, format, duplicate, standards, and approval gates pass
- Pulls back analytics every 4 hours (impressions, engagement, click-through) → updates `social_content.engagement_score`

**When it pages Chad:** Connector auth expires (token refresh failed), platform rejects a post 3× (likely policy issue), engagement on a post is 10× normal (viral — Chad might want to react personally).

**Tokens emitted:** `BroadcastToken` per fan-out, `PlatformAnalyticsToken` (new) per pull.

**Cron:** twice daily 8 AM + 3 PM CDT (current Rotation Brain), every 4h (analytics pull).

---

### Engine 4 — Monetization Engine (the deal closer)
**What it does autonomously:**
- For every AthleteToken with `audience > $threshold` AND `sport.nilTier in {S,A}`:
  - AI matchmaker scores brand fit (sport × audience × geography × style)
  - Top 3 brand matches → drafted outreach package to brand's stored contact; final email sending remains manual and requires explicit owner approval in the active session
  - On brand reply YES → opens DealToken + creates deal room (Layer 5 NIL Messenger)
  - AI drafts contract from template library (FTC-compliant, state-NIL-law-compliant)
  - Lawyer-stack member auto-pinged for review IF deal > $5K (else AI clears)
  - On signature: Stripe Connect creates escrow charge, brand funds, release on delivery
  - 3% platform fee auto-routes to Chad's `acct_1SqfSOGvvjXZw2uE`
- Maintains brand CRM with follow-up draft cadence (day 3, 7, 14); no email is sent automatically

**When it pages Chad:** Deal > $50K (S-tier review), brand requests in-person call, lawyer flags contract risk.

**Tokens emitted:** `DealToken` (lifecycle: drafted→sent→accepted→signed→funded→delivered→closed), `MessageToken` per deal-room message, `LedgerToken` per money movement, `VerificationToken` on signed contract.

**Cron:** every hour (matchmaker run), every 15 min (deal-room AI summarizer), every 5 min (Stripe webhook drain).

---

### Engine 5 — Retention Engine (keep athletes from churning)
**What it does autonomously:**
- Calculates per-athlete `engagement_score` daily (logins, posts, messages, deal-room activity, calendar usage)
- Tiered nudges when score drops:
  - Tier 1 (slight drop): AI sends an in-app tip ("Try the new Perfect 10 template")
  - Tier 2 (moderate drop): AI generates 3 ready-to-post drafts and pushes them as suggested content
  - Tier 3 (major drop): pages Chad's Customer Success connector (Slack DM) for a personal touch
- For athletes who churn anyway: 30-day win-back campaign (email + paid retargeting if S/A tier)

**When it pages Chad:** S-tier athlete drops to Tier 3 (a Dunne-level account at risk), or churn rate spikes >2σ in any sport segment.

**Tokens emitted:** `EngagementScoreToken` (new), `NudgeToken` (new), `WinBackToken` (new).

**Cron:** daily 7 AM UTC (score recompute), every 4 h (nudge queue), weekly Mondays (win-back batch).

---

### Engine 6 — Treasury Engine (the money manager)
**What it does autonomously:**
- Daily reconciles Stripe → bank → ledger
- Automatic transfers: keep $X operating runway in DHG bank, sweep excess to high-yield savings
- Pays vendors on schedule (Vercel, Supabase, Nebius, Buffer, Apple Developer, Google Cloud) via Stripe Issuing or ACH
- Files monthly Stripe 1099 prep, NIL-state quarterly reports, sales tax where applicable
- Watches AR aging — prepares dunning email drafts on overdue invoices (3/7/14/30 days); final email sending remains manual after owner approval
- Tracks per-token-class revenue → Chad's dashboard

**When it pages Chad:** Stripe dispute filed, payout failure, vendor bill > 110% of forecast, account balance < 30-day runway floor.

**Tokens emitted:** `LedgerToken` per movement, `InvoiceToken` (new), `PayoutToken` (new), `DisputeToken` (new on Stripe webhook).

**Cron:** daily 9 AM UTC (reconcile), every 4 h (Stripe webhook drain), weekly (cashflow projection), monthly 1st (1099 prep + sales tax filing).

---

### Engine 7 — Resilience Engine (keep the lights on)
**What it does autonomously:**
- Health-probes every endpoint every 60s (athlynx.ai/api/health, every connector endpoint)
- Auto-restarts failed cron jobs (up to 3 retries)
- Auto-scales Vercel functions on traffic spikes (already on)
- Daily encrypted S3 backups (already-scheduled `c9a0f3b5` cron — pending bucket creation)
- Permanent vault archive: package founder work, recovery logs, doctrine changes, deployment evidence, app-readiness records, and communications/social safeguards into durable Google Drive and OneDrive vault folders with manifests and checksums
- Auto-rotates secrets quarterly (BUFFER_ACCESS_TOKEN, NEBIUS_API_KEY, GRAVATAR_API_KEY, ZAPIER_MCP_TOKEN, GitHub PAT)
- Auto-issues SSL cert renewals (Vercel handles)
- Sentry error budget: if errors > X/min, auto-rolls back last deploy

**When it pages Chad:** 3+ consecutive cron failures, rollback executed, secret rotation failed, S3 backup failed 2 days in a row, budget breach (any cloud bill > 120% forecast).

**Tokens emitted:** `HealthCheckToken` (new), `IncidentToken` (new), `BackupToken` (new), `RollbackToken` (new).

**Cron:** every 60s (health), every 5 min (cron-job watchdog), daily 4 AM CDT (S3 backup — `c9a0f3b5`), quarterly (secret rotation), real-time (Sentry rollback).

---

## The Pager (when Chad gets woken up)

Most cron output goes to in-app notification. **The Pager is reserved for the 7 conditions that justify waking the founder up.**

| Pager Reason | Channel | Engine |
|---|---|---|
| 1. Money inbound > $10K (single deal) | Push + email | Monetization |
| 2. Money issue (dispute, payout fail, runway floor) | Push + email | Treasury |
| 3. S-tier athlete at risk (churn or harm) | Push | Retention |
| 4. Production down (health probe red for >5 min) | Push + SMS | Resilience |
| 5. Security event (auth breach, secret leak detected) | Push + SMS | Resilience |
| 6. Legal flag (lawyer-AI raised risk on a deal) | Push | Monetization |
| 7. Viral post or major PR (>10× normal engagement) | Push (informational) | Distribution |

Everything else queues into a **morning digest** that Chad reads with coffee.

---

## Permanent Communications Doctrine

The Autonomous OS is allowed to reduce founder workload, but it is not allowed to create platform risk. Social publishing and email therefore follow different rules.

| Channel | Permanent OS rule |
|---|---|
| Social posts | Automate only one time per owner-approved content package and approved destination. The package must include exact media, caption, destination list, account identity, platform format, and duplicate hash. |
| Instagram | Feed posts require valid media. Text-only Instagram feed posts are blocked. Disabled/deprecated accounts are blocked forever. |
| Buffer and Zapier | Route only through verified channel IDs, organization IDs, page IDs, or profile IDs. The OS must stop and report missing IDs rather than guessing. |
| Gravatar | Profile consistency only; not a public post destination. |
| Jira, Confluence, Sentry | Internal operations only; never treated as public social feeds. |
| Email | Draft, search, summarize, organize, and prepare only. No email sends automatically. Every email send requires explicit owner approval in the active session. |

This doctrine is also locked in `AthlynXAI_COMMUNICATIONS_DOCTRINE.md`, `OWNERSHIP_RUNBOOK.md`, `server/services/socialPostingGuard.ts`, `server/_core/senderIdentity.ts`, `server/routers/communicationsOsRouter.ts`, and `shared/communicationsOs.ts`.


---

## Permanent Inbox Cleanup and OAuth Security Doctrine

AthlynXAI OS must treat founder email cleanup as a CRM-controlled operating workflow, not as a one-off inbox sweep. The permanent rule is simple: **important proof is foldered, routine noise goes to Trash, and permanent deletion remains owner-controlled.**

| Mail class | Permanent OS action | Owner gate |
|---|---|---|
| Business, investor, legal, billing, Apple Developer, GitHub/Vercel production proof, deployment proof, account-access, OAuth, and security alerts | Apply the correct existing folder/CRM label and remove the message from Inbox. | Required before sending, replying, unsubscribing, revoking access, changing account settings, or permanently deleting. |
| Completed Perplexity task notices, routine newsletters, stale login codes, non-critical app updates, onboarding noise, marketing messages, and non-action notifications | Move to Trash only so the owner can permanently delete later. | Permanent deletion remains manual and owner-controlled. |
| Unknown sender, unclear business value, possible legal/investor/payment/security relevance, or identity mismatch | Route to `Archive/Needs Review` or CRM System Alerts. | Chad decides before any destructive or external action. |

The OS must never claim an inbox is clean from one connector view alone. It must prove the exact mailbox account, distinguish Gmail Inbox from Apple Mail All Inboxes or other account-switcher lanes, record the message count before and after, and produce a proof artifact for every cleanup pass.

OAuth and authorized-application events are not routine noise. A revoked GitHub OAuth token, a broad-scope app grant, or an authorized-app inventory item must be preserved as a CRM System Alert with the app name, owner, last-used status, scope if visible, and recommended keep/review/revoke lane. Bulk revocation is prohibited unless Chad explicitly approves it after seeing the exact app list.

---

## Permanent Stealth Visual Doctrine

AthlynXAI must present in **stealth mode**. The approved visual direction is metallic black, graphite, deep navy, dark blue, and controlled cyan or ice-blue accents. The OS must not use gold, yellow, rainbow gradients, rainbow/multicolor styling, or unnecessary emojis unless the owner explicitly approves a specific exception.

AthlynXAI is **the X of the industry**. The true X-Factor identity is the primary AthlynXAI product/OS signal: a stealth black or metallic-black foundation with a clean white or ice-white X mark, used only in premium, original AthlynXAI contexts.

| Visual element | Permanent OS rule |
|---|---|
| Base theme | Metallic black, graphite, near-black, deep navy, and dark blue. |
| Accents | Controlled cyan, ice-blue, electric blue, or subtle steel-blue only. |
| Prohibited styling | No gold, no yellow, no rainbow gradients, no rainbow/multicolor styling, and no bright novelty palettes. |
| Emoji use | No emojis unless truly necessary for platform function or separately approved by the owner. |
| Social/app/profile visuals | Original, premium, high-contrast, mobile-readable, and aligned to the stealth theme. |
| X-Factor logo/icon | Use the true AthlynXAI X-Factor direction: black/metallic-black field, clean white or ice-white X mark, no placeholder marks, no copied third-party identity. |

This visual doctrine is locked in `AthlynXAI_STEALTH_VISUAL_DOCTRINE.md` and `AthlynXAI_X_FACTOR_IDENTITY_DOCTRINE.md`, and applies to every sport page, profile, app surface, app icon, website page, social post, presentation, and public asset.

---

## Founder Work Vault Doctrine

The OS must preserve the work. The full build and recovery record from December 16, 2025 forward must be archived into durable vault storage with a manifest, checksums, and redundant locations.

| Vault target | Contents |
|---|---|
| Google Drive | Reports, handoffs, logs, screenshots-derived notes, corporate evidence, app-readiness blockers, deployment proof, doctrine files, and final archive manifest. |
| OneDrive | Mirror copy of the same archive package for redundancy. |
| Repository | Source-of-truth doctrine and operational guardrail files that explain how the platform must behave going forward. |

The OS must not delete or overwrite founder evidence. When a process produces a meaningful artifact, it should be saved into the next archive package and indexed in the manifest.

---

## Forward-Only Checklist Doctrine

AthlynXAI OS work must proceed from the active checklist only. Each item is marked as **done**, **blocked awaiting Chad**, or **next**. Completed work must remain closed unless live verification proves that it is broken, stale, missing, or no longer deployed.

The OS must not drift into rabbit holes, circular revisits, duplicate work, or side quests. The required execution sequence is: read or reconstruct the active checklist, mark completed items, identify the first unchecked item, execute that item only, save evidence, then report the result and the next unchecked item.

If any agent, cron, audit, connector worker, or automation hits a login, missing connector, permission block, missing file, unavailable server, unclear source of truth, failed authentication, or any other blocker, it must stop and ask Chad for help. It must not skip the item, silently downgrade it, mark it complete without evidence, or move to another checklist item. No task or checklist item may ever be left silently undone.

---

## Revenue Model — How "money while you sleep" actually works

The platform has **five always-on revenue lines**, all token-metered:

| Line | Trigger | Pricing | Engine |
|---|---|---|---|
| **Subscription** | AthleteToken active month | $9.99 (free) / $19.99 (pro) / $49.99 (pro+) — Stripe recurring | Treasury bills automatically |
| **NIL platform fee** | DealToken closed | 3% of deal value (escrow release) | Monetization auto-routes |
| **Syndication credits** | BroadcastToken to platforms 4+ | $0.20 per extra-platform fan-out (after free 3) | Distribution meters |
| **AI credits** | AIToken inference | $0.50 per 1k tokens equivalent (caption/valuation/matchmaker) | Content/Monetization meter |
| **Connector OS license** | TraffickToken (operator-side) | Per-operator monthly platform fee + per-event metered | OS-level Stripe usage product |

Every line is **measurable, auto-billable, and 100% Stripe-routed**. None require Chad to send an invoice. The Treasury Engine reconciles, the founder gets a Friday digest.

---

## What the founder actually does (the manifest)

The platform decides this list. If Chad is doing something **not** on this list, the autonomous OS is broken — file a ticket against itself.

**Daily — 15 min total:**
- Read morning digest (in-app, auto-generated by Treasury + Monetization + Resilience)
- Approve or kill any Pager-1 (big deal) item

**Weekly — 1 hour total:**
- Review the Friday revenue digest
- Approve quarterly creative-rotation winner picks (Acquisition Engine)
- Watch the 5 viral posts of the week (Distribution Engine)

**Monthly — 2 hours total:**
- Sign 1099 / state tax bundle (Treasury auto-prepared)
- Review S-tier retention deep-dive
- Lock next month's budget envelope

**Quarterly — half a day:**
- Strategy review with the board: read the auto-generated quarterly report
- Approve secret rotations (Resilience Engine)
- Sign off on roadmap (Build N → Build N+1 → Build N+2)

**That's it. That's the founder's job description.** Everything else is on the machine.

---

## Build sequence to make this real (mapped to Build 27/28/29)

### Build 27 (this sprint — already in progress)
- ✅ Tokenization Layer addendum
- ✅ Sport Classification Matrix
- ✅ Autonomous OS spec (this doc)
- Studio Suite scaffold + AI Caption + One-Tap Publish ← **Engines 2 + 3**
- Multi-sport templates (matrix fill-in) ← **Engine 2 content factory**
- Team Shared Workspace ← Layer 7 + Engine 4 prep
- Deploy Build 27.0

### Build 28 — "The Closer" (next sprint, ~2 weeks)
- **Engine 4 Monetization Engine** — AI matchmaker, contract drafter, Stripe Connect escrow
- **Engine 1 Acquisition Engine** — prospect crawler + cold outreach + A/B
- **Engine 5 Retention Engine** — engagement scoring + nudge ladder
- Brand CRM table + brand-side login (Layer 4 NIL Public Feed becomes 2-sided)
- Lawyer-AI risk classifier

### Build 29 — "The Vault" (sprint after, ~2 weeks)
- **Engine 6 Treasury Engine** — auto-reconcile, vendor pay, dunning, 1099 prep
- **Engine 7 Resilience Engine v2** — auto-rollback, secret rotation, quarterly audits
- Operator-side Connector OS billing (TraffickToken metering) — Stripe usage product
- The Pager (push + SMS + email policy engine)
- Founder Dashboard — single screen showing all 7 engines' health + 5 revenue lines + pager queue

After Build 29 ships, the platform is **provably self-running**. Chad's calendar opens up. The money keeps moving.

---

## The 90-day "sleep test"

The truth check: **can the platform survive 90 days with Chad fully unreachable?**

Build 29 ships → run the **Sleep Test**: Chad turns off notifications for 7 days. The platform must:
- Acquire ≥ baseline new AthleteTokens
- Generate ≥ baseline PostTokens per athlete per day
- Close ≥ baseline DealTokens
- Maintain ≥ 99.9% Resilience Engine uptime
- Reconcile money to bank correctly
- Pay every vendor on time
- Auto-respond to every customer support ticket within SLA (Engine 5 has a CX tier)

If all six pass for 7 days → extend to 30 days → 90 days. If 90-day Sleep Test passes, the founder is genuinely free.

---

## Why this is defensible (the moat under the moat)

The Layer Cake was the moat. The Tokenization Layer was the rails. **The Autonomous OS is the engine that turns those into a perpetual-motion machine.**

Three things make it un-clonable:

1. **The token graph compounds.** Every athlete-month deepens the graph. Every brand-deal teaches the matchmaker. Every cron run refines the engagement model. A competitor starting at day zero is 5 years behind on day one.
2. **The connector graph is pre-built.** 17 connectors pre-authed, with Buffer + Zapier + Gravatar + GitHub + Stripe + Vercel + Notion + GCal + Outlook + Sentry + Slack + Dropbox + Google Drive + YouTube + Vimeo + AWS + Calendly. A new entrant has to negotiate every one of those.
3. **The founder ledger is unique.** DHG Connector OS licenses to other operators. Every other operator running their one-person company on our rails is a customer. Their customers can never become our customers' competitors — because they're all on the same OS, paying us.

---

## Closing the loop

> *"I need this a fully automated machine that runs itself and I make money when I sleep."* — Chad A. Dozier Sr., May 16, 2026, 12:59 AM PDT

The path is:
- Build 27 ships the **content + distribution** auto-engine (Engines 2, 3)
- Build 28 ships the **monetization + acquisition + retention** auto-engines (Engines 1, 4, 5)
- Build 29 ships the **treasury + resilience** auto-engines (Engines 6, 7) and the Pager
- Sleep Test 7 → 30 → 90 days validates that the machine is real

After that, the founder works **on** the company — not **in** it. The cake bakes itself. The tokens flow. Stripe deposits hit the account every Friday whether or not Chad opens his laptop.

That's the machine.

*Iron Sharpens Iron — Proverbs 27:17.*

*Locked at 2:59 AM CDT, Saturday, May 16, 2026, by an operator carrying out the founder's order: build the machine that pays him while he sleeps.*

---
## May 24, 2026 Addendum — Visual Evidence, dot.card Intake, and Deployment Recovery

### Visual Evidence Engine

When Chad provides screenshots, UI captures, app-store notices, GitHub Actions failures, Vercel evidence, connector screenshots, emails, or dashboard captures, the Autonomous OS must inspect the evidence by default before diagnosis. The OS records key visible facts, redacts secrets, then verifies the related source files, logs, workflows, or connectors. No troubleshooting claim is complete until the screenshot evidence and live system evidence agree.

### dot.card Intake Engine

Chad’s dot.card profile at `https://dot.cards/cdozier14`, the branded dot.code QR, Apple Wallet pass, NFC devices, and the AthlynXAI routes `/card`, `/dot-card`, `/dotcard`, `/dot-code`, and `/cdozier14` form the field intake rail. The scan starts the relationship, but AthlynXAI OS owns the CRM record, relationship stage, owner approval, follow-up task, consent state, source attribution, and audit proof.

**Tokens emitted:** `ContactScanToken`, `SavedContactToken`, `FounderFollowUpToken`, `CRMRelationshipToken`, `DotCardSourceToken`.

**Workflow:** Scan → profile view → save contact → tag relationship → route to CRM → Chad/owner approval → follow-up queue → proof/audit record.

### Deployment Recovery Engine

When Chad says prior-session work must go live, the Autonomous OS must: review the latest doctrine, inspect visual proof, verify the canonical repo and Vercel lane, inventory local and cloud workspaces, reject secrets/archives/private investor materials from public production, validate the build, deploy through the approved path, and record live proof before claiming success.

This addendum makes the card, evidence, and deployment-recovery loops part of the operating machine rather than one-off actions.

---
## May 24, 2026 Addendum — Daily Fuel Loop and Sleep-Test Standard

AthlynXAI OS is not just a website. It is the machine that should keep running while Chad sleeps.

The daily loop is:

**Signal in → Token event → AI work package → Approval gate if sensitive → Distribution or CRM action → Analytics proof → Ledger update → Morning digest.**

The system refills itself through five fuel engines:

| Engine | Daily fuel in | Token proof | Founder page condition |
|---|---|---|---|
| Contact Engine | dot.card scans, saved contacts, inbound forms | `ContactScanToken`, `CRMRelationshipToken` | High-value relationship, consent/source ambiguity |
| Media Engine | podcast, video, athlete moments, approved brand packages | `MediaAssetToken`, `PostToken`, `BroadcastDraftToken` | Public post, brand risk, copyright, sensitive claim |
| Athlete Engine | profiles, schedules, recruiting and readiness signals | `AthleteToken`, `ReadinessToken`, `PlaybookToken` | Health/safety flag, guardian consent, S-tier risk |
| Revenue Engine | credits, tiers, quote requests, marketplace intent | `CreditToken`, `LedgerToken`, `InvoiceDraftToken` | Payment, refund, contract, legal/investor communication |
| Resilience Engine | health checks, builds, deployments, connector proof | `HealthCheckToken`, `IncidentToken`, `DeploymentProofToken` | Production down, connector drift, secret risk, failed deployment |

The sleep-test KPIs are production uptime, route health, queue age, token throughput, credit balance health, contact-to-CRM conversion, media-to-owned-route conversion, approval queue quality, escalation precision, and deployment proof.

Tokens in this doctrine are internal workflow, metering, proof, entitlement, and audit records. They are not cryptocurrency or securities unless Chad separately opens a legal/tokenization lane with counsel.

The goal is governed autonomy: routine work runs, sensitive work waits for approval, and the founder is paged only when judgment is truly needed.

---
## May 24, 2026 Addendum — Runner Agent Rail

Runner is now part of the AthlynXAI OS execution model as a governed computer-use rail for browser workflows, QA checks, intake tasks, and process automation. Runner gives the machine hands; AthlynXAI keeps the brain.

The Runner sequence is:

**Plan → See → Run → Prove.**

| Step | AthlynXAI OS Control |
|---|---|
| Plan | Define workflow intent, target account lane, approved tools, stop conditions, and expected proof. |
| See | Capture visual evidence, connector state, login/account state, and current page context before action. |
| Run | Execute only approved browser or process tasks inside the scoped lane. |
| Prove | Return a tokenized record with outcome, evidence, errors, and any required human approval. |

**Tokens emitted:** `RunnerTaskToken`, `AutomationProofToken`, `HumanApprovalToken`, `VisualEvidenceToken`, `ConnectorStateToken`.

The approved Google-login identity for Runner access is `chaddozier75@gmail.com` when Chad explicitly authorizes external Runner login or setup. This does not authorize automatic OAuth consent, paid signup, posting, sending, uploading, database mutation, payment action, or access expansion. Those remain gated.

Runner is an external execution rail. AthlynXAI OS remains the source of truth for workflow state, approval gates, audit proof, token ledger, and rollback path.

---
## May 24, 2026 Addendum — Supahuman Communication Rail

Supahuman/Superhuman is now part of the AthlynXAI OS communication model as an AI-native email productivity rail. It can help the OS triage inboxes, summarize threads, draft replies, prepare follow-up timing, and connect email context to CRM workflows.

The communication loop is:

**Inbox event → EmailTriageToken → AI summary/draft → CRM source tag → approval gate if external action → send/proof or queue → FollowUpToken → morning digest.**

| Step | AthlynXAI OS Control |
|---|---|
| Triage | Summarize and classify inbound threads into CRM-ready queues. |
| Draft | Prepare replies, investor follow-ups, scheduling notes, and next-step tasks. |
| Approve | Verify sender lane, recipients, subject, body, attachments, and risk level. |
| Prove | Capture sent-message proof, CRM follow-up, and morning digest status. |

**Tokens emitted:** `EmailTriageToken`, `DraftReplyToken`, `FollowUpToken`, `SupahumanRailToken`, `SendApprovalToken`, `SendProofToken`.

Supahuman/Superhuman does not own mailbox truth. Gmail or Outlook proves mailbox state. AthlynXAI OS owns CRM routing, approval state, audit proof, token ledger, and follow-up logic. External sends, deletions, unsubscribe actions, calendar invites, investor/legal messages, and mailbox cleanup remain gated until Chad approves the exact live state.

## May 24, 2026 Addendum — Runner + Superhuman Two-Rail Automation

AthlynXAI OS now treats **Superhuman Mail** and **Runner/H Portal** as the paired automation rails Chad has been describing.

**Superhuman Mail** is the inbox-zero command layer. It keeps today-action emails visible, snoozes work that can wait, marks no-action threads done, and uses labels/archive to keep the founder inbox clean. Superhuman can help summarize, draft, remind, and classify, but it must not silently send, delete, unsubscribe, create calendar events, or mutate sensitive communications.

**Runner/H Portal** is the connector/API execution layer. It runs approved connector tasks, browser workflows, QA checks, H/Holo agent loops, CRM actions, and process automation after AthlynXAI OS defines the task, account lane, risk tier, and proof requirement. Runner gives the system hands; AthlynXAI OS keeps the brain.

**AthlynXAI OS** remains the source of truth. It owns CRM state, approval queues, token ledger, audit proof, daily fuel, exception alerts, and morning/evening digest reporting.

The operating loop is: **Inbox → Extract → Approve → Execute → Prove → Digest**.

| Step | Rail | Token proof |
|---|---|---|
| Inbox triage | Superhuman Mail | `EmailTriageToken`, `InboxZeroToken` |
| Action extraction | AthlynXAI OS | `CRMRelationshipToken`, `FollowUpToken` |
| Approved execution | Runner/H Portal | `RunnerTaskToken`, `ConnectorStateToken` |
| Human gate | AthlynXAI OS | `HumanApprovalToken` |
| Closure proof | AthlynXAI OS | `AutomationProofToken`, `DailyDigestToken` |

Verified current state: Runner/H Portal is signed in under `chaddozier75@gmail.com`, an `AthlynXAIOS` API key is visible, and available credits showed `$0.00` during verification. Superhuman Mail is active in Chad’s mobile inbox workflow and is the live inbox operating layer. Therefore, the OS may model both rails as active, but must pause automation on zero credits, missing extension, paid-account mismatch, AI disabled state, MCP error, permission expansion, uncertain account identity, or any attempted external mutation.

Automation tiers remain: read-only by default; draft-only when preparing replies or tasks; approval-required for sends, deletes, calendar writes, CRM writes, public posts, file uploads, API key changes, credit purchases, payment actions, database mutations, and production deployments; safe internal automation only for logs, doctrine notes, proof records, and non-public queue updates already authorized by doctrine.
