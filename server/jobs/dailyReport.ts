/**
 * Daily Profile Growth Report — AthlynXAI
 * Runs every day at 7:00 AM CT (12:00 UTC during CDT, 13:00 UTC during CST).
 * Voice (Manus handoff 2026-05-16): athlete-facing language, never "users" or "signups".
 * Reports profile claims and athlete profiles. Brand voice rule: claim your profile, not sign up.
 */
import { getDb } from "../db";
import { users, athleteProfiles, studioGraphics } from "../../drizzle/schema";
import { sql, gte, and, lt } from "drizzle-orm";
import { sendCustomEmail } from "../services/email";

// Canonical owner inboxes — daily digest fans out to all three.
const OWNER_EMAILS = [
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
  "cdozier@dozierholdingsgroup.com",
];

export async function sendDailyReport(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[DailyReport] Database not available — skipping");
      return;
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // Day-1 activation window: profiles created in the last 24h that opened
    // Studio Suite (any graphic created) within their first 24h. The wedge metric.
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const fortyEightHoursAgo = new Date(now);
    fortyEightHoursAgo.setHours(now.getHours() - 48);

    const [
      newAccountsTodayResult,
      totalAccountsResult,
      newAthleteProfilesTodayResult,
      totalAthleteProfilesResult,
      loginMethods,
      day1StudioOpensResult,
      returningWeekResult,
      signupCtaClicksResult,
      signupStartsResult,
      trackedProfileClaimsResult,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, yesterday)),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(athleteProfiles).where(gte(athleteProfiles.createdAt, yesterday)),
      db.select({ count: sql<number>`count(*)` }).from(athleteProfiles),
      db.select({ method: users.loginMethod, count: sql<number>`count(*)` })
        .from(users)
        .where(gte(users.createdAt, yesterday))
        .groupBy(users.loginMethod),
      // Profiles created in the last 48h that opened a Studio graphic within their first 24h.
      db.execute(sql`
        SELECT COUNT(DISTINCT u.id) AS count
        FROM users u
        JOIN studio_graphics sg ON sg."userId" = u.id
        WHERE u."createdAt" >= ${fortyEightHoursAgo.toISOString()}
          AND sg."createdAt" >= u."createdAt"
          AND sg."createdAt" <= u."createdAt" + INTERVAL '24 hours'
      `),
      // Profiles created 2-7 days ago that returned (opened Studio again after day 1).
      db.execute(sql`
        SELECT COUNT(DISTINCT u.id) AS count
        FROM users u
        JOIN studio_graphics sg ON sg."userId" = u.id
        WHERE u."createdAt" >= ${sevenDaysAgo.toISOString()}
          AND u."createdAt" < ${yesterday.toISOString()}
          AND sg."createdAt" > u."createdAt" + INTERVAL '24 hours'
      `),
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM activity_log
        WHERE "createdAt" >= ${yesterday.toISOString()}
          AND "eventType" = 'landing_signup_cta_click'
      `),
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM activity_log
        WHERE "createdAt" >= ${yesterday.toISOString()}
          AND "eventType" IN ('signup_started', 'signup_email_started', 'signup_social_started')
      `),
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM activity_log
        WHERE "createdAt" >= ${yesterday.toISOString()}
          AND "eventType" IN ('signup_completed', 'profile_created', 'profile_claim_completed')
      `),
    ]);

    const newAccountsToday = Number(newAccountsTodayResult[0]?.count ?? 0);
    const totalAccounts = Number(totalAccountsResult[0]?.count ?? 0);
    const newAthleteProfilesToday = Number(newAthleteProfilesTodayResult[0]?.count ?? 0);
    const totalAthleteProfiles = Number(totalAthleteProfilesResult[0]?.count ?? 0);
    const day1StudioOpens = Number(
      (day1StudioOpensResult as { rows?: Array<{ count: string | number }> })?.rows?.[0]?.count ?? 0,
    );
    const returningWeek = Number(
      (returningWeekResult as { rows?: Array<{ count: string | number }> })?.rows?.[0]?.count ?? 0,
    );
    const signupCtaClicks = Number(
      (signupCtaClicksResult as { rows?: Array<{ count: string | number }> })?.rows?.[0]?.count ?? 0,
    );
    const signupStarts = Number(
      (signupStartsResult as { rows?: Array<{ count: string | number }> })?.rows?.[0]?.count ?? 0,
    );
    const trackedProfileClaims = Number(
      (trackedProfileClaimsResult as { rows?: Array<{ count: string | number }> })?.rows?.[0]?.count ?? 0,
    );

    const dateStr = now.toLocaleDateString("en-US", {
      timeZone: "America/Chicago",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const methodRows = loginMethods.length > 0
      ? loginMethods.map((m: { method: string | null; count: number }) =>
          `<tr style="background:#0c1a32;">
            <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#94a3b8;font-size:13px;">${m.method ?? "unknown"}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${m.count}</td>
          </tr>`
        ).join("")
      : `<tr><td colspan="2" style="padding:10px 16px;color:#475569;text-align:center;font-size:13px;">No new profile claims today</td></tr>`;

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:28px 32px;">
  <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:3px;">AthlynXAI</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:5px;margin-top:4px;">DAILY PROFILE GROWTH REPORT</div>
</td></tr>
<tr><td style="padding:32px;">
  <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">${dateStr} &bull; Generated at <strong style="color:#fff;">${timeStr}</strong></p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td width="50%" style="text-align:center;padding:20px;background:#0a1628;border-radius:12px;">
        <div style="font-size:48px;font-weight:900;color:#00c2ff;">${newAthleteProfilesToday}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;letter-spacing:1px;">NEW ATHLETE PROFILES</div>
      </td>
      <td width="8px"></td>
      <td width="50%" style="text-align:center;padding:20px;background:#0a1628;border-radius:12px;">
        <div style="font-size:48px;font-weight:900;color:#0066ff;">${totalAthleteProfiles}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;letter-spacing:1px;">TOTAL ATHLETE PROFILES</div>
      </td>
    </tr>
  </table>
  ${newAccountsToday > 0 ? `
  <h3 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 12px;letter-spacing:2px;text-transform:uppercase;">Today's Profile Claims by Method</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #1e3a6e;margin-bottom:24px;">
    <tr style="background:#1e3a6e;">
      <td style="padding:10px 16px;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Method</td>
      <td style="padding:10px 16px;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;text-align:right;">Count</td>
    </tr>
    ${methodRows}
  </table>` : ''}
  <h3 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 12px;letter-spacing:2px;text-transform:uppercase;">Conversion &amp; Activation</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #1e3a6e;margin-bottom:24px;">
    <tr style="background:#1e3a6e;">
      <td style="padding:10px 16px;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Metric</td>
      <td style="padding:10px 16px;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;text-align:right;">Value</td>
    </tr>
    <tr style="background:#0c1a32;">
      <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#94a3b8;font-size:13px;">Landing → Signup CTA clicks</td>
      <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${signupCtaClicks}</td>
    </tr>
    <tr style="background:#0c1a32;">
      <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#94a3b8;font-size:13px;">Signup funnel: accounts → starts → completed/profile-created events</td>
      <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${newAccountsToday} → ${signupStarts} → ${trackedProfileClaims}</td>
    </tr>
    <tr style="background:#0c1a32;">
      <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#94a3b8;font-size:13px;">Day-1 Studio Suite opens (last 48h)</td>
      <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${day1StudioOpens}</td>
    </tr>
    <tr style="background:#0c1a32;">
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;">Returning profiles day 2–7</td>
      <td style="padding:10px 16px;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${returningWeek}</td>
    </tr>
  </table>
  <div style="text-align:center;padding:20px;background:#0a1628;border-radius:12px;margin-bottom:24px;">
    <a href="https://athlynx.ai/admin" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:1px;">VIEW GROWTH DASHBOARD</a>
  </div>
  <div style="background:#08142a;border:1px solid #1e3a6e;border-radius:10px;padding:12px;margin-bottom:18px;color:#94a3b8;font-size:12px;line-height:1.5;">
    <strong style="color:#fff;">Source-of-truth labels:</strong> ${totalAccounts} total accounts; ${totalAthleteProfiles} athlete profiles. Profile claims are tracked events and must not be confused with total users.
  </div>
  <p style="color:#475569;font-size:11px;text-align:center;margin:0;">AthlynXAI &bull; A Dozier Holdings Group Company &bull; Houston, TX</p>
  <p style="color:#475569;font-size:11px;text-align:center;margin:4px 0 0;">"Iron Sharpens Iron" — Proverbs 27:17</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    const subject = `AthlynXAI Daily Growth Report — ${newAthleteProfilesToday} new athlete profile${newAthleteProfilesToday !== 1 ? 's' : ''} today | ${totalAthleteProfiles} total profiles | ${totalAccounts} accounts`;
    const text = `AthlynXAI Daily Growth Report\n${dateStr}\n\nNew athlete profiles today: ${newAthleteProfilesToday}\nTotal athlete profiles: ${totalAthleteProfiles}\nTotal accounts: ${totalAccounts}\n\nConversion & Activation:\n  Landing → Signup CTA clicks: ${signupCtaClicks}\n  Signup funnel: accounts → starts → completed/profile-created events: ${newAccountsToday} → ${signupStarts} → ${trackedProfileClaims}\n  Day-1 Studio Suite opens (last 48h): ${day1StudioOpens}\n  Returning profiles day 2–7: ${returningWeek}\n\nSource-of-truth labels: accounts, athlete profiles, and profile-claim events are separate metrics.\n\nView growth dashboard: https://athlynx.ai/admin\n\nIron Sharpens Iron — Proverbs 27:17`;

    await Promise.all(
      OWNER_EMAILS.map((to) => sendCustomEmail(to, subject, html, text))
    );
    console.log(`[DailyReport] Sent to ${OWNER_EMAILS.length} addresses — ${newAthleteProfilesToday} new athlete profiles, ${totalAthleteProfiles} total athlete profiles, ${totalAccounts} total accounts`);
  } catch (err) {
    console.error("[DailyReport] Failed:", err);
  }
}
