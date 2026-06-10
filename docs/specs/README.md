# AthlynXAI Doctrine — The Specs that Run the Machine

**Locked May 16, 2026 — Build 27 OS Drop**
**Owner:** Chad A. Dozier Sr., Founder/CEO, AthlynXAI Corporation

These four documents are the **doctrine of the platform**. They are versioned, code-controlled, ship with every deploy, and are the source of truth for every contractor, engineer, AI agent, and operator working on AthlynXAI.

If anything in the codebase contradicts these specs, **the codebase is wrong**.

## The Four Specs

| # | File | What it is |
|---|---|---|
| 01 | [`01-layer-cake-and-tokenization.md`](./01-layer-cake-and-tokenization.md) | The Layer Cake (9 layers from Identity to Syndication) + the Tokenization Layer (18 canonical token classes that flow through every layer) |
| 02 | [`02-sport-classification-matrix.md`](./02-sport-classification-matrix.md) | Every sport (34 sports incl. Cheer + Gymnastics sub-disciplines) classified against all 9 layers and all 18 token classes — the canonical sport-to-token map |
| 03 | [`03-autonomous-os.md`](./03-autonomous-os.md) | The Autonomous OS — 8 self-running engines (Acquisition, Content, Distribution, Monetization, Retention, Treasury, Resilience, Review) that make the platform a self-running revenue machine |
| 04 | [`04-quality-bar-4-5-star.md`](./04-quality-bar-4-5-star.md) | The 4.5★ Quality Bar — the non-negotiable rating floor on iOS App Store and Google Play, defended by Engine 8 (the Review Engine) |

## How to read them

**Read in order:** 01 → 02 → 03 → 04. Each builds on the previous.

- Spec 01 establishes the **product** (Layer Cake) and the **rails** (Tokenization).
- Spec 02 establishes the **breadth** (every sport mapped to those rails).
- Spec 03 establishes the **autonomy** (the machine runs itself).
- Spec 04 establishes the **quality floor** (the machine must hold 4.5★ on app stores).

## How to update them

These specs are versioned in git. To propose a change:

1. Branch from `main`: `git checkout -b doctrine/<short-description>`
2. Edit the spec file. Preserve the front-matter (locked date, founder quote).
3. Add a dated entry in the relevant "Addendum" section — never delete prior addenda.
4. PR with title `Doctrine: <one-line summary>` and tag `@chad` for approval.
5. Only `@chad` can merge to `main`. No exceptions.

## The non-negotiables

These cannot be overruled by any engineer, contractor, AI agent, or operator without explicit founder approval:

1. **Tokenization rules** (Spec 01 §"Tokenization rules") — every token must be signed, versioned, meterable, broadcastable, auditable, and cross-sport.
2. **Sport classification** (Spec 02) — every new sport added to the platform must be classified against all 9 layers and specialize all 6 sport-specific token payloads before it ships.
3. **The North Star Loop** (Spec 03 §"The North Star Loop") — Athlete-In → AI Work → Money-Out, no founder intervention required.
4. **The 4.5★ floor** (Spec 04) — neither store rating may fall below 4.5★. Engine 8 defends it. If breached, Pager-class incident.

## What this replaces

These four specs **supersede** any prior strategy doc, architecture doc, or roadmap that contradicts them. Older docs in `docs/` remain for reference but are not authoritative.

## Why they live in the repo

Because:

- **Permanence.** Workspace files can be lost. Git is forever.
- **Versioning.** Every change is signed and dated.
- **Co-deploy.** They ship with the code. Every Vercel deploy includes the doctrine.
- **In-app reference.** The platform serves these specs at `/api/doctrine/:spec_id` for internal tooling.
- **Cross-team alignment.** Manus, contractors, future hires, future AI agents — all read the same canon.

## The closer

> *"I want all this baked in permanently."* — Chad A. Dozier Sr., May 16, 2026, 1:01 AM PDT

Permanently baked.

*Iron Sharpens Iron — Proverbs 27:17.*
