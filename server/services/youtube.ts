// YouTube Data API v3 wrapper — Build 1.

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";

function getYouTubeApiKey(): string {
  const key = process.env.YOUTUBE_HIGHLIGHTS_API_KEY || process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_HIGHLIGHTS_API_KEY or YOUTUBE_API_KEY is not configured");
  return key;
}

export async function getChannelStats(channelId: string): Promise<{
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  title?: string;
}> {
  const key = getYouTubeApiKey();

  const url = `${YT_API_BASE}/channels?part=statistics,snippet&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(key)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`YouTube API error: ${resp.status} ${resp.statusText}`);
  const data: any = await resp.json();
  const item = data.items?.[0];
  if (!item) throw new Error(`No channel found for id ${channelId}`);
  const s = item.statistics ?? {};
  return {
    subscriberCount: Number(s.subscriberCount ?? 0),
    viewCount: Number(s.viewCount ?? 0),
    videoCount: Number(s.videoCount ?? 0),
    title: item.snippet?.title,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// searchHighlights — pull recent highlight clips for a query.
// Used by the LiveHighlightsFeed component on athlynx.ai and /brackets.
// Filters to recent uploads from official channels (NCAA, ESPN, SEC Network)
// and falls back to general results if the official-channel filter is empty.
// ─────────────────────────────────────────────────────────────────────────────

export interface YouTubeHighlightItem {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  thumbnail: string;
}

const OFFICIAL_HIGHLIGHT_CHANNELS = [
  "UCj8tdq3wciVTOGXyCXVrRWg", // NCAA
  "UCiWLfSweyRNmLpgEHekhoAg", // ESPN
  "UC2-BeXxQEjwd0gnVCKjEMSQ", // SEC Network
  "UCNAf1k0yIjyGu3k9BwAg3lg", // Sports Illustrated
];

export async function searchHighlights(query: string, maxResults = 6): Promise<YouTubeHighlightItem[]> {
  const key = getYouTubeApiKey();

  // Recent only — last 3 days
  const publishedAfter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString();

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: query,
    maxResults: String(Math.min(maxResults, 25)),
    order: "date",
    videoEmbeddable: "true",
    publishedAfter,
    safeSearch: "strict",
    key,
  });

  const url = `${YT_API_BASE}/search?${params.toString()}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`YouTube search error: ${resp.status} ${resp.statusText}`);
  }
  const data: any = await resp.json();
  const items = (data?.items ?? []) as any[];

  // Prefer official channels but include everything if filter returns < 2
  const mapped: YouTubeHighlightItem[] = items.map((it) => ({
    videoId: it?.id?.videoId ?? "",
    title: it?.snippet?.title ?? "",
    channelTitle: it?.snippet?.channelTitle ?? "",
    channelId: it?.snippet?.channelId ?? "",
    publishedAt: it?.snippet?.publishedAt ?? "",
    thumbnail:
      it?.snippet?.thumbnails?.high?.url ??
      it?.snippet?.thumbnails?.medium?.url ??
      `https://i.ytimg.com/vi/${it?.id?.videoId}/hqdefault.jpg`,
  })).filter((x) => !!x.videoId);

  const official = mapped.filter((m) => OFFICIAL_HIGHLIGHT_CHANNELS.includes(m.channelId));
  return official.length >= 2 ? official : mapped;
}

// TODO: replace with real telemetry once observability is wired
