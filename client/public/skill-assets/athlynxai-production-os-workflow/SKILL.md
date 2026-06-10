---
name: athlynxai-production-os-workflow
description: Connector-first AthlynXAI production workflow. Use when baking podcast, social media, AXN streaming, tokenization, source-only media, approved-brand rules, GitHub commits, or Vercel deployments into AthlynXAI OS or related repos.
---

# AthlynXAI Production OS Workflow

Use this skill for AthlynXAI production tasks that combine **media creation**, **podcast/social rails**, **AXN streaming**, **tokenization**, **GitHub**, and **Vercel**. The default lane is source-based, connector-first, and production-disciplined.

## Core Rules

| Rule | Requirement |
|---|---|
| Source of truth | AthlynXAI OS/repo is the brain. Spotify, Suno, social networks, Vercel, GitHub, and storage are rails. |
| Connector proof | Before push, deploy, post, send, upload, mutate data, or publish, prove the exact connector/account/path with a harmless read-only check. |
| Media lane | Use deterministic source-based edits unless the user explicitly approves generative redesign. Do not reinterpret source assets. |
| Brand law | Approved visible brand language is limited to **AXN**, **XAI**, **AthlynX**, and **AthlynXAI**. Do not introduce any isolated standalone mark outside those approved contexts. |
| Podcast/social/streaming | Treat The Athlete’s Playbook, social media, and AXN streaming as operating layers inside AthlynXAI OS, not one-off assets. |
| Tokenization | Tie media access, credits, tiers, ownership, and premium services into the OS layer-cake model when requested. |
| Team model | Preserve the operating circle context: Chad, Manus, Lee, Glenn, Jimmy, Andy, and David, unless the user updates the personnel list. |
| External mutation | Ask or confirm before sensitive browser operations, public publishing, repository push, Vercel deployment, database writes, payments, email sends, or public storage changes. |

## Standard Workflow

1. **Stabilize the mission.** Identify the exact repo, production route, media assets, account rail, and desired public action. Keep communication short and direct.
2. **Run connector proof.** Use read-only checks for GitHub, Vercel, Spotify/Suno browser sessions, social connectors, storage, or database rails. Record evidence in a local status file.
3. **Lock brand and source rules.** Write the current approved-brand rules into a local note before production. For AthlynXAI, enforce **AXN / XAI / AthlynX / AthlynXAI** only.
4. **Prepare source-only media.** Use scripts for deterministic darkening, overlays, contact sheets, 9:16 reels, and approved-brand assets. Do not use image generation unless the user explicitly authorizes it.
5. **Bake into the OS.** Add a route/page, doctrine file, asset folder, and route aliases that connect podcast, social, AXN streaming, and tokenization to AthlynXAI OS.
6. **Validate locally.** Run brand scan, secret scan, Git diff review, and the repo’s build command. Revert generated bundles if they create noisy or secret-like diffs that are not meant to be committed.
7. **Commit and push.** Stage only focused files. Commit with a direct production message. Push to the verified branch.
8. **Deploy and verify.** Deploy through Vercel CLI or connector if available. If blocked, report the exact blocker and whether Git integration may auto-deploy from the push.
9. **Close with evidence.** Provide commit hash, routes, build result, deploy URL or deploy blocker, and what was not touched.

## Required Evidence Log

For production work, create a local Markdown status file with this table:

| Check | Evidence |
|---|---|
| GitHub repo/branch | `gh repo view`, branch name, status output |
| Connector state | Read-only tool/browser proof |
| Build | Command and pass/fail result |
| Brand scan | Search result for disallowed brand marks in new text files |
| Secret scan | Pattern scan of changed text files |
| Commit | Hash and message |
| Deployment | URL, deployment ID, or blocker |

## Source-Only Media Pattern

Use the bundled script `scripts/source_only_brand_pass.py` as a starting point for deterministic edits. It supports these ideas:

| Operation | Use |
|---|---|
| Fit to 9:16 | Build vertical reel/post assets. |
| Darken studio | Make podcast/studio figures less prominent while keeping brand context. |
| Approved overlays | Repeat approved brand text across apparel/equipment zones. |
| Contact sheet | Review all corrected assets at once. |
| Manifest | Preserve output file inventory for handoff. |

Do not use this script as a substitute for judgment. Adjust positions, source filenames, and overlay density to match the user’s supplied assets.

## AthlynXAI OS Integration Pattern

When baking the layer into the app, add:

| Artifact | Purpose |
|---|---|
| `client/src/pages/AthlynXAIOperatingLayer.tsx` or equivalent | Production page for podcast, social, AXN streaming, and tokenization. |
| Route aliases | `/athlynxai-os`, `/axn-streaming`, `/podcast-social-engine`, `/media-tokenization`, `/axn-os`, `/podcast-os`. |
| Public media folder | Store approved reel/contact-sheet assets if repo policy allows. |
| Doctrine Markdown | Explain source of truth, rails, brand law, team model, and tokenization layer. |

Keep public copy humble, athlete-first, and results-focused. Avoid over-promising finalized partner deals.

## Browser Account Rules

For Spotify/Suno work, follow the user’s chosen login route exactly. If Google login is requested, do not enter the email-code route. If CAPTCHA or OAuth failure appears, stop and ask for user takeover. Once access is confirmed, record only non-sensitive dashboard state such as show/workspace name and visible status.

## Stop Conditions

Stop and ask before any action that posts publicly, sends email, charges money, changes production data, changes domains, deletes files, force-pushes, or exposes private credentials. If Vercel/GitHub/social connector proof conflicts with browser state, report the conflict instead of guessing.
