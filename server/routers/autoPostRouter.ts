/**
 * AutoPost Router — AthlynXAI
 * Permanent automated social media posting system
 * Posts to: Facebook Pages, Instagram Business, X/Twitter, LinkedIn
 * Uses tokens stored in Vercel env vars — NEVER expires, NEVER needs manual reconnect
 * Powered by Nebius AI for content generation
 *
 * Env vars needed in Vercel:
 * - FB_PAGE_ACCESS_TOKEN     (Facebook Page long-lived token — never expires)
 * - FB_PAGE_ID               (Facebook Page ID)
 * - FB_PAGE_ID_2             (Second Facebook Page ID — Chad Allen Dozier Sr)
 * - IG_USER_ID               (Instagram Business Account ID)
 * - TWITTER_BEARER_TOKEN     (X/Twitter Bearer Token)
 * - TWITTER_API_KEY          (X/Twitter API Key)
 * - TWITTER_API_SECRET       (X/Twitter API Secret)
 * - TWITTER_ACCESS_TOKEN     (X/Twitter Access Token)
 * - TWITTER_ACCESS_SECRET    (X/Twitter Access Token Secret)
 * - LINKEDIN_ACCESS_TOKEN    (LinkedIn Access Token)
 * - LINKEDIN_PERSON_URN      (LinkedIn Person URN)
 * - BUFFER_ACCESS_TOKEN      (Buffer API token — backup)
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { generateWithGemini } from "../services/gemini";
import { checkSocialPostingGuard } from "../services/socialPostingGuard";

// ─── MASTER OWNER — Chad A. Dozier Sr. ──────────────────────────────────────────
// Canonical identity: chaddozier75@gmail.com (per standing rule).
// Corporate aliases retained for backward compatibility with auth flows that
// surface @athlynx.ai or @dozierholdingsgroup.com email claims.
const OWNER_EMAILS = [
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
  "cdozier@dozierholdingsgroup.com",
];

function isOwner(email: string | null | undefined): boolean {
  return !!email && OWNER_EMAILS.includes(email.toLowerCase());
}

function requireExplicitDirectPostingOverride() {
  const enabled = ["true", "1", "yes"].includes((process.env.SOCIAL_DIRECT_POSTING_ENABLED ?? "").toLowerCase());
  if (!enabled) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Direct auto-posting is disabled by AthlynXAI OS. Route all content through the Social OS vault, approval gate, owned queue, audit trail, and retry worker.",
    });
  }
}

// ─── Facebook Graph API ────────────────────────────────────────────────────────
async function postToFacebook(message: string, pageId: string, accessToken: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const resp = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, access_token: accessToken }),
    });
    const data = await resp.json() as any;
    if (data.id) return { success: true, postId: data.id };
    return { success: false, error: data.error?.message || "Facebook post failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Instagram Graph API ───────────────────────────────────────────────────────
async function postToInstagram(caption: string, igUserId: string, accessToken: string, imageUrl?: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Step 1: Create media container
    const containerBody: any = { caption, access_token: accessToken };
    if (imageUrl) {
      containerBody.image_url = imageUrl;
      containerBody.media_type = "IMAGE";
    } else {
      // Text-only not supported on IG — use a branded image URL
      containerBody.image_url = "https://athlynx.ai/og-image.jpg";
      containerBody.media_type = "IMAGE";
    }

    const containerResp = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(containerBody),
    });
    const container = await containerResp.json() as any;
    if (!container.id) return { success: false, error: container.error?.message || "IG container creation failed" };

    // Step 2: Publish the container
    const publishResp = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id, access_token: accessToken }),
    });
    const published = await publishResp.json() as any;
    if (published.id) return { success: true, postId: published.id };
    return { success: false, error: published.error?.message || "IG publish failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── X/Twitter API v2 ─────────────────────────────────────────────────────────
async function postToTwitter(text: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { success: false, error: "Twitter credentials not configured" };
  }

  try {
    // OAuth 1.0a signature for Twitter v2
    const crypto = await import("crypto");
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString("hex");
    const url = "https://api.twitter.com/2/tweets";

    const oauthParams: Record<string, string> = {
      oauth_consumer_key: apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_token: accessToken,
      oauth_version: "1.0",
    };

    const paramString = Object.keys(oauthParams)
      .sort()
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
      .join("&");

    const sigBase = `POST&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
    const sigKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
    const signature = crypto.createHmac("sha1", sigKey).update(sigBase).digest("base64");

    const authHeader = "OAuth " + Object.entries({ ...oauthParams, oauth_signature: signature })
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ");

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await resp.json() as any;
    if (data.data?.id) return { success: true, tweetId: data.data.id };
    return { success: false, error: data.detail || data.errors?.[0]?.message || "Twitter post failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── LinkedIn API ──────────────────────────────────────────────────────────────
async function postToLinkedIn(text: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    return { success: false, error: "LinkedIn credentials not configured" };
  }

  try {
    const resp = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${personUrn}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });

    if (resp.ok) {
      const id = resp.headers.get("x-restli-id") || "posted";
      return { success: true, postId: id };
    }
    const data = await resp.json() as any;
    return { success: false, error: data.message || "LinkedIn post failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Buffer API (backup) ───────────────────────────────────────────────────────
async function postToBuffer(text: string, channelId: string): Promise<{ success: boolean; error?: string }> {
  // Hardcoded fallback token removed 2026-05-08 — token must come from env only.
  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) return { success: false, error: "BUFFER_ACCESS_TOKEN not configured" };
  try {
    const resp = await fetch("https://api.buffer.com/graphql", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation CreatePost($channelId: ChannelId!, $text: String!) { createPost(input: { channelId: $channelId text: $text schedulingType: automatic mode: shareNow }) { __typename } }`,
        variables: { channelId, text },
      }),
    });
    const data = await resp.json() as any;
    const typename = data?.data?.createPost?.__typename;
    if (typename === "PostActionSuccess") return { success: true };
    return { success: false, error: typename || "Buffer post failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const autoPostRouter = router({
  /**
   * Post to all social channels — permanent, no Buffer dependency
   * Admin only
   */
  postToAll: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      imageUrl: z.string().optional(),
      platforms: z.array(z.enum(["facebook", "instagram", "twitter", "linkedin", "buffer_linkedin", "buffer_twitter"])).default(["facebook", "instagram", "twitter", "linkedin"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!isOwner(ctx.user.email)) throw new Error("Unauthorized");
      requireExplicitDirectPostingOverride();
      const guard = checkSocialPostingGuard();
      if (!guard.allowed) {
        throw new TRPCError({ code: "FORBIDDEN", message: guard.reason });
      }

      const results: Record<string, { success: boolean; error?: string; postId?: string }> = {};

      // Facebook Page 1 (AthlynX Ecosystem)
      if (input.platforms.includes("facebook")) {
        const fbToken = process.env.FB_PAGE_ACCESS_TOKEN;
        const fbPageId = process.env.FB_PAGE_ID;
        if (fbToken && fbPageId) {
          results.facebook_athlynx = await postToFacebook(input.message, fbPageId, fbToken);
        } else {
          results.facebook_athlynx = { success: false, error: "FB_PAGE_ACCESS_TOKEN or FB_PAGE_ID not set in Vercel" };
        }

        // Facebook Page 2 (Chad Allen Dozier Sr)
        const fbPageId2 = process.env.FB_PAGE_ID_2;
        if (fbToken && fbPageId2) {
          results.facebook_chad = await postToFacebook(input.message, fbPageId2, fbToken);
        }
      }

      // Instagram Business
      if (input.platforms.includes("instagram")) {
        const fbToken = process.env.FB_PAGE_ACCESS_TOKEN;
        const igUserId = process.env.IG_USER_ID;
        if (fbToken && igUserId) {
          // Instagram caption max 2200 chars
          const caption = input.message.slice(0, 2200);
          results.instagram = await postToInstagram(caption, igUserId, fbToken, input.imageUrl);
        } else {
          results.instagram = { success: false, error: "IG_USER_ID or FB_PAGE_ACCESS_TOKEN not set in Vercel" };
        }
      }

      // X/Twitter
      if (input.platforms.includes("twitter")) {
        // Twitter max 280 chars — truncate intelligently
        const tweetText = input.message.length > 280
          ? input.message.slice(0, 277) + "..."
          : input.message;
        results.twitter = await postToTwitter(tweetText);
      }

      // LinkedIn
      if (input.platforms.includes("linkedin")) {
        results.linkedin = await postToLinkedIn(input.message);
      }

      // Buffer LinkedIn (backup)
      if (input.platforms.includes("buffer_linkedin")) {
        results.buffer_linkedin = await postToBuffer(input.message, "69e6cd3f031bfa423c264c63");
      }

      // Buffer X/Twitter (backup)
      if (input.platforms.includes("buffer_twitter")) {
        const tweetText = input.message.length > 280 ? input.message.slice(0, 277) + "..." : input.message;
        results.buffer_twitter = await postToBuffer(tweetText, "69e6ce05031bfa423c265121");
      }

      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;

      return {
        success: successCount > 0,
        results,
        summary: `${successCount}/${totalCount} platforms posted successfully`,
      };
    }),

  /**
   * Generate AI post content using Nebius + Gemini
   * Then post to all channels
   */
  generateAndPost: protectedProcedure
    .input(z.object({
      topic: z.string().min(1),
      tone: z.enum(["professional", "hype", "motivational", "educational"]).default("motivational"),
      includeHashtags: z.boolean().default(true),
      platforms: z.array(z.enum(["facebook", "instagram", "twitter", "linkedin", "buffer_linkedin", "buffer_twitter"])).default(["facebook", "instagram", "twitter", "linkedin"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!isOwner(ctx.user.email)) throw new Error("Unauthorized");
      requireExplicitDirectPostingOverride();
      const guard = checkSocialPostingGuard();
      if (!guard.allowed) {
        throw new TRPCError({ code: "FORBIDDEN", message: guard.reason });
      }

      // Generate content with Nebius AI
      const prompt = `Write a ${input.tone} social media post about: ${input.topic}

Platform: AthlynXAI — The global athlete social network
Brand voice: Bold, athlete-focused, results-driven, humble
Website: athlynx.ai

Requirements:
- Max 280 characters for Twitter version (we'll auto-truncate)
- Full version up to 500 characters for Facebook/Instagram/LinkedIn
- ${input.includeHashtags ? "Include 5-8 relevant hashtags at the end" : "No hashtags"}
- Never mention competitors
- Always include athlynx.ai

Write ONLY the post text, no quotes, no explanation.`;

      const generated = await generateWithGemini(prompt, {});
      const message = generated.trim();

      // Now post to all channels
      const results: Record<string, { success: boolean; error?: string; postId?: string }> = {};

      if (input.platforms.includes("facebook")) {
        const fbToken = process.env.FB_PAGE_ACCESS_TOKEN;
        const fbPageId = process.env.FB_PAGE_ID;
        if (fbToken && fbPageId) {
          results.facebook_athlynx = await postToFacebook(message, fbPageId, fbToken);
        } else {
          results.facebook_athlynx = { success: false, error: "FB tokens not in Vercel env" };
        }
        const fbPageId2 = process.env.FB_PAGE_ID_2;
        if (fbToken && fbPageId2) {
          results.facebook_chad = await postToFacebook(message, fbPageId2, fbToken);
        }
      }

      if (input.platforms.includes("instagram")) {
        const fbToken = process.env.FB_PAGE_ACCESS_TOKEN;
        const igUserId = process.env.IG_USER_ID;
        if (fbToken && igUserId) {
          results.instagram = await postToInstagram(message.slice(0, 2200), igUserId, fbToken);
        } else {
          results.instagram = { success: false, error: "IG tokens not in Vercel env" };
        }
      }

      if (input.platforms.includes("twitter")) {
        const tweetText = message.length > 280 ? message.slice(0, 277) + "..." : message;
        results.twitter = await postToTwitter(tweetText);
      }

      if (input.platforms.includes("linkedin")) {
        results.linkedin = await postToLinkedIn(message);
      }

      if (input.platforms.includes("buffer_linkedin")) {
        results.buffer_linkedin = await postToBuffer(message, "69e6cd3f031bfa423c264c63");
      }

      if (input.platforms.includes("buffer_twitter")) {
        const tweetText = message.length > 280 ? message.slice(0, 277) + "..." : message;
        results.buffer_twitter = await postToBuffer(tweetText, "69e6ce05031bfa423c265121");
      }

      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;

      return {
        success: successCount > 0,
        generatedMessage: message,
        results,
        summary: `${successCount}/${totalCount} platforms posted successfully`,
      };
    }),

  /**
   * Get social token status — shows which platforms are configured
   */
  getTokenStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!isOwner(ctx.user.email)) throw new Error("Unauthorized");
    return {
      facebook: !!(process.env.FB_PAGE_ACCESS_TOKEN && process.env.FB_PAGE_ID),
      instagram: !!(process.env.FB_PAGE_ACCESS_TOKEN && process.env.IG_USER_ID),
      twitter: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN),
      linkedin: !!(process.env.LINKEDIN_ACCESS_TOKEN),
      buffer: !!process.env.BUFFER_ACCESS_TOKEN,
      tokens: {
        FB_PAGE_ACCESS_TOKEN: process.env.FB_PAGE_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
        FB_PAGE_ID: process.env.FB_PAGE_ID ? "✅ Set" : "❌ Missing",
        FB_PAGE_ID_2: process.env.FB_PAGE_ID_2 ? "✅ Set" : "❌ Missing",
        IG_USER_ID: process.env.IG_USER_ID ? "✅ Set" : "❌ Missing",
        TWITTER_API_KEY: process.env.TWITTER_API_KEY ? "✅ Set" : "❌ Missing",
        TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
        LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
        BUFFER_ACCESS_TOKEN: process.env.BUFFER_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
      },
    };
  }),
});
