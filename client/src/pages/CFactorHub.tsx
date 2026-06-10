/**
 * C-FACTOR HUB — The Athlete Command Center
 * The operating system of your sports life.
 * Mobile-first. Tablet-optimized. Desktop-powerful.
 *
 * Beats: Perfect Game · Hudl · 247Sports · On3 · Rivals · MaxPreps
 *        NCSA · SportsRecruits · Barstool Sports · Teamworks
 *
 * Powered by: Private AI · Private Intelligence · Private Reasoning
 *
 * Session 32 — May 5, 2026
 */
import { useState } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Zap, Trophy, Star, TrendingUp, Users, MessageCircle,
  Play, Mic, ShoppingBag, BarChart2, Target, Shield,
  Video, FileText, Award, Globe, ChevronRight, Bell,
  Calendar, BookOpen, Briefcase, Gavel, Heart, Radio,
  Activity, Layers, Cpu, Lock, Share2, Download
} from "lucide-react";

// ─── C-Factor Score Ring ──────────────────────────────────────────────────────
function CFactorRing({ score, name, sport, position, school, status }: {
  score: number; name: string; sport: string; position: string; school: string; status: string;
}) {
  const pct = Math.min(100, Math.max(0, score));
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  const color = score >= 90 ? "#00ff88" : score >= 75 ? "#00c2ff" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 90 ? "ELITE" : score >= 75 ? "RISING" : score >= 60 ? "DEVELOPING" : "BUILDING";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#1a3a8f" strokeWidth="10" />
          <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-[10px] font-black tracking-widest" style={{ color }}>{label}</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="text-white font-black text-lg leading-tight">{name}</div>
        <div className="text-blue-400 text-xs">{position} · {sport}</div>
        <div className="text-blue-500 text-xs">{school}</div>
        <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${
          status === "available" ? "bg-green-500/20 text-green-400" :
          status === "committed" ? "bg-blue-500/20 text-blue-400" :
          status === "signed" ? "bg-purple-500/20 text-purple-400" :
          "bg-yellow-500/20 text-yellow-400"
        }`}>
          {status === "available" ? "🟢 Available" : status === "committed" ? "🔵 Committed" :
           status === "signed" ? "🟣 Signed" : "🟡 Transfer Portal"}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickAction({ icon, label, href, badge, color }: {
  icon: React.ReactNode; label: string; href: string; badge?: string; color: string;
}) {
  return (
    <Link href={href}>
      <div className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-pointer transition-all active:scale-95 hover:scale-[1.02] ${color}`}>
        {badge && (
          <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white">{badge}</span>
        )}
        <div className="text-white">{icon}</div>
        <span className="text-white text-xs font-bold text-center leading-tight">{label}</span>
      </div>
    </Link>
  );
}

// ─── Live Stat Ticker ─────────────────────────────────────────────────────────
const LIVE_STATS = [
  "🏈 Jackson Cantwell — #1 Football Recruit 2026",
  "⚾ Roch Cholowsky — #1 MLB Draft Pick 2026",
  "🏀 Cooper Flagg — #1 NBA Draft Pick 2026",
  "💰 NIL Market: $2.5B+ in 2026",
  "🎓 520K+ NCAA Athletes on AthlynX",
  "🤖 Private AI — Live & Processing",
  "📡 Social publishing: active",
  "⚡ X-Factor Scores Updated Daily",
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  return (
    <div className="bg-blue-900/40 border border-blue-800/50 rounded-xl px-4 py-2 flex items-center gap-3 overflow-hidden">
      <span className="text-red-400 text-xs font-black shrink-0 animate-pulse">● LIVE</span>
      <div className="text-blue-200 text-xs font-semibold truncate">{LIVE_STATS[idx % LIVE_STATS.length]}</div>
      <button onClick={() => setIdx(i => i + 1)} className="text-blue-500 hover:text-blue-300 shrink-0">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Ecosystem Role Cards ─────────────────────────────────────────────────────
const ROLES = [
  { icon: "🏃", label: "Athlete", desc: "Your career hub", href: "/athlete-dashboard", color: "from-blue-600 to-cyan-600" },
  { icon: "🤝", label: "Agent", desc: "Client pipeline", href: "/crm-command", color: "from-purple-600 to-blue-600" },
  { icon: "🏫", label: "Coach", desc: "Team & recruiting", href: "/recruiting-hub", color: "from-green-600 to-teal-600" },
  { icon: "⚖️", label: "Lawyer", desc: "NIL compliance", href: "/athlete-legal-hub", color: "from-orange-600 to-red-600" },
  { icon: "🏷️", label: "Brand", desc: "NIL marketplace", href: "/nil-portal", color: "from-pink-600 to-rose-600" },
  { icon: "🔍", label: "Scout", desc: "Prospect database", href: "/rankings-hub", color: "from-yellow-600 to-orange-600" },
  { icon: "👨‍👩‍👧", label: "Family", desc: "Recruiting tracker", href: "/recruiting-hub", color: "from-indigo-600 to-blue-600" },
  { icon: "🎙️", label: "Media", desc: "Podcast & content", href: "/podcast", color: "from-red-600 to-pink-600" },
];

// ─── Competitor Comparison ────────────────────────────────────────────────────
const COMPARE = [
  { feature: "Social Feed (like FB/X)", pg: false, hudl: false, on3: false, athlynx: true },
  { feature: "Private Messaging", pg: false, hudl: false, on3: false, athlynx: true },
  { feature: "NIL Deal Marketplace", pg: false, hudl: false, on3: true, athlynx: true },
  { feature: "AI X-Factor Scoring", pg: false, hudl: false, on3: false, athlynx: true },
  { feature: "Mock Draft + Rankings", pg: true, hudl: false, on3: true, athlynx: true },
  { feature: "Film Upload + AI Review", pg: false, hudl: true, on3: false, athlynx: true },
  { feature: "Podcast / Media Network", pg: false, hudl: false, on3: false, athlynx: true },
  { feature: "Transfer Portal AI", pg: false, hudl: false, on3: true, athlynx: true },
  { feature: "Agent + Lawyer Hub", pg: false, hudl: false, on3: false, athlynx: true },
  { feature: "Vendor Marketplace", pg: false, hudl: false, on3: false, athlynx: true },
  { feature: "Live Events + Streaming", pg: true, hudl: false, on3: false, athlynx: true },
  { feature: "Team Management", pg: true, hudl: true, on3: false, athlynx: true },
  { feature: "Mobile-First App", pg: false, hudl: true, on3: true, athlynx: true },
  { feature: "Desktop Command Center", pg: false, hudl: true, on3: false, athlynx: true },
  { feature: "From Youth to Pro to Legacy", pg: false, hudl: false, on3: false, athlynx: true },
];

// ─── Main Component ───────────────────────────────────────────────────────────
function CFactorHubInner() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"home" | "roles" | "compare" | "ecosystem">("home");

  const { data: profile } = trpc.profile.getProfile.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const xScore = profile?.xFactorScore ? Number(profile.xFactorScore) : 72;
  const displayName = user?.name || "Athlete";
  const sport = profile?.sport || "Multi-Sport";
  const position = profile?.position || "Athlete";
  const school = profile?.school || "AthlynX Platform";
  const status = profile?.recruitingStatus || "available";

  return (
    <div className="min-h-screen bg-[#040c1a] pb-24">
      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-b from-[#0a1628] to-[#040c1a] px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          {/* Brand */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">Dozier Holdings Group</div>
              <h1 className="text-2xl font-black text-white leading-none">C-FACTOR HUB™</h1>
              <div className="text-blue-400 text-xs">The Operating System of Your Sports Life</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/notifications">
                <button className="relative p-2 rounded-xl bg-blue-900/40 border border-blue-800/50">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">3</span>
                </button>
              </Link>
              <Link href="/profile">
                <div
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-cyan-400/30 overflow-hidden"
                  title={user?.avatarUrl ? displayName : `${displayName} — Identity pending`}
                >
                  {user?.avatarUrl
                    ? <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    : (
                      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                      </svg>
                    )
                  }
                </div>
              </Link>
            </div>
          </div>

          {/* Live Ticker */}
          <LiveTicker />
        </div>
      </div>

      {/* ── Section Nav ── */}
      <div className="sticky top-0 z-20 bg-[#040c1a]/95 backdrop-blur border-b border-blue-900/30 px-4 py-2">
        <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: "home", label: "🏠 Hub" },
            { id: "roles", label: "👥 Ecosystem" },
            { id: "compare", label: "⚡ vs Competitors" },
            { id: "ecosystem", label: "🌐 Platform" },
          ].map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id as any)}
              className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                activeSection === s.id ? "bg-blue-600 text-white" : "text-blue-400 hover:text-white bg-blue-900/20"
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-5">

        {/* ── HOME SECTION ── */}
        {activeSection === "home" && (
          <>
            {/* C-Factor Score Card */}
            <div className="bg-gradient-to-br from-[#0d1e3c] to-[#0a1628] border border-blue-800/50 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <CFactorRing score={xScore} name={displayName} sport={sport} position={position} school={school} status={status} />
                <div className="flex-1 space-y-3">
                  <div className="text-xs font-black text-blue-400 tracking-widest uppercase">Your C-Factor™</div>
                  <div className="space-y-2">
                    {[
                      { label: "Athletic Performance", val: Math.min(100, xScore + 8), color: "bg-cyan-500" },
                      { label: "NIL Value", val: Math.min(100, xScore - 5), color: "bg-green-500" },
                      { label: "Recruiting Profile", val: Math.min(100, xScore + 3), color: "bg-blue-500" },
                      { label: "Social Reach", val: Math.min(100, xScore - 12), color: "bg-purple-500" },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between text-[10px] text-blue-400 mb-0.5">
                          <span>{m.label}</span><span className="font-bold text-white">{m.val}</span>
                        </div>
                        <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                          <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/x-factor">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-black py-2 rounded-xl mt-1">
                      ⚡ Run Full AI Analysis
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-3">Quick Actions</div>
              <div className="grid grid-cols-4 gap-2">
                <QuickAction icon={<Play className="w-5 h-5" />} label="NIL Feed" href="/nil-portal" badge="LIVE" color="bg-blue-900/60 border-blue-700/50 hover:bg-blue-800/60" />
                <QuickAction icon={<MessageCircle className="w-5 h-5" />} label="Messenger" href="/messenger" color="bg-green-900/40 border-green-700/50 hover:bg-green-800/40" />
                <QuickAction icon={<Trophy className="w-5 h-5" />} label="Rankings" href="/rankings-hub" badge="NEW" color="bg-yellow-900/40 border-yellow-700/50 hover:bg-yellow-800/40" />
                <QuickAction icon={<Mic className="w-5 h-5" />} label="Podcast" href="/podcast" color="bg-red-900/40 border-red-700/50 hover:bg-red-800/40" />
                <QuickAction icon={<Video className="w-5 h-5" />} label="Film Room" href="/studio" color="bg-purple-900/40 border-purple-700/50 hover:bg-purple-800/40" />
                <QuickAction icon={<Target className="w-5 h-5" />} label="Recruiting" href="/recruiting-hub" color="bg-cyan-900/40 border-cyan-700/50 hover:bg-cyan-800/40" />
                <QuickAction icon={<ShoppingBag className="w-5 h-5" />} label="Store" href="/athlete-store" color="bg-orange-900/40 border-orange-700/50 hover:bg-orange-800/40" />
                <QuickAction icon={<BarChart2 className="w-5 h-5" />} label="Analytics" href="/athlete-data" color="bg-indigo-900/40 border-indigo-700/50 hover:bg-indigo-800/40" />
                <QuickAction icon={<Gavel className="w-5 h-5" />} label="Legal" href="/athlete-legal-hub" color="bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/60" />
                <QuickAction icon={<Globe className="w-5 h-5" />} label="Transfer" href="/transfer-portal" color="bg-teal-900/40 border-teal-700/50 hover:bg-teal-800/40" />
                <QuickAction icon={<Award className="w-5 h-5" />} label="NIL Vault" href="/nil-vault" color="bg-emerald-900/40 border-emerald-700/50 hover:bg-emerald-800/40" />
                <QuickAction icon={<Cpu className="w-5 h-5" />} label="AI Coach" href="/ai-trainer" color="bg-blue-900/60 border-blue-700/50 hover:bg-blue-800/60" />
              </div>
            </div>

            {/* Today's Agenda */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-black text-blue-400 tracking-widest uppercase">Today's Agenda</div>
                <Link href="/athlete-calendar"><span className="text-xs text-blue-500 hover:text-blue-300">View All →</span></Link>
              </div>
              <div className="space-y-2">
                {[
                  { time: "9:00 AM", event: "Morning Training Session", icon: "💪", type: "training" },
                  { time: "11:30 AM", event: "Coach Johnson — Recruiting Call", icon: "📞", type: "recruiting" },
                  { time: "2:00 PM", event: "NIL Deal Review — Brand Partner", icon: "💰", type: "nil" },
                  { time: "4:00 PM", event: "Film Review — Last Game", icon: "🎬", type: "film" },
                  { time: "7:00 PM", event: "The Athlete's Playbook Podcast", icon: "🎙️", type: "media" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-blue-900/30 last:border-0">
                    <div className="text-lg">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-white text-xs font-semibold">{item.event}</div>
                      <div className="text-blue-500 text-[10px]">{item.time}</div>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      item.type === "nil" ? "bg-green-500/20 text-green-400" :
                      item.type === "recruiting" ? "bg-blue-500/20 text-blue-400" :
                      item.type === "film" ? "bg-purple-500/20 text-purple-400" :
                      item.type === "media" ? "bg-red-500/20 text-red-400" :
                      "bg-cyan-500/20 text-cyan-400"
                    }`}>{item.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NIL Deal Alerts */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-700/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-black text-green-400 tracking-widest uppercase">💰 NIL Opportunities</div>
                <Link href="/nil-portal"><span className="text-xs text-green-500 hover:text-green-300">View All →</span></Link>
              </div>
              <div className="space-y-2">
                {[
                  { brand: "Top Apparel Brand", type: "Apparel Sponsor", value: "$25K–$100K", match: 94, logo: "👟" },
                  { brand: "Sports Drink Brand", type: "Hydration Partner", value: "$5K–$25K", match: 88, logo: "💧" },
                  { brand: "Outdoor Gear Brand", type: "Outdoor Apparel", value: "$3K–$15K", match: 82, logo: "🦌" },
                  { brand: "Lifestyle Brand", type: "Lifestyle Partner", value: "$2K–$10K", match: 79, logo: "🎒" },
                ].map((deal, i) => (
                  <div key={i} className="flex items-center gap-3 bg-green-900/20 rounded-xl p-3">
                    <div className="text-2xl">{deal.logo}</div>
                    <div className="flex-1">
                      <div className="text-white text-xs font-bold">{deal.brand}</div>
                      <div className="text-green-400 text-[10px]">{deal.type} · {deal.value}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-xs font-black">{deal.match}%</div>
                      <div className="text-green-600 text-[9px]">match</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiting Pulse */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-black text-blue-400 tracking-widest uppercase">🎓 Recruiting Pulse</div>
                <Link href="/recruiting-hub"><span className="text-xs text-blue-500 hover:text-blue-300">View All →</span></Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Coach Views", value: "12", sub: "This week", icon: "👁️", color: "text-cyan-400" },
                  { label: "Scholarship Offers", value: "3", sub: "Pending review", icon: "📋", color: "text-green-400" },
                  { label: "School Interests", value: "8", sub: "D1 programs", icon: "🏫", color: "text-blue-400" },
                  { label: "Profile Views", value: "247", sub: "Last 30 days", icon: "📊", color: "text-purple-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-blue-900/30 rounded-xl p-3">
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-white text-xs font-semibold">{stat.label}</div>
                    <div className="text-blue-500 text-[10px]">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Podcast Latest Episode */}
            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/20 border border-red-700/40 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-red-400 tracking-widest uppercase">Latest Episode</div>
                  <div className="text-white font-black text-sm">The Athlete's Playbook Podcast</div>
                </div>
              </div>
              <div className="bg-red-900/20 rounded-xl p-3 mb-3">
                <div className="text-white text-sm font-bold mb-1">"NIL in 2026: Every Athlete Gets Paid"</div>
                <div className="text-red-400 text-xs">Chad A. Dozier · 42 min · 12.4K plays</div>
              </div>
              <div className="flex gap-2">
                <Link href="/podcast" className="flex-1">
                  <button className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> Listen Now
                  </button>
                </Link>
                <Link href="/podcast">
                  <button className="bg-red-900/40 border border-red-700/50 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl">
                    All Episodes
                  </button>
                </Link>
              </div>
            </div>

            {/* Vendor Spotlight — Demo/Coming Soon */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-black text-blue-400 tracking-widest uppercase">🛍️ Vendor Marketplace</div>
                <Link href="/athlete-store"><span className="text-xs text-blue-500 hover:text-blue-300">Browse →</span></Link>
              </div>
              <div className="text-[10px] text-blue-600 mb-3 italic">Sample categories — vendor partnerships opening soon. Apply to list your brand.</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Outdoor Performance", tagline: "Hunting & field gear", category: "Example Category", icon: "🦌", color: "from-green-900/40 to-teal-900/30", border: "border-green-700/40", story: "Premium performance gear for athletes who train and compete in the field." },
                  { name: "Outdoor Lifestyle", tagline: "Adventure apparel", category: "Example Category", icon: "🎒", color: "from-orange-900/30 to-yellow-900/20", border: "border-orange-700/40", story: "Authentic outdoor lifestyle brands built for athletes who live the adventure." },
                  { name: "Sports Nutrition", tagline: "Fuel your performance", category: "Example Category", icon: "🥤", color: "from-blue-900/40 to-cyan-900/30", border: "border-blue-700/40", story: "Nutrition and recovery brands designed for elite athletic performance." },
                  { name: "Tech & Wearables", tagline: "Train smarter", category: "Example Category", icon: "⌚", color: "from-purple-900/40 to-indigo-900/30", border: "border-purple-700/40", story: "Smart training technology that feeds data directly to your AthlynX dashboard." },
                ].map((vendor, i) => (
                  <Link key={i} href="/athlete-store">
                    <div className={`bg-gradient-to-br ${vendor.color} border ${vendor.border} rounded-xl p-3 cursor-pointer hover:scale-[1.02] transition-transform`}>
                      <div className="text-3xl mb-2">{vendor.icon}</div>
                      <div className="text-white text-sm font-black">{vendor.name}</div>
                      <div className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 inline-block mb-1">COMING SOON</div>
                      <div className="text-blue-400 text-[9px] leading-relaxed">{vendor.story}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/partners">
                <button className="w-full mt-3 border border-blue-700/50 text-blue-400 text-xs font-bold py-2.5 rounded-xl hover:bg-blue-900/30 transition-colors">
                  🤝 Apply to Become a Vendor Partner
                </button>
              </Link>
            </div>
          </>
        )}

        {/* ── ECOSYSTEM ROLES SECTION ── */}
        {activeSection === "roles" && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-2">The AthlynX Ecosystem</div>
              <h2 className="text-2xl font-black text-white">Every Role. One Platform.</h2>
              <p className="text-blue-400 text-sm mt-2">From first practice to Hall of Fame — every person in the sports journey runs through AthlynX.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role, i) => (
                <Link key={i} href={role.href}>
                  <div className={`bg-gradient-to-br ${role.color} rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-transform`}>
                    <div className="text-3xl mb-2">{role.icon}</div>
                    <div className="text-white font-black text-lg">{role.label}</div>
                    <div className="text-white/70 text-xs">{role.desc}</div>
                    <div className="mt-2 text-white/50 text-[10px] flex items-center gap-1">Enter Hub <ChevronRight className="w-3 h-3" /></div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[#0d1e3c] to-[#0a1628] border border-blue-800/50 rounded-2xl p-5 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-white font-black text-xl mb-2">The Middleware of Sports Life</h3>
              <p className="text-blue-400 text-sm">AthlynX is the platform that connects every person in the sports ecosystem — from youth athlete to retired legend. We are the middleman for the entire sports journey.</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { val: "520K+", label: "Athletes" },
                  { val: "$2.5B+", label: "NIL Market" },
                  { val: "44", label: "Sports" },
                ].map((s, i) => (
                  <div key={i} className="bg-blue-900/30 rounded-xl p-3">
                    <div className="text-cyan-400 font-black text-xl">{s.val}</div>
                    <div className="text-blue-400 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COMPETITOR COMPARISON ── */}
        {activeSection === "compare" && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-2">Competitive Analysis</div>
              <h2 className="text-2xl font-black text-white">AthlynX vs Everyone</h2>
              <p className="text-blue-400 text-sm mt-2">We don't just beat the competition. We make them irrelevant.</p>
            </div>
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-5 bg-blue-900/40 px-3 py-2 text-[10px] font-black text-blue-400 uppercase tracking-wider">
                <div className="col-span-2">Feature</div>
                <div className="text-center">PG</div>
                <div className="text-center">Hudl</div>
                <div className="text-center text-cyan-400">AthlynX</div>
              </div>
              {COMPARE.map((row, i) => (
                <div key={i} className={`grid grid-cols-5 px-3 py-2.5 border-t border-blue-900/30 ${i % 2 === 0 ? "bg-blue-900/10" : ""}`}>
                  <div className="col-span-2 text-white text-[11px] font-semibold">{row.feature}</div>
                  <div className="flex justify-center">{row.pg ? <span className="text-green-400 text-sm">✓</span> : <span className="text-red-500/50 text-sm">✗</span>}</div>
                  <div className="flex justify-center">{row.hudl ? <span className="text-green-400 text-sm">✓</span> : <span className="text-red-500/50 text-sm">✗</span>}</div>
                  <div className="flex justify-center">{row.athlynx ? <span className="text-cyan-400 text-sm font-black">✓</span> : <span className="text-red-500/50 text-sm">✗</span>}</div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-700/40 rounded-2xl p-4 text-center">
              <div className="text-cyan-400 font-black text-3xl mb-1">15/15</div>
              <div className="text-white font-bold">Features Only AthlynX Has</div>
              <div className="text-blue-400 text-sm mt-1">Perfect Game: 3/15 · Hudl: 4/15 · On3: 5/15</div>
            </div>
          </div>
        )}

        {/* ── PLATFORM ECOSYSTEM ── */}
        {activeSection === "ecosystem" && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-2">Dozier Holdings Group</div>
              <h2 className="text-2xl font-black text-white">The Full Platform</h2>
              <p className="text-blue-400 text-sm mt-2">Every tool. Every app. One ecosystem.</p>
            </div>
            {[
              {
                category: "📱 Daily App (Mobile/Tablet)",
                desc: "Your sports life in your pocket — feels like Facebook/X",
                items: [
                  { label: "NIL Portal Feed", href: "/nil-portal", badge: "LIVE" },
                  { label: "NIL Messenger", href: "/messenger", badge: "LIVE" },
                  { label: "Athlete Dashboard", href: "/athlete-dashboard", badge: "LIVE" },
                  { label: "Social Feed", href: "/feed", badge: "LIVE" },
                  { label: "Podcast Player", href: "/podcast", badge: "LIVE" },
                ],
              },
              {
                category: "🖥️ Command Center (Desktop/Studio)",
                desc: "Full editing power — home, studio, office, stadium",
                items: [
                  { label: "Film Room & Studio", href: "/studio", badge: "LIVE" },
                  { label: "CRM Command Center", href: "/crm-command", badge: "LIVE" },
                  { label: "Social Command Center", href: "/social-command", badge: "LIVE" },
                  { label: "Analytics Dashboard", href: "/athlete-data", badge: "LIVE" },
                  { label: "Agent Finder", href: "/agent-finder", badge: "LIVE" },
                ],
              },
              {
                category: "🏆 Rankings & Discovery",
                desc: "Beats Perfect Game, 247Sports, On3, Rivals",
                items: [
                  { label: "Rankings Hub", href: "/rankings-hub", badge: "NEW" },
                  { label: "Recruiting Hub", href: "/recruiting-hub", badge: "LIVE" },
                  { label: "Transfer Portal", href: "/transfer-portal", badge: "LIVE" },
                  { label: "X-Factor Scoring", href: "/x-factor", badge: "AI" },
                  { label: "Browse Athletes", href: "/browse-athletes", badge: "LIVE" },
                ],
              },
              {
                category: "💰 NIL & Business",
                desc: "Every dollar you earn runs through here",
                items: [
                  { label: "NIL Portal", href: "/nil-portal", badge: "LIVE" },
                  { label: "NIL Vault", href: "/nil-vault", badge: "LIVE" },
                  { label: "Athlete Store", href: "/athlete-store", badge: "LIVE" },
                  { label: "Legal Hub", href: "/athlete-legal-hub", badge: "LIVE" },
                  { label: "Financial Hub", href: "/athlete-financial", badge: "LIVE" },
                ],
              },
              {
                category: "🎙️ Media & Content",
                desc: "Bigger than Barstool Sports — athlete-owned media",
                items: [
                  { label: "Podcast Network", href: "/podcast", badge: "LIVE" },
                  { label: "Media Studio", href: "/studio", badge: "LIVE" },
                  { label: "Media Showcase", href: "/media-showcase", badge: "LIVE" },
                  { label: "AI Content Creator", href: "/ai-content", badge: "AI" },
                  { label: "Social Hub", href: "/social-hub", badge: "LIVE" },
                ],
              },
            ].map((section, i) => (
              <div key={i} className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
                <div className="font-black text-white text-sm mb-1">{section.category}</div>
                <div className="text-blue-400 text-xs mb-3">{section.desc}</div>
                <div className="space-y-1">
                  {section.items.map((item, j) => (
                    <Link key={j} href={item.href}>
                      <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-blue-900/30 transition-colors cursor-pointer">
                        <span className="text-blue-200 text-sm">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                            item.badge === "LIVE" ? "bg-green-500/20 text-green-400" :
                            item.badge === "NEW" ? "bg-yellow-500/20 text-yellow-400" :
                            item.badge === "AI" ? "bg-purple-500/20 text-purple-400" :
                            "bg-blue-500/20 text-blue-400"
                          }`}>{item.badge}</span>
                          <ChevronRight className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Powered By */}
            <div className="bg-gradient-to-br from-[#0d1e3c] to-[#0a1628] border border-blue-800/50 rounded-2xl p-4 text-center">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-3">Powered By</div>
              <div className="flex flex-wrap justify-center gap-2">
                {["Private AI", "Private Intelligence", "Private Reasoning", "Protected Data", "Secure Delivery", "Live Edge Delivery", "Payments Ready", "Messaging Ready"].map((tech, i) => (
                  <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300">{tech}</span>
                ))}
              </div>
              <div className="mt-4 text-blue-500 text-xs">
                Founded by Chad A. Dozier & Glenn Tse · Houston, TX · November 2024<br />
                <span className="text-blue-600">Iron Sharpens Iron — Proverbs 27:17</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default function CFactorHub() {
  return <RouteErrorBoundary><CFactorHubInner /></RouteErrorBoundary>;
}
