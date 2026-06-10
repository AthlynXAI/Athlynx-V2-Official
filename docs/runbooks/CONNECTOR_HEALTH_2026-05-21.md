# AthlynXAI OS — Connector Health Runbook

**Date:** 2026-05-21  
**Repository path:** `docs/runbooks/CONNECTOR_HEALTH_2026-05-21.md`  
**Status:** Internal runbook for connector checkpoints, operating lanes, and deployment guardrails.  
**Privacy note:** This file intentionally excludes signed URLs, temporary download links, raw credentials, token-bearing links, and private partner/investor archive links.

## Changelog

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

This runbook consolidates the connector-health snapshots and connector banner provided on 2026-05-21. It corrects the Gmail operating identity to `chaddozier75@gmail.com`, records the AthlynXChad Vercel team scope, and preserves the governing rule that connector state comes before any external action. As of the 2026-05-24 account-routing override, `cdozier14` mailboxes are business-context lanes only, not repo/deployment/connector-control workarounds.

Since the earlier snapshot stated that only My Browser was ON, this file also records the newer read-only capability checks completed in the same session. Those newer checks showed GitHub repository read access, Google Drive read-only listing, Vercel team listing, and Stripe account-info read access. Read-only success does **not** authorize mutation. Any push, upload, deployment, email, payment, database action, social post, app-store submission, or automation still requires a fresh connector checkpoint and explicit approval.

## Rule 0 — Connectors First

Connector state comes first. Before any Gmail, GitHub, Vercel, cloud storage, payment, database, social, calendar, or automation action, the relevant connector must be visibly ON, authenticated, and proven with a harmless capability check where applicable.

If a connector is OFF, stale, missing scope, or only partially proven, the operator must stop and tell Chad before attempting the action. Prior sessions, browser login state, old screenshots, saved tokens, or assumptions are not enough.

## Current Connector Summary

| Lane | Latest Working State From 2026-05-21 Session | Operating Rule |
|---|---|---|
| Gmail / Google Workspace Mail | Blocked for send/cleanup until a Gmail-specific read-only capability and identity check passes. Google Drive listing worked, but Drive access does not prove Gmail scopes. | Use `chaddozier75@gmail.com` for personal/repo/app connector/broad Google Workspace work; use business mailboxes only for their matching business context after proof. |
| Google Drive | Read-only Drive file listing succeeded through the Google Workspace CLI. | Uploads are still external mutations and require explicit confirmation before execution. |
| GitHub | Read-only `gh` authentication and repository visibility checks succeeded. | The production source repo is `AthlyXAI/AthlynX-V2-Official` only. No commit or push without final diff review and explicit approval. |
| Vercel — AthlynXChad | Read-only team listing succeeded. AthlynXChad team ID is `team_7neDSatyrDspOku2p0LxT8zO`. | Use explicit team scope. Deployment-changing actions remain gated by GitHub proof and approval. |
| Vercel — Cdozier14 | Historical read-only team listing showed `team_FnZ6TFaOYpQ3VSrHRdy1TlI1`. | Deprecated/out-of-bounds for AthlynXAI production. Do not deploy or verify through this lane. |
| Stripe | Read-only account-info check succeeded for AthlynXAI Corporation. | No product, price, payment link, invoice, refund, subscription, or customer mutation without explicit confirmation. |
| OneDrive / Dropbox | No connector/server available in this session. | Treat as blocked unless Chad reconnects or provides an approved upload path. |

## Gmail / Google Workspace Lane

The default connector identity for repo, app connector, and broad Google Workspace work is `chaddozier75@gmail.com` via Google login. Business mailboxes are used by business context: `cdozier14@athlynx.ai` for AthlynXAI Corporation and `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group, each requiring live proof before action.

Before any email or calendar action, the live compose or event editor must show the correct signed-in account, From identity, accepted recipient chips, organizer, subject, body, attendees, date, time, time zone, Meet link, and description. If Gmail reports “Please specify at least one recipient,” if addresses sit in the wrong field, or if recipient chips are not accepted, the operator must stop, repair or discard the draft, and ask Chad instead of clicking Send again.

Drive access is not Gmail access. A successful Google Drive listing proves only Drive capability. It does not prove Gmail send/read scopes or calendar scopes.

## GitHub Lane

Production commits remain in the Manus + Chad lane. Perplexity may draft or hand off code, research, and documentation, but it does not own the production commit path. The production path remains: Perplexity or other sources hand off work, Manus and Chad review, approved changes are committed to GitHub, GitHub triggers Vercel, and Manus verifies deployment health.

The production repository is `AthlyXAI/AthlynX-V2-Official` only. Alternate names, mirrors, spelling variants, or historical repositories must not be treated as equivalent. The latest read-only checkpoint confirmed the canonical production repository through the active GitHub account:

| Repository | Read-Only Status | Notes |
|---|---|---|
| `AthlyXAI/AthlynX-V2-Official` | Verified visible | Private repository; default branch `main`. |

No GitHub push should occur until the target repository is confirmed and the commit contents have been reviewed for privacy, secrets, archives, investor materials, and deployment suitability.

## Vercel Lane

The older Vercel blocker involved a stale or unauthorized scope and missing `teamId` on project listing. The later session diagnosis identified the `AthlynXChad` team and confirmed that team-scoped read-only Vercel calls work when the correct team ID is used.

| Vercel Team | Team ID | Status |
|---|---|---|
| AthlynXChad | `team_7neDSatyrDspOku2p0LxT8zO` | Healthy for read-only verification. |
| Cdozier14 | `team_FnZ6TFaOYpQ3VSrHRdy1TlI1` | Deprecated/out-of-bounds for AthlynXAI production. |

Deployment changes remain blocked until GitHub connector proof, target repository confirmation, approved commit contents, and the normal GitHub-to-Vercel path are satisfied.

## Stripe Lane

The Stripe connector was visible and read-only account-info access succeeded. This proves account visibility only. It does not authorize changes. No Stripe customer, product, price, invoice, payment link, refund, subscription, coupon, or dispute action should be performed without an explicit confirmation and a clear statement of whether the action is test-mode or live-mode.

## Storage Lane

Google Drive read-only listing succeeded, so Drive can be used after explicit confirmation for uploads. OneDrive and Dropbox were not available in the connector set for this session, so they remain blocked unless reconnected or supplied through an approved path.

Investor materials, financial models, private strategic documents, raw recovery archives, founder-control documents, and partner-sensitive materials must not be made public or pushed to GitHub or Vercel as general archives. If backed up to Drive, they should be filed in controlled, private folders with clear names and no public sharing by default.

## Safety and Privacy Guardrails

Private investor materials, financial models, data-room files, founder-control records, signed links, secret-bearing assets, `.env` files, connector tokens, browser cookies, raw cloud credentials, and similar stores must never be committed or uploaded to a public deployment surface.

Strategic partnerships that are still under discussion must not be presented publicly as finalized. Public-facing materials should stay aligned with verified status only.

## Next Operating Order

| Step | Required Proof | Action Allowed After Proof |
|---|---|---|
| 1. Confirm local workspace | Local repo status, clean safety scan, target file list | Prepare commit locally. |
| 2. Confirm GitHub target | Live repo visibility and user confirmation of target repository | Commit and push only approved files. |
| 3. Confirm Vercel lane | Correct team/project ID and deployment path | Monitor or deploy only after GitHub step is complete and approved. |
| 4. Confirm storage lane | Drive folder/path or other authenticated storage | Upload approved archives only. |
| 5. Confirm Stripe lane | Read-only account proof plus explicit mutation approval | Perform only the specific approved Stripe action. |
| 6. Confirm Gmail/calendar lane | Account identity and scope-specific harmless check | Send/read/update only the specific approved message/event. |

## References

[1]: AthlynXAI-Current-State-Checklist-2026-05-21.pdf "Current-state checklist referenced by the pasted connector-health snapshots"  
[2]: google_workspace_identity_doctrine_commit_2026-05-21.txt "Google Workspace identity doctrine referenced by the pasted connector-health snapshots"  
[3]: vercel_scope_diagnosis_after_install_2026-05-21.txt "Vercel scope diagnosis referenced by the pasted connector-health snapshots"  
[4]: /home/ubuntu/connector_live_readonly_check_20260521T232332Z.txt "Live read-only connector capability check generated during this Manus session"  
[5]: /home/ubuntu/connector_checkpoint_status_20260521T232301Z.txt "Connector tool availability checkpoint generated during this Manus session"  
