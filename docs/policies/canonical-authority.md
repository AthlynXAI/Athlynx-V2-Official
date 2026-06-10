# Canonical Authority — AthlynXAI Production

**Status:** Active. Replaces any earlier single-account assertion.

## Scope

This document governs the **Platform / Layer Cake lane only** — the production-code systems used to build and run AthlynXAI: the GitHub repo, the Vercel project, the Neon production database, CI workflows, secrets, and runtime configuration.

This document does **NOT** govern Workspace mail, CRM intake, partner-facing communications, athlete/scouting mail, or personal correspondence. Those lanes have their own per-mailbox identity map defined in `docs/email-os/routing-taxonomy.md`. Specifically, the `cdozier14@athlynx.ai`, `cdozier14@dozierholdingsgroup.com.mx`, `cdozier@dozierholdingsgroup.com`, and `chad.dozier@icloud.com` mailboxes are out of scope for the Platform lane — they are authoritative for their own product roles. Do not retire or rewrite them under this policy.

The Platform-lane authoritative identity is the Owner using the GitHub login `AthlyXAI` with the verified email `chaddozier75@gmail.com`.

## Per-System Canonical Owners

| System | Owner | Authoritative Identity | Verification |
|---|---|---|---|
| Vercel project `chad-a-doziers-projects/athlynx-platform` | Owner | Vercel user `chaddozier75-cmd` (email: `chaddozier75@gmail.com`) | `vercel whoami` must return this; `vercel teams ls` shows `AthlynXChad` |
| GitHub repo `AthlyXAI/AthlynX-V2-Official` | Owner | GitHub login `AthlyXAI` (id `251627004`), commit email `chaddozier75@gmail.com` or `251627004+AthlyXAI@users.noreply.github.com` | `gh auth status` |
| Domain `athlynx.ai` | Owner | per DNS / registrar | DNS lookup |
| Neon project hosting endpoint `ep-restless-dream-ahvptyne` (`us-east-1`) | Documented in owner-only sealed baseline | Per Vercel production `DATABASE_URL` | Vercel env is the runtime source of truth |
| Stripe | per Vercel production env values | Vercel env | Vercel env |
| Auth0 | per Vercel production env values | Vercel env | Vercel env |
| AWS (SES, etc.) | per Vercel production env values | Vercel env | Vercel env |

## Why Neon Is Different

The prior baseline asserted `chaddozier75@gmail.com` as the canonical Neon owner. That assertion is incorrect for real production. Real production Neon endpoint `ep-restless-dream-ahvptyne` is not visible in `chaddozier75@gmail.com`'s Neon org (which contains only an unrelated archived project `delicate-sun-75928916`).

This is recorded openly so no future agent re-makes the same wrong-target mistake by trusting the old baseline.

## Owner-Only Sealed Baseline

The specific Neon-owning account is recorded in `docs/policies/owner-sealed-baseline.md`, which is git-encrypted (or stored in 1Password vault, owner's choice). Agents do not need to know the Neon account email to do their work — they only need to know that the Vercel production `DATABASE_URL` is the runtime source of truth.

## Implication for Agents

When asked "which database is production?":
- Manus: refuses to answer with anything other than "Computer reads Vercel production `DATABASE_URL` to find out."
- Computer: pulls Vercel env, parses host, never caches, wipes file immediately after read.
- Perplexity (web research): does not have access to this question and refuses to speculate.
- Contractors: route through Computer.

## When This Document Changes

Any change to canonical authority requires:
1. Owner-signed commit with `Canonical-Authority-Change-Approved-By: chaddozier75@gmail.com` trailer.
2. Incident-style record in `docs/incidents/` describing why the change is needed.
3. All agents notified in writing.

## Cross-Reference

For the non-Platform mailbox identity map (DHG, AthlynXAI Workspace, Personal, etc.), see `docs/email-os/routing-taxonomy.md`. The two documents are intentionally separate: this one governs code/deploys/DB; that one governs mail/CRM/partner intake.
