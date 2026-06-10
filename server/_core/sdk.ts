/**
 * SDK Server — AthlynX
 * Session-cookie based authentication. Firebase Auth replaces Auth0/Okta.
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify, decodeJwt } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

// ─── Types ──────────────────────────────────────────────────────────────────
export type GetUserInfoWithJwtResponse = {
  openId: string;
  name?: string;
  email?: string;
  loginMethod?: string | null;
  platform?: string | null;
};

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

// ─── Utility ─────────────────────────────────────────────────────────────────
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

// ─── SDKServer ────────────────────────────────────────────────────────────────
class SDKServer {
  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) return new Map<string, string>();
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) throw new Error("JWT_SECRET not configured");
    return new TextEncoder().encode(secret);
  }

  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      { openId, appId: ENV.appId, name: options.name || "athlete" },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();
    return new SignJWT({ openId: payload.openId, appId: payload.appId, name: payload.name })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(cookieValue: string | undefined): Promise<SessionPayload | null> {
    if (!cookieValue) return null;
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, { algorithms: ["HS256"] });
      const { openId, appId, name } = payload as Record<string, unknown>;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return { openId, appId, name: typeof name === "string" ? name : "" };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) throw ForbiddenError("Invalid session cookie");

    const user = await db.getUserByOpenId(session.openId);
    if (!user) {
      console.warn(`[Auth] User ${session.openId} not found — please sign in again`);
      throw ForbiddenError("User not found — please sign in again");
    }
    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
    return user;
  }

  async getUserInfoWithJwt(jwtToken: string): Promise<GetUserInfoWithJwtResponse> {
    try {
      const decoded = decodeJwt(jwtToken);
      const openId = decoded.openId as string;
      if (openId) {
        const user = await db.getUserByOpenId(openId);
        if (user) {
          return {
            openId: user.openId,
            name: user.name ?? undefined,
            email: user.email ?? undefined,
            loginMethod: user.loginMethod ?? null,
            platform: user.loginMethod ?? null,
          };
        }
      }
    } catch {
      // Not our JWT
    }
    throw new Error("Unable to resolve user from JWT token");
  }
}

export const sdk = new SDKServer();
