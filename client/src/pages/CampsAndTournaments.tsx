import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useState } from "react";
import {
  Trophy, MapPin, Calendar, Users, Star, Eye, DollarSign,
  CheckCircle, Zap, Target, BarChart2, ArrowRight
} from "lucide-react";

const FEATURED_CAMPS = [
  { sport: "Football", name: "Elite QB Showcase", location: "Laurel, MS", date: "Jul 12–14, 2026", cost: "$350", spots: "48 spots left", level: "D1 Prospect", scouts: 12, coaches: 8 },
  { sport: "Basketball", name: "AthlynX Hoop Summit", location: "Jackson, MS", date: "Jul 18–20, 2026", cost: "$275", spots: "32 spots left", level: "All Levels", scouts: 9, coaches: 14 },
  { sport: "Baseball", name: "Diamond Showcase", location: "Hattiesburg, MS", date: "Jun 28–29, 2026", cost: "$200", spots: "60 spots left", level: "HS/College", scouts: 7, coaches: 6 },
  { sport: "Soccer", name: "ID Camp Southeast", location: "Laurel, MS", date: "Aug 2–3, 2026", cost: "$180", spots: "40 spots left", level: "U14–U18", scouts: 5, coaches: 10 },
  { sport: "Track & Field", name: "Speed & Power Combine", location: "Hattiesburg, MS", date: "Jul 26, 2026", cost: "$125", spots: "80 spots left", level: "All Levels", scouts: 4, coaches: 5 },
  { sport: "Softball", name: "SoftballNation Showcase", location: "Laurel, MS", date: "Aug 9–10, 2026", cost: "$195", spots: "55 spots left", level: "HS Prospect", scouts: 6, coaches: 7 },
];

const TOURNAMENTS = [
  { name: "AthlynX Summer Classic", sport: "Baseball", location: "Laurel, MS", date: "Jul 4–6, 2026", teams: 32, fee: "$450/team", athlynxFee: "2.5%" },
  { name: "Hoops on the Bluff", sport: "Basketball", location: "Natchez, MS", date: "Jul 11–13, 2026", teams: 24, fee: "$300/team", athlynxFee: "2%" },
  { name: "Gulf Coast Football 7v7", sport: "Football", location: "Biloxi, MS", date: "Jun 27–28, 2026", teams: 16, fee: "$500/team", athlynxFee: "3%" },
  { name: "Pine Belt Soccer Cup", sport: "Soccer", location: "Laurel, MS", date: "Aug 15–17, 2026", teams: 20, fee: "$350/team", athlynxFee: "2.5%" },
];

const SPORT_COLORS: Record<string, string> = {
  Football: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Basketball: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Baseball: "bg-green-500/20 text-green-300 border-green-500/40",
  Soccer: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "Track & Field": "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Softball: "bg-pink-500/20 text-pink-300 border-pink-500/40",
};

export default function CampsAndTournaments() {
  const [activeTab, setActiveTab] = useState<"camps" | "tournaments" | "showcases" | "tracker">("camps");
  const [sportFilter, setSportFilter] = useState("All");

  const sports = ["All", "Football", "Basketball", "Baseball", "Soccer", "Track & Field", "Softball"];
  const filteredCamps = sportFilter === "All" ? FEATURED_CAMPS : FEATURED_CAMPS.filter(c => c.sport === sportFilter);

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] pb-24">

          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/20 via-transparent to-cyan-500/10 pointer-events-none" />
            <div className="relative px-4 pt-8 pb-10 max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-cyan-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">AthlynX OS</p>
                  <h1 className="text-2xl font-black text-white">Camps &amp; Tournaments</h1>
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-2">Find Your Stage.</p>
              <p className="text-3xl font-black bg-gradient-to-r from-[#1E90FF] to-cyan-400 bg-clip-text text-transparent mb-4">Showcase Your Talent.</p>
              <p className="text-blue-300 text-sm max-w-xl leading-relaxed">
                Discover camps, showcases, and tournaments. AthlynX scouts attend every event — your next big opportunity is one registration away.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 bg-[#0d1a3a] border border-blue-700/50 rounded-xl px-4 py-2">
                  <MapPin className="w-4 h-4 text-[#1E90FF]" />
                  <span className="text-white text-sm font-bold">50+ Events Nationwide</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0d1a3a] border border-blue-700/50 rounded-xl px-4 py-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-white text-sm font-bold">AthlynX Scouts Attend</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0d1a3a] border border-blue-700/50 rounded-xl px-4 py-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-bold">2–3% Platform Fee</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 max-w-6xl mx-auto space-y-8">

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { key: "camps", label: "Featured Camps", icon: Star },
                { key: "tournaments", label: "Tournaments", icon: Trophy },
                { key: "showcases", label: "AthlynX Showcases", icon: Zap },
                { key: "tracker", label: "My Registrations", icon: CheckCircle },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === key
                      ? "bg-[#1E90FF] text-white"
                      : "bg-[#0d1a3a] border border-blue-700/50 text-blue-300 hover:border-blue-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Camps Tab */}
            {activeTab === "camps" && (
              <div className="space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {sports.map(s => (
                    <button
                      key={s}
                      onClick={() => setSportFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        sportFilter === s
                          ? "bg-cyan-500/20 border border-cyan-500/60 text-cyan-300"
                          : "bg-[#0d1a3a] border border-blue-700/40 text-blue-400 hover:border-blue-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCamps.map((camp, i) => (
                    <div key={i} className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-5 hover:border-blue-500 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${SPORT_COLORS[camp.sport] || "bg-blue-500/20 text-blue-300 border-blue-500/40"}`}>
                          {camp.sport}
                        </span>
                        <span className="text-green-400 font-black text-lg">{camp.cost}</span>
                      </div>
                      <h3 className="text-white font-black text-base mb-1">{camp.name}</h3>
                      <div className="flex items-center gap-1 text-blue-300 text-xs mb-1">
                        <MapPin className="w-3 h-3" /><span>{camp.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-300 text-xs mb-3">
                        <Calendar className="w-3 h-3" /><span>{camp.date}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-4">
                        <span className="text-blue-400">{camp.level}</span>
                        <span className="text-blue-400 font-bold">{camp.spots}</span>
                      </div>
                      <div className="flex gap-3 text-xs text-blue-300 mb-4">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-cyan-400" />{camp.scouts} Scouts</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#1E90FF]" />{camp.coaches} Coaches</span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-bold py-2 rounded-xl text-sm hover:opacity-90 transition-opacity">
                        Register Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tournaments Tab */}
            {activeTab === "tournaments" && (
              <div className="space-y-6">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h3 className="text-white font-black">AthlynX Platform Fee</h3>
                  </div>
                  <p className="text-blue-300 text-sm">AthlynX takes a 2–3% platform fee on all tournament registrations processed through the platform. This covers scouting, analytics, and platform infrastructure.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-700/50">
                        {["Tournament", "Sport", "Location", "Date", "Teams", "Entry Fee", "AthlynX %"].map(h => (
                          <th key={h} className="text-left text-blue-400 font-bold py-3 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TOURNAMENTS.map((t, i) => (
                        <tr key={i} className="border-b border-blue-700/30 hover:bg-blue-900/10">
                          <td className="text-white font-bold py-3 pr-4">{t.name}</td>
                          <td className="py-3 pr-4"><span className={`text-xs font-bold px-2 py-1 rounded-lg border ${SPORT_COLORS[t.sport] || "bg-blue-500/20 text-blue-300 border-blue-500/40"}`}>{t.sport}</span></td>
                          <td className="text-blue-300 py-3 pr-4">{t.location}</td>
                          <td className="text-blue-300 py-3 pr-4">{t.date}</td>
                          <td className="text-white font-bold py-3 pr-4">{t.teams}</td>
                          <td className="text-green-400 font-bold py-3 pr-4">{t.fee}</td>
                          <td className="text-cyan-400 font-bold py-3">{t.athlynxFee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Showcases Tab */}
            {activeTab === "showcases" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#1E90FF]/20 to-cyan-500/10 border border-[#1E90FF]/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-white font-black text-lg">AthlynX Showcase Events</h2>
                  </div>
                  <p className="text-blue-300 text-sm leading-relaxed">
                    AthlynX-hosted recruiting showcases where our scouts identify talent for the AthlynX Roster. These are the events where the next Michael Bo Jackson, Mike Trout, or Cristiano Ronaldo gets discovered.
                  </p>
                </div>
                {[
                  { name: "AthlynX Elite Prospect Showcase", date: "Aug 22–24, 2026", location: "Laurel, MS", desc: "Invitation or application required. AthlynX scouts identify top talent for the AthlynX Roster.", spots: "100 athletes", level: "Elite Only" },
                  { name: "AthlynX National Combine", date: "Oct 4–5, 2026", location: "Jackson, MS", desc: "Multi-sport combine with physical and mental analytics. Full AthlynX profile created for every athlete.", spots: "200 athletes", level: "All Levels" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0d1a3a] border border-cyan-500/40 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-black text-lg">{s.name}</h3>
                      <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold px-3 py-1 rounded-xl">{s.level}</span>
                    </div>
                    <p className="text-blue-300 text-sm mb-4">{s.desc}</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div><p className="text-blue-400 text-xs font-bold uppercase">Date</p><p className="text-white font-bold text-sm">{s.date}</p></div>
                      <div><p className="text-blue-400 text-xs font-bold uppercase">Location</p><p className="text-white font-bold text-sm">{s.location}</p></div>
                      <div><p className="text-blue-400 text-xs font-bold uppercase">Capacity</p><p className="text-white font-bold text-sm">{s.spots}</p></div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-[#1E90FF] text-white font-black py-3 rounded-xl hover:opacity-90 transition-opacity">
                      Apply for Showcase
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tracker Tab */}
            {activeTab === "tracker" && (
              <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-white font-black text-lg mb-2">No Registrations Yet</h3>
                <p className="text-blue-400 text-sm mb-6">Register for a camp or tournament to track your upcoming events here.</p>
                <button onClick={() => setActiveTab("camps")} className="bg-[#1E90FF] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors">
                  Browse Camps
                </button>
              </div>
            )}

            {/* Camp ROI Calculator */}
            <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart2 className="w-6 h-6 text-[#1E90FF]" />
                <h2 className="text-white font-black text-lg">Camp ROI Calculator</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-700/50">
                      {["Camp Type", "Avg Cost", "Coaches Present", "Recruiting Exposure Value", "ROI"].map(h => (
                        <th key={h} className="text-left text-blue-400 font-bold py-2 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "Elite D1 Showcase", cost: "$350–$500", coaches: "15–30", exposure: "$5K–$50K scholarship leads", roi: "High", color: "text-green-400" },
                      { type: "Regional Camp", cost: "$150–$300", coaches: "8–15", exposure: "$2K–$20K scholarship leads", roi: "Medium-High", color: "text-green-400" },
                      { type: "Local Showcase", cost: "$75–$150", coaches: "3–8", exposure: "$500–$5K scholarship leads", roi: "Medium", color: "text-blue-400" },
                      { type: "AthlynX Showcase", cost: "Free–$200", coaches: "10–25 + AthlynX Scouts", exposure: "AthlynX Roster + full profile", roi: "Very High", color: "text-cyan-400" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-blue-700/30">
                        <td className="text-white font-bold py-3 pr-4">{row.type}</td>
                        <td className="text-green-400 py-3 pr-4">{row.cost}</td>
                        <td className="text-blue-300 py-3 pr-4">{row.coaches}</td>
                        <td className="text-blue-300 py-3 pr-4">{row.exposure}</td>
                        <td className={`font-bold py-3 ${row.color}`}>{row.roi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scout Network Stats */}
            <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-cyan-400" />
                <h2 className="text-white font-black text-lg">AthlynX Scout Network</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Active Scouts", value: "47", icon: Eye },
                  { label: "Events Covered", value: "120+", icon: MapPin },
                  { label: "Athletes Scouted", value: "8,400+", icon: Users },
                  { label: "Roster Signings", value: "23", icon: Star },
                ].map(({ label, value, icon: Icon }, i) => (
                  <div key={i} className="bg-[#050c1a] border border-blue-700/40 rounded-xl p-4 text-center">
                    <Icon className="w-5 h-5 text-[#1E90FF] mx-auto mb-2" />
                    <p className="text-white font-black text-xl">{value}</p>
                    <p className="text-blue-400 text-xs font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-blue-700/30 pt-6 text-center">
              <p className="text-blue-600 text-xs">Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™</p>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
