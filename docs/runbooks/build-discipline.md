# Build Discipline — AthlynXAI

**Status:** Active. Binding on all agents and contractors.

## The Five-Point Definition of Done

A build is NOT done until ALL five are true.

1. **PR merged to `main`** — CI required check.
2. **Vercel production deploy succeeded** — Vercel GitHub integration status check required.
3. **Every new route/endpoint verified live on prod (not preview)** by Computer. Evidence: curl/HTTP log committed to the build doc or incident doc.
4. **DB state verified on real Neon `ep-restless-dream-ahvptyne`** via read-only query, evidence committed.
5. **Incident log updated** with root cause, fix, prevention (only if an incident occurred).

CI enforces 1, 2, and 4 (via lane-discipline.yml gating migration PRs on the proof file). Owner enforces 3 and 5 by manual review.

## One Build at a Time

Only one PR may carry the `merge-eligible` label at a time. CI's lane-discipline workflow blocks merge if any other open PR carries the label.

This rule is non-negotiable. The 2026-05-16 wrong-Neon-target incident occurred during a window of overlapping PR activity.

## Mutation Freeze

A mutation freeze is in effect any time an open incident is unresolved or the owner has declared one. During a freeze:
- No migrations.
- No secret writes.
- No PR merges.
- No workflow triggers other than read-only verification workflows.
- No table drops.

Only the owner may lift a freeze, in writing, in chat AND with a freeze-lift commit trailer:
```
Mutation-Freeze-Lifted-By: chaddozier75@gmail.com
Mutation-Freeze-Lifted-At: <ISO-8601 UTC>
```

## Truth Before Speed

- HTTP 200 on a route does NOT prove a DB write happened. Verify writes directly.
- A successful deploy does NOT prove the schema is correct. Verify schema directly.
- A handoff doc claim does NOT prove production state. Verify against the Vercel runtime.
- Memory of "what it used to be" does NOT prove what it is now. Re-verify.

## Migration Provenance

All migrations against real prod MUST go through the Drizzle runner (or whichever tool owns `__drizzle_migrations`) so the migration history table is populated. Raw `psql` migrations against real prod are prohibited.

Rationale: on 2026-05-16, real prod was found with 15 incident tables present but `drizzle.__drizzle_migrations` empty. Provenance could not be proven from the database alone. This is a recovery and audit hazard.

## Runtime Source of Truth

For any question about a production runtime value (DB host, secret, config), the only authoritative answer is the Vercel production environment for `chad-a-doziers-projects/athlynx-platform` at the moment of the question. See `runtime-source-of-truth.md`.

## Blacklisted Words

The words listed in `lane-discipline.md` §7 are blocked by CI. They do not appear in code, docs, marketing copy, commit messages, or PR descriptions.

## Override

Any rule in this document can only be overridden by an owner-signed commit with the trailer described in `lane-discipline.md` §8. All overrides are logged and reviewed.
