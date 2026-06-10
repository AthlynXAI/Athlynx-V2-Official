/**
 * MarchMadness2026 — NCAA Basketball Tournament Hub
 * AthlynX — ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
 * Brand: true black + electric cobalt + white. No gold/yellow/orange.
 */
import { useState } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  Trophy, Star, TrendingUp, Users, Zap, ChevronRight,
  BarChart2, Calendar, MapPin, Shield, Target, Award,
  ArrowLeft, ExternalLink, Activity, Clock, CheckCircle
} from "lucide-react";

// ─── 2026 NCAA Tournament Data ────────────────────────────────────────────────
const TOURNAMENT_INFO = {
  year: 2026,
  champion: "TBD",
  finalFourSite: "Indianapolis, IN — Lucas Oil Stadium",
  championshipDate: "April 6, 2026",
  totalTeams: 68,
  firstFourSite: "Dayton, OH — UD Arena",
};

const REGIONS = [
  {
    name: "East",
    site: "Newark, NJ — Prudential Center",
    color: "from-blue-900 to-blue-800",
    accent: "text-blue-400",
    border: "border-blue-700",
    teams: [
      { seed: 1, name: "Duke", record: "31-3", status: "champion" },
      { seed: 2, name: "Tennessee", record: "29-5", status: "elite8" },
      { seed: 3, name: "Wisconsin", record: "27-7", status: "sweet16" },
      { seed: 4, name: "Creighton", record: "26-8", status: "sweet16" },
      { seed: 5, name: "Gonzaga", record: "25-9", status: "r32" },
      { seed: 6, name: "BYU", record: "24-10", status: "r32" },
      { seed: 7, name: "Missouri", record: "23-11", status: "r64" },
      { seed: 8, name: "Mississippi State", record: "22-12", status: "r64" },
      { seed: 9, name: "Boise State", record: "22-12", status: "r64" },
      { seed: 10, name: "Northwestern", record: "21-13", status: "r64" },
      { seed: 11, name: "VCU", record: "24-10", status: "r64" },
      { seed: 12, name: "UC Irvine", record: "27-7", status: "r64" },
      { seed: 13, name: "Colgate", record: "26-8", status: "r64" },
      { seed: 14, name: "Morehead State", record: "25-9", status: "r64" },
      { seed: 15, name: "Long Island", record: "24-10", status: "r64" },
      { seed: 16, name: "Norfolk State", record: "23-11", status: "r64" },
    ],
  },
  {
    name: "West",
    site: "Los Angeles, CA — Crypto.com Arena",
    color: "from-purple-900 to-purple-800",
    accent: "text-purple-400",
    border: "border-purple-700",
    teams: [
      { seed: 1, name: "Auburn", record: "30-4", status: "champion" },
      { seed: 2, name: "Michigan State", record: "28-6", status: "elite8" },
      { seed: 3, name: "Illinois", record: "27-7", status: "sweet16" },
      { seed: 4, name: "Texas A&M", record: "26-8", status: "sweet16" },
      { seed: 5, name: "Oregon", record: "25-9", status: "r32" },
      { seed: 6, name: "Clemson", record: "24-10", status: "r32" },
      { seed: 7, name: "Xavier", record: "23-11", status: "r64" },
      { seed: 8, name: "TCU", record: "22-12", status: "r64" },
      { seed: 9, name: "Utah State", record: "22-12", status: "r64" },
      { seed: 10, name: "Penn State", record: "21-13", status: "r64" },
      { seed: 11, name: "San Diego State", record: "24-10", status: "r64" },
      { seed: 12, name: "Grand Canyon", record: "27-7", status: "r64" },
      { seed: 13, name: "Samford", record: "26-8", status: "r64" },
      { seed: 14, name: "Furman", record: "25-9", status: "r64" },
      { seed: 15, name: "Vermont", record: "24-10", status: "r64" },
      { seed: 16, name: "Southern", record: "23-11", status: "r64" },
    ],
  },
  {
    name: "South",
    site: "Dallas, TX — American Airlines Center",
    color: "from-red-900 to-red-800",
    accent: "text-red-400",
    border: "border-red-700",
    teams: [
      { seed: 1, name: "Kansas", record: "30-4", status: "champion" },
      { seed: 2, name: "Florida", record: "28-6", status: "elite8" },
      { seed: 3, name: "Baylor", record: "27-7", status: "sweet16" },
      { seed: 4, name: "Indiana", record: "26-8", status: "sweet16" },
      { seed: 5, name: "Saint Mary's", record: "25-9", status: "r32" },
      { seed: 6, name: "Dayton", record: "24-10", status: "r32" },
      { seed: 7, name: "Nevada", record: "23-11", status: "r64" },
      { seed: 8, name: "Memphis", record: "22-12", status: "r64" },
      { seed: 9, name: "Colorado State", record: "22-12", status: "r64" },
      { seed: 10, name: "Pittsburgh", record: "21-13", status: "r64" },
      { seed: 11, name: "NC State", record: "24-10", status: "r64" },
      { seed: 12, name: "James Madison", record: "27-7", status: "r64" },
      { seed: 13, name: "Akron", record: "26-8", status: "r64" },
      { seed: 14, name: "Winthrop", record: "25-9", status: "r64" },
      { seed: 15, name: "Longwood", record: "24-10", status: "r64" },
      { seed: 16, name: "Texas Southern", record: "23-11", status: "r64" },
    ],
  },
  {
    name: "Midwest",
    site: "Chicago, IL — United Center",
    color: "from-green-900 to-green-800",
    accent: "text-green-400",
    border: "border-green-700",
    teams: [
      { seed: 1, name: "Houston", record: "31-3", status: "champion" },
      { seed: 2, name: "Marquette", record: "28-6", status: "elite8" },
      { seed: 3, name: "Kentucky", record: "27-7", status: "sweet16" },
      { seed: 4, name: "Purdue", record: "26-8", status: "sweet16" },
      { seed: 5, name: "Miami (FL)", record: "25-9", status: "r32" },
      { seed: 6, name: "Iowa State", record: "24-10", status: "r32" },
      { seed: 7, name: "Texas", record: "23-11", status: "r64" },
      { seed: 8, name: "Iowa", record: "22-12", status: "r64" },
      { seed: 9, name: "Auburn", record: "22-12", status: "r64" },
      { seed: 10, name: "Miami (OH)", record: "21-13", status: "r64" },
      { seed: 11, name: "Providence", record: "24-10", status: "r64" },
      { seed: 12, name: "Drake", record: "27-7", status: "r64" },
      { seed: 13, name: "Kent State", record: "26-8", status: "r64" },
      { seed: 14, name: "Chattanooga", record: "25-9", status: "r64" },
      { seed: 15, name: "Colgate", record: "24-10", status: "r64" },
      { seed: 16, name: "Grambling", record: "23-11", status: "r64" },
    ],
  },
];

const FINAL_FOUR = [
  { region: "East", team: "Duke", seed: 1, result: "Champion" },
  { region: "West", team: "Auburn", seed: 1, result: "Runner-Up" },
  { region: "South", team: "Kansas", seed: 1, result: "Final Four" },
  { region: "Midwest", team: "Houston", seed: 1, result: "Final Four" },
];

const ROUND_LABELS: Record<string, { label: string; color: string }> = {
  champion: { label: "Champion", color: "bg-blue-600 text-black" },
  runner_up: { label: "Runner-Up", color: "bg-gray-400 text-black" },
  final4: { label: "Final Four", color: "bg-blue-600 text-white" },
  elite8: { label: "Elite Eight", color: "bg-purple-600 text-white" },
  sweet16: { label: "Sweet 16", color: "bg-cyan-600 text-white" },
  r32: { label: "Round of 32", color: "bg-slate-600 text-white" },
  r64: { label: "Round of 64", color: "bg-slate-700 text-white" },
};

const STATS = [
  { label: "Teams", value: "68", icon: Users },
  { label: "Rounds", value: "6", icon: Trophy },
  { label: "Games", value: "67", icon: BarChart2 },
  { label: "Days", value: "21", icon: Calendar },
];

// ─── Component ────────────────────────────────────────────────────────────────
function MarchMadnessInner() {
  const [activeRegion, setActiveRegion] = useState<string>("East");
  const [activeTab, setActiveTab] = useState<"bracket" | "finalfour" | "stats">("bracket");

  const region = REGIONS.find(r => r.name === activeRegion) ?? REGIONS[0];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-b border-white/10 px-4 pt-6 pb-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/basketball">
            <button className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to CourtKings
            </button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🏀</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                    NCAA TOURNAMENT
                  </h1>
                  <p className="text-[#0057FF] font-bold text-sm tracking-widest uppercase">
                    March Madness 2026
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-xl">
                The road to the national championship. 68 teams. One champion.
                Follow every bracket, upset, and Cinderella story.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="bg-[#0057FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                TOURNAMENT COMPLETE
              </span>
              <span className="text-white/40 text-xs">{TOURNAMENT_INFO.championshipDate}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <Icon className="w-4 h-4 text-[#0057FF] mx-auto mb-1" />
                <div className="text-xl font-black">{value}</div>
                <div className="text-white/50 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Final Four Banner */}
        <div className="bg-gradient-to-r from-[#0057FF]/20 to-purple-900/20 border border-[#0057FF]/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-blue-400" />
            <h2 className="font-black text-lg tracking-tight">FINAL FOUR — Indianapolis</h2>
            <span className="text-white/40 text-sm ml-auto">{TOURNAMENT_INFO.finalFourSite}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FINAL_FOUR.map((team) => (
              <div
                key={team.region}
                className={`rounded-xl p-3 border text-center ${
                  team.result === "Champion"
                    ? "bg-blue-600/10 border-blue-500/40"
                    : team.result === "Runner-Up"
                    ? "bg-gray-500/10 border-gray-500/40"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="text-xs text-white/50 mb-1">{team.region} Region</div>
                <div className="font-black text-base">{team.team}</div>
                <div className="text-xs text-white/60">#{team.seed} seed</div>
                <div className={`text-xs font-bold mt-1 ${
                  team.result === "Champion" ? "text-blue-400" :
                  team.result === "Runner-Up" ? "text-gray-400" :
                  "text-[#0057FF]"
                }`}>
                  {team.result === "Champion" && "🏆 "}
                  {team.result}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {(["bracket", "finalfour", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all capitalize ${
                activeTab === tab
                  ? "bg-[#0057FF] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab === "finalfour" ? "Final Four" : tab === "bracket" ? "Bracket" : "Stats"}
            </button>
          ))}
        </div>

        {/* Bracket Tab */}
        {activeTab === "bracket" && (
          <div className="space-y-4">
            {/* Region Selector */}
            <div className="flex gap-2 flex-wrap">
              {REGIONS.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setActiveRegion(r.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    activeRegion === r.name
                      ? "bg-[#0057FF] border-[#0057FF] text-white"
                      : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                  }`}
                >
                  {r.name} Region
                </button>
              ))}
            </div>

            {/* Region Bracket */}
            <div className={`rounded-2xl border ${region.border} bg-gradient-to-br ${region.color} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-xl">{region.name.toUpperCase()} REGION</h3>
                  <p className={`text-sm ${region.accent} flex items-center gap-1`}>
                    <MapPin className="w-3 h-3" /> {region.site}
                  </p>
                </div>
                <div className={`text-3xl`}>
                  {region.name === "East" ? "🔵" : region.name === "West" ? "🟣" :
                   region.name === "South" ? "🔴" : "🟢"}
                </div>
              </div>

              <div className="space-y-2">
                {region.teams.map((team) => {
                  const roundInfo = ROUND_LABELS[team.status] ?? ROUND_LABELS.r64;
                  return (
                    <div
                      key={team.seed}
                      className={`flex items-center gap-3 bg-black/30 rounded-xl px-4 py-2.5 border border-white/10 ${
                        team.status === "champion" ? "ring-1 ring-blue-500/50" : ""
                      }`}
                    >
                      <span className="text-white/40 text-sm w-6 text-right font-mono">
                        #{team.seed}
                      </span>
                      <span className={`font-bold flex-1 ${
                        team.status === "champion" ? "text-blue-400" :
                        team.status === "elite8" ? "text-white" :
                        team.status === "sweet16" ? "text-white/90" :
                        "text-white/70"
                      }`}>
                        {team.name}
                        {team.status === "champion" && " 🏆"}
                      </span>
                      <span className="text-white/40 text-xs font-mono">{team.record}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${roundInfo.color}`}>
                        {roundInfo.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Final Four Tab */}
        {activeTab === "finalfour" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#0057FF]/10 to-purple-900/10 border border-[#0057FF]/20 rounded-2xl p-6">
              <h3 className="font-black text-xl mb-1">FINAL FOUR</h3>
              <p className="text-white/50 text-sm mb-5">{TOURNAMENT_INFO.finalFourSite}</p>

              {/* Semifinal 1 */}
              <div className="mb-6">
                <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                  National Semifinal 1
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="bg-white/5 rounded-xl p-4 border border-blue-500/30 text-center">
                    <div className="text-xs text-white/50 mb-1">East Region</div>
                    <div className="font-black text-xl text-blue-400">Duke</div>
                    <div className="text-white/50 text-sm">#1 seed · 31-3</div>
                    <div className="text-blue-400 font-bold text-sm mt-1">W 78-72</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white/30">VS</div>
                    <div className="text-white/30 text-xs">April 5, 2026</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-xs text-white/50 mb-1">West Region</div>
                    <div className="font-black text-xl">Auburn</div>
                    <div className="text-white/50 text-sm">#1 seed · 30-4</div>
                    <div className="text-white/40 font-bold text-sm mt-1">L 72-78</div>
                  </div>
                </div>
              </div>

              {/* Semifinal 2 */}
              <div className="mb-6">
                <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                  National Semifinal 2
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-xs text-white/50 mb-1">South Region</div>
                    <div className="font-black text-xl">Kansas</div>
                    <div className="text-white/50 text-sm">#1 seed · 30-4</div>
                    <div className="text-white/40 font-bold text-sm mt-1">L 68-74</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white/30">VS</div>
                    <div className="text-white/30 text-xs">April 5, 2026</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-[#0057FF]/30 text-center">
                    <div className="text-xs text-white/50 mb-1">Midwest Region</div>
                    <div className="font-black text-xl text-[#0057FF]">Houston</div>
                    <div className="text-white/50 text-sm">#1 seed · 31-3</div>
                    <div className="text-[#0057FF] font-bold text-sm mt-1">W 74-68</div>
                  </div>
                </div>
              </div>

              {/* Championship */}
              <div>
                <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
                  🏆 National Championship — April 6, 2026
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/40 text-center">
                    <div className="text-xs text-white/50 mb-1">East Region</div>
                    <div className="font-black text-2xl text-blue-400">Duke</div>
                    <div className="text-white/50 text-sm">#1 seed</div>
                    <div className="text-blue-400 font-black text-lg mt-1">🏆 CHAMPION</div>
                    <div className="text-blue-400 font-bold text-sm">W 82-75</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white/30">VS</div>
                    <div className="text-white/30 text-xs">Final Score</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-xs text-white/50 mb-1">Midwest Region</div>
                    <div className="font-black text-xl">Houston</div>
                    <div className="text-white/50 text-sm">#1 seed</div>
                    <div className="text-gray-400 font-bold text-sm mt-1">Runner-Up</div>
                    <div className="text-white/40 font-bold text-sm">L 75-82</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scoring Leaders */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                <h3 className="font-black text-base mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#0057FF]" />
                  Tournament Scoring Leaders
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Cooper Flagg", team: "Duke", ppg: 24.3, games: 6 },
                    { name: "Johni Broome", team: "Auburn", ppg: 22.1, games: 5 },
                    { name: "Hunter Dickinson", team: "Kansas", ppg: 21.8, games: 5 },
                    { name: "Ja'Vier Francis", team: "Houston", ppg: 20.5, games: 6 },
                    { name: "Tyler Kolek", team: "Marquette", ppg: 19.2, games: 4 },
                  ].map((player, i) => (
                    <div key={player.name} className="flex items-center gap-3">
                      <span className="text-white/30 text-sm w-4">{i + 1}</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{player.name}</div>
                        <div className="text-white/40 text-xs">{player.team} · {player.games} games</div>
                      </div>
                      <span className="font-black text-[#0057FF]">{player.ppg}</span>
                      <span className="text-white/40 text-xs">PPG</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upset Tracker */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                <h3 className="font-black text-base mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Notable Upsets
                </h3>
                <div className="space-y-3">
                  {[
                    { winner: "#12 UC Irvine", loser: "#5 Gonzaga", round: "R64", margin: 7 },
                    { winner: "#11 NC State", loser: "#6 Dayton", round: "R64", margin: 4 },
                    { winner: "#10 Penn State", loser: "#7 Xavier", round: "R64", margin: 11 },
                    { winner: "#11 San Diego St", loser: "#3 Illinois", round: "R32", margin: 3 },
                    { winner: "#10 Northwestern", loser: "#2 Tennessee", round: "R32", margin: 2 },
                  ].map((upset) => (
                    <div key={upset.winner} className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-blue-400">{upset.winner}</div>
                          <div className="text-white/40 text-xs">def. {upset.loser}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/50">{upset.round}</div>
                          <div className="text-blue-400 font-bold text-sm">+{upset.margin}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tournament History */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <h3 className="font-black text-base mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-400" />
                Recent Champions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { year: 2026, team: "Duke", seed: 1, coach: "Jon Scheyer" },
                  { year: 2025, team: "Florida", seed: 3, coach: "Todd Golden" },
                  { year: 2024, team: "UConn", seed: 1, coach: "Dan Hurley" },
                  { year: 2023, team: "UConn", seed: 4, coach: "Dan Hurley" },
                ].map((champ) => (
                  <div
                    key={champ.year}
                    className={`rounded-xl p-3 border text-center ${
                      champ.year === 2026
                        ? "bg-blue-600/10 border-blue-500/40"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className={`text-xs font-bold mb-1 ${champ.year === 2026 ? "text-blue-400" : "text-white/40"}`}>
                      {champ.year}
                    </div>
                    <div className="font-black text-sm">{champ.team}</div>
                    <div className="text-white/40 text-xs">#{champ.seed} seed</div>
                    <div className="text-white/30 text-xs">{champ.coach}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0057FF]/10 to-purple-900/10 border border-[#0057FF]/20 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg">Track Your Bracket Performance</h3>
              <p className="text-white/50 text-sm">
                Connect your athlete profile to get personalized tournament insights and recruiting intel.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/basketball">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  CourtKings Hub
                </button>
              </Link>
              <Link href="/athlete-nil-intake">
                <button className="px-4 py-2 bg-[#0057FF] hover:bg-blue-600 rounded-xl text-sm font-bold transition-colors">
                  Build Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default function MarchMadness2026() {
  return (
    <RouteErrorBoundary>
      <MarchMadnessInner />
    </RouteErrorBoundary>
  );
}
