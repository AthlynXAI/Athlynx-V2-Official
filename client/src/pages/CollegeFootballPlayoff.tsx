/**
 * CollegeFootballPlayoff — CFP 12-Team Tournament Hub
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
  ArrowLeft, Activity, Clock, CheckCircle, Flame
} from "lucide-react";

// ─── 2025-26 CFP Data ─────────────────────────────────────────────────────────
const CFP_INFO = {
  year: "2025-26",
  champion: "TBD",
  nationalChampionshipSite: "Atlanta, GA — Mercedes-Benz Stadium",
  nationalChampionshipDate: "January 19, 2026",
  format: "12-Team Playoff",
  totalTeams: 12,
};

const CFP_BRACKET = {
  firstRound: [
    {
      game: 1,
      site: "Columbus, OH — Ohio Stadium",
      date: "Dec 20, 2025",
      higher: { seed: 5, name: "Notre Dame", conf: "ACC", record: "11-1", result: "W 31-24" },
      lower: { seed: 12, name: "Indiana", conf: "Big Ten", record: "11-1", result: "L 24-31" },
      winner: "Notre Dame",
    },
    {
      game: 2,
      site: "Baton Rouge, LA — Tiger Stadium",
      date: "Dec 20, 2025",
      higher: { seed: 6, name: "Penn State", conf: "Big Ten", record: "11-1", result: "W 38-21" },
      lower: { seed: 11, name: "SMU", conf: "ACC", record: "11-1", result: "L 21-38" },
      winner: "Penn State",
    },
    {
      game: 3,
      site: "South Bend, IN — Notre Dame Stadium",
      date: "Dec 21, 2025",
      higher: { seed: 7, name: "Texas", conf: "SEC", record: "11-1", result: "W 45-28" },
      lower: { seed: 10, name: "Boise State", conf: "MWC", record: "12-1", result: "L 28-45" },
      winner: "Texas",
    },
    {
      game: 4,
      site: "Tuscaloosa, AL — Bryant-Denny Stadium",
      date: "Dec 21, 2025",
      higher: { seed: 8, name: "Clemson", conf: "ACC", record: "10-2", result: "W 27-20" },
      lower: { seed: 9, name: "Tennessee", conf: "SEC", record: "10-2", result: "L 20-27" },
      winner: "Clemson",
    },
  ],
  quarterFinals: [
    {
      game: "QF1",
      bowl: "Fiesta Bowl",
      site: "Glendale, AZ — State Farm Stadium",
      date: "Jan 1, 2026",
      higher: { seed: 1, name: "Oregon", conf: "Big Ten", record: "13-0", result: "W 41-34" },
      lower: { seed: 8, name: "Clemson", conf: "ACC", record: "11-2", result: "L 34-41" },
      winner: "Oregon",
    },
    {
      game: "QF2",
      bowl: "Peach Bowl",
      site: "Atlanta, GA — Mercedes-Benz Stadium",
      date: "Jan 1, 2026",
      higher: { seed: 2, name: "Georgia", conf: "SEC", record: "12-1", result: "W 28-21" },
      lower: { seed: 7, name: "Texas", conf: "SEC", record: "12-1", result: "L 21-28" },
      winner: "Georgia",
    },
    {
      game: "QF3",
      bowl: "Rose Bowl",
      site: "Pasadena, CA — Rose Bowl Stadium",
      date: "Jan 1, 2026",
      higher: { seed: 3, name: "Ohio State", conf: "Big Ten", record: "11-1", result: "W 35-28" },
      lower: { seed: 6, name: "Penn State", conf: "Big Ten", record: "12-1", result: "L 28-35" },
      winner: "Ohio State",
    },
    {
      game: "QF4",
      bowl: "Sugar Bowl",
      site: "New Orleans, LA — Caesars Superdome",
      date: "Jan 2, 2026",
      higher: { seed: 4, name: "Texas A&M", conf: "SEC", record: "11-1", result: "W 24-17" },
      lower: { seed: 5, name: "Notre Dame", conf: "ACC", record: "12-1", result: "L 17-24" },
      winner: "Texas A&M",
    },
  ],
  semiFinals: [
    {
      game: "SF1",
      bowl: "Cotton Bowl",
      site: "Arlington, TX — AT&T Stadium",
      date: "Jan 10, 2026",
      team1: { seed: 1, name: "Oregon", result: "W 38-31" },
      team2: { seed: 4, name: "Texas A&M", result: "L 31-38" },
      winner: "Oregon",
    },
    {
      game: "SF2",
      bowl: "Orange Bowl",
      site: "Miami, FL — Hard Rock Stadium",
      date: "Jan 10, 2026",
      team1: { seed: 2, name: "Georgia", result: "L 24-30" },
      team2: { seed: 3, name: "Ohio State", result: "W 30-24" },
      winner: "Ohio State",
    },
  ],
  championship: {
    site: "Atlanta, GA — Mercedes-Benz Stadium",
    date: "January 19, 2026",
    team1: { seed: 1, name: "Oregon", result: "W 34-27" },
    team2: { seed: 3, name: "Ohio State", result: "L 27-34" },
    champion: "Oregon",
    score: "34-27",
    mvp: "Dillon Gabriel, QB, Oregon",
  },
};

const SEEDS = [
  { seed: 1, name: "Oregon", conf: "Big Ten", record: "13-0", status: "champion" },
  { seed: 2, name: "Georgia", conf: "SEC", record: "12-1", status: "semi" },
  { seed: 3, name: "Ohio State", conf: "Big Ten", record: "11-1", status: "runner_up" },
  { seed: 4, name: "Texas A&M", conf: "SEC", record: "11-1", status: "semi" },
  { seed: 5, name: "Notre Dame", conf: "ACC", record: "11-1", status: "quarter" },
  { seed: 6, name: "Penn State", conf: "Big Ten", record: "11-1", status: "quarter" },
  { seed: 7, name: "Texas", conf: "SEC", record: "11-1", status: "quarter" },
  { seed: 8, name: "Clemson", conf: "ACC", record: "10-2", status: "quarter" },
  { seed: 9, name: "Tennessee", conf: "SEC", record: "10-2", status: "first" },
  { seed: 10, name: "Boise State", conf: "MWC", record: "12-1", status: "first" },
  { seed: 11, name: "SMU", conf: "ACC", record: "11-1", status: "first" },
  { seed: 12, name: "Indiana", conf: "Big Ten", record: "11-1", status: "first" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  champion: { label: "Champion", color: "bg-blue-600 text-black" },
  runner_up: { label: "Runner-Up", color: "bg-gray-400 text-black" },
  semi: { label: "Semifinal", color: "bg-blue-600 text-white" },
  quarter: { label: "Quarterfinal", color: "bg-purple-600 text-white" },
  first: { label: "1st Round", color: "bg-slate-600 text-white" },
};

// ─── Component ────────────────────────────────────────────────────────────────
function CFPInner() {
  const [activeTab, setActiveTab] = useState<"bracket" | "teams" | "stats">("bracket");

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-b border-white/10 px-4 pt-6 pb-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/football">
            <button className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to GridironNexus
            </button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🏈</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                    COLLEGE FOOTBALL PLAYOFF
                  </h1>
                  <p className="text-[#0057FF] font-bold text-sm tracking-widest uppercase">
                    CFP 2025-26 · 12-Team Format
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-xl">
                The expanded 12-team College Football Playoff. First-round campus games,
                New Year's Six bowls, and the national championship in Atlanta.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="bg-blue-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                🏆 OREGON CHAMPIONS
              </span>
              <span className="text-white/40 text-xs">{CFP_INFO.nationalChampionshipDate}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: "Teams", value: "12", icon: Users },
              { label: "Rounds", value: "4", icon: Trophy },
              { label: "Games", value: "11", icon: BarChart2 },
              { label: "Campus Sites", value: "4", icon: MapPin },
            ].map(({ label, value, icon: Icon }) => (
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
        {/* Champion Banner */}
        <div className="bg-gradient-to-r from-blue-600/10 to-green-900/10 border border-blue-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">
                🏆 2025-26 National Champion
              </div>
              <div className="font-black text-3xl text-blue-400">Oregon Ducks</div>
              <div className="text-white/60 text-sm">
                {CFP_BRACKET.championship.score} over Ohio State · {CFP_BRACKET.championship.site}
              </div>
              <div className="text-white/40 text-xs mt-1">
                MVP: {CFP_BRACKET.championship.mvp}
              </div>
            </div>
            <div className="text-6xl">🦆</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {(["bracket", "teams", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all capitalize ${
                activeTab === tab
                  ? "bg-[#0057FF] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab === "bracket" ? "Bracket" : tab === "teams" ? "All Teams" : "Stats"}
            </button>
          ))}
        </div>

        {/* Bracket Tab */}
        {activeTab === "bracket" && (
          <div className="space-y-6">
            {/* First Round */}
            <div>
              <h3 className="font-black text-sm text-white/50 uppercase tracking-widest mb-3">
                First Round — Campus Sites (Dec 20-21, 2025)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CFP_BRACKET.firstRound.map((game) => (
                  <div key={game.game} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-3 h-3 text-white/40" />
                      <span className="text-white/40 text-xs">{game.site}</span>
                      <span className="text-white/30 text-xs ml-auto">{game.date}</span>
                    </div>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                        game.winner === game.higher.name ? "bg-[#0057FF]/10 border border-[#0057FF]/30" : "bg-white/5"
                      }`}>
                        <span className="text-white/40 text-sm w-5 font-mono">#{game.higher.seed}</span>
                        <span className="font-bold flex-1">{game.higher.name}</span>
                        <span className="text-white/40 text-xs">{game.higher.conf}</span>
                        <span className={`text-xs font-bold ${game.winner === game.higher.name ? "text-[#0057FF]" : "text-white/30"}`}>
                          {game.higher.result}
                        </span>
                        {game.winner === game.higher.name && <CheckCircle className="w-3 h-3 text-[#0057FF]" />}
                      </div>
                      <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                        game.winner === game.lower.name ? "bg-[#0057FF]/10 border border-[#0057FF]/30" : "bg-white/5"
                      }`}>
                        <span className="text-white/40 text-sm w-5 font-mono">#{game.lower.seed}</span>
                        <span className="font-bold flex-1">{game.lower.name}</span>
                        <span className="text-white/40 text-xs">{game.lower.conf}</span>
                        <span className={`text-xs font-bold ${game.winner === game.lower.name ? "text-[#0057FF]" : "text-white/30"}`}>
                          {game.lower.result}
                        </span>
                        {game.winner === game.lower.name && <CheckCircle className="w-3 h-3 text-[#0057FF]" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarterfinals */}
            <div>
              <h3 className="font-black text-sm text-white/50 uppercase tracking-widest mb-3">
                Quarterfinals — New Year's Six Bowls (Jan 1-2, 2026)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CFP_BRACKET.quarterFinals.map((game) => (
                  <div key={game.game} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400 text-xs font-bold">{game.bowl}</span>
                      <span className="text-white/30 text-xs ml-auto">{game.date}</span>
                    </div>
                    <div className="text-white/30 text-xs mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {game.site}
                    </div>
                    <div className="space-y-2">
                      {[game.higher, game.lower].map((team) => (
                        <div key={team.name} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          game.winner === team.name ? "bg-[#0057FF]/10 border border-[#0057FF]/30" : "bg-white/5"
                        }`}>
                          <span className="text-white/40 text-sm w-5 font-mono">#{team.seed}</span>
                          <span className="font-bold flex-1">{team.name}</span>
                          <span className="text-white/40 text-xs">{team.conf}</span>
                          <span className={`text-xs font-bold ${game.winner === team.name ? "text-[#0057FF]" : "text-white/30"}`}>
                            {team.result}
                          </span>
                          {game.winner === team.name && <CheckCircle className="w-3 h-3 text-[#0057FF]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semifinals */}
            <div>
              <h3 className="font-black text-sm text-white/50 uppercase tracking-widest mb-3">
                Semifinals (Jan 10, 2026)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CFP_BRACKET.semiFinals.map((game) => (
                  <div key={game.game} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Flame className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400 text-xs font-bold">{game.bowl}</span>
                      <span className="text-white/30 text-xs ml-auto">{game.date}</span>
                    </div>
                    <div className="space-y-2">
                      {[game.team1, game.team2].map((team) => (
                        <div key={team.name} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          game.winner === team.name ? "bg-[#0057FF]/10 border border-[#0057FF]/30" : "bg-white/5"
                        }`}>
                          <span className="text-white/40 text-sm w-5 font-mono">#{team.seed}</span>
                          <span className="font-bold flex-1">{team.name}</span>
                          <span className={`text-xs font-bold ${game.winner === team.name ? "text-[#0057FF]" : "text-white/30"}`}>
                            {team.result}
                          </span>
                          {game.winner === team.name && <CheckCircle className="w-3 h-3 text-[#0057FF]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Championship */}
            <div className="bg-gradient-to-br from-blue-600/10 to-green-900/10 border border-blue-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-lg">NATIONAL CHAMPIONSHIP</h3>
                <span className="text-white/40 text-sm ml-auto">{CFP_BRACKET.championship.date}</span>
              </div>
              <div className="text-white/40 text-xs mb-4 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {CFP_BRACKET.championship.site}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="bg-blue-600/10 border border-blue-500/40 rounded-xl p-4 text-center">
                  <div className="text-xs text-white/50 mb-1">#{CFP_BRACKET.championship.team1.seed} seed</div>
                  <div className="font-black text-2xl text-blue-400">{CFP_BRACKET.championship.team1.name}</div>
                  <div className="text-blue-400 font-black mt-1">🏆 CHAMPION</div>
                  <div className="text-blue-400 font-bold text-sm">{CFP_BRACKET.championship.team1.result}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white/30">VS</div>
                  <div className="text-white/50 text-sm font-bold">{CFP_BRACKET.championship.score}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-xs text-white/50 mb-1">#{CFP_BRACKET.championship.team2.seed} seed</div>
                  <div className="font-black text-xl">{CFP_BRACKET.championship.team2.name}</div>
                  <div className="text-gray-400 font-bold text-sm mt-1">Runner-Up</div>
                  <div className="text-white/40 font-bold text-sm">{CFP_BRACKET.championship.team2.result}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Teams Tab */}
        {activeTab === "teams" && (
          <div className="space-y-2">
            {SEEDS.map((team) => {
              const statusInfo = STATUS_LABELS[team.status] ?? STATUS_LABELS.first;
              return (
                <div
                  key={team.seed}
                  className={`flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 ${
                    team.status === "champion" ? "ring-1 ring-blue-500/50" : ""
                  }`}
                >
                  <span className="text-white/40 text-sm w-6 text-right font-mono">#{team.seed}</span>
                  <span className={`font-bold flex-1 ${
                    team.status === "champion" ? "text-blue-400" :
                    team.status === "runner_up" ? "text-white" : "text-white/80"
                  }`}>
                    {team.name}
                    {team.status === "champion" && " 🏆"}
                  </span>
                  <span className="text-white/40 text-xs">{team.conf}</span>
                  <span className="text-white/40 text-xs font-mono">{team.record}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                <h3 className="font-black text-base mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#0057FF]" />
                  Playoff Passing Leaders
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Dillon Gabriel", team: "Oregon", yards: 1842, tds: 18, games: 4 },
                    { name: "Will Howard", team: "Ohio State", yards: 1654, tds: 15, games: 4 },
                    { name: "Carson Beck", team: "Georgia", yards: 1203, tds: 11, games: 3 },
                    { name: "Conner Weigman", team: "Texas A&M", yards: 1098, tds: 9, games: 3 },
                    { name: "Riley Leonard", team: "Notre Dame", yards: 876, tds: 7, games: 2 },
                  ].map((player, i) => (
                    <div key={player.name} className="flex items-center gap-3">
                      <span className="text-white/30 text-sm w-4">{i + 1}</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{player.name}</div>
                        <div className="text-white/40 text-xs">{player.team} · {player.games} games</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-[#0057FF] text-sm">{player.yards.toLocaleString()}</div>
                        <div className="text-white/40 text-xs">{player.tds} TDs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                <h3 className="font-black text-base mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Conference Breakdown
                </h3>
                <div className="space-y-3">
                  {[
                    { conf: "Big Ten", teams: 5, wins: 7, champion: "Oregon" },
                    { conf: "SEC", teams: 4, wins: 3, champion: null },
                    { conf: "ACC", teams: 2, wins: 1, champion: null },
                    { conf: "Mountain West", teams: 1, wins: 0, champion: null },
                  ].map((conf) => (
                    <div key={conf.conf} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                      <div className="flex-1">
                        <div className="font-bold text-sm">{conf.conf}</div>
                        <div className="text-white/40 text-xs">{conf.teams} teams</div>
                      </div>
                      <div className="text-center">
                        <div className="font-black text-[#0057FF]">{conf.wins}-{(conf.teams * 4) - conf.wins - conf.teams}</div>
                        <div className="text-white/40 text-xs">W-L</div>
                      </div>
                      {conf.champion && (
                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                          🏆 Champ
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0057FF]/10 to-purple-900/10 border border-[#0057FF]/20 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg">Football Recruiting Intelligence</h3>
              <p className="text-white/50 text-sm">
                Track CFP prospects, transfer portal moves, and recruiting rankings all in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/football">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  GridironNexus
                </button>
              </Link>
              <Link href="/transfer-portal">
                <button className="px-4 py-2 bg-[#0057FF] hover:bg-blue-600 rounded-xl text-sm font-bold transition-colors">
                  Transfer Portal
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

export default function CollegeFootballPlayoff() {
  return (
    <RouteErrorBoundary>
      <CFPInner />
    </RouteErrorBoundary>
  );
}
