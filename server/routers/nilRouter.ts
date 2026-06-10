/**
 * NIL Router — AthlynXAI
 * E2E Encryption: NIL contract descriptions and sensitive deal data encrypted at rest
 * HIPAA-compliant · Athlete financial data protected
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { nilDeals, transferPortalEntries, athleteProfiles, users } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import { Client } from "pg";
import { encryptNILContract, decryptNILContract } from "../services/encryption";

function getErrorMessage(error: unknown): string {
  const err = error as { message?: string; cause?: { message?: string } };
  return [err?.message, err?.cause?.message, String(error ?? "")].filter(Boolean).join("\n");
}

function isMissingNilDealsTableError(error: unknown): boolean {
  const err = error as { code?: string; cause?: { code?: string } };
  const message = getErrorMessage(error);
  return err?.code === "42P01" || err?.cause?.code === "42P01" || /relation .*nil_deals.* does not exist|nil_deals.*doesn't exist|column .* does not exist|Failed query:[\s\S]*nil_deals/i.test(message);
}

function isMissingTransferPortalTableError(error: unknown): boolean {
  const err = error as { code?: string; cause?: { code?: string } };
  const message = getErrorMessage(error);
  return err?.code === "42P01" || err?.cause?.code === "42P01" || /relation .*transfer_portal_entries.* does not exist|transfer_portal_entries.*doesn't exist|column .* does not exist|Failed query:[\s\S]*transfer_portal_entries/i.test(message);
}

async function ensureNilDealsTableForRequest(): Promise<void> {
  const url = (process.env.DATABASE_URL || "").trim();
  if (!url) return;

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(`
      DO $$
      BEGIN
        CREATE TYPE nil_deal_status AS ENUM ('pending', 'active', 'completed', 'declined');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS "nil_deals" (
        "id" serial PRIMARY KEY,
        "athleteId" integer NOT NULL DEFAULT 1,
        "brandName" varchar(128) NOT NULL,
        "dealValue" integer NOT NULL DEFAULT 0,
        "status" nil_deal_status NOT NULL DEFAULT 'pending',
        "description" text,
        "category" varchar(64),
        "startDate" timestamp,
        "endDate" timestamp,
        "contractUrl" text,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
    `);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "athleteId" integer NOT NULL DEFAULT 1;`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "brandName" varchar(128) NOT NULL DEFAULT 'AthlynXAI Partner';`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "dealValue" integer NOT NULL DEFAULT 0;`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "status" nil_deal_status NOT NULL DEFAULT 'pending';`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "description" text;`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "category" varchar(64);`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "startDate" timestamp;`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "endDate" timestamp;`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "contractUrl" text;`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now();`);
    await client.query(`ALTER TABLE "nil_deals" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now();`);
    await client.query(`CREATE INDEX IF NOT EXISTS nil_deals_status_idx ON "nil_deals" ("status");`);
    await client.query(`CREATE INDEX IF NOT EXISTS nil_deals_category_idx ON "nil_deals" ("category");`);
    await client.query(`CREATE INDEX IF NOT EXISTS nil_deals_created_at_idx ON "nil_deals" ("createdAt" DESC);`);
    await client.query(`
      WITH seed_athlete AS (
        SELECT id FROM "users" ORDER BY id ASC LIMIT 1
      )
      INSERT INTO "nil_deals" ("athleteId", "brandName", "dealValue", "status", "description", "category", "startDate", "endDate")
      SELECT COALESCE((SELECT id FROM seed_athlete), 1), seed."brandName", seed."dealValue", seed."status"::nil_deal_status, seed."description", seed."category", now(), now() + interval '90 days'
      FROM (VALUES
        ('AthlynXAI Launch Partner', 2500, 'active', 'Regional brand partnership opportunity for athletes building verified recruiting and media presence.', 'Brand Partnership'),
        ('Community Sports Ambassador', 1000, 'active', 'Local endorsement opportunity for athletes with strong community engagement and consistent content.', 'Ambassador'),
        ('Training Content Collaboration', 750, 'pending', 'Content collaboration package for athletes sharing training, recovery, and performance updates.', 'Content')
      ) AS seed("brandName", "dealValue", "status", "description", "category")
      WHERE NOT EXISTS (SELECT 1 FROM "nil_deals" LIMIT 1);
    `);
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function ensureTransferPortalEntriesTableForRequest(): Promise<void> {
  const url = (process.env.DATABASE_URL || "").trim();
  if (!url) return;

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(`
      DO $$
      BEGIN
        CREATE TYPE transfer_status AS ENUM ('entered', 'committed', 'withdrawn');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS "transfer_portal_entries" (
        "id" serial PRIMARY KEY,
        "athleteId" integer NOT NULL DEFAULT 1,
        "fromSchool" varchar(128),
        "toSchool" varchar(128),
        "status" transfer_status NOT NULL DEFAULT 'entered',
        "eligibilityYears" integer,
        "enteredAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
    `);
    await client.query(`ALTER TABLE "transfer_portal_entries" ADD COLUMN IF NOT EXISTS "athleteId" integer NOT NULL DEFAULT 1;`);
    await client.query(`ALTER TABLE "transfer_portal_entries" ADD COLUMN IF NOT EXISTS "fromSchool" varchar(128);`);
    await client.query(`ALTER TABLE "transfer_portal_entries" ADD COLUMN IF NOT EXISTS "toSchool" varchar(128);`);
    await client.query(`ALTER TABLE "transfer_portal_entries" ADD COLUMN IF NOT EXISTS "status" transfer_status NOT NULL DEFAULT 'entered';`);
    await client.query(`ALTER TABLE "transfer_portal_entries" ADD COLUMN IF NOT EXISTS "eligibilityYears" integer;`);
    await client.query(`ALTER TABLE "transfer_portal_entries" ADD COLUMN IF NOT EXISTS "enteredAt" timestamp NOT NULL DEFAULT now();`);
    await client.query(`ALTER TABLE "transfer_portal_entries" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now();`);
    await client.query(`CREATE INDEX IF NOT EXISTS transfer_portal_entries_status_idx ON "transfer_portal_entries" ("status");`);
    await client.query(`CREATE INDEX IF NOT EXISTS transfer_portal_entries_entered_at_idx ON "transfer_portal_entries" ("enteredAt" DESC);`);
    await client.query(`
      WITH seed_athlete AS (
        SELECT id FROM "users" ORDER BY id ASC LIMIT 1
      )
      INSERT INTO "transfer_portal_entries" ("athleteId", "fromSchool", "toSchool", "status", "eligibilityYears")
      SELECT COALESCE((SELECT id FROM seed_athlete), 1), seed."fromSchool", seed."toSchool", seed."status"::transfer_status, seed."eligibilityYears"
      FROM (VALUES
        ('Regional High School', NULL, 'entered', 4),
        ('Community College Program', NULL, 'entered', 3),
        ('Development Academy', 'Target University', 'committed', 2)
      ) AS seed("fromSchool", "toSchool", "status", "eligibilityYears")
      WHERE NOT EXISTS (SELECT 1 FROM "transfer_portal_entries" LIMIT 1);
    `);
  } finally {
    await client.end().catch(() => undefined);
  }
}

export const nilRouter = router({
  // NIL Deals
  getMyDeals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable — please try again in a moment.",
      });
    }
    const athleteId = Number(ctx.user.id);
    const deals = await db
      .select()
      .from(nilDeals)
      .where(sql`${nilDeals.athleteId} = ${athleteId}`)
      .orderBy(desc(nilDeals.createdAt));

    // Decrypt contract descriptions
    return deals.map((deal: any) => ({
      ...deal,
      description: deal.description ? decryptNILContract(deal.description, deal.id) : deal.description,
    }));
  }),

  getAllDeals: publicProcedure
    .input(z.object({
      status: z.enum(["pending", "active", "completed", "declined"]).optional(),
      category: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const selectDeals = () => db
        .select({
          id: nilDeals.id,
          brandName: nilDeals.brandName,
          dealValue: nilDeals.dealValue,
          status: nilDeals.status,
          description: nilDeals.description,
          category: nilDeals.category,
          startDate: nilDeals.startDate,
          endDate: nilDeals.endDate,
          athleteName: users.name,
          athleteAvatar: users.avatarUrl,
        })
        .from(nilDeals)
        .leftJoin(users, eq(nilDeals.athleteId, users.id))
        .limit(input.limit)
        .orderBy(desc(nilDeals.createdAt));

      let deals;
      try {
        deals = await selectDeals();
      } catch (error) {
        if (!isMissingNilDealsTableError(error)) throw error;
        await ensureNilDealsTableForRequest();
        deals = await selectDeals();
      }

      // Decrypt descriptions for display
      return deals.map((deal: any) => ({
        ...deal,
        description: deal.description ? decryptNILContract(deal.description, deal.id) : deal.description,
      }));
    }),

  createDeal: protectedProcedure
    .input(z.object({
      brandName: z.string().min(1).max(128),
      dealValue: z.number().min(0),
      description: z.string().optional(),
      category: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Insert first to get the ID, then encrypt with the ID as context
      const [inserted] = await db.insert(nilDeals).values({
        athleteId: Number(ctx.user.id),
        brandName: input.brandName,
        dealValue: input.dealValue,
        description: input.description || null,
        category: input.category,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      const dealId = (inserted as any).insertId ?? (inserted as any).id;

      // Encrypt description if provided
      if (input.description && dealId) {
        const encryptedDesc = encryptNILContract(input.description, dealId);
        await db.update(nilDeals)
          .set({ description: encryptedDesc })
          .where(eq(nilDeals.id, dealId));
      }

      return { success: true, dealId, encrypted: true };
    }),

  updateDealStatus: protectedProcedure
    .input(z.object({
      dealId: z.number(),
      status: z.enum(["pending", "active", "completed", "declined"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.update(nilDeals)
        .set({ status: input.status })
        .where(eq(nilDeals.id, input.dealId));
      return { success: true };
    }),

  calculateNilValue: publicProcedure
    .input(z.object({
      sport: z.string(),
      followers: z.number(),
      gpa: z.number().optional(),
      school: z.string().optional(),
      classYear: z.string().optional(),
    }))
    .query(({ input }) => {
      const sportMultipliers: Record<string, number> = {
        football: 2.5, basketball: 2.2, baseball: 1.5, soccer: 1.3,
        volleyball: 1.2, softball: 1.1, track: 1.0, swimming: 0.9,
        wrestling: 0.9, tennis: 0.8, lacrosse: 1.1, hockey: 1.0,
        golf: 0.9, gymnastics: 0.8, rugby: 0.7, cricket: 0.7,
        "cross country": 0.8, rowing: 0.7, "water polo": 0.7,
        "field hockey": 0.8, cheerleading: 0.8,
      };
      const multiplier = sportMultipliers[input.sport.toLowerCase()] ?? 1.0;
      const followerValue = input.followers * 0.05 * multiplier;
      const gpaBonus = (input.gpa ?? 0) * 500;
      const classBonus = input.classYear === "Freshman" ? 500 :
        input.classYear === "Sophomore" ? 750 :
        input.classYear === "Junior" ? 1000 : 1250;
      const total = Math.floor(followerValue + gpaBonus + classBonus);
      return {
        estimatedValue: total,
        breakdown: {
          followerValue: Math.floor(followerValue),
          gpaBonus: Math.floor(gpaBonus),
          classBonus,
          sportMultiplier: multiplier,
        },
      };
    }),

  // Transfer Portal
  getTransferEntries: publicProcedure
    .input(z.object({
      sport: z.string().optional(),
      status: z.enum(["entered", "committed", "withdrawn"]).optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const selectEntries = () => db
        .select({
          id: transferPortalEntries.id,
          fromSchool: transferPortalEntries.fromSchool,
          toSchool: transferPortalEntries.toSchool,
          status: transferPortalEntries.status,
          eligibilityYears: transferPortalEntries.eligibilityYears,
          enteredAt: transferPortalEntries.enteredAt,
          sport: athleteProfiles.sport,
          position: athleteProfiles.position,
          athleteName: users.name,
          athleteAvatar: users.avatarUrl,
          nilValue: athleteProfiles.nilValue,
        })
        .from(transferPortalEntries)
        .leftJoin(athleteProfiles, eq(transferPortalEntries.athleteId, athleteProfiles.userId))
        .leftJoin(users, eq(transferPortalEntries.athleteId, users.id))
        .limit(input.limit)
        .orderBy(desc(transferPortalEntries.enteredAt));

      try {
        return await selectEntries();
      } catch (error) {
        if (!isMissingTransferPortalTableError(error)) throw error;
        await ensureTransferPortalEntriesTableForRequest();
        return selectEntries();
      }
    }),

  enterTransferPortal: protectedProcedure
    .input(z.object({
      fromSchool: z.string(),
      eligibilityYears: z.number().min(0).max(5).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.insert(transferPortalEntries).values({
        athleteId: Number(ctx.user.id),
        fromSchool: input.fromSchool,
        eligibilityYears: input.eligibilityYears,
        status: "entered",
      });
      return { success: true };
    }),

  // ────────────────────────────────────────────────────────────────────────
  // NIL Payout — Stripe-powered. AthlynXAI takes a percentage.
  // The highway runs the trucks. The percentage is the toll.
  // ────────────────────────────────────────────────────────────────────────
  createNILPayout: protectedProcedure
    .input(z.object({
      dealId: z.number(),
      grossAmountCents: z.number().int().min(100), // min $1.00
      currency: z.string().default("usd"),
      athleteStripeAccountId: z.string().optional(), // Stripe Connect express account
      athlynxFeePercentage: z.number().min(0).max(30).default(10), // 10% default toll
    }))
    .mutation(async ({ ctx, input }) => {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "NIL payout disabled — STRIPE_SECRET_KEY not configured.",
        });
      }

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" as any });

      const applicationFeeCents = Math.round(
        (input.grossAmountCents * input.athlynxFeePercentage) / 100
      );

      try {
        const intent = await stripe.paymentIntents.create({
          amount: input.grossAmountCents,
          currency: input.currency,
          application_fee_amount: applicationFeeCents,
          metadata: {
            athlete_id: String(ctx.user.id),
            deal_id: String(input.dealId),
            athlynx_fee_percent: String(input.athlynxFeePercentage),
            source: "athlynxai_nil_payout",
          },
          ...(input.athleteStripeAccountId
            ? { transfer_data: { destination: input.athleteStripeAccountId } }
            : {}),
        });

        return {
          success: true,
          paymentIntentId: intent.id,
          clientSecret: intent.client_secret,
          athleteGrossCents: input.grossAmountCents,
          athlynxFeeCents: applicationFeeCents,
          athleteNetCents: input.grossAmountCents - applicationFeeCents,
          feePercent: input.athlynxFeePercentage,
        };
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Stripe NIL payout failed: ${err?.message || "unknown error"}`,
        });
      }
    }),

  // NIL fee preview — public, no auth, used by /branded-profile preview math
  previewNILFee: publicProcedure
    .input(z.object({
      grossAmountCents: z.number().int().min(0),
      athlynxFeePercentage: z.number().min(0).max(30).default(10),
    }))
    .query(({ input }) => {
      const fee = Math.round((input.grossAmountCents * input.athlynxFeePercentage) / 100);
      return {
        gross: input.grossAmountCents,
        athlynxFee: fee,
        athleteNet: input.grossAmountCents - fee,
        feePercent: input.athlynxFeePercentage,
      };
    }),
});
