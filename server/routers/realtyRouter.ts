/**
 * AthlyXAI Realty Router — our own Zillow, athlete-first.
 *
 * Helps athletes find homes during their busy schedules: rentals near campus
 * and team facilities, host families, team housing, NIL-friendly short leases.
 *
 * Doctrine: honor the athlete's journey. The platform is the porch.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

const KINDS = ["rental", "host_family", "team_housing", "shared", "for_sale"] as const;
const STATUSES = ["active", "paused", "filled", "closed"] as const;

export const realtyRouter = router({

  listListings: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        kind: z.enum(KINDS).optional(),
        nilFriendly: z.boolean().optional(),
        maxRentCents: z.number().optional(),
        bedrooms: z.number().optional(),
        nearSchool: z.string().optional(),
        limit: z.number().min(1).max(200).default(60),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      const city = input?.city ?? null;
      const state = input?.state ?? null;
      const kind = input?.kind ?? null;
      const nf = input?.nilFriendly ?? null;
      const maxRent = input?.maxRentCents ?? null;
      const bedrooms = input?.bedrooms ?? null;
      const near = input?.nearSchool ?? null;
      const rows = await db.execute(sql`
        SELECT id, kind, title, description, city, state, zip, lat, lng,
               monthly_rent, sale_price, bedrooms, bathrooms, square_feet,
               near_schools, near_team, nil_friendly, photos, amenities,
               available_from, available_until, status, created_at, updated_at
        FROM realty_listings
        WHERE status = 'active'
          AND (${city}::text IS NULL OR LOWER(city) = LOWER(${city}))
          AND (${state}::text IS NULL OR LOWER(state) = LOWER(${state}))
          AND (${kind}::text IS NULL OR kind = ${kind})
          AND (${nf}::bool IS NULL OR nil_friendly = ${nf})
          AND (${maxRent}::int IS NULL OR (monthly_rent IS NOT NULL AND monthly_rent <= ${maxRent}))
          AND (${bedrooms}::numeric IS NULL OR bedrooms >= ${bedrooms})
          AND (${near}::text IS NULL OR near_schools::text ILIKE ${"%" + (near ?? "") + "%"})
        ORDER BY updated_at DESC
        LIMIT ${input?.limit ?? 60}
      `);
      return (rows as any).rows ?? rows ?? [];
    }),

  getListing: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const rows = await db.execute(sql`SELECT * FROM realty_listings WHERE id = ${input.id} LIMIT 1`);
      const row = ((rows as any).rows ?? rows ?? [])[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Listing not found." });
      return row;
    }),

  upsertListing: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        kind: z.enum(KINDS).default("rental"),
        title: z.string().min(1),
        description: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(2),
        zip: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        monthlyRentCents: z.number().int().optional(),
        salePriceCents: z.number().int().optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        squareFeet: z.number().int().optional(),
        nearSchools: z.array(z.string()).optional(),
        nearTeam: z.string().optional(),
        nilFriendly: z.boolean().optional(),
        photos: z.array(z.string().url()).optional(),
        amenities: z.array(z.string()).optional(),
        availableFrom: z.string().optional(),
        availableUntil: z.string().optional(),
        status: z.enum(STATUSES).optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const ownerId = Number(ctx.user.id);
      if (input.id) {
        await db.execute(sql`
          UPDATE realty_listings SET
            kind = ${input.kind},
            title = ${input.title},
            description = ${input.description ?? null},
            city = ${input.city},
            state = ${input.state},
            zip = ${input.zip ?? null},
            lat = ${input.lat ?? null},
            lng = ${input.lng ?? null},
            monthly_rent = ${input.monthlyRentCents ?? null},
            sale_price = ${input.salePriceCents ?? null},
            bedrooms = ${input.bedrooms ?? null},
            bathrooms = ${input.bathrooms ?? null},
            square_feet = ${input.squareFeet ?? null},
            near_schools = ${JSON.stringify(input.nearSchools ?? [])}::jsonb,
            near_team = ${input.nearTeam ?? null},
            nil_friendly = ${input.nilFriendly ?? false},
            photos = ${JSON.stringify(input.photos ?? [])}::jsonb,
            amenities = ${JSON.stringify(input.amenities ?? [])}::jsonb,
            available_from = ${input.availableFrom ?? null},
            available_until = ${input.availableUntil ?? null},
            status = ${input.status ?? "active"},
            contact_email = ${input.contactEmail ?? null},
            contact_phone = ${input.contactPhone ?? null},
            updated_at = now()
          WHERE id = ${input.id} AND (owner_user_id = ${ownerId} OR owner_user_id IS NULL)
        `);
        return { ok: true, id: input.id };
      }
      const rows = await db.execute(sql`
        INSERT INTO realty_listings
          (owner_user_id, kind, title, description, city, state, zip, lat, lng,
           monthly_rent, sale_price, bedrooms, bathrooms, square_feet,
           near_schools, near_team, nil_friendly, photos, amenities,
           available_from, available_until, status, contact_email, contact_phone)
        VALUES
          (${ownerId}, ${input.kind}, ${input.title}, ${input.description ?? null},
           ${input.city}, ${input.state}, ${input.zip ?? null},
           ${input.lat ?? null}, ${input.lng ?? null},
           ${input.monthlyRentCents ?? null}, ${input.salePriceCents ?? null},
           ${input.bedrooms ?? null}, ${input.bathrooms ?? null},
           ${input.squareFeet ?? null},
           ${JSON.stringify(input.nearSchools ?? [])}::jsonb,
           ${input.nearTeam ?? null}, ${input.nilFriendly ?? false},
           ${JSON.stringify(input.photos ?? [])}::jsonb,
           ${JSON.stringify(input.amenities ?? [])}::jsonb,
           ${input.availableFrom ?? null}, ${input.availableUntil ?? null},
           ${input.status ?? "active"},
           ${input.contactEmail ?? null}, ${input.contactPhone ?? null})
        RETURNING id
      `);
      return { ok: true, id: Number(((rows as any).rows ?? rows ?? [])[0]?.id) };
    }),

  myListings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const rows = await db.execute(sql`
      SELECT * FROM realty_listings WHERE owner_user_id = ${Number(ctx.user.id)} ORDER BY updated_at DESC
    `);
    return (rows as any).rows ?? rows ?? [];
  }),

  sendInquiry: protectedProcedure
    .input(
      z.object({
        listingId: z.number(),
        message: z.string().min(1).max(2000),
        moveInDate: z.string().optional(),
        partySize: z.number().int().min(1).max(20).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db.execute(sql`
        INSERT INTO realty_inquiries (listing_id, inquirer_user_id, inquirer_name, inquirer_email,
                                      message, move_in_date, party_size)
        VALUES (${input.listingId}, ${Number(ctx.user.id)}, ${ctx.user.name ?? null},
                ${ctx.user.email ?? null}, ${input.message},
                ${input.moveInDate ?? null}, ${input.partySize ?? null})
      `);
      return { ok: true };
    }),

  listInquiries: protectedProcedure
    .input(z.object({ listingId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      // Only owner of the listing sees inquiries
      const ownerCheck = await db.execute(sql`
        SELECT owner_user_id FROM realty_listings WHERE id = ${input.listingId}
      `);
      const owner = ((ownerCheck as any).rows ?? ownerCheck ?? [])[0]?.owner_user_id;
      if (Number(owner) !== Number(ctx.user.id)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your listing." });
      }
      const rows = await db.execute(sql`
        SELECT * FROM realty_inquiries WHERE listing_id = ${input.listingId} ORDER BY created_at DESC
      `);
      return (rows as any).rows ?? rows ?? [];
    }),
});
