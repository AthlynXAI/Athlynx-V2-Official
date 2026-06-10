/**
 * Build 5 — Q&A page router (the listening post)
 * Public posting. Public voting (1 vote per user OR per IP-hash for anon).
 * Master admin answers, pins, hides.
 */
import { z } from "zod";
import crypto from "crypto";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { isMasterAdmin } from "../_core/adminAllowlist";
import { audit } from "../_core/audit";

const kindEnum = z.enum(["question", "feature_request", "bug", "general", "love", "hate"]);
const statusEnum = z.enum(["open", "planned", "in_progress", "shipped", "answered", "closed"]);
const sortEnum = z.enum(["top", "new", "answered"]).default("top");

function ipHash(ip: string | undefined): string {
  const salt = process.env.QA_VOTE_SALT ?? "athlynx-fortknox-2026";
  return crypto.createHash("sha256").update(`${salt}:${ip ?? "0"}`).digest("hex").slice(0, 32);
}

function clientIp(req: any): string | undefined {
  const xff = (req?.headers?.["x-forwarded-for"] as string | undefined) || "";
  const first = xff.split(",")[0]?.trim();
  return first || req?.ip || undefined;
}

export const qaRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          sort: sortEnum.optional(),
          kind: kindEnum.optional(),
          status: statusEnum.optional(),
          limit: z.number().int().min(1).max(100).default(50),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      const sort = input?.sort ?? "top";
      const kind = input?.kind ?? null;
      const status = input?.status ?? null;
      const limit = input?.limit ?? 50;

      const orderClause =
        sort === "new"
          ? sql`ORDER BY created_at DESC`
          : sort === "answered"
            ? sql`ORDER BY (answered_at IS NULL) ASC, answered_at DESC, upvotes DESC`
            : sql`ORDER BY is_pinned DESC, (upvotes - downvotes) DESC, created_at DESC`;

      const rows = await db.execute(sql`
        SELECT id, display_name, kind, title, body, status, upvotes, downvotes,
               is_pinned, answer, answered_by, answered_at, created_at, updated_at
        FROM qa_questions
        WHERE is_hidden = FALSE
          AND (${kind}::text IS NULL OR kind = ${kind})
          AND (${status}::text IS NULL OR status = ${status})
        ${orderClause}
        LIMIT ${limit}
      `);
      return (rows as any).rows ?? rows;
    }),

  create: publicProcedure
    .input(
      z.object({
        kind: kindEnum.default("question"),
        title: z.string().min(3).max(200),
        body: z.string().min(1).max(4000),
        displayName: z.string().max(80).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = ctx.user?.id ? Number(ctx.user.id) : null;
      const name = input.displayName?.trim() || ctx.user?.name || ctx.user?.email?.split("@")[0] || "Anonymous";

      const result = await db.execute(sql`
        INSERT INTO qa_questions (user_id, display_name, kind, title, body)
        VALUES (${userId}, ${name}, ${input.kind}, ${input.title}, ${input.body})
        RETURNING id
      `);
      const id = ((result as any).rows?.[0]?.id ?? null);
      await audit({ ctx, action: "qa.create", targetType: "qa_question", targetId: String(id), metadata: { kind: input.kind } });
      return { id, ok: true };
    }),

  vote: publicProcedure
    .input(z.object({ questionId: z.number().int(), direction: z.union([z.literal(1), z.literal(-1)]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const voterId = ctx.user?.id ? Number(ctx.user.id) : null;
      const ipH = voterId ? null : ipHash(clientIp(ctx.req));

      try {
        await db.execute(sql`
          INSERT INTO qa_votes (question_id, voter_id, voter_ip_hash, direction)
          VALUES (${input.questionId}, ${voterId}, ${ipH}, ${input.direction})
        `);
      } catch {
        return { ok: false, reason: "already_voted" };
      }

      if (input.direction === 1) {
        await db.execute(sql`UPDATE qa_questions SET upvotes = upvotes + 1, updated_at = NOW() WHERE id = ${input.questionId}`);
      } else {
        await db.execute(sql`UPDATE qa_questions SET downvotes = downvotes + 1, updated_at = NOW() WHERE id = ${input.questionId}`);
      }
      return { ok: true };
    }),

  // ─── Admin actions ──────────────────────────────────────────────────────────
  answer: protectedProcedure
    .input(z.object({ id: z.number().int(), answer: z.string().min(1).max(4000), status: statusEnum.default("answered") }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      await db.execute(sql`
        UPDATE qa_questions
        SET answer = ${input.answer}, answered_by = ${ctx.user?.email ?? null},
            answered_at = NOW(), status = ${input.status}, updated_at = NOW()
        WHERE id = ${input.id}
      `);
      await audit({ ctx, action: "qa.answer", targetType: "qa_question", targetId: String(input.id), metadata: { status: input.status } });
      return { ok: true };
    }),

  setStatus: protectedProcedure
    .input(z.object({ id: z.number().int(), status: statusEnum }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      await db.execute(sql`UPDATE qa_questions SET status = ${input.status}, updated_at = NOW() WHERE id = ${input.id}`);
      await audit({ ctx, action: "qa.setStatus", targetType: "qa_question", targetId: String(input.id), metadata: { status: input.status } });
      return { ok: true };
    }),

  pin: protectedProcedure
    .input(z.object({ id: z.number().int(), isPinned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      await db.execute(sql`UPDATE qa_questions SET is_pinned = ${input.isPinned}, updated_at = NOW() WHERE id = ${input.id}`);
      await audit({ ctx, action: "qa.pin", targetType: "qa_question", targetId: String(input.id), metadata: { isPinned: input.isPinned } });
      return { ok: true };
    }),

  hide: protectedProcedure
    .input(z.object({ id: z.number().int(), isHidden: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      await db.execute(sql`UPDATE qa_questions SET is_hidden = ${input.isHidden}, updated_at = NOW() WHERE id = ${input.id}`);
      await audit({ ctx, action: "qa.hide", targetType: "qa_question", targetId: String(input.id), metadata: { isHidden: input.isHidden } });
      return { ok: true };
    }),
});
