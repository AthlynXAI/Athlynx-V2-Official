# Runtime Source of Truth — Vercel `DATABASE_URL`

**Status:** Binding. CI-enforced.

## The Rule

For the question "what is the production database?", the only authoritative answer is the value of `DATABASE_URL` in the Vercel production environment for project `chad-a-doziers-projects/athlynx-platform` at the moment of the question.

Not the Neon console.
Not project names.
Not handoff documents.
Not memory of what it used to be.
Not "well, Manus told me…"

The runtime is truth. Documents drift. Consoles show old projects. Names mislead. The thing actually serving customer traffic is the only signal that counts.

## How to Read Truth

```bash
# Requires VERCEL_TOKEN scoped to chad-a-doziers-projects
npx vercel --token $VERCEL_TOKEN --scope chad-a-doziers-projects \
  env pull /tmp/.env.prod --environment=production --yes

# Extract host only, mask password before any logging
node scripts/print-prod-db-host.mjs /tmp/.env.prod

rm -f /tmp/.env.prod
```

## Required Identity to Read

`vercel whoami` MUST return `chaddozier75-cmd`. Any other identity is unauthorized to read production runtime.

## Forbidden Practices

- Hardcoding a database host in any doc, runbook, or script as "real prod" without referencing the Vercel env as the source.
- Caching the Vercel env contents anywhere other than ephemeral memory (no commits, no logs, no Notion).
- Treating a Neon console search as authoritative.
- Treating a contractor or agent assertion as authoritative.
- Treating yesterday's verification as still valid today. Re-verify before every migration, every secret rotation, every DB write.

## What Changes the Truth

Only the owner (`chaddozier75@gmail.com`) may change Vercel production `DATABASE_URL`. When it changes, the lock-down runbook requires:

1. The new host is recorded in the incident or build doc.
2. The next migration's target-proof file is regenerated against the new value.
3. All agents are notified in the build channel.

## Verifying You Are Reading the Right Vercel Project

```bash
npx vercel --token $VERCEL_TOKEN --scope chad-a-doziers-projects project ls | grep athlynx-platform
```

If the project does not appear, the token or scope is wrong. Stop. Do not infer.

## When Vercel Is Down

If Vercel API is unreachable, **all migration and DB-write activity halts**. Do not fall back to a cached value or a documented host. Wait for Vercel to return, or escalate to the owner.
