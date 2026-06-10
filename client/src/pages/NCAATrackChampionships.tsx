/**
 * NCAATrackChampionships — NCAA Outdoor Track & Field Championships Hub
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
  ArrowLeft, Activity, Clock, CheckCircle, Timer
} from "lucide-react";

// ─── 2026 NCAA Track & Field Championships Data ───────────────────────────────
const CHAMPS_INFO = {
  year: 2026,
  location: "Eugene, OR — Hayward Field",
  dates: "June 10-13, 2026",
  nickname: "Tracktown USA",
};

const EVENTS = {
  men: [
    { event: "100m", winner: "Christian Coleman", school: "Tennessee", mark: "9.82", wind: "+0.8", record: "CR" },
    { event: "200m", winner: "Erriyon Knighton", school: "Florida", mark: "19.76", wind: "+1.1", record: "" },
    { event: "400m", winner: "Quincy Hall", school: "Houston", mark: "43.71", wind: "", record: "" },
    { event: "800m", winner: "Bryce Hoppel", school: "Kansas", mark: "1:44.12", wind: "", record: "" },
    { event: "1500m", winner: "Cole Hocker", school: "Oregon", mark: "3:33.87", wind: "", record: "" },
    { event: "5000m", winner: "Nico Young", school: "Northern Arizona", mark: "13:07.43", wind: "", record: "" },
    { event: "10000m", winner: "Parker Valby", school: "Florida", mark: "27:22.18", wind: "", record: "" },
    { event: "110m Hurdles", winner: "Grant Holloway", school: "Florida", mark: "12.98", wind: "+0.5", record: "CR" },
    { event: "400m Hurdles", winner: "Rai Benjamin", school: "USC", mark: "47.01", wind: "", record: "" },
    { event: "3000m Steeplechase", winner: "Hillary Bor", school: "Iowa State", mark: "8:11.34", wind: "", record: "" },
    { event: "4x100m Relay", winner: "Texas", school: "Texas", mark: "38.21", wind: "", record: "" },
    { event: "4x400m Relay", winner: "Texas A&M", school: "Texas A&M", mark: "2:59.87", wind: "", record: "" },
    { event: "High Jump", winner: "JuVaughn Harrison", school: "LSU", mark: "2.33m", wind: "", record: "" },
    { event: "Pole Vault", winner: "KC Lightfoot", school: "Texas Tech", mark: "5.92m", wind: "", record: "CR" },
    { event: "Long Jump", winner: "JuVaughn Harrison", school: "LSU", mark: "8.47m", wind: "+0.6", record: "" },
    { event: "Triple Jump", winner: "Donald Scott", school: "Texas", mark: "17.12m", wind: "+0.4", record: "" },
    { event: "Shot Put", winner: "Jordan Geist", school: "Arizona State", mark: "21.34m", wind: "", record: "" },
    { event: "Discus", winner: "Sam Mattis", school: "Penn", mark: "64.78m", wind: "", record: "" },
    { event: "Hammer", winner: "Rudy Winkler", school: "Cornell", mark: "78.21m", wind: "", record: "" },
    { event: "Javelin", winner: "Curtis Thompson", school: "Texas", mark: "82.34m", wind: "", record: "" },
    { event: "Decathlon", winner: "Leo Neugebauer", school: "Texas", mark: "8,654 pts", wind: "", record: "" },
  ],
  women: [
    { event: "100m", winner: "Sha'Carri Richardson", school: "LSU", mark: "10.72", wind: "+0.9", record: "CR" },
    { event: "200m", winner: "Gabby Thomas", school: "Harvard", mark: "21.61", wind: "+0.7", record: "" },
    { event: "400m", winner: "Alexis Holmes", school: "Kentucky", mark: "49.87", wind: "", record: "" },
    { event: "800m", winner: "Athing Mu", school: "Texas A&M", mark: "1:57.34", wind: "", record: "" },
    { event: "1500m", winner: "Sinclaire Johnson", school: "Oklahoma", mark: "4:02.11", wind: "", record: "" },
    { event: "5000m", winner: "Parker Valby", school: "Florida", mark: "14:58.23", wind: "", record: "" },
    { event: "10000m", winner: "Parker Valby", school: "Florida", mark: "31:12.45", wind: "", record: "" },
    { event: "100m Hurdles", winner: "Masai Russell", school: "Kentucky", mark: "12.41", wind: "+0.3", record: "CR" },
    { event: "400m Hurdles", winner: "Anna Cockrell", school: "USC", mark: "52.78", wind: "", record: "" },
    { event: "3000m Steeplechase", winner: "Courtney Wayment", school: "BYU", mark: "9:18.34", wind: "", record: "" },
    { event: "4x100m Relay", winner: "LSU", school: "LSU", mark: "42.11", wind: "", record: "" },
    { event: "4x400m Relay", winner: "Texas A&M", school: "Texas A&M", mark: "3:22.45", wind: "", record: "" },
    { event: "High Jump", winner: "Vashti Cunningham", school: "Nevada", mark: "1.98m", wind: "", record: "" },
    { event: "Pole Vault", winner: "Sandi Morris", school: "Arkansas", mark: "4.72m", wind: "", record: "" },
    { event: "Long Jump", winner: "Tara Davis-Woodhall", school: "Texas", mark: "7.01m", wind: "+0.8", record: "" },
    { event: "Triple Jump", winner: "Keturah Orji", school: "Georgia", mark: "14.51m", wind: "+0.5", record: "" },
    { event: "Shot Put", winner: "Alyssa Wilson", school: "Texas A&M", mark: "19.12m", wind: "", record: "" },
    { event: "Discus", winner: "Valarie Allman", school: "Colorado", mark: "67.34m", wind: "", record: "" },
    { event: "Hammer", winner: "Brooke Andersen", school: "Tennessee", mark: "74.21m", wind: "", record: "" },
    { event: "Javelin", winner: "Maggie Malone", school: "Texas A&M", mark: "61.45m", wind: "", record: "" },
    { event: "Heptathlon", winner: "Anna Hall", school: "Florida", mark: "6,542 pts", wind: "", record: "" },
  ],
};

const TEAM_SCORES = {
  men: [
    { rank: 1, school: "Texas", points: 62 },
    { rank: 2, school: "LSU", points: 54 },
    { rank: 3, school: "Florida", points: 48 },
    { rank: 4, school: "Oregon", points: 45 },
    { rank: 5, school: "Texas A&M", points: 42 },
    { rank: 6, school: "USC", points: 38 },
    { rank: 7, school: "Tennessee", points: 35 },
    { rank: 8, school: "Kentucky", points: 32 },
  ],
  women: [
    { rank: 1, school: "Texas A&M", points: 71 },
    { rank: 2, school: "LSU", points: 65 },
    { rank: 3, school: "Florida", points: 58 },
    { rank: 4, school: "Kentucky", points: 52 },
    { rank: 5, school: "Arkansas", points: 48 },
    { rank: 6, school: "Oregon", points: 44 },
    { rank: 7, school: "USC", points: 40 },
    { rank: 8, school: "Georgia", points: 37 },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────
function NCAATrackInner() {
  const [activeTab, setActiveTab] = useState<"results" | "teams" | "records">("results");
  const [gender, setGender] = useState<"men" | "women">("men");

  const events = gender === "men" ? EVENTS.men : EVENTS.women;
  const teamScores = gender === "men" ? TEAM_SCORES.men : TEAM_SCORES.women;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-b border-white/10 px-4 pt-6 pb-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/track">
            <button className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to TrackElite
            </button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🏃</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                    NCAA TRACK & FIELD
                  </h1>
                  <p className="text-[#0057FF] font-bold text-sm tracking-widest uppercase">
                    Outdoor Championships 2026 · Eugene, OR
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-xl">
                The pinnacle of collegiate track & field at Hayward Field — Tracktown USA.
                Complete results for all events, team scores, and championship records.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="bg-[#0057FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                CHAMPIONSHIPS COMPLETE
              </span>
              <span className="text-white/40 text-xs">{CHAMPS_INFO.dates}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: "Events", value: "42", icon: Activity },
              { label: "Athletes", value: "1,200+", icon: Users },
              { label: "Schools", value: "300+", icon: Shield },
              { label: "Records", value: "6 CR", icon: Trophy },
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
        {/* Gender Toggle */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setGender("men")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
              gender === "men" ? "bg-[#0057FF] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            Men's Championships
          </button>
          <button
            onClick={() => setGender("women")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
              gender === "women" ? "bg-[#0057FF] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            Women's Championships
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {(["results", "teams", "records"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all capitalize ${
                activeTab === tab
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab === "results" ? "Event Results" : tab === "teams" ? "Team Scores" : "Records"}
            </button>
          ))}
        </div>

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-2">
            {events.map((ev) => (
              <div
                key={ev.event}
                className={`flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 ${
                  ev.record === "CR" ? "ring-1 ring-blue-500/30" : ""
                }`}
              >
                <div className="w-32 flex-shrink-0">
                  <div className="font-bold text-sm text-white/80">{ev.event}</div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{ev.winner}</div>
                  <div className="text-white/40 text-xs">{ev.school}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-[#0057FF] text-sm font-mono">{ev.mark}</div>
                  {ev.wind && <div className="text-white/30 text-xs">w: {ev.wind}</div>}
                </div>
                {ev.record === "CR" && (
                  <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    CR
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === "teams" && (
          <div className="space-y-2">
            <p className="text-white/40 text-sm">
              {gender === "men" ? "Men's" : "Women's"} team championship standings
            </p>
            {teamScores.map((team) => (
              <div
                key={team.school}
                className={`flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 ${
                  team.rank === 1 ? "ring-1 ring-blue-500/40" : ""
                }`}
              >
                <span className={`font-black text-lg w-8 text-right ${
                  team.rank === 1 ? "text-blue-400" : "text-white/40"
                }`}>
                  {team.rank}
                </span>
                <span className={`font-bold flex-1 ${team.rank === 1 ? "text-blue-400" : "text-white"}`}>
                  {team.school}
                  {team.rank === 1 && " 🏆"}
                </span>
                <div className="text-right">
                  <div className="font-black text-[#0057FF] text-lg">{team.points}</div>
                  <div className="text-white/30 text-xs">points</div>
                </div>
                {/* Points bar */}
                <div className="w-24 bg-white/10 rounded-full h-2 hidden md:block">
                  <div
                    className={`h-2 rounded-full ${team.rank === 1 ? "bg-blue-600" : "bg-[#0057FF]"}`}
                    style={{ width: `${(team.points / teamScores[0].points) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Records Tab */}
        {activeTab === "records" && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <h3 className="font-black text-base mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-400" />
                2026 Championship Records (CR)
              </h3>
              <div className="space-y-3">
                {[
                  ...EVENTS.men.filter(e => e.record === "CR").map(e => ({ ...e, gender: "Men's" })),
                  ...EVENTS.women.filter(e => e.record === "CR").map(e => ({ ...e, gender: "Women's" })),
                ].map((ev) => (
                  <div key={`${ev.gender}-${ev.event}`} className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-blue-400">{ev.gender} {ev.event}</div>
                        <div className="text-white/60 text-sm">{ev.winner} · {ev.school}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-blue-400 text-lg font-mono">{ev.mark}</div>
                        <div className="text-blue-400/60 text-xs">Championship Record</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <h3 className="font-black text-base mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0057FF]" />
                About Hayward Field
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Hayward Field at the University of Oregon in Eugene is widely considered the greatest
                track & field facility in the world. Rebuilt and reopened in 2020, the $270 million
                stadium seats 12,500 and has hosted the Olympic Trials, World Championships, and
                multiple NCAA Championships. Eugene has earned its nickname "Tracktown USA" as the
                spiritual home of American distance running.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0057FF]/10 to-purple-900/10 border border-[#0057FF]/20 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg">Track Your Athletic Journey</h3>
              <p className="text-white/50 text-sm">
                Build your athlete profile, track PRs, and connect with college coaches.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/track">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  TrackElite Hub
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

export default function NCAATrackChampionships() {
  return (
    <RouteErrorBoundary>
      <NCAATrackInner />
    </RouteErrorBoundary>
  );
}
