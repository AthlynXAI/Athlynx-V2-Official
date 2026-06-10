/**
 * vendorRouter.ts
 * AthlynX Vendor Marketplace & CRM Vendor Module
 * Manages vendor partners, product catalog mirror, and deal pipeline.
 *
 * Author: manus-ai-bot@athlynx.ai
 * Date:   2026-06-06
 */

import { z } from "zod";
import { sql } from "drizzle-orm";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";

// ─── Constants ───────────────────────────────────────────────────────────────

const VENDOR_STATUSES = ["active", "paused", "pending", "ended"] as const;
const VENDOR_CATEGORIES = [
  "apparel",
  "equipment",
  "nutrition",
  "tech",
  "media",
  "other",
] as const;

const DEAL_STAGES = [
  "outreach",
  "negotiating",
  "contracted",
  "active",
  "paused",
  "ended",
] as const;

const DEAL_TYPES = [
  "marketplace",
  "exclusive",
  "co-brand",
  "sponsorship",
  "white-label",
] as const;

// ─── Router ──────────────────────────────────────────────────────────────────

export const vendorRouter = router({
  // ── List all vendor partners ──────────────────────────────────────────────
  listVendors: protectedProcedure
    .input(
      z.object({
        status: z.enum(VENDOR_STATUSES).optional(),
        category: z.enum(VENDOR_CATEGORIES).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.execute(sql`
        SELECT
          vp.*,
          COUNT(DISTINCT vd.id) FILTER (WHERE vd.stage = 'active') AS active_deals,
          COUNT(DISTINCT vprod.id) AS product_count
        FROM vendor_partners vp
        LEFT JOIN vendor_deals vd ON vd.vendor_id = vp.id
        LEFT JOIN vendor_products vprod ON vprod.vendor_id = vp.id
        WHERE
          (${input?.status ?? null}::text IS NULL OR vp.status = ${input?.status ?? null})
          AND (${input?.category ?? null}::text IS NULL OR vp.category = ${input?.category ?? null})
        GROUP BY vp.id
        ORDER BY vp.name ASC
      `);
      return (rows as any).rows ?? rows ?? [];
    }),

  // ── Get single vendor by slug ─────────────────────────────────────────────
  getVendor: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.execute(sql`
        SELECT * FROM vendor_partners WHERE slug = ${input.slug} LIMIT 1
      `);
      return ((rows as any).rows ?? rows ?? [])[0] ?? null;
    }),

  // ── Create or update a vendor partner ────────────────────────────────────
  upsertVendor: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1),
        slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
        category: z.enum(VENDOR_CATEGORIES).optional(),
        contactName: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        website: z.string().url().optional(),
        shopifyVendorTag: z.string().optional(),
        commissionPct: z.number().min(0).max(100).default(0),
        status: z.enum(VENDOR_STATUSES).default("active"),
        notes: z.string().optional(),
        logoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      if (input.id) {
        await db.execute(sql`
          UPDATE vendor_partners SET
            name               = ${input.name},
            slug               = ${input.slug},
            category           = ${input.category ?? null},
            contact_name       = ${input.contactName ?? null},
            contact_email      = ${input.contactEmail ?? null},
            contact_phone      = ${input.contactPhone ?? null},
            website            = ${input.website ?? null},
            shopify_vendor_tag = ${input.shopifyVendorTag ?? null},
            commission_pct     = ${input.commissionPct},
            status             = ${input.status},
            notes              = ${input.notes ?? null},
            logo_url           = ${input.logoUrl ?? null},
            updated_at         = now()
          WHERE id = ${input.id}
        `);
        return { ok: true, id: input.id };
      }

      const rows = await db.execute(sql`
        INSERT INTO vendor_partners
          (name, slug, category, contact_name, contact_email, contact_phone,
           website, shopify_vendor_tag, commission_pct, status, notes, logo_url)
        VALUES
          (${input.name}, ${input.slug}, ${input.category ?? null},
           ${input.contactName ?? null}, ${input.contactEmail ?? null},
           ${input.contactPhone ?? null}, ${input.website ?? null},
           ${input.shopifyVendorTag ?? null}, ${input.commissionPct},
           ${input.status}, ${input.notes ?? null}, ${input.logoUrl ?? null})
        ON CONFLICT (slug) DO UPDATE SET
          name               = EXCLUDED.name,
          updated_at         = now()
        RETURNING id
      `);
      return { ok: true, id: Number(((rows as any).rows ?? rows ?? [])[0]?.id) };
    }),

  // ── List vendor deals (pipeline) ─────────────────────────────────────────
  listVendorDeals: protectedProcedure
    .input(
      z.object({
        vendorId: z.number().optional(),
        stage: z.enum(DEAL_STAGES).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.execute(sql`
        SELECT vd.*, vp.name AS vendor_name, vp.slug AS vendor_slug, vp.logo_url
        FROM vendor_deals vd
        JOIN vendor_partners vp ON vp.id = vd.vendor_id
        WHERE
          (${input?.vendorId ?? null}::int IS NULL OR vd.vendor_id = ${input?.vendorId ?? null})
          AND (${input?.stage ?? null}::text IS NULL OR vd.stage = ${input?.stage ?? null})
        ORDER BY vd.updated_at DESC
      `);
      return (rows as any).rows ?? rows ?? [];
    }),

  // ── Create or update a vendor deal ───────────────────────────────────────
  upsertVendorDeal: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        vendorId: z.number(),
        name: z.string().min(1),
        stage: z.enum(DEAL_STAGES).default("outreach"),
        dealType: z.enum(DEAL_TYPES).default("marketplace"),
        amountCents: z.number().int().default(0),
        commissionPct: z.number().min(0).max(100).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const userId = Number(ctx.user.id);

      if (input.id) {
        await db.execute(sql`
          UPDATE vendor_deals SET
            vendor_id      = ${input.vendorId},
            name           = ${input.name},
            stage          = ${input.stage},
            deal_type      = ${input.dealType},
            amount_cents   = ${input.amountCents},
            commission_pct = ${input.commissionPct ?? null},
            start_date     = ${input.startDate ?? null},
            end_date       = ${input.endDate ?? null},
            notes          = ${input.notes ?? null},
            updated_at     = now()
          WHERE id = ${input.id}
        `);
        return { ok: true, id: input.id };
      }

      const rows = await db.execute(sql`
        INSERT INTO vendor_deals
          (vendor_id, name, stage, deal_type, amount_cents, commission_pct,
           start_date, end_date, notes, created_by)
        VALUES
          (${input.vendorId}, ${input.name}, ${input.stage}, ${input.dealType},
           ${input.amountCents}, ${input.commissionPct ?? null},
           ${input.startDate ?? null}, ${input.endDate ?? null},
           ${input.notes ?? null}, ${userId})
        RETURNING id
      `);
      return { ok: true, id: Number(((rows as any).rows ?? rows ?? [])[0]?.id) };
    }),

  // ── Sync a product from Shopify into vendor_products ─────────────────────
  syncVendorProduct: protectedProcedure
    .input(
      z.object({
        vendorId: z.number(),
        shopifyProductId: z.string(),
        title: z.string(),
        handle: z.string().optional(),
        priceCents: z.number().int().optional(),
        collection: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.execute(sql`
        INSERT INTO vendor_products
          (vendor_id, shopify_product_id, title, handle, price_cents, collection, tags, synced_at)
        VALUES
          (${input.vendorId}, ${input.shopifyProductId}, ${input.title},
           ${input.handle ?? null}, ${input.priceCents ?? null},
           ${input.collection ?? null}, ${JSON.stringify(input.tags ?? [])}::jsonb, now())
        ON CONFLICT (shopify_product_id) DO UPDATE SET
          title      = EXCLUDED.title,
          price_cents = EXCLUDED.price_cents,
          collection  = EXCLUDED.collection,
          tags        = EXCLUDED.tags,
          synced_at   = now()
      `);
      return { ok: true };
    }),

  // ── Vendor revenue summary ────────────────────────────────────────────────
  vendorRevenueSummary: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { vendors: [], totalActive: 0, totalDeals: 0 };
    const rows = await db.execute(sql`
      SELECT
        vp.id, vp.name, vp.slug, vp.category, vp.status, vp.commission_pct,
        COUNT(DISTINCT vd.id) AS total_deals,
        COUNT(DISTINCT vd.id) FILTER (WHERE vd.stage = 'active') AS active_deals,
        COALESCE(SUM(vd.amount_cents) FILTER (WHERE vd.stage = 'active'), 0) AS active_deal_value_cents,
        COUNT(DISTINCT vprod.id) AS product_count
      FROM vendor_partners vp
      LEFT JOIN vendor_deals vd ON vd.vendor_id = vp.id
      LEFT JOIN vendor_products vprod ON vprod.vendor_id = vp.id
      GROUP BY vp.id
      ORDER BY active_deal_value_cents DESC
    `);
    const vendors = (rows as any).rows ?? rows ?? [];
    return {
      vendors,
      totalActive: vendors.filter((v: any) => v.status === "active").length,
      totalDeals: vendors.reduce((acc: number, v: any) => acc + Number(v.total_deals ?? 0), 0),
    };
  }),
});
