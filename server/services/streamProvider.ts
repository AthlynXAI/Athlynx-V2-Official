// AthlynX Network — StreamProvider interface.
// Cloudflare Stream first. Mux/YouTube/Vimeo can be added by implementing
// the same interface and swapping the export at the bottom of the file.

export type StreamProviderName = "cloudflare_stream" | "mux" | "youtube" | "vimeo";

export interface LiveInputCreateInput {
  name: string;
  recording?: boolean; // whether to record the stream for VOD
}

export interface LiveInput {
  providerStreamId: string; // Cloudflare live input UID
  rtmpsUrl: string;
  rtmpsStreamKey: string;
  playbackHlsUrl: string;
  playbackDashUrl?: string;
}

export interface VideoAsset {
  providerStreamId: string;
  playbackHlsUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
}

export interface StreamProvider {
  name: StreamProviderName;
  createLiveInput(input: LiveInputCreateInput): Promise<LiveInput>;
  getLiveInput(providerStreamId: string): Promise<LiveInput | null>;
  endLiveInput(providerStreamId: string): Promise<void>;
  getVideoAsset(providerStreamId: string): Promise<VideoAsset | null>;
  // Sign a short-lived upload URL the client can PUT a video file to.
  // Returns a provider-specific upload object (for Cloudflare Stream, an
  // `uploadURL` you POST a multipart body to).
  getUploadUrl(filename: string): Promise<{ uploadUrl: string; providerStreamId: string }>;
}

// ─── Cloudflare Stream implementation ───────────────────────────────────────
const CF_API = "https://api.cloudflare.com/client/v4";

function cfAuth(): { accountId: string; token: string } {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) {
    throw new Error("Cloudflare Stream credentials not configured");
  }
  return { accountId, token };
}

async function cfFetch(path: string, init?: RequestInit) {
  const { accountId, token } = cfAuth();
  const url = `${CF_API}/accounts/${accountId}${path}`;
  const r = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok || (body && body.success === false)) {
    const detail = JSON.stringify(body?.errors || body);
    throw new Error(`Cloudflare Stream API error ${r.status}: ${detail}`);
  }
  return body;
}

export const cloudflareStreamProvider: StreamProvider = {
  name: "cloudflare_stream",

  async createLiveInput(input) {
    const body = await cfFetch("/stream/live_inputs", {
      method: "POST",
      body: JSON.stringify({
        meta: { name: input.name },
        recording: { mode: input.recording ? "automatic" : "off" },
      }),
    });
    const r = body.result;
    return {
      providerStreamId: r.uid,
      rtmpsUrl: r.rtmps?.url || "",
      rtmpsStreamKey: r.rtmps?.streamKey || "",
      playbackHlsUrl: r.playback?.hls || "",
      playbackDashUrl: r.playback?.dash,
    };
  },

  async getLiveInput(providerStreamId) {
    try {
      const body = await cfFetch(`/stream/live_inputs/${providerStreamId}`);
      const r = body.result;
      return {
        providerStreamId: r.uid,
        rtmpsUrl: r.rtmps?.url || "",
        rtmpsStreamKey: r.rtmps?.streamKey || "",
        playbackHlsUrl: r.playback?.hls || "",
        playbackDashUrl: r.playback?.dash,
      };
    } catch {
      return null;
    }
  },

  async endLiveInput(providerStreamId) {
    await cfFetch(`/stream/live_inputs/${providerStreamId}`, { method: "DELETE" });
  },

  async getVideoAsset(providerStreamId) {
    try {
      const body = await cfFetch(`/stream/${providerStreamId}`);
      const r = body.result;
      return {
        providerStreamId: r.uid,
        playbackHlsUrl: r.playback?.hls || "",
        thumbnailUrl: r.thumbnail,
        durationSeconds: r.duration,
      };
    } catch {
      return null;
    }
  },

  async getUploadUrl(filename) {
    const body = await cfFetch("/stream/direct_upload", {
      method: "POST",
      body: JSON.stringify({
        maxDurationSeconds: 21600, // 6 hours
        meta: { name: filename },
      }),
    });
    return {
      uploadUrl: body.result.uploadURL,
      providerStreamId: body.result.uid,
    };
  },
};

// Default active provider — swap here to flip the whole platform.
export const streamProvider: StreamProvider = cloudflareStreamProvider;
