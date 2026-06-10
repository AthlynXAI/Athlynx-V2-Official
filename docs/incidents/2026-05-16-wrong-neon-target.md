# Incident: Wrong Neon Target Migration

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

**Path:** `docs/incidents/2026-05-16-wrong-neon-target.md`
**Date:** 2026-05-16
**Status:** Awaiting owner sign-off (verification complete)
**Severity:** Medium — no production data corruption; canonical authority rule correction required
**Owner:** Chad A. Dozier Sr. (`chaddozier75@gmail.com`)
**Author:** Perplexity Computer (verification), Manus AI (initial draft)

---

## Summary

On 2026-05-16, a prior Manus session applied migrations `0011_build27_1_studio_suite.sql`, `0012_build28_comms_os_scaffold.sql`, and `0013_build28_behavior_signals.sql` to the wrong Neon project (`empty-lake-01820888` under `retired-non-chad-lane/athlynx-corp-launch-2026-#14-Neon-Final`). Real production is the Neon endpoint `ep-restless-dream-ahvptyne` in `us-east-1`, confirmed via the Vercel production `DATABASE_URL` for `chad-a-doziers-projects/athlynx-platform`.

Read-only verification on 2026-05-16 21:26 UTC confirms all 15 expected tables are present on real production, each with 0 rows. No production data was altered. The migrations also reached real production via a path that bypassed Drizzle migration tracking — provenance is not recorded in `drizzle.__drizzle_migrations` on real prod.

---

## Final Root Cause

Production authority was inferred from an accessible Neon project name and recent activity rather than verified against the live runtime source (Vercel production `DATABASE_URL`). The original handoff pack named `chaddozier75@gmail.com` as the sole canonical authority across all systems including Neon, but real production Neon is not under that account's Neon organization. Operationally, the failure was acting on an assumed target instead of reading the live runtime configuration first.

---

## Verification Evidence

**Target:** `ep-restless-dream-ahvptyne-pooler.c-3.us-east-1.aws.neon.tech` / `neondb` / `neondb_owner`
**Source of target:** Vercel project `chad-a-doziers-projects/athlynx-platform`, environment `production`, variable `DATABASE_URL` (last modified ~28 days prior to verification)
**Verified by:** Perplexity Computer, on behalf of `chaddozier75@gmail.com`
**Verified at:** 2026-05-16 21:26:10 UTC (4:26 PM CDT)
**Method:** Read-only `psql` queries against `information_schema.tables` and `pg_class`. No writes. No DDL. Mutation freeze respected.

| # | Expected Table | Status | Row Count | Evidence Source | Verified By | Timestamp (UTC) |
|---|---|---|---|---|---|---|
| 1 | `studio_graphics` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 2 | `communication_accounts` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 3 | `communication_threads` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 4 | `communication_events` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 5 | `communication_classifications` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 6 | `communication_actions` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 7 | `reply_templates` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 8 | `automation_rules` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 9 | `automation_runs` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 10 | `signal_events` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 11 | `signal_aggregates` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 12 | `lifecycle_transitions` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 13 | `athlete_lifecycle_state` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 14 | `recommendation_scores` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |
| 15 | `athlete_behavior_segments` | PRESENT | 0 | `information_schema.tables` on real prod | Computer | 2026-05-16 21:26 |

**Result: 15 of 15 expected tables PRESENT. 0 rows in each. No production data damaged.**

---

## Additional Findings

### F-1. Real prod schema is larger than the incident scope
Real prod `public` schema contains 109 tables. The 15 incident tables sit alongside the existing platform schema (`users`, `athlete_profiles`, `stripe_customers_mirror`, `crm_*`, `conversations`, `credit_*`, `posts`, etc.). The incident migrations were additive only; no platform tables were dropped or altered.

### F-2. Drizzle migration tracking is empty on real prod
`drizzle.__drizzle_migrations` exists but contains 0 rows. The 15 incident tables exist in the schema, but no Drizzle migration history is recorded for them on real prod. This means migrations reached real prod via a path that bypassed the Drizzle runner — either raw `psql` execution, a direct schema push, or a separate tool. Migration provenance cannot be proven from the database alone.

### F-3. Canonical authority rule needs Neon-side correction
- Vercel ownership: `chad-a-doziers-projects` team, owner `chaddozier75-cmd` — matches `chaddozier75@gmail.com` canonical rule. ✓
- GitHub repo ownership: `AthlyXAI/AthlynX-V2-Official` — under canonical authority. ✓
- Neon ownership of `ep-restless-dream-ahvptyne`: **NOT** under `chaddozier75@gmail.com`'s Neon organization (which contains only `delicate-sun-75928916` / endpoint `ep-misty-glade-aeu51x06` in `us-east-2`, an unrelated archived project).
- Action required: update the canonical authority baseline so the Neon side reflects reality. Real prod Neon must either be (a) moved into the canonical account, or (b) the baseline must document the Neon-owning account as a co-authoritative source with read-only verification rights for the canonical account via Vercel `DATABASE_URL`.

### F-4. Vercel production `DATABASE_URL` was never deleted
The original incident draft stated "Deleted the GitHub Production `DATABASE_URL` secret." That is accurate for the GitHub Actions secret. The **Vercel** production `DATABASE_URL` is a separate secret store and remains intact (~28 days old). The application has been serving traffic against real prod throughout the incident. Correct the addendum language to specify "GitHub Actions secret" rather than implying both stores were cleared.

### F-5. Lane confusion on the 2026-05-16 Email OS test run (addendum, recorded 2026-05-16 evening CDT)
During the Email OS backend test conducted after read-only Neon verification was complete, Manus reported that the Platform-lane mailbox (`chaddozier75@gmail.com`) had been brought to inbox zero. Independent verification by Computer against the connected Gmail mailbox returned 6+ unread items including a Vercel team invite, a Google Calendar acceptance, and recurring AthlynXAI daily-report emails. The unread items were addressed to `cdozier14@athlynx.ai`, not `chaddozier75@gmail.com`.

Root cause: Manus operated on the **AthlynXAI Workspace** mailbox (`cdozier14@athlynx.ai`, per `docs/email-os/routing-taxonomy.md`) and reported the result as if it applied to the **Platform / Layer Cake** mailbox (`chaddozier75@gmail.com`). This is the same class of failure as the 2026-05-16 wrong-Neon-target event — acting on an accessible-but-wrong target and reporting it as the canonical one — expressed in the email lane instead of the database lane.

No data was damaged. No mail was destructively deleted (Manus's own automation safety rule was respected). The failure is in reporting accuracy and identity-lane discipline. This is recorded here, not as blame, but to confirm that the lane-discipline safeguards introduced in PR #36 are the correct shape and need to extend beyond code to cover communications context as well. Receipts Ledger (next safeguard PR) will capture this kind of mismatch automatically going forward.

No remediation action required for production. Routing taxonomy is now documented at `docs/email-os/routing-taxonomy.md` so future agents have an explicit per-mailbox identity map to verify against before reporting.

---

## Remediation Steps Taken

| Step | Action | Status |
|---|---|---|
| 1 | Identified that migrations 0011, 0012, 0013 had been applied to the wrong Neon project | Complete |
| 2 | Confirmed wrong project: `empty-lake-01820888` under `retired-non-chad-lane/athlynx-corp-launch-2026-#14-Neon-Final` | Complete |
| 3 | Confirmed SQL was additive only (CREATE TABLE / TYPE / INDEX), no destructive changes | Complete |
| 4 | Deleted the **GitHub Actions** Production `DATABASE_URL` secret | Complete (corrected from "GitHub Production") |
| 5 | Re-established mutation freeze on all DB writes, secret writes, repo actions, merges, workflow triggers, table drops, cleanup, and migrations | Complete |
| 6 | Held PR #34 (Build 30 Live Comms OS execution) and PR #35 (Build 31 Await Comms OS webhook persistence) from merge | Active |
| 7 | Computer performed read-only verification of 15 expected tables on real prod | Complete (this document) |
| 8 | Recorded additional findings: drizzle tracking empty, canonical authority correction, Vercel secret intact | Complete |
| 9 | Stranded additive tables on `empty-lake-01820888` cleanup deferred per shelf plan | Deferred |

---

## Prevention Measures

| Measure | Purpose | Status |
|---|---|---|
| Cold-start migration gating (`ENABLE_COLDSTART_MIGRATIONS=1`) | Prevents auto-migration on cold start unless explicitly enabled | Pending lock-down PR merge (`chore/lock-down-migrations`) |
| Build-discipline rule | Enforces one build at a time, five-point Definition of Done required before forward motion | In place at `docs/runbooks/build-discipline.md` |
| Two-key migration rule | Requires correct target verification AND owner authorization before any migration or DB write | Active |
| Canonical authority rule (Neon side, revised) | Real prod Neon ownership must be documented in the baseline; Vercel `DATABASE_URL` is the runtime source of truth for production database target | Pending baseline doc update |
| Mutation freeze | Stops all writes/merges/triggers until owner re-authorizes in writing | Active |
| Migration provenance rule (new) | All migrations against real prod must go through the Drizzle runner (or whichever tool owns `__drizzle_migrations`) so history is recorded. Raw `psql` migrations against real prod are not allowed. | New — to be added to build-discipline runbook |
| Runtime-source verification rule (new) | Before treating any database as "production," verify against the live runtime `DATABASE_URL` (Vercel production env), not a console search or project name. | New — to be added to build-discipline runbook |

---

## Lessons Learned

1. **The runtime `DATABASE_URL` is the only authoritative source for "what is production."** Console project names, recent activity, account ownership, and prior documentation are all secondary signals. Always read Vercel prod env first.
2. **HTTP 200 on a route does not prove a database write occurred.** The five-point Definition of Done must include direct DB verification, not deploy success.
3. **Migration provenance must be recorded.** Tables that exist with no migration history record are a recovery and audit hazard.
4. **Canonical authority rules must be verified against live runtime, not asserted in a handoff doc.** If the doc says one account is canonical and the runtime points elsewhere, the runtime wins. Update the doc.
5. **Vercel env and GitHub Actions secrets are independent stores.** Clearing one does not clear the other. Incident language must distinguish them.
6. **One build at a time prevents compounding uncertainty.** This incident occurred during a window of overlapping PR activity. The one-build-at-a-time rule is now non-negotiable.

---

## Sign-Off

I, Chad A. Dozier Sr., confirm that:
- The real production Neon target has been verified.
- The 15-table evidence has been reviewed.
- The additional findings (drizzle tracking, canonical authority correction, Vercel secret state) have been reviewed and acknowledged.
- The wrong-Neon-target incident is closed.

Owner sign-off: ___________________________________________

Date/time (CDT): __________________________________________

---

## References

| Source | Role |
|---|---|
| `Full-Session-Handoff-AthlynXAI-New-Manus-Session-Perplexity-Sync.pdf` | Master incident timeline and original authority assertion |
| `AthlynXAI-Resync-Status-2026-05-16.pdf` | Production and PR status at session pickup |
| `Perplexity-Handoff-Wrong-Neon-Target-Recovery-Exact-Instructions.pdf` | Read-only target verification instructions |
| `Incident-Closure-Addendum-Wrong-Neon-Target.pdf` | Manus-drafted addendum (this document supersedes that draft with verified evidence) |
| `Wrong-Neon-Project-Cleanup-Plan-Draft-Only.pdf` | Shelf plan for stranded tables on `empty-lake-01820888` (deferred) |
| `Backend-Email-OS-Test-Audit.pdf`, `Backend-Email-OS-Routing-Taxonomy.pdf`, `Backend-Email-OS-Automation-Blueprint.pdf` | Manus deliverables from the 2026-05-16 evening Email OS test run; basis for `docs/email-os/routing-taxonomy.md` and F-5 |
| `docs/runbooks/build-discipline.md` | Five-point Definition of Done; one-build-at-a-time rule |
| `docs/policies/canonical-authority.md` | Platform-lane identity policy (scoped per F-3 and PR #36) |
| `docs/email-os/routing-taxonomy.md` | Non-Platform mailbox lane map (added per F-5) |
| `AthlynXAI_BUILD_PERMANENT_BASELINE.md` | Operating baseline — requires canonical authority correction per F-3 |
