# Manus Sandbox

This directory is **Manus's workspace**. Manus has full agency here.

- **CODEOWNERS does not gate this path.**
- **Lane Discipline CI does not block PRs that only touch this path.**
- **Nothing in this directory is ever applied to production by CI.**

## Layout

| Subdirectory | Purpose |
|---|---|
| `schema-drafts/` | Proposed SQL or schema sketches. Drafts only. Never executed against prod. |
| `scratch/` | TypeScript prototypes, helper scripts, throwaway code. Not imported by app. |
| `fixtures/` | Test fixtures, seed data, integration test plans. |
| `voice/` | Brand voice exploration, narrative variants, copy experiments. |

## Rules

1. **Manus may push directly to `manus-sandbox/` on `manus/*` branches.** No CODEOWNERS approval needed.
2. **Anything in `manus-sandbox/` that the Owner promotes to production goes through Computer.** Manus does not move files out of this directory into protected paths.
3. **The Mirror Test runs on `manus-sandbox/schema-drafts/*.sql`.** If a draft would break prod's schema structure, the Mirror Test fails the PR and posts a diff. This is feedback, not rejection — fix and re-push.
4. **Everything Manus does here is logged to `docs/manus-ledger.md`.** Append-only. Owner-reviewed.

## Why this exists

Manus is fast, generative, and good at exploration. Manus has also historically caused production incidents by inferring authority instead of verifying it. This directory channels Manus's strengths into a blast-radius-zero zone. Mistakes here cost nothing. Good work here gets promoted.

See `/MANUS-START-HERE.md` for the full Manus operating manual.
