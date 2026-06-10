type VimeoUploadTicket = {
  uri: string;
  name?: string;
  description?: string;
  link?: string;
  player_embed_url?: string;
  upload?: {
    approach?: string;
    upload_link?: string;
    complete_uri?: string;
    status?: string;
    size?: number;
  };
  privacy?: {
    view?: string;
    embed?: string;
  };
  pictures?: {
    base_link?: string;
    sizes?: Array<{ width: number; height: number; link: string; link_with_play_button?: string }>;
  };
  transcode?: {
    status?: string;
  };
};

export type VimeoVideoMetadata = {
  uri: string;
  id: string;
  name: string;
  description: string;
  link: string;
  playerUrl: string;
  embedHtml?: string;
  thumbnailUrl?: string;
  processingStatus: "uploading" | "processing" | "ready" | "failed" | "unknown";
};

const VIMEO_API_BASE = "https://api.vimeo.com";
const DEFAULT_ALLOWED_DOMAINS = ["athlynx.ai", "www.athlynx.ai"];

function getAccessToken(): string | null {
  return process.env.VIMEO_ACCESS_TOKEN?.trim() || null;
}

export function isVimeoConfigured(): boolean {
  return Boolean(getAccessToken());
}

function getAllowedDomains(): string[] {
  const configured = process.env.VIMEO_ALLOWED_DOMAINS?.split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
  return configured?.length ? configured : DEFAULT_ALLOWED_DOMAINS;
}

function getDefaultViewPrivacy(): "disable" | "unlisted" | "nobody" {
  const value = process.env.VIMEO_VIEW_PRIVACY?.trim();
  if (value === "unlisted" || value === "nobody") return value;
  return "disable";
}

async function vimeoRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Vimeo is not configured. Missing VIMEO_ACCESS_TOKEN.");

  const response = await fetch(`${VIMEO_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.vimeo.*+json;version=3.4",
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Vimeo API ${response.status}: ${body || response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function extractVimeoId(uri: string): string {
  return uri.split("/").filter(Boolean).pop() || uri;
}

function mapProcessingStatus(video: VimeoUploadTicket): VimeoVideoMetadata["processingStatus"] {
  const uploadStatus = video.upload?.status;
  const transcodeStatus = video.transcode?.status;
  if (uploadStatus === "in_progress") return "uploading";
  if (transcodeStatus === "in_progress") return "processing";
  if (transcodeStatus === "complete") return "ready";
  if (transcodeStatus === "error" || uploadStatus === "error") return "failed";
  return "unknown";
}

function pickThumbnail(video: VimeoUploadTicket): string | undefined {
  const sizes = video.pictures?.sizes || [];
  const preferred = [...sizes].sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
  return preferred?.link_with_play_button || preferred?.link || video.pictures?.base_link;
}

export function normalizeVimeoVideo(video: VimeoUploadTicket, embedHtml?: string): VimeoVideoMetadata {
  const id = extractVimeoId(video.uri);
  return {
    uri: video.uri,
    id,
    name: video.name || "AthlynXAI Recruiting Video",
    description: video.description || "",
    link: video.link || `https://vimeo.com/${id}`,
    playerUrl: video.player_embed_url || `https://player.vimeo.com/video/${id}`,
    embedHtml,
    thumbnailUrl: pickThumbnail(video),
    processingStatus: mapProcessingStatus(video),
  };
}

export async function createVimeoTusUpload(input: {
  filename: string;
  fileSizeBytes: number;
  title: string;
  description?: string;
}): Promise<{ uploadLink: string; completeUri?: string; video: VimeoVideoMetadata; raw: VimeoUploadTicket }> {
  const payload = {
    upload: {
      approach: "tus",
      size: input.fileSizeBytes,
    },
    name: input.title,
    description: input.description || "AthlynXAI athlete recruiting video.",
    privacy: {
      view: getDefaultViewPrivacy(),
      embed: "whitelist",
      download: false,
      comments: "nobody",
    },
  };

  const raw = await vimeoRequest<VimeoUploadTicket>("/me/videos", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!raw.upload?.upload_link) throw new Error("Vimeo did not return a tus upload link.");

  await allowDefaultDomains(raw.uri).catch((error) => {
    console.warn("[Vimeo] Domain whitelist setup failed; upload ticket still created", error);
  });

  return {
    uploadLink: raw.upload.upload_link,
    completeUri: raw.upload.complete_uri,
    video: normalizeVimeoVideo(raw),
    raw,
  };
}

export async function getVimeoVideo(uriOrId: string): Promise<VimeoVideoMetadata> {
  const path = uriOrId.startsWith("/videos/") ? uriOrId : `/videos/${uriOrId}`;
  const raw = await vimeoRequest<VimeoUploadTicket>(path, { method: "GET" });
  const embedHtml = await getVimeoEmbed(raw.link || `https://vimeo.com/${extractVimeoId(raw.uri)}`).catch(() => undefined);
  return normalizeVimeoVideo(raw, embedHtml);
}

export async function allowDefaultDomains(uriOrId: string): Promise<void> {
  const id = extractVimeoId(uriOrId);
  for (const domain of getAllowedDomains()) {
    await vimeoRequest<void>(`/videos/${id}/privacy/domains/${encodeURIComponent(domain)}`, {
      method: "PUT",
      body: JSON.stringify({}),
    });
  }
}

export async function getVimeoEmbed(videoUrl: string): Promise<string | undefined> {
  const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}&responsive=true`);
  if (!response.ok) return undefined;
  const data = await response.json() as { html?: string };
  return data.html;
}
