// Build 51 — Admin audit API powering /admin/audit/auth-me dashboard.
//
// All endpoints are admin-only. The session cookie is verified via
// sdk.authenticateRequest and the user's role must be "admin".
//
// Endpoints:
//   GET /api/admin/audit/auth-me/summary?window=30d
//   GET /api/admin/audit/auth-me/timeseries?window=30d&bucket=hour
//   GET /api/admin/audit/auth-me/groups?window=30d&by=session|ua|ip|provider
//   GET /api/admin/audit/auth-me/flagged?window=30d
//
// Each endpoint reads from auth_me_events. The "flagged" endpoint detects
// sessions that transition from 200 → 401 without an intervening
// is_logout_marker row, and labels the most likely root cause from the
// 401 row's token_state / failure_reason / headers_present.

import type { Express, Request, Response } from "express";
import { sdk } from "../_core/sdk";

const WINDOW_MS: Record<string, number> = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

function parseWindow(req: Request): { since: Date; label: string } {
  const w = String(req.query.window ?? "30d").toLowerCase();
  const ms = WINDOW_MS[w] ?? WINDOW_MS["30d"];
  return { since: new Date(Date.now() - ms), label: w in WINDOW_MS ? w : "30d" };
}

async function requireAdmin(req: Request, res: Response): Promise<{ id: number; role: string } | null> {
  try {
    const user = await sdk.authenticateRequest(req);
    if ((user.role ?? "user") !== "admin") {
      res.status(403).json({ error: "admin_required" });
      return null;
    }
    return { id: user.id, role: user.role ?? "user" };
  } catch {
    res.status(401).json({ error: "unauthenticated" });
    return null;
  }
}

async function getPool() {
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) return null;
  // Drizzle drizzle(pg-pool) exposes the underlying pool via `db.session.client` in some versions;
  // safer to use a fresh query through drizzle's `execute` with raw SQL.
  return db;
}

function classifyRootCause(row: any): string {
  const ts = String(row.token_state ?? "");
  const fr = String(row.failure_reason ?? "");
  const hp = (row.headers_present ?? {}) as Record<string, boolean>;
  if (ts === "expired" || /exp_in_past/i.test(fr)) return "expired_token";
  if (ts === "missing" || /no_session_cookie_or_bearer/i.test(fr)) {
    if (hp.authorization === false && hp.cookie === false) return "no_credentials_sent";
    if (hp.cookie === false && hp.authorization === true) return "missing_session_cookie";
    return "missing_credentials";
  }
  if (ts === "malformed" || /malformed/i.test(fr)) return "malformed_token";
  if (ts === "invalid" || /nbf_in_future|invalid/i.test(fr)) return "invalid_token";
  if (hp.origin === false || hp.x_forwarded_for === false) return "header_misconfiguration";
  return "unclassified";
}

export function registerAuthMeAuditRoutes(app: Express) {
  // ───────────── SUMMARY ─────────────
  app.get("/api/admin/audit/auth-me/summary", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { since, label } = parseWindow(req);
      const db = await getPool();
      if (!db) return res.status(503).json({ error: "db_unavailable" });
      const result = await db.execute(
        `SELECT
           COUNT(*)::int                                              AS total,
           SUM(CASE WHEN status = 200 THEN 1 ELSE 0 END)::int         AS ok_count,
           SUM(CASE WHEN status = 401 THEN 1 ELSE 0 END)::int         AS unauth_count,
           COUNT(DISTINCT session_id)                                 AS sessions,
           COUNT(DISTINCT ip)                                         AS unique_ips,
           COUNT(DISTINCT user_agent)                                 AS unique_uas
         FROM auth_me_events
         WHERE occurred_at >= $1
           AND is_logout_marker = FALSE`,
        [since.toISOString()]
      );
      const row = (result.rows ?? result)[0] ?? {};
      res.json({ window: label, since: since.toISOString(), ...row });
    } catch (err) {
      res.status(500).json({ error: "summary_failed", detail: String(err) });
    }
  });

  // ───────────── TIME SERIES ─────────────
  app.get("/api/admin/audit/auth-me/timeseries", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { since, label } = parseWindow(req);
      const bucketIn = String(req.query.bucket ?? (label === "1h" || label === "24h" ? "hour" : "day"));
      const bucket = bucketIn === "minute" ? "minute" : bucketIn === "hour" ? "hour" : "day";
      const db = await getPool();
      if (!db) return res.status(503).json({ error: "db_unavailable" });
      const result = await db.execute(
        `SELECT date_trunc($2, occurred_at) AS bucket,
                SUM(CASE WHEN status = 200 THEN 1 ELSE 0 END)::int AS ok_count,
                SUM(CASE WHEN status = 401 THEN 1 ELSE 0 END)::int AS unauth_count
         FROM auth_me_events
         WHERE occurred_at >= $1
           AND is_logout_marker = FALSE
         GROUP BY 1
         ORDER BY 1 ASC`,
        [since.toISOString(), bucket]
      );
      const rows = (result.rows ?? result) as any[];
      res.json({
        window: label,
        bucket,
        points: rows.map((r) => ({
          t: new Date(r.bucket).toISOString(),
          ok: Number(r.ok_count ?? 0),
          unauth: Number(r.unauth_count ?? 0),
        })),
      });
    } catch (err) {
      res.status(500).json({ error: "timeseries_failed", detail: String(err) });
    }
  });

  // ───────────── GROUPINGS ─────────────
  app.get("/api/admin/audit/auth-me/groups", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { since, label } = parseWindow(req);
      const by = String(req.query.by ?? "session");
      const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "50"), 10) || 50, 1), 500);
      const col =
        by === "ua"       ? "user_agent" :
        by === "ip"       ? "ip" :
        by === "provider" ? "auth_provider" :
                            "session_id";
      const db = await getPool();
      if (!db) return res.status(503).json({ error: "db_unavailable" });
      const result = await db.execute(
        `SELECT ${col} AS key,
                COUNT(*)::int                                       AS total,
                SUM(CASE WHEN status = 401 THEN 1 ELSE 0 END)::int  AS unauth_count,
                SUM(CASE WHEN status = 200 THEN 1 ELSE 0 END)::int  AS ok_count,
                MAX(occurred_at)                                    AS last_seen,
                MIN(occurred_at)                                    AS first_seen
         FROM auth_me_events
         WHERE occurred_at >= $1
           AND is_logout_marker = FALSE
           AND ${col} IS NOT NULL
         GROUP BY ${col}
         HAVING SUM(CASE WHEN status = 401 THEN 1 ELSE 0 END) > 0
         ORDER BY unauth_count DESC, total DESC
         LIMIT ${limit}`,
        [since.toISOString()]
      );
      const rows = (result.rows ?? result) as any[];
      res.json({
        window: label,
        by,
        groups: rows.map((r) => ({
          key: r.key,
          total: Number(r.total ?? 0),
          unauth: Number(r.unauth_count ?? 0),
          ok: Number(r.ok_count ?? 0),
          firstSeen: r.first_seen ? new Date(r.first_seen).toISOString() : null,
          lastSeen: r.last_seen ? new Date(r.last_seen).toISOString() : null,
        })),
      });
    } catch (err) {
      res.status(500).json({ error: "groups_failed", detail: String(err) });
    }
  });

  // ───────────── FLAGGED: 200 → 401 without a logout ─────────────
  app.get("/api/admin/audit/auth-me/flagged", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const { since, label } = parseWindow(req);
      const db = await getPool();
      if (!db) return res.status(503).json({ error: "db_unavailable" });

      // Window function: for every row, find the previous status for the same
      // session, and whether a logout marker happened between them. Surface
      // sessions where prev_status=200 and curr_status=401 with no logout in
      // between. We then attach the 401's classification details.
      const result = await db.execute(
        `WITH timeline AS (
           SELECT
             id, session_id, status, occurred_at, ip, user_agent, auth_provider,
             token_state, failure_reason, headers_present, is_logout_marker, user_email,
             LAG(status)        OVER (PARTITION BY session_id ORDER BY occurred_at) AS prev_status,
             LAG(occurred_at)   OVER (PARTITION BY session_id ORDER BY occurred_at) AS prev_at
           FROM auth_me_events
           WHERE occurred_at >= $1
             AND session_id IS NOT NULL
         ),
         transitions AS (
           SELECT * FROM timeline
           WHERE prev_status = 200 AND status = 401
         ),
         with_logout AS (
           SELECT t.*,
                  EXISTS (
                    SELECT 1 FROM auth_me_events l
                    WHERE l.session_id = t.session_id
                      AND l.is_logout_marker = TRUE
                      AND l.occurred_at > t.prev_at
                      AND l.occurred_at < t.occurred_at
                  ) AS had_logout
           FROM transitions t
         )
         SELECT * FROM with_logout
         WHERE had_logout = FALSE
         ORDER BY occurred_at DESC
         LIMIT 250`,
        [since.toISOString()]
      );
      const rows = (result.rows ?? result) as any[];
      res.json({
        window: label,
        flagged: rows.map((r) => ({
          sessionId: r.session_id,
          transitionAt: new Date(r.occurred_at).toISOString(),
          prevSeenAt: r.prev_at ? new Date(r.prev_at).toISOString() : null,
          ip: r.ip,
          userAgent: r.user_agent,
          authProvider: r.auth_provider,
          tokenState: r.token_state,
          failureReason: r.failure_reason,
          headersPresent: r.headers_present,
          userEmail: r.user_email,
          rootCause: classifyRootCause(r),
        })),
      });
    } catch (err) {
      res.status(500).json({ error: "flagged_failed", detail: String(err) });
    }
  });
}
