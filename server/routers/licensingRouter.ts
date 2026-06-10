/**
 * AthlynX — White-Label Licensing Router
 * Manages license agreements for teams, schools, conferences, and enterprises.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { licenseAgreements, LicenseAgreement } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2026-04-22.dahlia" });

// Stripe price IDs for each licensing tier
const LICENSE_PRICES: Record<string, string> = {
  team: "price_1TTo28RjBH07kRLYzkJRXdEe",       // $299/mo
  school: "price_1TTo2aRjBH07kRLY2BuVWynm",     // $599/mo
  conference: "price_1TTo2oRjBH07kRLYJpOeukdi", // $1,499/mo
};

const LICENSE_FEES: Record<string, number> = {
  team: 29900,
  school: 59900,
  conference: 149900,
  enterprise: 0,
};

export const licensingRouter = router({
  // Get all license agreements (admin only)
  getLicenses: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Admin only");
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
    return await db
      .select()
      .from(licenseAgreements)
      .orderBy(desc(licenseAgreements.createdAt));
  }),

  // Get license stats (admin only)
  getLicenseStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Admin only");
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
    const all: LicenseAgreement[] = await db.select().from(licenseAgreements);
    return {
      total: all.length,
      active: all.filter((l: LicenseAgreement) => l.status === "active").length,
      pending: all.filter((l: LicenseAgreement) => l.status === "pending").length,
      mrr: all
        .filter((l: LicenseAgreement) => l.status === "active")
        .reduce((sum: number, l: LicenseAgreement) => sum + (l.monthlyFee ?? 0), 0),
      byTier: {
        team: all.filter((l: LicenseAgreement) => l.tier === "team").length,
        school: all.filter((l: LicenseAgreement) => l.tier === "school").length,
        conference: all.filter((l: LicenseAgreement) => l.tier === "conference").length,
        enterprise: all.filter((l: LicenseAgreement) => l.tier === "enterprise").length,
      },
    };
  }),

  // Create a license inquiry (public — anyone can request)
  createInquiry: publicProcedure
    .input(z.object({
      orgName: z.string().min(2),
      orgType: z.string(),
      tier: z.enum(["team", "school", "conference", "enterprise"]),
      contactName: z.string().min(2),
      contactEmail: z.string().email(),
      contactPhone: z.string().optional(),
      athleteCount: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const [license] = await db.insert(licenseAgreements).values({
        orgName: input.orgName,
        orgType: input.orgType,
        tier: input.tier,
        monthlyFee: LICENSE_FEES[input.tier] ?? 0,
        athleteCount: input.athleteCount ?? 0,
        status: "pending",
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        notes: input.notes,
      }).returning();
      return { success: true, licenseId: license.id };
    }),

  // Create Stripe checkout for licensing (public)
  createCheckout: publicProcedure
    .input(z.object({
      tier: z.enum(["team", "school", "conference"]),
      orgName: z.string(),
      contactEmail: z.string().email(),
      contactName: z.string(),
    }))
    .mutation(async ({ input }) => {
      const priceId = LICENSE_PRICES[input.tier];
      if (!priceId) throw new Error("Enterprise tier requires direct contact");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: input.contactEmail,
        metadata: {
          orgName: input.orgName,
          contactName: input.contactName,
          tier: input.tier,
          type: "white_label_license",
        },
        success_url: `${process.env.VITE_OAUTH_PORTAL_URL ?? "https://athlynx.ai"}/white-label?success=true&org=${encodeURIComponent(input.orgName)}`,
        cancel_url: `${process.env.VITE_OAUTH_PORTAL_URL ?? "https://athlynx.ai"}/white-label`,
        subscription_data: {
          metadata: {
            orgName: input.orgName,
            tier: input.tier,
            type: "white_label_license",
          },
        },
      });

      // Create pending license record
      const db = await getDb();
      if (db) {
        await db.insert(licenseAgreements).values({
          orgName: input.orgName,
          orgType: input.tier,
          tier: input.tier,
          monthlyFee: LICENSE_FEES[input.tier] ?? 0,
          status: "pending",
          contactName: input.contactName,
          contactEmail: input.contactEmail,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        });
      }

      return { url: session.url };
    }),

  // Update license status (admin only)
  updateLicense: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["active", "pending", "suspended", "cancelled", "trial"]).optional(),
      notes: z.string().optional(),
      brandColor: z.string().optional(),
      customDomain: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin only");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const { id, ...updates } = input;
      await db.update(licenseAgreements)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(licenseAgreements.id, id));
      return { success: true };
    }),
});
