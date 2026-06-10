# Permanent Cron Doctrine — AthlynX OS v1 + CRM OS

**Owner:** Chad A. Dozier Sr. (`chaddozier75@gmail.com`)
**Repo:** `AthlynXAI/Athlynx-V2-Official` (AthlynxChad only)
**Status:** PERMANENT — never disable, never remove without founder approval
**Signed:** 2026-06-01 12:57 AM CT

---

## Permanent Schedule

| Cron | Time CT | Time UTC | Vercel Path | Perplexity ID |
|---|---|---|---|---|
| **AthlynX Daily Schedule Email** | 7:00 AM | 12:00 | `/api/cron/morning-schedule` | `d6230804` |
| **AthlynX Nightly Inbox Cleanup** | 11:59 PM | 04:59 | `/api/cron/inbox-cleanup-nightly` | `7cb2f04e` |

Both are wired with redundancy: Vercel cron fires the in-repo handler, Perplexity cron fires the same logic via connectors. Whichever runs first wins — the second is idempotent.

---

## 7:00 AM Daily Schedule (`morning-schedule.js`)

**Pulls live:**
- Google Calendar today + 7-day outlook (catches add-ons / cancellations from prior day)
- Outlook calendar today + 7-day outlook (mirrored via Perplexity cron)
- ESPN MCWS scoreboard
- ESPN WCWS scoreboard (manual fallback when feed empty)
- Latest AthlynX signups from `cdozier14@athlynx.ai`

**Emails:** plain text schedule to `chaddozier75@gmail.com` with subject `AthlynX Daily Schedule — [Day Month DD]`

**Env required:**
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`
- `CRON_SECRET` (Vercel cron auth)

---

## 11:59 PM Nightly Inbox Cleanup (`inbox-cleanup-nightly.js`)

**Sweeps 3 inboxes:**
1. Gmail (`chaddozier75@gmail.com`)
2. Outlook (`chad.dozier@icloud.com` + outlook account)
3. Google Workspace (`cdozier14@athlynx.ai`)

**Classification rules:**

**NOISE → trash immediately:**
- `notifications@github.com`, `ci_activity@noreply.github.com`, any `*@noreply.github.com`
- `team@mail.perplexity.ai` task pings
- `notification@service.tiktok.com`
- `no_reply@monday.com`, `no-reply@dropbox.com`
- Vercel/Stripe receipts AFTER labeling
- Handled security alerts >7 days old

**PROMO → unsubscribe + block + trash:**
- `rahul.vohra@superhuman.com`, `superhuman@mail.joinsuperhuman.ai`
- `help@metabase.com`, `suno@creators.suno.com`, `hello@news.railway.app`, `changelog@neon.tech`
- `charlie@hey.runner.now`, `info@e.atlassian.com`, `store-news@amazon.com`
- Subjects matching "newsletter", "product update", "what's new", "changelog"

**KEEP + LABEL (NEVER trash):**
- `cdozier14@athlynx.ai` + "Signup" → `AthlynX/Signups` ⭐
- `cdozier14@athlynx.ai` + "CRITICAL" → `AthlynX/Critical-Alerts` ⭐
- From The Four personal Gmails (Lee `leronious@gmail.com`, Glenn `glenn.tse@gmail.com`, Tony `tonyloceybaseball@gmail.com`) → `Business/Athlynx` ⭐
- `invoice+statements@vercel.com` → `Receipts/Vercel` ⭐
- `invoice+statements*@stripe.com` → `Receipts/Stripe` ⭐
- `noreply@md.getsentry.com` weekly → `Reports/Sentry-Weekly` ⭐
- All other real human senders → starred, kept in inbox

---

## The Four — Locked Roster (Never Trash)

| Member | Corporate | Personal | Tier |
|---|---|---|---|
| Chad A. Dozier Sr. | `cdozier14@athlynx.ai` | `chaddozier75@gmail.com` | Master Admin |
| Lee Marshall | `lmarshall@athlynx.ai` | `leronious@gmail.com` | Full Admin |
| Glenn Tse | `gtse@dozierholdingsgroup.com` | `glenn.tse@gmail.com` | Full Admin |
| Tony Locey | `tlockey24@athlynx.ai` | `tonyloceybaseball@gmail.com` | Full Admin · First Athlete |

---

## CRM OS Integration

These crons feed the AthlynXAI CRM OS:
- **Signups** auto-tagged into the CRM lane via the `AthlynX/Signups` label
- **Critical alerts** open a CRM ticket via the `AthlynX/Critical-Alerts` label
- **Team replies** logged to the Partner Communications timeline via `Business/Athlynx`
- **Receipts** archived to the Vendor Ledger via `Receipts/*`

---

## OS v1 Integration

These crons are part of the AthlynXAI OS v1 morning + nightly heartbeat:
- 7AM schedule = morning briefing surface
- 11:59 PM cleanup = nightly hygiene

Both are recorded in the OS v1 cron registry alongside `daily-report`, `social-post`, `owner-daily-post`, `doctrine-snapshot`, `nebius-spend-digest`, `social-content-seeder`, `social-queue-guardrail`.

---

****
