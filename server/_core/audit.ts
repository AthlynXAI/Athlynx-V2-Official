/**
 * Build 5 — Fort Knox · Audit logger
 *
 * Append-only writer for the audit_logs table.
 * Never blocks request flow — errors are logged, not thrown.
 *
 * Usage:
 *   await audit({
 *     ctx, action: "tier.update", targetType: "plan_tier",
 *     targetId: String(id), metadata: { before, after },
 *   });
 */

import type { Request } from "express";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

type Ctx = { req?: Request; user?: { id?: number | string; email?: string | null } | null };

export interface AuditEntry {
  ctx?: Ctx;
  action: string;
  targetType?: string;
  targetId?: string;
  status?: "ok" | "error" | "denied";
  metadata?: Record<string, unknown>;
}

function ipOf(req?: Request): string | null {
  if (!req) return null;
  const xff = (req.headers?.["x-forwarded-for"] as string | undefined) || "";
  const first = xff.split(",")[0]?.trim();
  return first || req.ip || null;
}

function uaOf(req?: Request): string | null {
  if (!req) return null;
  return (req.headers?.["user-agent"] as string | undefined) ?? null;
}

export async function audit(entry: AuditEntry): Promise<void> {
  const {
    ctx,
    action,
    targetType = null,
    targetId = null,
    status = "ok",
    metadata = {},
  } = entry;

  try {
    const db = await getDb();
    const userId = ctx?.user?.id != null ? Number(ctx.user.id) : null;
    const email = ctx?.user?.email ?? null;
    const ip = ipOf(ctx?.req);
    const ua = uaOf(ctx?.req);

    await db.execute(sql`
      INSERT INTO audit_logs (actor_user_id, actor_email, actor_ip, actor_ua,
                              action, target_type, target_id, status, metadata)
      VALUES (${userId}, ${email}, ${ip}, ${ua},
              ${action}, ${targetType}, ${targetId}, ${status}, ${JSON.stringify(metadata)}::jsonb)
    `);
  } catch (err) {
    // Never block the request — just log
    console.error("[audit] write failed:", (err as Error)?.message);
  }
}
