# Manus Handoff — Reverse-Funnel Email Pass

**Date issued:** 2026-05-16 (Saturday evening, CDT)
**Issued by:** Computer (Perplexity), on Chad's explicit request before extended sleep
**Governing doctrine:** `docs/email-os/permanent-reverse-funnel-doctrine.md` (commit `3e6be3f`)
**Governing taxonomy:** `docs/email-os/routing-taxonomy.md`
**Lane:** This work is Manus's. Computer is staging the brief only — no inbox mutations performed.

---

## Why this brief exists

Chad asked Computer at 7:50 PM CDT on 2026-05-16 to "take over" email cleanup so he could sleep for two days. Computer declined to execute autonomously because doing so would cross lanes and bypass Safety Gates Chad himself shipped four hours earlier in the standing doctrine.

Instead, Computer verified the current state of the two connected inboxes (read-only), and is now handing the work to Manus inside doctrine.

**Chad expects to wake up to a clean inbox and a report. Not a mess. Not a re-incident.**

---

## Connected inboxes (verified 2026-05-16 ~20:00 CDT)

| Mailbox | Connector | Lane | Recent state |
|---|---|---|---|
| `cdozier14@athlynx.ai` | gcal | AthlynXAI Workspace | Mostly automated: Vercel notifications, AthlynXAI Daily Reports, calendar acceptances, LINE verification codes. Some are unread (`UNREAD` label seen on Daily Report and LINE verification). |
| `cdozier@dozierholdingsgroup.com` (+ `chad.dozier@icloud.com`, `outlook_E9392533DC920464@outlook.com` aliases on same Outlook account) | outlook | DHG / Personal | One live revenue-track thread (see below). Otherwise stale: 2024 Teams meeting links, 2022 OneDrive shares, 2022 account-creation notices. |

**Not connected here, so out of scope:** `chaddozier75@gmail.com` (Platform / Layer Cake). Chad must connect Gmail separately for that inbox to be cleaned.

---

## Pinned signal — DO NOT TOUCH

**Thread:** "AthlynXAI — Mutual NDA for our Friday 5/22 call"
**From:** `cdozier@dozierholdingsgroup.com` → `brandon@archetype-data.com`
**Sent:** 2026-05-15 01:50 UTC
**Attachment:** `AthlynXAI_Mutual_NDA_Brandon_v2.pdf`
**Outlook ItemID:** `AQMkADAwATNiZmYAZC00OWI2LWYxYzYtMDACLTAwCgBGAAAD-8T92Gynxk238AOO4sO1PAcA5t2r3p_B7Ey5FYg5iISnnwAAAgEJAAAA5t2r3p_B7Ey5FYg5iISnnwAD2pWFIgAAAA==`

This is real revenue-track signal — NDA sent ahead of an 11:00 AM CST investor/partner call on Friday 5/22.

**Required action by Manus:**
- Label `signal/revenue` and `priority/wake-up`
- Surface in Chad's wake-up report at top
- Do NOT archive, do NOT auto-respond, do NOT mark read
- If Brandon replies while Chad sleeps: surface immediately, do NOT draft outbound — Chad approves all outbound to investor/partner contacts (Safety Gate)

---

## Scope authorized by Chad

Chad selected: **"All three"** — reversible organization + draft unsubscribe/delete review queue + draft replies to Drafts folder. No gated actions.

### Authorized (no further approval needed)
1. **Archive / label / mark-read** — fully reversible organization across both inboxes
2. **Draft unsubscribe/delete queue** — write a review list to `docs/email-os/handoffs/2026-05-16-review-queues/`. No execution.
3. **Draft replies** — write reply drafts into the Drafts folder of each inbox. No send.

### Blocked by Safety Gates — require Chad's explicit approval on wake
- Permanent delete (anything)
- Unsubscribe execution (could kill real signal)
- Outbound send (to anyone)
- Touching threads tagged `signal/revenue`, `signal/finance`, `signal/security`, `signal/legal`
- Account/security/financial-instruction changes (none expected, but explicit per doctrine)

---

## Reverse-funnel categorization Manus must apply

Per the doctrine, raw fuel → signal extraction → routing → automation → owner feed. Use these labels (create them if they don't exist):

| Label | Definition | Action |
|---|---|---|
| `signal/revenue` | Investor, partner, paying customer, real contract motion (e.g., Brandon NDA) | Surface in wake-up report; never archive |
| `signal/finance` | Stripe payouts, bank, tax, expense receipts, money movement | Surface in wake-up report; never archive |
| `signal/legal` | Contracts, NDAs, IP, regulatory, formation docs | Surface in wake-up report; never archive |
| `signal/security` | Auth alerts, breach notices, account changes, 2FA | Surface in wake-up report; never archive |
| `signal/platform` | Vercel / GitHub / Neon / CI alerts that aren't routine | Surface only if non-routine; archive routine notifications |
| `noise/automated` | Daily reports Chad already generates, calendar acceptances of his own meetings, vendor newsletters | Mark read + archive |
| `noise/expired` | Verification codes, 7-day invites past expiration, old session notices | Mark read + archive |
| `noise/stale` | Anything older than 90 days with no thread activity | Archive (do not delete) |
| `review/unsubscribe` | Marketing lists Chad doesn't read | Add to review queue; do NOT execute unsubscribe |
| `review/reply` | Things that need a human reply | Draft into Drafts folder; do NOT send |

---

## Specific items Computer observed (use as starting points, not the full list)

**`cdozier14@athlynx.ai` (gcal):**
- Vercel team invite (cdozier14 → AthlynXChad team) dated 2026-05-16 22:11 UTC → `signal/platform` (action: Chad needs to accept the invite to his own team — surface in wake-up report)
- AthlynXAI Daily Report 2026-05-16 (0 new, 12 total) → `noise/automated` (mark read + archive; the daily report is auto-generated by Chad's own SendGrid)
- LINE verification code dated 2026-05-16 03:08 UTC → `noise/expired` (code 5832, presumably already used or expired)
- Calendar acceptance: "AthlynXAI Build 21 — Post-TestFlight Testing Window" → `noise/automated` (Chad accepting his own invite to himself)

**`cdozier@dozierholdingsgroup.com` (outlook):**
- Brandon Archetype NDA thread → `signal/revenue`, `priority/wake-up` (see "Pinned signal" above)
- Old Teams meeting links from `outlook_E9392533DC920464@outlook.com` dated 2024-12-11 (multiple) → `noise/stale` (archive)
- OneDrive share to `phil@sabre56.com` dated 2022-08-05 → `noise/stale` (archive)
- "My new email address: outlook_E9392533DC920464@outlook.com" dated 2022-04-11 → `noise/stale` (archive)

---

## Wake-up report Manus must deliver

When Chad wakes, deliver a single report file at:
`docs/email-os/handoffs/2026-05-16-wake-up-report.md`

Format:

```
# Wake-up Report — Email OS Pass

## Top of funnel (action required from Chad)
- [signal/revenue] Brandon Archetype NDA — sent 5/15, call 5/22 11 AM CST. Awaits Brandon's signed return.
- [signal/platform] Vercel team invite to cdozier14@athlynx.ai for AthlynXChad team — Chad to accept.
- [...other signals surfaced...]

## Review queues (your one-tap approval needed)
- Unsubscribe queue: N items at docs/email-os/handoffs/2026-05-16-review-queues/unsubscribe.md
- Draft replies queue: N items in Drafts folder of [inbox]

## Cleaned up (reversible — restorable if needed)
- Archived: N emails matching noise/automated, noise/expired, noise/stale
- Marked read: N emails
- Labels applied: N

## Did NOT touch (Safety Gates held)
- 0 permanent deletes
- 0 unsubscribe executions
- 0 outbound sends
- 0 changes to signal/* threads
```

---

## If Manus hits a Safety Gate

**STOP. Do not improvise.** Per doctrine: "no permanent delete, outbound send, repo mutation, money movement, or security changes without approval."

Options:
1. Add the item to the review queue and continue
2. Skip the item and note in wake-up report under "Items requiring Chad's decision"
3. If genuinely urgent and time-sensitive (e.g., a security alert with a 24h window), surface immediately to Chad via the wake-up report's top section — do NOT act on his behalf

---

## Incident contract

If Manus mis-reports an inbox-zero state again (per F-5 addendum in `docs/incidents/2026-05-16-wrong-neon-target.md`), the wake-up report must include exact counts:
- Total threads scanned per inbox
- Total emails archived per inbox
- Total emails marked read per inbox
- Total drafts created per inbox
- Total items in each review queue

No "all cleaned up" without the numbers. Truth before speed.

---

## Boundaries this brief does NOT cross

- **Computer did not execute any mutations.** This brief is staging only.
- **Computer did not search Chad's chaddozier75@gmail.com inbox.** It is not connected.
- **Computer did not draft any replies.** Drafting is Manus's lane.
- **Computer did not retire or modify the email taxonomy.** It is the existing standing taxonomy at `docs/email-os/routing-taxonomy.md`.

This brief is Manus's marching orders. Chad signed off on scope at 7:53 PM CDT and selected "Hand it to Manus with a real brief" at 8:02 PM CDT.

---

— Computer (Perplexity), lane-respectful, doctrine-governed.
