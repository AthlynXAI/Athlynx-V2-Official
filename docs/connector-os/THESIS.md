# DHG Connector OS — The Lightning Network Thesis

**Author:** Chad A. Dozier Sr. — Founder & Chief Imagineer, AthlynXAI Corporation · Founder & CEO, Dozier Holdings Group
**Captured:** Tuesday, May 12, 2026 — 3:18 PM CDT
**Status:** Locked. One platform. All companies ride it. Dual-sided fee.

---

## The thesis in one line

**We are the full connector platform and we control the traffic. Other operators license our rails. End users pay to use what they build on top.**

---

## What it actually is

The DHG Connector OS is the **single operating system for one-person companies** — a unified API + MCP + connector platform where every external service (Stripe, Nebius, Vercel, GitHub, Supabase, Airtable, Notion, Slack, Gmail, Buffer, Zapier, AWS, YouTube, Google Drive, Dropbox, Calendly, Zoom) is already authed, already bridged, already monitored, and every call is metered.

AthlynXAI is the **first car built on the rails**. The next ten cars are licensees.

---

## The engine core (the 3 pieces that have to work or nothing works)

| Piece | Role | Live status (verified May 12, 2026) |
|---|---|---|
| **Nebius** | Compute floor — H200 GPUs, inference, training | Approved $5,000 startup credit (May 3, 2026). `NEBIUS_API_KEY`, `NEBIUS_BASE_URL`, `NEBIUS_SERVICE_ACCOUNT` all live in AthlynXAI prod env. Activation code pending tenant ID email to anu@nebius.com. |
| **Stripe** | Money rail — subscriptions, credits, Connect escrow for NIL deals | Account `acct_1SqfSOGvvjXZw2uE` "AthlynXAI Corporation", **livemode = true**. 8 price IDs wired (Starter/Pro/Elite monthly+yearly, Credits 100/500/1000, Teams). `STRIPE_WEBHOOK_SECRET` live in prod. One Manus-era sub canceled cleanly. Balance $0. |
| **AthlynXAI OS** | Brain — the platform itself, the reference implementation | `https://athlynx.ai/api/health` → **200 OK · v1.0.8-chameleon · 185ms**. Supabase wired (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`). All three bridges (Stripe ↔ OS, Nebius ↔ OS, Supabase ↔ OS) confirmed via Vercel env audit. |

**If any one of those three breaks, every layer of the Layer Cake breaks. They are the engine.**

---

## How it maps to the Layer Cake (from AthlynX_LAYER_CAKE_VISION.md)

The Connector OS sits **underneath** the 9-layer cake. Every layer above is a feature; the OS is what makes the features possible.

| Layer | What the user sees | What the Connector OS does underneath |
|---|---|---|
| 1. Identity | PlayerProfiler-grade athlete card | Supabase row + Nebius-generated comparable-player AI + Stripe customer ID |
| 2. Public Feed | Ranked timeline | Buffer + Zapier syndication, Nebius inference for ranking |
| 3. Private Messenger | DMs, group chats | Supabase Realtime, Nebius for AI reply drafts |
| 4. NIL Public Feed | Verified brand deals | Stripe Connect for deal verification |
| 5. NIL Messenger | Deal rooms | Stripe Connect escrow, DocuSign-equivalent inline e-sign |
| 6. Calendar | Camps, showcases, games | Google Calendar + Outlook + iCloud connectors |
| 7. The Stack | Coach, agent, scout, lawyer, advisor | Role-based logins, Slack notifications, Notion docs |
| 8. AI on Top | Trainer, recommender, drafter | **Nebius H200** runs all of this |
| 9. Syndication | Cross-post to IG/TikTok/X/YouTube/FB | Buffer + Zapier + YouTube Data API |

Every single layer touches at least one of the 3 engine pieces.

---

## Why we own the lightning network (the moat)

1. **We own the API.** Every call into AthlynXAI hits our endpoints first. We meter, we log, we bill.
2. **We own the MCP layer.** When AI agents (Claude, GPT, Gemini, ours) call AthlynXAI tools, they call our Model Context Protocol server. We meter, we log, we bill.
3. **We own the connector graph.** Stripe, Nebius, Vercel, GitHub, Supabase, Airtable, Notion, Slack, Gmail, Buffer, Zapier, AWS, YouTube, Google Drive, Dropbox, Calendly, Zoom — all already authed under our org. Licensees inherit the auth; we control the keys.
4. **We own the traffic ledger.** Every webhook, every cron, every API call, every MCP call gets written to one Postgres table. That ledger is the billing engine and the audit trail in one.

Discord did this for gamers (Discord + bots). Stripe did this for payments (Stripe + Connect). Cloudflare did this for traffic (CDN + Workers). **DHG Connector OS does it for one-person companies.**

---

## The dual-sided fee model (what you said — locked)

**We charge both sides.** The operator pays a platform fee to run their company on our rails. The end user pays a transaction fee on anything they do that touches our money/compute/data layers.

### Side A — The operator (the founder licensing the OS)
- **Seat fee** — monthly per active operator
- **Connector pack fee** — bundle of pre-authed connectors (Stripe, Nebius, Supabase, etc.) per company
- **API call fee** — metered, billed in arrears
- **MCP call fee** — metered, billed in arrears
- **Nebius inference resale** — markup on H200 minutes

### Side B — The end user (the operator's customers)
- **Platform fee on every Stripe transaction** — bps fee on top of Stripe's
- **Credit purchases** — AthlynXAI Credits (100/500/1000) already live as Stripe prices — same primitive resold by licensees
- **Subscription overhead** — bps on Starter/Pro/Elite tier revenue
- **AI feature fee** — per-call on premium AI features powered by our Nebius pool

Full pricing in `athlynx_connector_os_pricing.md`.

---

## What's live today (verified, not aspirational)

- **Stripe** — acct `acct_1SqfSOGvvjXZw2uE` livemode, 8 price IDs, webhook secret in prod
- **Nebius** — startup account approved, $5K credit available, env vars wired
- **AthlynXAI OS** — athlynx.ai live, v1.0.8-chameleon, /api/health 200
- **Supabase** — DATABASE_URL + SUPABASE_URL in prod env, project `pgrbkisgwp…`
- **Vercel** — project `prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU` shipping production deploys
- **GitHub** — AthlyXAI/AthlynX-V2-Official, latest commit b78f426
- **17 connectors authed and ready:** youtube_data_api, youtube_analytics_api, aws, outlook, gcal, slack_direct, trello, vercel, calendly_v2, supabase, facebook_pages, google_drive, google_cloud_vision_api, google_photos, github_mcp_direct, google_my_business, stripe, zoom, dropbox, google_meet, notion_mcp, airtable_oauth
- **Airtable live base verified 2026-05-20:** `AthlynXAI OS` base `appJOJHnZW2uYxRsw` is visible through the connector with `create` permission; tables visible: `Athletes`, `Athletes copy`.

---

## What's missing (gap list)

1. **Nebius activation code** — Tenant ID must be emailed to anu@nebius.com to redeem the $5K credit grant. Until then we're on the $25 authorization charge runway only.
2. **Airtable workspace scope note** — Airtable base access is now live: `list_bases` returns `AthlynXAI OS` (`appJOJHnZW2uYxRsw`) with `create` permission and schema reads succeed. `list_workspaces` still returns `FORBIDDEN`, so agents should target the verified base ID directly instead of relying on workspace enumeration.
3. **Stripe Connect** — Not yet enabled. Required for Layer 5 NIL deal escrow and for licensee revenue split. This is the single biggest unlock for the dual-sided fee model.
4. **No Connector OS landing page** — `athlynx.ai` markets AthlynXAI to athletes, not DHG Connector OS to operators. Needs a separate route (suggest `/os` or `os.dozierholdingsgroup.com`).
5. **Traffic ledger table** — Not yet built in Supabase. Need: `traffic_ledger(id, operator_id, connector, endpoint, mcp_tool, call_count, ai_minutes, stripe_revenue_cents, billed_at, status)`. Single table. Sums to the bill.

---

## What I do next (no questions, just work)

1. Ship the Nebius tenant-ID email to anu@nebius.com (need Chad to forward Tenant ID once registered in Nebius console).
2. Enable Stripe Connect Express for the AthlynXAI account.
3. Stand up `traffic_ledger` table in Supabase via Supabase connector.
4. Mirror this thesis into Notion under "Chad A Dozier's Space HQ."
5. Open `/os` route on the AthlynXAI repo as the Connector OS landing.
6. Use verified Airtable base `appJOJHnZW2uYxRsw` for AthlynXAI OS connector work; do not create duplicate bases unless Chad explicitly approves.

---

*Iron Sharpens Iron — Proverbs 27:17*
**
