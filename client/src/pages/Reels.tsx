/**
 * AthlynX REELS — Full-screen vertical video feed
 * Facebook Reels / TikTok style — swipe up/down, like, comment, share, save
 * Athletes post highlight reels, training clips, game film
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const CDN = "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos";

// Seed reels using real CDN videos — athletes posting their highlights
const SEED_REELS = [
  {
    id: "r1",
    videoUrl: `${CDN}/SNHQDsOUVYFJwfUT.mp4`,
    poster: "https://athlynx.ai/athlete-football.jpg",
    athlete: { name: "Marcus Johnson", sport: "Football", position: "QB", school: "Texas A&M", avatar: "https://athlynx.ai/athlete-football.jpg" },
    caption: "7-on-7 route running — precision routes all day 🏈 #Football #Recruiting #NIL",
    likes: 1247,
    comments: 89,
    shares: 203,
    saves: 1200,
    audio: "Original Sound · Marcus Johnson",
    badge: "🏈 FOOTBALL",
    liked: false,
    saved: false,
  },
  {
    id: "r2",
    videoUrl: `${CDN}/ImBnRmTCxfoaENos.mp4`,
    poster: "https://athlynx.ai/athlete-baseball.jpg",
    athlete: { name: "Deon Williams", sport: "Baseball", position: "SS", school: "East Cobb Yankees", avatar: "https://athlynx.ai/athlete-baseball.jpg" },
    caption: "Positive angle through the ball — Brent Rooker mechanics study ⚾ #Baseball #DiamondGrind #NIL",
    likes: 607,
    comments: 13,
    shares: 35,
    saves: 1200,
    audio: "Zach Bryan · American...",
    badge: "⚾ BASEBALL",
    liked: false,
    saved: false,
  },
  {
    id: "r3",
    videoUrl: `${CDN}/exlwMUmNOQhJjidX.mp4`,
    poster: "https://athlynx.ai/athlete-basketball.jpg",
    athlete: { name: "Jordan Davis", sport: "Basketball", position: "PG", school: "Overtime Elite", avatar: "https://athlynx.ai/athlete-basketball.jpg" },
    caption: "Court vision + IQ — reading the defense before the pass 🏀 #Basketball #CourtKings #Recruiting",
    likes: 3891,
    comments: 247,
    shares: 512,
    saves: 2800,
    audio: "Original Sound · Jordan Davis",
    badge: "🏀 BASKETBALL",
    liked: false,
    saved: false,
  },
  {
    id: "r4",
    videoUrl: `${CDN}/SyHtmDgqKAycRzBN.mp4`,
    poster: "https://athlynx.ai/athlete-track.jpg",
    athlete: { name: "Aaliyah Thompson", sport: "Track & Field", position: "100m/200m", school: "LSU", avatar: "https://athlynx.ai/athlete-track.jpg" },
    caption: "Sub-11 training block 🔥 Building toward nationals. AthlynX tracking every rep 🏃‍♀️ #Track #NIL #Recruiting",
    likes: 2103,
    comments: 156,
    shares: 289,
    saves: 1900,
    audio: "Original Sound · Aaliyah Thompson",
    badge: "🏃 TRACK",
    liked: false,
    saved: false,
  },
  {
    id: "r5",
    videoUrl: `${CDN}/ZfMgzTWXcpwXcMCt.mp4`,
    poster: "https://athlynx.ai/athlete-training.jpg",
    athlete: { name: "AthlynXAI", sport: "Platform", position: "AI Coach", school: "athlynx.ai", avatar: "https://athlynx.ai/athlynx-icon.png" },
    caption: "AthlynXAI — The future of athlete development. Every sport. Every tool. Your edge. 🏆 #AthlynX #NIL #Recruiting",
    likes: 8420,
    comments: 634,
    shares: 1203,
    saves: 5600,
    audio: "Original Sound · AthlynXAI",
    badge: "🏆 AthlynX",
    liked: false,
    saved: false,
  },
  {
    id: "r6",
    videoUrl: `${CDN}/SwXAovMVYCnPjnZu.mp4`,
    poster: "https://athlynx.ai/champion-hero.jpg",
    athlete: { name: "Carlos Mendez", sport: "Soccer", position: "CAM", school: "Evoshield Canes", avatar: "https://athlynx.ai/athlete-football.jpg" },
    caption: "First touch + vision — this is what scouts want to see ⚽ #Soccer #PitchPulse #NIL",
    likes: 1876,
    comments: 94,
    shares: 178,
    saves: 1100,
    audio: "Original Sound · Carlos Mendez",
    badge: "⚽ SOCCER",
    liked: false,
    saved: false,
  },
];

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function ReelCard({
  reel,
  isActive,
  onLike,
  onSave,
}: {
  reel: typeof SEED_REELS[0];
  isActive: boolean;
  onLike: () => void;
  onSave: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isActive]);

  function togglePlay() {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play(); setPaused(false); }
    else { vid.pause(); setPaused(true); }
  }

  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      onLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={() => { togglePlay(); handleDoubleTap(); }}
        style={{ touchAction: "none" }}
      >
        <source src={reel.videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Pause indicator */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Double-tap heart */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
          <span className="text-7xl">❤️</span>
        </div>
      )}

      {/* Sport badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-black/60 backdrop-blur text-white text-xs font-black px-3 py-1.5 rounded-full border border-white/20">
          {reel.badge}
        </span>
      </div>

      {/* Mute button */}
      <button
        onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
        className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center"
      >
        {muted ? (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 18l2 2L21 18.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </button>

      {/* Right action rail */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
        {/* Like */}
        <button onClick={(e) => { e.stopPropagation(); onLike(); }} className="flex flex-col items-center gap-1">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${reel.liked ? "bg-red-500" : "bg-black/50 backdrop-blur"}`}>
            <svg className="w-6 h-6 text-white" fill={reel.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <span className="text-white text-xs font-bold drop-shadow">{formatCount(reel.likes + (reel.liked ? 1 : 0))}</span>
        </button>

        {/* Comment */}
        <Link href="/messenger" onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 bg-black/50 backdrop-blur rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <span className="text-white text-xs font-bold drop-shadow">{formatCount(reel.comments)}</span>
        </Link>

        {/* Share */}
        <button onClick={(e) => { e.stopPropagation(); navigator.share?.({ title: `${reel.athlete.name} on AthlynX`, url: window.location.href }); }} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 bg-black/50 backdrop-blur rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </div>
          <span className="text-white text-xs font-bold drop-shadow">{formatCount(reel.shares)}</span>
        </button>

        {/* Save */}
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} className="flex flex-col items-center gap-1">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${reel.saved ? "bg-blue-900/30" : "bg-black/50 backdrop-blur"}`}>
            <svg className="w-6 h-6 text-white" fill={reel.saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </div>
          <span className="text-white text-xs font-bold drop-shadow">{formatCount(reel.saves)}</span>
        </button>

        {/* Athlete avatar */}
        <div className="relative">
          <img
            src={reel.athlete.avatar}
            alt={reel.athlete.name}
            className="w-11 h-11 rounded-full border-2 border-white object-cover"
            onError={e => { (e.target as HTMLImageElement).src = "/athlynx-icon.png"; }}
          />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-black">
            <span className="text-white text-[8px] font-black">+</span>
          </div>
        </div>
      </div>

      {/* Bottom info overlay */}
      <div className="absolute bottom-0 left-0 right-14 p-4 z-10">
        {/* Athlete info */}
        <div className="flex items-center gap-2 mb-2">
          <Link href="/browse-athletes" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            <img
              src={reel.athlete.avatar}
              alt={reel.athlete.name}
              className="w-8 h-8 rounded-full border border-white/40 object-cover"
              onError={e => { (e.target as HTMLImageElement).src = "/athlynx-icon.png"; }}
            />
            <div>
              <span className="text-white font-black text-sm">{reel.athlete.name}</span>
              <span className="text-gray-300 text-xs ml-1">· {reel.athlete.sport}</span>
            </div>
          </Link>
          <Link
            href="/signup"
            onClick={(e) => e.stopPropagation()}
            className="ml-2 border border-white text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            Follow
          </Link>
        </div>

        {/* Caption */}
        <p className="text-white text-sm leading-relaxed mb-2 line-clamp-2">{reel.caption}</p>

        {/* School + Position */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-300 text-xs">🏫 {reel.athlete.school}</span>
          <span className="text-gray-500 text-xs">·</span>
          <span className="text-gray-300 text-xs">📍 {reel.athlete.position}</span>
        </div>

        {/* Audio */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: "3s" }}>
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <span className="text-white text-xs">{reel.audio}</span>
        </div>
      </div>
    </div>
  );
}

function ReelsInner() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [reels, setReels] = useState(SEED_REELS.map(r => ({ ...r })));
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") setActiveIndex(i => Math.min(i + 1, reels.length - 1));
      if (e.key === "ArrowUp" || e.key === "k") setActiveIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reels.length]);

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    isScrolling.current = false;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (isScrolling.current) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) setActiveIndex(i => Math.min(i + 1, reels.length - 1));
    else setActiveIndex(i => Math.max(i - 1, 0));
  }

  function handleLike(id: string) {
    setReels(prev => prev.map(r => r.id === id ? { ...r, liked: !r.liked } : r));
  }

  function handleSave(id: string) {
    setReels(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r));
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-3 pb-2">
        <button onClick={() => setLocation("/feed")} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-white font-black text-xl tracking-wide">Highlights</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/browse-athletes")} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          {user ? (
            <Link href="/profile">
              <img src={user.avatarUrl || "/athlynx-icon.png"} alt="Profile" className="w-7 h-7 rounded-full border border-white/40 object-cover" />
            </Link>
          ) : (
            <Link href="/signin" className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Reel progress dots */}
      <div className="absolute top-14 left-0 right-0 z-20 flex justify-center gap-1.5 px-4">
        {reels.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-0.5 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-white w-6" : "bg-white/40 w-2"}`}
          />
        ))}
      </div>

      {/* Reels container */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        >
          {reels.map((reel, i) => (
            <div key={reel.id} className="w-full h-full absolute" style={{ top: `${i * 100}%` }}>
              <ReelCard
                reel={reel}
                isActive={i === activeIndex}
                onLike={() => handleLike(reel.id)}
                onSave={() => handleSave(reel.id)}
              />
            </div>
          ))}
        </div>

        {/* Swipe hint on first load */}
        {activeIndex === 0 && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
            </svg>
            <span className="text-white/50 text-xs">Swipe up</span>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around py-3 px-2"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
          paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)",
        }}
      >
        {[
          { href: "/feed", icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", label: "Home" },
          { href: "/reels", icon: "M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", label: "Reels", active: true },
          { href: "/browse-athletes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Athletes" },
          { href: "/marketplace", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", label: "Market" },
          { href: "/notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", label: "Alerts" },
          { href: user ? "/profile" : "/signin", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: user ? "Profile" : "Sign In" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5"
            style={{ color: item.active ? "#00c8ff" : "rgba(255,255,255,0.7)" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span style={{ fontSize: "9px", fontWeight: item.active ? "800" : "500" }}>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Upload CTA for logged-in users */}
      {user && (
        <Link
          href="/feed"
          className="absolute bottom-20 right-4 z-30 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20"
          style={{ bottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </Link>
      )}
    </div>
  );
}

export default function Reels() {
  return <RouteErrorBoundary><ReelsInner /></RouteErrorBoundary>;
}
