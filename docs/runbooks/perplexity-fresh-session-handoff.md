# Perplexity Fresh-Session Handoff — AthlynXAI Platform

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

**Author:** Manus AI  
**Status:** Binding production handoff rule  
**Scope:** AthlynXAI platform research, build drafts, connector troubleshooting notes, implementation packets, and production handoff from Perplexity to Manus and Chad.

## Purpose

This runbook prevents a repeat of the connector-overlap and database-provider confusion that occurred across the Supabase, Neon, PlanetScale, Vercel, Google Workspace, and GitHub lanes. Perplexity may research, inspect, draft, and package proposed work, but **Perplexity does not own production commits, production deployments, database writes, social posts, email sends, calendar sends, payment operations, or account changes**. Production movement belongs to the Manus plus Chad review lane, followed by GitHub source-of-truth commit and Vercel live verification.

> **Permanent rule:** if work is not committed to `AthlyXAI/AthlynX-V2-Official`, deployed by the canonical Vercel project `chad-a-doziers-projects/athlynx-platform`, and verified live by Manus, it is not shipped.

## Canonical Ownership Map

| Lane | Canonical Owner / Surface | Rule |
|---|---|---|
| GitHub source | `AthlyXAI/AthlynX-V2-Official` | Manus prepares and verifies source changes; Chad approves final production movement. |
| Vercel project | `chad-a-doziers-projects/athlynx-platform` / `prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU` | Use only the `chad-a-doziers-projects` scope. The `cdozier14` and `retired-non-chad-lane` scopes are prohibited for platform deploys. |
| Primary data provider | Neon PostgreSQL | The exact runtime host is read from Vercel production `DATABASE_URL` immediately before any DB write, migration, or provider claim. Connector-visible Neon projects alone are not production proof. |
| Realtime and storage | Supabase project `pgrbkisgwpxgphpqmual` | Supabase powers realtime broadcast, presence, and storage paths. It is not the primary AthlynXAI application database. |
| Legacy fallback | PlanetScale / MySQL references | PlanetScale has no active production connector in this lane. Old MySQL, TiDB, and PlanetScale references are legacy unless Chad provides live runtime evidence. |
| Branded email | `cdozier14@athlynx.ai` | AthlynXAI Corporation business/workspace context only; not a repo, Vercel, app connector, or broad cleanup workaround. Requires live From/To/Cc/subject/body proof before any send. |
| Primary connector identity | `chaddozier75@gmail.com` | Default identity for repo, Vercel, broad Google Workspace, and platform operations. |

## Non-Negotiable Fresh-Session Checklist

Every Perplexity session must start clean. Before producing any handoff, Perplexity must state whether each relevant connector is available, authenticated, and proven with a harmless read-only check. A green connector indicator means it is available to test; it does not prove that the connector is usable for that lane until a live read-only proof succeeds.

| Checkpoint | Required Perplexity Action | Stop Condition |
|---|---|---|
| Identity | Confirm intended lane, canonical repo, Vercel scope, and sender/account identity. | Stop if identity is ambiguous or points to `retired-non-chad-lane`. |
| GitHub | Read the current source branch and file paths before drafting changes. | Stop if source cannot be compared to `AthlyXAI/AthlynX-V2-Official`. |
| Vercel | Treat Vercel production as the runtime source of truth. | Stop if production environment variables are needed but cannot be read by the approved owner path. |
| Database | Distinguish provider role from runtime proof. Neon is primary; Supabase is realtime/storage; PlanetScale is legacy unless runtime proves otherwise. | Stop before any DB write, migration, schema cleanup, or secret change without Manus plus Chad approval. |
| Google Workspace | Confirm live sender/organizer and accepted recipient chips before any draft handoff that may be sent later. | Stop if Gmail or Calendar field proof is malformed or missing. |
| Social | Require real Buffer Channel/Profile ID, approved media URL, and exact caption. | Stop if any value is a template, placeholder, or guessed ID. |

## Exact Handoff Package Required From Perplexity

Perplexity must hand work to Manus in a single structured packet. The packet must not ask Manus to infer missing files, secrets, provider identity, or deployment status. If anything is missing, Perplexity must mark it **Blocked** rather than filling the gap with a guess.

| Required Section | Must Include |
|---|---|
| Intent | One paragraph explaining the production problem being solved and what should change. |
| Changed files | Exact file paths, whether each file is new or modified, and a concise reason for each change. |
| Patch or archive | A clean diff, PR branch, or ZIP that contains only source-safe files. No `.env`, private investor files, credentials, screenshots with secrets, or vault archives. |
| Tests run | Commands, outputs, and whether each check passed, failed, or was not applicable. |
| Runtime assumptions | Vercel project, environment, domain, database role assumptions, and any connector limitation. |
| Risks | Anything that could affect production behavior, data, email, social, billing, calendar, authentication, or DNS. |
| Secrets and connectors | Explicit statement that no secrets are included, no secret values were logged, and which connectors were only read-only. |
| Not done | Clear list of blocked work, missing approvals, missing credentials, or values Chad must provide. |
| Requested Manus action | Exact ask: review only, commit candidate, deploy candidate, live verification, draft email, ticket reply, or owner approval needed. |

## Database Verdict Language Perplexity Must Use

Perplexity must use the following language exactly unless Manus and Chad update this runbook later:

> **AthlynXAI production database provider is Neon PostgreSQL. The exact production host is not decided by the Neon console, project names, Supabase visibility, PlanetScale tickets, or memory. It is read from the Vercel production `DATABASE_URL` for `chad-a-doziers-projects/athlynx-platform` immediately before any DB write or migration. Supabase is realtime/storage only. PlanetScale is legacy fallback only unless the Vercel runtime proves otherwise.**

Perplexity may say that the connected Neon account currently exposes project `delicate-sun-75928916` under the `AthlynX Corporation` organization, but that statement is **connector visibility**, not production runtime proof. Perplexity may say that Supabase project `pgrbkisgwpxgphpqmual` is active and healthy, but it must also say that current read-only probes showed no Supabase primary-database footprint. Perplexity must not tell Chad that PlanetScale is active unless a current Vercel production environment read proves a PlanetScale runtime URL.

## Production Movement Boundary

Perplexity may not claim a fix is live. The only acceptable live-completion sentence is:

> **Manus reviewed the Perplexity handoff, committed the approved source changes to `AthlyXAI/AthlynX-V2-Official`, confirmed the canonical Vercel project deployed the matching commit to production, and verified the live route or health check.**

If that sentence is not true, the work is still a draft or handoff, not a shipped fix.

## Current Blocked Items That Perplexity Must Not Guess

| Item | Status | Required Next Input |
|---|---|---|
| Vercel production `DATABASE_URL` host proof | Blocked without approved owner Vercel CLI/token path. | Manus/Chad must provide or authorize the approved Vercel runtime-env read path. |
| Social OS seed | Blocked. | Chad must provide real Buffer Channel/Profile ID, approved image URL, and exact caption. |
| Brandon Smith confirmation email | Not proven sent. | Manus must verify Gmail send status or reattempt only after live From/To/Cc proof and Chad approval. |
| PlanetScale ticket #32239 | Draft-only. | Chad must approve the closeout reply before any send. |
| Apple Developer organization migration | Needs owner-account verification. | Chad or Manus must inspect Apple Membership account type and follow Apple support conversion path if needed. |

## References

[1]: ./runtime-source-of-truth.md "Runtime Source of Truth — Vercel DATABASE_URL"  
[2]: ../policies/canonical-authority.md "Canonical Authority — AthlynXAI Production"  
[3]: ../incidents/2026-05-16-wrong-neon-target.md "Incident: Wrong Neon Target Migration"  
[4]: ./athlynxai-os-connector-deployment-baseline.md "AthlynXAI OS Connector and Deployment Baseline"
