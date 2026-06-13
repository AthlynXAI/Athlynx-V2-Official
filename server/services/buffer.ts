// Buffer (publish.buffer.com) scheduling wrapper — Build 1.
// Uses BUFFER_ACCESS_TOKEN (legacy v1 API token).
// API ref: https://buffer.com/developers/api/updates (legacy v1) — to be migrated to Publish API once partner-onboarded.

const BUFFER_API_BASE = "https://api.bufferapp.com/1";

export async function schedulePost(
  profileIds: string[],
  text: string,
  imageUrl?: string
): Promise<{ ok: boolean; status?: number; body?: unknown }> {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) throw new Error("BUFFER_ACCESS_TOKEN is not configured");
  if (profileIds.length === 0) throw new Error("schedulePost requires at least one profile id");

  const form = new URLSearchParams();
  for (const id of profileIds) form.append("profile_ids[]", id);
  form.append("text", text);
  if (imageUrl) form.append("media[photo]", imageUrl);

  const resp = await fetch(`${BUFFER_API_BASE}/updates/create.json?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  const body = await resp.json().catch(() => ({}));
  return { ok: resp.ok, status: resp.status, body };
}

// Telemetry: structured logs via console.error/warn captured by Vercel Log Drains.
// Upgrade path: wire Sentry SDK (server/services/sentry.ts) in Build 2 observability sprint.
