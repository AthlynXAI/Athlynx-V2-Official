/**
 * Build 5 — Live Rule Book router
 * Public reads. Admin writes (master admin only). Real-time updates, no redeploy.
 */
import { z } from "zod";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { isMasterAdmin } from "../_core/adminAllowlist";
import { audit } from "../_core/audit";

const severityEnum = z.enum(["critical", "high", "medium"]);

export const rulesRouter = router({
  list: publicProcedure.query(async () => {
    const db = await getDb();
    const rows = await db.execute(sql`
      SELECT id, slug, category, title, who, rule, athlynx_action,
             source_label, source_url, severity, sort_order,
             last_verified_at, verified_by, updated_at
      FROM rules
      WHERE is_active = TRUE
      ORDER BY category ASC, sort_order ASC, id ASC
    `);
    return (rows as any).rows ?? rows;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1).max(120),
        category: z.string().min(1).max(120),
        title: z.string().min(1).max(300),
        who: z.string().min(1),
        rule: z.string().min(1),
        athlynxAction: z.string().min(1),
        sourceLabel: z.string().min(1).max(200),
        sourceUrl: z.string().url(),
        severity: severityEnum.default("medium"),
        sortOrder: z.number().int().default(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      await db.execute(sql`
        INSERT INTO rules (slug, category, title, who, rule, athlynx_action,
                           source_label, source_url, severity, sort_order,
                           last_verified_at, verified_by, updated_at)
        VALUES (${input.slug}, ${input.category}, ${input.title}, ${input.who},
                ${input.rule}, ${input.athlynxAction}, ${input.sourceLabel},
                ${input.sourceUrl}, ${input.severity}, ${input.sortOrder},
                NOW(), ${ctx.user?.email ?? null}, NOW())
        ON CONFLICT (slug) DO UPDATE SET
          category = EXCLUDED.category,
          title = EXCLUDED.title,
          who = EXCLUDED.who,
          rule = EXCLUDED.rule,
          athlynx_action = EXCLUDED.athlynx_action,
          source_label = EXCLUDED.source_label,
          source_url = EXCLUDED.source_url,
          severity = EXCLUDED.severity,
          sort_order = EXCLUDED.sort_order,
          last_verified_at = NOW(),
          verified_by = EXCLUDED.verified_by,
          updated_at = NOW()
      `);
      await audit({ ctx, action: "rule.upsert", targetType: "rule", targetId: input.slug, metadata: { severity: input.severity } });
      return { ok: true };
    }),

  verify: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      await db.execute(sql`
        UPDATE rules SET last_verified_at = NOW(), verified_by = ${ctx.user?.email ?? null}
        WHERE slug = ${input.slug}
      `);
      await audit({ ctx, action: "rule.verify", targetType: "rule", targetId: input.slug });
      return { ok: true };
    }),

  toggle: protectedProcedure
    .input(z.object({ slug: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      await db.execute(sql`UPDATE rules SET is_active = ${input.isActive}, updated_at = NOW() WHERE slug = ${input.slug}`);
      await audit({ ctx, action: "rule.toggle", targetType: "rule", targetId: input.slug, metadata: { isActive: input.isActive } });
      return { ok: true };
    }),
});
