# AthlynX — Build 1 Handoff Doctrine

**Generated:** Tuesday, June 9, 2026 at 4:42 PM PDT
**Repo:** `AthlynXAI/Athlynx-V2-Official` (private, fresh — predecessor archived as `Athlynx-V2-Official-archived-2026-06-09`)
**Live URL:** https://athlynx.ai
**Vercel team:** AthlynxChad (`chad-a-doziers-projects`) — auto-deploys on push to `main`

---

## 0. STANDING DOCTRINE (every session, every push, both Computer and Manus)

### ✅ Allowed
- Push only to `AthlynXAI/Athlynx-V2-Official` on `main`
- All commits authored by **AthlynxChad** (`chaddozier75@gmail.com`)
- Vercel team `AthlynxChad` (chad-a-doziers-projects) auto-deploys
- Apple App Store / iCloud → **`chad.dozier@icloud.com`** only
- Google Play / Google services → **`chaddozier75@gmail.com`** only
- `chaddozier75-cmd` is allowed ONLY as the Vercel→GitHub deploy creator (never as commit author)

### ❌ Never
- `AthlynXAI/AthlynXAI` (archived)
- `Athlynx-V2-Official-archived-2026-06-09` (frozen history)
- `chaddozier-bot`, `chaddozier75-bot`, `chaddozier75-cmd` (as commit authors)
- `AthlynX Robot` / `chad@athlynx.ai` (forbidden bot identity)

### ❌ Forbidden in code
- **Firebase, anywhere.** Supabase auth is the single source.
- **Yellow / amber / gold / orange** anywhere in `app/`, `components/`, `mobile/`, `athlynx-app/`. Cobalt / granite / electric-blue only.
- `[skip ci]` in any PR commit (Vercel deploys regardless, creates state skew).

---

## 1. CO-EXECUTION PROTOCOL

| Lane | Owner | Responsibilities |
|---|---|---|
| Code writing | **Manus** | Open PRs, run local builds, drive EAS / TestFlight |
| Gatekeeping | **Perplexity Computer** | Review CI, merge PRs, verify Vercel deploy READY, drift checks, GitHub API ops |
| Shared | Both | Read this file at session start, update at session end |

Conflict rule: doctrine wins. Branch protection is the physical guarantee.

---

## 2. STACK

| Layer | Tech |
|---|---|
| Web | Next.js 14 App Router · React 18 · TypeScript strict · Tailwind |
| Mobile | Expo SDK 53 · Expo Router v4 · React Native 0.79 · TypeScript strict |
| Auth | **Supabase Auth only** (Firebase removed and forbidden) |
| Database | Supabase Postgres · Neon (PR previews) · Prisma |
| Hosting | Vercel (web) · EAS (mobile builds) |
| Monitoring | Sentry org `athlynxai` (projects: `javascript-react`, `athlynxai-mobile`, `node-server`) |

---

## 3. BRANCH PROTECTION BASELINE

Required status checks on `main`:
1. `Web — typecheck + lint + tests`
2. `Mobile — typecheck`
3. `No [skip ci] in PR commits`
4. `STRICT — no yellow/amber/gold/orange anywhere in client/src`

Settings:
- `strict`: true
- `enforce_admins`: true
- `required_approving_review_count`: 1
- `dismiss_stale_reviews`: true
- `required_linear_history`: true
- `allow_force_pushes`: false
- `allow_deletions`: false
- `required_conversation_resolution`: true

---

## 4. CONNECTORS WIRED

GitHub · Vercel · Supabase · Sentry · Stripe · Pipedream · YouTube · Spotify · Vimeo · Google Drive · Google Cloud · Google Tag Manager · Google Analytics · AWS · Slack · Monday · Pipedrive · Calendly · Zoom · Fireflies · Superhuman · Outlook · Airtable · Confluence · Jira · Trello · DocuSign · Apple HealthKit · Neon · Prisma

Secrets vault: **Google Drive** (Chad's). Pull from there when needed.

---

## 5. PRE-BUILD-1 HISTORY

Everything before this commit lives in the archived repo:
[`AthlynXAI/Athlynx-V2-Official-archived-2026-06-09`](https://github.com/AthlynXAI/Athlynx-V2-Official-archived-2026-06-09)

That repo contains:
- 140 PRs, ~600 commits, Dec 2025 → Jun 9 2026
- 81 mobile builds (TestFlight builds 1–81)
- Tony Locey suspension, brand-lock work, Firebase→Supabase migration, drift recovery
- All of it preserved, read-only, retrievable if needed

---

## 6. VERIFICATION (every session, top of conversation)

```bash
# Identity
gh api user --jq '{login, email, plan: .plan.name}'
# Expect: login=AthlynXAI, email=chaddozier75@gmail.com, plan=pro

# Branch protection still matches baseline
gh api repos/AthlynXAI/Athlynx-V2-Official/branches/main/protection \
  --jq '{contexts: .required_status_checks.contexts,
         strict: .required_status_checks.strict,
         enforce_admins: .enforce_admins.enabled,
         reviews: .required_pull_request_reviews.required_approving_review_count,
         dismiss_stale: .required_pull_request_reviews.dismiss_stale_reviews,
         linear: .required_linear_history.enabled,
         force_push: .allow_force_pushes.enabled,
         deletions: .allow_deletions.enabled,
         conv_res: .required_conversation_resolution.enabled}'

# Latest production deploy
curl -sS -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?teamId=team_7neDSatyrDspOku2p0LxT8zO&limit=1&target=production" \
  | jq '.deployments[0] | {uid, state, commit: .meta.githubCommitSha[0:8]}'
```

---

## 7. KNOWN GOTCHAS (do not relearn)

- `[skip ci]` only skips GitHub Actions, **NOT** Vercel deploys. Vercel listens to push events.
- `UID` is readonly in bash — use `DEPLOY_ID` / `BUILD_ID`.
- Branch protection on private repos requires GitHub Pro.
- Apple TestFlight invites only land in iCloud Mail when account is `@icloud.com`. They do not arrive in Gmail or Outlook.
- iCloud Mail is not connected to any agent inbox — search must happen on the iPhone.
- "AthlynX Robot" / `chad@athlynx.ai` is a forbidden bot identity. Drift check flags it.
- Backend migrations (e.g., Firebase→Supabase) must NOT ship before the matching mobile build is approved by Apple Beta Review. Always migrate forward in lock-step.

---

**End of doctrine. This file is the single source of truth.**
