/**
 * Media Router — AthlynXAI
 * Athlete video and media upload via AWS S3 presigned URLs
 * Supports: highlight reels, recruiting videos, profile photos, game film
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { athleteProfiles, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { getSignedUploadUrl as getR2SignedUploadUrl } from "../services/r2Upload";
import { createVimeoTusUpload, getVimeoVideo, isVimeoConfigured } from "../services/vimeo";

function getS3(): S3Client | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  if (!accessKeyId || !secretAccessKey) return null;
  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}

const BUCKET = process.env.AWS_S3_BUCKET || "";
const CDN_BASE = process.env.AWS_CLOUDFRONT_URL || `https://${BUCKET}.s3.amazonaws.com`;

function generateKey(userId: number, type: string, filename: string): string {
  const hash = crypto.randomBytes(8).toString("hex");
  const ext = filename.split(".").pop()?.toLowerCase() || "mp4";
  return `athletes/${userId}/${type}/${hash}.${ext}`;
}

export const mediaRouter = router({
  /**
   * Cloudflare R2 signed upload URL — used by onboarding (headshot, stats screenshot).
   * Client PUTs the file directly to R2 using `uploadUrl`, then sends `readUrl` back.
   */
  requestUpload: protectedProcedure
    .input(z.object({
      kind: z.enum(["headshot", "stats_screenshot", "highlight_clip"]),
      filename: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const ext = input.filename.split(".").pop()?.toLowerCase() || "bin";
      const hash = crypto.randomBytes(8).toString("hex");
      const key = `athletes/${ctx.user.id}/${input.kind}/${hash}.${ext}`;
      try {
        return await getR2SignedUploadUrl(key, input.contentType);
      } catch (err) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            err instanceof Error
              ? err.message
              : "Cloudflare R2 is not configured for uploads yet.",
        });
      }
    }),

  /**
   * Get a presigned PUT URL for direct browser → S3 upload
   * Returns: { uploadUrl, key, publicUrl }
   */
  getUploadUrl: protectedProcedure
    .input(z.object({
      filename: z.string(),
      contentType: z.string(),
      mediaType: z.enum(["highlight", "game_film", "training", "recruiting", "profile_photo", "cover_photo", "other"]),
      fileSizeBytes: z.number().max(500 * 1024 * 1024), // 500MB max
    }))
    .mutation(async ({ ctx, input }) => {
      const s3 = getS3();
      if (!s3 || !BUCKET) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Media storage is not configured. Please contact support at support@athlynx.ai.",
        });
      }

      const key = generateKey(ctx.user.id, input.mediaType, input.filename);

      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: input.contentType,
        Metadata: {
          userId: String(ctx.user.id),
          mediaType: input.mediaType,
          uploadedAt: new Date().toISOString(),
        },
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour to upload
      const publicUrl = `${CDN_BASE}/${key}`;

      return { uploadUrl, key, publicUrl, fallback: false };
    }),



  /**
   * Create a server-mediated Vimeo tus upload ticket.
   * The Vimeo token stays on the server; the client receives only the tus upload URL.
   * If Vimeo is not configured, the caller should fall back to the existing S3/R2 flow.
   */
  createVimeoUpload: protectedProcedure
    .input(z.object({
      filename: z.string().min(1).max(240),
      contentType: z.string().regex(/^video\//, "Only video uploads are supported for Vimeo recruiting film."),
      fileSizeBytes: z.number().min(1).max(5 * 1024 * 1024 * 1024),
      mediaType: z.enum(["highlight", "game_film", "training", "recruiting", "other"]).default("highlight"),
      title: z.string().min(1).max(180),
      description: z.string().max(2000).optional(),
      sport: z.string().max(80).optional(),
      isHighlightReel: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      if (!isVimeoConfigured()) {
        return {
          provider: "fallback" as const,
          fallback: true,
          reason: "Vimeo is not configured. Missing VIMEO_ACCESS_TOKEN; use the existing S3/R2 upload path.",
        };
      }

      const ticket = await createVimeoTusUpload({
        filename: input.filename,
        fileSizeBytes: input.fileSizeBytes,
        title: input.title,
        description: input.description,
      });

      return {
        provider: "vimeo" as const,
        fallback: false,
        uploadApproach: "tus" as const,
        uploadLink: ticket.uploadLink,
        completeUri: ticket.completeUri,
        vimeoUri: ticket.video.uri,
        vimeoId: ticket.video.id,
        playerUrl: ticket.video.playerUrl,
        link: ticket.video.link,
        processingStatus: ticket.video.processingStatus,
      };
    }),

  /**
   * Save a Vimeo-backed recruiting video after the browser/mobile client finishes tus upload.
   * This stores Vimeo metadata in the same recruitingVideos array used by the existing S3/R2 path.
   */
  completeVimeoUpload: protectedProcedure
    .input(z.object({
      vimeoUri: z.string().min(1),
      vimeoId: z.string().min(1).optional(),
      playerUrl: z.string().url().optional(),
      link: z.string().url().optional(),
      thumbnailUrl: z.string().url().optional(),
      mediaType: z.enum(["highlight", "game_film", "training", "recruiting", "other"]).default("highlight"),
      title: z.string().min(1).max(180),
      description: z.string().max(2000).optional(),
      sport: z.string().max(80).optional(),
      isHighlightReel: z.boolean().default(false),
      processingStatus: z.enum(["uploading", "processing", "ready", "failed", "unknown"]).default("processing"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      let synced: Awaited<ReturnType<typeof getVimeoVideo>> | null = null;
      if (isVimeoConfigured()) {
        synced = await getVimeoVideo(input.vimeoUri).catch((error) => {
          console.warn("[Vimeo] Sync after upload failed; saving client-provided metadata", error);
          return null;
        });
      }

      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);
      const currentVideos: any[] = (profile as any)?.recruitingVideos ?? [];
      const vimeoId = synced?.id || input.vimeoId || input.vimeoUri.split("/").filter(Boolean).pop() || crypto.randomUUID();

      const newVideo = {
        id: crypto.randomUUID(),
        provider: "vimeo",
        key: input.vimeoUri,
        url: synced?.playerUrl || input.playerUrl || input.link || `https://player.vimeo.com/video/${vimeoId}`,
        playerUrl: synced?.playerUrl || input.playerUrl || `https://player.vimeo.com/video/${vimeoId}`,
        link: synced?.link || input.link || `https://vimeo.com/${vimeoId}`,
        embedHtml: synced?.embedHtml,
        thumbnailUrl: synced?.thumbnailUrl || input.thumbnailUrl,
        vimeoUri: synced?.uri || input.vimeoUri,
        vimeoId,
        type: input.mediaType,
        title: input.title,
        description: input.description || "",
        sport: input.sport || profile?.sport || "",
        isHighlightReel: input.isHighlightReel,
        privacy: "domain_whitelist",
        processingStatus: synced?.processingStatus || input.processingStatus,
        uploadedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      };

      const updatedVideos = [...currentVideos, newVideo];
      if (profile) {
        await db.update(athleteProfiles)
          .set({
            recruitingVideos: updatedVideos,
            ...(input.isHighlightReel ? { highlightUrl: newVideo.playerUrl } : {}),
            updatedAt: new Date(),
          } as any)
          .where(eq(athleteProfiles.userId, ctx.user.id));
      } else {
        await db.insert(athleteProfiles).values({
          userId: ctx.user.id,
          recruitingVideos: updatedVideos,
          ...(input.isHighlightReel ? { highlightUrl: newVideo.playerUrl } : {}),
        } as any);
      }

      return { success: true, video: newVideo };
    }),

  /**
   * Sync Vimeo processing/player metadata for an existing recruiting video.
   */
  syncVimeoVideo: protectedProcedure
    .input(z.object({ videoId: z.string().min(1), vimeoUri: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!isVimeoConfigured()) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Vimeo is not configured. Missing VIMEO_ACCESS_TOKEN." });
      }
      const synced = await getVimeoVideo(input.vimeoUri);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);
      const currentVideos: any[] = (profile as any)?.recruitingVideos ?? [];
      const updatedVideos = currentVideos.map((video: any) => video.id === input.videoId ? {
        ...video,
        provider: "vimeo",
        vimeoUri: synced.uri,
        vimeoId: synced.id,
        url: synced.playerUrl,
        playerUrl: synced.playerUrl,
        link: synced.link,
        embedHtml: synced.embedHtml,
        thumbnailUrl: synced.thumbnailUrl || video.thumbnailUrl,
        processingStatus: synced.processingStatus,
      } : video);
      await db.update(athleteProfiles)
        .set({ recruitingVideos: updatedVideos as any, updatedAt: new Date() } as any)
        .where(eq(athleteProfiles.userId, ctx.user.id));
      return { success: true, video: updatedVideos.find((video: any) => video.id === input.videoId) };
    }),

  /**
   * Save uploaded media to athlete profile
   * Called after successful S3 upload
   */
  saveMedia: protectedProcedure
    .input(z.object({
      key: z.string(),
      publicUrl: z.string(),
      mediaType: z.enum(["highlight", "game_film", "training", "recruiting", "profile_photo", "cover_photo", "other"]),
      title: z.string().optional(),
      description: z.string().optional(),
      sport: z.string().optional(),
      isHighlightReel: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Get current profile
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);

      const currentVideos: any[] = (profile as any)?.recruitingVideos ?? [];

      const newVideo = {
        id: crypto.randomUUID(),
        provider: "s3",
        key: input.key,
        url: input.publicUrl,
        type: input.mediaType,
        title: input.title || `${input.mediaType.replace("_", " ")} video`,
        description: input.description || "",
        sport: input.sport || profile?.sport || "",
        isHighlightReel: input.isHighlightReel,
        uploadedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      };

      const updatedVideos = [...currentVideos, newVideo];

      // Update profile
      if (profile) {
        await db.update(athleteProfiles)
          .set({
            // @ts-ignore — recruitingVideos is a JSON column we're adding
            recruitingVideos: updatedVideos,
            // If this is the highlight reel, also update highlightUrl
            ...(input.isHighlightReel ? { highlightUrl: input.publicUrl } : {}),
            updatedAt: new Date(),
          })
          .where(eq(athleteProfiles.userId, ctx.user.id));
      } else {
        await db.insert(athleteProfiles).values({
          userId: ctx.user.id,
          // @ts-ignore
          recruitingVideos: updatedVideos,
          ...(input.isHighlightReel ? { highlightUrl: input.publicUrl } : {}),
        });
      }

      return { success: true, video: newVideo };
    }),

  /**
   * Get all recruiting videos for an athlete
   */
  getAthleteVideos: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, input.userId)).limit(1);
      return (profile as any)?.recruitingVideos ?? [];
    }),

  /**
   * Get my own recruiting videos
   */
  getMyVideos: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
    const [profile] = await db.select().from(athleteProfiles)
      .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);
    return (profile as any)?.recruitingVideos ?? [];
  }),

  /**
   * Delete a video
   */
  deleteVideo: protectedProcedure
    .input(z.object({ videoId: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Remove from S3 only for platform-storage keys. Vimeo-backed videos are
      // removed from the AthlynXAI profile list here; source deletion on Vimeo
      // should be an explicit owner/admin action, not an accidental profile delete.
      const isVimeoKey = input.key.startsWith("/videos/") || input.key.includes("vimeo.com") || /^\d+$/.test(input.key);
      const s3 = getS3();
      if (!isVimeoKey && s3 && BUCKET) {
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: input.key }));
        } catch (e) {
          console.warn("[Media] S3 delete failed:", e);
        }
      }

      // Remove from profile
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);
      const currentVideos: any[] = (profile as any)?.recruitingVideos ?? [];
      const updatedVideos = currentVideos.filter((v: any) => v.id !== input.videoId);

      await db.update(athleteProfiles)
        .set({ recruitingVideos: updatedVideos as any, updatedAt: new Date() } as any)
        .where(eq(athleteProfiles.userId, ctx.user.id));

      return { success: true };
    }),

  /**
   * Increment video view count
   */
  recordView: publicProcedure
    .input(z.object({ userId: z.number(), videoId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, input.userId)).limit(1);
      const videos: any[] = (profile as any)?.recruitingVideos ?? [];
      const updated = videos.map((v: any) =>
        v.id === input.videoId ? { ...v, views: (v.views || 0) + 1 } : v
      );
      await db.update(athleteProfiles)
        .set({ recruitingVideos: updated as any, updatedAt: new Date() } as any)
        .where(eq(athleteProfiles.userId, input.userId));
      return { success: true };
    }),
});
