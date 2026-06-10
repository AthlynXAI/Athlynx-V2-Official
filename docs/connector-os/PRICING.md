# DHG Connector OS — Pricing Model v1

**Author:** Chad A. Dozier Sr.
**Locked:** Tuesday, May 12, 2026 — 3:18 PM CDT
**Model:** Dual-sided. We charge the operator AND the end user.

---

## The principle

> "We do it all in one for all the companies and charge them and the user a fee."
> — Chad, May 12, 2026

Stripe charges merchants 2.9% + 30¢. They also take a cut of Connect platform fees. They are both the rail and the toll. **DHG Connector OS is the same model, applied to the whole one-person-company stack — compute, connectors, AI, storage, traffic.**

---

## SIDE A — The Operator (licensee founder)

The founder building on our rails pays a platform subscription + metered usage.

### Tier 1 — Solo Operator · $99/month
- 1 active operator seat
- 5 pre-authed connectors of choice (out of 17+)
- 10,000 API calls/month included
- 1,000 MCP calls/month included
- 100 Nebius H200 minutes included
- Stripe webhook receiver on us
- Supabase project shared (1 DB)
- **Overage:** $0.001/API call, $0.01/MCP call, $1.50/Nebius H200 minute

### Tier 2 — Lightning · $499/month
- 3 operator seats
- All 17 connectors active
- 100,000 API calls/month included
- 25,000 MCP calls/month included
- 1,000 Nebius H200 minutes included
- Dedicated Supabase project (1 DB)
- Stripe Connect Express sub-account included
- Custom MCP server (your tools exposed to Claude/GPT/Gemini)
- White-label option (your brand on the operator UI)
- **Overage:** $0.0008/API call, $0.008/MCP call, $1.25/Nebius H200 minute

### Tier 3 — Network Node · $2,499/month
- Unlimited operator seats
- All connectors + private connector requests (we build new ones for you)
- 1M API calls/month included
- 250K MCP calls/month included
- 10,000 Nebius H200 minutes included
- Dedicated Supabase cluster
- Stripe Connect Standard with revenue share
- Custom domain (`os.yourbrand.com`)
- SLA: 99.9% uptime, 24h response
- **Overage:** $0.0005/API call, $0.005/MCP call, $1.00/Nebius H200 minute

### Tier 4 — Enterprise / Layer Cake License · Custom
- Full reference implementation (the AthlynXAI codebase as a template)
- On-prem or single-tenant cloud deploy option
- Source code escrow
- Co-marketing as a DHG Connector OS partner
- Revenue share negotiated per deal

---

## SIDE B — The End User (the operator's customer)

When an end user (an athlete on AthlynXAI, a customer on a licensee app) spends money or consumes AI/compute, **we take a slim cut on top of what the operator collects**. This is the toll-road revenue.

### B1 — Transaction Platform Fee
- **0.5% + $0.05** on every Stripe transaction routed through a Connector OS Stripe account
- Stacks on top of Stripe's 2.9% + 30¢ (we are the platform; Stripe is the processor)
- Applies to: subscriptions, credit purchases, NIL deal escrow releases, marketplace transactions

### B2 — Credit Resale Margin
- Operators sell credits to end users (AthlynXAI already does: 100/500/1000 credit packs)
- We charge the operator wholesale; they resell at retail; **we keep a 15% margin** on every credit consumed in our infra (Nebius inference, AI features, storage)

### B3 — AI Feature Fee
- Premium AI features (auto-highlight reel, NIL valuation, recruiting outreach drafts) carry an embedded per-call fee
- Operator decides whether to absorb it or pass it through
- **Suggested pass-through:** $0.10–$2.00 per AI action depending on compute weight
- We collect $0.05–$1.00 per action depending on Nebius minutes consumed

### B4 — Premium Connector Access (end-user side)
- End users with premium subscriptions on a licensee app can unlock cross-platform syndication (Layer 9) — one post to IG + TikTok + X + YouTube + FB
- We charge the operator $0.02 per syndicated post; operator marks up to $0.10–$0.25 in the premium tier

---

## The Layer Cake fee map (which layer monetizes both sides)

| Layer | Side A revenue | Side B revenue |
|---|---|---|
| 1. Identity | Seat fee | — |
| 2. Public Feed | API + MCP overage | AI ranking fee |
| 3. Private Messenger | API overage | AI reply draft fee |
| 4. NIL Public Feed | Connector access | Verification fee |
| 5. NIL Messenger | Stripe Connect setup | **0.5% + $0.05 escrow fee** ← big one |
| 6. Calendar | Connector pack | — |
| 7. The Stack | Per-seat (multi-role) | — |
| 8. AI on Top | Nebius minutes included | **Per-AI-action fee** ← big one |
| 9. Syndication | Buffer/Zapier connector | Per-syndicated-post fee |

**Layers 5 and 8 are the two cash registers.** Money and AI. Both metered both sides.

---

## Revenue projection (back-of-envelope, conservative)

Assume by Q4 2026:
- 50 operators on Tier 1 ($99) = $4,950 MRR
- 20 operators on Tier 2 ($499) = $9,980 MRR
- 5 operators on Tier 3 ($2,499) = $12,495 MRR
- **Side A subtotal: $27,425 MRR · $329K ARR**

End-user side (across all operators):
- 10,000 active end users
- Avg $20/month in transaction volume per end user × 0.5% = $1.00/user/month
- Plus $0.50/user/month in AI feature fees
- **Side B subtotal: $15,000 MRR · $180K ARR**

**Combined Year 1 ARR target: ~$509K — bootstrappable, no outside capital required.**

---

## What Stripe sees

- Operators pay via Stripe subscriptions (Tier 1/2/3 priced as recurring)
- End-user fees collected via Stripe Connect application_fee_amount
- AthlynXAI Corporation `acct_1SqfSOGvvjXZw2uE` is the platform; each licensee gets a connected account
- All revenue lands in one ledger row per transaction in `traffic_ledger` table (Supabase)

---

## Pricing locks for AthlynXAI itself (the first car on the rails)

AthlynXAI Corporation **does not pay** the Tier 1/2/3 fee — it IS the OS. But every athlete subscription and credit purchase that runs through AthlynXAI counts against Side B fees, which **stay inside DHG** rather than being paid out. That makes AthlynXAI:
- The reference implementation (proves the OS works)
- A free internal stress test (we eat our own dog food)
- A 100% Side-B-margin product (no Side A outflow because we ARE Side A)

Every other licensee pays both sides. AthlynXAI pays neither. That's the founder advantage.

---

## Open pricing questions for Chad

1. **Setup fee?** Charge operators a one-time $500–$2,500 onboarding for the Lightning tier to cover connector provisioning + Supabase project setup?
2. **Annual discount?** 2 months free on annual prepay (standard SaaS move)?
3. **Free tier?** Tier 0 with 1 connector + 100 API calls/month to drive bottom-of-funnel?
4. **Nebius credit pass-through?** When a licensee burns their own Nebius credits (vs ours), do we still charge the platform inference fee? Recommend: yes, at half rate.

---

*Iron Sharpens Iron — Proverbs 27:17*
**
