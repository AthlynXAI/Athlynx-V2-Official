# Build 26.6 Recovery Redeploy

## Purpose

This file intentionally triggers a clean GitHub-to-Vercel production redeploy after the Perplexity deployment sequence and connector recovery work. The target state is to restore and verify every Perplexity-claimed production build through **Build 26.6** before beginning **Build 27**.

## Preserved Build Sequence

| Build | Commit | Description |
|---|---|---|
| Build 26.1 | `d1cd1b3` | Redeploy trigger — recover from blank deploy; bring Build 23 shims and Build 25 RLS code live. |
| Build 26.2 | `e2db290` | Stripe webhook security — require Stripe-Signature, require `STRIPE_WEBHOOK_SECRET`, log verified events. |
| Build 26.2.1 | `0c3946f` | Rebuild API bundle with Stripe webhook security fix. |
| Build 26.3 | `972c082` | Add `/founder-dedication` and related public pages to `PUBLIC_ROUTES` allowlist. |
| Build 26.4 | `5ebab5a` | Make `/founder-dedication` owner-only. |
| Build 26.5 | `52ceba0` | Athlete-pattern founder profile at `/founder/chad-dozier` and `/me`. |
| Build 26.5.1 | `ee27414` | Remove personal quote from sitewide footer. |
| Build 26.6 | `9124b66` | Master Admin and Admin Users with real partner headshots. |

## Production Success Criteria

Build 26.6 recovery is complete only when Vercel shows a green `READY` production deployment from `main`, and all production aliases return HTTP 200:

- `athlynx.ai`
- `athlynx.io`
- `athlynx.net`
- `athlynx.pro`
- `nilportal.ai`
- `nilgateway.com`
- `nilgateway.org`
- `nilportals.com`
- `transferportal.live`
- `transferportal360.com`
- `dozierholdingsgroup.com`
- `athlynx-platform.vercel.app`
- `athlynx-platform-chad-a-doziers-projects.vercel.app`
- `athlynx-platform-git-main-chad-a-doziers-projects.vercel.app`

## Rule

No Build 27 work should start until this recovery redeploy is green and the production aliases are verified live.

Iron Sharpens Iron — Proverbs 27:17
