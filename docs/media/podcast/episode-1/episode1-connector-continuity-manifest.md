# Episode 1 Connector Continuity Manifest

## One-Lane Operating Override — 2026-05-24

This file is governed by `docs/doctrine/ONE_LANE_OPERATING_DOCTRINE.md`. Use account routing by business context: `chaddozier75@gmail.com` for personal owner, repo, app connector, and broad Google Workspace connector work; `cdozier14@athlynx.ai` for AthlynXAI Corporation business/workspace context; `cdozier14@dozierholdingsgroup.com.mx` for Dozier Holdings Group business/workspace context; `chad.dozier@icloud.com` for Apple/iOS personal context; and `cdozier@dozierholdingsgroup.com` for Dozier Holdings Group Exchange/Gmail context. The production code flow remains the canonical repo `AthlyXAI/AthlynX-V2-Official` to Vercel project `athlynx-platform`. Never store plaintext passwords, tokens, or secrets in doctrine, code, GitHub, Vercel, CRM, or handoff files.

**Continuity owner:** Chad Dozier  
**Approved operating identity:** `chaddozier75@gmail.com`  
**Approved platform lane:** `athlynx-platform`  
**Approved GitHub lane:** `chaddozier75-cmd/AthlynX-V2-Official` and `AthlynXAI/AthlynXAI` when resolvable  
**Podcast:** The Athlete’s Playbook  
**Episode:** The Athlete’s Playbook — Episode 1  
**Episode ID:** `3pBeGKonds1DoM39P2zhlq`

## Continuity Principle

Episode 1 must operate as one full-stack media object, not a loose file. Spotify for Creators is the publishing rail, Suno is the music creation/source rail, GitHub is the source-code and documentation rail, Vercel is the live web deployment rail, and AthlynXAI OS is the source-of-truth control plane for approvals, media vaulting, proof, and future reuse.

## Connector and Rail Map

| Rail | Continuity Role | Episode 1 Status | Source-of-Truth Record |
|---|---|---|---|
| Spotify for Creators | Podcast/video distribution rail | Published on 5/23/26 as a video episode, 01:46 length. | `spotify_episode1_publish_proof.md` |
| Suno | Music creation/source rail | `Blueprint to Glory` preserved with canonical Suno song and embed metadata. | `episode1_suno_music_continuity.md` |
| GitHub | Source code, docs, route, media vault | Pushed to the repo resolved by `chaddozier75-cmd/AthlynX-V2-Official`; continuity commit `aef3be101116dd1b2cbc0499abecbbe5784f9a49` connected Spotify and Suno records. | `docs/media/podcast/episode-1/` |
| Vercel | Live deployment rail | Direct project proof remains blocked: Vercel MCP lists teams but returns zero projects, and the approved repo clone has no `.vercel/project.json`. Do not claim deploy until `athlynx-platform` is visible or linked. | `vercel_continuity_verify_20260523.txt` |
| Facebook | Manual social rail | Chad posts personally; do not auto-post. | Facebook launch copy already provided in chat. |
| LinkedIn | Manual social rail | Chad posts personally; do not auto-post. | LinkedIn launch copy already provided in chat. |
| AthlynXAI OS | Owned control plane | Owns approval gate, vault, connector status, launch page, proof, and future episode continuity. | This manifest plus repo docs. |

## Published Spotify Record

| Field | Value |
|---|---|
| Spotify for Creators show | The Athlete’s Playbook |
| Show ID | `033k3RLc2chTxlLRebD8mN` |
| Episode ID | `3pBeGKonds1DoM39P2zhlq` |
| Title | The Athlete’s Playbook — Episode 1 |
| Status | Published |
| Format | Video |
| Length | 01:46 |
| Expected public URL | `https://open.spotify.com/episode/3pBeGKonds1DoM39P2zhlq` |

Spotify displayed: “Episode published!” and “Share links are ready. Your episode will be live soon.” The copied share link could not be programmatically read back from the browser clipboard, so the durable public URL should be verified after Spotify finishes external propagation.

## Suno Record

| Field | Value |
|---|---|
| Track | Blueprint to Glory |
| Creator display | Chad Allen Dozier Sr | AthlynXAI |
| Username metadata | `@chaddozier75` |
| Canonical Suno URL | `https://suno.com/song/c9c8c213-b200-4b04-b8fa-e1b9769514a1` |
| Embed URL | `https://suno.com/embed/c9c8c213-b200-4b04-b8fa-e1b9769514a1` |
| Local export | `blueprint_to_glory_suno_episode1.mp3` |
| Usage | Approved music bed under Lee Marshall’s Episode 1 voice track. |

## Future Episode Continuity Checklist

| Step | Required Record |
|---|---|
| Create | Source prompt, source asset, creator/account, and export file. |
| Vault | Local media path, GitHub docs path, and approved route path. |
| Quality check | Visual/audio findings, contact sheet, and final approval package. |
| Chad approval | Explicit approval note before upload/publish/deploy. |
| Queue/distribute | Connector proof, exact account, exact show/channel, and upload evidence. |
| Proof | Published ID, status page, public URL when available, and screenshot/proof file. |
| Watchdog | Follow-up check after platform propagation and after Vercel/GitHub deploy. |
| Audit | Final continuity manifest committed to the approved repo lane. |

## Blockers and Guardrails

`AthlynXAI/AthlynXAI` is not currently resolvable through the configured GitHub connector, and a lookalike archived repo was quarantined to prevent wrong-lane pushes. Vercel project discovery returned no projects and no local `.vercel/project.json`, so live deployment cannot be claimed until the exact `athlynx-platform` Vercel project is proven or linked. Facebook and LinkedIn remain manual Chad-only posting lanes. The latest approved V2 GitHub continuity commit before this follow-up proof update is `aef3be101116dd1b2cbc0499abecbbe5784f9a49`; if this manifest receives a follow-up proof-only commit, use that latest hash as the closeout hash.
