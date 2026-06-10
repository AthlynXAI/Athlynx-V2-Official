#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const APPROVED_VIDEO_URL = process.env.APPROVED_VIDEO_URL;
const ZAPIER_MCP_URL = process.env.ZAPIER_MCP_URL;
const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
const MODE = process.env.SOCIAL_PUBLISH_MODE || "preflight";
const OUT = process.env.SOCIAL_PUBLISH_RESULT_FILE || "social-publish-results.json";

const FULL_CAPTION = process.env.SOCIAL_FULL_CAPTION || `It’s official. The Athlete’s Playbook Podcast is here.

We just wrapped Episode One, and this is only the beginning. The Athlete’s Playbook, powered by AthlynXAI, is built for student-athletes, coaches, recruiters, parents, trainers, and everyone navigating the NIL era with purpose.

We’ll be talking real stories from real athletes, NIL strategy, recruiting insight, faith, mindset, the grind behind the game, and the business of becoming an athlete.

Launching on Spotify for Creators. The full ATHLYNX platform goes live July 1, 2026 at https://athlynx.ai.

Stay tuned. Subscribe. Share this with an athlete, parent, coach, or trainer who needs to hear it.

Attitude of Gratitude. To God Be The Glory. Always.

#TheAthletesPlaybook #ATHLYNX #AthlynXAI #NIL #StudentAthletes #Podcast #SportsTech #Faith #Entrepreneurship #JulyFirst`;

const SHORT_CAPTION = process.env.SOCIAL_SHORT_CAPTION || "The Athlete’s Playbook Podcast is here. Episode One is coming soon. Powered by AthlynXAI. Built for student-athletes, coaches, recruiters, parents, trainers, and the NIL era. https://athlynx.ai #TheAthletesPlaybook #AthlynXAI #NIL";

const CHANNELS = [
  ["Instagram chad_dozier", "69e6cca6031bfa423c26478e", FULL_CAPTION],
  ["YouTube Chad A. Dozier", "69e6cd7c031bfa423c264dd5", FULL_CAPTION],
  ["TikTok chadadozierdozier", "69e6cd99031bfa423c264e8c", SHORT_CAPTION],
  ["Google Business VCT Holdings", "69e6cdf3031bfa423c2650a8", FULL_CAPTION],
  ["X/Twitter ChadADozier2", "69e6ce05031bfa423c265121", SHORT_CAPTION],
  ["TikTok cdozier75", "69e6ce56031bfa423c2652c8", SHORT_CAPTION],
  ["Instagram chaddozier14", "69e6ce77031bfa423c265389", FULL_CAPTION],
  ["Facebook Athlynx Ecosystem", "69f29ddf5c4c051afaf3e12e", FULL_CAPTION],
  ["Facebook Chad Allen Dozier Sr", "69f3f06f5c4c051afaf9eeb7", FULL_CAPTION],
];

function requireEnv(name, value) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
}

function redactError(err) {
  return String(err?.stack || err?.message || err).replace(/token=[^\s&]+/gi, "token=***REDACTED***").slice(0, 4000);
}

async function zapierCall(toolName, args) {
  requireEnv("ZAPIER_MCP_URL", ZAPIER_MCP_URL);
  const client = new Client({ name: "athlynx-social-publisher", version: "1.0" });
  const transport = new StreamableHTTPClientTransport(new URL(ZAPIER_MCP_URL));
  await client.connect(transport);
  try {
    return await client.callTool({ name: toolName, arguments: args });
  } finally {
    try { await client.close(); } catch {}
  }
}

function textOf(result) {
  return (result?.content || []).map((x) => x.text || JSON.stringify(x)).join("\n");
}

async function preflight() {
  const checks = [];
  if (ZAPIER_MCP_URL) {
    try {
      const tools = await zapierCall("list_enabled_zapier_actions", { app: "Buffer" });
      checks.push({ route: "zapier_buffer", ok: /Buffer/.test(textOf(tools)), detail: textOf(tools).slice(0, 1000) });
    } catch (err) {
      checks.push({ route: "zapier_buffer", ok: false, error: redactError(err) });
    }
  } else {
    checks.push({ route: "zapier_buffer", ok: false, error: "ZAPIER_MCP_URL missing" });
  }
  if (BUFFER_ACCESS_TOKEN) {
    try {
      const response = await fetch("https://api.buffer.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${BUFFER_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: "query { __typename }" }),
      });
      const payload = await response.json().catch(() => ({}));
      checks.push({ route: "buffer_graphql", ok: response.ok && !payload.errors, httpStatus: response.status, error: payload.errors?.[0]?.message });
    } catch (err) {
      checks.push({ route: "buffer_graphql", ok: false, error: redactError(err) });
    }
  } else {
    checks.push({ route: "buffer_graphql", ok: false, error: "BUFFER_ACCESS_TOKEN missing" });
  }
  return checks;
}

async function publishViaZapierBuffer() {
  requireEnv("APPROVED_VIDEO_URL", APPROVED_VIDEO_URL);
  const results = [];
  for (const [name, channelId, caption] of CHANNELS) {
    try {
      const result = await zapierCall("execute_zapier_write_action", {
        app: "Buffer",
        action: "update",
        instructions: `Share now to Buffer channel ID ${channelId} (${name}). Attach APPROVED_VIDEO_URL as the video/media asset if supported. Return the post URL/ID or exact error.`,
        params: {
          organizationId: "69e5eb4fa8900ccfe436f53a",
          channelId,
          method: "share_now",
          text: caption,
          message: caption,
          body: caption,
          update: caption,
          title: "The Athlete’s Playbook Podcast is here",
          media: APPROVED_VIDEO_URL,
          mediaUrl: APPROVED_VIDEO_URL,
          video: APPROVED_VIDEO_URL,
          videoUrl: APPROVED_VIDEO_URL,
          source: APPROVED_VIDEO_URL,
          link: APPROVED_VIDEO_URL,
        },
        output: "Return Buffer post/update URL, post ID, channel name, and status, or exact validation/authentication error.",
      });
      results.push({ channel: name, channelId, route: "zapier_buffer", result: textOf(result) });
    } catch (err) {
      results.push({ channel: name, channelId, route: "zapier_buffer", error: redactError(err) });
    }
  }
  return results;
}

async function publishViaBufferGraphql() {
  requireEnv("APPROVED_VIDEO_URL", APPROVED_VIDEO_URL);
  requireEnv("BUFFER_ACCESS_TOKEN", BUFFER_ACCESS_TOKEN);
  const mutation = `mutation CreatePost($channelId: ChannelId!, $text: String!, $assets: [AssetInput!]!) {
    createPost(input: { channelId: $channelId, text: $text, assets: $assets, schedulingType: automatic, mode: shareNow, source: "athlynx-social-publisher" }) {
      __typename
      ... on PostActionSuccess { post { id status dueAt } }
      ... on MutationError { message }
    }
  }`;
  const results = [];
  for (const [name, channelId, caption] of CHANNELS) {
    try {
      const response = await fetch("https://api.buffer.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${BUFFER_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          query: mutation,
          variables: {
            channelId,
            text: caption,
            assets: [{ video: { url: APPROVED_VIDEO_URL, metadata: { title: "The Athlete’s Playbook Podcast is here", thumbnailOffset: 1500 } } }],
          },
        }),
      });
      const payload = await response.json().catch(() => ({}));
      results.push({ channel: name, channelId, route: "buffer_graphql", httpStatus: response.status, payload });
    } catch (err) {
      results.push({ channel: name, channelId, route: "buffer_graphql", error: redactError(err) });
    }
  }
  return results;
}

async function main() {
  let result;
  if (MODE === "preflight") result = await preflight();
  else if (MODE === "zapier-buffer") result = await publishViaZapierBuffer();
  else if (MODE === "buffer-graphql") result = await publishViaBufferGraphql();
  else throw new Error(`Unknown SOCIAL_PUBLISH_MODE: ${MODE}`);
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(redactError(err));
  process.exit(1);
});
