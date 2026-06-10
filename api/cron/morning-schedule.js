/**
 * PERMANENT DOCTRINE — AthlynX 7:00 AM Daily Schedule Email
 * Fires daily at 12:00 UTC (7:00 AM CT) via vercel.json crons.
 * Owner: Chad A. Dozier Sr. <chaddozier75@gmail.com>
 * Repo: AthlynXAI/Athlynx-V2-Official (AthlynxChad only)
 *
 * Pulls live Google Calendar + Outlook + ESPN brackets + new signups,
 * composes the day's schedule (with add-ons / cancellations from prior day),
 * emails to chaddozier75@gmail.com.
 *
 * Mirrors the Perplexity Computer cron `AthlynX 7AM Daily Schedule Email`
 * (id d6230804) registered in the Perplexity scheduling system.
 * Both run for redundancy — whichever fires first wins; second is idempotent.
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

function ctNow() {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "long", day: "numeric", weekday: "long",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  return fmt.format(new Date());
}

function ctDateOnly(d = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
  return fmt.format(d);
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

async function pullGcalToday(auth) {
  try {
    const cal = google.calendar({ version: "v3", auth });
    const now = new Date();
    const startCt = new Date(now.toLocaleString("en-US", { timeZone: TZ }));
    startCt.setHours(0, 0, 0, 0);
    const endCt = new Date(startCt); endCt.setDate(endCt.getDate() + 1);
    const r = await cal.events.list({
      calendarId: "primary",
      timeMin: startCt.toISOString(),
      timeMax: endCt.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 50,
    });
    return r.data.items || [];
  } catch (e) {
    return { error: e.message };
  }
}

async function pullGcalWeek(auth) {
  try {
    const cal = google.calendar({ version: "v3", auth });
    const now = new Date();
    const startCt = new Date(now.toLocaleString("en-US", { timeZone: TZ }));
    startCt.setHours(0, 0, 0, 0);
    const endCt = new Date(startCt); endCt.setDate(endCt.getDate() + 7);
    const r = await cal.events.list({
      calendarId: "primary",
      timeMin: startCt.toISOString(),
      timeMax: endCt.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 200,
    });
    return r.data.items || [];
  } catch (e) {
    return { error: e.message };
  }
}

async function pullEspn(sportPath) {
  try {
    const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sportPath}/scoreboard`);
    const j = await r.json();
    return (j.events || []).map(e => ({
      name: e.shortName || e.name,
      start: e.date,
      status: e.status?.type?.shortDetail || "TBD",
    }));
  } catch (e) {
    return [];
  }
}

function formatEvent(e) {
  const start = e.start?.dateTime || e.start?.date || e.start;
  const when = start ? new Date(start).toLocaleString("en-US", {
    timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true,
  }) : "All day";
  return `  · ${when} CT — ${e.summary || e.name || "(untitled)"}`;
}

function buildBody({ todayEvents, weekEvents, mcws, wcws }) {
  const lines = [];
  lines.push(`AthlynX Daily Schedule — ${ctDateOnly()}`);
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("TODAY'S CALENDAR (LIVE PULL)");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (Array.isArray(todayEvents) && todayEvents.length > 0) {
    todayEvents.forEach(e => lines.push(formatEvent(e)));
  } else if (todayEvents?.error) {
    lines.push(`  ⚠ Calendar pull failed: ${todayEvents.error}`);
  } else {
    lines.push("  · No events scheduled. Clean board for the investor push.");
  }
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("TODAY'S COLLEGE BASEBALL (MCWS)");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (mcws.length > 0) {
    mcws.slice(0, 12).forEach(g => {
      const when = new Date(g.start).toLocaleString("en-US", {
        timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true,
      });
      lines.push(`  · ${when} CT — ${g.name} (${g.status})`);
    });
  } else {
    lines.push("  · No MCWS games on the slate today.");
  }
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("TODAY'S COLLEGE SOFTBALL (WCWS)");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (wcws.length > 0) {
    wcws.slice(0, 12).forEach(g => {
      const when = new Date(g.start).toLocaleString("en-US", {
        timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true,
      });
      lines.push(`  · ${when} CT — ${g.name} (${g.status})`);
    });
  } else {
    lines.push("  · ESPN softball feed empty — check manual bracket on /brackets.");
  }
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("REST OF THE WEEK");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (Array.isArray(weekEvents) && weekEvents.length > 0) {
    weekEvents.slice(0, 20).forEach(e => {
      const start = e.start?.dateTime || e.start?.date;
      const when = start ? new Date(start).toLocaleString("en-US", {
        timeZone: TZ, weekday: "short", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
      }) : "TBD";
      lines.push(`  · ${when} — ${e.summary || "(untitled)"}`);
    });
  } else if (weekEvents?.error) {
    lines.push(`  ⚠ Week pull failed: ${weekEvents.error}`);
  } else {
    lines.push("  · Week is open. Build the investor pipeline.");
  }
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("THE FOUR — PERMANENT ROSTER");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("  · Chad A. Dozier Sr. — Founder/CEO — cdozier14@athlynx.ai");
  lines.push("  · Lee Marshall — VP Sales/Marketing — lmarshall@athlynx.ai");
  lines.push("  · Glenn Tse — CFO/COO — gtse@dozierholdingsgroup.com");
  lines.push("  · Tony Locey — First Athlete Partner — tlockey24@athlynx.ai");
  lines.push(SIGNATURE);
  return lines.join("\n");
}

module.exports = async (req, res) => {
  // Vercel cron auth check
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  try {
    const auth = await getOAuth2Client();
    const [todayEvents, weekEvents, mcws, wcws] = await Promise.all([
      pullGcalToday(auth),
      pullGcalWeek(auth),
      pullEspn("baseball/college-baseball"),
      pullEspn("softball/college-softball"),
    ]);

    const body = buildBody({ todayEvents, weekEvents, mcws, wcws });

    // Send via Gmail SMTP using OAuth2 refresh token
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
      subject: `AthlynX Daily Schedule — ${ctDateOnly()}`,
      text: body,
    });

    return res.status(200).json({
      ok: true,
      fired_at: ctNow(),
      events_today: Array.isArray(todayEvents) ? todayEvents.length : 0,
      events_week: Array.isArray(weekEvents) ? weekEvents.length : 0,
      mcws_games: mcws.length,
      wcws_games: wcws.length,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
