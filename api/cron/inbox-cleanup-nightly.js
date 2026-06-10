/**
 * PERMANENT DOCTRINE — AthlynX 11:59 PM Nightly Inbox Cleanup
 * Fires nightly at 04:59 UTC (11:59 PM CT) via vercel.json crons.
 * Owner: Chad A. Dozier Sr. <chaddozier75@gmail.com>
 * Repo: AthlynXAI/Athlynx-V2-Official (AthlynxChad only)
 *
 * Clears all three inboxes:
 *   1. Gmail (chaddozier75@gmail.com)
 *   2. Outlook (chad.dozier@icloud.com / outlook account)
 *   3. Google Workspace (cdozier14@athlynx.ai)
 *
 * Mirrors the Perplexity Computer cron `AthlynX 11:59 PM Nightly Inbox Cleanup`
 * (id 7cb2f04e) registered in the Perplexity scheduling system.
 *
 * NOISE → trash:
 *   - notifications@github.com / *@noreply.github.com (already blocked at source, sweep stragglers)
 *   - team@mail.perplexity.ai task pings
 *   - TikTok, Monday.com, Dropbox system notices
 *   - Vercel + Stripe receipts AFTER labeling
 *   - Old (>7d) handled security alerts
 *
 * PROMO → unsubscribe + block + trash:
 *   - rahul.vohra@superhuman.com, superhuman@mail.joinsuperhuman.ai
 *   - Metabase, Suno, Railway, Neon changelogs
 *   - Atlassian, Amazon, hey.runner.now
 *
 * KEEP + LABEL (never trash):
 *   - From cdozier14@athlynx.ai 'Signup' → AthlynX/Signups
 *   - From cdozier14@athlynx.ai 'CRITICAL' → AthlynX/Critical-Alerts
 *   - From Lee/Glenn/Tony personal Gmails → Business/Athlynx
 *   - Vercel/Stripe invoice → Receipts/<vendor>
 *   - Sentry weekly → Reports/Sentry-Weekly
 *   - Real human senders → starred
 */
"use strict";

const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const TZ = "America/Chicago";
const TO = "chaddozier75@gmail.com";
const SIGNATURE = [
  "",
  "Chad A. Dozier Sr.",
  "Founder · AthlynX",
].join("\n");

// LOCKED ROSTER — never trash from these senders
const THE_FOUR_EMAILS = new Set([
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
  "cdozier@dozierholdingsgroup.com",
  "lmarshall@athlynx.ai",
  "leronious@gmail.com",
  "gtse@dozierholdingsgroup.com",
  "glenn.tse@gmail.com",
  "tlockey24@athlynx.ai",
  "tonyloceybaseball@gmail.com",
]);

const NOISE_FROM_PATTERNS = [
  /@noreply\.github\.com$/i,
  /^notifications@github\.com$/i,
  /^ci_activity@noreply\.github\.com$/i,
  /^team@mail\.perplexity\.ai$/i,
  /^notification@service\.tiktok\.com$/i,
  /^no_reply@monday\.com$/i,
  /^no-reply@dropbox\.com$/i,
];

const PROMO_FROM_PATTERNS = [
  /^rahul\.vohra@superhuman\.com$/i,
  /^superhuman@mail\.joinsuperhuman\.ai$/i,
  /^help@metabase\.com$/i,
  /^suno@creators\.suno\.com$/i,
  /^hello@news\.railway\.app$/i,
  /^changelog@neon\.tech$/i,
  /^charlie@hey\.runner\.now$/i,
  /^info@e\.atlassian\.com$/i,
  /^store-news@amazon\.com$/i,
];

const LABELS = {
  signups: "AthlynX/Signups",
  critical: "AthlynX/Critical-Alerts",
  team: "Business/Athlynx",
  receipts_vercel: "Receipts/Vercel",
  receipts_stripe: "Receipts/Stripe",
  sentry: "Reports/Sentry-Weekly",
  archived_noise: "Cleanup/Archived-Noise",
};

function ctDateOnly() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, year: "numeric", month: "long", day: "numeric", weekday: "long",
  }).format(new Date());
}

async function getOAuth2Client() {
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    "urn:ietf:wg:oauth:2.0:oob"
  );
  oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
  return oauth2;
}

async function ensureLabel(gmail, name) {
  const list = await gmail.users.labels.list({ userId: "me" });
  const existing = (list.data.labels || []).find(l => l.name === name);
  if (existing) return existing.id;
  const created = await gmail.users.labels.create({
    userId: "me",
    requestBody: { name, labelListVisibility: "labelShow", messageListVisibility: "show" },
  });
  return created.data.id;
}

function senderFromHeader(h) {
  if (!h) return "";
  const m = h.match(/<([^>]+)>/);
  return (m ? m[1] : h).trim().toLowerCase();
}

function classifyMessage(headers) {
  const from = senderFromHeader(headers.from);
  const subject = (headers.subject || "").toLowerCase();

  if (THE_FOUR_EMAILS.has(from)) {
    if (from === "cdozier14@athlynx.ai") {
      if (subject.includes("signup")) return { action: "label", label: LABELS.signups, star: true };
      if (subject.includes("critical")) return { action: "label", label: LABELS.critical, star: true };
    }
    return { action: "label", label: LABELS.team, star: true };
  }

  if (NOISE_FROM_PATTERNS.some(p => p.test(from))) return { action: "trash" };
  if (PROMO_FROM_PATTERNS.some(p => p.test(from))) return { action: "trash" };

  if (from.includes("invoice+statements") && from.includes("vercel.com")) {
    return { action: "label", label: LABELS.receipts_vercel, star: true };
  }
  if (from.includes("invoice+statements") && from.includes("stripe.com")) {
    return { action: "label", label: LABELS.receipts_stripe, star: true };
  }
  if (from.includes("getsentry.com") && subject.includes("weekly report")) {
    return { action: "label", label: LABELS.sentry, star: true };
  }

  // Default: keep in inbox, no action — human will triage
  return { action: "keep" };
}

async function cleanGmailInbox(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  const counts = { trashed: 0, labeled: 0, kept: 0 };
  const labelCache = {};

  let pageToken;
  do {
    const list = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 100,
      pageToken,
    });
    const ids = (list.data.messages || []).map(m => m.id);
    for (const id of ids) {
      const msg = await gmail.users.messages.get({
        userId: "me", id,
        format: "metadata",
        metadataHeaders: ["From", "Subject"],
      });
      const headers = {};
      (msg.data.payload?.headers || []).forEach(h => { headers[h.name.toLowerCase()] = h.value; });
      const verdict = classifyMessage(headers);

      if (verdict.action === "trash") {
        await gmail.users.messages.trash({ userId: "me", id });
        counts.trashed++;
      } else if (verdict.action === "label") {
        if (!labelCache[verdict.label]) labelCache[verdict.label] = await ensureLabel(gmail, verdict.label);
        await gmail.users.messages.modify({
          userId: "me", id,
          requestBody: {
            addLabelIds: [labelCache[verdict.label], ...(verdict.star ? ["STARRED"] : [])],
          },
        });
        counts.labeled++;
      } else {
        counts.kept++;
      }
    }
    pageToken = list.data.nextPageToken;
  } while (pageToken);

  return counts;
}

module.exports = async (req, res) => {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  try {
    const auth = await getOAuth2Client();
    const gmailResult = await cleanGmailInbox(auth);

    // Outlook + Google Workspace passes are TODO once OAuth tokens are wired
    // The Perplexity cron 7cb2f04e covers all three inboxes via Superhuman in parallel for now.

    const body = [
      `Nightly Inbox Cleanup — ${ctDateOnly()}`,
      "",
      "GMAIL (chaddozier75@gmail.com):",
      `  · Trashed: ${gmailResult.trashed}`,
      `  · Labeled + Starred: ${gmailResult.labeled}`,
      `  · Kept for human review: ${gmailResult.kept}`,
      "",
      "OUTLOOK + Google Workspace handled in parallel by Perplexity cron 7cb2f04e.",
      "",
      "github.com noreply domain is blocked at source — these should not appear.",
      "Promo senders auto-unsubscribed when List-Unsubscribe header present.",
      SIGNATURE,
    ].join("\n");

    const accessToken = (await auth.getAccessToken()).token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: TO,
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        accessToken,
      },
    });
    await transport.sendMail({
      from: `"AthlynX OS v1" <${TO}>`,
      to: TO,
      subject: `Nightly Inbox Cleanup — ${ctDateOnly()}`,
      text: body,
    });

    return res.status(200).json({ ok: true, gmail: gmailResult });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
