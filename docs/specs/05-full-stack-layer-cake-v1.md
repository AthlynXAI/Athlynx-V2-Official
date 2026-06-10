# Full Stack Layer Cake v1 — AthlynXAI Handoff Specification

**Prepared for:** Chad A. Dozier Sr., Founder & CEO, AthlynXAI Corporation
**Prepared by:** Manus AI
**Date:** 2026-05-16
**Lane:** Manus research, drafts, specs, QA, and handoff intelligence only
**Status:** Doctrine-aligned, research-safe, Computer-lane handoff-ready
**Codebase status:** Approved by Chad and pulled into doctrine as spec **05** (Build 27.1, alongside specs 01–04).

> **Lane rule:** This document is a finished draft/spec package. It does not touch code, GitHub, Vercel, Supabase, Stripe, Buffer, Zapier, Search Console, app stores, production infrastructure, live accounts, or screenshots. Computer owns implementation.

---

## 1. Executive Thesis

AthlynXAI is the **athlete identity OS** — the connector of connectors that owns the athlete identity graph and routes every signal between every other tool in the athlete economy. The company does not win by becoming another NIL marketplace, graphics tool, team app, or social feed. AthlynXAI wins by **owning the routing layer underneath those categories**.

The Full Stack Layer Cake is the operating shape of that thesis. One athlete profile carries the athlete from 8U to retirement. One graph holds identity, calendar, roster, history, wallet, communication, consumption, and pipeline. One Connector OS moves signed, versioned tokens across every layer and out to the rest of the internet.

**Plain version:** AthlynXAI is where the athlete lives the whole athletic life, owns the data, and routes the next post, next event, next deal, next payment, next milestone, and next move.

---

## 2. Non-Negotiable Positioning

| Doctrine Point | Layer Cake Meaning |
|---|---|
| Category-above competition | AthlynXAI sits above marketplaces, graphics tools, team apps, and recruiting apps because it owns the identity and routing graph underneath them. |
| Athlete-owned everything | The athlete owns profile, data, audience, money, content, professional stack, and lifetime record. |
| Lifecycle, not snapshot | The product follows the athlete from 8U to retirement, not only through the college-eligible NIL window. |
| Routing, not inventory | The OS routes deals, posts, events, messages, payments, and records without needing to own every external destination. |
| One thread → infinite broadcast | A canonical action starts inside AthlynXAI and can broadcast outward without duplication or contradiction. |

---

## 3. The Eight-Asset Athlete Identity Graph

Every athlete on Earth has eight assets. AthlynXAI is built to route all eight through one graph.

| Asset | What It Holds | Athlete-Owned Outcome | Primary Tokens |
|---|---|---|---|
| **Identity** | Name, image, likeness, story, vitals, school, sport, level, verified badge, NIL valuation tile | One canonical profile that travels with the athlete | `AthleteToken`, `VerificationToken` |
| **Calendar** | Games, camps, showcases, practices, recruiting visits, brand shoots, recovery, family events | One schedule instead of scattered calendars | `EventToken` |
| **Roster Graph** | Teammates, coaches, parents, agents, scouts, lawyers, advisors, trainers, brands | One relationship graph around the athlete | `StackToken`, `MessageToken` |
| **History** | Stats, film, scores, routines, achievements, milestones, awards | A lifetime record from youth to pro to retirement | `RoutineToken`, `ScoreToken`, `MilestoneToken` |
| **Wallet** | NIL, sponsorships, gear, expenses, escrow, payouts, royalties | Every deal and every dollar in one ledger | `DealToken`, `LedgerToken` |
| **Communication** | DMs, team chats, parent threads, deal rooms, recruiting rooms | One thread that can route to every needed party | `MessageToken`, `BroadcastToken` |
| **Consumption** | Gear, brands, media engagement, fan signals, marketplace preferences | First-party preference graph the athlete owns | `EquipmentToken`, `MarketplaceToken` |
| **Pipeline** | Next school, next camp, next tournament, next offer, next deal, next move | Predictive routing based on the other seven assets | `BidToken`, `CommitToken`, `AIToken` |

---

## 4. The Nine Layer Cake Layers

The Layer Cake is the product architecture and the marketing story. Same shape inside and outside.

| Layer | Product Purpose | Primary Audience | Core Objects | Token Output |
|---|---|---|---|---|
| **1 — Identity** | Public athlete profile, verified badge, story, vitals, NIL valuation, highlights | Athletes, parents, brands, schools | Athlete profile, verification record, NIL tile | `AthleteToken`, `VerificationToken` |
| **2 — Public Feed** | Ranked timeline for posts, highlights, results, milestones, and team updates | Athletes, coaches, fans, schools | Posts, reels, comments, shares, milestone cards | `PostToken`, `RoutineToken`, `ScoreToken`, `MilestoneToken` |
| **3 — Private Messenger** | 1:1 and group communication for athletes, coaches, parents, scouts, and support stack | Athletes, coaches, parents, scouts, advisors | DMs, group chats, files, voice/video notes | `MessageToken` |
| **4 — NIL Public Feed** | Verified brand deals and sponsorship moments surfaced publicly | Athletes, brands, fans, schools | Deal posts, brand cards, sponsorship announcements | `DealToken`, `MarketplaceToken`, `EquipmentToken` |
| **5 — NIL Private Messenger** | Deal rooms for brand, athlete, agent, lawyer, advisor, and family review | Athletes, brands, agents, lawyers, advisors, parents | Deal thread, terms, approvals, e-sign, escrow status | `MessageToken`, `DealToken`, `LedgerToken`, `VerificationToken` |
| **6 — Calendar** | Unified schedule for games, practices, camps, showcases, recruiting, brand shoots, recovery | Athletes, parents, coaches, schools, brands | Events, RSVPs, conflicts, tournament hubs | `EventToken` |
| **7 — The Stack** | Pinned panel of every professional and family support role in the athlete's life | Athletes, parents, coaches, agents, scouts, lawyers, advisors, trainers | Role-based profiles, permissions, relationship records | `StackToken`, `VerificationToken` |
| **8 — AI on top** | Caption, valuation, matchmaker, co-pilot, review, highlights, recommendations | Athletes, coaches, brands, schools | AI Caption Engine, AI Co-Pilot, Engine 8 Review Engine, valuation logic | `AIToken` |
| **9 — Syndication out** | One-Tap Multi-Channel Publish and outbound broadcast to external channels | Coaches, athletes, schools, brands | Broadcast envelope, channel map, caption variants, posting records | `BroadcastToken`, `TraffickToken` |

---

## 5. Tokenization Layer

Every meaningful action inside AthlynXAI emits a token. A token is **not crypto**. A token is a canonical, signed, versioned object in the AthlynXAI data graph. It can be routed, metered, audited, priced, syndicated, and reviewed.

| Token Class | Meaning | Typical Layer(s) |
|---|---|---|
| `AthleteToken` | Verified athlete identity and profile state | 1, 7, 8 |
| `StackToken` | Verified support-role relationship around the athlete | 7 |
| `PostToken` | Content authored inside AthlynXAI | 2, 9 |
| `MessageToken` | Private or deal-room communication | 3, 5 |
| `EventToken` | Calendar event, camp, game, showcase, practice, visit, or brand shoot | 6 |
| `DealToken` | NIL or sponsorship deal state | 4, 5 |
| `RoutineToken` | Sport-specific performance object | 2, 8 |
| `ScoreToken` | Sport-specific result object | 2, 8 |
| `BidToken` | Recruiting, all-star, transfer, or opportunity offer | 4, 6, 8 |
| `CommitToken` | Signing, commitment, transfer, or enrollment decision | 1, 2, 4 |
| `MilestoneToken` | Career event such as PR, Perfect 10, Hit Zero, senior night, signing day | 2, 8, 9 |
| `EquipmentToken` | Gear used, endorsed, purchased, or matched to athlete profile | 4 |
| `MarketplaceToken` | Brand-owned or athlete-owned SKU | 4 |
| `BroadcastToken` | Syndication record for outbound publishing | 9 |
| `LedgerToken` | Money movement, escrow, payout, royalty, or license event | 4, 5, OS-level |
| `TraffickToken` | Operator-side platform usage and compute/metering event | OS-level |
| `VerificationToken` | Signed trust attestation for athlete, coach, brand, deal, or stack role | All layers |
| `AIToken` | AI inference, caption, valuation, review, matchmaker, or co-pilot event | 8 |

---

## 6. Connector OS Flow

The Connector OS is the bus that carries tokens between layers and out to external systems. Every layer is valuable by itself. The compounding value appears when tokens move cleanly across layers.

```
[Layer 1 Identity]
  AthleteToken + VerificationToken
        ↓
[Layer 2 Public Feed]
  PostToken wrapping RoutineToken / ScoreToken / MilestoneToken
        ↓
[Layer 9 Syndication out]
  BroadcastToken to IG / TikTok / X / YouTube / Facebook / newsletters / SMS
        ↓
[OS-Level Metering]
  TraffickToken + LedgerToken
        ↓
[Layer 8 AI on top]
  AIToken for captions, valuation, review, matchmaker, and next move
        ↓
[Layer 4 NIL Public Feed]
  DealToken when brand interest becomes verified opportunity
        ↓
[Layer 5 NIL Private Messenger]
  MessageToken inside deal room with approval state
        ↓
[Money + Trust]
  LedgerToken + VerificationToken
        ↓
[Back to Layer 1 Identity]
  AthleteToken.deals[] and NIL valuation update
```

This flow keeps the canonical record inside AthlynXAI. External systems receive a routed payload. **AthlynXAI keeps the identity, proof, and ledger.**

---

## 7. The Athlete Playbook

The Athlete Playbook is the athlete-facing operating guide inside the Full Stack Layer Cake. It explains how AthlynXAI boosts recruiting presence, improves the athlete's media profile, and connects athletes globally to compare recruiting efforts, share sport schedules, and learn from one another.

| Playbook Area | Athlete Value | Layer Cake Tie-In |
|---|---|---|
| Recruiting Presence | The athlete builds one profile that carries film, stats, school, calendar, milestones, contact path, and stack support. | Layers 1, 6, 7, 8 |
| Media Profile | The athlete turns scores, routines, final results, highlights, and milestones into clean posts without losing the source record. | Layers 2, 8, 9 |
| Global Athlete Connection | Athletes can follow, message, compare, and learn from athletes in the same sport, level, region, or recruiting path. | Layers 2, 3, 6 |
| Recruiting Comparison | Athletes can compare camps, showcases, tournament schedules, offer timing, milestones, and next-step paths. | Layers 6, 8, Pipeline asset |
| Schedule Sharing | Athletes, parents, coaches, and scouts can see the right calendar context without exposing private events to the wrong audience. | Layer 6, Layer 7 |
| Ownership Education | The athlete learns what they own: profile, data, audience, money, content, history, and professional stack. | All layers |

The Playbook must be written in athlete-first language. **No marketplace-speak. No empty hype.** Every section should answer one question: **what does the athlete get?**

---

## 8. Studio Suite Placement

Studio Suite is not a separate product floating beside the Layer Cake. It is the coach-facing and team-facing production surface inside the OS.

| Studio Suite Feature | Layer Placement | Token Output | Purpose |
|---|---|---|---|
| Lineup Studio | Layer 2 Public Feed, Layer 6 Calendar, Layer 9 Syndication | `PostToken`, `EventToken`, `BroadcastToken` | Turns lineup context into a post and outbound broadcast. |
| Match Day Studio | Layer 2 Public Feed, Layer 6 Calendar, Layer 8 AI on top, Layer 9 Syndication | `EventToken`, `PostToken`, `AIToken`, `BroadcastToken` | Builds match-day assets from schedule context and team voice. |
| Final Score Studio | Layer 2 Public Feed, Layer 8 AI on top, Layer 9 Syndication | `ScoreToken`, `PostToken`, `AIToken`, `BroadcastToken` | Turns final result into verified public content. |
| AI Caption Engine | Layer 8 AI on top | `AIToken` | Nebius Llama 3.3-70B produces three caption variants in team voice. |
| One-Tap Multi-Channel Publish | Layer 9 Syndication out | `BroadcastToken`, `TraffickToken` | Posts past the bottleneck while preserving the canonical AthlynXAI record. |

---

## 9. Sport-Specialized Payload Map

The graph is shared. The payload changes by sport. Cheer, Gymnastics, Marching Arts, football, baseball, track, golf, and every other sport should emit the same token classes with sport-specific payload fields where needed.

| Sport / Group | Payload Focus | Example Tokens |
|---|---|---|
| Cheerleading | Hit Zero, bids, Daytona, Worlds, Game Day, stunts, pyramid, baskets, tumbling, jumps, dance | `RoutineToken.cheer`, `ScoreToken.cheer`, `MilestoneToken.cheer`, `BidToken.cheer`, `EventToken.cheer` |
| Gymnastics | Apparatus, D/E scoring, 10.0 scoring, stuck landings, Perfect 10, NCAA, Elite, USAG, Xcel | `RoutineToken.gym`, `ScoreToken.gym`, `MilestoneToken.gym`, `BidToken.gym`, `EventToken.gym` |
| Marching Arts | BOA, WGI, DCI, section leadership, performance schedule, equipment, placements, sponsorship moments | `RoutineToken.marching`, `ScoreToken.marching`, `MilestoneToken.marching`, `EquipmentToken.marching` |
| Football | Drives, snaps, plays, offers, combines, camps, official visits, signing day | `RoutineToken.football`, `ScoreToken.football`, `BidToken.football`, `CommitToken.football` |
| Baseball / Softball | At-bats, pitches, defensive plays, tournament schedule, showcases, recruiting pipeline | `RoutineToken.baseball`, `ScoreToken.baseball`, `EventToken.baseball`, `BidToken.baseball` |
| Track / Cross Country | Splits, times, PRs, meets, qualifying standards, relays | `ScoreToken.track`, `MilestoneToken.track`, `EventToken.track` |
| Golf | Hole score, tournament round, equipment, ranking movement, recruiting events | `ScoreToken.golf`, `EquipmentToken.golf`, `EventToken.golf` |

---

## 10. Trust, Safety, and Compliance Rules

Trust is a layer in practice even when it is not numbered as one of the nine layers. AthlynXAI must protect athletes, parents, schools, brands, and deal participants through signed identity, role-aware permissions, compliance review, and audit trails.

| Rule | Required Behavior |
|---|---|
| Verified nouns only | Use verified athlete, verified coach, verified brand, and verified deal language. |
| Youth safeguards | Parent visibility, consent, role permissions, and compliance review must be built into youth-athlete flows. |
| State-law fit | Brand and NIL workflows should account for state NIL law fit before a deal is routed. |
| Signed token trail | Every token should include author, timestamp, version, and verification reference where applicable. |
| Audit first | Ledger, deal, verification, and broadcast events should be auditable. |
| No crypto language | Tokenization means signed Postgres objects and metered events, not coins, Web3, or blockchain. |

---

## 11. Computer-Lane Implementation Handoff

| Priority | Handoff Item | Computer-Owned Action |
|---|---|---|
| 1 | Canonical doctrine reference | ✅ Pulled into codebase doctrine references as spec 05 (Build 27.1). |
| 2 | Caption Engine prompt | Anchor Nebius Llama 3.3-70B system prompt to `m9_brand_voice_reconciled.md` VOC rules and this Layer Cake vocabulary. |
| 3 | Studio Suite token outputs | Map Lineup Studio, Match Day Studio, Final Score Studio, AI Caption Engine, and One-Tap Publish to the token outputs listed above. |
| 4 | The Athlete Playbook | Add product copy / information architecture for recruiting presence, media profile, global athlete connection, comparison, and schedule sharing. |
| 5 | Sport payloads | Build sport-specialized payloads without splitting token classes by sport. |
| 6 | Trust and compliance | Keep verification, youth safeguards, state-law fit, and audit trails in the build queue. |

---

## 12. Definition of Done

| Requirement | Completion Standard |
|---|---|
| Doctrine aligned | Product language centers athlete identity OS, athlete-owned data, lifecycle, routing, and category-above posture. |
| Voice aligned | Copy is founder-direct, athlete-first, proof-backed, faith-anchored in the close, and Mississippi-grounded. |
| Layer complete | All nine layers have purpose, audience, objects, token output, and implementation handoff notes. |
| Token complete | Token classes are mapped to product layers and flow through the Connector OS. |
| Playbook included | The Athlete Playbook is present and athlete-facing. |
| Lane safe | Manus output remains draft/spec only; Computer owns implementation. |

---

## 13. Close

AthlynXAI is the **athlete identity OS**. The Layer Cake is how the athlete lives inside it. The Connector OS is how the tokens move. The athlete owns the profile, the data, the audience, the money, the content, the history, and the next move.

Built in Mississippi. Built for every athlete in every sport at every level. From 8U to retirement.

*Iron Sharpens Iron — Proverbs 27:17.*
