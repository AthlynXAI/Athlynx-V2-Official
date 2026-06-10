# Social Publishing Runbook — chaddozier75-cmd

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

This runbook is the permanent source of truth for the **chaddozier75@gmail.com / chaddozier75-cmd** social publishing lane. It exists because social posting has failed repeatedly when the working identity, Buffer channel IDs, Zapier MCP server, and Buffer token state were treated as assumptions instead of validated facts.

## Operating Identity

All ordinary social publishing connector work must use the approved connector identity for that platform, with `chaddozier75@gmail.com / chaddozier75-cmd` as the owner/app connector lane where Google login is available. Use `cdozier14@athlynx.ai` only for AthlynXAI Corporation business context and `cdozier14@dozierholdingsgroup.com.mx` only for Dozier Holdings Group business context, after live identity proof.

## Confirmed Channel Inventory

The following Buffer channel IDs are the confirmed channel targets from the project master reference. LinkedIn is intentionally excluded from the Buffer batch when it has already been posted through the direct LinkedIn connector.

| Destination | Buffer Channel ID | Notes |
|---|---:|---|
| Instagram `chad_dozier` | `69e6cca6031bfa423c26478e` | Buffer channel |
| YouTube `Chad A. Dozier` | `69e6cd7c031bfa423c264dd5` | Video channel |
| TikTok `chadadozierdozier` | `69e6cd99031bfa423c264e8c` | Video-only channel |
| Google Business `VCT Holdings` | `69e6cdf3031bfa423c2650a8` | Buffer channel |
| X/Twitter `ChadADozier2` | `69e6ce05031bfa423c265121` | Short caption required |
| TikTok `cdozier75` | `69e6ce56031bfa423c2652c8` | Video-only channel |
| Instagram `chaddozier14` | `69e6ce77031bfa423c265389` | Buffer channel |
| Facebook `AthlynX - The Complete Athlete Ecosystem` | `69f29ddf5c4c051afaf3e12e` | Confirmed Page target |
| Facebook `Chad Allen Dozier Sr` | `69f3f06f5c4c051afaf9eeb7` | Confirmed Page target |

## Required Secrets

Never commit social publishing tokens, Zapier MCP tokens, or Buffer API keys to GitHub. The publishing script expects credentials through environment variables only.

| Variable | Purpose |
|---|---|
| `ZAPIER_MCP_URL` | Full Zapier MCP `https://mcp.zapier.com/api/v1/connect?token=...` URL for the correct server. |
| `BUFFER_ACCESS_TOKEN` | Valid Buffer GraphQL bearer token, if using direct Buffer GraphQL publishing. |
| `APPROVED_VIDEO_URL` | Public MP4 URL for the approved video asset. |

## Permanent Preflight Rule

Before any social post is attempted, run the preflight validation path and confirm three things: the operating identity is **chaddozier75-cmd**, the destination channel IDs match this runbook, and the active publishing route returns a live authenticated connection. A visible blue connector toggle is not enough by itself; the route must pass a live read/write capability check.

## Posting Order

The safest order is Instagram direct first, LinkedIn direct second, then Buffer batch for all non-LinkedIn channels. If Buffer fails, do not keep retrying blindly. Record the exact error and repair authentication first.

## Known Failure Modes

| Error | Meaning | Correct Fix |
|---|---|---|
| `Access token is not valid` from Buffer GraphQL | The Buffer token in source/history is expired or revoked. | Replace `BUFFER_ACCESS_TOKEN` from the current Buffer developer/app credential and rerun preflight. |
| `Authentication required for Buffer` from Zapier MCP | The Zapier Buffer app connection is missing or expired on that MCP server. | Re-authenticate Buffer on the exact Zapier MCP server, then rerun the Zapier action. |
| `Required field page is missing` from Facebook Pages | Zapier could not resolve the dynamic Facebook Page selector. | Use Buffer channel IDs for Facebook Pages or repair the Facebook Pages dynamic selector in Zapier. |
| Direct social connector only posts Instagram | The Instagram connector does not imply Facebook Page or Buffer posting rights. | Use Buffer or Facebook Pages connector for Facebook Page destinations. |

## Do Not Repeat

Do not infer page/channel availability from screenshots alone. Screenshots prove account setup, but publishing requires the active API route to resolve the channel and authenticate. Do not expose secrets in reports. Do not use personal or unrelated Google identities for this lane. Do not publish to LinkedIn through Buffer if the direct LinkedIn connector already posted the same campaign.
