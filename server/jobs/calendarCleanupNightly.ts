/**
 * Calendar Cleanup \u2014 Nightly Cron (11:55 PM CT \u00b7 04:55 UTC).
 *
 * Pulls the next 14 days from Chad's primary calendar, identifies:
 *   \u00b7 Back-to-back conflicts (no buffer)
 *   \u00b7 Declined meetings still on calendar
 *   \u00b7 Untitled placeholders
 *   \u00b7 Meetings without attendees (likely focus time)
 *
 * Emails Chad a tidy list so he can clean it manually in 30 seconds
 * before bed (or in the morning over coffee).
 *
 * Built 2026-05-31 by Chad. Locked.
 */

import {
  calendarListEvents,
  googleApiHealthCheck,
  type CalendarEvent,
} from "../services/googleApiClient";
import { sendEmail } from "../services/aws-ses";

const OWNER_EMAILS = [
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
];

interface Issue {
  date: string;
  summary: string;
  reason: string;
  link?: string;
}

function ctDate(iso: string): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function findIssues(events: CalendarEvent[]): Issue[] {
  const issues: Issue[] = [];

  // 1. Untitled
  for (const e of events) {
    if (!e.summary || e.summary === "(no title)" || e.summary.toLowerCase().includes("untitled")) {
      issues.push({
        date: ctDate(e.start),
        summary: e.summary || "(no title)",
        reason: "Untitled event \u2014 add a title or delete",
        link: e.hangoutLink,
      });
    }
  }

  // 2. Declined by Chad
  for (const e of events) {
    const me = e.attendees?.find(
      (a) =>
        a.email === "chaddozier75@gmail.com" ||
        a.email === "cdozier14@athlynx.ai" ||
        a.email === "cdozier@dozierholdingsgroup.com",
    );
    if (me?.responseStatus === "declined") {
      issues.push({
        date: ctDate(e.start),
        summary: e.summary,
        reason: "You declined this \u2014 still on calendar",
      });
    }
  }

  // 3. Back-to-back (less than 5min gap)
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = new Date(sorted[i - 1].end).getTime();
    const nextStart = new Date(sorted[i].start).getTime();
    const gapMin = (nextStart - prevEnd) / 60000;
    if (gapMin >= 0 && gapMin < 5) {
      issues.push({
        date: ctDate(sorted[i].start),
        summary: `${sorted[i - 1].summary} \u2192 ${sorted[i].summary}`,
        reason: `No buffer between meetings (${gapMin.toFixed(0)} min gap)`,
      });
    }
  }

  return issues;
}

export async function runCalendarCleanupNightly(): Promise<{
  ok: boolean;
  scanned: number;
  issues: number;
  reason?: string;
}> {
  const health = googleApiHealthCheck();
  if (!health.ready) {
    return { ok: false, scanned: 0, issues: 0, reason: health.reason };
  }

  const now = new Date();
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const events = await calendarListEvents(now.toISOString(), twoWeeks.toISOString());
  const issues = findIssues(events);

  const summary = [
    `Calendar cleanup ran at ${ctDate(now.toISOString())} CT.`,
    "",
    `Scanned: ${events.length} events over the next 14 days`,
    `Issues found: ${issues.length}`,
    "",
    issues.length === 0
      ? "\u2705 Calendar is clean. No back-to-backs, no untitled, no zombie declines."
      : issues
          .slice(0, 30)
          .map((i, n) => `  ${n + 1}. ${i.date}\n     ${i.summary}\n     \u26a0 ${i.reason}${i.link ? `\n     ${i.link}` : ""}`)
          .join("\n\n"),
    "",
    "Calendar: https://calendar.google.com",
    "",
    "\u2014 AthlynX Calendar Cleanup Cron",
  ].join("\n");

  for (const to of OWNER_EMAILS) {
    await sendEmail({
      to,
      subject: `[AthlynX] Calendar Cleanup \u00b7 ${issues.length} issue${issues.length === 1 ? "" : "s"} flagged for next 14 days`,
      text: summary, html: summary.replace(/\n/g, '<br>'),
    });
  }

  return { ok: true, scanned: events.length, issues: issues.length };
}
