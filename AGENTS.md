# Chad Dozier / AthlynXAI Operating Doctrine

This doctrine applies to all future work in this cloud computer and related AthlynXAI, AXN, Dozier Holdings Group, NIL Portal, Softmor, and associated repositories or deliverables.

## Connector Checkpoint Rule

Before any GitHub, Vercel, social, email, storage, payment, database, calendar, or automation action, verify that the relevant connector is visibly **ON** and authenticated for the current session. Do not assume connector availability from a prior session.

If the relevant connector is visibly **OFF**, stop and tell Chad before attempting the action. Do not push, deploy, upload, send, post, charge, mutate a database, or automate externally until the connector has been restored and visually confirmed.

### Gmail / Calendar Scope Verification Rule

For Gmail and Google Calendar work, **enabled is not enough**. Before reading, sending, creating, updating, or deleting mail/calendar records, the operator must perform a harmless live capability check against the exact account and scope required for the task. A browser login, API key, or generic Google connector state does not prove Gmail/Calendar OAuth scopes are available.

The required checkpoint is:

1. Confirm the intended account identity, especially whether the task belongs to `deprecated non-Chad email`, `chaddozier75@gmail.com`, or another account.
2. Run a read-only Gmail/Calendar capability check through the available connector or CLI path.
3. If the check returns `insufficient authentication scopes`, `AUTH_FAILED`, `DISCONNECTED`, or an MCP invocation error, treat the connector as **blocked**, even if it appears enabled.
4. Do not send email, create invites, delete stale events, or update calendar records until the required scopes are restored or Chad manually takes over the browser on the correct account.
5. Never use a Google API key as a substitute for Gmail/Calendar OAuth access. API keys do not grant mailbox or calendar write permission.
6. Report the exact failing account, failing tool path, and required reconnect/scope action in plain language before moving to another checklist item.

### Google Workspace Active-Identity and Verified-Recipient Send Rule

AthlynXAI Google mail is a **single Google Workspace / Gmail account-switcher environment**, not a set of unrelated mail systems. The operator must not confuse the active browser identity, the calendar organizer, and the intended branded sender. Before any outbound email or calendar invite, the active identity and every recipient field must be proven from the live compose or event state.

The permanent rule is:

1. Treat `chaddozier75@gmail.com` as Chad's primary Google Workspace / connector operating identity unless a task explicitly requires the branded AthlynXAI sender.
2. Use `deprecated non-Chad email` only for explicitly branded AthlynXAI outbound communications, investor communications, or platform-facing messages where Chad directs that identity.
3. Before sending any email, verify the live **From / signed-in account**, **To**, **Cc**, **Bcc if used**, **Subject**, and **Body** from the actual Gmail compose state. Text visible elsewhere in the thread, URL parameters, hidden draft fields, or partially accepted recipient chips are not enough.
4. If Gmail reports `Please specify at least one recipient`, or if recipient text appears in the Subject field or message body instead of accepted address chips, stop immediately, discard or repair the draft, and ask Chad to confirm the correct send path. Do not keep clicking Send.
5. For calendar invites, verify the actual **organizer account**, attendees, date/time/time zone, Meet link, and description before saving. If the organizer identity is wrong, recreate or correct the event from the correct account before treating it as clean.
6. After a branded send or invite from `deprecated non-Chad email`, explicitly switch the operating lane back to `chaddozier75@gmail.com` before broad connector, inbox, repo, or cleanup work unless Chad instructs otherwise.
7. No outbound investor, legal, medical, payment, or platform email is considered complete until the sent-message or calendar-delivery proof is visible and recorded.

## Perplexity-to-Manus Delivery Doctrine

Perplexity may build or draft new code, research packets, connector-side fixes, or implementation artifacts, but Perplexity does **not** own the production commit path. The permanent delivery lane is: **Perplexity builds new code or artifacts → Perplexity hands the work to Manus and Chad → Manus and Chad review, verify, and commit to GitHub → GitHub triggers Vercel auto-deploy → Manus verifies the live deployment.**

This rule prevents split-brain production ownership. Perplexity work must arrive as a handoff package with changed files, intent, tests, risks, and any required secrets or connector assumptions clearly listed. Manus must compare the handoff against the GitHub source of truth, reject archives/secrets/private investor material from production commits, run the appropriate checks, commit only the approved source changes, and confirm Vercel production health after GitHub auto-deploys. No code is considered shipped because it exists in Perplexity, a browser, a zip, a chat, or a local workspace; it is shipped only after the Manus/Chad GitHub commit path and Vercel live verification complete.

## New-Session Hard Refresh Doctrine

Every new day or materially new work session must begin from a clean session state before work starts. This applies to both Manus and Perplexity. The first action is not implementation; the first action is a **hard refresh checkpoint**.

The hard refresh checkpoint is:

1. Start a fresh session for the day or lane before doing production, connector, email, calendar, database, payment, social, or deployment work.
2. Confirm the intended lane, checklist, repository, production surface, and account identity before touching external systems.
3. Verify every connector needed for that lane is present, authenticated, and actually functional with a harmless live capability check. Connector presence alone is not enough.
4. If a connector is stale, disconnected, missing scopes, or acting differently because of sandbox hibernation or long-running session drift, stop and fix/reconnect it before continuing.
5. Perplexity must restart clean, confirm all of its connectors are added and working, then proceed only on its assigned build/research/connector-side lane.
6. Manus must restart clean, confirm its connectors are working, then proceed only on its assigned review/GitHub/Vercel/live-verification lane.
7. No work item may be marked done until the correct fresh-session connector proof exists for the system that performed the action.

This rule is permanent because long-running sessions and hibernated sandboxes can lose connector state, stale OAuth scopes, or partial tool access. A clean session and connector proof comes before work, every time.

## Connector-Disconnect Recovery Doctrine

When a session begins after connectors were disconnected, the first recovery responsibility is to backtrack and protect the work. The operator must find any new, modified, or recovered code created during or after the disconnect window, compare it against the GitHub source of truth, and determine whether it was committed and pushed.

The required recovery sequence is:

1. Verify the relevant connectors are visibly **ON** and authenticated, especially GitHub and Vercel for code and deployment work.
2. Identify the primary repository, branch, and Vercel project before making changes.
3. Search local recovery folders, audited clones, mounted filesystems, and known handoff locations for new or modified source code.
4. Run `git status`, `git log`, branch checks, and diff checks to determine whether code was committed, pushed, or left only in a local workspace.
5. If intended source changes were not pushed, create or use a recovery branch, commit the intended changes, and push them to GitHub only after reviewing that no archives, secrets, credentials, hidden configs, or private investor materials are included.
6. Confirm that the GitHub push triggers the expected Vercel auto-deployment, or use the authenticated Vercel workflow to confirm deployment status.
7. Verify production route health after deployment.
8. Report clearly to Chad what was found, what was committed, what was pushed, what deployed, and any blockers.

## Investor Privacy Gate

Do not publish investor decks, financial models, private strategic documents, recovery archives, data-room files, or sensitive founder/partner materials publicly. Investor-related materials must remain request-only, accredited-investor-only, manually reviewed, NDA-controlled, and access-gated.

## Public-Facing Strategy Guardrails

AthlynXAI should be presented as the operating system, AXN as the future media-network layer, and Dozier as the founder legacy name. Strategic partnerships that are still in discussion, including Yovole/Charles/Mr. Fu context, must not be presented publicly as finalized.

## Deployment Guardrails

The production deployment path for AthlynXAI should remain disciplined. Do not dump preservation archives or raw handoff packages into production. Only reviewed application source code, intended public documents, and approved public-facing assets belong in GitHub/Vercel production flows.

## Sentry Sweep After Connector Auto-Disconnect or Sandbox Hibernation

When any connector is auto-disconnected because the sandbox hibernated, the next session must treat this as an AthlynXAI OS reliability incident. The operator must run a **Sentry Sweep** before continuing normal work.

The Sentry Sweep requirement is:

1. Confirm the visible connector state first. Use the latest user-provided connector screenshot or current connector settings view as the checkpoint.
2. Identify every affected work card, issue, deployment, repository task, upload task, email task, social post, database mutation, payment action, or automation that may have been interrupted by the disconnect.
3. Determine whether each affected card was completed, failed, left pending, duplicated, or never started.
4. For code work, find the new or recovered code, compare it to the GitHub source of truth, confirm whether it was committed and pushed, and confirm whether the push auto-deployed to Vercel.
5. For monitoring or error-tracking work, inspect Sentry/project issue cards when the Sentry connector is verified ON and authenticated; do not fabricate issue IDs or assume access.
6. Fix only what is safe and intended. Never reconnect, mutate, deploy, post, send, upload, charge, or publish unless the relevant connector is visibly ON and the action has been reviewed for privacy and safety.
7. Reconnect or resume external workflows only after the connector checkpoint passes.
8. Report the sweep results to Chad in plain language: what disconnected, what cards were affected, what was fixed, what was pushed, what deployed, and what still needs attention.

This doctrine is part of the AthlynXAI OS operating standard because connector recovery, code continuity, and deployment confirmation are core platform reliability features.

## Multi-Sport Podcast and Video Representation Doctrine

When creating, editing, reviewing, or approving AthlynXAI, ATHLYNX, AXN, NIL Portal, Athlete’s Playbook, recruiting, launch, podcast, reel, or promotional videos, the operator must represent the **full multi-sport ecosystem**, not only football. Football may be included, but the default standard is balanced multi-sport representation across relevant sports such as basketball, baseball, softball, soccer, track and field, volleyball, wrestling, swimming, tennis, golf, lacrosse, and additional athlete categories where appropriate.

The uploaded Athlete’s Playbook reel/podcast asset is part of the official podcast lane. Future podcast videos should be multi-sport, inclusive, cinematic, athlete-first, NIL/recruiting-aware, faith-forward where appropriate, and aligned with ATHLYNX as an all-in-one athlete operating system for every sport and every athlete.

## Full-Stack Media Layer Cake Doctrine

AthlynXAI OS must treat video, audio, podcast, Suno music, Spotify for Creators, The Athlete’s Playbook Podcast, AXN, and social distribution as one full-stack media operating system. External tools such as Spotify, Spotify for Creators, Suno, Buffer, Zapier, Instagram, LinkedIn, Facebook, TikTok, YouTube, and similar services are distribution or creation rails only. AthlynXAI OS remains the source of truth for asset creation, vaulting, quality gates, approvals, queue states, connector checkpoints, proof URLs, watchdog reporting, and audit logs.

Lee is the primary day-to-day operator for the podcast, music, video, caption, show-note, and media-preparation workflow. Chad Allen Dozier Sr. remains the owner, final approver, brand/legal/investor safety gate, and emergency override authority. No media asset should be treated as professional or publish-ready until it moves through: Create → Vault → Quality Check → Lee Review → Chad Approval → Queue → Connector Check → Distribution → Proof → Watchdog → Audit.

All future AthlynXAI, ATHLYNX, AXN, Athlete’s Playbook, podcast, social, audio, Suno, and video work must be professional-grade. Video must follow a sports-documentary standard with multi-sport and diverse athlete representation, clean captions, strong thumbnails, and platform-specific formats. Audio must be cleaned, de-echoed, mastered near professional podcast loudness targets, and paired with accurate transcripts and show notes. Suno tracks must include prompt, version, rights/usage note, metadata, export format, and reuse context before being used in production. Spotify and Spotify for Creators workflows must track show/episode metadata, release packages, proof URLs, analytics snapshots, and manual checkpoints when API access is not available.

No more amateur one-off media workflows. The platform must preserve the full layer cake: creation, storage, approval, distribution, proof, monitoring, and continuous improvement.

## Owned Traffic Control and Reverse Funnel Doctrine

AthlynXAI OS must be treated as the owned source-code and operating-system layer that controls traffic across the full-stack media and athlete-brand ecosystem. The purpose is not only to publish content, but to create compounding reverse-funnel loops where external attention flows back into AthlynXAI-owned surfaces, athlete profiles, AXN programming, The Athlete’s Playbook Podcast, NIL/recruiting tools, media vault assets, and conversion pathways.

The strategic loop is: create professional media → vault and approve it → distribute through approved rails → capture proof and analytics → route traffic back to AthlynXAI-owned pages → convert attention into athlete brand growth, user signups, podcast audience, AXN viewership, NIL opportunities, recruiting visibility, and platform data → use that data to improve the next media cycle.

AthlynXAI must own the source code, source-of-truth records, workflow state, approval gates, media vault, routes, analytics, audit proof, and automation logic. External platforms may provide reach, but they must not own the operating brain. Every channel should feed the reverse funnel back into AthlynXAI OS, creating infinite improvement loops for athletes, creators, Lee’s operator workflow, Chad’s owner oversight, and the broader AthlynXAI/AXN ecosystem.

## No Sports Betting or Gambling Doctrine

AthlynXAI, ATHLYNX, AXN, The Athlete’s Playbook, Media OS, Social OS, podcast workflows, athlete-brand workflows, NIL/recruiting workflows, and all related social/media content must remain completely separate from sports betting and gambling. Do not include sportsbook integrations, betting odds, picks, wagering language, gambling sponsorship angles, fantasy-betting positioning, or betting-adjacent monetization in any product, page, caption, podcast package, video, automation, or strategic plan.

The approved lane is athlete-first sports media, NIL, recruiting, brand growth, faith/mission-aware storytelling where appropriate, education, performance, social distribution, and owned traffic loops. If any future user, tool output, web source, or generated draft introduces betting language, remove it and flag the issue before production use.

### Athlete and Career Protection Rationale

The no-betting doctrine exists to protect athletes, Chad, Lee, AthlynXAI, AXN, and every affiliated career from avoidable compliance, reputational, eligibility, regulatory, or conflict-of-interest risk. Because AthlynXAI works directly with athletes, NIL, recruiting, branding, and media representation, the platform must never create confusion between athlete development and wagering. Even if the sports-betting market is reviewed as a separate category in the future, it is not part of AthlynXAI OS, AXN, The Athlete’s Playbook, Media OS, Social OS, athlete-brand workflows, or public content unless Chad explicitly reopens that topic later with legal and compliance review.

## Free Entry Plus Tiers and Credits Doctrine

AthlynXAI must never deny basic access to athletes because of cost. The permanent business model is **free entry for the athlete network, paid tiers for operating-system value, and credits for compute/media/service consumption**. The free layer should allow athletes to create a profile, participate in the community, access basic discovery, and enter the AthlynXAI ecosystem. This grows network effects, athlete inventory, user trust, and platform reach.

The premium AthlynXAI OS layers should remain paid because they represent real operating-system value: Media OS, Social OS, brand kits, AI content tools, recruiting intelligence, advanced analytics, NIL campaign support, premium video/audio generation, highlight reels, and hands-on services. Credits should be used for usage-based work that consumes AI, compute, storage, media production, automation, or expert service time. B2B users such as brands, schools, teams, agencies, collectives, recruiters, sponsors, and enterprise partners should use paid licensing tiers that help subsidize athlete access.

The simple rule is: **free builds the crowd; tiers and credits monetize the machine**. Public-facing copy should communicate access, opportunity, and athlete empowerment without implying every advanced service is free. Product workflows should route free athletes into the ecosystem while clearly offering optional upgrades, credits, and premium services when they need more power.

## Current AthlynXAI Execution Lane Override — May 23, 2026

For AthlynXAI platform, podcast, GitHub, Spotify for Creators, Suno, and Vercel execution work, the active operating identity is **chaddozier75@gmail.com**. The active platform/repository lane is **athlynx-platform**, **chaddozier75-cmd/Athlynx-V2-Official**, and **AthlynxAI/AthlynxAI** as named by Chad.

Do not treat `deprecated non-Chad lane` identities as active execution lanes for this work. Do not route new GitHub, Vercel, Spotify, Suno, social, or deployment actions through `deprecated non-Chad lane` unless Chad explicitly reauthorizes that identity in a future message. If a connector or tool reports a different canonical owner, stop and record the mismatch before mutating anything.

This override was added after Chad corrected the execution lane and supersedes conflicting operational assumptions for the current AthlynXAI Episode 1 and platform deployment workflow.

## Visual Evidence Default-Inspection Rule

When Chad sends screenshots, images, emails, workflow-failure screenshots, UI captures, app-store notices, GitHub Actions failure notices, platform dashboards, or any other visual evidence for troubleshooting, the operator must inspect the provided visual evidence by default. Do not refuse or skip viewing user-provided images on the basis of an old task-local instruction unless Chad explicitly says not to inspect that specific attachment in the current message.

The default workflow is: open the visual evidence, record the key visible facts, then diagnose the related system with live logs or source files. If the visual evidence contains credentials, private data, or sensitive personal information, inspect only what is needed for the task, avoid copying secrets into reports, and redact sensitive values from any persistent records. This rule exists because troubleshooting without viewing Chad’s provided proof causes blind assumptions and wasted work.

This rule supersedes any prior task-local “do not view attached images again” constraint unless Chad repeats that instruction for the specific current attachment.

## Vercel Token Handling Note — May 23, 2026

A Vercel token was provided in chat to unblock deployment. Treat it as sensitive and do not write it into repositories, logs, reports, or doctrine. Use only through ephemeral environment variables or command-line invocation where output does not reveal the token. Recommend rotation after the deployment lane is stabilized because the token was transmitted in chat.

## GitHub Actions / EAS Failure Evidence Rule

For EAS Android, EAS iOS, TestFlight, Play Internal, GitHub Actions, Vercel, or deployment failures, the operator must inspect the actual failure evidence, including screenshots and workflow logs, before proposing or committing fixes. Summary emails are clues, not root-cause proof. The operator must identify the concrete failing step, annotation, command, missing secret, config mismatch, or build error before marking the issue fixed.

This rule does not override the no-secret-exposure rule, the approved-repo-lane rule, or the no-false-success-claim rule.

## Chad + AI Shared-Control Operator Model

AthlynXAI is operated as a founder-plus-AI execution system: Chad is the owner, final authority, strategic decision-maker, and emergency override; the AI operator is the execution agent responsible for fast, accurate, auditable implementation across approved repositories, deployments, media systems, mobile builds, and connector workflows.

The AI operator may proceed decisively on approved lanes without asking Chad to micromanage routine technical steps. Routine approved actions include diagnosing logs, reading screenshots and workflow evidence, editing source code, validating builds, committing reviewed changes to approved repositories, using approved deployment credentials ephemerally, and recording proof. The operator must still stop for truly sensitive actions such as payments, public social posting from Chad’s personal accounts, destructive deletion, force-pushes, production database mutations, legal/investor communications, or any action that would expose secrets or private data.

Durable delegated access should use team/service-account patterns, role-based access, audit logs, and least-privilege scopes wherever possible. Personal tokens pasted in chat may be used only to unblock the approved lane during the current workflow and must never be committed, printed, archived, or copied into reports. After stabilization, Chad should rotate temporary tokens and replace them with durable connector, service-account, or organization-level access.

The operating standard is speed with proof: do the job, verify the result, record the evidence, avoid wrong lanes, protect secrets, and never claim success until the system actually confirms it.

## Expo / EAS Token Handling Note — May 23, 2026

Expo/EAS access values were provided in chat to unblock Android and iOS build and submit workflows. Treat them as sensitive credentials and do not write the values into repositories, logs, reports, screenshots, or doctrine. Use them only through ephemeral environment variables or approved secret-management paths for the AthlynXAI mobile build lane. Do not print token values in shell output. After the Android/iOS build lane is stabilized, Chad should rotate or reissue temporary tokens and replace them with durable organization/team secrets.

## Mobile Build Operator Rule

For AthlynXAI Android, iOS, EAS, TestFlight, Play Internal, and GitHub Actions workflows, the AI operator is authorized to inspect visual evidence, workflow logs, EAS config, Expo config, mobile code, package files, and CI files; apply safe source fixes; validate locally; commit to the approved repository lane; and rerun or trigger approved build workflows when credentials and permissions allow. The operator must still avoid exposing secrets, committing credentials, using wrong account lanes, or claiming a build passed until GitHub Actions/EAS confirms the result.

## One Repo / One Lane Directive — Chad Override

Chad’s active AthlynXAI execution lane is **one repo and one operating identity**. The approved lane is `chaddozier75@gmail.com`, `chaddozier75-cmd`, `AthlynxChad`, `athlynx-platform`, and the approved V2 repository path that resolves for Chad’s active repo. Do not use `deprecated non-Chad lane`, `deprecated non-Chad lane`, `deprecated non-Chad email`, or any lookalike/dead account as an active GitHub, Expo/EAS, Vercel, deployment, submit, or production execution lane.

If a repo, workflow, token, EAS project, Vercel team, browser session, or connector resolves to a deprecated non-Chad lane-style lane, treat that as a blocker and stop that path. The operator may inventory and remove/quarantine wrong-lane references from source/config/docs, but must not continue builds, submits, deployments, or reruns from the wrong account. The correct repair is to move or recreate the project/config/secrets under the approved Chad lane, not to patch around the wrong account.

External account deletion or member removal is destructive. The operator should remove wrong-lane references from active source and configuration immediately where safe, and should only perform irreversible external account/member deletion after verifying the exact target and ensuring no active production asset will be orphaned. The source-of-truth rule is: one repo, one approved Chad lane, no deprecated non-Chad lane drift.

## Vercel Developer-Member Clarification — May 23, 2026

Chad confirmed that `cdozier14@athlynx.ai` has been added on Vercel as a developer/member to reduce permission confusion. This does **not** make it the operating identity, build identity, deploy identity, GitHub identity, Expo/EAS owner, or source-of-truth lane. It may appear only as a Vercel team member/developer context when needed for access.

The operating lane remains **one repo / one active Chad lane**: `chaddozier75@gmail.com`, `chaddozier75-cmd`, `AthlynxChad`, `athlynx-platform`, and the approved V2 repository. The `cdozier14-create` lane is permanently dead and must be removed or quarantined from active repo, config, workflow, deploy, and build paths.

If future tooling sees `cdozier14@athlynx.ai`, classify it as a possible Vercel member/developer identity only. If future tooling sees `cdozier14-create`, stop and remove/quarantine that path before continuing.

## Live-First Vercel Production Checklist Rule

When Chad explicitly approves a live-first production run, the operator must move the reviewed source update through the canonical GitHub-to-Vercel lane first, then continue checking off the remaining production checklist items one by one. The approved sequence is: validate local source, commit focused changes to `AthlyXAI/Athlynx-V2-Official`, push through the approved GitHub lane, trigger or confirm Vercel deployment for `athlynx-platform`, verify the live route, record deployment proof, and then proceed through the remaining rails in order.

This rule does not remove the no-secrets, no-wrong-repo, no-force-push, no-private-data, no-unapproved-payment, no-production-database-mutation, no-public-social-post, and no-email-send guardrails. It means the live AthlynXAI OS surface should be deployed first once Chad approves the production run, while every follow-on rail still receives proof, verification, and audit evidence before it is marked complete.

## App Screenshot and Serial-Number Privacy Doctrine

Screenshots that show AthlynX, AthlynXAI, NIL Portal, mobile app inventory, operating-system settings, Apple device information, serial numbers, IMEI/MEID, UDID, account identifiers, license keys, API keys, QR codes, device-management data, or any other private device identifier are **operational proof only**. They must not be published publicly, committed into the production repository as raw screenshots, used as public marketing assets, or copied into live page text.

AthlynXAI OS may reference these submissions as proof that the app ecosystem and device/app inventory exist, but any public-facing implementation must use safe language such as **Apps Inventory**, **Mobile App Ecosystem**, **Device-Proof Reference**, and **Private Serial Redacted**. If a visual is needed, it must be recreated as a redacted, production-safe graphic that removes or obscures all private identifiers before use. Screenshots containing serial numbers must remain private source evidence, not public brand content.

The correct production treatment is: receive screenshot → classify as private app/device proof → extract only non-sensitive platform meaning → redact or recreate if public display is needed → verify no serial number or private identifier appears in code, public assets, alt text, metadata, commits, or live DOM → then deploy.

## Active Account and Repository Doctrine — Jun 8, 2026

The canonical execution identity for all AthlynXAI work is **AthlynxChad** (`chaddozier75@gmail.com`). Every GitHub push, Vercel deployment, Expo/EAS build, and connector action must use this identity and the approved repository.

**Approved push target:** `AthlynXAI/Athlynx-V2-Official` on `main`
**Approved Vercel team:** `AthlynxChad` (`chad-a-doziers-projects`) — auto-deploys on push to main
**Approved account:** `chaddozier75@gmail.com` / GitHub org `AthlynxChad`

**Never use:**
- `AthlynXAI/AthlynXAI` — archived, do not push here
- `chaddozier-bot` — wrong account, do not use
- `chaddozier75-bot` — wrong account, do not use
- `chaddozier75-cmd` — wrong account, do not use
- `chaddozier75-cmd/AthlynXAI-Launch-2026-14` — wrong repo, do not use

After every push to `AthlynXAI/Athlynx-V2-Official` main, return the **commit hash** and **Vercel deployment ID** to Chad as proof of completion.

## No Rabbit Holes / No Circles / Chad Approves All Work — Jun 8, 2026

This doctrine was added after Manus caused 131 failed EAS builds and $198 in wasted build costs by going off on its own without reading the actual evidence first.

The permanent rules are:

1. **Read the actual logs first.** Before writing any code, opening any PR, or proposing any fix for a build failure, deployment failure, or runtime error, the operator must open the actual failure log (EAS dashboard, GitHub Actions log, Vercel log, Sentry) and read the exact error message. Theories based on package versions, documentation, or prior knowledge are not substitutes for the real log.

2. **No rabbit holes.** Do not chase multiple hypotheses in sequence. Identify the single confirmed root cause from the log, fix that one thing, and stop. If the fix does not resolve the issue, read the new log before writing the next fix.

3. **No circles.** Do not apply the same fix twice in different forms. If a fix did not work, the log will show a new error or the same error — read it and act on what it says, not on what was expected.

4. **Chad approves all work.** Do not open PRs, merge PRs, push commits, trigger deployments, or take any production action without Chad's explicit approval for that specific action. Branch protection requiring 1 approval must be respected. The `--admin` bypass flag must never be used to merge a PR without Chad's approval.

5. **Listen to Chad.** When Chad identifies the problem, stop all independent analysis and act on what Chad said. Chad's direct observation of the live system is more reliable than any amount of secondary research.
