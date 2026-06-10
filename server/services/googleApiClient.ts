/**
 * Server-side Google API client (Gmail + Calendar).
 *
 * Uses an OAuth refresh token stored in Vercel env vars to mint short-lived
 * access tokens for cron jobs that need to read/modify Chad's Gmail labels
 * and Google Calendar events.
 *
 * REQUIRED ENV VARS (set in Vercel \u2192 athlynx-platform \u2192 Settings \u2192 Environment Variables):
 *   GOOGLE_OAUTH_CLIENT_ID
 *   GOOGLE_OAUTH_CLIENT_SECRET
 *   GOOGLE_OAUTH_REFRESH_TOKEN     (chaddozier75@gmail.com, full Gmail + Calendar scope)
 *
 * If any are missing, all read/modify ops return safe no-ops and log a warning \u2014
 * the cron will email a setup-required notice instead of crashing.
 *
 * Built 2026-05-31 by Chad. Locked.
 */

interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

function getOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    console.warn(
      "[GoogleApiClient] Missing OAuth env vars \u2014 skipping Google API call. " +
        "Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN in Vercel.",
    );
    return null;
  }
  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(): Promise<string | null> {
  const cfg = getOAuthConfig();
  if (!cfg) return null;
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    refresh_token: cfg.refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    console.error("[GoogleApiClient] Token refresh failed:", res.status, await res.text());
    return null;
  }
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// GMAIL
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  from: string;
  subject: string;
  labelIds: string[];
}

export async function gmailListInbox(maxResults = 100): Promise<GmailMessage[]> {
  const token = await getAccessToken();
  if (!token) return [];
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=${maxResults}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!listRes.ok) {
    console.error("[Gmail] list failed:", listRes.status);
    return [];
  }
  const listJson = (await listRes.json()) as { messages?: { id: string; threadId: string }[] };
  const ids = listJson.messages ?? [];
  // Batch metadata fetch
  const messages: GmailMessage[] = [];
  for (const m of ids) {
    const r = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!r.ok) continue;
    const j = (await r.json()) as any;
    const headers: { name: string; value: string }[] = j.payload?.headers ?? [];
    messages.push({
      id: j.id,
      threadId: j.threadId,
      snippet: j.snippet ?? "",
      from: headers.find((h) => h.name === "From")?.value ?? "",
      subject: headers.find((h) => h.name === "Subject")?.value ?? "",
      labelIds: j.labelIds ?? [],
    });
  }
  return messages;
}

export async function gmailModifyMessage(
  messageId: string,
  addLabelIds: string[],
  removeLabelIds: string[],
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ addLabelIds, removeLabelIds }),
    },
  );
  return res.ok;
}

export async function gmailGetOrCreateLabel(name: string): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const listRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/labels", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (listRes.ok) {
    const j = (await listRes.json()) as { labels?: { id: string; name: string }[] };
    const existing = j.labels?.find((l) => l.name === name);
    if (existing) return existing.id;
  }
  const createRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/labels", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
    }),
  });
  if (!createRes.ok) return null;
  const created = (await createRes.json()) as { id: string };
  return created.id;
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// CALENDAR
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  attendees: { email: string; responseStatus?: string }[];
  location?: string;
  hangoutLink?: string;
  description?: string;
}

export async function calendarListEvents(
  timeMin: string,
  timeMax: string,
): Promise<CalendarEvent[]> {
  const token = await getAccessToken();
  if (!token) return [];
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "100",
  });
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) {
    console.error("[Calendar] list failed:", res.status);
    return [];
  }
  const j = (await res.json()) as { items?: any[] };
  return (j.items ?? []).map((e: any) => ({
    id: e.id,
    summary: e.summary ?? "(no title)",
    start: e.start?.dateTime ?? e.start?.date ?? "",
    end: e.end?.dateTime ?? e.end?.date ?? "",
    attendees: e.attendees ?? [],
    location: e.location,
    hangoutLink: e.hangoutLink,
    description: e.description,
  }));
}

export function googleApiHealthCheck(): { ready: boolean; reason?: string } {
  if (!getOAuthConfig()) {
    return {
      ready: false,
      reason:
        "Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN in Vercel env vars.",
    };
  }
  return { ready: true };
}
