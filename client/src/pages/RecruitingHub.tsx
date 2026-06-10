/**
 * AthlynX — Recruiting Hub
 * Beats Perfect Game, Hudl, On3, 24/7 Sports for athlete recruiting.
 * Features: Coach search, scholarship offer tracker, offer board,
 * recruiting timeline, school comparison, eligibility checker.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Showcase schools with real data
const SHOWCASE_SCHOOLS = [
  { name: "University of Alabama", conference: "SEC", division: "Division I", sport: "Football", scholarships: 85, avgGPA: 3.1, ranking: 4, logo: "🐘", color: "from-red-900 to-red-800", state: "AL" },
  { name: "Ohio State University", conference: "Big Ten", division: "Division I", sport: "Football", scholarships: 85, avgGPA: 3.3, ranking: 3, logo: "🌰", color: "from-red-800 to-gray-800", state: "OH" },
  { name: "Duke University", conference: "ACC", division: "Division I", sport: "Basketball", scholarships: 13, avgGPA: 3.8, ranking: 1, logo: "👿", color: "from-blue-900 to-blue-800", state: "NC" },
  { name: "LSU", conference: "SEC", division: "Division I", sport: "Football", scholarships: 85, avgGPA: 3.0, ranking: 5, logo: "🐯", color: "from-purple-900 to-blue-900", state: "LA" },
  { name: "Stanford University", conference: "Pac-12", division: "Division I", sport: "Soccer", scholarships: 9.9, avgGPA: 3.9, ranking: 1, logo: "🌲", color: "from-red-900 to-gray-800", state: "CA" },
  { name: "Vanderbilt University", conference: "SEC", division: "Division I", sport: "Baseball", scholarships: 11.7, avgGPA: 3.6, ranking: 8, logo: "⭐", color: "from-blue-900 to-gray-800", state: "TN" },
  { name: "University of Texas", conference: "Big 12", division: "Division I", sport: "Football", scholarships: 85, avgGPA: 3.2, ranking: 6, logo: "🤘", color: "from-cyan-900 to-gray-800", state: "TX" },
  { name: "Florida State University", conference: "ACC", division: "Division I", sport: "Track & Field", scholarships: 12.6, avgGPA: 3.3, ranking: 7, logo: "🏹", color: "from-red-900 to-blue-900", state: "FL" },
];

// Showcase coaches
const SHOWCASE_COACHES = [
  { name: "Coach Marcus Williams", school: "University of Alabama", sport: "Football", position: "Offensive Coordinator", email: "mwilliams@ua.edu", phone: "(205) 555-0101", activeRecruiting: ["QB", "WR", "OL"], scholarshipsAvailable: 3, avatar: "🏈" },
  { name: "Coach Sarah Johnson", school: "Stanford University", sport: "Soccer", position: "Head Coach", email: "sjohnson@stanford.edu", phone: "(650) 555-0102", activeRecruiting: ["FW", "MF", "GK"], scholarshipsAvailable: 2, avatar: "⚽" },
  { name: "Coach David Thompson", school: "Duke University", sport: "Basketball", position: "Assistant Coach", email: "dthompson@duke.edu", phone: "(919) 555-0103", activeRecruiting: ["PG", "SG", "SF"], scholarshipsAvailable: 1, avatar: "🏀" },
  { name: "Coach Maria Rodriguez", school: "LSU", sport: "Track & Field", position: "Head Coach", email: "mrodriguez@lsu.edu", phone: "(225) 555-0104", activeRecruiting: ["Sprinter", "Jumper", "Thrower"], scholarshipsAvailable: 4, avatar: "🏃" },
];

// Showcase offers for demo
const SHOWCASE_OFFERS = [
  { school: "University of Alabama", sport: "Football", type: "Full Scholarship", value: "$65,000/yr", status: "received", date: "2026-03-15", deadline: "2026-05-01", logo: "🐘" },
  { school: "Ohio State University", sport: "Football", type: "Full Scholarship", value: "$58,000/yr", status: "received", date: "2026-03-20", deadline: "2026-05-15", logo: "🌰" },
  { school: "University of Texas", sport: "Football", type: "Full Scholarship", value: "$52,000/yr", status: "pending", date: "2026-04-01", deadline: "2026-06-01", logo: "🤘" },
  { school: "LSU", sport: "Football", type: "Partial Scholarship", value: "$35,000/yr", status: "declined", date: "2026-02-10", deadline: "2026-03-01", logo: "🐯" },
];

const STATUS_COLORS: Record<string, string> = {
  received: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-blue-500/20 text-sky-400 border-blue-500/30",
  accepted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  declined: "bg-red-500/20 text-red-400 border-red-500/30",
};

function RecruitingHubInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"offers" | "coaches" | "schools" | "timeline" | "eligibility">("offers");
  const [searchCoach, setSearchCoach] = useState("");
  const [searchSchool, setSearchSchool] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [contactedCoach, setContactedCoach] = useState<string | null>(null);

  const filteredCoaches = SHOWCASE_COACHES.filter(c =>
    (!searchCoach || c.name.toLowerCase().includes(searchCoach.toLowerCase()) || c.school.toLowerCase().includes(searchCoach.toLowerCase())) &&
    (selectedSport === "All" || c.sport === selectedSport)
  );

  const filteredSchools = SHOWCASE_SCHOOLS.filter(s =>
    (!searchSchool || s.name.toLowerCase().includes(searchSchool.toLowerCase())) &&
    (selectedSport === "All" || s.sport === selectedSport)
  );

  const SPORTS = ["All", "Football", "Basketball", "Baseball", "Soccer", "Track & Field", "Swimming", "Tennis", "Volleyball", "Wrestling", "Softball"];

  const TIMELINE_EVENTS = [
    { date: "Mar 15, 2026", event: "Received offer from University of Alabama", type: "offer", icon: "🎉", color: "text-green-400" },
    { date: "Mar 20, 2026", event: "Received offer from Ohio State University", type: "offer", icon: "🎉", color: "text-green-400" },
    { date: "Mar 25, 2026", event: "Official visit to University of Alabama", type: "visit", icon: "✈️", color: "text-blue-400" },
    { date: "Apr 1, 2026", event: "Received offer from University of Texas", type: "offer", icon: "🎉", color: "text-green-400" },
    { date: "Apr 10, 2026", event: "Official visit to Ohio State University", type: "visit", icon: "✈️", color: "text-blue-400" },
    { date: "Apr 15, 2026", event: "Declined LSU offer", type: "decision", icon: "❌", color: "text-red-400" },
    { date: "May 1, 2026", event: "Deadline: Alabama offer expires", type: "deadline", icon: "⏰", color: "text-cyan-400" },
    { date: "May 8, 2026", event: "National Signing Day", type: "milestone", icon: "🏆", color: "text-sky-400" },
  ];

  return (
    <PlatformLayout title="Recruiting Hub">
      <div className="max-w-5xl mx-auto px-2 py-4 space-y-4 pb-24">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-white mb-1">🏆 Recruiting Hub</h1>
              <p className="text-blue-300 text-sm max-w-xl">
                Your complete recruiting command center. Track offers, contact coaches, compare schools, and manage your entire recruiting journey from one place.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { label: "Offers Received", value: "3", color: "text-green-400" },
                  { label: "Schools Interested", value: "8", color: "text-cyan-400" },
                  { label: "Coaches Contacted", value: "12", color: "text-purple-400" },
                  { label: "Recruiting Score", value: "94", color: "text-sky-400" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
                    <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                    <div className="text-white/40 text-[10px]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {!user && (
              <Link href="/signup">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all shrink-0">
                  Join Free →
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: "offers", label: "📋 Offers", count: SHOWCASE_OFFERS.length },
            { id: "coaches", label: "👨‍🏫 Coaches", count: SHOWCASE_COACHES.length },
            { id: "schools", label: "🏫 Schools", count: SHOWCASE_SCHOOLS.length },
            { id: "timeline", label: "📅 Timeline", count: TIMELINE_EVENTS.length },
            { id: "eligibility", label: "✅ Eligibility", count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                  : "bg-[#0d1b3e] border border-blue-800 text-blue-400 hover:border-blue-600"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-blue-900"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* OFFERS TAB */}
        {activeTab === "offers" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-base">Scholarship Offers</h2>
              <span className="text-blue-400 text-xs">{SHOWCASE_OFFERS.filter(o => o.status === "received").length} active offers</span>
            </div>
            {SHOWCASE_OFFERS.map((offer, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-4 hover:border-blue-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{offer.logo}</div>
                    <div>
                      <div className="text-white font-black text-base">{offer.school}</div>
                      <div className="text-blue-400 text-xs">{offer.sport} · {offer.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-black text-base">{offer.value}</div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${STATUS_COLORS[offer.status]}`}>
                      {offer.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-blue-400 border-t border-blue-900/50 pt-2">
                  <span>Received: {offer.date}</span>
                  <span className={offer.status === "received" ? "text-cyan-400 font-bold" : ""}>
                    {offer.status === "received" ? `⏰ Deadline: ${offer.deadline}` : `Status: ${offer.status}`}
                  </span>
                </div>
                {offer.status === "received" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => toast.success(`Accepted offer from ${offer.school}!`)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black py-2 rounded-xl text-xs hover:opacity-90 transition-all"
                    >
                      ✅ Accept
                    </button>
                    <button
                      onClick={() => toast.info(`Declined offer from ${offer.school}`)}
                      className="flex-1 bg-red-900/30 border border-red-700 text-red-400 font-black py-2 rounded-xl text-xs hover:bg-red-900/50 transition-all"
                    >
                      ❌ Decline
                    </button>
                    <Link href="/messenger" className="flex-1">
                      <button className="w-full bg-blue-900/30 border border-blue-700 text-blue-400 font-black py-2 rounded-xl text-xs hover:bg-blue-900/50 transition-all">
                        💬 Message
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {!user && (
              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl border border-cyan-700/30 p-5 text-center">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="text-white font-black text-base mb-1">Track Your Real Offers</h3>
                <p className="text-blue-300 text-sm mb-3">Create your profile to track real scholarship offers, set deadlines, and manage your recruiting journey.</p>
                <Link href="/signup">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl text-sm hover:opacity-90 transition-all">
                    Create Profile Free
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* COACHES TAB */}
        {activeTab === "coaches" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-white/30 text-sm">🔍</span>
                <input
                  value={searchCoach}
                  onChange={e => setSearchCoach(e.target.value)}
                  placeholder="Search coaches or schools..."
                  className="w-full bg-[#0d1b3e] border border-blue-800 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <select
                value={selectedSport}
                onChange={e => setSelectedSport(e.target.value)}
                className="bg-[#0d1b3e] border border-blue-800 text-blue-400 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
              >
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {filteredCoaches.map((coach, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-4 hover:border-blue-600 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-2xl shrink-0">
                    {coach.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-black text-base">{coach.name}</span>
                      <span className="bg-green-500/20 text-green-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-green-500/30">
                        RECRUITING
                      </span>
                    </div>
                    <div className="text-blue-400 text-xs">{coach.position} · {coach.school}</div>
                    <div className="text-blue-500 text-xs">{coach.sport}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sky-400 font-black text-sm">{coach.scholarshipsAvailable}</div>
                    <div className="text-white/30 text-[9px]">scholarships</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">Actively Recruiting</div>
                  <div className="flex flex-wrap gap-1">
                    {coach.activeRecruiting.map(pos => (
                      <span key={pos} className="bg-blue-900/50 border border-blue-700 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pos}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${coach.email}?subject=Recruiting Inquiry — AthlynX Athlete&body=Coach ${coach.name.split(" ").pop()},%0A%0AMy name is [Your Name] and I am a [Year] [Position] from [School]. I am interested in your program at ${coach.school}.%0A%0APlease find my AthlynX profile at: athlynx.ai/athlete/[your-id]%0A%0AThank you for your time.`}
                    className="flex-1"
                  >
                    <button
                      onClick={() => setContactedCoach(coach.name)}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black py-2.5 rounded-xl text-xs hover:opacity-90 transition-all"
                    >
                      📧 Contact Coach
                    </button>
                  </a>
                  <a href={`tel:${coach.phone}`} className="px-4 py-2.5 bg-blue-900/30 border border-blue-700 text-blue-400 rounded-xl text-xs font-black hover:bg-blue-900/50 transition-all">
                    📞
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SCHOOLS TAB */}
        {activeTab === "schools" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-white/30 text-sm">🔍</span>
                <input
                  value={searchSchool}
                  onChange={e => setSearchSchool(e.target.value)}
                  placeholder="Search schools..."
                  className="w-full bg-[#0d1b3e] border border-blue-800 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <select
                value={selectedSport}
                onChange={e => setSelectedSport(e.target.value)}
                className="bg-[#0d1b3e] border border-blue-800 text-blue-400 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
              >
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSchools.map((school, i) => (
                <div key={i} className={`bg-gradient-to-br ${school.color} rounded-2xl border border-white/10 p-4 hover:border-white/30 transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{school.logo}</span>
                      <div>
                        <div className="text-white font-black text-sm">{school.name}</div>
                        <div className="text-white/60 text-xs">{school.conference} · {school.division}</div>
                      </div>
                    </div>
                    <span className="bg-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      #{school.ranking} {school.sport}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-black/20 rounded-xl p-2 text-center">
                      <div className="text-white font-black text-sm">{school.scholarships}</div>
                      <div className="text-white/50 text-[9px]">Scholarships</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-2 text-center">
                      <div className="text-white font-black text-sm">{school.avgGPA}</div>
                      <div className="text-white/50 text-[9px]">Avg GPA</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-2 text-center">
                      <div className="text-white font-black text-sm">{school.state}</div>
                      <div className="text-white/50 text-[9px]">State</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Added ${school.name} to your recruiting list!`)}
                    className="w-full mt-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black py-2 rounded-xl text-xs transition-all"
                  >
                    + Add to My List
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div className="space-y-3">
            <h2 className="text-white font-black text-base">Recruiting Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-800" />
              <div className="space-y-4 pl-10">
                {TIMELINE_EVENTS.map((event, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 w-4 h-4 rounded-full bg-[#0d1b3e] border-2 border-blue-600 flex items-center justify-center text-[10px]">
                      {event.icon}
                    </div>
                    <div className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold ${event.color}`}>{event.event}</span>
                      </div>
                      <div className="text-blue-500 text-xs">{event.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ELIGIBILITY TAB */}
        {activeTab === "eligibility" && (
          <div className="space-y-4">
            <h2 className="text-white font-black text-base">NCAA Eligibility Checker</h2>
            {[
              { label: "Academic Eligibility", status: "eligible", desc: "GPA 3.4 · 16 core courses completed · On track for graduation", icon: "📚" },
              { label: "Athletic Eligibility", status: "eligible", desc: "4 years remaining · No transfer portal entries · Amateur status confirmed", icon: "🏆" },
              { label: "NIL Compliance", status: "eligible", desc: "All NIL deals reported · No agent violations · Compliant with state law", icon: "💰" },
              { label: "Transfer Portal Status", status: "not-entered", desc: "Not currently in transfer portal · Eligible to enter at any time", icon: "🔄" },
              { label: "Amateurism Status", status: "eligible", desc: "Amateur status confirmed by NCAA · No professional contracts", icon: "✅" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-black text-sm">{item.label}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        item.status === "eligible" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        item.status === "not-entered" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                        "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>
                        {item.status === "eligible" ? "✅ ELIGIBLE" : item.status === "not-entered" ? "ℹ️ N/A" : "⚠️ REVIEW"}
                      </span>
                    </div>
                    <p className="text-blue-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl border border-cyan-700/30 p-4 text-center">
              <div className="text-2xl mb-2">⚖️</div>
              <h3 className="text-white font-black text-sm mb-1">Need Legal Guidance?</h3>
              <p className="text-blue-300 text-xs mb-3">Our AI attorney can review your eligibility, NIL contracts, and transfer options.</p>
              <Link href="/athlete-legal-hub">
                <button className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl text-xs hover:opacity-90 transition-all">
                  Open Legal & Deals Hub →
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function RecruitingHub() {
  return <RouteErrorBoundary><RecruitingHubInner /></RouteErrorBoundary>;
}
