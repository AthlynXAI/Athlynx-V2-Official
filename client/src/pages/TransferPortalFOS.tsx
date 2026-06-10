/**
 * AthlynX TRANSFER PORTAL — S39 REBRAND
 * Full AthlynXAI theme: #040c1a navy, #0066ff blue, #00c2ff cyan.
 * Matches the rest of the platform exactly.
 *
 * Session 39 — May 6, 2026
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  Search, TrendingUp, Clock, Share2, Bookmark, ChevronRight,
  Flame, Zap, Star, Filter, Bell, ArrowRight, Activity,
  Trophy, DollarSign, Users, Radio
} from "lucide-react";

// ─── Breaking News ────────────────────────────────────────────────────────────
const BREAKING_NEWS = [
  { id: 1, headline: "Travis Hunter Declares for NFL Draft", school: "Colorado", player: "Travis Hunter", position: "CB/WR", nilValue: "$4.5M", time: "2h ago", hot: true, type: "nfl", summary: "Two-way Heisman winner heads to the league after historic season in Boulder." },
  { id: 2, headline: "AJ Swann Commits to Mississippi State", school: "Mississippi State", player: "AJ Swann", position: "QB", nilValue: "$850K", time: "4h ago", hot: true, type: "commitment", summary: "Former Vanderbilt starter brings SEC experience to Starkville." },
  { id: 3, headline: "5-Star Edge Rusher Enters Portal from Georgia", school: "Georgia", player: "Mykel Williams", position: "Edge", nilValue: "$1.2M", time: "6h ago", hot: false, type: "portal", summary: "Former top recruit looking for more playing time after championship season." },
  { id: 4, headline: "Ohio State WR Commits to USC", school: "USC", player: "Carnell Tate", position: "WR", nilValue: "$920K", time: "8h ago", hot: false, type: "commitment", summary: "Chicago native heads west for fresh start under Lincoln Riley." },
  { id: 5, headline: "Alabama RB Enters Transfer Portal", school: "Alabama", player: "Jam Miller", position: "RB", nilValue: "$680K", time: "12h ago", hot: false, type: "portal", summary: "Seeking starting role after splitting carries in Tuscaloosa." },
];

// ─── Top Available Players ────────────────────────────────────────────────────
const TOP_AVAILABLE = [
  { rank: 1, name: "Jalen Milroe", pos: "QB", school: "Alabama", nil: "$2.8M", xScore: 96 },
  { rank: 2, name: "Quinshon Judkins", pos: "RB", school: "Ohio State", nil: "$1.9M", xScore: 94 },
  { rank: 3, name: "Tetairoa McMillan", pos: "WR", school: "Arizona", nil: "$2.35M", xScore: 93 },
  { rank: 4, name: "Nic Scourton", pos: "Edge", school: "Texas A&M", nil: "$1.4M", xScore: 91 },
  { rank: 5, name: "Kelvin Banks Jr.", pos: "OT", school: "Texas", nil: "$1.6M", xScore: 90 },
];

// ─── School Activity ──────────────────────────────────────────────────────────
const SCHOOL_ACTIVITY = [
  { school: "Colorado", emoji: "🦬", in: 24, out: 8, net: "+$12.4M", conf: "Big 12" },
  { school: "USC", emoji: "✌️", in: 18, out: 12, net: "+$8.2M", conf: "Big Ten" },
  { school: "Texas", emoji: "🤘", in: 15, out: 6, net: "+$6.8M", conf: "SEC" },
  { school: "Alabama", emoji: "🅰️", in: 12, out: 14, net: "-$2.1M", conf: "SEC" },
  { school: "Ohio State", emoji: "🌰", in: 11, out: 9, net: "+$4.5M", conf: "Big Ten" },
];

// ─── Live Ticker ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "🔥 Travis Hunter declares for NFL Draft",
  "📢 AJ Swann commits to Mississippi State",
  "⚡ 847 players currently in portal",
  "💰 $2.1B total NIL value in portal",
  "🏈 Jalen Milroe tops available QB rankings",
  "🔄 5-star edge rusher enters portal from Georgia",
];

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  if (type === "commitment") return <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">COMMITMENT</span>;
  if (type === "portal") return <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">IN PORTAL</span>;
  return <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">NFL DRAFT</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function TransferPortalFOSInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"news" | "players" | "schools">("news");
  const [search, setSearch] = useState("");
  const [tickerIdx, setTickerIdx] = useState(0);

  const filteredNews = BREAKING_NEWS.filter(n =>
    !search || n.headline.toLowerCase().includes(search.toLowerCase()) || n.player.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#040c1a] pb-24">

        {/* Live Ticker */}
        <div className="bg-[#0066ff] overflow-hidden py-2.5">
          <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap" style={{ gap: "3rem" }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-white font-black text-sm tracking-wide flex items-center shrink-0" style={{ marginRight: "2rem" }}>
                {item}&nbsp;&nbsp;<span className="text-white/50">⚡</span>
              </span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-b from-[#0a1628] to-[#040c1a] px-4 pt-5 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className="text-[#00c2ff]" />
              <div className="text-[10px] font-black tracking-[0.3em] text-[#00c2ff] uppercase">AthlynX Transfer Portal</div>
            </div>
            <h1 className="text-2xl font-black text-white">Transfer Portal™</h1>
            <p className="text-[#8ba3c7] text-sm mt-1">Breaking news, top available players, school activity, and NIL values — all in real time.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: "📡 Live Updates", color: "bg-red-900/40 border-red-700/40 text-red-300" },
                { label: `🔄 847 In Portal`, color: "bg-[#0066ff]/20 border-[#0066ff]/30 text-[#00c2ff]" },
                { label: "💰 $2.1B NIL Value", color: "bg-green-900/40 border-green-700/40 text-green-300" },
              ].map((b, i) => (
                <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="sticky top-0 z-20 bg-[#040c1a]/95 backdrop-blur border-b border-blue-900/30 px-4 py-2">
          <div className="max-w-2xl mx-auto flex gap-1.5">
            {[
              { id: "news", label: "📰 Breaking News" },
              { id: "players", label: "⭐ Top Available" },
              { id: "schools", label: "🏫 School Activity" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors ${
                  activeTab === tab.id ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "text-[#8ba3c7] bg-[#0a1628] hover:text-white"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

          {/* ══ BREAKING NEWS ══ */}
          {activeTab === "news" && (
            <>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6080]" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search players, schools, news..."
                  className="w-full bg-[#0a1628] border border-[#0066ff]/20 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff]" />
              </div>

              {filteredNews.map(news => (
                <div key={news.id} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-2xl overflow-hidden hover:border-[#0066ff]/50 transition-all">
                  <div className="h-1 bg-gradient-to-r from-[#0066ff] to-[#00c2ff]" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {news.hot && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                            <Flame size={10} /> HOT
                          </span>
                        )}
                        <TypeBadge type={news.type} />
                      </div>
                      <div className="flex items-center gap-1 text-[#4a6080] text-[10px]">
                        <Clock size={10} />
                        <span>{news.time}</span>
                      </div>
                    </div>
                    <h3 className="text-white font-black text-base mb-2 leading-tight">{news.headline}</h3>
                    <p className="text-[#8ba3c7] text-xs mb-4 leading-relaxed">{news.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center text-white font-black text-sm">
                          {news.player.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-white font-black text-sm">{news.player}</div>
                          <div className="text-[#4a6080] text-xs">{news.position} · {news.school}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-black text-sm">{news.nilValue}</div>
                        <div className="text-[#4a6080] text-[10px]">NIL Value</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0066ff]/10">
                      <div className="flex gap-3">
                        <button onClick={() => toast.success("Shared!")} className="text-[#4a6080] hover:text-[#00c2ff] transition-colors"><Share2 size={14} /></button>
                        <button onClick={() => toast.success("Saved!")} className="text-[#4a6080] hover:text-[#00c2ff] transition-colors"><Bookmark size={14} /></button>
                      </div>
                      <button className="text-[#00c2ff] text-xs font-bold flex items-center gap-1 hover:text-white transition-colors">
                        Full Story <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ══ TOP AVAILABLE ══ */}
          {activeTab === "players" && (
            <>
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-[#0066ff]/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-red-400 animate-pulse" />
                  <div className="text-[10px] font-black text-red-400 tracking-widest uppercase">Live Rankings</div>
                </div>
                <div className="text-white font-black text-lg">Top Available Players</div>
                <p className="text-[#8ba3c7] text-xs mt-1">Ranked by AthlynX X-Factor Score™</p>
              </div>

              {TOP_AVAILABLE.map((player, i) => (
                <div key={i} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-2xl p-4 flex items-center gap-3 hover:border-[#0066ff]/50 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 ${
                    player.rank === 1 ? "bg-gradient-to-br from-[#0066ff] to-[#00c2ff]" : "bg-[#0a1628] border border-[#0066ff]/30"
                  }`}>
                    #{player.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black text-sm">{player.name}</div>
                    <div className="text-[#4a6080] text-xs">{player.pos} · {player.school}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[#00c2ff] font-black text-lg">{player.xScore}</div>
                    <div className="text-[#4a6080] text-[10px]">X-Score</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-green-400 font-black text-sm">{player.nil}</div>
                    <div className="text-[#4a6080] text-[10px]">NIL</div>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-dashed border-[#0066ff]/30 rounded-2xl p-5 text-center">
                <Trophy size={24} className="text-[#00c2ff] mx-auto mb-2" />
                <div className="text-white font-black text-sm mb-1">Get Your X-Factor Score</div>
                <p className="text-[#8ba3c7] text-xs mb-3">Complete your profile to get ranked alongside the top transfer portal prospects nationwide.</p>
                <Link href="/profile">
                  <button className="bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black px-6 py-2.5 rounded-xl">
                    Update My Profile →
                  </button>
                </Link>
              </div>
            </>
          )}

          {/* ══ SCHOOL ACTIVITY ══ */}
          {activeTab === "schools" && (
            <>
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-[#0066ff]/20 rounded-2xl p-4">
                <div className="text-white font-black text-lg mb-1">School Transfer Activity</div>
                <p className="text-[#8ba3c7] text-xs">Transfers in, out, and net NIL movement by program.</p>
              </div>

              {SCHOOL_ACTIVITY.map((s, i) => (
                <div key={i} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-2xl p-4 hover:border-[#0066ff]/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center text-2xl shrink-0">
                      {s.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-black text-sm">{s.school}</div>
                      <div className="text-[#4a6080] text-xs">{s.conf}</div>
                    </div>
                    <div className={`font-black text-sm ${s.net.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{s.net}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 text-center">
                      <div className="text-green-400 font-black text-lg">{s.in}</div>
                      <div className="text-[#4a6080] text-[10px]">IN</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 text-center">
                      <div className="text-red-400 font-black text-lg">{s.out}</div>
                      <div className="text-[#4a6080] text-[10px]">OUT</div>
                    </div>
                    <div className={`${s.net.startsWith("+") ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"} border rounded-xl p-2 text-center`}>
                      <div className={`font-black text-sm ${s.net.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{s.net}</div>
                      <div className="text-[#4a6080] text-[10px]">NET NIL</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-[#0a1628] border border-[#0066ff]/20 rounded-2xl p-4 text-center">
                <Users size={24} className="text-[#0066ff] mx-auto mb-2" />
                <div className="text-white font-black text-sm mb-1">Find Your Next School</div>
                <p className="text-[#8ba3c7] text-xs mb-3">Use the AthlynX Transfer Portal Intelligence to match with programs that fit your profile.</p>
                <Link href="/transfer-intelligence">
                  <button className="bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black px-6 py-2.5 rounded-xl">
                    Find My Match →
                  </button>
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function TransferPortalFOS() {
  return <RouteErrorBoundary><TransferPortalFOSInner /></RouteErrorBoundary>;
}
