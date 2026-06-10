# Bot Suggestion Policy

**Scope:** Platform / Layer Cake lane. Governs which automated bots may
author commits in this repository and under what conditions.

**Lineage:** Derived from the safety-gate philosophy of
`docs/email-os/permanent-reverse-funnel-doctrine.md` and the
canonical-authority scope of `docs/policies/canonical-authority.md`.

---

## Why this policy exists

On 2026-05-16, the Vercel Agent (a documented Vercel feature) pushed a
commit (`dcc03e6`) to PR #38 attempting to "fix" what it perceived as a
mailbox-identity inconsistency. The fix was empirically wrong — it
replaced verified connector state with the taxonomy doc's aspirational
identity, contradicting the actual tool-call output that informed the brief.

The Lane Discipline `enforce` job correctly rejected the commit because
the bot's author email (`35613825+vercel[bot]@users.noreply.github.com`)
was not on the allow-list. The safeguard worked as designed.

**Closing PR #38 by force-resetting and re-pushing** would clear the red
check but teach the wrong lesson — that bot commits are an obstacle to
route around. This policy instead **codifies a permanent stance**:

> Bots may suggest. Owner ratifies.

---

## The Rule

Bots on the Bot-Suggestion allow-list (currently `vercel[bot]` and
`github-actions[bot]`) may author commits on PR branches subject to ALL
of the following:

1. **Path restriction.** Bot commits may only touch paths under `docs/`.
   No code, schema, workflows, configuration, or secrets.

2. **Branch restriction.** Bot commits may only appear on PR branches.
   `main` branch protection prevents direct pushes by anyone, including
   bots; this is enforced by GitHub branch protection, not by this script.

3. **Owner Ratification.** For a PR containing one or more bot commits to
   pass `check-commit-authors.mjs`, an Owner-authored commit MUST appear
   chronologically AFTER the latest bot commit on the same PR branch.
   Owner emails are defined in the script's `OWNER_EMAILS` set.

4. **No silent merge.** A PR cannot be merged if any bot commit is
   unratified. The CI gate fails with a message explaining how to ratify.

---

## How to ratify a bot commit

When the Vercel Agent or another allow-listed bot pushes a fix to your
PR branch, you have three options:

### (a) Accept the suggestion
The bot's change is correct. Add a commit (it can be empty) on top of
the bot commit, authored by an Owner. Example:

```bash
git commit --allow-empty -m "Accept vercel[bot] suggestion: <one-line rationale>"
git push
```

The empty commit ratifies the bot commit. CI will pass.

### (b) Reject the suggestion
The bot's change is wrong (as happened on PR #38). Revert it:

```bash
git revert <bot-commit-sha>
git push
```

The revert is Owner-authored and counts as ratification.

### (c) Overwrite the suggestion
The bot's change is wrong AND noisy enough that you want the bot commit
out of history entirely. Force-push from a state without it:

```bash
git reset --hard <last-good-owner-commit>
git push --force-with-lease
```

This removes the bot commit from the branch. The PR no longer contains
the unratified commit, so the gate is satisfied vacuously.

---

## Why not just block bot commits entirely?

Two reasons:

1. **Sometimes the bot is right.** PR #36 had two Vercel Agent comments
   that flagged real bugs (`test -f` against a literal glob, wrong proof
   filename in error message). Those became PR #37. Blocking the bot's
   ability to comment or suggest would have cost real safety.

2. **Selective listening is better than blanket silence.** The Owner
   reads the bot's suggestion, decides if it's right, and ratifies or
   rejects. This is the same Safety Gate pattern that governs Email OS:
   external input → Owner approval → execution.

---

## What this policy does NOT permit

- **Bots authoring code** (TypeScript, JavaScript, SQL, anything outside `docs/`)
- **Bots authoring workflow or policy files** (`.github/**`, `docs/policies/**` are
  by CODEOWNERS-owned by the Owner; this script will fail those paths anyway)
- **Bots authoring directly on `main`** (GitHub branch protection blocks this)
- **Auto-ratification** (no CI step automatically Owner-signs a bot commit)
- **Bypass on docs-only PRs** (the rule applies uniformly)

---

## Adding a new bot to the allow-list

Adding a bot to `BOT_SUGGESTION_EMAILS` in `scripts/check-commit-authors.mjs`
requires:

1. The bot's canonical noreply email (`<numeric-id>+<bot-login>@users.noreply.github.com`),
   verified by visiting `https://api.github.com/users/<bot-login>%5Bbot%5D`.
2. A PR Owner-authored against `main`.
3. A note in this document explaining why the new bot needs commit author
   privileges (vs. just commenting).

---

## Incident reference

PR #38 (docs(email-os): Manus handoff brief for reverse-funnel pass) is the
incident that motivated this policy. The Vercel Agent's commit `dcc03e6`
attempted to replace empirical connector state with aspirational taxonomy
identity. The Owner verified via direct connector inspection that the
empirical state was correct, ratified by rejecting the bot's change.

This policy ships as part of that resolution.
