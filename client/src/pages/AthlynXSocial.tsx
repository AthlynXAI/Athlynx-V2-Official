import { useState, useEffect, useRef } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

/**
 * AthlynXSocial.tsx — The Athlete's Super-App Social Hub
 * Build 1 Session 2 — June 10 2026
 *
 * The FB-killer. Every feature athletes need in one place:
 * Feed · Stories · Groups · Reels · Live Video · Live Images · Stats
 * Analytics · Calendar · Events · Competitions · Tournaments · Showcases
 * Rec Leagues · Private Messaging · Recruiting · NIL · Advertising
 *
 * © 2026 AthlynX™ · Chad Allen Dozier Sr. · Be The Legacy
 * Powered by AthlynXAI OS · All rights reserved.
 */

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  base: "#040c1a",
  surface: "#071525",
  card: "#0a1e35",
  cardHover: "#0d2545",
  cobalt: "#0047AB",
  electric: "#1E90FF",
  stadium: "#00c2ff",
  granite: "#1e2d3d",
  border: "#0d2040",
  white: "#ffffff",
  text: "#e2e8f0",
  muted: "#64748b",
  secondary: "#94a3b8",
  gold: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  purple: "#8b5cf6",
};

// ─── SPORT SEASONS ───────────────────────────────────────────────────────────
const CURRENT_SEASON = {
  sport: "Baseball / Softball",
  event: "Road to Omaha · MCWS 2026",
  icon: "⚾",
  color: C.gold,
  urgency: "LIVE NOW",
};

// ─── SEED FEED DATA (shown until real posts exist in DB) ───────────────────────
const SEED_FEED_POSTS = [
  {
    id: 1,
    user: "Marcus Williams",
    handle: "@mwilliams_cf",
    sport: "⚾ Baseball",
    school: "LSU Tigers",
    avatar: "MW",
    avatarColor: "#7c3aed",
    time: "2m ago",
    content: "Just went 3-for-4 with a walk-off RBI in the Super Regional. Road to Omaha is REAL. 🏆 #DiamondGrind #RoadToOmaha",
    media: "highlight",
    likes: 847,
    comments: 134,
    shares: 89,
    recruiterViews: 23,
    nilValue: "$12,400",
    verified: true,
    sponsored: false,
  },
  {
    id: 2,
    user: "Sponsored · Diamond Grind Gear",
    handle: "@diamondgrind",
    sport: "⚾ Official Gear Partner",
    school: "AthlynX Store",
    avatar: "DG",
    avatarColor: C.gold,
    time: "Sponsored",
    content: "Pro Batting Gloves — worn by MCWS athletes. Get yours before Omaha. Use code OMAHA26 for 20% off. 🧤⚾",
    media: "ad",
    likes: 0,
    comments: 0,
    shares: 0,
    recruiterViews: 0,
    nilValue: "",
    verified: true,
    sponsored: true,
    ctaLabel: "Shop Now",
    ctaUrl: "/store",
  },
  {
    id: 3,
    user: "Aaliyah Johnson",
    handle: "@aaliyah_libero",
    sport: "🏐 Volleyball",
    school: "Nebraska Cornhuskers",
    avatar: "AJ",
    avatarColor: "#dc2626",
    time: "15m ago",
    content: "Fall season prep starts Monday. New strength program locked in. Who else is grinding this summer? 💪 #WarriorsPlaybook",
    media: null,
    likes: 412,
    comments: 67,
    shares: 31,
    recruiterViews: 8,
    nilValue: "$4,200",
    verified: false,
    sponsored: false,
  },
  {
    id: 4,
    user: "Coach David Torres",
    handle: "@coach_torres_fb",
    sport: "🏈 Football",
    school: "Recruiting Coordinator · SEC",
    avatar: "DT",
    avatarColor: "#0047AB",
    time: "32m ago",
    content: "Looking for a 6'4\" OT with 5.2 speed or better. Class of 2027. DM me your AthlynX profile link. Serious inquiries only. 🏈",
    media: null,
    likes: 1204,
    comments: 389,
    shares: 201,
    recruiterViews: 0,
    nilValue: "",
    verified: true,
    sponsored: false,
    isRecruiting: true,
  },
  {
    id: 5,
    user: "Destiny Reeves",
    handle: "@destiny_cheer",
    sport: "📣 Cheerleading",
    school: "Alabama Crimson Tide",
    avatar: "DR",
    avatarColor: "#dc2626",
    time: "1h ago",
    content: "Nationals prep week 3 complete. Our pyramid routine is CLEAN. Cheer athletes — you belong here too. AthlynX sees you. 📣✨ #BeTheLegacy",
    media: "reel",
    likes: 2341,
    comments: 445,
    shares: 312,
    recruiterViews: 15,
    nilValue: "$3,800",
    verified: false,
    sponsored: false,
  },
  {
    id: 6,
    user: "Sponsored · AthlynX Platform",
    handle: "@athlynx",
    sport: "🏆 The Athlete's Playbook",
    school: "athlynx.ai",
    avatar: "AX",
    avatarColor: C.electric,
    time: "Sponsored",
    content: "Every athlete. Every sport. Every human. One platform. Sign up free — no card, no catch. Your athlete profile is waiting. 🔥",
    media: "ad",
    likes: 0,
    comments: 0,
    shares: 0,
    recruiterViews: 0,
    nilValue: "",
    verified: true,
    sponsored: true,
    ctaLabel: "Claim Your Profile",
    ctaUrl: "/signup",
  },
  {
    id: 7,
    user: "Jordan Kim",
    handle: "@jordan_gymnastics",
    sport: "🤸 Gymnastics",
    school: "UCLA Bruins",
    avatar: "JK",
    avatarColor: "#2563eb",
    time: "2h ago",
    content: "Floor routine score: 9.875. Season best. Gymnastics athletes — we have a home here. AthlynX doesn't leave us out. 🤸‍♀️ #BeTheLegacy",
    media: "highlight",
    likes: 1876,
    comments: 234,
    shares: 156,
    recruiterViews: 19,
    nilValue: "$6,100",
    verified: false,
    sponsored: false,
  },
  {
    id: 8,
    user: "Marcus Band Director",
    handle: "@director_mbands",
    sport: "🎺 Marching Band",
    school: "Jackson State University",
    avatar: "MB",
    avatarColor: "#059669",
    time: "3h ago",
    content: "Our halftime show went viral. 2.3M views. Band athletes are athletes too — and AthlynX is the first platform that treats us that way. 🎺🥁 #BeTheLegacy",
    media: null,
    likes: 4521,
    comments: 891,
    shares: 1204,
    recruiterViews: 0,
    nilValue: "$1,200",
    verified: false,
    sponsored: false,
  },
];

const STORIES = [
  { id: 1, user: "You", avatar: "ME", color: C.electric, hasNew: false, isAdd: true },
  { id: 2, user: "Marcus W.", avatar: "MW", color: "#7c3aed", hasNew: true },
  { id: 3, user: "Aaliyah J.", avatar: "AJ", color: "#dc2626", hasNew: true },
  { id: 4, user: "Coach Torres", avatar: "DT", color: C.cobalt, hasNew: true },
  { id: 5, user: "Destiny R.", avatar: "DR", color: "#dc2626", hasNew: false },
  { id: 6, user: "Jordan K.", avatar: "JK", color: "#2563eb", hasNew: true },
  { id: 7, user: "AXN Live", avatar: "AX", color: C.stadium, hasNew: true },
  { id: 8, user: "Diamond Grind", avatar: "DG", color: C.gold, hasNew: false },
];

const LIVE_EVENTS = [
  { id: 1, title: "MCWS Super Regional — LSU vs Tennessee", sport: "⚾", viewers: 14820, status: "LIVE", color: C.gold },
  { id: 2, title: "AXN Podcast — Episode 003 Recording", sport: "🎙️", viewers: 2341, status: "LIVE", color: C.electric },
  { id: 3, title: "NIL Deal Workshop — Coach Torres", sport: "💰", viewers: 891, status: "LIVE", color: C.green },
  { id: 4, title: "Gymnastics Showcase — UCLA vs Florida", sport: "🤸", viewers: 3204, status: "LIVE", color: "#8b5cf6" },
];

const UPCOMING_EVENTS = [
  { id: 1, title: "MCWS — College World Series", date: "Jun 14", sport: "⚾", location: "Omaha, NE", type: "Tournament", urgent: true },
  { id: 2, title: "Diamond Grind Summer Showcase", date: "Jun 21", sport: "⚾", location: "Houston, TX", type: "Showcase", urgent: false },
  { id: 3, title: "Football Signing Day Prep Camp", date: "Jul 8", sport: "🏈", location: "Atlanta, GA", type: "Camp", urgent: false },
  { id: 4, title: "Volleyball Fall Showcase", date: "Jul 15", sport: "🏐", location: "Chicago, IL", type: "Showcase", urgent: false },
  { id: 5, title: "Cheer Nationals Qualifier", date: "Jul 22", sport: "📣", location: "Orlando, FL", type: "Competition", urgent: false },
  { id: 6, title: "Gymnastics Summer Invitational", date: "Aug 2", sport: "🤸", location: "Los Angeles, CA", type: "Competition", urgent: false },
];

const GROUPS = [
  { id: 1, name: "Road to Omaha 2026", members: 8420, sport: "⚾", active: true, color: C.gold },
  { id: 2, name: "Diamond Grind Nation", members: 12400, sport: "⚾", active: true, color: C.gold },
  { id: 3, name: "Gridiron Nexus — Class of 2027", members: 34200, sport: "🏈", active: true, color: C.electric },
  { id: 4, name: "Court Kings Basketball", members: 19800, sport: "🏀", active: false, color: "#f97316" },
  { id: 5, name: "Cheer & Gymnastics Hub", members: 7600, sport: "📣🤸", active: false, color: "#ec4899" },
  { id: 6, name: "Warriors Playbook — Coaches", members: 4200, sport: "📋", active: false, color: C.cobalt },
  { id: 7, name: "NIL Marketplace Athletes", members: 28900, sport: "💰", active: false, color: C.green },
  { id: 8, name: "Band & Marching Arts", members: 3100, sport: "🎺", active: false, color: "#059669" },
];

const MESSAGES = [
  { id: 1, user: "Coach Torres", avatar: "DT", color: C.cobalt, preview: "Saw your highlight reel — can we talk?", time: "2m", unread: true },
  { id: 2, user: "NIL Agent Sarah M.", avatar: "SM", color: C.green, preview: "Brand deal opportunity — $8,400 value", time: "15m", unread: true },
  { id: 3, user: "Marcus Williams", avatar: "MW", color: "#7c3aed", preview: "Great game bro! Road to Omaha 🔥", time: "1h", unread: false },
  { id: 4, user: "AthlynX OS", avatar: "AX", color: C.electric, preview: "Your profile is 60% complete. Add your stats to unlock recruiting.", time: "2h", unread: true },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StadiumLightsBar() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 4, zIndex: 200,
      background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric}, ${C.stadium}, ${C.electric}, ${C.cobalt})`,
    }} />
  );
}

function Avatar({ initials, color, size = 40, verified = false }: { initials: string; color: string; size?: number; verified?: boolean }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: size * 0.35, color: C.white,
        border: `2px solid ${color}44`,
        flexShrink: 0,
      }}>{initials}</div>
      {verified && (
        <div style={{
          position: "absolute", bottom: -2, right: -2,
          width: 14, height: 14, borderRadius: "50%",
          background: C.electric, border: `2px solid ${C.base}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, color: C.white,
        }}>✓</div>
      )}
    </div>
  );
}

function LiveBadge({ label = "LIVE", color = C.red }: { label?: string; color?: string }) {
  return (
    <span style={{
      background: color, color: C.white,
      fontSize: 9, fontWeight: 900, letterSpacing: 1.5,
      padding: "2px 6px", borderRadius: 4,
      animation: "axnPulse 2s ease-in-out infinite",
    }}>{label}</span>
  );
}

function StoriesBar({ stories }: { stories: typeof STORIES }) {
  return (
    <div style={{
      display: "flex", gap: 12, overflowX: "auto", padding: "12px 16px",
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      scrollbarWidth: "none",
    }}>
      {stories.map(s => (
        <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", flexShrink: 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: s.isAdd ? `${C.granite}` : `linear-gradient(135deg, ${s.color}, ${s.color}66)`,
            border: s.hasNew ? `2px solid ${C.stadium}` : `2px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: C.white,
            boxShadow: s.hasNew ? `0 0 12px ${C.stadium}44` : "none",
          }}>
            {s.isAdd ? "+" : s.avatar}
          </div>
          <span style={{ color: C.muted, fontSize: 10, maxWidth: 56, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {s.user}
          </span>
        </div>
      ))}
    </div>
  );
}

function LiveBar({ events }: { events: typeof LIVE_EVENTS }) {
  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", padding: "8px 16px",
      background: `${C.base}ee`, borderBottom: `1px solid ${C.border}`,
      scrollbarWidth: "none", alignItems: "center",
    }}>
      <span style={{ color: C.red, fontWeight: 900, fontSize: 11, letterSpacing: 1, flexShrink: 0 }}>● LIVE</span>
      {events.map(e => (
        <div key={e.id} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: "4px 10px", cursor: "pointer", flexShrink: 0,
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 12 }}>{e.sport}</span>
          <span style={{ color: C.text, fontSize: 11, fontWeight: 600 }}>{e.title}</span>
          <span style={{ color: C.muted, fontSize: 10 }}>{e.viewers.toLocaleString()} watching</span>
        </div>
      ))}
    </div>
  );
}

function FeedPost({ post, onLike }: { post: typeof FEED_POSTS[0]; onLike: (id: number) => void }) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);

  function handleLike() {
    if (!liked) {
      setLiked(true);
      setLocalLikes(l => l + 1);
      onLike(post.id);
    }
  }

  if (post.sponsored) {
    return (
      <div style={{
        background: C.card,
        border: `1px solid ${C.gold}33`,
        borderRadius: 12, marginBottom: 12, overflow: "hidden",
      }}>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar initials={post.avatar} color={post.avatarColor} size={40} verified />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{post.user}</span>
                <span style={{ background: C.gold + "33", color: C.gold, fontSize: 9, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>AD</span>
              </div>
              <div style={{ color: C.muted, fontSize: 11 }}>{post.sport}</div>
            </div>
          </div>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>{post.content}</p>
        </div>
        <div style={{ padding: "0 16px 12px" }}>
          <a href={post.ctaUrl} style={{
            display: "block", textAlign: "center",
            background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`,
            color: C.white, fontWeight: 800, fontSize: 14,
            padding: "10px", borderRadius: 8, textDecoration: "none",
            boxShadow: `0 4px 16px ${C.electric}33`,
          }}>{post.ctaLabel} →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12, marginBottom: 12, overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <div style={{ padding: "14px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          <Avatar initials={post.avatar} color={post.avatarColor} size={42} verified={post.verified} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{post.user}</span>
              {post.isRecruiting && (
                <span style={{ background: C.electric + "22", color: C.electric, fontSize: 9, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>RECRUITING</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: C.muted, fontSize: 11 }}>{post.handle}</span>
              <span style={{ color: C.secondary, fontSize: 11 }}>{post.sport}</span>
              <span style={{ color: C.muted, fontSize: 11 }}>· {post.school}</span>
              <span style={{ color: C.muted, fontSize: 11 }}>· {post.time}</span>
            </div>
          </div>
          {post.nilValue && (
            <div style={{ background: C.green + "22", border: `1px solid ${C.green}44`, borderRadius: 6, padding: "3px 8px", textAlign: "center" }}>
              <div style={{ color: C.green, fontSize: 10, fontWeight: 700 }}>NIL Value</div>
              <div style={{ color: C.green, fontSize: 12, fontWeight: 800 }}>{post.nilValue}</div>
            </div>
          )}
        </div>

        {/* Content */}
        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.65, margin: "0 0 10px" }}>{post.content}</p>

        {/* Media placeholder */}
        {post.media === "highlight" && (
          <div style={{
            background: `linear-gradient(135deg, ${C.granite}, ${C.cobalt}33)`,
            borderRadius: 8, height: 160, marginBottom: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${C.border}`, cursor: "pointer",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>▶</div>
              <div style={{ color: C.stadium, fontSize: 12, fontWeight: 700 }}>Watch Highlight</div>
              <div style={{ color: C.muted, fontSize: 10 }}>Tap to play · AXN Network</div>
            </div>
          </div>
        )}
        {post.media === "reel" && (
          <div style={{
            background: `linear-gradient(135deg, ${C.granite}, #4c1d95 33%)`,
            borderRadius: 8, height: 200, marginBottom: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid #7c3aed44`, cursor: "pointer",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>🎬</div>
              <div style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 700 }}>Watch Reel</div>
              <div style={{ color: C.muted, fontSize: 10 }}>Short-form · AVN Studio</div>
            </div>
          </div>
        )}

        {/* Recruiter views */}
        {post.recruiterViews > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 12 }}>👁️</span>
            <span style={{ color: C.electric, fontSize: 11, fontWeight: 600 }}>{post.recruiterViews} recruiters viewed this post</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 4, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <button onClick={handleLike} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            background: liked ? C.electric + "22" : "transparent",
            border: "none", borderRadius: 6, padding: "7px 4px",
            color: liked ? C.electric : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            {liked ? "❤️" : "🤍"} {localLikes > 0 ? localLikes.toLocaleString() : "Like"}
          </button>
          <button style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            background: "transparent", border: "none", borderRadius: 6, padding: "7px 4px",
            color: C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            💬 {post.comments > 0 ? post.comments.toLocaleString() : "Comment"}
          </button>
          <button style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            background: "transparent", border: "none", borderRadius: 6, padding: "7px 4px",
            color: C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            ↗ {post.shares > 0 ? post.shares.toLocaleString() : "Share"}
          </button>
          {post.isRecruiting && (
            <button style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              background: C.electric + "22", border: "none", borderRadius: 6, padding: "7px 4px",
              color: C.electric, fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              📨 Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MessagesPanel({ messages, onClose }: { messages: typeof MESSAGES; onClose: () => void }) {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [msgInput, setMsgInput] = useState("");

  return (
    <div style={{
      position: "fixed", bottom: 0, right: 16, width: 320,
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: "12px 12px 0 0", zIndex: 150,
      boxShadow: `0 -8px 40px ${C.cobalt}33`,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderBottom: `1px solid ${C.border}`,
        background: `linear-gradient(90deg, ${C.cobalt}22, ${C.electric}11)`,
        borderRadius: "12px 12px 0 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <span style={{ color: C.white, fontWeight: 800, fontSize: 14 }}>Messages</span>
          <span style={{ background: C.red, color: C.white, fontSize: 9, fontWeight: 900, padding: "1px 5px", borderRadius: 8 }}>
            {messages.filter(m => m.unread).length}
          </span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {activeChat === null ? (
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {messages.map(m => (
            <div key={m.id} onClick={() => setActiveChat(m.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 16px", cursor: "pointer",
              background: m.unread ? `${C.electric}08` : "transparent",
              borderBottom: `1px solid ${C.border}`,
              transition: "background 0.15s",
            }}>
              <Avatar initials={m.avatar} color={m.color} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: m.unread ? C.white : C.secondary, fontWeight: m.unread ? 700 : 500, fontSize: 13 }}>{m.user}</span>
                  <span style={{ color: C.muted, fontSize: 10 }}>{m.time}</span>
                </div>
                <div style={{ color: C.muted, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.preview}</div>
              </div>
              {m.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.electric, flexShrink: 0 }} />}
            </div>
          ))}
          <div style={{ padding: "10px 16px" }}>
            <button style={{
              width: "100%", padding: "8px", background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`,
              color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>New Message</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setActiveChat(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}>←</button>
            <span style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{messages.find(m => m.id === activeChat)?.user}</span>
          </div>
          <div style={{ height: 180, padding: "12px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ alignSelf: "flex-start", background: C.granite, borderRadius: "12px 12px 12px 4px", padding: "8px 12px", maxWidth: "80%" }}>
              <span style={{ color: C.text, fontSize: 12 }}>{messages.find(m => m.id === activeChat)?.preview}</span>
            </div>
            <div style={{ alignSelf: "flex-end", background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`, borderRadius: "12px 12px 4px 12px", padding: "8px 12px", maxWidth: "80%" }}>
              <span style={{ color: C.white, fontSize: 12 }}>Thanks! Let me send you my AthlynX profile link.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "8px 12px", borderTop: `1px solid ${C.border}` }}>
            <input
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              placeholder="Message…"
              style={{
                flex: 1, background: C.granite, border: `1px solid ${C.border}`,
                borderRadius: 20, padding: "8px 12px", color: C.white, fontSize: 12, outline: "none",
              }}
            />
            <button style={{
              background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`,
              border: "none", borderRadius: 20, padding: "8px 12px",
              color: C.white, fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
type Tab = "feed" | "reels" | "groups" | "events" | "stats" | "recruiting";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "feed", label: "Feed", icon: "🏠" },
  { id: "reels", label: "Reels", icon: "🎬" },
  { id: "groups", label: "Groups", icon: "👥" },
  { id: "events", label: "Events", icon: "📅" },
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "recruiting", label: "Recruiting", icon: "🎯" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function AthlynXSocialInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [showMessages, setShowMessages] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [unreadCount] = useState(MESSAGES.filter(m => m.unread).length);

  // Real feed from DB — falls back to seed posts until real content exists
  const feedQuery = trpc.feed.getFeed.useQuery({ limit: 20, offset: 0 }, { staleTime: 30_000 });
  const createPost = trpc.feed.createPost.useMutation({
    onSuccess: () => { feedQuery.refetch(); setNewPostText(""); },
  });
  const likePost = trpc.feed.likePost.useMutation();

  // Merge real posts on top of seed posts so feed is never empty
  const realPosts = (feedQuery.data ?? []).map((p: any) => ({
    id: p.id,
    user: p.authorName ?? "AthlynX Athlete",
    handle: `@user${p.userId}`,
    sport: "🏆 AthlynX",
    school: "",
    avatar: (p.authorName ?? "A").slice(0, 2).toUpperCase(),
    avatarColor: C.electric,
    time: new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    content: p.content,
    media: p.mediaType !== "none" ? p.mediaType : null,
    likes: p.likesCount ?? 0,
    comments: p.commentsCount ?? 0,
    shares: p.sharesCount ?? 0,
    recruiterViews: 0,
    nilValue: "",
    verified: false,
    sponsored: false,
  }));
  const posts = realPosts.length > 0 ? realPosts : SEED_FEED_POSTS;

  useEffect(() => {
    document.title = "AthlynX Social — The Athlete's Playbook";
  }, []);

  function handleLike(id: number) {
    likePost.mutate({ postId: id });
  }

  function handleNewPost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      user: (user as any)?.name || "You",
      handle: "@you",
      sport: "🏆 AthlynX",
      school: "Your School",
      avatar: ((user as any)?.name || "Y").slice(0, 2).toUpperCase(),
      avatarColor: C.electric,
      time: "Just now",
      content: newPostText,
      media: null as any,
      likes: 0,
      comments: 0,
      shares: 0,
      recruiterViews: 0,
      nilValue: "",
      verified: false,
      sponsored: false,
    };
    createPost.mutate({ content: newPostText, postType: "status" });
    setNewPostText("");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: C.base,
      fontFamily: "system-ui, -apple-system, sans-serif",
      paddingTop: 4,
    }}>
      <StadiumLightsBar />
      <style>{`
        @keyframes axnPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes axnSpin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${C.base}; }
        ::-webkit-scrollbar-thumb { background: ${C.granite}; border-radius: 2px; }
      `}</style>

      {/* ─── TOP NAV ─── */}
      <div style={{
        position: "sticky", top: 4, zIndex: 100,
        background: `${C.surface}f0`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 16px",
      }}>
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontWeight: 900, fontSize: 20, color: C.white, letterSpacing: 2,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              textShadow: `0 0 20px ${C.electric}66`,
            }}>AthlynX</span>
            <span style={{ color: C.stadium, fontSize: 10, letterSpacing: 1 }}>SOCIAL</span>
          </div>

          {/* Search */}
          <div style={{
            flex: 1, maxWidth: 280, margin: "0 12px",
            background: C.granite, border: `1px solid ${C.border}`,
            borderRadius: 20, display: "flex", alignItems: "center",
            padding: "0 12px", height: 34,
          }}>
            <span style={{ color: C.muted, fontSize: 12, marginRight: 6 }}>🔍</span>
            <input
              placeholder="Search athletes, coaches, schools…"
              style={{ flex: 1, background: "none", border: "none", color: C.text, fontSize: 12, outline: "none" }}
            />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setShowMessages(m => !m)} style={{
              position: "relative", background: C.granite, border: `1px solid ${C.border}`,
              borderRadius: 8, width: 34, height: 34, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>
              💬
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: C.red, color: C.white, fontSize: 9, fontWeight: 900,
                  width: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{unreadCount}</span>
              )}
            </button>
            <button style={{
              background: C.granite, border: `1px solid ${C.border}`,
              borderRadius: 8, width: 34, height: 34, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🔔</button>
            <a href="/portal" style={{
              background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`,
              color: C.white, fontSize: 11, fontWeight: 800,
              padding: "6px 10px", borderRadius: 8, textDecoration: "none",
            }}>OS ⚡</a>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "8px 14px", background: "none", border: "none",
              borderBottom: activeTab === t.id ? `2px solid ${C.electric}` : "2px solid transparent",
              color: activeTab === t.id ? C.electric : C.muted,
              fontSize: 12, fontWeight: activeTab === t.id ? 700 : 500,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── SEASONAL HERO STRIP ─── */}
      <div style={{
        background: `linear-gradient(90deg, ${C.gold}22, ${C.cobalt}22)`,
        borderBottom: `1px solid ${C.gold}33`,
        padding: "8px 16px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <LiveBadge label="LIVE NOW" color={C.gold} />
        <span style={{ fontSize: 16 }}>{CURRENT_SEASON.icon}</span>
        <span style={{ color: C.gold, fontWeight: 800, fontSize: 13 }}>{CURRENT_SEASON.event}</span>
        <span style={{ color: C.muted, fontSize: 11 }}>· Diamond Grind™ · Road to Omaha</span>
        <a href="/diamond-grind" style={{ marginLeft: "auto", color: C.electric, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Follow →</a>
      </div>

      {/* ─── MAIN LAYOUT ─── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 8px",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr)",
      }}>

        {/* Stories */}
        {activeTab === "feed" && <StoriesBar stories={STORIES} />}

        {/* Live bar */}
        {activeTab === "feed" && <LiveBar events={LIVE_EVENTS} />}

        {/* ─── FEED TAB ─── */}
        {activeTab === "feed" && (
          <div style={{ padding: "12px 8px" }}>
            {/* Post composer */}
            <form onSubmit={handleNewPost} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "12px 16px", marginBottom: 12,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Avatar initials={(user as any)?.name?.slice(0, 2)?.toUpperCase() || "ME"} color={C.electric} size={38} />
                <textarea
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  placeholder="What's your highlight today? Share your grind…"
                  rows={2}
                  style={{
                    flex: 1, background: C.granite, border: `1px solid ${C.border}`,
                    borderRadius: 8, padding: "8px 12px", color: C.text,
                    fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["📸 Photo", "🎬 Video", "📊 Stats", "🏆 Highlight"].map(btn => (
                    <button key={btn} type="button" style={{
                      background: C.granite, border: `1px solid ${C.border}`,
                      borderRadius: 6, padding: "4px 8px", color: C.muted,
                      fontSize: 11, cursor: "pointer",
                    }}>{btn}</button>
                  ))}
                </div>
                <button type="submit" disabled={!newPostText.trim()} style={{
                  background: newPostText.trim() ? `linear-gradient(90deg, ${C.cobalt}, ${C.electric})` : C.granite,
                  color: C.white, border: "none", borderRadius: 8,
                  padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}>Post</button>
              </div>
            </form>

            {/* Feed posts */}
            {posts.map(post => (
              <FeedPost key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        )}

        {/* ─── REELS TAB ─── */}
        {activeTab === "reels" && (
          <div style={{ padding: "12px 8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {[
                { title: "Walk-off RBI — Super Regional", sport: "⚾", views: "847K", user: "Marcus W.", color: C.cobalt },
                { title: "Floor Routine 9.875 — UCLA", sport: "🤸", views: "1.2M", user: "Jordan K.", color: "#7c3aed" },
                { title: "Cheer Pyramid — Nationals Prep", sport: "📣", views: "2.3M", user: "Destiny R.", color: "#dc2626" },
                { title: "Band Halftime Show — JSU", sport: "🎺", views: "4.5M", user: "Marcus B.", color: "#059669" },
                { title: "Volleyball Dig — Nebraska", sport: "🏐", views: "412K", user: "Aaliyah J.", color: "#dc2626" },
                { title: "Diamond Grind — Batting Drill", sport: "⚾", views: "923K", user: "Diamond Grind™", color: C.gold },
              ].map((reel, i) => (
                <div key={i} style={{
                  background: `linear-gradient(135deg, ${reel.color}33, ${C.granite})`,
                  border: `1px solid ${reel.color}33`,
                  borderRadius: 10, overflow: "hidden", cursor: "pointer",
                  aspectRatio: "9/16", maxHeight: 280,
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  padding: 10,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 20 }}>{reel.sport}</span>
                    <LiveBadge label="REEL" color={reel.color} />
                  </div>
                  <div style={{ textAlign: "center", fontSize: 32 }}>▶</div>
                  <div>
                    <div style={{ color: C.white, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{reel.title}</div>
                    <div style={{ color: C.muted, fontSize: 10 }}>{reel.user} · {reel.views} views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── GROUPS TAB ─── */}
        {activeTab === "groups" && (
          <div style={{ padding: "12px 8px" }}>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>Your Groups</span>
              <button style={{
                background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`,
                color: C.white, border: "none", borderRadius: 8,
                padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>+ Create Group</button>
            </div>
            {GROUPS.map(g => (
              <div key={g.id} style={{
                background: C.card, border: `1px solid ${g.active ? g.color + "44" : C.border}`,
                borderRadius: 10, padding: "12px 16px", marginBottom: 8,
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                boxShadow: g.active ? `0 0 16px ${g.color}22` : "none",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `linear-gradient(135deg, ${g.color}44, ${g.color}22)`,
                  border: `1px solid ${g.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{g.sport}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{g.name}</div>
                  <div style={{ color: C.muted, fontSize: 11 }}>{g.members.toLocaleString()} members</div>
                </div>
                {g.active && <LiveBadge label="ACTIVE" color={g.color} />}
                <button style={{
                  background: g.active ? `${g.color}22` : C.granite,
                  color: g.active ? g.color : C.muted,
                  border: `1px solid ${g.active ? g.color + "44" : C.border}`,
                  borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                }}>{g.active ? "View" : "Join"}</button>
              </div>
            ))}
          </div>
        )}

        {/* ─── EVENTS TAB ─── */}
        {activeTab === "events" && (
          <div style={{ padding: "12px 8px" }}>
            {/* Live events */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <LiveBadge />
                <span style={{ color: C.white, fontWeight: 800, fontSize: 15 }}>Happening Now</span>
              </div>
              {LIVE_EVENTS.map(e => (
                <div key={e.id} style={{
                  background: C.card, border: `1px solid ${e.color}44`,
                  borderRadius: 10, padding: "12px 16px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                  boxShadow: `0 0 20px ${e.color}22`,
                }}>
                  <span style={{ fontSize: 24 }}>{e.sport}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{e.title}</div>
                    <div style={{ color: C.muted, fontSize: 11 }}>{e.viewers.toLocaleString()} watching</div>
                  </div>
                  <LiveBadge color={e.color} />
                </div>
              ))}
            </div>

            {/* Upcoming events */}
            <div>
              <span style={{ color: C.white, fontWeight: 800, fontSize: 15, display: "block", marginBottom: 10 }}>Upcoming Events</span>
              {UPCOMING_EVENTS.map(e => (
                <div key={e.id} style={{
                  background: C.card, border: `1px solid ${e.urgent ? C.gold + "44" : C.border}`,
                  borderRadius: 10, padding: "12px 16px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: e.urgent ? `${C.gold}22` : C.granite,
                    border: `1px solid ${e.urgent ? C.gold + "44" : C.border}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 18 }}>{e.sport}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{e.title}</div>
                    <div style={{ color: C.muted, fontSize: 11 }}>{e.date} · {e.location}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      background: e.urgent ? `${C.gold}22` : C.granite,
                      color: e.urgent ? C.gold : C.muted,
                      fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                    }}>{e.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STATS TAB ─── */}
        {activeTab === "stats" && (
          <div style={{ padding: "12px 8px" }}>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>Platform Analytics</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Profile Views", value: "1,284", change: "+23%", icon: "👁️", color: C.electric },
                { label: "Recruiter Views", value: "47", change: "+8", icon: "🎯", color: C.green },
                { label: "NIL Impressions", value: "8,420", change: "+12%", icon: "💰", color: C.gold },
                { label: "AXN Credits", value: "340", change: "+60", icon: "⚡", color: C.stadium },
              ].map(s => (
                <div key={s.label} style={{
                  background: C.card, border: `1px solid ${s.color}33`,
                  borderRadius: 10, padding: "14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>{s.change}</span>
                  </div>
                  <div style={{ color: s.color, fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ color: C.muted, fontSize: 11 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Sport breakdown */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px" }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Platform Sports Activity</div>
              {[
                { sport: "⚾ Baseball/Softball", pct: 34, color: C.gold },
                { sport: "🏈 Football", pct: 28, color: C.electric },
                { sport: "🏀 Basketball", pct: 18, color: "#f97316" },
                { sport: "🏐 Volleyball", pct: 8, color: "#ec4899" },
                { sport: "📣 Cheer/Gymnastics", pct: 7, color: "#8b5cf6" },
                { sport: "🎺 Band/Marching", pct: 5, color: C.green },
              ].map(s => (
                <div key={s.sport} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ color: C.text, fontSize: 12 }}>{s.sport}</span>
                    <span style={{ color: C.muted, fontSize: 11 }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: C.granite, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── RECRUITING TAB ─── */}
        {activeTab === "recruiting" && (
          <div style={{ padding: "12px 8px" }}>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Recruiting Hub</div>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>Coaches are watching. Make sure your profile is complete.</div>

            {/* Active opportunities */}
            {[
              { coach: "Coach Torres", school: "SEC Program", sport: "🏈 Football", position: "OT 6'4\"+ · Class 2027", views: 23, urgent: true },
              { coach: "Coach Williams", school: "ACC Program", sport: "⚾ Baseball", position: "LHP · 88+ MPH · Class 2026", views: 14, urgent: true },
              { coach: "Coach Davis", school: "Big 12 Program", sport: "🏀 Basketball", position: "PG · 6'0\"+ · Class 2027", views: 8, urgent: false },
              { coach: "Coach Martinez", school: "Pac-12 Program", sport: "🏐 Volleyball", position: "Libero · 5'6\"+ · Class 2026", views: 5, urgent: false },
            ].map((opp, i) => (
              <div key={i} style={{
                background: C.card, border: `1px solid ${opp.urgent ? C.electric + "44" : C.border}`,
                borderRadius: 10, padding: "14px 16px", marginBottom: 8,
                boxShadow: opp.urgent ? `0 0 20px ${C.electric}22` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.cobalt}44, ${C.electric}22)`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                  }}>{opp.sport.split(" ")[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{opp.coach}</span>
                      {opp.urgent && <LiveBadge label="ACTIVE" color={C.electric} />}
                    </div>
                    <div style={{ color: C.secondary, fontSize: 12 }}>{opp.school} · {opp.sport}</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Looking for: {opp.position}</div>
                    <div style={{ color: C.electric, fontSize: 11, marginTop: 2 }}>👁️ {opp.views} athletes viewed</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button style={{
                    flex: 1, background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`,
                    color: C.white, border: "none", borderRadius: 8,
                    padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>Send My Profile</button>
                  <button style={{
                    flex: 1, background: C.granite, color: C.secondary,
                    border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>Message Coach</button>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div style={{
              background: `linear-gradient(135deg, ${C.cobalt}22, ${C.electric}11)`,
              border: `1px solid ${C.electric}33`,
              borderRadius: 10, padding: "16px", textAlign: "center", marginTop: 8,
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🎯</div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Complete Your Profile</div>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>Coaches can only recruit what they can see. Add your stats, highlights, and GPA.</div>
              <a href="/onboarding" style={{
                display: "inline-block",
                background: `linear-gradient(90deg, ${C.cobalt}, ${C.electric})`,
                color: C.white, fontWeight: 800, fontSize: 13,
                padding: "10px 24px", borderRadius: 8, textDecoration: "none",
              }}>Complete Profile →</a>
            </div>
          </div>
        )}

      </div>

      {/* ─── BOTTOM NAV (MOBILE) ─── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: `${C.surface}f5`,
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex", zIndex: 100,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {[
          { id: "feed" as Tab, icon: "🏠", label: "Feed" },
          { id: "reels" as Tab, icon: "🎬", label: "Reels" },
          { id: "groups" as Tab, icon: "👥", label: "Groups" },
          { id: "events" as Tab, icon: "📅", label: "Events" },
          { id: "stats" as Tab, icon: "📊", label: "Stats" },
          { id: "recruiting" as Tab, icon: "🎯", label: "Recruit" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            padding: "8px 4px 6px", background: "none", border: "none",
            color: activeTab === t.id ? C.electric : C.muted,
            fontSize: 10, fontWeight: activeTab === t.id ? 700 : 500,
            cursor: "pointer", gap: 2,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── MESSAGES PANEL ─── */}
      {showMessages && (
        <MessagesPanel messages={MESSAGES} onClose={() => setShowMessages(false)} />
      )}

      {/* ─── DOZIER LEGACY FOOTER ─── */}
      <div style={{ height: 80 }} /> {/* bottom nav spacer */}
      <div style={{
        textAlign: "center", padding: "12px 16px 80px",
        color: "#0d2040", fontSize: 10, letterSpacing: 0.5,
      }}>
        © 2026 AthlynX™ · Chad Allen Dozier Sr. · Be The Legacy · Powered by AthlynXAI OS™
      </div>
    </div>
  );
}

export default function AthlynXSocial() {
  return <RouteErrorBoundary><AthlynXSocialInner /></RouteErrorBoundary>;
}
