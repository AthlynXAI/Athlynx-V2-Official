// Build 51 — /api/auth/me audit logger
// Non-blocking, fire-and-forget writes to auth_me_events. Never throws into the
// request path. Never persists raw cookies, headers, or tokens — only sanitized
// flags + a one-way SHA-256 hash of the session id.
//
// Auth provider detection is heuristic based on cookie/header signatures so the
// same /api/auth/me endpoint can serve Supabase, NextAuth, Clerk, and our own
// custom JWT clients. Token state is classified by inspecting JWT structure WITHOUT
// signature verification — only exp/nbf time fields are read from the raw payload.
// Identity and access decisions are always made by sdk.authenticateRequest with full
// signature verification.

import type { Request } from "express";
import { createHash } from "node:crypto";
import { decodeProtectedHeader, base64url } from "jose";

export type AuthProvider =
  | "supabase"
  | "nextauth"
  | "clerk"
  | "custom_jwt"
  | "none"
  | "unknown";

export type TokenState =
  | "missing"
  | "malformed"
  | "expired"
  | "invalid"
  | "valid"
  | "unknown";

export interface AuthMeAuditInput {
  status: 200 | 401;
  userId?: number | null;
  userEmail?: string | null;
  failureReason?: string | null;
  isLogoutMarker?: boolean;
  metadata?: Record<string, unknown>;
}

const APP_SESSION_COOKIE = "app_session_id";

function parseCookies(header: string | undefined): Map<string, string> {
  const out = new Map<string, string>();
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (k) out.set(k, decodeURIComponent(v));
  }
  return out;
}

function sha256Prefix(input: string | undefined): string | null {
  if (!input) return null;
  return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

function pickSessionId(req: Request, cookies: Map<string, string>): string | null {
  // Prefer our own app session cookie. Fall back to known third-party session
  // cookies so the dashboard can still group requests by session even when the
  // caller authenticates through Supabase / NextAuth / Clerk.
  const candidates = [
    cookies.get(APP_SESSION_COOKIE),
    cookies.get("sb-access-token"),
    cookies.get("sb:token"),
    cookies.get("next-auth.session-token"),
    cookies.get("__Secure-next-auth.session-token"),
    cookies.get("__session"), // Clerk
    typeof req.headers["authorization"] === "string"
      ? (req.headers["authorization"] as string).replace(/^Bearer\s+/i, "")
      : undefined,
  ];
  for (const c of candidates) {
    if (c) return sha256Prefix(c);
  }
  return null;
}

export function detectAuthProvider(req: Request): AuthProvider {
  const cookies = parseCookies(req.headers.cookie);
  const auth = (req.headers["authorization"] as string | undefined) ?? "";

  // Supabase
  for (const name of Array.from(cookies.keys())) {
    if (name.startsWith("sb-") && (name.endsWith("-auth-token") || name === "sb-access-token" || name === "sb:token")) {
      return "supabase";
    }
  }
  // NextAuth / Auth.js
  if (cookies.has("next-auth.session-token") || cookies.has("__Secure-next-auth.session-token")) {
    return "nextauth";
  }
  // Clerk
  if (cookies.has("__session") && (cookies.has("__client_uat") || cookies.has("__clerk_db_jwt"))) {
    return "clerk";
  }
  // Custom JWT: our own app_session_id cookie OR a Bearer token that decodes as JWT
  if (cookies.has(APP_SESSION_COOKIE)) return "custom_jwt";
  if (/^Bearer\s+[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/i.test(auth)) return "custom_jwt";

  if (!req.headers.cookie && !auth) return "none";
  return "unknown";
}

export function classifyTokenState(req: Request): { state: TokenState; reason: string | null } {
  const cookies = parseCookies(req.headers.cookie);
  const auth = (req.headers["authorization"] as string | undefined) ?? "";

  // Pick the most likely token to inspect — Bearer first, then our session
  // cookie, then provider-specific.
  let token: string | undefined;
  const bearer = /^Bearer\s+(.+)$/i.exec(auth);
  if (bearer) token = bearer[1];
  token ||= cookies.get(APP_SESSION_COOKIE);
  token ||= cookies.get("sb-access-token");
  token ||= cookies.get("next-auth.session-token") || cookies.get("__Secure-next-auth.session-token");
  token ||= cookies.get("__session");

  if (!token) {
    return { state: "missing", reason: "no_session_cookie_or_bearer" };
  }

  // Quick JWT shape check
  const parts = token.split(".");
  if (parts.length !== 3) {
    // Opaque session tokens (e.g. NextAuth database sessions) are not JWTs.
    // We can't classify them without verifying server-side, so report unknown.
    return { state: "unknown", reason: "opaque_or_non_jwt_token" };
  }

  // SECURITY: Only inspect header algorithm for shape-check (Aikido High fix).
  // decodeProtectedHeader does NOT verify the signature — used only to detect
  // malformed tokens, never to make auth decisions.
  let alg: string | undefined;
  try {
    const header = decodeProtectedHeader(token);
    alg = header.alg;
  } catch {
    return { state: "malformed", reason: "jwt_header_malformed" };
  }

  // SECURITY: Parse claims from payload segment only for exp/nbf time checks.
  // We never trust these claims for identity or access decisions — that is
  // handled exclusively by sdk.authenticateRequest with signature verification.
  let exp: number | null = null;
  let nbf: number | null = null;
  try {
    const payloadB64 = token.split(".")[1];
    const payloadJson = new TextDecoder().decode(base64url.decode(payloadB64));
    const raw = JSON.parse(payloadJson) as Record<string, unknown>;
    exp = typeof raw.exp === "number" ? raw.exp : null;
    nbf = typeof raw.nbf === "number" ? raw.nbf : null;
  } catch {
    return { state: "malformed", reason: "jwt_payload_malformed" };
  }

  const now = Math.floor(Date.now() / 1000);
  if (exp !== null && exp < now) return { state: "expired", reason: "jwt_exp_in_past" };
  if (nbf !== null && nbf > now) return { state: "invalid", reason: "jwt_nbf_in_future" };

  // Signature verification is performed by sdk.authenticateRequest in the
  // route handler. If the handler returns 200, collectAndWrite marks this valid.
  void alg; // used only for header shape check above
  return { state: "valid", reason: null };
}

export interface AuthMeAuditContext {
  sessionId: string | null;
  ip: string | null;
  userAgent: string | null;
  authProvider: AuthProvider;
  tokenState: TokenState;
  tokenStateReason: string | null;
  headersPresent: Record<string, boolean>;
  origin: string | null;
  referer: string | null;
}

export function buildContext(req: Request): AuthMeAuditContext {
  const cookies = parseCookies(req.headers.cookie);
  const authProvider = detectAuthProvider(req);
  const tokenClass = classifyTokenState(req);
  const headersPresent = {
    authorization: !!req.headers["authorization"],
    cookie: !!req.headers.cookie,
    x_forwarded_for: !!req.headers["x-forwarded-for"],
    origin: !!req.headers.origin,
    referer: !!req.headers.referer,
    sb_access_token: cookies.has("sb-access-token") || Array.from(cookies.keys()).some((k) => k.startsWith("sb-")),
    next_auth_session: cookies.has("next-auth.session-token") || cookies.has("__Secure-next-auth.session-token"),
    clerk_session: cookies.has("__session"),
    app_session_id: cookies.has(APP_SESSION_COOKIE),
  };

  return {
    sessionId: pickSessionId(req, cookies),
    ip: (req.ip ?? (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ?? null) || null,
    userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
    authProvider,
    tokenState: tokenClass.state,
    tokenStateReason: tokenClass.reason,
    headersPresent,
    origin: (req.headers.origin as string | undefined) ?? null,
    referer: (req.headers.referer as string | undefined) ?? null,
  };
}

/**
 * Fire-and-forget write to auth_me_events. Never throws.
 * If the DB is unavailable, the call silently no-ops and logs to console
 * so the request path is never blocked.
 */
export async function writeAuthMeEvent(req: Request, input: AuthMeAuditInput): Promise<void> {
  try {
    const { getDb } = await import("../db");
    const db = await getDb();
    if (!db) return;
    const { authMeEvents } = await import("../../drizzle/schema");
    const ctx = buildContext(req);
    const finalState =
      input.status === 200 && ctx.tokenState !== "missing" && ctx.tokenState !== "expired"
        ? "valid"
        : ctx.tokenState;

    await db.insert(authMeEvents).values({
      status: input.status,
      route: "/api/auth/me",
      sessionId: ctx.sessionId,
      userId: input.userId ?? null,
      userEmail: input.userEmail ?? null,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      authProvider: ctx.authProvider,
      tokenState: finalState,
      failureReason: input.failureReason ?? ctx.tokenStateReason ?? null,
      headersPresent: ctx.headersPresent,
      origin: ctx.origin,
      referer: ctx.referer,
      isLogoutMarker: input.isLogoutMarker ?? false,
      metadata: input.metadata ?? {},
    });
  } catch (err) {
    // Never let audit logging break the request path
    console.warn("[authAuditLog] write failed:", String(err));
  }
}
