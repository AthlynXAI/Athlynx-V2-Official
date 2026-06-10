# docs/drafts/

Manus posts finished drafts here for Owner / Computer review.

## What belongs here
- Doctrine drafts ready for promotion to `docs/runbooks/`
- QA rubrics ready for promotion to `docs/policies/`
- Brand voice, marketing copy, narrative
- Incident timelines and post-mortems (drafts only — final versions live in `docs/incidents/`)

## What does NOT belong here
- Code, schema, SQL, workflows, env files (see `MANUS-START-HERE.md` §4 for the full forbidden list)
- Anything Manus has not finished exploring (use `manus-sandbox/` for that)

## Promotion flow
1. Manus drafts in `manus-sandbox/voice/` or directly in `docs/drafts/`.
2. PR is opened on a `manus/*` branch. Lane Discipline + Mirror Test + Author allow-list run automatically.
3. Owner reviews. If approved, Computer moves the file to its production location (`docs/runbooks/`, `docs/policies/`, marketing repo, etc.).
4. The PR is logged to `docs/manus-ledger.md`.

Manus does not move files out of this directory. That is Computer's lane.
