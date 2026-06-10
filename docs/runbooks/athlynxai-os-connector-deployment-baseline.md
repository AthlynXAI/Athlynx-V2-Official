# AthlynXAI OS Connector and Deployment Baseline

**Author:** Manus AI  
**Status:** PR-safe operating runbook  
**Scope:** AthlynXAI OS, Full Stack Layer Cake, Auto SEO, CRM, Trail, NIL Portal, NIL Feed, Messenger, Diamond Grind, deployment, monitoring, backups, and connector operations.

## Purpose

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

This runbook exists so AthlynXAI OS does not lose work, repeat connector setup, or confuse preview work with production work. The platform must be treated as a full operating system, not a single page or isolated feature. Every build lane must preserve the same discipline: verify the connector, verify the repo, verify the deployment, verify monitoring, and record the result before calling the work complete.

## Live Source-of-Truth and No-Hibernation Doctrine

AthlynXAI OS work must operate from live connected systems and persistent environments, not from temporary sandbox assumptions. GitHub is the canonical source of code history, Vercel is the live deployment surface, Neon and approved databases are the data layer, Sentry is the health signal, Google Workspace is the operating layer for business files and communications, and the cloud computer is the persistent workbench. A temporary session, preview tab, local build artifact, or hibernated sandbox is never enough by itself to declare work complete.

The no-hibernation rule means important work must be committed, pushed, backed up, or written into a persistent runbook before a session ends. Long-running services, scheduled jobs, and reusable workspaces must live on the cloud computer or managed production systems with explicit restart and monitoring rules. If a session resumes after interruption, the first move is to verify live state from connectors before making new changes.

## New-Session Hard Refresh Doctrine

Every new day or materially new work session starts from a clean session state before implementation begins. This rule applies to Manus, Perplexity, and any other operator in the AthlynXAI OS lane.

| Checkpoint | Required Rule |
|---|---|
| Fresh session | Start a new session for the day or lane before production, connector, email, calendar, database, payment, social, or deployment work. |
| Lane confirmation | Confirm the active checklist, account identity, repository, production surface, and handoff owner before touching external systems. |
| Connector proof | Verify every needed connector is present, authenticated, and functional with a harmless live capability check. Connector presence alone is not enough. |
| Scope proof | Gmail and Google Calendar require live OAuth scope checks. Browser login and API keys do not prove mailbox/calendar write access. |
| Google identity proof | Treat Google Workspace as one account-switcher environment. Confirm the active signed-in account, intended sender, organizer, and accepted recipient chips before any send or invite. |
| Screenshot proof | When Chad sends a screenshot or image for verification, open and inspect the image directly unless he explicitly says not to. Chat-preview text alone is not enough when the screenshot is the evidence. |
| Stop condition | If a connector is stale, disconnected, missing scopes, affected by sandbox hibernation/session drift, Gmail reports malformed recipients, or screenshot evidence has not been directly inspected when requested, stop and reconnect, repair, inspect, or ask Chad before continuing. |
| Completion rule | No task is marked done until the system that performed it has a fresh-session connector proof and evidence trail. |

This doctrine exists because long-running sessions and hibernated sandboxes can lose connector state, stale OAuth scopes, or partial tool access. A clean session and connector proof comes before work, every time.

## Perplexity-to-Manus Delivery Doctrine

Perplexity may build or draft new code, research packets, connector-side fixes, or implementation artifacts, but Perplexity does **not** own the production commit path. The permanent delivery lane is: **Perplexity builds new code or artifacts → Perplexity hands the work to Manus and Chad → Manus and Chad review, verify, and commit to GitHub → GitHub triggers Vercel auto-deploy → Manus verifies the live deployment.**

Perplexity handoffs must include changed files, intent, tests, risks, secrets/connector assumptions, and a clear statement of what was not done. Manus must compare the handoff against the GitHub source of truth, reject archives/secrets/private investor material from production commits, run the appropriate checks, commit only approved source changes, and confirm Vercel production health after GitHub auto-deploys. No code is considered shipped because it exists in Perplexity, a browser, a zip, a chat, or a local workspace; it is shipped only after the Manus/Chad GitHub commit path and Vercel live verification complete.

The detailed Perplexity fresh-session handoff packet and stop conditions are binding in `docs/runbooks/perplexity-fresh-session-handoff.md`. Perplexity must not claim production completion unless Manus has committed approved source to GitHub, the canonical Vercel project has deployed the matching commit, and Manus has verified the live deployment.

## Repo Identity Rule

Repository-facing work must use **chaddozier75@gmail.com** as the commit email and the canonical repo **AthlyXAI/AthlynX-V2-Official**. Business mailboxes such as **cdozier14@athlynx.ai** and **cdozier14@dozierholdingsgroup.com.mx** may be used only for their business/workspace contexts after proof; they are not repo, Vercel, connector-control, or production-verification workarounds.

## Google Workspace Active-Identity and Verified-Recipient Rule

AthlynXAI Google mail is a **single Google Workspace / Gmail account-switcher environment**. The operator must not confuse the active browser identity, Gmail connector identity, Calendar organizer, and intended branded sender. The standard operating identity for connectors, repo-facing operations, broad cleanup, and general inbox work is `chaddozier75@gmail.com`. Use the mailbox that matches the business context: `chaddozier75@gmail.com` for personal/repo/app connector/broad Google Workspace operations, `cdozier14@athlynx.ai` for AthlynXAI Corporation business workspace, and `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business workspace. Every mailbox still requires live identity and scope proof before any read, send, cleanup, invite, or mutation.

Before any outbound Gmail or Google Calendar action, verify the live fields from the actual compose or event editor. For email, confirm **From / signed-in account**, **To**, **Cc**, **Bcc if used**, **Subject**, and **Body**. For calendar, confirm **organizer account**, attendees, date, time, time zone, Meet link, and description. URL parameters, hidden draft fields, visible thread text, and typed-but-unaccepted recipient text are not sufficient proof.

If Gmail reports `Please specify at least one recipient`, if addresses are placed into the subject line, if recipient chips are not accepted, or if the organizer identity is wrong, the operator must stop immediately. Do not keep clicking Send. Repair or discard the malformed draft/event, ask Chad if needed, and only proceed after the visible live state proves the identity and recipient fields are correct. Do not use any mailbox as a workaround for connector, repo, deployment, or cleanup problems. Use the correct business mailbox for the correct business purpose only after proof, and never store plaintext passwords or tokens in documentation or source control.

When Chad sends a screenshot or image as proof, the operator must open and inspect that screenshot directly unless Chad explicitly instructs not to open it. The screenshot may contain account-switcher state, calendar visibility, connector status, recipient chips, or other operational evidence that cannot be safely inferred from the chat preview alone. If screenshot evidence and connector output conflict, record both, explain the discrepancy, and use the live system state plus Chad's visual evidence to choose the safest correction path.

| Identity Item | Required Rule |
|---|---|
| Commit email | `chaddozier75@gmail.com` |
| Prohibited GitHub identity | `retired-non-chad-lane` |
| Prohibited practice | Using any business mailbox as a repo, Vercel, connector-control, or production-verification workaround; storing plaintext passwords or tokens |
| Merge authority | Chad only |
| Main branch pushes | Not allowed by agents |

## Connector Baseline

The AthlynXAI OS connector stack should be verified one connector at a time. Verification is read-only unless Chad explicitly approves a mutation.

| Connector / Service | AthlynXAI OS Role | Default Safety Boundary |
|---|---|---|
| GitHub | Canonical source code, PRs, branch history, review trail. | No main push or merge by agents. |
| Vercel | Preview and production deployment surface for the live platform. | No production promotion without Chad approval. |
| Neon | Primary PostgreSQL provider for platform application data. Exact runtime host is proven only by Vercel production `DATABASE_URL`. | No SQL writes, schema changes, or migrations without approval and fresh Vercel runtime-host proof. |
| Sentry | Error monitoring and post-deploy health checks. | Read-only issue checks unless approved. |
| Cloudflare | Future edge, DNS, Workers, KV, R2, D1, Hyperdrive, caching, routing. | No DNS, Worker, KV, R2, D1, Hyperdrive, routing, billing, or secret changes without approval. |
| Google Workspace / Drive | Business source-of-truth storage, backups, docs, files. | No destructive file actions without approval. |
| Gmail | Email OS and future receipt/CRM ingestion source. | No sends, deletes, unsubscribes, or inbox mutations without approval. |
| Google Calendar | Calendar brief, meeting workflow, CRM task timing. | No event creation or edits without approval. |
| Stripe | Payments, subscriptions, ledger evidence, Trail finance ingestion. | No charges, refunds, products, prices, customers, invoices, payment links, or webhooks without approval. |
| Supabase | Realtime broadcast, presence, and storage layer only unless Vercel runtime proof says otherwise. | No table writes, schema changes, edge functions, or storage mutations without approval. |
| Fireflies | Meeting transcription and conversation insight. | No sharing or external sends without approval. |
| Zapier | Workflow bridge between CRM, content, email, social, and operational tools. | No live Zap actions without approval. |
| Buffer | Social queue and scheduling candidate. | No posting or scheduling without approval. |
| Twilio | SMS/phone integration candidate. | No SMS/phone sends without approval. |
| Gravatar | Identity/profile enrichment candidate. | No profile/account mutations without approval. |
| Trello | Task/work board candidate. | No board/card mutations without approval. |
| Jira / Atlassian / Confluence | Product, issue, and documentation operating layer. | No ticket/page mutations without approval. |
| Expo | Mobile app build and submission lane. | No builds/submissions without approval. |
| Cloud Computer | Persistent AthlynXAI OS work environment. | No public service exposure without auth, firewall, and approval. |

## No-Placeholder Product Quality Gate

AthlynXAI OS must not ship placeholders, empty shells, fake flows, dead buttons, broken routes, or claims that are not supported by a working user path. A feature is not considered complete because a page exists; it is complete only when a real user can understand it, reach it, use it, and move to the next intended action without confusion.

The athlete and user experience must support full autonomy over their profile, proof, schedule, communications, and growth path. AI Coaches, AI Trainers, and Fuel Bots are part of the operating system standard: they should help athletes become better balanced people, not just better performers. Any AI automation must be useful, safe, explainable, and connected to real CRM, messaging, calendar, evidence, or profile actions.

| Quality Gate | Required Standard |
|---|---|
| No placeholders | No blank cards, fake metrics, dead CTAs, empty dashboards, or unfinished pages presented as complete. |
| No empty shells | Every major surface must have a clear purpose, user action, and next step. |
| No broken flows | Login, onboarding, profile, Playbook, NIL, Feed, Messenger, Diamond Grind, CRM, and Trail routes must be tested before completion. |
| Sentry-tested | New deploys must include a read-only Sentry check for unresolved issues. |
| User autonomy | Athletes and users must be able to control their profile, proof, visibility, communications, and next steps. |
| AI Coaches and Trainers | AI guidance must support training, recruiting readiness, profile completion, proof organization, and balanced life support. |
| Fuel Bots | Fuel Bots must assist with healthy routines, reminders, balance, and personal operating support where approved. |
| Human approval | Any outbound AI action involving social, email, SMS, payments, or sensitive account changes requires Chad approval. |

## Forward-Only Deployment Gate

The Smith Standard includes a forward-only deployment rule: code is not complete until it is verified on the correct deployment target. Preview work and production work must be labeled separately.

| Gate | Required Check |
|---|---|
| Repo gate | Confirm repository, branch, PR number, and commit SHA. |
| Identity gate | Confirm commit email is `chaddozier75@gmail.com` and prohibited identities are absent. |
| Build gate | Run local TypeScript/build checks when dependencies allow. |
| Secret gate | Scan changed files for tokens, passwords, API keys, `.env`, and credential material. |
| Vercel gate | Confirm deployment target is the correct `athlynx-platform` project. |
| Route gate | Confirm the new route returns HTTP 200 on the preview deployment. |
| Production gate | Confirm whether the route is preview-only or live production; do not blur the two. |
| Sentry gate | Run read-only unresolved issue check after deploy. |
| Data-stack gate | Apply `docs/runbooks/data-stack-source-of-truth.md`: Neon is primary provider, Supabase is realtime/storage, PlanetScale/MySQL/TiDB is legacy unless Vercel runtime proves otherwise. |
| Neon gate | Confirm project visibility read-only if database-backed work is involved, but never treat connector visibility as runtime proof. |
| Backup gate | Confirm source snapshot or GitHub commit history is recoverable. |
| Approval gate | Chad approves merges, production promotions, DB writes, and external communications. |

## PR #50 Current Context

PR #50 is the Auto SEO / Smith Standard / Athlete Playbook implementation branch. The latest known live-site work added the first sport-specific Athlete Playbook funnel route while preserving the parent concept of **The Athlete Playbook** as the multi-sport system.

| Item | Current Context |
|---|---|
| PR | `#50` |
| Branch | `manus/auto-seo-roadmap` |
| Latest known commit | `60542b9 feat(playbook): add baseball recruiting lead funnel` |
| Vercel preview route | `/playbooks/baseball-recruiting` |
| Alternate route | `/baseball-recruiting-playbook` |
| Parent concept | The Athlete Playbook, with sport-specific variants. |

## No-Lost-Work Rule

Every session must end with a restart note that records: current branch, latest commit, PR link, Vercel preview URL, production status, Sentry status, Neon status if relevant, backup location, next lane, and any blocked connectors. If the next session starts without that note, the first action is to recreate the state before making changes.

## Next 9:00 AM CT Operating Lane

The next session should begin by verifying all connected MCP/API services one by one, then continue the full-platform AthlynXAI OS orchestration audit. The goal is to make the already-built 180+ page, 100,000+ line platform accessible and usable as one integrated operating system.
