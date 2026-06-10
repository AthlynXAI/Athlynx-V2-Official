# AthlynX / Dozier Holdings Group — Ownership & Control Record

**This is an internal repository document. It is not served on the public site.**
**Last updated:** 2026-06-01

---

## 1. Controlling Owner

**Chad A. Dozier Sr.** is the founder, controlling shareholder, Chairman of the
Board, and Chief Executive Officer of:

- **AthlynX** (athlynx.ai — platform, AthlynXAI OS, AXN network, AVN vault,
  STRAANUNG insights, The Playbook podcast)
- **Dozier Holdings Group** (parent entity, headquartered in Houston, TX —
  formed November 2024)

Chad personally founded both entities, originated the product vision, and has
authored the substantial majority of the AthlynX codebase, brand system,
content, and deployment infrastructure.

**Primary identity for all repository, deployment, and platform actions:**
`chaddozier75@gmail.com`

---

## 2. Co-Founders (Equal Public Standing, Non-Controlling)

The following individuals are publicly recognized as co-founders of AthlynX
and hold operating roles. They do **not** hold controlling equity or board
authority over AthlynX or Dozier Holdings Group.

| Name                          | Role                                         |
|-------------------------------|----------------------------------------------|
| Chad A. Dozier Sr.            | Founder · Chairman · CEO (Controlling Owner) |
| Glenn M. Tse                  | Co-Founder · CFO · COO                       |
| Leronious (Lee) Marshall Jr.  | Co-Founder · V.P. Sales, Marketing & Partnerships |

Public-facing pages (`/team`, `/founders`, individual profiles) display these
three as equal-standing founders. Internal ownership, board, and equity
records are governed solely by this document and the executed corporate
documents held by Chad A. Dozier Sr.

---

## 3. Repository Control

- **Repo:** `AthlynXAI/Athlynx-V2-Official`
- **Default branch:** `main` (protected)
- **Sole approved committer:** `chaddozier75@gmail.com`
- **Production domain:** `https://athlynx.ai`
- **Vercel project:** `athlynx-platform` (scope: `chad-a-doziers-projects`)

### Forbidden Lanes (must never appear as committer, deployer, or org owner)

- `Cdozier14` / `cdozier14-create`
- `chaddozier-bot` / `chaddozier75-bot`
- `AthlyXAI` (one-l misspelling)
- `AthlynXAI/AthlynXAI` archived org

Any commit, deploy, or workflow attributed to a forbidden lane must be reverted
or rejected by the daily tight-ship check.

---

## 4. Change Control

The following actions require Chad A. Dozier Sr.'s **written approval** before
they take effect:

1. Issuance, transfer, or dilution of any equity in AthlynX or Dozier Holdings
   Group.
2. Addition or removal of any individual on this Ownership document.
3. Addition or removal of any approved committer or production deployer.
4. Transfer of any domain, app store account, repository ownership, billing
   account, or trademark associated with the AthlynX or DHG ecosystem.
5. Any board seat, observer right, or voting agreement.

Verbal agreements do not bind the company. Written approval means email or
signed document from `chaddozier75@gmail.com` or a successor address that Chad
has formally designated in writing.

---

## 5. Successor & Continuity

In the event Chad A. Dozier Sr. is unavailable for an extended period,
operating authority follows the order established in the executed corporate
documents held by Dozier Holdings Group. This file is a reference, not a
substitute for those documents.

---

**End of file.**

## North Star (locked 2026-06-02 by Chad)

> **We help the athletes — Name, Image & Likeness, hyped up on AI.**

This is the canonical AthlynX positioning. It belongs on the homepage hero,
in investor materials, in the App Store listing, in every official channel
bio, and as the lead line every future session uses when describing the
product.

**The thesis.** Athlete-owned NIL infrastructure with AI as the substrate —
not a feature bolted on, but the operating layer that makes athlete-owned
NIL scalable across every sport. Every lane (Real Athlete Profile, NIL
Portal / Vault / Marketplace / Calculator, AthlynXAI OS, AI Recruiter /
Scouting / Training / Content, AXN, Playbook, Brackets) serves the line.

**The inversion.** Operator-class events like the Fortune COO Summit talk
ABOUT athletes and monetize OFF athlete narratives. AthlynX is the opposite:
athletes operating ON themselves. Athletes own the identity, the record,
the consent gate, and the upside. The athlete is the customer; the platform
is the product.

**Every sport, every season.** Baseball and softball lead the seasonal lane
right now via MCWS / WCWS. Football slots in next. Then basketball. Then
soccer, lacrosse, hockey, volleyball, wrestling, track, gymnastics, golf,
tennis, swimming. Same shell, different sport. The seasonal feature is
always framed as an AthlynX product — AthlynX.ai is the star, the sport is
the guest.

**The applications are the star.** Brackets and seasonal sports (MCWS, WCWS,
football, etc.) are the public-attention hook — the front door. The product
lives behind that door. Every seasonal surface must funnel to the
applications. Every bracket page links to the platform. Every game recap
surfaces the athlete's profile. The sport gets the click; the app gets the
athlete. Never the other way around.

**Application ranking (locked 2026-06-02 by Chad).** Order matters — this is
the priority for development time, homepage placement, marketing copy, and
the app catalog ordering across every surface (Home, Ecosystem, AthlynXAI
Apps, Investor Hub, App Store):

  1. **Diamond Grind IQ** — #1. The flagship application. Baseball-first
     athlete intelligence — recruiting, development, training plans, the
     Diamond Grind playbook. This is the lead app, the proof point, and the
     model every other sport vertical follows. Lead the catalog with it.
  2. Real Athlete Profile — the lifelong identity layer. Required for
     every other app.
  3. NIL Portal — the athlete's NIL home.
  4. NIL Vault — the secured archive of NIL agreements and brand materials.
  5. NIL Marketplace — verified athletes meet vetted brands.
  6. NIL Calculator — real NIL valuation grounded in verified signal.
  7. AthlynXAI OS — the operating layer tying every lane together.
  8. AI Recruiter / AI Scouting / AI Training / AI Content — the AI lane.
  9. AXN / MediaOS — distribution rail for approved athlete stories.
  10. The Athlete's Playbook — podcast and flagship content lane.
  11. Studio Suite — production surface for the content stack.
  12. Social Command Center — approved cross-channel distribution.
  13. Brackets — the seasonal hook (MCWS / WCWS / future sports).
  14. Transfer Portal Intelligence — the portal signal layer.

When rendering app catalogs or ecosystem grids, Diamond Grind IQ comes
first. Do not re-rank without Chad's written approval.

## Suspension Log — 2026-06-02 · Tony Locey · access suspended pending Chad's evaluation

### Active Hold (set 2026-06-02 by Chad)

Tony Locey and Tim Shoemake are under a **personal evaluation hold** by
Chad A. Dozier Sr. This is not a public action and is not a permanent rule.
Chad will decide reinstatement at his sole discretion when he's ready.

**Profile visibility:** Tony's profile, photo, bio, MLB career stats, and the
live MLB Stats API hookup stay visible across the site. Suspension hides
**only** active-access affordances (email links, login CTAs, action buttons
that grant him platform access).

Enforcement is centralized in `client/src/components/TeamProfileCard.tsx`.
Tony's entry has `accessSuspended: true`. The exported `isSuspended()` helper
is read by EmployeePortal, InvestorHub, FounderDedication, DHGHome, Founders,
ProjectManagement, Home, TeamBots, Implementation, and TeamProfileCard itself.

To reinstate either person: flip `accessSuspended: true` to `false` (or delete
the line) on the corresponding entry. All hidden affordances return
automatically. No other code changes required.

### Communications hold — outbound silence (locked 2026-06-02 by Chad)

No outbound communication of any kind to Tony Locey or Tim Shoemake while the
hold is active. This includes email, SMS, push, calendar invite, Slack,
platform notification, automated digest, cron-fired report, or any
agent-initiated outreach. The hold is private to Chad and exists only as a UI
gate.

If a future session, agent, or scheduled task is instructed to send anything
to these addresses or to provision access for either person, **stop and ask
Chad first**. The denylist in `server/lib/outboundDenylist.ts` enforces this
at the application layer; the doctrine here is the authoritative source.

## Admin Tier Doctrine (locked 2026-06-02 by Chad)

Only three people hold administrative privileges across the AthlynX platform.
The `accessTier` field in `client/src/components/TeamProfileCard.tsx` is the
single source of truth and is read everywhere admin gating matters.

| Person | Tier | Unlimited Credits | Billing Exempt |
|---|---|---|---|
| Chad A. Dozier Sr. | Master Admin | yes | yes |
| Lee Marshall | Full Admin | yes | yes |
| Glenn Tse | Full Admin | yes | yes |
| Everyone else (incl. Tony Locey) | Customer | no | no |

**Rules baked into the type system:**

- `accessTier` is typed `"Master Admin" | "Full Admin" | "Customer"`. Adding
  a new tier requires a type change — caught at compile time.
- `unlimitedCredits` and `billingExempt` are `true` only for the three admins.
  Any other entry must be `false`.
- `partnerStatus` is separate from access tier. A person can be an `Athlete
  Partner` (relationship) and a `Customer` (billing/access) at the same time.

**Do not grant `Master Admin`, `Full Admin`, `unlimitedCredits`, or
`billingExempt` to any new entry without explicit written instruction from
Chad in the current session.** This is enforced at three layers: the
TypeScript type, this doctrine, and the agent contract in `AGENTS.md`.
