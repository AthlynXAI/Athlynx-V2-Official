# PR #43 — Welcome + Portal Home + Identity Fallback

**Status:** Spec locked 2026-05-17. Owner: Chad. Implementer: Computer.

## Source of truth

- `01-Welcome-Screen.md` (Manus, 2026-05-17)
- `02-Portal-Home-Functional-Spec.md` (Manus, 2026-05-17)
- This file = Chad's 7 final decisions on Manus's open questions

## Chad's decisions (locked)

| # | Question | Decision |
|---:|---|---|
| 1 | iOS install link | TestFlight tonight. Public App Store only after listing approved. |
| 2 | Android install link | Play internal testing tonight. Public Play Store only after listing live. |
| 3 | QR token expiry | 30 minutes. |
| 4 | Footer "Cancel anytime" | Replace with **"Change anytime"** until subscriptions are live. |
| 5 | Quick actions order | Post Highlight / Accept Deal / Approve Content / Message Agent — keep order for launch. |
| 6 | Earnings visibility | Gate by age + eligibility. Show to eligible athlete accounts and approved parent/guardian views. Hide or soften for youth accounts. |
| 7 | Activity feed system alerts | Separate notification center. Inline only if blocking (security, account access, App Store flow). |

## Identity fallback chain (Computer doctrine — no Manus spec needed)

1. Uploaded avatar (R2 `user.avatarUrl`)
2. Showcase photo (consented, authenticated)
3. **Gravatar** — server-side md5 hash of email, `gravatar.com/avatar/{hash}?d=404`, never expose email client-side
4. Silhouette SVG (slate-800 bg, slate-400 fill) — ≥32px sizes, tooltip "Identity pending"
5. Initials — <32px only (mention chips, message rows)

## Brand lock

- Owl logo white-on-dark / dark-on-light, never recolored
- Wordmark `AthlynX` all caps, Inter Black
- BG `#040c1a`, surface `#0a1628`, raised `#0d1e3c`
- Accent `#3b82f6` → `#06b6d4` gradient
- Text `#ffffff` / `#94a3b8`
- **No yellow, gold, amber, orange — anywhere**
- Themes: Light / Medium (default) / Dark — same layout, same tap targets

## What this PR ships

1. `/welcome` two-door screen (mobile-first card stack, desktop side-by-side, identity meter, QR for desktop→app)
2. `NILAvatar` core component with full 5-tier fallback including Gravatar
3. Server endpoint `GET /api/avatar/:userId` that resolves the chain server-side
4. New `users` columns: `landingPreference` (`app`/`web`/`ask`), `lastChosenAt` (timestamp), `lastChosenDevice` (`ios`/`android`/`desktop`)
5. New `/portal` home: top strip, identity meter, quick actions row, activity feed (action items only), earnings strip (gated), schedule rail, pipeline
6. Footer: "Sign in on any device · Your data syncs · **Change anytime**"
7. Smart handoff routes: `/api/welcome/handoff` returns the right install URL + deep link based on UA

## What this PR does NOT ship

- Onboarding 11→4 trim → PR #45
- AI naming canonicalization → PR #46
- Public App Store / Play Store listings → out of code scope
- Subscription system → not until Stripe wired
- Identity-fallback Manus spec doc (we're using Computer doctrine instead)
