/**
 * Google Sheets logger — durable, idempotent build-history sink.
 *
 * Auth: GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON (full JSON of a GCP service-account
 * key) + GOOGLE_SHEETS_BUILD_LOG_ID (target spreadsheet ID). The sheet/tab is
 * `GOOGLE_SHEETS_BUILD_LOG_TAB` (default: "BuildHistory").
 *
 * Idempotency: each row is keyed by `buildId`. Before appending we read the
 * key column and skip if already present. This makes repeated polling /
 * crash-resume safe on Vercel without local disk state.
 *
 * If credentials are missing OR GOOGLE_SHEETS_DRY_RUN=1, calls become no-ops
 * that still echo the row back — useful in dev/CI/self-test.
 */

import { createSign } from "crypto";

export type BuildHistoryRow = {
  buildId: string;
  platform: string;
  status: string;
  appVersion?: string;
  appBuildVersion?: string;
  gitCommitHash?: string;
  createdAt: string;
  updatedAt: string;
  failureSummary?: string;
  count10091?: number;
  hasGradleExecuteError?: boolean;
  artifactUrl?: string;
};

const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function envOrEmpty(k: string): string {
  return (process.env[k] ?? "").trim();
}

export function sheetsIsDryRun(): boolean {
  if (envOrEmpty("GOOGLE_SHEETS_DRY_RUN") === "1") return true;
  if (!envOrEmpty("GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON")) return true;
  if (!envOrEmpty("GOOGLE_SHEETS_BUILD_LOG_ID")) return true;
  return false;
}

export function sheetsConfigSummary() {
  return {
    dryRun: sheetsIsDryRun(),
    hasCredentials: !!envOrEmpty("GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON"),
    hasSheetId: !!envOrEmpty("GOOGLE_SHEETS_BUILD_LOG_ID"),
    sheetId: envOrEmpty("GOOGLE_SHEETS_BUILD_LOG_ID") || null,
    tabName: envOrEmpty("GOOGLE_SHEETS_BUILD_LOG_TAB") || "BuildHistory",
  };
}

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

function loadServiceAccount(): ServiceAccount {
  const raw = envOrEmpty("GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON");
  if (!raw) throw new Error("GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON not set");
  // Allow either raw JSON or base64-encoded JSON for ease of pasting into Vercel.
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    json = JSON.parse(decoded);
  }
  if (!json.client_email || !json.private_key) {
    throw new Error("Service account JSON missing client_email or private_key");
  }
  // Newlines in private keys are commonly escaped when pasted into env UIs.
  json.private_key = String(json.private_key).replace(/\\n/g, "\n");
  return json;
}

function base64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(scope: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }
  const sa = loadServiceAccount();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: sa.client_email,
      scope,
      aud: sa.token_uri ?? TOKEN_URL,
      exp,
      iat,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  signer.end();
  const sig = base64Url(signer.sign(sa.private_key));
  const jwt = `${header}.${claim}.${sig}`;

  const res = await retryFetch(
    sa.token_uri ?? TOKEN_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    },
    3,
  );
  if (!res.ok) throw new Error(`token exchange ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function retryFetch(url: string, init: RequestInit, attempts: number): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, init);
      // Retry only on 5xx / 429 (rate limit).
      if (res.status >= 500 || res.status === 429) {
        lastErr = new Error(`status ${res.status}`);
      } else {
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 200 * Math.pow(2, i)));
  }
  throw lastErr instanceof Error ? lastErr : new Error("retryFetch failed");
}

const HEADER_ROW = [
  "buildId",
  "platform",
  "status",
  "appVersion",
  "appBuildVersion",
  "gitCommitHash",
  "createdAt",
  "updatedAt",
  "failureSummary",
  "count10091",
  "hasGradleExecuteError",
  "artifactUrl",
  "loggedAt",
];

function rowFromRecord(r: BuildHistoryRow): (string | number | boolean)[] {
  return [
    r.buildId,
    r.platform,
    r.status,
    r.appVersion ?? "",
    r.appBuildVersion ?? "",
    r.gitCommitHash ?? "",
    r.createdAt,
    r.updatedAt,
    r.failureSummary ?? "",
    r.count10091 ?? 0,
    r.hasGradleExecuteError ?? false,
    r.artifactUrl ?? "",
    new Date().toISOString(),
  ];
}

async function readExistingBuildIds(sheetId: string, tab: string, token: string): Promise<Set<string>> {
  const range = `${tab}!A:A`;
  const res = await retryFetch(
    `${SHEETS_API}/${sheetId}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${token}` } },
    3,
  );
  if (res.status === 400 || res.status === 404) return new Set();
  if (!res.ok) throw new Error(`read range ${res.status}`);
  const json = (await res.json()) as { values?: string[][] };
  const ids = new Set<string>();
  for (const row of json.values ?? []) {
    if (row[0] && row[0] !== "buildId") ids.add(row[0]);
  }
  return ids;
}

async function ensureHeader(sheetId: string, tab: string, token: string): Promise<void> {
  const range = `${tab}!A1:M1`;
  const res = await retryFetch(
    `${SHEETS_API}/${sheetId}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${token}` } },
    3,
  );
  if (res.ok) {
    const json = (await res.json()) as { values?: string[][] };
    if (json.values?.[0]?.[0] === "buildId") return;
  }
  await retryFetch(
    `${SHEETS_API}/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [HEADER_ROW] }),
    },
    3,
  );
}

export async function logBuildHistoryRows(rows: BuildHistoryRow[]): Promise<{
  appended: number;
  skipped: number;
  dryRun: boolean;
  rowsEcho: BuildHistoryRow[];
}> {
  if (rows.length === 0) {
    return { appended: 0, skipped: 0, dryRun: sheetsIsDryRun(), rowsEcho: [] };
  }
  if (sheetsIsDryRun()) {
    return { appended: 0, skipped: rows.length, dryRun: true, rowsEcho: rows };
  }

  const sheetId = envOrEmpty("GOOGLE_SHEETS_BUILD_LOG_ID");
  const tab = envOrEmpty("GOOGLE_SHEETS_BUILD_LOG_TAB") || "BuildHistory";
  const token = await getAccessToken("https://www.googleapis.com/auth/spreadsheets");

  await ensureHeader(sheetId, tab, token);
  const existing = await readExistingBuildIds(sheetId, tab, token);

  const fresh = rows.filter((r) => !existing.has(r.buildId));
  const skipped = rows.length - fresh.length;
  if (fresh.length === 0) {
    return { appended: 0, skipped, dryRun: false, rowsEcho: [] };
  }

  const range = `${tab}!A:M`;
  const body = { values: fresh.map(rowFromRecord) };
  const res = await retryFetch(
    `${SHEETS_API}/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    3,
  );
  if (!res.ok) throw new Error(`append ${res.status} ${await res.text()}`);
  return { appended: fresh.length, skipped, dryRun: false, rowsEcho: fresh };
}
