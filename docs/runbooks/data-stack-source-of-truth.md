# Data Stack Source of Truth — AthlynXAI Platform

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

**Author:** Manus AI  
**Status:** Binding operational verdict  
**Scope:** AthlynXAI platform database-provider authority, connector interpretation, and production proof requirements.

## Verdict

AthlynXAI uses **Neon PostgreSQL as the primary application database provider**, **Supabase as the realtime and storage layer**, and **PlanetScale/MySQL only as stale legacy fallback references unless the Vercel runtime proves otherwise**. The exact production database host is not established by memory, provider dashboards, connector visibility, or project names. It is established only by reading the Vercel production `DATABASE_URL` for `chad-a-doziers-projects/athlynx-platform` immediately before a database write, migration, cleanup, or provider-level claim.

> **Runtime truth beats connector visibility.** A connector can prove that an account or project exists, but only Vercel production runtime configuration proves what the live application is using.

## Provider Roles

| Provider | Current Role | Evidence Boundary | Operational Rule |
|---|---|---|---|
| Neon | Primary PostgreSQL provider for AthlynXAI application data. | Server runtime code uses PostgreSQL through Drizzle and `pg`; Vercel production `DATABASE_URL` remains the only exact runtime-host proof. | Do not run migrations or writes until the production `DATABASE_URL` host is freshly verified and Chad approves the write. |
| Supabase | Realtime broadcast, presence, and storage layer. | Server and client Supabase files implement broadcasts, realtime channels, and storage buckets; current connector probe shows active Supabase project but no primary-database footprint. | Do not treat Supabase as the primary app database. Do not create tables, migrations, edge functions, or storage changes without approval. |
| PlanetScale / MySQL / TiDB | Legacy reference only. | `PLANETSCALE_DATABASE_URL` appears only as a fallback path; old MySQL/TiDB comments are stale. No active PlanetScale connector or runtime proof exists in the current lane. | Close the PlanetScale ticket as no active AthlynXAI production footprint unless Chad provides contrary runtime evidence. |
| Vercel | Production runtime authority. | Canonical project is `athlynx-platform` under `chad-a-doziers-projects`, project id `prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU`; latest connector-visible production deployment is `READY`. | Vercel production `DATABASE_URL` is the only authoritative source for exact DB host. |

## What Was Verified This Session

The connected Vercel project proof succeeded for the canonical project. The project id is `prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU`, the account id is `team_7neDSatyrDspOku2p0LxT8zO`, and the latest production deployment was reported `READY` for commit `7b575122965da469a0ee60dc4321a3c959a00178`. This proves the canonical Vercel project is reachable and production is not blocked. It does **not** expose production environment variables.

The connected Neon account currently exposes organization `AthlynX Corporation` and project `delicate-sun-75928916` in `aws-us-east-2` with PostgreSQL 17. This proves Neon connector visibility. It does **not** by itself prove that this exact project is the Vercel production runtime host.

The connected Supabase account currently exposes project `pgrbkisgwpxgphpqmual`, named `AthlynXAI`, in `us-west-2`, with status `ACTIVE_HEALTHY`. Current probes recorded zero Supabase tables, zero migrations, and zero edge functions in the project audit files, which supports the realtime/storage-only role.

No PlanetScale connector was available in the current lane, and the repository scan found only legacy fallback references. Therefore, PlanetScale ticket `#32239` should be closed with the explanation that AthlynXAI has no active production PlanetScale footprint unless Chad supplies new live runtime evidence.

## Required Language for Future Sessions

Future agents must use this wording when summarizing the stack:

> **Neon is the primary production database provider, but the exact production database host must be read from Vercel production `DATABASE_URL` before any DB write or migration. Supabase is realtime/storage only. PlanetScale/MySQL/TiDB references are legacy unless the Vercel runtime proves otherwise.**

This wording intentionally avoids claiming that a connector-visible Neon project is production unless Vercel runtime proof is available in that same decision window.

## Stop Conditions

| Situation | Required Action |
|---|---|
| Vercel production env cannot be read and a DB write/migration is requested. | Stop and ask Chad for the approved Vercel owner-token or owner-console verification path. |
| A connector-visible Neon project differs from an older production-host document. | Do not pick either by memory. Read Vercel production `DATABASE_URL` or stop. |
| Supabase appears active and healthy. | Treat it as realtime/storage unless table, migration, or runtime proof says otherwise. |
| PlanetScale ticket or old MySQL language appears. | Treat as legacy unless Vercel runtime proof says otherwise. |
| Perplexity produces a build or draft. | Manus must review, commit approved source to GitHub, wait for Vercel production deployment, and verify live before calling it shipped. |

## References

[1]: ./runtime-source-of-truth.md "Runtime Source of Truth — Vercel DATABASE_URL"  
[2]: ../policies/canonical-authority.md "Canonical Authority — AthlynXAI Production"  
[3]: ../incidents/2026-05-16-wrong-neon-target.md "Incident: Wrong Neon Target Migration"  
[4]: ./perplexity-fresh-session-handoff.md "Perplexity Fresh-Session Handoff — AthlynXAI Platform"
