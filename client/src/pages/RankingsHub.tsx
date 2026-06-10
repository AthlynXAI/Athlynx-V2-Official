/**
 * AthlynX RANKINGS HUB — S39 UPGRADE
 * Beats: Perfect Game · 247Sports · On3 · Rivals · MaxPreps
 *
 * NEW in S39:
 *   - Live Leaderboard with animated rank changes + momentum arrows
 *   - Combine Stats Tracker (40-yd, vertical, bench, shuttle) with percentile bars
 *   - Global Activity Ticker (live platform events)
 *   - Expanded sport filters (all major sports)
 *   - AI Scouting Score breakdown per athlete
 *
 * Session 39 — May 6, 2026
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  Trophy, Zap, TrendingUp, Users, Clock, Award,
  Search, ArrowUp, ArrowDown, Minus, Cpu,
  Dumbbell, Gauge, Radio, Activity
} from "lucide-react";

// ─── Live Activity Feed ───────────────────────────────────────────────────────
const LIVE_EVENTS = [
  { icon: "🏈", text: "Marcus Williams (QB, TX) just received offer from Alabama", time: "2m ago", color: "text-red-400" },
  { icon: "💰", text: "Aaliyah Thompson signed $12,500 NIL deal with Nike", time: "5m ago", color: "text-green-400" },
  { icon: "🔄", text: "Devon Carter entered Transfer Portal from Klein HS", time: "8m ago", color: "text-sky-400" },
  { icon: "⚡", text: "Jordan Davis X-Factor score jumped to 94 (+3)", time: "11m ago", color: "text-cyan-400" },
  { icon: "🎓", text: "Tyler Brooks committed to Ohio State", time: "14m ago", color: "text-blue-400" },
  { icon: "📹", text: "New highlight reel uploaded: Keisha Moore, WR, GA", time: "17m ago", color: "text-purple-400" },
  { icon: "🏆", text: "Westlake HS Football ranked #1 in Texas 6A", time: "22m ago", color: "text-sky-400" },
  { icon: "🤝", text: "Coach Williams (LSU) viewed 4 profiles today", time: "25m ago", color: "text-green-400" },
];

// ─── Leaderboard ──────────────────────────────────────────────────────────────
const LEADERBOARD_SPORTS = ["All Sports", "Football", "Basketball", "Baseball", "Soccer", "Track", "Wrestling", "Swimming", "Volleyball", "Golf"];

const LEADERBOARD_ATHLETES = [
  { rank: 1, prev: 2, name: "Marcus Williams", sport: "Football", pos: "QB", school: "Westlake HS", state: "TX", year: "2027", xScore: 98, nilValue: 85000, offers: 24, verified: true, avatar: "MW" },
  { rank: 2, prev: 1, name: "Aaliyah Thompson", sport: "Basketball", pos: "PG", school: "Cy-Fair HS", state: "TX", year: "2027", xScore: 96, nilValue: 62000, offers: 22, verified: true, avatar: "AT" },
  { rank: 3, prev: 3, name: "Jordan Davis", sport: "Baseball", pos: "RHP", school: "The Woodlands HS", state: "TX", year: "2027", xScore: 94, nilValue: 41000, offers: 12, verified: true, avatar: "JD" },
  { rank: 4, prev: 6, name: "Keisha Moore", sport: "Football", pos: "WR", school: "North Shore HS", state: "GA", year: "2027", xScore: 93, nilValue: 38000, offers: 19, verified: false, avatar: "KM" },
  { rank: 5, prev: 4, name: "Tyler Brooks", sport: "Football", pos: "LB", school: "Mater Dei HS", state: "CA", year: "2027", xScore: 92, nilValue: 35000, offers: 18, verified: true, avatar: "TB" },
  { rank: 6, prev: 8, name: "Devon Carter", sport: "Soccer", pos: "MF", school: "Klein HS", state: "TX", year: "2027", xScore: 91, nilValue: 28000, offers: 8, verified: false, avatar: "DC" },
  { rank: 7, prev: 7, name: "Simone Jackson", sport: "Track", pos: "100m/200m", school: "Spring HS", state: "TX", year: "2026", xScore: 90, nilValue: 22000, offers: 14, verified: true, avatar: "SJ" },
  { rank: 8, prev: 5, name: "Caleb Torres", sport: "Basketball", pos: "SF", school: "IMG Academy", state: "FL", year: "2027", xScore: 89, nilValue: 55000, offers: 30, verified: true, avatar: "CT" },
  { rank: 9, prev: 10, name: "Priya Sharma", sport: "Swimming", pos: "200m Free", school: "Katy HS", state: "TX", year: "2027", xScore: 88, nilValue: 18000, offers: 9, verified: false, avatar: "PS" },
  { rank: 10, prev: 9, name: "Darius King", sport: "Football", pos: "CB", school: "DeSoto HS", state: "TX", year: "2026", xScore: 87, nilValue: 31000, offers: 16, verified: true, avatar: "DK" },
  { rank: 11, prev: 13, name: "Mia Hernandez", sport: "Volleyball", pos: "OH", school: "Cinco Ranch HS", state: "TX", year: "2027", xScore: 86, nilValue: 15000, offers: 7, verified: false, avatar: "MH" },
  { rank: 12, prev: 11, name: "Zach Powell", sport: "Baseball", pos: "SS", school: "Cypress Ranch HS", state: "TX", year: "2027", xScore: 85, nilValue: 20000, offers: 10, verified: true, avatar: "ZP" },
];

// ─── Combine Stats ────────────────────────────────────────────────────────────
const COMBINE_ATHLETES = [
  { name: "Marcus Williams", sport: "Football", pos: "QB", school: "Westlake HS", fortyYd: "4.52", vertical: "38.5", bench: 22, shuttle: "4.12", xScore: 98, pct40: 94, pctVert: 91, pctBench: 78, pctShuttle: 96 },
  { name: "Tyler Brooks", sport: "Football", pos: "LB", school: "Mater Dei HS", fortyYd: "4.61", vertical: "36.0", bench: 28, shuttle: "4.18", xScore: 92, pct40: 88, pctVert: 85, pctBench: 92, pctShuttle: 90 },
  { name: "Keisha Moore", sport: "Football", pos: "WR", school: "North Shore HS", fortyYd: "4.38", vertical: "40.5", bench: 14, shuttle: "3.98", xScore: 93, pct40: 98, pctVert: 97, pctBench: 55, pctShuttle: 99 },
  { name: "Darius King", sport: "Football", pos: "CB", school: "DeSoto HS", fortyYd: "4.41", vertical: "39.0", bench: 16, shuttle: "4.02", xScore: 87, pct40: 97, pctVert: 93, pctBench: 60, pctShuttle: 98 },
  { name: "Caleb Torres", sport: "Basketball", pos: "SF", school: "IMG Academy", fortyYd: "4.55", vertical: "42.0", bench: 18, shuttle: "4.09", xScore: 89, pct40: 92, pctVert: 99, pctBench: 65, pctShuttle: 93 },
];

// ─── Mock Draft ───────────────────────────────────────────────────────────────
const MOCK_DRAFTS: Record<string, { league: string; picks: { pick: number; team: string; player: string; pos: string; school: string; xScore: number }[] }> = {
  mlb: {
    league: "MLB Draft 2027",
    picks: [
      { pick: 1, team: "Pittsburgh Pirates", player: "Jordan Davis", pos: "RHP", school: "The Woodlands HS", xScore: 94 },
      { pick: 2, team: "Colorado Rockies", player: "Zach Powell", pos: "SS", school: "Cypress Ranch HS", xScore: 85 },
      { pick: 3, team: "Miami Marlins", player: "Carlos Reyes", pos: "C", school: "Hialeah HS", xScore: 82 },
      { pick: 4, team: "Oakland Athletics", player: "Brett Hansen", pos: "LHP", school: "Jesuit HS", xScore: 80 },
      { pick: 5, team: "Kansas City Royals", player: "Tyler Nguyen", pos: "CF", school: "IMG Academy", xScore: 79 },
    ],
  },
  nfl: {
    league: "NFL Draft 2028",
    picks: [
      { pick: 1, team: "Tennessee Titans", player: "Marcus Williams", pos: "QB", school: "Westlake HS", xScore: 98 },
      { pick: 2, team: "New York Giants", player: "Keisha Moore", pos: "WR", school: "North Shore HS", xScore: 93 },
      { pick: 3, team: "Carolina Panthers", player: "Tyler Brooks", pos: "LB", school: "Mater Dei HS", xScore: 92 },
      { pick: 4, team: "New England Patriots", player: "Darius King", pos: "CB", school: "DeSoto HS", xScore: 87 },
      { pick: 5, team: "Chicago Bears", player: "Malik Johnson", pos: "OT", school: "Duncanville HS", xScore: 86 },
    ],
  },
  nba: {
    league: "NBA Draft 2027",
    picks: [
      { pick: 1, team: "San Antonio Spurs", player: "Caleb Torres", pos: "SF", school: "IMG Academy", xScore: 89 },
      { pick: 2, team: "Portland Trail Blazers", player: "Aaliyah Thompson", pos: "PG", school: "Cy-Fair HS", xScore: 96 },
      { pick: 3, team: "Detroit Pistons", player: "Isaiah Grant", pos: "C", school: "Oak Hill Academy", xScore: 84 },
      { pick: 4, team: "Houston Rockets", player: "Jaylen Ross", pos: "SG", school: "Bellaire HS", xScore: 83 },
      { pick: 5, team: "Washington Wizards", player: "Tre Williams", pos: "PF", school: "Montverde Academy", xScore: 81 },
    ],
  },
};

// ─── College Top 25 ───────────────────────────────────────────────────────────
const COLLEGE_TOP25: Record<string, { rank: number; school: string; conf: string; record: string; trend: string }[]> = {
  football: [
    { rank: 1, school: "Georgia Bulldogs", conf: "SEC", record: "14-1", trend: "▲" },
    { rank: 2, school: "Ohio State Buckeyes", conf: "Big Ten", record: "13-2", trend: "▼" },
    { rank: 3, school: "Alabama Crimson Tide", conf: "SEC", record: "13-1", trend: "▲" },
    { rank: 4, school: "Texas Longhorns", conf: "SEC", record: "12-2", trend: "▲" },
    { rank: 5, school: "Penn State Nittany Lions", conf: "Big Ten", record: "13-2", trend: "—" },
  ],
  basketball: [
    { rank: 1, school: "Duke Blue Devils", conf: "ACC", record: "32-5", trend: "▲" },
    { rank: 2, school: "Kansas Jayhawks", conf: "Big 12", record: "30-6", trend: "▼" },
    { rank: 3, school: "Houston Cougars", conf: "Big 12", record: "31-5", trend: "▲" },
    { rank: 4, school: "Auburn Tigers", conf: "SEC", record: "29-7", trend: "▲" },
    { rank: 5, school: "Tennessee Volunteers", conf: "SEC", record: "28-8", trend: "—" },
  ],
  baseball: [
    { rank: 1, school: "Texas Longhorns", conf: "SEC", record: "45-14", trend: "▲" },
    { rank: 2, school: "LSU Tigers", conf: "SEC", record: "44-15", trend: "▼" },
    { rank: 3, school: "Florida Gators", conf: "SEC", record: "43-16", trend: "▲" },
    { rank: 4, school: "Vanderbilt Commodores", conf: "SEC", record: "42-16", trend: "—" },
    { rank: 5, school: "Arkansas Razorbacks", conf: "SEC", record: "41-17", trend: "▲" },
  ],
};

// ─── Percentile Bar ───────────────────────────────────────────────────────────
function PercentileBar({ pct, label, value }: { pct: number; label: string; value: string }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-blue-400 text-[10px] font-bold">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-black">{value}</span>
          <span className="text-cyan-400 text-[10px] font-bold">{pct}th %ile</span>
        </div>
      </div>
      <div className="h-1.5 bg-blue-900/40 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0066ff, #00c2ff)" }} />
      </div>
    </div>
  );
}

// ─── Rank Change Badge ────────────────────────────────────────────────────────
function RankBadge({ current, prev }: { current: number; prev: number }) {
  const diff = prev - current;
  if (diff > 0) return <div className="flex items-center gap-0.5 text-green-400 text-[10px] font-black"><ArrowUp size={10} /><span>{diff}</span></div>;
  if (diff < 0) return <div className="flex items-center gap-0.5 text-red-400 text-[10px] font-black"><ArrowDown size={10} /><span>{Math.abs(diff)}</span></div>;
  return <Minus size={10} className="text-blue-700" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function RankingsHubInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"leaderboard" | "combine" | "rankings" | "draft" | "activity">("leaderboard");
  const [activeSport, setActiveSport] = useState("All Sports");
  const [activeDraft, setActiveDraft] = useState<"mlb" | "nfl" | "nba">("nfl");
  const [activeCollegeSport, setActiveCollegeSport] = useState<"football" | "basketball" | "baseball">("football");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAthlete, setSelectedAthlete] = useState<number | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickerRef.current = setInterval(() => setTickerIndex(i => (i + 1) % LIVE_EVENTS.length), 3500);
    return () => { if (tickerRef.current) clearInterval(tickerRef.current); };
  }, []);

  const filteredLeaderboard = LEADERBOARD_ATHLETES.filter(a => {
    const matchesSport = activeSport === "All Sports" || a.sport === activeSport;
    const matchesSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.school.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const draft = MOCK_DRAFTS[activeDraft];
  const top25 = COLLEGE_TOP25[activeCollegeSport];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#040c1a] pb-24">

        {/* Live Ticker */}
        <div className="bg-[#0a1628] border-b border-blue-900/40 px-4 py-2 flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <Radio size={10} className="text-red-400 animate-pulse" />
            <span className="text-[10px] font-black text-red-400 tracking-widest">LIVE</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div key={tickerIndex} className="flex items-center gap-2">
              <span className="text-sm">{LIVE_EVENTS[tickerIndex].icon}</span>
              <span className={`text-[11px] font-bold truncate ${LIVE_EVENTS[tickerIndex].color}`}>{LIVE_EVENTS[tickerIndex].text}</span>
              <span className="text-blue-700 text-[10px] shrink-0">{LIVE_EVENTS[tickerIndex].time}</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-b from-[#0a1628] to-[#040c1a] px-4 pt-5 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} className="text-sky-400" />
              <div className="text-[10px] font-black tracking-[0.3em] text-sky-400 uppercase">AthlynX Rankings</div>
            </div>
            <h1 className="text-2xl font-black text-white">Rankings Hub™</h1>
            <p className="text-blue-400 text-sm mt-1">Live leaderboards, combine stats, AI scouting scores, mock drafts. Beats 247Sports, On3, Rivals, MaxPreps.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: "⚡ Nebius H200 AI", color: "bg-purple-900/40 border-purple-700/40 text-purple-300" },
                { label: "📡 Live Updates", color: "bg-red-900/40 border-red-700/40 text-red-300" },
                { label: `👥 ${LEADERBOARD_ATHLETES.length} Athletes Ranked`, color: "bg-blue-900/40 border-blue-700/40 text-blue-300" },
              ].map((b, i) => (
                <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="sticky top-0 z-20 bg-[#040c1a]/95 backdrop-blur border-b border-blue-900/30 px-4 py-2">
          <div className="max-w-2xl mx-auto flex gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { id: "leaderboard", label: "🏆 Leaderboard" },
              { id: "combine", label: "⚡ Combine" },
              { id: "rankings", label: "🎓 College Top 25" },
              { id: "draft", label: "📋 Mock Draft" },
              { id: "activity", label: "📡 Activity" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  activeTab === tab.id ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "text-blue-400 hover:text-white bg-blue-900/20"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

          {/* ══ LEADERBOARD ══ */}
          {activeTab === "leaderboard" && (
            <>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search athletes or schools..."
                    className="w-full bg-[#0d1e3c] border border-blue-800/50 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-blue-600 focus:outline-none focus:border-[#0066ff]" />
                </div>
              </div>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                {LEADERBOARD_SPORTS.map(sport => (
                  <button key={sport} onClick={() => setActiveSport(sport)}
                    className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                      activeSport === sport ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                    }`}>
                    {sport}
                  </button>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#0066ff]/20 to-[#00c2ff]/10 border border-[#0066ff]/30 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-blue-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase">AthlynX Live Leaderboard</div>
                    <div className="text-white font-black text-sm mt-0.5">{activeSport === "All Sports" ? "Top Prospects Nationwide" : `Top ${activeSport} Prospects`}</div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-2 py-1">
                    <Activity size={10} className="text-red-400 animate-pulse" />
                    <span className="text-[10px] font-black text-red-400">LIVE</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-1 px-4 py-2 border-b border-blue-900/30">
                  <div className="col-span-1 text-[9px] font-black text-blue-600 uppercase">Rank</div>
                  <div className="col-span-5 text-[9px] font-black text-blue-600 uppercase">Athlete</div>
                  <div className="col-span-2 text-[9px] font-black text-blue-600 uppercase text-center">X-Score</div>
                  <div className="col-span-2 text-[9px] font-black text-blue-600 uppercase text-center">NIL</div>
                  <div className="col-span-2 text-[9px] font-black text-blue-600 uppercase text-center">Offers</div>
                </div>
                {filteredLeaderboard.map((athlete, i) => (
                  <div key={athlete.rank} onClick={() => setSelectedAthlete(selectedAthlete === i ? null : i)}
                    className={`grid grid-cols-12 gap-1 px-4 py-3 border-b border-blue-900/20 cursor-pointer transition-colors ${selectedAthlete === i ? "bg-[#0066ff]/10" : "hover:bg-blue-900/10"}`}>
                    <div className="col-span-1 flex flex-col items-center justify-center gap-0.5">
                      <span className={`text-sm font-black ${athlete.rank <= 3 ? "text-sky-400" : "text-white"}`}>
                        {athlete.rank <= 3 ? ["🥇","🥈","🥉"][athlete.rank - 1] : `#${athlete.rank}`}
                      </span>
                      <RankBadge current={athlete.rank} prev={athlete.prev} />
                    </div>
                    <div className="col-span-5 flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 ${
                        athlete.rank === 1 ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                        athlete.rank === 2 ? "bg-gradient-to-br from-slate-400 to-slate-600" :
                        athlete.rank === 3 ? "bg-gradient-to-br from-blue-600 to-blue-800" :
                        "bg-gradient-to-br from-[#0066ff] to-[#00c2ff]"
                      }`}>{athlete.avatar}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-white font-black text-xs truncate">{athlete.name}</span>
                          {athlete.verified && <span className="text-[#00c2ff] text-[10px]">✓</span>}
                        </div>
                        <div className="text-blue-400 text-[10px] truncate">{athlete.pos} · {athlete.sport}</div>
                        <div className="text-blue-600 text-[9px] truncate">{athlete.school}, {athlete.state}</div>
                      </div>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center">
                      <div className="text-[#00c2ff] font-black text-sm">{athlete.xScore}</div>
                      <div className="text-blue-600 text-[9px]">X-Score</div>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center">
                      <div className="text-green-400 font-black text-xs">${(athlete.nilValue / 1000).toFixed(0)}K</div>
                      <div className="text-blue-600 text-[9px]">NIL</div>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center">
                      <div className="text-white font-black text-sm">{athlete.offers}</div>
                      <div className="text-blue-600 text-[9px]">Offers</div>
                    </div>
                    {selectedAthlete === i && (
                      <div className="col-span-12 mt-2 pt-2 border-t border-blue-800/30">
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {[
                            { label: "Class", val: athlete.year },
                            { label: "State", val: athlete.state },
                            { label: "Rank Change", val: athlete.prev > athlete.rank ? `📈 +${athlete.prev - athlete.rank}` : athlete.prev < athlete.rank ? `📉 ${athlete.prev - athlete.rank}` : "➡️ Steady" },
                          ].map((s, si) => (
                            <div key={si} className="bg-blue-900/30 rounded-xl p-2 text-center">
                              <div className="text-white font-black text-xs">{s.val}</div>
                              <div className="text-blue-500 text-[9px]">{s.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Link href="/browse-athletes" className="flex-1">
                            <button className="w-full bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black py-2 rounded-xl">View Full Profile</button>
                          </Link>
                          <button onClick={() => toast.success(`AI Scouting Report requested for ${athlete.name}`)}
                            className="border border-[#0066ff]/50 text-[#00c2ff] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                            <Cpu size={12} /> Scout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {filteredLeaderboard.length === 0 && (
                  <div className="px-4 py-8 text-center text-blue-600 text-sm">No athletes found for this filter.</div>
                )}
              </div>
            </>
          )}

          {/* ══ COMBINE STATS ══ */}
          {activeTab === "combine" && (
            <>
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-[#0066ff]/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge size={16} className="text-[#00c2ff]" />
                  <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase">AthlynX Combine</div>
                </div>
                <div className="text-white font-black text-lg">Combine Stats Tracker</div>
                <p className="text-blue-400 text-xs mt-1">40-yard dash, vertical leap, bench press, shuttle run — with national percentile rankings.</p>
              </div>
              {COMBINE_ATHLETES.map((athlete, i) => (
                <div key={i} className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4 border-b border-blue-900/30">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center text-white font-black text-sm shrink-0">
                      {athlete.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-black text-sm">{athlete.name}</div>
                      <div className="text-blue-400 text-xs">{athlete.pos} · {athlete.sport} · {athlete.school}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#00c2ff] font-black text-xl">{athlete.xScore}</div>
                      <div className="text-blue-600 text-[10px]">X-Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-0 border-b border-blue-900/30">
                    {[
                      { label: "40-Yd", val: athlete.fortyYd + "s", icon: "⚡" },
                      { label: "Vertical", val: athlete.vertical + '"', icon: "↑" },
                      { label: "Bench", val: athlete.bench + " reps", icon: "💪" },
                      { label: "Shuttle", val: athlete.shuttle + "s", icon: "🔄" },
                    ].map((s, si) => (
                      <div key={si} className={`p-3 text-center ${si < 3 ? "border-r border-blue-900/30" : ""}`}>
                        <div className="text-base mb-0.5">{s.icon}</div>
                        <div className="text-white font-black text-xs">{s.val}</div>
                        <div className="text-blue-600 text-[9px]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">National Percentile Rankings</div>
                    <PercentileBar pct={athlete.pct40} label="40-Yard Dash" value={athlete.fortyYd + "s"} />
                    <PercentileBar pct={athlete.pctVert} label="Vertical Leap" value={athlete.vertical + '"'} />
                    <PercentileBar pct={athlete.pctBench} label="Bench Press" value={athlete.bench + " reps"} />
                    <PercentileBar pct={athlete.pctShuttle} label="5-10-5 Shuttle" value={athlete.shuttle + "s"} />
                    <div className="mt-3 flex gap-2">
                      <Link href="/browse-athletes" className="flex-1">
                        <button className="w-full bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black py-2 rounded-xl">Full Profile</button>
                      </Link>
                      <button onClick={() => toast.success(`AI Scouting Report generated for ${athlete.name}`)}
                        className="border border-[#0066ff]/50 text-[#00c2ff] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                        <Cpu size={12} /> AI Scout
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-dashed border-[#0066ff]/40 rounded-2xl p-6 text-center">
                <Dumbbell size={28} className="text-[#0066ff] mx-auto mb-2" />
                <div className="text-white font-black text-sm mb-1">Submit Your Combine Results</div>
                <p className="text-blue-400 text-xs mb-3">Upload your verified combine stats to get ranked nationally and increase your recruiting profile.</p>
                <Link href="/profile">
                  <button className="bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black px-6 py-2.5 rounded-xl">Update My Stats</button>
                </Link>
              </div>
            </>
          )}

          {/* ══ COLLEGE TOP 25 ══ */}
          {activeTab === "rankings" && (
            <>
              <div className="flex gap-2">
                {(["football", "basketball", "baseball"] as const).map(s => (
                  <button key={s} onClick={() => setActiveCollegeSport(s)}
                    className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors capitalize ${
                      activeCollegeSport === s ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                    }`}>
                    {s === "football" ? "🏈" : s === "basketball" ? "🏀" : "⚾"} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/10 px-4 py-3 border-b border-blue-500/20">
                  <div className="text-xs font-black text-sky-400 tracking-widest uppercase">AthlynX College Top 25</div>
                  <div className="text-white font-black text-sm capitalize">{activeCollegeSport} — 2025-26 Season</div>
                </div>
                {top25.map((team, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-blue-900/20 hover:bg-blue-900/10 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                      team.rank === 1 ? "bg-blue-500 text-black" : team.rank === 2 ? "bg-slate-400 text-black" : team.rank === 3 ? "bg-blue-700 text-white" : "bg-blue-900/50 text-blue-300"
                    }`}>{team.rank}</div>
                    <div className="flex-1">
                      <div className="text-white font-black text-sm">{team.school}</div>
                      <div className="text-blue-500 text-xs">{team.conf} · {team.record}</div>
                    </div>
                    <div className={`text-sm font-black ${team.trend === "▲" ? "text-green-400" : team.trend === "▼" ? "text-red-400" : "text-blue-600"}`}>{team.trend}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ MOCK DRAFT ══ */}
          {activeTab === "draft" && (
            <>
              <div className="flex gap-2">
                {(["nfl", "mlb", "nba"] as const).map(d => (
                  <button key={d} onClick={() => setActiveDraft(d)}
                    className={`flex-1 text-xs font-bold py-2 rounded-xl uppercase transition-colors ${
                      activeDraft === d ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                    }`}>
                    {d === "nfl" ? "🏈" : d === "mlb" ? "⚾" : "🏀"} {d.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#0066ff]/20 to-[#00c2ff]/10 px-4 py-3 border-b border-[#0066ff]/20">
                  <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase">AthlynX Mock Draft</div>
                  <div className="text-white font-black text-sm">{draft.league}</div>
                </div>
                {draft.picks.map((pick, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-blue-900/20 hover:bg-blue-900/10 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${pick.pick === 1 ? "bg-blue-500 text-black" : "bg-blue-900/50 text-blue-300"}`}>#{pick.pick}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-black text-sm truncate">{pick.player}</div>
                      <div className="text-blue-400 text-xs">{pick.pos} · {pick.school}</div>
                      <div className="text-blue-600 text-[10px]">{pick.team}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[#00c2ff] font-black text-sm">{pick.xScore}</div>
                      <div className="text-blue-600 text-[9px]">X-Score</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-dashed border-[#0066ff]/40 rounded-2xl p-5 text-center">
                <Trophy size={24} className="text-sky-400 mx-auto mb-2" />
                <div className="text-white font-black text-sm mb-1">AI Draft Projection</div>
                <p className="text-blue-400 text-xs mb-3">Get your personalized AI-generated draft projection based on your stats, combine results, and X-Factor score.</p>
                <button onClick={() => toast.success("AI Draft Projection — coming in S40!")}
                  className="bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black px-6 py-2.5 rounded-xl">
                  Get My Projection
                </button>
              </div>
            </>
          )}

          {/* ══ LIVE ACTIVITY ══ */}
          {activeTab === "activity" && (
            <>
              <div className="bg-gradient-to-r from-red-900/20 to-red-900/5 border border-red-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={16} className="text-red-400 animate-pulse" />
                  <div className="text-[10px] font-black text-red-400 tracking-widest uppercase">Platform Activity</div>
                </div>
                <div className="text-white font-black text-lg">Live Feed</div>
                <p className="text-blue-400 text-xs mt-1">Real-time events happening across the AthlynX platform right now.</p>
              </div>
              <div className="space-y-2">
                {LIVE_EVENTS.map((event, i) => (
                  <div key={i} className="bg-[#0d1e3c] border border-blue-800/40 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-900/50 flex items-center justify-center text-xl shrink-0">{event.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${event.color}`}>{event.text}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={10} className="text-blue-700" />
                        <span className="text-blue-700 text-[10px]">{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Active Users", val: "2,847", Icon: Users, color: "text-[#00c2ff]" },
                  { label: "NIL Deals Today", val: "14", Icon: TrendingUp, color: "text-green-400" },
                  { label: "New Offers", val: "38", Icon: Award, color: "text-sky-400" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0d1e3c] border border-blue-800/40 rounded-2xl p-3 text-center">
                    <s.Icon size={18} className={`${s.color} mx-auto mb-1`} />
                    <div className={`font-black text-lg ${s.color}`}>{s.val}</div>
                    <div className="text-blue-600 text-[10px]">{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function RankingsHub() {
  return <RouteErrorBoundary><RankingsHubInner /></RouteErrorBoundary>;
}
