# AthlynXAI Account-Routing and Production-Lane Doctrine

**Status:** Permanent operating rule  
**Owner:** Chad A. Dozier Sr.  
**Effective:** 2026-05-24

## Non-Negotiable Security Rule

Plaintext passwords, recovery codes, API keys, MCP tokens, OAuth tokens, private keys, app passwords, and session cookies must never be written into doctrine, source code, GitHub, Vercel, CRM records, public logs, handoff files, or markdown vault documents. If a password or token is provided in chat, treat it as sensitive transient input only. Use secure connector flows, OAuth, browser takeover, or platform secret managers instead of preserving the secret in repo files.

## Account Routing by Business Context

Use the right account for the right business context. Do not collapse business identity into one mailbox, and do not use a business mailbox as a workaround for repo, connector, or deployment authentication problems.

| Context | Authorized identity | Rule |
|---|---|---|
| Personal owner lane, repo operations, app connector logins, and broad Google Workspace connector work | `chaddozier75@gmail.com` | Prefer Google login where available; avoid captcha-prone direct email/password login. |
| AthlynXAI Corporation business and Google Workspace | `cdozier14@athlynx.ai` | Use for AthlynXAI Corporation business communications and workspace context only after live identity proof. |
| Dozier Holdings Group business and Google Workspace | `cdozier14@dozierholdingsgroup.com.mx` | Use for Dozier Holdings Group business/workspace context only after live identity proof. |
| Apple Mail / iOS personal and personal Microsoft Exchange context | `chad.dozier@icloud.com` | Use only through approved login/connector proof or user takeover. |
| Dozier Holdings Group Microsoft Exchange and Gmail | `cdozier@dozierholdingsgroup.com` | Use for Dozier Holdings Group email/business context only after live identity proof. |
| Social platforms | Platform-specific owner-approved account | Prefer Buffer, Zapier, Runner, Superhuman, Gravatar, and official connectors only after proof. |

## Canonical Production Code Flow

The canonical repository for the current AthlynXAI platform is `AthlyXAI/AthlynX-V2-Official` unless Chad creates and proves a replacement in the same session. The canonical Vercel project is `athlynx-platform` under the `AthlynXChad` / `chad-a-doziers-projects` Vercel scope, with GitHub/Vercel operations associated with the `chaddozier75-cmd` lane where applicable.

The only approved production delivery flow is:

> Local review and approved source changes → GitHub commit/PR in the canonical repo → GitHub-triggered Vercel deployment → live verification on `athlynx-platform`.

No archive, local file, Perplexity output, browser tab, screenshot, handoff package, or alternate repository is considered shipped until this flow is proven.

## Connector and Login Gate

Every session begins with a connector/API/MCP health checkpoint for the lane about to be used. The operator must verify both visible availability and harmless live capability for every required connector, API, MCP server, token-backed integration, mailbox, repo, project, workspace, calendar, database, social channel, or payment surface.

If proof fails, stop and report the blocker. Do not substitute another account, repo, project, connector, or login route. Do not use direct email/password login where the Google login option is the approved path and direct login creates CAPTCHA risk.

## Prohibited Actions Without Chad Approval

No push, merge, production deployment, domain change, database mutation, storage publication, email send, calendar invite, social post, ad-budget change, payment action, connector-setting change, or destructive cleanup may occur without Chad's explicit approval after proof passes.

## Live-Before-Checkoff Doctrine

No production-safe AthlynXAI checklist item is complete merely because it exists in a chat, local file, recovery archive, browser tab, or draft. For any item that affects the public platform, operating doctrine, source code, production configuration, live route, or user-facing proof surface, the item is not checked off until it has completed the full delivery path: reviewed local change, clean secret scan, GitHub commit to `AthlyXAI/AthlynX-V2-Official`, Vercel deployment to `athlynx-platform`, and live route or API verification.

Private evidence, investor materials, credentials, raw mailbox content, financial archives, and other vault-only materials must not be forced into Vercel just to satisfy this rule. Those items are checked off only after they are preserved in the private vault and referenced by a production-safe public or internal index when appropriate.

When Chad says to keep going one by one, the operator should continue executing the checklist without repeated stop-and-ask messages, but each item must still pass the appropriate safety gate before being marked complete. The default completion proof is: commit SHA, Vercel deployment ID/state, live route/API status, and a short proof note.

