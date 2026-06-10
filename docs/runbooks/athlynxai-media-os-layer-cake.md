# AthlynXAI OS Full-Stack Media Layer Cake

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

## Purpose

This runbook makes the AthlynXAI media workflow permanent. The platform must not create isolated, amateur, one-off video, audio, podcast, music, or social-post assets. AthlynXAI OS owns the full stack: creation, vaulting, quality gates, approval, distribution queue, connector checkpoint, proof, watchdog, and audit.

## Control Model

| Role | Responsibility |
|---|---|
| Lee | Primary day-to-day operator for video, audio, podcast, Suno music, captions, show notes, thumbnails, episode packaging, and social packages. |
| Chad Allen Dozier Sr. | Owner, final approver, emergency override, brand/legal/investor safety gate, and connector checkpoint authority. |

## Canonical Lanes

| Lane | Source of Truth | External Rail |
|---|---|---|
| The Athlete’s Playbook Podcast | AthlynXAI OS Media Vault | Spotify for Creators, Spotify, RSS, AXN, social clips |
| Suno Music and Beds | AthlynXAI OS Media Vault | Suno for generation/export only |
| AXN Streaming Network | AthlynXAI OS Content Catalog | AXN show, season, episode, and clip surfaces |
| Social Distribution | AthlynXAI OS Queue | LinkedIn, Instagram, Facebook, TikTok, YouTube, Buffer/Zapier fallback |

## Required Layer Cake

Every publishable media asset must pass through this path:

1. **Create** — Lee prepares content, audio, video, captions, show notes, Suno prompts, and metadata.
2. **Vault** — Store masters, drafts, versions, transcripts, thumbnails, audio beds, and show packages.
3. **Quality Check** — Validate audio, video, captions, thumbnails, metadata, diversity, rights, and brand voice.
4. **Lee Review** — Lee confirms production readiness and fixes issues.
5. **Chad Approval** — Chad approves, rejects, requests revision, or activates emergency hold.
6. **Queue** — Status must be visible: draft, pending review, approved, scheduled, connector blocked, posted, failed, retrying, manual intervention.
7. **Connector Check** — No external action unless the exact connector is visibly ON and passes a harmless live check.
8. **Distribution** — External services are rails only; AthlynXAI OS remains the brain.
9. **Proof** — Store proof URLs, external IDs, screenshots when needed, manual proof notes, and metrics snapshots.
10. **Watchdog** — Detect stuck approvals, failed posts, stale metrics, missing proof URLs, broken media, or connector failures.
11. **Audit** — Record every action and decision.

## Professional Quality Standard

Video must be sports-documentary quality, multi-sport, diverse, captioned, thumbnail-ready, and exported in platform-specific formats. Audio must be cleaned, de-echoed, mastered near professional podcast loudness expectations, and paired with transcript plus show notes. Suno tracks must include prompt, version, rights/usage note, export format, and reuse context. Spotify/Spotify for Creators packages must include title, description, artwork, audio/video asset, release date, show notes, transcript, proof URL, and analytics snapshot plan.

## Connector Rule

Before GitHub, Vercel, Spotify, Suno, Buffer, Zapier, social, email, storage, payment, database, calendar, or automation action, verify the relevant connector is visibly ON and authenticated for the current session. If it is OFF, stale, missing scope, or account-mismatched, stop and tell Chad before attempting the action.

## Direct Posting Guardrail

Direct posting is disabled by default. Immediate direct-post APIs must remain behind explicit emergency override configuration. Normal production publishing must flow through the owned Media OS queue and approval gate.

## Permanent Quality and Algorithm Standards

The Media OS must score every publishable asset before it leaves the owned AthlynXAI environment. The quality gate is not cosmetic; it is the control layer that protects the brand, prevents dropped posts, and makes the reverse funnel measurable.

| Algorithm | Primary Dimensions | Required Output |
|---|---|---|
| Video Score | Hook strength, retention potential, multi-sport representation, diversity, captions, thumbnail clarity, format fit, CTA clarity | Approve, revise, or hold |
| Audio Score | Voice clarity, echo/noise level, music-bed balance, loudness readiness, transcript readiness, show-note completeness | Approve, clean, or remaster |
| Athlete Brand Score | Highlights, stories, stats, podcast clips, NIL/recruiting value, social proof, consistency, engagement quality | Athlete brand-growth score |
| Distribution Score | Platform fit, caption variant, hashtag relevance, CTA/reverse-funnel route, connector health, proof capture, retry readiness | Channel order and publish readiness |
| Watchdog Score | Stale queue age, failed connector state, missing proof URL, missing analytics snapshot, retry count, manual intervention flag | Healthy, warning, blocked, or escalated |

## Nebius H200 and Live-Data Lane

Nebius H200 is the preferred AI compute lane for future high-throughput live-data and inference workflows. In the current Vercel application, Nebius should be represented as the compute substrate and future live-data layer, not as a static marketing claim that implies completed integrations beyond what has been verified. Any live-data feature must clearly distinguish between **live connector-backed data**, **cached platform data**, and **static public page content**.

Before enabling Nebius-backed live-data features, the operator must verify the connector/API path, data source, privacy gate, cost boundary, fallback behavior, and proof logging. No athlete, investor, payment, or private partner data may be processed through live-data pipelines without explicit authorization and audit capture.

## Podcast Page and Social Package Standard

The podcast page should function as the owned landing surface for The Athlete’s Playbook. It must include clean videos, Spotify-ready branding, AXN positioning, Suno music-bed context, Media OS routing, and reverse-funnel CTAs. Social captions must never be posted automatically from page content. Captions are generated as a package, presented to Chad, and only distributed after the relevant social connector is visibly ON, passes a harmless live check, and Chad gives final approval.

## No Sports Betting Standard

AthlynXAI, AXN, The Athlete’s Playbook, Media OS, Social OS, and all athlete-brand workflows must remain completely separate from sports betting and gambling. The system must not include sportsbook integrations, odds, picks, wagering language, gambling sponsorship angles, fantasy-betting positioning, or betting-adjacent monetization.

The approved sports-media lane is athlete-first and centered on NIL, recruiting, brand growth, education, performance, podcasting, AXN programming, Suno/Spotify Creator media packaging, and AthlynXAI-owned traffic loops. Any generated caption, page copy, runbook, workflow, or partner idea that introduces betting language must be rejected or rewritten before production.

## Premium Sports-Media Quality Standard

AthlynXAI may use the energy of modern sports media—fast, bold, entertaining, personality-driven, and shareable—but it must remain cleaner, athlete-first, faith/mission-aware where appropriate, and fully AthlynXAI-owned. Do not copy another sports-media brand’s graphics, voice, trade dress, or betting-adjacent monetization. The target is premium AthlynXAI: best-quality video, clear Lee-led audio, controlled music beds, multi-sport visuals, readable banner labels, clean captions, strong thumbnails, and no echo.

## Free Entry Plus Tiers and Credits Model

AthlynXAI OS uses a hybrid network-effects model: free athlete entry, paid operating-system layers, and credits for usage-based AI, media, compute, automation, storage, and service consumption. The free layer exists so athletes are not denied access because of cost. It should support basic profile creation, community entry, basic discovery, and a path into the AthlynXAI ecosystem.

The paid tiers protect the business model and fund the platform. Premium services such as Media OS, Social OS, AI content tools, advanced recruiting intelligence, athlete brand kits, premium analytics, NIL campaign workflows, highlight reels, and hands-on media services should sit behind tiered subscription or licensing levels. Credits should meter real consumption: generated video/audio, Suno/music packages, AI inference, media rendering, advanced reports, expert services, storage-heavy workflows, and automated distribution.

The product rule is: **free builds the crowd; tiers and credits monetize the machine**. Public copy should communicate opportunity and access without promising that every advanced service is free. Internal workflow should preserve the funnel: free athlete entry → brand and profile growth → optional premium tier → credit-backed media/AI/service usage → proof and analytics → repeat loops through AthlynXAI OS.
