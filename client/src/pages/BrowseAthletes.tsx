/**
 * AthlynX — Browse Athletes
 * World-class athlete discovery — beats Perfect Game, Hudl, On3, 24/7 Sports.
 * Real athlete cards with photos, sport badges, recruiting status, NIL value, stats.
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import PlatformLayout from "@/components/PlatformLayout";
import { AthleteProfileCard } from "@/components/AthleteProfileCard";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

const SPORTS = [
  "All", "Football", "Basketball", "Baseball", "Soccer", "Track & Field",
  "Swimming", "Tennis", "Volleyball", "Wrestling", "Golf", "Lacrosse",
  "Hockey", "Softball", "Cross Country", "Gymnastics", "Rugby", "Fishing",
  "Rowing", "Water Polo", "Field Hockey", "Cheerleading", "Multi-Sport",
];

const SPORT_ICONS: Record<string, string> = {
  Football: "🏈", Basketball: "🏀", Baseball: "⚾", Soccer: "⚽",
  "Track & Field": "🏃", Swimming: "🏊", Tennis: "🎾", Volleyball: "🏐",
  Wrestling: "🤼", Golf: "⛳", Lacrosse: "🥍", Hockey: "🏒",
  Softball: "🥎", "Cross Country": "🏃‍♂️", Gymnastics: "🤸", Rugby: "🏉",
  Fishing: "🎣", Rowing: "🚣", "Water Polo": "🤽", "Field Hockey": "🏑",
  Cheerleading: "📣", "Multi-Sport": "🏆",
};

const STATUS_FILTERS = [
  { id: "all", label: "All Athletes" },
  { id: "available", label: "🟢 Available" },
  { id: "committed", label: "🔵 Committed" },
  { id: "transferred", label: "🟡 Transfer Portal" },
  { id: "signed", label: "🟣 Signed" },
];

// Showcase athletes — displayed when DB has no athletes yet
// These represent the types of athletes on the platform
const SHOWCASE_ATHLETES = [
  { userId: 1, name: "Marcus Johnson", sport: "Football", position: "QB", school: "University of Texas", classYear: "2025", state: "TX", recruitingStatus: "available", recruitingScore: 94, nilValue: 85000, gpa: 3.4, height: "6'3\"", weight: 215 },
  { userId: 2, name: "Destiny Williams", sport: "Basketball", position: "PG", school: "LSU", classYear: "2026", state: "LA", recruitingStatus: "committed", recruitingScore: 91, nilValue: 62000, gpa: 3.7, height: "5'9\"", weight: 155 },
  { userId: 3, name: "Tyler Brooks", sport: "Baseball", position: "RHP", school: "Vanderbilt", classYear: "2025", state: "TN", recruitingStatus: "available", recruitingScore: 88, nilValue: 45000, gpa: 3.2, height: "6'2\"", weight: 195 },
  { userId: 4, name: "Aaliyah Torres", sport: "Soccer", position: "FW", school: "Stanford", classYear: "2027", state: "CA", recruitingStatus: "committed", recruitingScore: 92, nilValue: 38000, gpa: 3.9, height: "5'6\"", weight: 135 },
  { userId: 5, name: "Jordan Davis", sport: "Track & Field", position: "Sprinter", school: "Florida State", classYear: "2025", state: "FL", recruitingStatus: "available", recruitingScore: 89, nilValue: 29000, gpa: 3.5, height: "6'0\"", weight: 175 },
  { userId: 6, name: "Kayla Mitchell", sport: "Volleyball", position: "OH", school: "Nebraska", classYear: "2026", state: "NE", recruitingStatus: "committed", recruitingScore: 87, nilValue: 22000, gpa: 3.8, height: "6'1\"", weight: 165 },
  { userId: 7, name: "Darius Thompson", sport: "Football", position: "WR", school: "Alabama", classYear: "2025", state: "AL", recruitingStatus: "transferred", recruitingScore: 96, nilValue: 125000, gpa: 3.1, height: "6'1\"", weight: 190 },
  { userId: 8, name: "Sofia Reyes", sport: "Swimming", position: "Freestyle", school: "Cal Berkeley", classYear: "2027", state: "CA", recruitingStatus: "available", recruitingScore: 85, nilValue: 18000, gpa: 4.0, height: "5'8\"", weight: 145 },
  { userId: 9, name: "Isaiah Carter", sport: "Basketball", position: "SF", school: "Duke", classYear: "2025", state: "NC", recruitingStatus: "available", recruitingScore: 97, nilValue: 210000, gpa: 3.3, height: "6'7\"", weight: 215 },
  { userId: 10, name: "Emma Rodriguez", sport: "Softball", position: "P", school: "Oklahoma", classYear: "2026", state: "OK", recruitingStatus: "committed", recruitingScore: 90, nilValue: 31000, gpa: 3.6, height: "5'10\"", weight: 160 },
  { userId: 11, name: "Malik Washington", sport: "Baseball", position: "SS", school: "Ole Miss", classYear: "2025", state: "MS", recruitingStatus: "available", recruitingScore: 86, nilValue: 42000, gpa: 3.0, height: "6'0\"", weight: 185 },
  { userId: 12, name: "Priya Sharma", sport: "Tennis", position: "Singles", school: "Stanford", classYear: "2027", state: "CA", recruitingStatus: "committed", recruitingScore: 88, nilValue: 25000, gpa: 3.9, height: "5'7\"", weight: 140 },
];

function BrowseAthletesInner() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [view, setView] = useState<"grid" | "featured">("featured");

  const { data: dbAthletes = [], isLoading } = trpc.profile.browseAthletes.useQuery({
    sport: selectedSport !== "All" ? selectedSport : undefined,
    limit: 50,
  });

  // Use real DB athletes if available, otherwise show showcase
  const sourceAthletes = dbAthletes.length > 0 ? dbAthletes : SHOWCASE_ATHLETES;

  const filtered = sourceAthletes.filter((a: any) => {
    const matchSearch = !search ||
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.school || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.position || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.sport || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === "all" || a.recruitingStatus === selectedStatus;
    const matchSport = selectedSport === "All" || a.sport === selectedSport;
    return matchSearch && matchStatus && matchSport;
  });

  // Top featured athletes (score >= 90)
  const featured = filtered.filter((a: any) => Number(a.recruitingScore || 0) >= 90).slice(0, 3);
  const rest = filtered.filter((a: any) => Number(a.recruitingScore || 0) < 90);

  return (
    <PlatformLayout title="Browse Athletes">
      <div className="min-h-screen bg-[#040c1a] pb-24">

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#040c1a] via-blue-950/30 to-[#040c1a] border-b border-white/10 px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  🏆 Browse Athletes
                  {dbAthletes.length === 0 && (
                    <span className="text-xs font-normal text-white/30 bg-white/5 px-2 py-0.5 rounded-full">Showcase Mode</span>
                  )}
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  {filtered.length} athletes · {selectedSport !== "All" ? selectedSport : "All Sports"} · Discover. Connect. Recruit.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("featured")}
                  className={`p-2 rounded-lg text-sm transition-all ${view === "featured" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-white/40 border border-white/10"}`}
                  title="Featured view"
                >
                  ⭐
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg text-sm transition-all ${view === "grid" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-white/40 border border-white/10"}`}
                  title="Grid view"
                >
                  ⊞
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <span className="absolute left-3.5 top-3 text-white/30 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by name, school, sport, position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            {/* Status filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-3">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedStatus(f.id)}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    selectedStatus === f.id
                      ? "bg-cyan-500 text-black border-cyan-500"
                      : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sport filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {SPORTS.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    selectedSport === sport
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white/5 text-white/40 border-white/10 hover:text-white"
                  }`}
                >
                  {sport !== "All" && <span>{SPORT_ICONS[sport] || "🏆"}</span>}
                  <span>{sport}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#0d1b3e] rounded-2xl h-64 animate-pulse border border-white/5" />
              ))}
            </div>
          )}

          {/* Featured Athletes (Top Recruits) */}
          {!isLoading && featured.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-300/30" />
                <h2 className="text-white font-black text-sm flex items-center gap-2">
                  <span className="text-blue-300">⭐</span> TOP RECRUITS
                  <span className="text-white/30 font-normal">Score 90+</span>
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-300/30" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((athlete: any) => (
                  <AthleteProfileCard key={athlete.userId} athlete={athlete} variant="featured" />
                ))}
              </div>
            </div>
          )}

          {/* All Athletes Grid */}
          {!isLoading && (
            <div>
              {featured.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-white/5" />
                  <h2 className="text-white/50 font-bold text-xs tracking-widest">ALL ATHLETES</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
              )}
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-white/40 text-base">No athletes found for "{search}"</p>
                  <button onClick={() => { setSearch(""); setSelectedSport("All"); setSelectedStatus("all"); }}
                    className="mt-3 text-cyan-400 text-sm hover:text-cyan-300">Clear filters</button>
                </div>
              ) : (
                <div className={`grid gap-4 ${view === "featured" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"}`}>
                  {(featured.length > 0 ? rest : filtered).map((athlete: any) => (
                    <AthleteProfileCard key={athlete.userId} athlete={athlete} variant={view === "featured" ? "grid" : "grid"} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA for non-logged-in users */}
          {!user && (
            <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-2xl border border-cyan-700/30 p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-white font-black text-lg mb-2">Create Your Athlete Profile</h3>
              <p className="text-blue-300 text-sm mb-4">Join thousands of athletes building their recruiting profiles, NIL deals, and careers on AthlynX.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/signup">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl text-sm hover:opacity-90 transition-all">
                    Join Free — 7 Days
                  </button>
                </Link>
                <Link href="/signin">
                  <button className="px-6 py-2.5 bg-white/5 border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-all">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function BrowseAthletes() {
  return <RouteErrorBoundary><BrowseAthletesInner /></RouteErrorBoundary>;
}
