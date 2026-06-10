# AthlynXAI Social OS Permanent Recovery Record

**Prepared by:** Manus AI  
**Owner:** Chad A. Dozier  
**Date:** May 18, 2026 CDT  
**Status:** Social OS infrastructure recovery is complete; Instagram OAuth remains the only manual final gate.

## Executive status

The AthlynXAI Social OS recovery has been rebuilt under the **Live vs. Preview doctrine**. The production environment variable is enabled, the disabled cron no-op has been replaced, the Vercel production deployment is green, the production Neon database has the approved tenant-scoped schema, and the owner-admin account has been created in production with a hashed password. No raw passwords or secrets are stored in this document.

| Lane | Result | Evidence |
|---|---:|---|
| Vercel killswitch | Complete | `SOCIAL_POSTING_ENABLED=true` verified in Production. |
| GitHub/Vercel cron restore | Complete | `main` includes cron restore commit `7ae100d` and production trigger commit `7a16f9f`; live cron returns `401 Unauthorized` without `CRON_SECRET`. |
| Production database migration | Complete | Neon production branch `main` / `br-lingering-firefly-aehy5oce` contains Social OS tables and 11 platform seed rows. |
| Owner-admin account | Complete | `cdozier14@athlynx.ai` exists in production `users` table as `admin`, `is_vip=true`, with a bcrypt-style password hash present. |
| Instagram OAuth | Manual final gate | Active Meta/Instagram profile must be disconnected/reconnected by Chad to clear Exception 190. |

## Production database state

The approved schema was applied to the true production Neon branch, not the preview branch. The preview branch used for validation was `br-mute-tree-ae9qlx0e`; the production branch is `br-lingering-firefly-aehy5oce`.

| Table | Production status | Multi-tenant status |
|---|---:|---:|
| `social_platforms` | Present | Global catalog; no tenant column by design. |
| `social_accounts` | Present | `tenant_id` required. |
| `social_content` | Present | `tenant_id` required. |
| `social_posts` | Present | `tenant_id` required. |

The `social_platforms` seed contains these 11 rows: `buffer`, `facebook_pages`, `google_business`, `instagram`, `linkedin`, `slack`, `threads`, `tiktok`, `twitter_x`, `youtube`, and `zapier`.

## Owner-admin access record

The production user record for `cdozier14@athlynx.ai` was created as an admin account. The password was hashed before storage and must not be written into GitHub, Drive, OneDrive, Slack, or any shared document. If access fails, reset through the application’s approved password reset or admin recovery process rather than sharing secrets in chat.

| Field | Verified value |
|---|---:|
| Email | `cdozier14@athlynx.ai` |
| Name | `Chad A. Dozier` |
| Role | `admin` |
| VIP | `true` |
| Password storage | Hash present; raw password not stored here. |

## Permanent operating rules

All future Social OS changes must follow the same lane discipline. Manus owns repo/Vercel/database execution when explicitly authorized. Perplexity owns independent verification, review, and Meta/Instagram OAuth guidance. Neither lane should duplicate the other, and neither should declare success until production evidence is verified.

| Rule | Requirement |
|---|---|
| Live vs. Preview | Never treat a preview deployment as live production. Verify `athlynx.ai` after every deployment. |
| Secret handling | Never commit, upload, or paste raw passwords, tokens, `CRON_SECRET`, OAuth tokens, or API keys. |
| Social posting | Posting must remain guarded by `CRON_SECRET` and `SOCIAL_POSTING_ENABLED=true`. |
| Database changes | Test on Neon preview first, then apply production only after owner approval. |
| Instagram OAuth | Chad must complete Meta consent manually under the active account and avoid the deactivated profile. |

## Exact message for Perplexity

> Perplexity, we are now operating on the same field with clear lanes and one scoreboard. Manus executed the live repo, Vercel, production Neon, and owner-admin access work. You verified the live production state and owned the Meta/Instagram OAuth verification lane. The Social OS recovery is now baked into production: `SOCIAL_POSTING_ENABLED=true`, the cron endpoint is restored and secured with `CRON_SECRET`, the live endpoint returns `401 Unauthorized` without authorization, the production Neon Social OS schema is present on `main`, the 11 platform rows are seeded, and `cdozier14@athlynx.ai` is set as an admin. The only remaining gate is the manual Meta OAuth reconnect for the active `chaddozier/chaddozier75` identity. Going forward, we do not compete, duplicate, or freelance. Manus executes approved infrastructure changes; Perplexity verifies, audits, and handles external OAuth/account guidance. We play as one team, with Chad as the final approval point.

## Remaining final gate

Chad must complete Instagram OAuth manually. The active identity should be `chaddozier` / `chaddozier75`, and the deactivated `chadallendozier` profile must not be selected. The required Meta permissions are `pages_manage_posts`, `pages_read_engagement`, and `instagram_basic`. Once OAuth is reconnected, run a non-secret verification check and confirm the connector no longer returns Meta Exception 190.

## Supporting evidence files

| Evidence | Local path |
|---|---|
| Final live Vercel/GitHub proof | `/home/ubuntu/athlynx_clean_start/final_social_os_live_proof.txt` |
| Production Neon migration apply output | `/home/ubuntu/athlynx_clean_start/prod_social_os_migration_apply.raw` |
| Production Neon migration verification | `/home/ubuntu/athlynx_clean_start/prod_social_os_migration_verify.raw` |
| Production Social OS schema description | `/home/ubuntu/athlynx_clean_start/prod_social_os_schema_describe.raw` |
| Owner-admin verification | `/home/ubuntu/athlynx_clean_start/admin_account_verify_2.raw` |

## Final note

This document is intentionally redacted. It records account names, system state, and verified operating proof, but it does not contain raw credentials, tokens, or OAuth secrets.
