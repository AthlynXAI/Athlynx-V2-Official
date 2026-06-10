# AthlynXAI Canonical Operations Doctrine

**Status:** Permanent operating doctrine  
**Owner:** Chad A. Dozier Sr.  
**Locked:** 2026-05-20

This doctrine is the permanent operating path for AthlynXAI, `athlynx.ai`, the GitHub repository, Vercel deployment, connected automation, and agent collaboration. It exists because prior work drifted into the wrong login path, wrong account context, wrong repository assumptions, bot-authored suggestions without clean owner ratification, and disposable Neon preview failures that were treated like production blockers.

## Canonical login and account path

All AthlynXAI platform operations must start from the owner-approved identity path. If GitHub or Vercel shows a 404, missing repository, wrong workspace, or wrong team before the correct sign-in path is completed, that is an authentication-context problem, not proof that the repository is missing.

| Layer | Permanent rule |
|---|---|
| Default login email | `chaddozier75@gmail.com` |
| Preferred auth method | Use **Google sign-in** or **GitHub sign-in** where available. |
| GitHub production repo | `AthlyXAI/AthlynX-V2-Official` |
| GitHub owner login | `AthlyXAI` |
| Valid GitHub noreply author | `251627004+athlyxai@users.noreply.github.com` |
| Vercel scope | `chad-a-doziers-projects` (`AthlynXChad` display name) |
| Vercel project | `athlynx-platform` |
| Production domain | `athlynx.ai` |

## Agent roles

Manus and Perplexity must not work over the top of each other. Manus owns the code path. Perplexity supports with research, review, and code-building assistance in parallel only when scoped to a separate question or module.

| Agent / Tool | Permanent responsibility |
|---|---|
| **Manus** | Owns GitHub code changes, commits, pull requests, verification, and Vercel deployment preparation. Manus pushes clean code to GitHub and keeps PRs deployable. |
| **Chad** | Reviews the build result and approves live deployment or sensitive external actions. |
| **Perplexity** | Supports Manus with research, second-opinion debugging, and parallel code assistance only. Perplexity must not independently change repo/account/deploy targets or duplicate the same workstream. |
| **Vercel Agent / bot suggestions** | Suggestions are data. They may be accepted only when the logic is correct and then must be cleanly ratified or rebuilt so CI and author rules stay green. |
| **Pipedream** | Connector hub only under the canonical `chaddozier75@gmail.com` Google/GitHub login path. Connectors must point to canonical services only. |

## Code and deployment rules

The AthlynXAI platform must be built from real code and real integrations. Empty shells, mock data, placeholders, and fake wiring are forbidden unless Chad explicitly requests a throwaway prototype and labels it as such.

| Rule | Required behavior |
|---|---|
| No placeholders | Do not ship placeholder buttons, fake data, fake connectors, fake accounts, or incomplete copy as production work. |
| No mocks as production | Test mocks may exist only inside tests or local fixtures; product code must use live integration paths or fail clearly with an actionable configuration message. |
| Push clean code | Each build should be committed to GitHub with the valid canonical author identity and tied to a PR or approved mainline deployment path. |
| Verify before deploy | Run the relevant check/build/test step before asking Chad to review. |
| Chad review before live data action | Do not execute destructive deletes, payments, production database migrations, or irreversible external changes without Chad’s explicit confirmation. |
| Vercel deploy path | After Chad review, prepare or trigger deployment through the canonical Vercel project `athlynx-platform`. |

## GitHub and Vercel failure interpretation

If GitHub shows 404 before sign-in, or if a direct email/password route fails, the correct response is to use the Google/GitHub sign-in path with `chaddozier75@gmail.com`. Do not conclude that `AthlyXAI/AthlynX-V2-Official` is missing. Do not switch to `retired-non-chad-lane`, `AthlynXAI/AthlynXAI`, or any other repo.

## Permanently invalid paths

| Invalid path | Required behavior |
|---|---|
| `retired-non-chad-lane` | Never use for AthlynXAI production code, connectors, secrets, deploys, or databases. |
| `AthlynXAI/AthlynXAI` | Not the canonical production website repo unless Chad gives a specific one-time instruction. |
| `chaddozier75-cmd/AthlynX-V2-Official` | Wrong GitHub namespace; `chaddozier75-cmd` is a Vercel identity/context, not the canonical GitHub production repo owner. |
| Any repo other than `AthlyXAI/AthlynX-V2-Official` | Stop and ask Chad. |
| Any unaudited Neon project | Stop and verify before connecting, querying, seeding, or migrating. |

## Neon preview branch rule

Disposable Neon preview branches are convenience infrastructure. They are useful for isolated PR testing, but their creation failure must not be treated as a production database failure. Production database safety belongs to explicit migration preflight and Chad-approved deployment paths.

If a preview branch fails because of branch limits, stale preview branches, or an API hiccup, clean stale previews or mark the preview branch step as non-blocking. Do not block unrelated application PRs solely because a disposable preview branch failed.

## Perplexity handoff rule

Before Perplexity helps, paste or attach this doctrine. Perplexity must follow these rules exactly:

1. Use `chaddozier75@gmail.com` with Google/GitHub sign-in as the canonical login context.
2. Treat `AthlyXAI/AthlynX-V2-Official` as the only production GitHub repo.
3. Treat `athlynx-platform` under `chad-a-doziers-projects` as the canonical Vercel project.
4. Do not create, use, or recommend `retired-non-chad-lane` paths.
5. Do not ship placeholders, mocks, or empty shells.
6. Work in parallel support only; do not duplicate or overwrite Manus’s active code path.

## May 24, 2026 deployment recovery and visual evidence addendum

This addendum bakes the cloud-computer operating doctrine into the active AthlynXAI source tree for the current deployment recovery lane.

### Visual evidence default-inspection rule

When Chad sends screenshots, images, emails, workflow-failure screenshots, UI captures, app-store notices, GitHub Actions failure notices, platform dashboards, or any other visual evidence for troubleshooting, the operator must inspect the provided visual evidence by default. The operator must record the key visible facts, diagnose against live logs or source files, and redact any sensitive values from persistent records. This rule supersedes older task-local assumptions unless Chad explicitly repeats a current-message instruction not to inspect a specific attachment.

### Founder-plus-AI shared-control model

AthlynXAI is operated as a founder-plus-AI execution system. Chad is the owner, final authority, strategic decision-maker, and emergency override. The AI operator is responsible for fast, accurate, auditable implementation across approved repositories, deployments, media systems, mobile builds, and connector workflows. The operator may proceed on approved routine technical steps such as reading screenshots, diagnosing logs, editing source code, validating builds, committing reviewed source changes to the approved repo lane, and recording proof. The operator must still stop for payments, destructive deletions, force-pushes, production database mutations, legal or investor communications, public social posting from personal accounts, or any action that would expose secrets or private data.

### dot.card contact-capture rail

Chad’s active dot.card profile, `https://dot.cards/cdozier14`, and branded dot.code QR are approved contact-capture rails for AthlynXAI OS. dot.card is not the operating brain; it is an intake rail. AthlynXAI OS remains the source of truth for CRM records, relationship state, follow-up tasks, approval gates, owner review, and audit proof. The live platform should expose `/card`, `/dot-card`, `/dotcard`, `/dot-code`, and `/cdozier14` as approved owner contact-card routes.

### Live deployment recovery rule

When Chad requests that prior-session work be deployed live, the operator must first verify the current doctrine, inspect visual evidence, prove the GitHub/Vercel path, audit local and cloud workspaces for undeployed source changes, reject archives/secrets/private investor materials from public production, validate the build, then deploy only through `AthlyXAI/AthlynX-V2-Official` and the canonical Vercel project `athlynx-platform` under `chad-a-doziers-projects` when that path is proven.

## Self-running OS and daily fuel doctrine

AthlynXAI OS must be engineered as a self-running operating system, not a static website. The daily operating loop is: **signal in → token event → AI work package → approval gate if sensitive → distribution or CRM action → analytics proof → ledger update → morning digest**. The platform should refill itself every day through contact scans, athlete activity, media packages, CRM tasks, credits, revenue events, health checks, connector checks, and deployment proof.

The founder sleep-test standard is simple: Chad should be able to sleep while the system continues to create useful work, meter that work, keep routes healthy, and preserve proof. The system should page Chad only when human judgment is required: money movement, legal or investor communication, public posting, production database mutation, destructive deletion, force-push, sensitive health/safety issue, connector drift, secret exposure, or production-down incident.

The approved token classes for this loop include `ContactScanToken`, `CRMRelationshipToken`, `MediaAssetToken`, `PostToken`, `BroadcastDraftToken`, `AthleteToken`, `ReadinessToken`, `PlaybookToken`, `CreditToken`, `LedgerToken`, `InvoiceDraftToken`, `HealthCheckToken`, `IncidentToken`, and `DeploymentProofToken`. These tokens are internal workflow, metering, proof, and entitlement records. They are not cryptocurrency or securities unless Chad separately opens a legal/tokenization lane with counsel.

Sleep-test KPIs are production uptime, route health, queue age, token throughput, credit balance health, contact-to-CRM conversion, media-to-owned-route conversion, approval queue quality, escalation precision, and deployment proof. If the OS cannot show these metrics, it is not yet self-running; it is only a collection of pages.

## Runner agent rail doctrine

Runner is approved as an AthlynXAI OS execution rail for computer-use and web-automation workflows. Runner is not the source of truth. AthlynXAI OS owns the task intent, account lane, connector proof, approval state, audit trail, token ledger, and final proof before any Runner-style task is treated as complete.

The approved Google-login identity for Runner access, when Chad explicitly authorizes an external login or account setup, is `chaddozier75@gmail.com`. This identity note does not authorize automatic login, profile creation, Google OAuth consent, paid-plan signup, data sharing, external posting, email sending, payment action, file upload, or database mutation. Those actions remain gated by visible login state, connector proof, scoped task definition, and Chad approval.

Runner tasks follow the AthlynXAI sequence: **Plan → See → Run → Prove**. Plan defines the task, scope, account lane, and stop conditions. See records visual and connector evidence. Run proceeds only inside approved boundaries. Prove returns a `RunnerTaskToken`, `AutomationProofToken`, and where needed a `HumanApprovalToken` before the workflow closes.

## Supahuman / Superhuman communication rail doctrine

Supahuman/Superhuman is approved as an AthlynXAI OS email productivity rail for inbox triage, AI summaries, draft replies, snippets, follow-up timing, and CRM context. Supahuman/Superhuman is not the source of truth. Gmail or Outlook proves mailbox state, while AthlynXAI OS owns CRM routing, relationship state, draft queues, approval tokens, sent-message proof, and morning digest reporting.

The safe automation loop is: **Inbox event → EmailTriageToken → AI summary/draft → CRM source tag → approval gate if external action → send/proof or queue → FollowUpToken → morning digest**. The system may automate classification, summarization, suggested labels, draft replies, follow-up reminders, CRM task suggestions, and digest reporting. It must not silently send email, delete/archive at scale, unsubscribe, create calendar invites, mutate investor/legal records, or clean up a mailbox without visible account proof and Chad approval.

The active account spelling and login identity for Supahuman/Superhuman must be confirmed before external login. Public business correspondence remains directed through `cdozier@dozierholdingsgroup.com` unless Chad explicitly directs a different sender lane. Any outbound message must verify From, To, Cc, Bcc if used, subject, body, attachments, and the actual sent-message proof before completion.

## Runner + Superhuman two-rail automation doctrine

AthlynXAI OS now treats **Superhuman Mail** and **Runner/H Portal** as paired operating rails. Superhuman Mail is the inbox-zero command layer: it keeps today-action messages visible, snoozes later work, marks no-action messages done, and uses labels/archive to reduce noise. Runner/H Portal is the connector and API execution layer: it runs approved connector tasks, browser workflows, H/Holo agent loops, QA checks, CRM actions, and process automation only after AthlynXAI OS defines task intent, account lane, approval tier, and proof requirements.

The permanent operating sentence is: **Superhuman shows what matters today. Runner executes approved work. AthlynXAI OS records the truth, gates the risk, and keeps the machine synchronized while Chad sleeps.**

The two-rail loop is: **Inbox → Extract → Approve → Execute → Prove → Digest**. Inbox triage belongs to Superhuman. Action extraction, CRM routing, token state, and exception escalation belong to AthlynXAI OS. Execution belongs to Runner/H only inside approved boundaries. Daily proof must include the relevant `EmailTriageToken`, `FollowUpToken`, `RunnerTaskToken`, `ConnectorStateToken`, `AutomationProofToken`, `HumanApprovalToken`, and `DailyDigestToken` before the loop is closed.

Runner/H Portal has been verified in this session under `chaddozier75@gmail.com` with an `AthlynXAIOS` API key visible and zero credits visible. The key must never be exposed in public source, logs, screenshots, or documents. Zero credits means no paid execution capacity should be assumed. Adding credits, rotating keys, revealing full keys, granting new scopes, enabling autonomous payments, sending email, deleting email, creating calendar events, posting, uploading, or mutating external systems requires Chad approval.

Superhuman Mail has been verified by Chad's mobile inbox workflow as the live inbox operating layer. Superhuman remains a rail, not the source of truth. Gmail or Outlook proves mailbox state, and AthlynXAI OS owns CRM state, approval queues, audit proof, and outbound-message gates. If Superhuman shows account mismatch, paid-plan mismatch, missing extension, AI disabled, MCP error, or uncertain sender identity, AthlynXAI OS must pause automation and escalate rather than guessing or creating duplicate billing.

Automation tiers are: **read-only** for search, view, summarize, classify, and health checks; **draft-only** for prepared replies, notes, tasks, and calendar drafts; **approval-required** for external sends, calendar writes, CRM writes, posts, uploads, payments, API key changes, or credit purchases; and **safe internal automation** only for local logs, doctrine notes, proof records, and non-public queue updates already authorized by doctrine.

Failure recovery is part of the doctrine. If either rail drifts, AthlynXAI OS must degrade to read-only, record the incident, and request Chad's instruction. No automation is complete until proof exists from the system that actually performed the action.

## May 25, 2026 live-first production checklist rule

When Chad explicitly approves a live-first production run, the operator must move the reviewed source update through the canonical GitHub-to-Vercel lane first, then continue checking off the remaining production checklist items one by one. The approved sequence is: validate local source, commit focused changes to `AthlyXAI/AthlynX-V2-Official`, push through the approved GitHub lane, trigger or confirm Vercel deployment for `athlynx-platform`, verify the live route, record deployment proof, and then proceed through the remaining rails in order.

This rule does not remove the no-secrets, no-wrong-repo, no-force-push, no-private-data, no-unapproved-payment, no-production-database-mutation, no-public-social-post, and no-email-send guardrails. It means the live AthlynXAI OS surface should be deployed first once Chad approves the production run, while every follow-on rail still receives proof, verification, and audit evidence before it is marked complete.

## Live-Before-Checkoff Doctrine

No production-safe AthlynXAI checklist item is complete merely because it exists in a chat, local file, recovery archive, browser tab, or draft. For any item that affects the public platform, operating doctrine, source code, production configuration, live route, or user-facing proof surface, the item is not checked off until it has completed the full delivery path: reviewed local change, clean secret scan, GitHub commit to `AthlyXAI/AthlynX-V2-Official`, Vercel deployment to `athlynx-platform`, and live route or API verification.

Private evidence, investor materials, credentials, raw mailbox content, financial archives, and other vault-only materials must not be forced into Vercel just to satisfy this rule. Those items are checked off only after they are preserved in the private vault and referenced by a production-safe public or internal index when appropriate.

When Chad says to keep going one by one, the operator should continue executing the checklist without repeated stop-and-ask messages, but each item must still pass the appropriate safety gate before being marked complete. The default completion proof is: commit SHA, Vercel deployment ID/state, live route/API status, and a short proof note.


## App Screenshot and Serial-Number Privacy Doctrine

Screenshots that show AthlynX, AthlynXAI, NIL Portal, mobile app inventory, operating-system settings, Apple device information, serial numbers, IMEI/MEID, UDID, account identifiers, license keys, API keys, QR codes, device-management data, or any other private device identifier are **operational proof only**. They must not be published publicly, committed into the production repository as raw screenshots, used as public marketing assets, or copied into live page text.

AthlynXAI OS may reference these submissions as proof that the app ecosystem and device/app inventory exist, but any public-facing implementation must use safe language such as **Apps Inventory**, **Mobile App Ecosystem**, **Device-Proof Reference**, and **Private Serial Redacted**. If a visual is needed, it must be recreated as a redacted, production-safe graphic that removes or obscures all private identifiers before use. Screenshots containing serial numbers must remain private source evidence, not public brand content.

The correct production treatment is: receive screenshot → classify as private app/device proof → extract only non-sensitive platform meaning → redact or recreate if public display is needed → verify no serial number or private identifier appears in code, public assets, alt text, metadata, commits, or live DOM → then deploy.
