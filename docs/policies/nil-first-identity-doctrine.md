# NIL-First Identity Doctrine

**Status:** Permanent baseline. Equal standing with the Reverse-Funnel Doctrine and the Bot Suggestion Policy.

**Owner:** AthlynXAI Corporation (founder Chad A. Dozier)

**Last reviewed:** 2026-05-17

---

## Why this exists

AthlynXAI is built on a single premise: **the athlete owns their Name, Image, and Likeness.** NIL is not a feature on the platform. NIL is the platform.

If a user shows up on AthlynXAI as a blue circle with the letter "C" instead of a face, the platform has violated its own founding promise. Every UI default that hides identity is a doctrine violation.

This document codifies the three laws that govern how identity is rendered across every surface of the system, and it is non-negotiable in code review.

---

## The Three Laws

### Law 1 — Name is sacred

Every user has a real, verified name surfaced in their profile.

- Name is captured during signup from OAuth identity (Apple, Google) or from a verified claim during Email/Password registration.
- The platform does not auto-generate handles like "User_8472" or "anonymous123" for display purposes. Internal IDs are integers and are never shown.
- Display name is rendered in full wherever space allows. Truncation rules are explicit, not the default.
- The "First L." short-form is allowed in dense UI (under 14px text) — never as the canonical display.

### Law 2 — Image is required, not optional

Every user has a face on the platform.

**On signup:**
- OAuth signups auto-pull the profile photo (Apple ID photo, Google account photo) and use it as the initial avatar.
- Email/Password signups are blocked from entering the feed until they upload a photo or use the device camera. This is the one place we wall the user off — because identity is core, not optional.

**Throughout the app:**
- The avatar `src` attribute is populated from `users.avatarUrl` for every user record.
- If `avatarUrl` is missing, the renderer shows a **neutral silhouette + an "Identity pending" badge**, never colored initials.
- Initials as a fallback are permitted only:
  - In dense UI elements strictly under 32px square (small chat bubbles, comment threads, mention pings).
  - During image load — only as a transient state, never as the resting state.

**Forbidden patterns:**
- `<div className="bg-blue-500"><span>{initials}</span></div>` as a default rendering for a signed-in user with no avatar.
- Any UI that ships a colored-initial circle and treats it as acceptable.
- Team pages, executive bios, advisor pages, or any first-party content that uses initials in place of a real headshot.

### Law 3 — Likeness is owned

The athlete owns their NIL on the platform. The platform protects it.

- No other user may post under another user's name, use their image, or impersonate their identity.
- NIL-claim flags travel with every user record: `nil_claimed_at`, `nil_verified_by`, `image_rights_holder`, `name_rights_holder`.
- Verification badges (blue check equivalent) are reserved for users who have completed NIL claim verification.
- Image-rights metadata is captured at upload (consent, ownership, usage rights) and persisted alongside the asset.
- Removing or modifying another user's NIL data — name, image, profile content — is a privileged action restricted to the user themselves and to platform owners with audit-logged justification.

---

## Enforcement

### Code review checklist

Every PR that touches user-facing rendering must answer:

1. Does this surface a user's name? If yes, is it the real name (not an auto-generated handle)?
2. Does this surface a user's image? If yes, what is the fallback when `avatarUrl` is missing? Is the fallback compliant (silhouette + badge, not initials at default size)?
3. Does this expose another user's NIL data to actions? If yes, are the actions audit-logged and scoped to the owner or to platform owners?

PRs failing any of these checks are returned to author.

### Automated checks (future work)

- Linter rule: flag any rendering of an `<Avatar>` component without a fallback that complies with Law 2.
- Database constraint: `users.name` is `NOT NULL` for active accounts; soft-retired or test accounts may have `[retired - ...]` markers.
- Onboarding telemetry: signup completion rate broken out by whether photo was uploaded vs. OAuth-pulled vs. skipped (skip should never be possible at the data layer).

### Bot Suggestion Policy interaction

Bots (Vercel Agent, github-actions, etc.) may NOT push commits that violate the NIL-First Identity Doctrine. Any bot-authored commit that introduces or restores an initials-default avatar pattern fails Lane Discipline at the policy gate.

---

## Examples — compliant vs. violating

| Pattern | Compliant? |
|---|---|
| User signs in via Google → real Google profile photo appears as avatar | ✅ Law 2 |
| User signs in via Email/Password → wall step requires photo before feed loads | ✅ Law 2 |
| User has no `avatarUrl` → 80px neutral silhouette + "Identity pending" badge appears | ✅ Law 2 |
| User has no `avatarUrl` → 80px colored circle with "CD" letters | ❌ Law 2 violation |
| User has no `avatarUrl` → 24px chat bubble shows "CD" letters | ✅ Law 2 (under 32px, dense UI) |
| Team page shows founders with real headshots | ✅ Law 1 + Law 2 |
| Team page shows founders with letter circles when headshot unavailable | ❌ Law 2 violation |
| User name shown as "User_1884" anywhere user-facing | ❌ Law 1 violation |
| User name shown as "Chad A Dozier" | ✅ Law 1 |
| Another user attempts to post under the founder's name | ❌ Law 3 violation, blocked at API layer |

---

## Provenance

This doctrine was authored by Chad A. Dozier (Founder/CEO, AthlynXAI Corporation) on 2026-05-17 at 12:53 AM PDT, during the post-launch hardening of Build 22. It is the third permanent baseline document, alongside:

- `docs/email-os/permanent-reverse-funnel-doctrine.md` — operational lane for inbox/notification handling
- `docs/policies/bot-suggestion-policy.md` — governance for AI bot commits to the repository

The doctrine is not subject to revision by automated agents, including but not limited to Vercel Agent, github-actions bots, or third-party LLM workflows. Revisions require an Owner-authored commit with explicit reasoning recorded in the commit message.
