# Unified Identity Doctrine

## One Person · One Login Path · One Production Repo · One Deployment Path

---

## Single source of truth

| Category | Permanent value |
|---|---|
| **Person** | Chad A. Dozier Sr. — Founder & CEO |
| **Default login email** | `chaddozier75@gmail.com` |
| **Preferred auth** | Google sign-in or GitHub sign-in where available |
| **GitHub production repo** | `AthlyXAI/Athlynx-V2-Official` |
| **GitHub owner login** | `AthlyXAI` |
| **Valid GitHub noreply** | `251627004+athlyxai@users.noreply.github.com` |
| **Vercel scope / project** | `chad-a-doziers-projects` / `athlynx-platform` |
| **Production website** | `athlynx.ai` |
| **Operating doctrine** | `docs/doctrine/CANONICAL_OPERATIONS_DOCTRINE.md` |

---

## Permanent delivery model

Manus owns the code delivery path. Manus builds, commits, opens or updates PRs, verifies, and prepares the Vercel deployment. Chad reviews the working build and approves live deployment or live data operations. Perplexity supports in parallel only and must not duplicate, overwrite, or redirect the active Manus workstream.

| Role | Responsibility |
|---|---|
| **Manus** | Push clean code to GitHub, keep PRs deployable, run checks, and prepare Vercel deployment. |
| **Chad** | Review the build and approve live deploy, production database actions, destructive deletes, or other sensitive external actions. |
| **Perplexity** | Provide research, debugging support, and code assistance in parallel; do not change repo/account/deploy targets. |
| **Vercel** | Deploy through `athlynx-platform` under `chad-a-doziers-projects`. |
| **Pipedream** | Connector hub only under `chaddozier75@gmail.com` using Google/GitHub sign-in where available. |

---

## Non-negotiable product standards

| Rule | Meaning |
|---|---|
| **No placeholders** | Do not ship placeholder UI, fake copy, fake buttons, fake accounts, fake connectors, or empty shells. |
| **No production mocks** | Mock data belongs only in tests or local fixtures, never in production product flows. |
| **Live integrations only** | Product code must use real integration paths or fail clearly with actionable configuration requirements. |
| **No wrong context** | A GitHub 404 before Google/GitHub sign-in is an authentication-context problem, not proof that the repo is missing. |
| **No duplicate agents** | Perplexity and Manus do not work the same file/task independently. Perplexity supports; Manus delivers. |

---

## Hard-stop invalid paths

| Invalid path | Required behavior |
|---|---|
| `retired-non-chad-lane` | Never use for AthlynXAI production code, connectors, secrets, deploys, databases, or workflows. |
| `AthlynxAI/AthlynxAI` | Not the production website repo unless Chad explicitly gives a one-time exception. |
| `chaddozier75-cmd/Athlynx-V2-Official` | Wrong GitHub namespace; `chaddozier75-cmd` is Vercel context, not the production GitHub owner. |
| Any repo other than `AthlyXAI/Athlynx-V2-Official` | Stop and ask Chad. |
| Any login not tied to `chaddozier75@gmail.com` | Stop unless Chad explicitly approves that system-specific exception. |

---

## Connector rule

All connector setup, including Pipedream, must use `chaddozier75@gmail.com` by default and authenticate through Google or GitHub sign-in where available. Every connector must point to the canonical service target: GitHub `AthlyXAI/Athlynx-V2-Official`, Vercel `athlynx-platform`, and the approved live database/integration path. If a connector offers a similarly named account, repo, workspace, or project, reject it unless it matches this doctrine exactly.

---

*Last updated: 2026-05-20 — Canonical operating model locked by Chad A. Dozier Sr.*
