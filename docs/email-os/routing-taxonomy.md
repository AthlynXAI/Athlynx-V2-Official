# Email OS Routing Taxonomy

**Status:** Active. Governs the non-Platform mailbox lanes for AthlynXAI / Dozier Holdings Group.
**Companion document:** `docs/policies/canonical-authority.md` (governs the Platform / Layer Cake lane).
**Source:** Adapted from Manus AI, *Backend Email OS Routing Taxonomy*, 2026-05-16.

---

## Why This Document Is Separate

The Platform / Layer Cake lane (GitHub, Vercel, Neon, CI, secrets) has exactly one authoritative identity and one canonical owner email. Code and deploys must converge.

Mail does not. The Owner operates five distinct mailboxes, each authoritative for a different product role. Treating any one of them as "the" identity would collapse the routing model and break CRM intake. This document records the per-mailbox identity map so neither agents nor future safeguards retire a mailbox that is doing real work.

If `docs/policies/canonical-authority.md` and this document appear to conflict, they do not — they govern different lanes. Read both.

---

## Operating Principle

The Email OS exists to move fast. It should separate signal from noise, file business-critical communication by company and workstream, and keep only true action items in the Owner's working inbox. Inbox cleanup is the first layer of the future CRM / OS product, not a housekeeping feature.

---

## Account and Company Boundaries

| Mailbox / Identity | Product Role | Routing Rule |
|---|---|---|
| `cdozier14@dozierholdingsgroup.com.mx` | Dozier Holdings Group Workspace | DHG admin, security, finance, partner, and holding-company operations. |
| `cdozier14@athlynx.ai` | AthlynXAI Workspace | AthlynXAI-specific customer, athlete, product, scouting, and operating mail. |
| `chaddozier75@gmail.com` | **Platform / Layer Cake** | Platform infrastructure, GitHub, Vercel, Perplexity, build alerts, and system automation. **This mailbox is also the Platform-lane authoritative identity per `docs/policies/canonical-authority.md`.** |
| `chad.dozier@icloud.com` | Personal | Personal, consumer, legacy, and non-operational mail. |
| `cdozier@dozierholdingsgroup.com` | DHG business contact / alternate | Business-facing DHG contact path when used in forms or account setup. |

The `chaddozier75@gmail.com` row is the bridge between this document and `docs/policies/canonical-authority.md`. It appears in both because it serves two roles: routing target for platform/system mail, and authoritative commit / deploy / migration identity for the Platform lane.

---

## Backend Routing Classes

| Class | Keep Visible? | Destination | Examples |
|---|---|---|---|
| Security / access alerts | Yes | Security / Action Queue | Google Workspace security notice, Vercel new sign-in, Xfinity new device. |
| Active partner / lead | Yes | CRM / Partner Leads | Strategic partners, signed-document threads. |
| Platform system alerts | Usually no, unless failed/urgent | AthlynXAI OS / System Alerts | GitHub, Vercel, Sentry, TestFlight, Perplexity Computer. |
| Finance / billing / receipts | Usually yes until reviewed | Finance / Banking | Stripe, Apple receipts, utility payments, bank alerts. |
| Product infrastructure learning | No, unless directly tied to build | Product Research Archive | Supabase, Cloudflare, Railway, Auth0, Twilio, Google Cloud newsletters. |
| Consumer promotions | No | Archived Noise | Retail, travel, food promos. |
| Legacy personal | No | Personal Archive | iCloud-forwarded personal mail, old Outlook correspondence. |
| Unknown but possibly relevant | Yes | Needs Review | Ambiguous business contacts or one-off partner messages. |

---

## Test-Run Rule Set

The first backend test used conservative, recoverable actions:

- Archived from the working inbox rather than deleted.
- Connector messages labeled and routed where the connector exposed label controls.
- Browser-based Workspace Gmail messages archived only on high-confidence promotional or newsletter language.

---

## Front-End Product Implication

The Email OS front end should not look like a normal inbox. It should surface:

- An **Action Queue** for items needing the Owner's decision.
- A **Partner Pipeline** for active leads and signed-document threads.
- A **Security Lane** for access alerts and credential events.
- A **Platform Alerts Lane** for build, deploy, and infra signals.
- A **Noise Sink** that holds archived low-value mail recoverably.

The Owner should not have to scan thousands of emails. The OS should surface what matters and bury everything else.

---

## Automation Safety Rule

No destructive deletion runs automatically in the first product version. The backend may archive, label, score, summarize, and queue. Deletion, unsubscribe, sender blocking, account suspension, and credential/security changes require explicit Owner approval until the classifier has a proven history.

---

## Cross-Reference

- Platform-lane identity, commit author allow-list, and migration authority: `docs/policies/canonical-authority.md`.
- 2026-05-16 lane-confusion incident (Manus reported on the AthlynXAI Workspace mailbox while claiming to be reporting on the Platform mailbox): `docs/incidents/2026-05-16-wrong-neon-target.md` §F-5.
