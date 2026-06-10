/**
 * NBADraft2026 — NBA Draft Tracker & Prospect Hub
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
  ArrowLeft, Activity, Clock, CheckCircle, Search
} from "lucide-react";

// ─── 2026 NBA Draft Data ──────────────────────────────────────────────────────
const DRAFT_INFO = {
  year: 2026,
  location: "Brooklyn, NY — Barclays Center",
  date: "June 25, 2026",
  rounds: 2,
  totalPicks: 60,
};

const PROSPECTS = [
  { rank: 1, name: "Cooper Flagg", pos: "SF/PF", school: "Duke", age: 18, height: "6'9\"", weight: "205 lbs", grade: 9.9, projected: "#1 Overall", status: "projected", pick: 1, team: "TBD — Lottery" },
  { rank: 2, name: "Dylan Harper", pos: "SG/PG", school: "Rutgers", age: 18, height: "6'6\"", weight: "210 lbs", grade: 9.6, projected: "Top 3", status: "projected", pick: 2, team: "TBD — Lottery" },
  { rank: 3, name: "Ace Bailey", pos: "SF", school: "Rutgers", age: 18, height: "6'10\"", weight: "200 lbs", grade: 9.4, projected: "Top 5", status: "projected", pick: 3, team: "TBD — Lottery" },
  { rank: 4, name: "VJ Edgecombe", pos: "SG", school: "Baylor", age: 19, height: "6'5\"", weight: "185 lbs", grade: 9.1, projected: "Top 5", status: "projected", pick: 4, team: "TBD — Lottery" },
  { rank: 5, name: "Tre Johnson", pos: "SG", school: "Texas", age: 18, height: "6'6\"", weight: "190 lbs", grade: 8.9, projected: "Top 10", status: "projected", pick: 5, team: "TBD — Lottery" },
  { rank: 6, name: "Kon Knueppel", pos: "SG/SF", school: "Duke", age: 19, height: "6'7\"", weight: "210 lbs", grade: 8.7, projected: "Top 10", status: "projected", pick: 6, team: "TBD — Lottery" },
  { rank: 7, name: "Noa Essengue", pos: "PF", school: "Ratiopharm Ulm (Germany)", age: 18, height: "6'10\"", weight: "205 lbs", grade: 8.6, projected: "Top 10", status: "projected", pick: 7, team: "TBD — Lottery" },
  { rank: 8, name: "Khaman Maluach", pos: "C", school: "Duke", age: 18, height: "7'1\"", weight: "245 lbs", grade: 8.5, projected: "Top 10", status: "projected", pick: 8, team: "TBD — Lottery" },
  { rank: 9, name: "Egor Demin", pos: "PG", school: "BYU", age: 18, height: "6'9\"", weight: "195 lbs", grade: 8.3, projected: "Top 15", status: "projected", pick: 9, team: "Projected" },
  { rank: 10, name: "Kasparas Jakucionis", pos: "PG", school: "Illinois", age: 19, height: "6'5\"", weight: "195 lbs", grade: 8.1, projected: "Top 15", status: "projected", pick: 10, team: "Projected" },
  { rank: 11, name: "Liam McNeeley", pos: "SF", school: "UConn", age: 18, height: "6'7\"", weight: "205 lbs", grade: 8.0, projected: "Top 15", status: "projected", pick: 11, team: "Projected" },
  { rank: 12, name: "Collin Murray-Boyles", pos: "PF", school: "South Carolina", age: 19, height: "6'7\"", weight: "230 lbs", grade: 7.9, projected: "Top 20", status: "projected", pick: 12, team: "Projected" },
  { rank: 13, name: "Derik Queen", pos: "C/PF", school: "Maryland", age: 19, height: "6'9\"", weight: "250 lbs", grade: 7.8, projected: "Top 20", status: "projected", pick: 13, team: "Projected" },
  { rank: 14, name: "Rasheer Fleming", pos: "PF", school: "Saint Joseph's", age: 20, height: "6'8\"", weight: "215 lbs", grade: 7.7, projected: "Top 20", status: "projected", pick: 14, team: "Projected" },
  { rank: 15, name: "Nique Clifford", pos: "SF/SG", school: "Colorado State", age: 22, height: "6'6\"", weight: "210 lbs", grade: 7.5, projected: "Top 25", status: "projected", pick: 15, team: "Projected" },
];

const POSITIONS_NBA = ["All", "PG", "SG", "SF", "PF", "C"];

const LOTTERY_TEAMS = [
  { pick: 1, team: "Washington Wizards", record: "15-67", odds: "14.0%" },
  { pick: 2, team: "Detroit Pistons", record: "18-64", odds: "13.4%" },
  { pick: 3, team: "Charlotte Hornets", record: "19-63", odds: "12.7%" },
  { pick: 4, team: "Utah Jazz", record: "20-62", odds: "12.0%" },
  { pick: 5, team: "New Orleans Pelicans", record: "22-60", odds: "10.5%" },
  { pick: 6, team: "Portland Trail Blazers", record: "23-59", odds: "9.0%" },
  { pick: 7, team: "Toronto Raptors", record: "24-58", odds: "7.5%" },
  { pick: 8, team: "San Antonio Spurs", record: "25-57", odds: "6.0%" },
  { pick: 9, team: "Chicago Bulls", record: "26-56", odds: "4.5%" },
  { pick: 10, team: "Sacramento Kings", record: "27-55", odds: "3.0%" },
  { pick: 11, team: "Memphis Grizzlies", record: "28-54", odds: "2.0%" },
  { pick: 12, team: "Houston Rockets", record: "29-53", odds: "1.5%" },
  { pick: 13, team: "Oklahoma City Thunder", record: "30-52", odds: "1.0%" },
  { pick: 14, team: "Atlanta Hawks", record: "31-51", odds: "0.5%" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function NBADraftInner() {
  const [activeTab, setActiveTab] = useState<"prospects" | "lottery" | "history">("prospects");
  const [posFilter, setPosFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProspects = PROSPECTS.filter((p) => {
    const matchPos = posFilter === "All" || p.pos.includes(posFilter);
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.school.toLowerCase().includes(search.toLowerCase());
    return matchPos && matchSearch;
  });

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
                    NBA DRAFT 2026
                  </h1>
                  <p className="text-[#0057FF] font-bold text-sm tracking-widest uppercase">
                    Barclays Center · June 25, 2026
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-xl">
                Top prospect grades, lottery odds, and team needs for the 2026 NBA Draft.
                Cooper Flagg leads the most anticipated draft class in years.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                DRAFT DAY: JUNE 25
              </span>
              <span className="text-white/40 text-xs">Brooklyn, NY</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: "Total Picks", value: "60", icon: BarChart2 },
              { label: "Rounds", value: "2", icon: Trophy },
              { label: "Lottery Teams", value: "14", icon: Users },
              { label: "#1 Prospect", value: "Flagg", icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <Icon className="w-4 h-4 text-[#0057FF] mx-auto mb-1" />
                <div className="text-lg font-black">{value}</div>
                <div className="text-white/50 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* #1 Prospect Banner */}
        <div className="bg-gradient-to-r from-[#0057FF]/10 to-purple-900/10 border border-[#0057FF]/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#0057FF] font-bold text-xs uppercase tracking-widest mb-1">
                #1 Projected Pick · Generational Talent
              </div>
              <div className="font-black text-2xl">Cooper Flagg</div>
              <div className="text-white/60 text-sm">SF/PF · Duke · 6'9" · 205 lbs</div>
              <div className="text-white/40 text-xs mt-1">
                ACC Player of the Year · 17.2 PPG, 9.1 RPG, 4.2 APG · Duke
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-[#0057FF]">9.9</div>
              <div className="text-white/40 text-xs">Draft Grade</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {(["prospects", "lottery", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all capitalize ${
                activeTab === tab
                  ? "bg-[#0057FF] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab === "prospects" ? "Top Prospects" : tab === "lottery" ? "Lottery" : "History"}
            </button>
          ))}
        </div>

        {/* Prospects Tab */}
        {activeTab === "prospects" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search prospects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50"
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {POSITIONS_NBA.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosFilter(pos)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      posFilter === pos
                        ? "bg-[#0057FF] border-[#0057FF] text-white"
                        : "border-white/20 text-white/50 hover:text-white"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredProspects.map((prospect) => (
                <div
                  key={prospect.rank}
                  className={`bg-white/5 rounded-xl border border-white/10 p-4 ${
                    prospect.rank === 1 ? "ring-1 ring-[#0057FF]/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`font-black text-lg w-8 text-right mt-0.5 ${
                      prospect.rank === 1 ? "text-[#0057FF]" : "text-white/40"
                    }`}>
                      #{prospect.rank}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-base">{prospect.name}</span>
                        <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full font-bold">
                          {prospect.pos}
                        </span>
                        <span className="text-white/40 text-xs">{prospect.height} · {prospect.weight}</span>
                      </div>
                      <div className="text-white/50 text-sm">{prospect.school}</div>
                      <div className="text-white/30 text-xs mt-1">{prospect.projected}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-[#0057FF] text-lg">{prospect.grade}</div>
                      <div className="text-white/30 text-xs">Grade</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lottery Tab */}
        {activeTab === "lottery" && (
          <div className="space-y-3">
            <p className="text-white/40 text-sm">
              Lottery odds based on 2025-26 regular season records. Top 4 picks determined by lottery drawing.
            </p>
            <div className="space-y-2">
              {LOTTERY_TEAMS.map((team) => (
                <div key={team.pick} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-white/40 text-sm w-6 text-right font-mono">{team.pick}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{team.team}</div>
                    <div className="text-white/40 text-xs">{team.record}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#0057FF] text-sm">{team.odds}</div>
                    <div className="text-white/30 text-xs">odds</div>
                  </div>
                  {/* Odds bar */}
                  <div className="w-20 bg-white/10 rounded-full h-1.5 hidden md:block">
                    <div
                      className="bg-[#0057FF] h-1.5 rounded-full"
                      style={{ width: `${parseFloat(team.odds)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <h3 className="font-black text-base mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-400" />
                Recent #1 Overall Picks
              </h3>
              <div className="space-y-3">
                {[
                  { year: 2025, player: "Cooper Flagg", team: "Projected", school: "Duke", pos: "SF" },
                  { year: 2024, player: "Zaccharie Risacher", team: "Atlanta Hawks", school: "JL Bourg (France)", pos: "SF" },
                  { year: 2023, player: "Victor Wembanyama", team: "San Antonio Spurs", school: "Metropolitans 92 (France)", pos: "C" },
                  { year: 2022, player: "Paolo Banchero", team: "Orlando Magic", school: "Duke", pos: "PF" },
                  { year: 2021, player: "Cade Cunningham", team: "Detroit Pistons", school: "Oklahoma State", pos: "PG" },
                  { year: 2020, player: "Anthony Edwards", team: "Minnesota Timberwolves", school: "Georgia", pos: "SG" },
                ].map((pick) => (
                  <div key={pick.year} className={`flex items-center gap-3 rounded-xl p-3 ${
                    pick.year === 2025 ? "bg-[#0057FF]/10 border border-[#0057FF]/30" : "bg-white/5"
                  }`}>
                    <span className={`font-black text-base w-12 ${pick.year === 2025 ? "text-[#0057FF]" : "text-white/40"}`}>
                      {pick.year}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{pick.player}</div>
                      <div className="text-white/40 text-xs">{pick.school}</div>
                    </div>
                    <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{pick.pos}</span>
                    <span className="text-white/50 text-xs text-right max-w-[120px] leading-tight">{pick.team}</span>
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
              <h3 className="font-black text-lg">Build Your NBA Draft Profile</h3>
              <p className="text-white/50 text-sm">
                Get your AthlynX athlete profile ready for scouts, agents, and NBA teams.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/basketball">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  CourtKings
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

export default function NBADraft2026() {
  return (
    <RouteErrorBoundary>
      <NBADraftInner />
    </RouteErrorBoundary>
  );
}
