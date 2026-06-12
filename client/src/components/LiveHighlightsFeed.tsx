// LiveHighlightsFeed — Game-day highlight reel for athlynx.ai
// Pulls official NCAA/ESPN/SEC highlight clips from YouTube + features
// AthlynX original content (The Athlete's Playbook episodes) in the same grid.
//
// Built May 31, 2026 · S1E2 FIRST LIVE launch weekend
// Brand lock: true black + electric cobalt #1E90FF + cyan #00C2FF + white.
//
// LEGAL: Only embeds publicly-available highlight clips via YouTube IFrame API
// (allowed by YouTube ToS). Never embeds live broadcast streams.

import { useState, useEffect, useMemo } from "react";

// 
// Hand-curated featured clips — refreshed for S1E2 launch weekend
// These are the most relevant active-tournament videos. The YouTube search
// fallback below picks up newer clips automatically.
// 

interface HighlightClip {
  id: string;             // YouTube video ID, OR "athlynx:<slug>" for our own
  title: string;
  channel: string;
  thumb?: string;         // override; otherwise YouTube auto-thumb
  category: "mcws" | "athlynx" | "general";
  badge?: string;
}

export const FEATURED_HIGHLIGHTS: HighlightClip[] = [
  //  AthlynX original content (anchor the feed) 
  {
    id: "QDKXVmbEcsg",
    title: "The Athlete Leap Is Here — AthlynXAI Named Nebius Semifinalist",
    channel: "AthlynXAI · The Athlete's Playbook E2",
    category: "athlynx",
    badge: "ATHLYNX ORIGINAL",
  },
  //  MCWS coverage 
  {
    id: "mcws-search",
    title: "Road to Omaha · Regional Highlights",
    channel: "NCAA Baseball · ESPN · SEC Network",
    category: "mcws",
    badge: "MCWS · REGIONALS",
  },
];

// 
// YouTube search — pulls latest official highlight uploads in the last 24h
// Uses YouTube Data API v3 search.list. Public read endpoint — no OAuth needed
// when using a server-side proxy or a public-quota API key. We use the same
// pattern as the existing /api/youtube proxy in this app.
// 

interface YouTubeSearchItem {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
}

// Two-tier YouTube fetch:
//   1) PRIMARY — server proxy /api/youtube/highlights (uses server-side
//      YOUTUBE_HIGHLIGHTS_API_KEY; no browser referrer dependency; in-memory
//      60s cache for quota safety).
//   2) FALLBACK — direct call to googleapis.com using VITE_YOUTUBE_API_KEY
//      (browser-referrer-restricted key) if the proxy returns no items.
// This guarantees highlights render on production whether the Vite env key is
// present at build time or not.

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";

async function fetchProxyHighlights(
  query: string,
  maxResults: number,
): Promise<YouTubeSearchItem[]> {
  const params = new URLSearchParams({ q: query, max: String(maxResults) });
  const res = await fetch(`/api/youtube/highlights?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  const data = await res.json();
  const items: any[] = data?.items ?? [];
  return items
    .map((it) => ({
      videoId: it.videoId ?? "",
      title: it.title ?? "",
      channelTitle: it.channelTitle ?? "",
      publishedAt: it.publishedAt ?? "",
      thumbnail:
        it.thumbnail ?? (it.videoId ? `https://i.ytimg.com/vi/${it.videoId}/hqdefault.jpg` : ""),
    }))
    .filter((x) => !!x.videoId);
}

async function fetchDirectHighlights(
  query: string,
  maxResults: number,
  apiKey: string,
): Promise<YouTubeSearchItem[]> {
  const publishedAfter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString();
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: query,
    maxResults: String(maxResults),
    order: "date",
    videoEmbeddable: "true",
    publishedAfter,
    safeSearch: "strict",
    key: apiKey,
  });
  const r = await fetch(`${YT_API_BASE}/search?${params.toString()}`);
  if (!r.ok) throw new Error(`YouTube ${r.status}`);
  const data = await r.json();
  return (data?.items ?? [])
    .map((it: any) => ({
      videoId: it?.id?.videoId ?? "",
      title: it?.snippet?.title ?? "",
      channelTitle: it?.snippet?.channelTitle ?? "",
      publishedAt: it?.snippet?.publishedAt ?? "",
      thumbnail:
        it?.snippet?.thumbnails?.high?.url ??
        it?.snippet?.thumbnails?.medium?.url ??
        `https://i.ytimg.com/vi/${it?.id?.videoId}/hqdefault.jpg`,
    }))
    .filter((x: YouTubeSearchItem) => !!x.videoId);
}

// Canonical proxy-first fetcher — matches Chad's exact pattern:
//   1. /api/youtube/highlights?q=...  (uses server YOUTUBE_HIGHLIGHTS_API_KEY,
//      60s in-memory cache). Shape: { items: [...] } from rest-shims.ts.
//   2. Fallback: direct googleapis.com search if VITE_YOUTUBE_API_KEY is set.
//   3. Otherwise return [] silently — anchor/curated cards still render.
async function fetchHighlights(query: string): Promise<YouTubeSearchItem[]> {
  // 1) Proxy first — works with no client key.
  try {
    const res = await fetch(
      `/api/youtube/highlights?q=${encodeURIComponent(query)}&max=6`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      const items: any[] = data?.items ?? data?.videos ?? (Array.isArray(data) ? data : []);
      const mapped = items
        .map((it: any) => ({
          videoId: it.videoId ?? it?.id?.videoId ?? "",
          title: it.title ?? it?.snippet?.title ?? "",
          channelTitle: it.channelTitle ?? it?.snippet?.channelTitle ?? "",
          publishedAt: it.publishedAt ?? it?.snippet?.publishedAt ?? "",
          thumbnail:
            it.thumbnail ??
            it?.snippet?.thumbnails?.high?.url ??
            it?.snippet?.thumbnails?.medium?.url ??
            (it.videoId
              ? `https://i.ytimg.com/vi/${it.videoId}/hqdefault.jpg`
              : ""),
        }))
        .filter((x: YouTubeSearchItem) => !!x.videoId);
      if (mapped.length > 0) return mapped;
    }
  } catch {
    // proxy unreachable — fall through
  }
  // 2) Direct fallback if VITE_YOUTUBE_API_KEY is present.
  const key = (import.meta as any)?.env?.VITE_YOUTUBE_API_KEY as string | undefined;
  if (!key) return [];
  try {
    return await fetchDirectHighlights(query, 6, key);
  } catch {
    return [];
  }
}

function useYouTubeHighlights(query: string, enabled: boolean) {
  const [items, setItems] = useState<YouTubeSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);
    fetchHighlights(query)
      .then((it) => {
        if (cancelled) return;
        setItems(it);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setErr(e?.message ?? "highlight fetch failed");
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, enabled]);

  return { items, loading, err };
}

// 
// HighlightCard — single video tile
// 

function HighlightCard({
  videoId,
  title,
  channel,
  badge,
  thumb,
  onPlay,
}: {
  videoId: string;
  title: string;
  channel: string;
  badge?: string;
  thumb?: string;
  onPlay: () => void;
}) {
  const thumbUrl = thumb ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <button
      onClick={onPlay}
      data-testid={`highlight-card-${videoId}`}
      className="group relative aspect-video bg-black border border-white/10 rounded-lg overflow-hidden hover:border-[#1E90FF]/60 transition text-left"
    >
      <img
        src={thumbUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
        loading="lazy"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      {/* Play icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[#1E90FF]/90 flex items-center justify-center group-hover:scale-110 transition shadow-2xl shadow-[#1E90FF]/40">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white ml-1" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {/* Badge */}
      {badge && (
        <div className="absolute top-2 left-2 bg-[#1E90FF] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1 rounded">
          {badge}
        </div>
      )}
      {/* Title block */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-[10px] text-[#00C2FF] uppercase tracking-widest font-bold mb-1 line-clamp-1">
          {channel}
        </div>
        <div className="text-sm font-bold text-white leading-tight line-clamp-2">
          {title}
        </div>
      </div>
    </button>
  );
}

// 
// VideoModal — IFrame embed player
// 

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      data-testid="video-modal-backdrop"
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden border-2 border-[#1E90FF]/40 shadow-2xl shadow-[#1E90FF]/30"
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          title="Highlight video"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
        <button
          onClick={onClose}
          data-testid="video-modal-close"
          className="absolute -top-2 -right-2 md:top-4 md:right-4 w-10 h-10 rounded-full bg-white text-black font-black text-lg shadow-xl flex items-center justify-center hover:scale-110 transition"
          aria-label="Close video"
        >
          
        </button>
      </div>
    </div>
  );
}

// 
// LiveHighlightsFeed — main component
// 

interface LiveHighlightsFeedProps {
  /** Which tournament to feature first. "auto" picks based on CT time. */
  mode?: "auto" | "mcws" | "both";
  /** Compact mode for embeds inside other sections. */
  compact?: boolean;
}

export default function LiveHighlightsFeed({ mode = "auto", compact = false }: LiveHighlightsFeedProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "mcws" | "athlynx">(() => {
    if (mode === "mcws") return "mcws";
    return "all";
  });

  // Auto-fetch latest MCWS clips via our YouTube proxy
  const mcwsSearch = useYouTubeHighlights(
    "NCAA baseball regional 2026 highlights Road to Omaha",
    tab === "all" || tab === "mcws"
  );

  const cards = useMemo(() => {
    const all: HighlightClip[] = [];

    // 1) AthlynX original always first
    const athlynx = FEATURED_HIGHLIGHTS.filter((h) => h.category === "athlynx");
    if (tab === "all" || tab === "athlynx") all.push(...athlynx);

    // 2) Live MCWS from API
    if ((tab === "all" || tab === "mcws") && mcwsSearch.items.length > 0) {
      mcwsSearch.items.slice(0, tab === "mcws" ? 8 : 3).forEach((it) => {
        all.push({
          id: it.videoId,
          title: it.title,
          channel: it.channelTitle,
          thumb: it.thumbnail,
          category: "mcws",
          badge: "MCWS HIGHLIGHT",
        });
      });
    }

    return all;
  }, [tab, mcwsSearch.items]);

  const loading = (tab === "all" || tab === "mcws") && mcwsSearch.loading;

  return (
    <section
      data-testid="live-highlights-feed"
      className={`relative ${compact ? "py-8" : "py-12 md:py-16"} px-4 bg-gradient-to-b from-black via-[#0a1628] to-black border-y border-[#1E90FF]/20`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 bg-[#1E90FF] rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.32em] text-[#1E90FF] font-black">LIVE GAMES · HIGHLIGHTS FEED</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Every play. Every game. <span className="text-[#00C2FF]">One feed.</span>
            </h2>
            <p className="text-white/60 text-sm mt-2 max-w-2xl">
              Official Men's College World Series highlights from NCAA, ESPN, and SEC Network — refreshed automatically. Plus AthlynX original episodes from The Athlete's Playbook.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {([
              { id: "all", label: "All Games" },
              { id: "mcws", label: "MCWS" },
              { id: "athlynx", label: "AthlynX" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                data-testid={`highlights-tab-${t.id}`}
                className={`text-[10px] uppercase tracking-[0.22em] font-black px-3 py-2 rounded transition ${
                  tab === t.id
                    ? "bg-[#1E90FF] text-white"
                    : "bg-black border border-white/10 text-white/60 hover:text-white hover:border-[#1E90FF]/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((c) => (
            <HighlightCard
              key={`${c.category}-${c.id}`}
              videoId={c.id}
              title={c.title}
              channel={c.channel}
              badge={c.badge}
              thumb={c.thumb}
              onPlay={() => setPlayingId(c.id)}
            />
          ))}

          {loading && cards.length === 0 && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video bg-black border border-white/10 rounded-lg animate-pulse" />
              ))}
            </>
          )}

          {!loading && cards.length === 1 /* only the AthlynX anchor */ && (
            <div className="col-span-full text-center py-12">
              <div className="text-white/40 text-sm">
                Pulling the latest highlight clips from NCAA, ESPN, and SEC Network...
              </div>
              <div className="text-white/30 text-xs mt-2">
                Fresh game clips usually appear within 30 minutes of a play.
              </div>
            </div>
          )}
        </div>

        {/* Footer / CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            Highlights powered by YouTube · official channels only · auto-refreshed every visit
          </div>
          <div className="flex gap-2">
            <a
              href="/brackets/mcws"
              data-testid="link-to-mcws-brackets"
              className="text-[10px] uppercase tracking-[0.22em] font-black px-3 py-2 rounded bg-black border border-[#1E90FF]/40 text-[#00C2FF] hover:bg-[#1E90FF]/10 transition"
            >
              MCWS Bracket →
            </a>

          </div>
        </div>
      </div>

      {playingId && <VideoModal videoId={playingId} onClose={() => setPlayingId(null)} />}
    </section>
  );
}
