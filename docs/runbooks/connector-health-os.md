# AthlynXAI Connector Health OS Runbook

**Status:** Production-safe operating runbook  
**Scope:** Connector health sweeps, frontend/backend sync, Sentry proof, cloud-computer cron, GitHub/Vercel deployment, and secret boundaries.

## Purpose

AthlynXAI is different by design: founder-led, faith-forward, category-defining, and not a me-too company. That standard applies to infrastructure. AthlynXAI OS must not silently fail when a connector, OAuth session, API key, deployment identity, or third-party rail disconnects. The Connector Health OS adds a durable proof layer that continuously answers one operational question:

> Are the platform rails configured, provable in the current session, and safe to use for the exact business lane involved?

The system cannot stop OAuth providers or third-party platforms from expiring, revoking, or requiring re-authorization. It can, however, detect missing proof quickly, surface the exact blocked rail, emit Sentry telemetry, and stop risky work before it causes wrong-account sends, broken deployments, or destructive actions.

## Production Components

| Component | Path | Role |
|---|---|---|
| Backend connector registry and sweep logic | `server/services/connectorHealth.ts` | Defines connector lanes, safe proof rules, recovery actions, and no-secret health snapshots. |
| Live tRPC endpoints | `server/_core/systemRouter.ts` | Exposes public-safe registry/self-test and admin-only live sweep/Sentry emission. |
| Sanitized REST probes | `server/_core/index.ts` | Exposes `/api/system/connector-health`, `/api/system/connector-health/registry`, and `/api/system/connector-health/snapshot` for uptime checks without secret values. |
| Frontend dashboard | `client/src/pages/ConnectorHealthOS.tsx` | Polls backend status, shows blocked/degraded/manual-proof rails, and emits Sentry proof from admin view. |
| Routes | `/connector-health`, `/connector-health-os`, `/admin/connector-health`, `/autonomous-connector-sweep` | Live UI surfaces for operators. |
| Python sweep | `scripts/connector-health-sweep.py` | Deterministic cloud-computer or cron sweep without printing secret values. |
| Julia sweep | `scripts/connector_health_sweep.jl` | Julia mirror for the same no-secret connector proof model. |

## Connector Proof Model

Connector status is separated into four outcomes. **OK** means the required no-secret configuration proof is present. **Degraded** means a non-critical rail is missing secure proof. **Blocked** means a critical rail is missing secure proof and production automation must stop on that lane. **Same-Session Proof** means OAuth or browser/session connectors require a harmless live capability check because environment variables, old screenshots, or prior-session success are not proof.

| Status | Meaning | Required action |
|---|---|---|
| `ok` | Required configuration proof is present. | Continue only within approved lane and action boundary. |
| `degraded` | Non-critical proof missing. | Record and repair; do not rely on that rail. |
| `blocked` | Critical proof missing. | Stop affected production automation and restore secure connector/env proof. |
| `manual_review` | OAuth/session connector needs live capability proof. | Run same-session read-only check before any read/write/send/post/deploy action. |

## Account Routing

The account-routing doctrine is binding. `chaddozier75@gmail.com` is the personal owner, repo, app connector, and broad Google Workspace lane. `cdozier14@athlynx.ai` is AthlynXAI Corporation business/workspace context. `cdozier14@dozierholdingsgroup.com.mx` is Dozier Holdings Group business/workspace context. `chad.dozier@icloud.com` is Apple/iOS personal context. `cdozier@dozierholdingsgroup.com` is Dozier Holdings Group Exchange/Gmail context.

Do not substitute another account, repo, Vercel team, mailbox, connector, or social identity to work around OAuth, CAPTCHA, scope, or permission problems.

## Sentry Proof

The dashboard can emit a sanitized connector-health breadcrumb/event through the existing Sentry safety layer. The backend sends summary counts and connector IDs only. It does not send secret values, cookies, tokens, raw request bodies, mailbox data, payment data, or `.env` contents. Sentry proof is evidence that the watchdog reported a sanitized state; it is not permission to mutate a connector lane without the required same-session proof.

## Cloud-Computer Sweeps

For high-frequency checks, use the cloud computer rather than per-run AI tasks. The Python and Julia scripts are deterministic and can run under cron without consuming per-run agent credits.

Suggested local commands:

```bash
pnpm connector-health:sweep
pnpm connector-health:sweep:julia
python3 scripts/connector-health-sweep.py --emit-sentry
```

A production cron should write JSON outputs to a private log folder and alert only on changed blocked/degraded state. The log folder must not be committed to GitHub or deployed to Vercel. A blocked/manual-review result on the cloud computer is expected fail-closed behavior when secure env proof or OAuth proof is missing; it is a watchdog signal, not a reason to bypass the connector gate.

## Safety Boundary

Plaintext passwords, API keys, OAuth tokens, MCP tokens, app passwords, cookies, private keys, `.env` files, raw mailbox contents, payment actions, and destructive database changes are never pushed into GitHub or Vercel. They belong only in approved OAuth flows, connector settings, Vercel environment variables, or a secure secret manager.

## Recovery Order

When a connector fails, the operator must identify the affected rail, confirm the intended business lane, run a harmless read-only proof check, restore connector/OAuth/env proof, emit Sentry proof, and only then resume the exact approved production action. If browser identity, connector identity, and intended mailbox/project/repo disagree, stop and report the mismatch.

## Live-Before-Checkoff Doctrine

No production-safe AthlynXAI checklist item is complete merely because it exists in a chat, local file, recovery archive, browser tab, or draft. For any item that affects the public platform, operating doctrine, source code, production configuration, live route, or user-facing proof surface, the item is not checked off until it has completed the full delivery path: reviewed local change, clean secret scan, GitHub commit to `AthlyXAI/AthlynX-V2-Official`, Vercel deployment to `athlynx-platform`, and live route or API verification.

Private evidence, investor materials, credentials, raw mailbox content, financial archives, and other vault-only materials must not be forced into Vercel just to satisfy this rule. Those items are checked off only after they are preserved in the private vault and referenced by a production-safe public or internal index when appropriate.

When Chad says to keep going one by one, the operator should continue executing the checklist without repeated stop-and-ask messages, but each item must still pass the appropriate safety gate before being marked complete. The default completion proof is: commit SHA, Vercel deployment ID/state, live route/API status, and a short proof note.

