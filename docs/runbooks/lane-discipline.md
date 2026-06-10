# AthlynXAI Lane Discipline — Manus, Computer, Perplexity, Owner

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

**Owner:** Chad A. Dozier Sr. (`chaddozier75@gmail.com`)
**Status:** Active. Binding on all agents and contractors. Enforced by CI.
**Supersedes:** Any prior lane assertions in handoff PDFs.

This document defines what each role may do, what each role may NOT do, and which actions are machine-enforced by CI. Rules that are not machine-enforced are still binding, but the enforced ones cannot be bypassed without an owner-signed override commit.

---

## 1. Roles and Lanes

### 1.1 Owner — Chad A. Dozier Sr.
- Sole final go/no-go on merges to `main`.
- Sole authority to set or rotate the production `DATABASE_URL` in Vercel and GitHub.
- Sole authority to lift the mutation freeze.
- Sole authority to close incidents.
- May delegate read-only verification to Computer.

### 1.2 Computer (Perplexity Computer)
**May:**
- Read code, schema, env (via Vercel CLI with scoped token), Neon (read-only via connector or `psql` with prod creds pulled from Vercel env).
- Write code, schema diffs, migrations as draft files in feature branches.
- Run `npx tsc --noEmit`, lint, tests, build.
- Open pull requests against `main`.
- Run pre-deploy smoke tests on Vercel preview URLs.
- Verify DB state read-only against real prod after deploy.
- Update incident docs with verified evidence.

**May NOT:**
- Merge to `main` without owner sign-off recorded in the PR (see §4).
- Apply migrations to any database without passing the two-key check (see §3).
- Set, rotate, or delete production secrets (Vercel env, GitHub Actions secrets, Neon roles).
- Lift the mutation freeze.
- Run anything against a database whose host is not proven to match Vercel production `DATABASE_URL`.
- Author doctrine, brand voice, marketing copy, or strategic narrative.

### 1.3 Manus AI
**May:**
- Draft doctrine, brand voice, marketing copy, narrative.
- Draft QA checklists, review rubrics, decision-support documents.
- Draft non-binding plans and incident timelines.
- Propose changes via written drafts in `docs/drafts/` only.

**May NOT — HARD STOP, CI-ENFORCED:**
- Write, modify, or delete any file under `db/`, `drizzle/`, `migrations/`, `prisma/`, `supabase/migrations/`, or any path matching `*.sql`.
- Write, modify, or delete any file under `.github/workflows/`, `.github/actions/`, `scripts/`, `infra/`, `terraform/`, `vercel.json`, `next.config.*`, `package.json` engines/scripts, `Dockerfile*`, `docker-compose*`.
- Write or modify any `.env*` file.
- Set, rotate, or read production secrets in any system.
- Run any command against a production or staging database.
- Open PRs that modify the files listed above.
- Author or modify files under `docs/runbooks/`, `docs/incidents/`, or `docs/policies/`.
- Trigger any GitHub Actions workflow.
- Make commits as any author other than `manus-ai-bot@athlynx.ai` when Manus is the GitHub actor or PR author.
- Run migrations under any circumstances. Manus does not run migrations. Ever.

**If Manus is asked to do any of the above, Manus must refuse and route the request to Computer or Owner.**

**Owner override on Manus-assisted branches:** A `manus/*` branch name alone is not proof that Manus is the acting identity. If the GitHub actor or PR author is the canonical owner account, CI treats the commit as owner-ratified work and does not apply the Manus protected-path stop solely because of the branch prefix. Actual Manus-authored activity remains bound to the hard-stop rules above.

### 1.4 Perplexity (web research)
**May:**
- External diagnosis only — research, summarize external sources, identify candidate solutions.

**May NOT:**
- Touch the repo, secrets, deploys, or databases.
- Make any decision binding on the build.

### 1.5 Dependabot — security dependency lane

Dependabot may open dependency security/update PRs, but CI only accepts raw Dependabot-authored commits when all of the following are true:

- The branch starts with `dependabot/`.
- Every changed file is a package manifest or lockfile: `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `npm-shrinkwrap.json`.
- No source code, workflow, script, schema, environment, docs, or production config file is changed by the Dependabot commit.

Any Dependabot PR outside that narrow lane must be rewritten or ratified by the Owner before merge.

---

## 2. Canonical Authority — corrected from prior baseline

Real production runtime ownership is split. Each system has its own canonical authority. The list below is the authoritative one and supersedes any earlier handoff doc that claimed a single account owns everything.

| System | Canonical Owner | Verification Method |
|---|---|---|
| Vercel project `chad-a-doziers-projects/athlynx-platform` | `chaddozier75@gmail.com` (team `AthlynXChad`) | `vercel whoami` returns `chaddozier75-cmd`; `vercel teams ls` shows team |
| GitHub repo `AthlyXAI/AthlynX-V2-Official` | `chaddozier75@gmail.com` (org `AthlyXAI`) | `gh auth status` |
| Domain `athlynx.ai` | `chaddozier75@gmail.com` | DNS / registrar of record |
| Neon project hosting `ep-restless-dream-ahvptyne` (`us-east-1`) | **Not** under `chaddozier75@gmail.com`'s Neon org. Owning Neon account documented separately in owner-only baseline. | Vercel production `DATABASE_URL` is the authoritative pointer. |
| Stripe, Auth0, AWS, Twilio, etc. | Per Vercel production env values | Vercel env is the runtime source of truth |

**Rule:** When any agent is asked "what is production X?", the answer is whatever the Vercel production env points to at the moment of the question. Console searches, project names, and prior documentation are secondary signals.

---

## 3. Two-Key Migration Rule — CI-enforced

No migration runs against any database (real prod, wrong prod, branch, or shadow) unless **both** of the following exist:

### Key 1 — Target Proof
A file at `db/migration-target-proof.json` in the same commit, with this exact shape:

```json
{
  "intended_target_host": "ep-restless-dream-ahvptyne-pooler.c-3.us-east-1.aws.neon.tech",
  "intended_target_db": "neondb",
  "intended_target_role": "neondb_owner",
  "proof_source": "vercel-production-env",
  "proof_command": "vercel --scope chad-a-doziers-projects env pull --environment=production && parse DATABASE_URL",
  "proof_timestamp_utc": "ISO-8601 string within last 24 hours",
  "verified_by": "computer",
  "migration_files": ["db/migrations/NNNN_*.sql", "..."]
}
```

The pre-migration script (`scripts/preflight-migration.mjs`) MUST be run and MUST produce this file fresh against the live Vercel env. The script refuses to write the file unless the Vercel env DATABASE_URL host matches the intended_target_host. The script also refuses to run unless the current `vercel whoami` returns `chaddozier75-cmd`.

### Key 2 — Owner Approval
A signed commit on the PR with the trailer:

```
Migration-Approved-By: chaddozier75@gmail.com
Migration-Approved-At: <ISO-8601 UTC>
Migration-Approved-Files: <comma-separated migration filenames>
```

CI verifies the trailer is present and the email matches the canonical owner. CI does NOT verify cryptographic signing yet; that is a follow-up improvement.

**If either key is missing, the migration workflow refuses to run.** This is enforced by `.github/workflows/migration-guard.yml`.

---

## 4. Definition of Done — Five Points

A build is NOT done until ALL five are true. CI enforces points 1, 2, 4. Owner verifies points 3, 5 manually.

1. PR merged to `main` (CI: required)
2. Vercel production deploy succeeded (CI: required, status check from Vercel)
3. Every new route/endpoint verified live on prod (not preview) by Computer
4. DB state verified on real Neon `ep-restless-dream-ahvptyne` (read-only query, evidence committed to incident or build doc) (CI: required for any PR with DB writes — see §5)
5. Incident log updated with root cause, fix, prevention (CI: required if incident exists)

---

## 5. CODEOWNERS and Path Protection — CI-enforced

The following paths are protected. Any PR that touches them must have a review from `@chaddozier75` AND must pass the lane-discipline check. Manus commits to these paths are auto-rejected.

```
/db/                         @chaddozier75
/drizzle/                    @chaddozier75
/migrations/                 @chaddozier75
**/*.sql                     @chaddozier75
/.github/workflows/          @chaddozier75
/.github/actions/            @chaddozier75
/scripts/                    @chaddozier75
/infra/                      @chaddozier75
/vercel.json                 @chaddozier75
/.env*                       @chaddozier75
/docs/runbooks/              @chaddozier75
/docs/incidents/             @chaddozier75
/docs/policies/              @chaddozier75
```

---

## 6. One Build at a Time

Only one PR may be in the "merge-eligible" state at a time. CI checks that no other PR has the `merge-eligible` label before allowing merge. Manus, Computer, and contractors may have draft PRs open, but only one carries the label.

---

## 7. Blacklisted Words

The following words must not appear in any AthlynXAI artifact (code comments, docs, marketing copy, commit messages, PR descriptions):

`revolutionary, disrupt, game-changer, synergy, leverage, ecosystem, AI-powered, premier, elite, best-in-class`

CI runs a grep check on changed files and fails the build if any blacklisted word appears.

---

## 8. Override

The only way to bypass any rule in this document is a commit signed by the owner with the trailer:

```
Lane-Override-By: chaddozier75@gmail.com
Lane-Override-Reason: <free text>
Lane-Override-Expires: <ISO-8601 UTC, max 24 hours from commit time>
```

CI logs all overrides to `docs/incidents/lane-overrides.log`. Every override is treated as a near-miss and reviewed in the next standup.

---

## 9. Why This Exists

On 2026-05-16, a Manus session applied migrations to the wrong Neon project because it inferred production authority from an accessible project name instead of verifying against Vercel's runtime `DATABASE_URL`. Real prod was untouched (verified by Computer 2026-05-16 21:26 UTC), but the incident exposed two systemic gaps:

1. Lane rules existed in handoff PDFs but were not enforced by tooling.
2. Canonical authority was asserted but not verified against runtime.

This document closes both gaps by moving the rules from PDFs into the repo and into CI.
