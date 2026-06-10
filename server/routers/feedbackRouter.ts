import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { Pool } from "pg";

let _pool: Pool | null = null;
async function getPool(): Promise<Pool> {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return _pool;
}

export const feedbackRouter = router({
  // Submit feedback (public — anyone can submit)
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      email: z.string().min(1),
      title: z.string().min(5).max(256),
      body: z.string().min(10).max(2000),
      category: z.enum(["feature_request", "bug_report", "general", "content", "performance"]).default("general"),
    }))
    .mutation(async ({ input }) => {
      const pool = await getPool();
      await pool.query(
        `INSERT INTO athlete_feedback (name, email, title, body, category) VALUES ($1, $2, $3, $4, $5)`,
        [input.name, input.email, input.title, input.body, input.category]
      );
      return { success: true };
    }),

  // List feedback (public)
  list: publicProcedure
    .input(z.object({
      category: z.enum(["all", "feature_request", "bug_report", "general", "content", "performance"]).default("all"),
      sort: z.enum(["newest", "top"]).default("top"),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const limitSafe = Math.min(Math.max(1, input.limit), 50);
      const offsetSafe = Math.max(0, input.offset);
      const orderBy = input.sort === "top" ? "votes DESC, \"createdAt\" DESC" : "\"createdAt\" DESC";

      let query: string;
      let params: any[];

      if (input.category !== "all") {
        query = `SELECT id, name, title, body, category, votes, status, "adminReply", "repliedAt", "createdAt"
                 FROM athlete_feedback WHERE category = $1
                 ORDER BY ${orderBy}
                 LIMIT $2 OFFSET $3`;
        params = [input.category, limitSafe, offsetSafe];
      } else {
        query = `SELECT id, name, title, body, category, votes, status, "adminReply", "repliedAt", "createdAt"
                 FROM athlete_feedback
                 ORDER BY ${orderBy}
                 LIMIT $1 OFFSET $2`;
        params = [limitSafe, offsetSafe];
      }

      const result = await pool.query(query, params);
      return { items: result.rows };
    }),

  // Vote on feedback (by email/IP identifier)
  vote: publicProcedure
    .input(z.object({
      feedbackId: z.number(),
      voterIdentifier: z.string().min(1).max(320),
    }))
    .mutation(async ({ input }) => {
      const pool = await getPool();
      const existing = await pool.query(
        `SELECT id FROM feedback_votes WHERE "feedbackId" = $1 AND "voterIdentifier" = $2`,
        [input.feedbackId, input.voterIdentifier]
      );

      if (existing.rows.length > 0) {
        return { success: false, message: "Already voted" };
      }

      await pool.query(
        `INSERT INTO feedback_votes ("feedbackId", "voterIdentifier") VALUES ($1, $2)`,
        [input.feedbackId, input.voterIdentifier]
      );
      await pool.query(
        `UPDATE athlete_feedback SET votes = votes + 1 WHERE id = $1`,
        [input.feedbackId]
      );
      return { success: true };
    }),

  // Admin: reply to feedback
  adminReply: protectedProcedure
    .input(z.object({
      feedbackId: z.number(),
      reply: z.string().min(1).max(2000),
      status: z.enum(["open", "under_review", "planned", "completed", "declined"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const pool = await getPool();
      if (input.status) {
        await pool.query(
          `UPDATE athlete_feedback SET "adminReply" = $1, "repliedAt" = NOW(), status = $2 WHERE id = $3`,
          [input.reply, input.status, input.feedbackId]
        );
      } else {
        await pool.query(
          `UPDATE athlete_feedback SET "adminReply" = $1, "repliedAt" = NOW() WHERE id = $2`,
          [input.reply, input.feedbackId]
        );
      }
      return { success: true };
    }),

  // Admin: update status only
  updateStatus: protectedProcedure
    .input(z.object({
      feedbackId: z.number(),
      status: z.enum(["open", "under_review", "planned", "completed", "declined"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const pool = await getPool();
      await pool.query(
        `UPDATE athlete_feedback SET status = $1 WHERE id = $2`,
        [input.status, input.feedbackId]
      );
      return { success: true };
    }),

  // Admin: delete feedback
  delete: protectedProcedure
    .input(z.object({ feedbackId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const pool = await getPool();
      await pool.query(`DELETE FROM feedback_votes WHERE "feedbackId" = $1`, [input.feedbackId]);
      await pool.query(`DELETE FROM athlete_feedback WHERE id = $1`, [input.feedbackId]);
      return { success: true };
    }),
});
