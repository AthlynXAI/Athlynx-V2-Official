// Auth0 Management API wrapper — Build 1.
// Lazy token fetch via client_credentials grant. Token cached in memory.

let cachedToken: { token: string; expiresAt: number } | null = null;

function envOrThrow(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is not configured`);
  return v;
}

async function getMgmtToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.token;

  const domain = envOrThrow("AUTH0_DOMAIN");
  const clientId = envOrThrow("AUTH0_M2M_CLIENT_ID");
  const clientSecret = envOrThrow("AUTH0_M2M_CLIENT_SECRET");
  const audience = process.env.AUTH0_M2M_AUDIENCE || `https://${domain}/api/v2/`;

  const resp = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      audience,
    }),
  });
  if (!resp.ok) throw new Error(`Auth0 token fetch failed: ${resp.status}`);
  const data: any = await resp.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: now + Number(data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

async function mgmtFetch(path: string, init: RequestInit = {}): Promise<any> {
  const token = await getMgmtToken();
  const domain = envOrThrow("AUTH0_DOMAIN");
  const resp = await fetch(`https://${domain}/api/v2${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!resp.ok) throw new Error(`Auth0 ${path} failed: ${resp.status}`);
  return resp.json();
}

export async function getUserByEmail(email: string): Promise<any[]> {
  return mgmtFetch(`/users-by-email?email=${encodeURIComponent(email)}`);
}

export async function linkSocialAccount(
  primaryUserId: string,
  secondary: { provider: string; user_id: string; connection_id?: string }
): Promise<any> {
  return mgmtFetch(`/users/${encodeURIComponent(primaryUserId)}/identities`, {
    method: "POST",
    body: JSON.stringify(secondary),
  });
}

// Telemetry: structured logs via console.error/warn captured by Vercel Log Drains.
// Upgrade path: wire Sentry SDK (server/services/sentry.ts) in Build 2 observability sprint.
