/**
 * AthlynX — Social Command Center Router
 * Gemini AI post generation + Buffer (all 10 channels) + Zapier LinkedIn
 * Gravatar avatar sync
 *
 * Buffer API rules (from AthlynXAI_MASTER_REFERENCE.md):
 *   - NEVER use fragments (... on Post { id }) — return type is PostActionPayload
 *   - NEVER use scheduledAt: null
 *   - ALWAYS use schedulingType: automatic + mode: shareNow
 *   - Success = PostActionSuccess __typename
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { chatWithGemini } from "../services/gemini";
import { getGravatarUrl } from "../services/gravatar";
import { checkSocialPostingGuard } from "../services/socialPostingGuard";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN ?? "";
const ZAPIER_MCP_TOKEN = process.env.ZAPIER_MCP_TOKEN ?? "";

// ─── CORRECT Buffer Channel IDs (from AthlynXAI_MASTER_REFERENCE.md) ─────────
const BUFFER_CHANNELS: Record<string, string> = {
  instagram:       "69e6cca6031bfa423c26478e", // Instagram chad_dozier
  linkedin:        "69e6cd3f031bfa423c264c63", // LinkedIn
  youtube:         "69e6cd7c031bfa423c264dd5", // YouTube
  tiktok:          "69e6cd99031bfa423c264e8c", // TikTok chadadozierdozier (video only)
  google_business: "69e6cdf3031bfa423c2650a8", // Google Business
  twitter:         "69e6ce05031bfa423c265121", // X/Twitter ChadADozier2
  tiktok2:         "69e6ce56031bfa423c2652c8", // TikTok cdozier75 (video only)
  instagram2:      "69e6ce77031bfa423c265389", // Instagram chaddozier14
  facebook:        "69f29ddf5c4c051afaf3e12e", // Facebook AthlynX Ecosystem
  facebook2:       "69f3f06f5c4c051afaf9eeb7", // Facebook Chad Allen Dozier Sr
};

const PLATFORM_VOICE: Record<string, string> = {
  linkedin:        "professional, thought-leadership, investor-facing, no emojis except 1-2 max, paragraph format",
  instagram:       "casual, energetic, heavy emojis, short punchy lines, 5-10 hashtags",
  instagram2:      "casual, energetic, heavy emojis, short punchy lines, 5-10 hashtags",
  twitter:         "punchy, under 280 chars, 1-3 hashtags, bold statement or question",
  tiktok:          "Gen-Z energy, hook in first line, call to action, trending hashtags",
  tiktok2:         "Gen-Z energy, hook in first line, call to action, trending hashtags",
  facebook:        "conversational, community-focused, medium length, 3-5 hashtags",
  facebook2:       "conversational, community-focused, medium length, 3-5 hashtags",
  google_business: "professional, local business tone, brief, include website athlynx.ai",
};

// ─── CORRECT Buffer GraphQL mutation ─────────────────────────────────────────
// NEVER use fragments. NEVER use scheduledAt. Use schedulingType + mode.
const BUFFER_MUTATION = `
  mutation CreatePost($channelId: String!, $text: String!) {
    createPost(input: {
      channelId: $channelId
      text: $text
      schedulingType: automatic
      mode: shareNow
    }) {
      __typename
    }
  }
`;

async function postToBuffer(channelIds: string[], text: string, _imageUrl?: string) {
  if (!BUFFER_TOKEN) return { results: [], posted: 0, error: "Buffer token not configured" };

  const results: { channel: string; success: boolean; id?: string; error?: string }[] = [];

  for (const [channel, channelId] of Object.entries(BUFFER_CHANNELS)) {
    if (!channelIds.includes(channelId)) continue;
    try {
      const res = await fetch("https://api.buffer.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BUFFER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: BUFFER_MUTATION,
          variables: { channelId, text },
        }),
      });
      const data = await res.json() as any;
      const post = data?.data?.createPost;
      // Success = PostActionSuccess __typename (any non-null __typename means success)
      if (post?.__typename) {
        results.push({ channel, success: true, id: post.__typename });
      } else {
        const errMsg = data?.errors?.[0]?.message || data?.data?.createPost?.message || "Unknown error";
        results.push({ channel, success: false, error: errMsg });
      }
    } catch (err: any) {
      results.push({ channel, success: false, error: err.message });
    }
  }

  return { results, posted: results.filter(r => r.success).length };
}

async function postToLinkedInViaZapier(text: string, url?: string, title?: string, imageUrl?: string) {
  if (!ZAPIER_MCP_TOKEN) return { success: false, error: "Zapier token not configured" };
  try {
    const body: any = {
      action_key: "share",
      app: "LinkedIn",
      action: "share",
      output: "id",
      instructions: "Post this to LinkedIn immediately",
      params: {
        comment: text,
        visibility__code: "anyone",
      },
    };
    if (url) body.params.content__submitted_url = url;
    if (title) body.params.content__title = title;
    if (imageUrl) body.params.content__submitted_image_url = imageUrl;

    const res = await fetch("https://mcp.zapier.com/api/mcp/v1/tools/execute", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ZAPIER_MCP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json() as any;
    if (data?.results || data?.execution?.status === "SUCCESS") {
      return { success: true, url: data.results };
    }
    return { success: false, error: data?.error || "LinkedIn post failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

const CHANNEL_ENUM = z.enum([
  "twitter", "facebook", "facebook2", "instagram", "instagram2",
  "tiktok", "tiktok2", "google_business", "linkedin", "youtube",
]);

function requireExplicitDirectPostingOverride() {
  const enabled = ["true", "1", "yes"].includes((process.env.SOCIAL_DIRECT_POSTING_ENABLED ?? "").toLowerCase());
  if (!enabled) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Direct social posting is disabled by AthlynXAI OS. Save content to the Social OS vault, approve it, and let the owned queue/worker publish with audit proof and retries.",
    });
  }
}

export const socialRouter = router({
  // ─── Generate AI post content for a specific platform ─────────────────────
  generatePost: protectedProcedure
    .input(z.object({
      topic: z.string().min(1).max(500),
      platform: z.enum(["linkedin", "instagram", "twitter", "tiktok", "facebook", "all"]),
      tone: z.enum(["professional", "casual", "hype", "inspirational", "educational"]).default("professional"),
      includeHashtags: z.boolean().default(true),
      includeEmoji: z.boolean().default(true),
      customContext: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const platforms = input.platform === "all"
        ? ["linkedin", "instagram", "twitter", "tiktok", "facebook"]
        : [input.platform];

      const results: Record<string, string> = {};

      for (const platform of platforms) {
        const voice = PLATFORM_VOICE[platform] || "professional";
        const prompt = `You are a world-class social media strategist for AthlynXAI — the #1 athlete platform.

Write a ${input.tone} ${platform} post about: "${input.topic}"

Platform voice: ${voice}
${input.customContext ? `Additional context: ${input.customContext}` : ""}
${input.includeHashtags ? "Include relevant hashtags." : "No hashtags."}
${input.includeEmoji ? "Use appropriate emojis." : "No emojis."}

Always include athlynx.ai in the post naturally.
Write ONLY the post text — no explanations, no "Here's your post:", just the post itself.`;

        const text = await chatWithGemini(prompt, {
          temperature: 0.85,
          maxOutputTokens: 1024,
        });
        results[platform] = text.trim();
      }

      return { posts: results };
    }),

  // ─── Publish to Buffer (all text channels) ────────────────────────────────
  publishToBuffer: protectedProcedure
    .input(z.object({
      text: z.string().min(1),
      channels: z.array(CHANNEL_ENUM).min(1),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      requireExplicitDirectPostingOverride();
      const guard = checkSocialPostingGuard();
      if (!guard.allowed) {
        throw new TRPCError({ code: "FORBIDDEN", message: guard.reason });
      }
      const channelIds = input.channels.map(c => BUFFER_CHANNELS[c]).filter(Boolean);
      return postToBuffer(channelIds, input.text, input.imageUrl);
    }),

  // ─── Publish to LinkedIn via Zapier ───────────────────────────────────────
  publishToLinkedIn: protectedProcedure
    .input(z.object({
      text: z.string().min(1),
      url: z.string().optional(),
      title: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      requireExplicitDirectPostingOverride();
      const guard = checkSocialPostingGuard();
      if (!guard.allowed) {
        throw new TRPCError({ code: "FORBIDDEN", message: guard.reason });
      }
      return postToLinkedInViaZapier(input.text, input.url, input.title, input.imageUrl);
    }),

  // ─── Publish to ALL platforms at once ─────────────────────────────────────
  publishToAll: protectedProcedure
    .input(z.object({
      linkedinText: z.string(),
      socialText: z.string(),
      // Default: all text-capable channels (no TikTok — video only)
      channels: z.array(CHANNEL_ENUM).default([
        "twitter", "facebook", "facebook2", "instagram", "instagram2", "google_business",
      ]),
      url: z.string().optional(),
      title: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      requireExplicitDirectPostingOverride();
      const guard = checkSocialPostingGuard();
      if (!guard.allowed) {
        throw new TRPCError({ code: "FORBIDDEN", message: guard.reason });
      }
      const [bufferResult, linkedInResult] = await Promise.all([
        postToBuffer(
          input.channels.map(c => BUFFER_CHANNELS[c]).filter(Boolean),
          input.socialText,
          input.imageUrl
        ),
        postToLinkedInViaZapier(input.linkedinText, input.url, input.title, input.imageUrl),
      ]);
      return {
        buffer: bufferResult,
        linkedin: linkedInResult,
        totalPosted: (bufferResult.results?.filter(r => r.success).length ?? 0) + (linkedInResult.success ? 1 : 0),
      };
    }),

  // ─── Sync Gravatar avatar for current user ────────────────────────────────
  syncGravatar: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const email = ctx.user.email;
      if (!email) throw new Error("No email on account");
      const avatarUrl = await getGravatarUrl(email);
      if (!avatarUrl) return { synced: false, message: "No Gravatar found for this email" };
      await db.update(users).set({ avatarUrl }).where(eq(users.id, ctx.user.id));
      return { synced: true, avatarUrl, message: "Gravatar synced successfully" };
    }),

  // ─── Get Gravatar URL for any email (public) ──────────────────────────────
  getGravatarUrl: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const url = await getGravatarUrl(input.email);
      return { url };
    }),
});
