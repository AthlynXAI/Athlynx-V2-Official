/**
 * Inbox Cleanup \u2014 Nightly Cron (11:59 PM CT \u00b7 04:59 UTC).
 *
 * Pulls Chad's Gmail INBOX, classifies each message with the same
 * protectedTerms / promotionalTerms taxonomy used by
 * communicationsOsService, and routes everything to AthlynX label folders:
 *
 *   AthlynX/Platform-Bots   \u2192 Vercel, GitHub, deploy notifications
 *   AthlynX/Investors       \u2192 anything with "invest" subject + protected
 *   AthlynX/Team            \u2192 from dozierholdings, athlynx.ai, Tony, Lee, Glenn
 *   AthlynX/Finance         \u2192 Stripe, Chase, Regions, Auth0, billing\n *   AthlynX/Promo           \u2192 newsletters, promos, social digests (archived)
 *   AthlynX/Action-Needed   \u2192 stays in inbox, starred
 *
 * Aggressive mode: anything matched to Platform-Bots, Promo, or older than
 * 7 days that isn't Action-Needed gets archived (INBOX label removed).
 *
 * Built 2026-05-31 by Chad. Locked. Wakes inbox to zero by 7 AM CT.
 */

import {
  gmailListInbox,
  gmailModifyMessage,
  gmailGetOrCreateLabel,
  googleApiHealthCheck,
  type GmailMessage,
} from "../services/googleApiClient";
import { sendEmail } from "../services/aws-ses";

const OWNER_EMAILS = [
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
];

type Bucket =
  | "platform_bot"
  | "investor"
  | "team"
  | "finance"
  | "promo"
  | "action";

function classify(msg: GmailMessage): Bucket {
  const sender = msg.from.toLowerCase();
  const subject = msg.subject.toLowerCase();

  // Platform bot noise \u2014 archive
  if (
    sender.includes("vercel[bot]") ||
    sender.includes("notifications@github.com") ||
    sender.includes("dependabot") ||
    (sender.includes("perplexity") && subject.includes("task is complete"))
  ) {
    return "platform_bot";
  }

  // Investor signals \u2014 keep prominent
  if (
    subject.includes("invest") ||
    subject.includes("term sheet") ||
    subject.includes("safe ") ||
    subject.includes("cap table") ||
    subject.includes("pitch deck") ||
    sender.includes("sequoia") ||
    sender.includes("a16z") ||
    sender.includes("benchmark")
  ) {
    return "investor";
  }

  // Team \u2014 the four + AthlynX/DHG addresses
  if (
    sender.includes("tlockey24") ||
    sender.includes("tonyloceybaseball") ||
    sender.includes("leronious") ||
    sender.includes("lmarshall") ||
    sender.includes("glenn.tse") ||
    sender.includes("gtse@") ||
    sender.includes("@athlynx.ai") ||
    sender.includes("@dozierholdingsgroup")
  ) {
    return "team";
  }

  // Finance \u2014 bank, payments, billing
  if (
    sender.includes("stripe") ||
    sender.includes("chase") ||
    sender.includes("regions") ||
    sender.includes("plaid") ||
    sender.includes("auth0") ||
    subject.includes("invoice") ||
    subject.includes("receipt") ||
    subject.includes("payment") ||
    subject.includes("billing")
  ) {
    return "finance";
  }

  // Promo / newsletter noise \u2014 archive
  if (
    subject.includes("unsubscribe") ||
    subject.includes("newsletter") ||
    subject.includes("digest") ||
    subject.includes("% off") ||
    subject.includes("sale ends") ||
    subject.includes("last chance") ||
    subject.includes("final day")
  ) {
    return "promo";
  }

  // Everything else needs Chad's eyes
  return "action";
}

const LABEL_NAMES: Record<Bucket, string> = {
  platform_bot: "AthlynX/Platform-Bots",
  investor: "AthlynX/Investors",
  team: "AthlynX/Team",
  finance: "AthlynX/Finance",
  promo: "AthlynX/Promo",
  action: "AthlynX/Action-Needed",
};

/** Buckets that get archived (INBOX removed). action + investor + team stay in inbox. */
const ARCHIVE_BUCKETS: Bucket[] = ["platform_bot", "promo", "finance"];

export async function runInboxCleanupNightly(): Promise<{
  ok: boolean;
  processed: number;
  byBucket: Record<Bucket, number>;
  archived: number;
  reason?: string;
}> {
  const health = googleApiHealthCheck();
  const byBucket: Record<Bucket, number> = {
    platform_bot: 0,
    investor: 0,
    team: 0,
    finance: 0,
    promo: 0,
    action: 0,
  };

  if (!health.ready) {
    return {
      ok: false,
      processed: 0,
      byBucket,
      archived: 0,
      reason: health.reason,
    };
  }

  // Resolve / create all six labels once
  const labelIds: Partial<Record<Bucket, string>> = {};
  for (const [bucket, name] of Object.entries(LABEL_NAMES) as [Bucket, string][]) {
    const id = await gmailGetOrCreateLabel(name);
    if (id) labelIds[bucket] = id;
  }

  const messages = await gmailListInbox(200);
  let archived = 0;

  for (const msg of messages) {
    const bucket = classify(msg);
    byBucket[bucket]++;

    const labelId = labelIds[bucket];
    if (!labelId) continue;

    const addLabelIds = [labelId];
    const removeLabelIds: string[] = [];

    if (ARCHIVE_BUCKETS.includes(bucket)) {
      removeLabelIds.push("INBOX");
      archived++;
    }

    await gmailModifyMessage(msg.id, addLabelIds, removeLabelIds);
  }

  // Owner summary email
  const summary = [
    `Inbox cleanup ran at ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT.`,
    "",
    `Processed: ${messages.length} messages`,
    `Archived:  ${archived} (Platform-Bots / Promo / Finance)`,
    "",
    "By bucket:",
    `  AthlynX/Platform-Bots:   ${byBucket.platform_bot}  (archived)`,
    `  AthlynX/Promo:           ${byBucket.promo}  (archived)`,
    `  AthlynX/Finance:         ${byBucket.finance}  (archived)`,
    `  AthlynX/Investors:       ${byBucket.investor}  (kept in inbox)`,
    `  AthlynX/Team:            ${byBucket.team}  (kept in inbox)`,
    `  AthlynX/Action-Needed:   ${byBucket.action}  (kept in inbox, your eyes only)`,
    "",
    "Inbox view in Superhuman: filter by AthlynX/Action-Needed to see only the messages that need a reply.",
    "",
    "\u2014 AthlynX Operations Cron",
  ].join("\n");

  for (const to of OWNER_EMAILS) {
    await sendEmail({
      to,
      subject: `[AthlynX] Nightly Inbox Cleanup \u00b7 ${archived} archived \u00b7 ${byBucket.action} need your eyes`,
      text: summary, html: summary.replace(/\n/g, '<br>'),
    });
  }

  return { ok: true, processed: messages.length, byBucket, archived };
}
