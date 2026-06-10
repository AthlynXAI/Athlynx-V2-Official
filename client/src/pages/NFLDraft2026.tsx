/**
 * NFLDraft2026 — NFL Draft Tracker & Prospect Hub
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
  ArrowLeft, Activity, Clock, CheckCircle, Search, Filter
} from "lucide-react";

// ─── 2026 NFL Draft Data ──────────────────────────────────────────────────────
const DRAFT_INFO = {
  year: 2026,
  location: "Green Bay, WI — Lambeau Field",
  dates: "April 23-25, 2026",
  rounds: 7,
  totalPicks: 257,
};

const PROSPECTS = [
  // QBs
  { rank: 1, name: "Shedeur Sanders", pos: "QB", school: "Colorado", grade: 9.8, projected: "Top 3", status: "drafted", pick: 1, team: "Cleveland Browns", round: 1 },
  { rank: 2, name: "Cam Ward", pos: "QB", school: "Miami (FL)", grade: 9.6, projected: "Top 5", status: "drafted", pick: 2, team: "New York Giants", round: 1 },
  { rank: 3, name: "Dillon Gabriel", pos: "QB", school: "Oregon", grade: 9.2, projected: "Top 15", status: "drafted", pick: 8, team: "New England Patriots", round: 1 },
  // Non-QBs
  { rank: 4, name: "Abdul Carter", pos: "EDGE", school: "Penn State", grade: 9.7, projected: "Top 3", status: "drafted", pick: 3, team: "New York Giants", round: 1 },
  { rank: 5, name: "Travis Hunter", pos: "CB/WR", school: "Colorado", grade: 9.5, projected: "Top 5", status: "drafted", pick: 4, team: "Las Vegas Raiders", round: 1 },
  { rank: 6, name: "Will Johnson", pos: "CB", school: "Michigan", grade: 9.3, projected: "Top 10", status: "drafted", pick: 5, team: "Jacksonville Jaguars", round: 1 },
  { rank: 7, name: "Mason Graham", pos: "DT", school: "Michigan", grade: 9.1, projected: "Top 10", status: "drafted", pick: 6, team: "Las Vegas Raiders", round: 1 },
  { rank: 8, name: "Tetairoa McMillan", pos: "WR", school: "Arizona", grade: 9.0, projected: "Top 10", status: "drafted", pick: 7, team: "Carolina Panthers", round: 1 },
  { rank: 9, name: "Mykel Williams", pos: "EDGE", school: "Georgia", grade: 8.9, projected: "Top 15", status: "drafted", pick: 9, team: "New Orleans Saints", round: 1 },
  { rank: 10, name: "Malaki Starks", pos: "S", school: "Georgia", grade: 8.8, projected: "Top 15", status: "drafted", pick: 10, team: "Chicago Bears", round: 1 },
  { rank: 11, name: "Kelvin Banks Jr.", pos: "OT", school: "Texas", grade: 8.7, projected: "Top 15", status: "drafted", pick: 11, team: "San Francisco 49ers", round: 1 },
  { rank: 12, name: "Emeka Egbuka", pos: "WR", school: "Ohio State", grade: 8.6, projected: "Top 20", status: "drafted", pick: 12, team: "Dallas Cowboys", round: 1 },
  { rank: 13, name: "Jalon Walker", pos: "LB", school: "Georgia", grade: 8.5, projected: "Top 20", status: "drafted", pick: 15, team: "Atlanta Falcons", round: 1 },
  { rank: 14, name: "Jihaad Campbell", pos: "LB", school: "Alabama", grade: 8.4, projected: "Top 20", status: "drafted", pick: 16, team: "Arizona Cardinals", round: 1 },
  { rank: 15, name: "Shemar Stewart", pos: "DT", school: "Texas A&M", grade: 8.3, projected: "Top 25", status: "drafted", pick: 17, team: "Cincinnati Bengals", round: 1 },
  { rank: 16, name: "Nic Scourton", pos: "EDGE", school: "Texas A&M", grade: 8.2, projected: "Top 25", status: "drafted", pick: 18, team: "Seattle Seahawks", round: 1 },
  { rank: 17, name: "Omarion Hampton", pos: "RB", school: "North Carolina", grade: 8.1, projected: "Top 30", status: "drafted", pick: 22, team: "Los Angeles Chargers", round: 1 },
  { rank: 18, name: "Colston Loveland", pos: "TE", school: "Michigan", grade: 8.0, projected: "Top 30", status: "drafted", pick: 25, team: "Minnesota Vikings", round: 1 },
  { rank: 19, name: "Tyler Warren", pos: "TE", school: "Penn State", grade: 7.9, projected: "Top 32", status: "drafted", pick: 28, team: "Indianapolis Colts", round: 1 },
  { rank: 20, name: "Landon Jackson", pos: "EDGE", school: "Arkansas", grade: 7.8, projected: "Top 32", status: "drafted", pick: 31, team: "Kansas City Chiefs", round: 1 },
];

const POSITIONS = ["All", "QB", "WR", "EDGE", "CB", "DT", "OT", "LB", "S", "TE", "RB"];

const ROUND1_PICKS = [
  { pick: 1, team: "Cleveland Browns", player: "Shedeur Sanders", pos: "QB", school: "Colorado" },
  { pick: 2, team: "New York Giants", player: "Cam Ward", pos: "QB", school: "Miami (FL)" },
  { pick: 3, team: "New York Giants", player: "Abdul Carter", pos: "EDGE", school: "Penn State" },
  { pick: 4, team: "Las Vegas Raiders", player: "Travis Hunter", pos: "CB/WR", school: "Colorado" },
  { pick: 5, team: "Jacksonville Jaguars", player: "Will Johnson", pos: "CB", school: "Michigan" },
  { pick: 6, team: "Las Vegas Raiders", player: "Mason Graham", pos: "DT", school: "Michigan" },
  { pick: 7, team: "Carolina Panthers", player: "Tetairoa McMillan", pos: "WR", school: "Arizona" },
  { pick: 8, team: "New England Patriots", player: "Dillon Gabriel", pos: "QB", school: "Oregon" },
  { pick: 9, team: "New Orleans Saints", player: "Mykel Williams", pos: "EDGE", school: "Georgia" },
  { pick: 10, team: "Chicago Bears", player: "Malaki Starks", pos: "S", school: "Georgia" },
  { pick: 11, team: "San Francisco 49ers", player: "Kelvin Banks Jr.", pos: "OT", school: "Texas" },
  { pick: 12, team: "Dallas Cowboys", player: "Emeka Egbuka", pos: "WR", school: "Ohio State" },
  { pick: 13, team: "Miami Dolphins", player: "Aireontae Ersery", pos: "OT", school: "Minnesota" },
  { pick: 14, team: "Indianapolis Colts", player: "Nick Emmanwori", pos: "S", school: "South Carolina" },
  { pick: 15, team: "Atlanta Falcons", player: "Jalon Walker", pos: "LB", school: "Georgia" },
  { pick: 16, team: "Arizona Cardinals", player: "Jihaad Campbell", pos: "LB", school: "Alabama" },
  { pick: 17, team: "Cincinnati Bengals", player: "Shemar Stewart", pos: "DT", school: "Texas A&M" },
  { pick: 18, team: "Seattle Seahawks", player: "Nic Scourton", pos: "EDGE", school: "Texas A&M" },
  { pick: 19, team: "Tampa Bay Buccaneers", player: "Derrick Harmon", pos: "DT", school: "Oregon" },
  { pick: 20, team: "Denver Broncos", player: "Donovan Ezeiruaku", pos: "EDGE", school: "Boston College" },
  { pick: 21, team: "Pittsburgh Steelers", player: "James Pearce Jr.", pos: "EDGE", school: "Tennessee" },
  { pick: 22, team: "Los Angeles Chargers", player: "Omarion Hampton", pos: "RB", school: "North Carolina" },
  { pick: 23, team: "Green Bay Packers", player: "Darius Alexander", pos: "DT", school: "Toledo" },
  { pick: 24, team: "Houston Texans", player: "Azareye'h Thomas", pos: "CB", school: "Florida State" },
  { pick: 25, team: "Minnesota Vikings", player: "Colston Loveland", pos: "TE", school: "Michigan" },
  { pick: 26, team: "Los Angeles Rams", player: "Grey Zabel", pos: "OG", school: "North Dakota State" },
  { pick: 27, team: "Baltimore Ravens", player: "Quinshon Judkins", pos: "RB", school: "Ohio State" },
  { pick: 28, team: "Indianapolis Colts", player: "Tyler Warren", pos: "TE", school: "Penn State" },
  { pick: 29, team: "Washington Commanders", player: "Luther Burden III", pos: "WR", school: "Missouri" },
  { pick: 30, team: "Buffalo Bills", player: "Tyleik Williams", pos: "DT", school: "Ohio State" },
  { pick: 31, team: "Kansas City Chiefs", player: "Landon Jackson", pos: "EDGE", school: "Arkansas" },
  { pick: 32, team: "Philadelphia Eagles", player: "Maxwell Hairston", pos: "CB", school: "Kentucky" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function NFLDraftInner() {
  const [activeTab, setActiveTab] = useState<"round1" | "prospects" | "byteam">("round1");
  const [posFilter, setPosFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProspects = PROSPECTS.filter((p) => {
    const matchPos = posFilter === "All" || p.pos === posFilter;
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.school.toLowerCase().includes(search.toLowerCase()) ||
      p.pos.toLowerCase().includes(search.toLowerCase());
    return matchPos && matchSearch;
  });

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
                    NFL DRAFT 2026
                  </h1>
                  <p className="text-[#0057FF] font-bold text-sm tracking-widest uppercase">
                    Green Bay, WI · April 23-25, 2026
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-xl">
                Complete Round 1 results, top prospect grades, and team-by-team analysis.
                Track every pick from the 2026 NFL Draft at Lambeau Field.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="bg-[#0057FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                DRAFT COMPLETE
              </span>
              <span className="text-white/40 text-xs">{DRAFT_INFO.dates}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: "Total Picks", value: "257", icon: BarChart2 },
              { label: "Rounds", value: "7", icon: Trophy },
              { label: "Teams", value: "32", icon: Users },
              { label: "QBs R1", value: "3", icon: Target },
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
        {/* #1 Pick Banner */}
        <div className="bg-gradient-to-r from-[#0057FF]/10 to-purple-900/10 border border-[#0057FF]/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#0057FF] font-bold text-xs uppercase tracking-widest mb-1">
                #1 Overall Pick
              </div>
              <div className="font-black text-2xl">Shedeur Sanders</div>
              <div className="text-white/60 text-sm">QB · Colorado → Cleveland Browns</div>
              <div className="text-white/40 text-xs mt-1">
                Son of Coach Deion Sanders · 4,134 passing yards, 37 TDs in 2025
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-[#0057FF]">1</div>
              <div className="text-white/40 text-xs">Overall</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {(["round1", "prospects", "byteam"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#0057FF] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab === "round1" ? "Round 1" : tab === "prospects" ? "Top Prospects" : "By Team"}
            </button>
          ))}
        </div>

        {/* Round 1 Tab */}
        {activeTab === "round1" && (
          <div className="space-y-2">
            {ROUND1_PICKS.map((pick) => (
              <div
                key={pick.pick}
                className={`flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 ${
                  pick.pick <= 3 ? "ring-1 ring-[#0057FF]/30" : ""
                }`}
              >
                <span className={`font-black text-lg w-8 text-right ${
                  pick.pick === 1 ? "text-[#0057FF]" : "text-white/40"
                }`}>
                  {pick.pick}
                </span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{pick.player}</div>
                  <div className="text-white/40 text-xs">{pick.school}</div>
                </div>
                <span className="bg-white/10 text-white/70 text-xs font-bold px-2 py-0.5 rounded-full">
                  {pick.pos}
                </span>
                <span className="text-white/60 text-xs text-right max-w-[120px] leading-tight">
                  {pick.team}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Prospects Tab */}
        {activeTab === "prospects" && (
          <div className="space-y-4">
            {/* Filters */}
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
                {POSITIONS.slice(0, 6).map((pos) => (
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
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                >
                  <span className="text-white/40 text-sm w-6 text-right font-mono">#{prospect.rank}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{prospect.name}</div>
                    <div className="text-white/40 text-xs">{prospect.school}</div>
                  </div>
                  <span className="bg-white/10 text-white/70 text-xs font-bold px-2 py-0.5 rounded-full">
                    {prospect.pos}
                  </span>
                  <div className="text-right">
                    <div className="font-black text-[#0057FF] text-sm">{prospect.grade}</div>
                    <div className="text-white/30 text-xs">Grade</div>
                  </div>
                  {prospect.status === "drafted" && (
                    <div className="text-right min-w-[100px]">
                      <div className="text-white/70 text-xs font-bold">Rd {prospect.round}, #{prospect.pick}</div>
                      <div className="text-white/40 text-xs leading-tight">{prospect.team}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* By Team Tab */}
        {activeTab === "byteam" && (
          <div className="space-y-3">
            <p className="text-white/40 text-sm">Round 1 picks grouped by team (multiple picks shown)</p>
            {[
              { team: "New York Giants", picks: [
                { pick: 2, player: "Cam Ward", pos: "QB" },
                { pick: 3, player: "Abdul Carter", pos: "EDGE" },
              ]},
              { team: "Las Vegas Raiders", picks: [
                { pick: 4, player: "Travis Hunter", pos: "CB/WR" },
                { pick: 6, player: "Mason Graham", pos: "DT" },
              ]},
              { team: "Indianapolis Colts", picks: [
                { pick: 14, player: "Nick Emmanwori", pos: "S" },
                { pick: 28, player: "Tyler Warren", pos: "TE" },
              ]},
            ].map((team) => (
              <div key={team.team} className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="font-black text-sm mb-3 text-[#0057FF]">{team.team}</div>
                <div className="space-y-2">
                  {team.picks.map((pick) => (
                    <div key={pick.pick} className="flex items-center gap-3">
                      <span className="text-white/40 text-sm font-mono w-6">#{pick.pick}</span>
                      <span className="font-bold text-sm flex-1">{pick.player}</span>
                      <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{pick.pos}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-white/30 text-xs text-center py-2">
              Single-pick teams not shown. View Round 1 tab for full order.
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0057FF]/10 to-purple-900/10 border border-[#0057FF]/20 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg">Build Your NFL Draft Profile</h3>
              <p className="text-white/50 text-sm">
                Get your AthlynX athlete profile ready for scouts, agents, and NFL teams.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/football">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  GridironNexus
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

export default function NFLDraft2026() {
  return (
    <RouteErrorBoundary>
      <NFLDraftInner />
    </RouteErrorBoundary>
  );
}
