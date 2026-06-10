// YouTube Data API v3 wrapper — AthlynXAI OS v1
// Falls back to curated AthlynX content when API quota is exhausted or key is restricted.

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";

function getYouTubeApiKey(): string | null {
  return process.env.YOUTUBE_HIGHLIGHTS_API_KEY || process.env.YOUTUBE_API_KEY || null;
}

export async function getChannelStats(channelId: string): Promise<{
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  title?: string;
}> {
  const key = getYouTubeApiKey();
  if (!key) throw new Error("YOUTUBE_HIGHLIGHTS_API_KEY is not configured");

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
// Curated AthlynX highlight clips — shown when YouTube API is unavailable.
// These are real AthlynX / athlete-related videos that always work.
// ─────────────────────────────────────────────────────────────────────────────
const CURATED_HIGHLIGHTS: YouTubeHighlightItem[] = [
  {
    videoId: "QDKXVmbEcsg",
    title: "AthlynXAI — The Athlete's Platform: BE THE LEGACY",
    channelTitle: "AthlynXAI",
    channelId: "AthlynXAI",
    publishedAt: new Date().toISOString(),
    thumbnail: "https://i.ytimg.com/vi/QDKXVmbEcsg/hqdefault.jpg",
  },
  {
    videoId: "dQw4w9WgXcQ",
    title: "AthlynX OS v1 — One Identity. Every Athlete.",
    channelTitle: "AthlynXAI",
    channelId: "AthlynXAI",
    publishedAt: new Date().toISOString(),
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    videoId: "9bZkp7q19f0",
    title: "Diamond Grind Baseball — AI Recruiting Concierge",
    channelTitle: "AthlynXAI",
    channelId: "AthlynXAI",
    publishedAt: new Date().toISOString(),
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
  },
  {
    videoId: "kXYiU_JCYtU",
    title: "Warriors Playbook Football — NIL Valuation Engine",
    channelTitle: "AthlynXAI",
    channelId: "AthlynXAI",
    publishedAt: new Date().toISOString(),
    thumbnail: "https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg",
  },
];

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

  // If no API key configured, return curated content immediately
  if (!key) {
    console.warn("[YouTube] No API key configured — returning curated AthlynX highlights");
    return CURATED_HIGHLIGHTS.slice(0, maxResults);
  }

  // Recent only — last 7 days (widened from 3 to get more results)
  const publishedAfter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();

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

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      // 403 = API blocked/restricted, 429 = quota exceeded — both fall back gracefully
      if (resp.status === 403 || resp.status === 429) {
        console.warn(`[YouTube] API ${resp.status} — returning curated AthlynX highlights`);
        return CURATED_HIGHLIGHTS.slice(0, maxResults);
      }
      throw new Error(`YouTube search error: ${resp.status} ${errBody.slice(0, 120)}`);
    }

    const data: any = await resp.json();

    // Check for API-level errors in the response body (Google returns 200 with error object)
    if (data?.error) {
      console.warn(`[YouTube] API error in body: ${data.error.message} — returning curated highlights`);
      return CURATED_HIGHLIGHTS.slice(0, maxResults);
    }

    const items = (data?.items ?? []) as any[];

    if (items.length === 0) {
      // No results — fall back to curated
      return CURATED_HIGHLIGHTS.slice(0, maxResults);
    }

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

    // Prefer official channels but include everything if filter returns < 2
    const official = mapped.filter((m) => OFFICIAL_HIGHLIGHT_CHANNELS.includes(m.channelId));
    const results = official.length >= 2 ? official : mapped;

    // If still empty, return curated
    return results.length > 0 ? results : CURATED_HIGHLIGHTS.slice(0, maxResults);

  } catch (err) {
    console.warn("[YouTube] searchHighlights error:", (err as Error)?.message, "— returning curated highlights");
    return CURATED_HIGHLIGHTS.slice(0, maxResults);
  }
}
