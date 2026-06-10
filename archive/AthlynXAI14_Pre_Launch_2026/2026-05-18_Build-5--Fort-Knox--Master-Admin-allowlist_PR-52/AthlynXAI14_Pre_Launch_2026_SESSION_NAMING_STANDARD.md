# AthlynXAI14_Pre_Launch_2026 Session Naming Standard

**Permanent archive/session name:** `AthlynXAI14_Pre_Launch_2026`

This name is the required closeout and vault identity for AthlynXAI pre-launch work whenever the owner stops for the day or asks to save the session. Each daily/session closeout should use this base name consistently across archive packages, manifests, checksums, GitHub references, Google Drive folders, OneDrive folders, and handoff notes.

## Required naming pattern

Every session archive must include the base name, date, build number, and PR number when a PR exists. If a PR has not been opened yet, use `PR_pending` until the PR number is assigned, then update the manifest.

| Artifact type | Required pattern |
|---|---|
| Session folder | `AthlynXAI14_Pre_Launch_2026/YYYY-MM-DD_Build-{BUILD}_PR-{PR}/` |
| Archive package | `AthlynXAI14_Pre_Launch_2026_Build-{BUILD}_PR-{PR}_YYYY-MM-DD_HHMMSS.zip` |
| Manifest | `AthlynXAI14_Pre_Launch_2026_Build-{BUILD}_PR-{PR}_Manifest_YYYY-MM-DD.md` |
| Checksum | `AthlynXAI14_Pre_Launch_2026_Build-{BUILD}_PR-{PR}_YYYY-MM-DD_HHMMSS.zip.sha256` |
| Daily closeout note | `AthlynXAI14_Pre_Launch_2026_Build-{BUILD}_PR-{PR}_Closeout_YYYY-MM-DD.md` |
| GitHub archive reference | `archive/AthlynXAI14_Pre_Launch_2026/YYYY-MM-DD_Build-{BUILD}_PR-{PR}/` |
| Google Drive vault folder | `AthlynXAI14_Pre_Launch_2026/YYYY-MM-DD_Build-{BUILD}_PR-{PR}/` |
| OneDrive vault folder | `AthlynXAI14_Pre_Launch_2026/YYYY-MM-DD_Build-{BUILD}_PR-{PR}/` |

## Permanent rule

Every time the owner takes off for the day, the session must be saved under `AthlynXAI14_Pre_Launch_2026` before work stops. The archive must preserve the work trail, doctrine changes, deployment evidence, connector verification, payment/CRM progress, social safeguards, and any critical proof artifacts created during that session.

## Forward-only session rule

Each new session must begin from the latest saved closeout manifest and move forward only. Completed work must not be repeated unless a live verification check proves that it is broken, stale, or no longer deployed. The next session must identify the latest build number, latest PR number, current branch, current Vercel deployment, and current blocker before taking action. The operating sequence is: verify latest state, continue the next unfinished bite, save evidence, then advance. No going backward, no duplicate work, and no reopening completed issues without evidence.

## Current status

This standard was locked during the May 18, 2026 AthlynXAI closeout sequence after DNS cleanup, Nebius active-engine verification, Stripe payment-link creation work, and vault preparation began.
