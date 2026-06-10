import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from '@/components/MobileBottomNav'
import PlatformLayout from "@/components/PlatformLayout";
import {
  Trophy, Star, Zap, Users, MapPin, Calendar, Clock, Filter,
  ChevronRight, ExternalLink, Search, Flame, Shield, Award,
  Target, Globe, TrendingUp, Bell, BookOpen, Dumbbell,
} from "lucide-react";

type SportType = "Football" | "Basketball" | "Baseball" | "Soccer" | "Track" | "Multi-Sport" | "All";
type EventCategory =
  | "7v7 Tournament"
  | "Elite Camp"
  | "All-Star Game"
  | "Combine"
  | "Showcase"
  | "Tournament"
  | "Invitational"
  | "Clinic";

interface EliteEvent {
  id: number;
  name: string;
  category: EventCategory;
  sport: SportType;
  date: string;
  location: string;
  state: string;
  tier: "National" | "Regional" | "State";
  ageGroups: string[];
  description: string;
  registrationOpen: boolean;
  featured: boolean;
  spots?: number;
  spotsLeft?: number;
  price?: string;
  url?: string;
  organizer: string;
  scoutsAttending?: boolean;
}

const EVENTS: EliteEvent[] = [
  //  FOOTBALL 
  {
    id: 1, name: "Elite 11 QB Competition", category: "Elite Camp", sport: "Football",
    date: "2026-06-15", location: "Los Angeles, CA", state: "CA", tier: "National",
    ageGroups: ["Class 2027", "Class 2028"], description: "The nation's most prestigious quarterback competition. Top QBs compete for the coveted Elite 11 jersey in front of college coaches and NFL scouts.",
    registrationOpen: true, featured: true, spots: 11, spotsLeft: 3, price: "$0 (Invite Only)", organizer: "Elite 11", scoutsAttending: true,
  },
  {
    id: 2, name: "Under Armour All-America Game", category: "All-Star Game", sport: "Football",
    date: "2027-01-02", location: "Orlando, FL", state: "FL", tier: "National",
    ageGroups: ["Class 2027"], description: "The premier high school all-star football game featuring the nation's top 90 seniors. Nationally televised on ESPN.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "Under Armour", scoutsAttending: true,
  },
  {
    id: 3, name: "All-American Bowl", category: "All-Star Game", sport: "Football",
    date: "2027-01-11", location: "San Antonio, TX", state: "TX", tier: "National",
    ageGroups: ["Class 2027"], description: "NBC's All-American Bowl — the most-watched high school all-star game in history. 100 of the nation's top seniors.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "NBC Sports / All-American Bowl", scoutsAttending: true,
  },
  {
    id: 4, name: "The Opening — Nike Football", category: "Elite Camp", sport: "Football",
    date: "2026-07-04", location: "Beaverton, OR", state: "OR", tier: "National",
    ageGroups: ["Class 2027", "Class 2028"], description: "Nike's flagship football camp. Top 166 prospects compete in 7v7, 1-on-1s, and skill competitions in front of every major college program.",
    registrationOpen: true, featured: true, price: "Invite Only", organizer: "Nike / The Opening", scoutsAttending: true,
  },
  {
    id: 5, name: "Rivals Camp Series — Dallas", category: "Elite Camp", sport: "Football",
    date: "2026-05-10", location: "Dallas, TX", state: "TX", tier: "Regional",
    ageGroups: ["Class 2027", "Class 2028", "Class 2029"], description: "Rivals.com's nationally recognized camp series. Top performers earn invites to the Five-Star Challenge.",
    registrationOpen: true, featured: false, spots: 300, spotsLeft: 87, price: "$99", organizer: "Rivals.com", scoutsAttending: true,
  },
  {
    id: 6, name: "247Sports Showcase — Houston", category: "Showcase", sport: "Football",
    date: "2026-05-17", location: "Houston, TX", state: "TX", tier: "Regional",
    ageGroups: ["Class 2027", "Class 2028", "Class 2029"], description: "247Sports showcase with live recruiting coverage. Top performers get featured on 247Sports recruiting boards.",
    registrationOpen: true, featured: false, price: "$79", organizer: "247Sports", scoutsAttending: true,
  },
  {
    id: 7, name: "National 7v7 Championships", category: "7v7 Tournament", sport: "Football",
    date: "2026-07-14", location: "Las Vegas, NV", state: "NV", tier: "National",
    ageGroups: ["14U", "15U", "16U", "17U", "18U"], description: "The largest 7v7 tournament in the country. 500+ teams compete for national championships across 5 age divisions.",
    registrationOpen: true, featured: true, spots: 512, spotsLeft: 124, price: "$450/team", organizer: "National 7v7", scoutsAttending: true,
  },
  {
    id: 8, name: "Pylon 7v7 National Tournament", category: "7v7 Tournament", sport: "Football",
    date: "2026-06-28", location: "Atlanta, GA", state: "GA", tier: "National",
    ageGroups: ["14U", "16U", "18U"], description: "Pylon's flagship 7v7 event. Elite teams from across the country compete in a bracket-style tournament with college coaches watching.",
    registrationOpen: true, featured: true, price: "$395/team", organizer: "Pylon", scoutsAttending: true,
  },
  {
    id: 9, name: "Texas 7v7 State Championship", category: "7v7 Tournament", sport: "Football",
    date: "2026-06-07", location: "Round Rock, TX", state: "TX", tier: "State",
    ageGroups: ["14U", "15U", "16U", "17U", "18U"], description: "The official Texas 7v7 state championship. Qualifying teams compete for the state title.",
    registrationOpen: true, featured: false, price: "$350/team", organizer: "Texas 7v7 Association",
  },
  {
    id: 10, name: "NFL Regional Combine", category: "Combine", sport: "Football",
    date: "2026-05-31", location: "Nashville, TN", state: "TN", tier: "Regional",
    ageGroups: ["Class 2027"], description: "NFL-style regional combine for top senior prospects. 40-yard dash, bench press, vertical jump, broad jump, 3-cone, shuttle. Top performers advance to national combine.",
    registrationOpen: true, featured: false, price: "$149", organizer: "NFL / NFLPA", scoutsAttending: true,
  },
  {
    id: 11, name: "Five-Star Challenge", category: "Elite Camp", sport: "Football",
    date: "2026-06-22", location: "Athens, GA", state: "GA", tier: "National",
    ageGroups: ["Class 2027"], description: "Rivals.com's premier event for the nation's top 5-star and 4-star prospects. Head-to-head competition in front of every Power 4 coaching staff.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "Rivals.com", scoutsAttending: true,
  },
  {
    id: 12, name: "Polynesian Bowl", category: "All-Star Game", sport: "Football",
    date: "2027-01-20", location: "Honolulu, HI", state: "HI", tier: "National",
    ageGroups: ["Class 2027"], description: "Celebrating Polynesian culture and football excellence. Top Polynesian and Pacific Islander prospects compete in this nationally recognized all-star game.",
    registrationOpen: false, featured: false, price: "Invite Only", organizer: "Polynesian Football Hall of Fame",
  },

  //  BASKETBALL 
  {
    id: 13, name: "Nike EYBL Peach Jam", category: "Tournament", sport: "Basketball",
    date: "2026-07-08", location: "North Augusta, SC", state: "SC", tier: "National",
    ageGroups: ["16U", "17U"], description: "The most prestigious grassroots basketball tournament in the world. Every Division I coach in the country attends. Nike Elite Youth Basketball League championship event.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "Nike EYBL", scoutsAttending: true,
  },
  {
    id: 14, name: "Adidas 3SSB Championship", category: "Tournament", sport: "Basketball",
    date: "2026-07-15", location: "Las Vegas, NV", state: "NV", tier: "National",
    ageGroups: ["15U", "16U", "17U"], description: "Adidas 3 Stripes Select Basketball championship. Top Adidas-sponsored programs compete for national titles in front of college coaches.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "Adidas 3SSB", scoutsAttending: true,
  },
  {
    id: 15, name: "McDonald's All-American Game", category: "All-Star Game", sport: "Basketball",
    date: "2027-03-25", location: "Houston, TX", state: "TX", tier: "National",
    ageGroups: ["Class 2027"], description: "The most prestigious high school basketball all-star game. 24 of the nation's top seniors compete in front of a national TV audience.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "McDonald's", scoutsAttending: true,
  },
  {
    id: 16, name: "Jordan Brand Classic", category: "All-Star Game", sport: "Basketball",
    date: "2027-04-12", location: "New York, NY", state: "NY", tier: "National",
    ageGroups: ["Class 2027"], description: "Jordan Brand's elite all-star showcase. Top prospects compete in the Jordan Brand Classic at Barclays Center.",
    registrationOpen: false, featured: false, price: "Invite Only", organizer: "Jordan Brand",
  },
  {
    id: 17, name: "Pangos All-American Camp", category: "Elite Camp", sport: "Basketball",
    date: "2026-06-05", location: "Los Angeles, CA", state: "CA", tier: "National",
    ageGroups: ["Class 2027", "Class 2028", "Class 2029"], description: "One of the most respected basketball camps in the country. Top performers earn All-American honors and major recruiting attention.",
    registrationOpen: true, featured: false, price: "$299", organizer: "Pangos Basketball", scoutsAttending: true,
  },
  {
    id: 18, name: "UAA Summer Championships", category: "Tournament", sport: "Basketball",
    date: "2026-07-22", location: "Memphis, TN", state: "TN", tier: "National",
    ageGroups: ["15U", "16U", "17U"], description: "Under Armour Association championship tournament. Elite AAU programs compete for national titles.",
    registrationOpen: false, featured: false, price: "Invite Only", organizer: "Under Armour Association",
  },

  //  BASEBALL 
  {
    id: 19, name: "Perfect Game National Showcase", category: "Showcase", sport: "Baseball",
    date: "2026-06-18", location: "Fort Myers, FL", state: "FL", tier: "National",
    ageGroups: ["Class 2027", "Class 2028"], description: "The nation's premier baseball showcase. Every MLB team and top college program sends scouts. The most important event for high school baseball prospects.",
    registrationOpen: true, featured: true, price: "$599", organizer: "Perfect Game", scoutsAttending: true,
  },
  {
    id: 20, name: "Area Code Baseball Games", category: "All-Star Game", sport: "Baseball",
    date: "2026-08-05", location: "Long Beach, CA", state: "CA", tier: "National",
    ageGroups: ["Class 2027"], description: "MLB-sponsored all-star showcase. Top prospects from each MLB team's area compete in front of every MLB scouting department.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "MLB / Area Code Baseball", scoutsAttending: true,
  },
  {
    id: 21, name: "Under Armour All-America Baseball Game", category: "All-Star Game", sport: "Baseball",
    date: "2026-08-15", location: "Petco Park, San Diego, CA", state: "CA", tier: "National",
    ageGroups: ["Class 2027"], description: "The premier high school baseball all-star game played in a Major League stadium. Top 50 seniors nationwide.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "Under Armour", scoutsAttending: true,
  },
  {
    id: 22, name: "Perfect Game All-American Classic", category: "All-Star Game", sport: "Baseball",
    date: "2026-08-10", location: "Petco Park, San Diego, CA", state: "CA", tier: "National",
    ageGroups: ["Class 2027"], description: "Perfect Game's flagship all-star game at a Major League stadium. The most prestigious high school baseball all-star event.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "Perfect Game", scoutsAttending: true,
  },

  //  SOCCER 
  {
    id: 23, name: "US Soccer Development Academy Showcase", category: "Showcase", sport: "Soccer",
    date: "2026-06-25", location: "Frisco, TX", state: "TX", tier: "National",
    ageGroups: ["U15", "U16", "U17", "U18/19"], description: "US Soccer's elite development showcase. Top DA club teams compete in front of US Soccer national team staff and college coaches.",
    registrationOpen: false, featured: true, price: "Invite Only", organizer: "US Soccer", scoutsAttending: true,
  },
  {
    id: 24, name: "Generation Adidas Cup", category: "Tournament", sport: "Soccer",
    date: "2026-07-20", location: "Kansas City, MO", state: "MO", tier: "National",
    ageGroups: ["U15", "U16", "U17"], description: "MLS's premier youth soccer tournament. Top youth academy teams from across the country compete for national titles.",
    registrationOpen: false, featured: false, price: "Invite Only", organizer: "MLS / Generation Adidas",
  },

  //  TRACK 
  {
    id: 25, name: "New Balance Nationals Outdoor", category: "Tournament", sport: "Track",
    date: "2026-06-19", location: "Philadelphia, PA", state: "PA", tier: "National",
    ageGroups: ["Class 2027", "Class 2028", "Class 2029", "Class 2030"], description: "The premier high school outdoor track & field national championship. Top athletes from every state compete for national titles across all events.",
    registrationOpen: true, featured: true, price: "$89/event", organizer: "New Balance", scoutsAttending: true,
  },
  {
    id: 26, name: "Brooks PR Invitational", category: "Invitational", sport: "Track",
    date: "2026-05-23", location: "Seattle, WA", state: "WA", tier: "National",
    ageGroups: ["Class 2027", "Class 2028"], description: "One of the most prestigious invitational track meets in the country. Top distance runners compete for national recognition.",
    registrationOpen: true, featured: false, price: "$45/event", organizer: "Brooks Running",
  },

  //  MULTI-SPORT 
  {
    id: 27, name: "AthlynX Elite Combine", category: "Combine", sport: "Multi-Sport",
    date: "2026-08-01", location: "Houston, TX", state: "TX", tier: "National",
    ageGroups: ["14U", "15U", "16U", "17U", "18U"], description: "AthlynX's flagship multi-sport combine. Athletes across all sports get measured, filmed, and profiled. Results go directly to college coaches and pro scouts on the AthlynX platform.",
    registrationOpen: true, featured: true, spots: 500, spotsLeft: 312, price: "$149", organizer: "AthlynXAI", scoutsAttending: true,
  },
  {
    id: 28, name: "IMG Academy Prospect Camp", category: "Elite Camp", sport: "Multi-Sport",
    date: "2026-06-10", location: "Bradenton, FL", state: "FL", tier: "National",
    ageGroups: ["Class 2027", "Class 2028", "Class 2029"], description: "IMG Academy's world-renowned prospect camp. Athletes train with elite coaches and compete in front of college recruiters across multiple sports.",
    registrationOpen: true, featured: true, price: "$1,299", organizer: "IMG Academy", scoutsAttending: true,
  },
  {
    id: 29, name: "Sports Illustrated All-American Summit", category: "Elite Camp", sport: "Multi-Sport",
    date: "2026-07-28", location: "Miami, FL", state: "FL", tier: "National",
    ageGroups: ["Class 2027", "Class 2028"], description: "Sports Illustrated's premier multi-sport showcase and summit. Top prospects across all sports compete and connect with brands, agents, and college programs.",
    registrationOpen: true, featured: false, price: "$199", organizer: "Sports Illustrated", scoutsAttending: true,
  },
  {
    id: 30, name: "HBCU Combine & Showcase", category: "Combine", sport: "Multi-Sport",
    date: "2026-05-24", location: "Atlanta, GA", state: "GA", tier: "National",
    ageGroups: ["Class 2027", "Class 2028"], description: "The premier showcase connecting top prospects with HBCU programs. Athletes are evaluated by coaches from every major HBCU across football, basketball, baseball, and track.",
    registrationOpen: true, featured: true, spots: 400, spotsLeft: 156, price: "$99", organizer: "HBCU Combine", scoutsAttending: true,
  },
];

const CATEGORY_COLORS: Record<EventCategory, { bg: string; border: string; text: string; badge: string }> = {
  "7v7 Tournament": { bg: "bg-[#1E90FF]/30",    border: "border-[#1E90FF]/40",    text: "text-[#1E90FF]",    badge: "bg-[#1E90FF]" },
  "Elite Camp":     { bg: "bg-blue-900/30",   border: "border-blue-500/40",   text: "text-blue-300",   badge: "bg-blue-600" },
  "All-Star Game":  { bg: "bg-blue-900/30", border: "border-blue-500/40", text: "text-[#00C2FF]", badge: "bg-blue-600" },
  "Combine":        { bg: "bg-[#00C2FF]/30",  border: "border-[#00C2FF]/40",  text: "text-[#00C2FF]",  badge: "bg-[#00C2FF]" },
  "Showcase":       { bg: "bg-[#1E90FF]/30", border: "border-[#1E90FF]/40", text: "text-[#1E90FF]", badge: "bg-[#1E90FF]" },
  "Tournament":     { bg: "bg-[#1E90FF]/20",   border: "border-[#1E90FF]/30",   text: "text-[#00C2FF]",   badge: "bg-[#1565C0]" },
  "Invitational":   { bg: "bg-[#1E90FF]/20", border: "border-[#1E90FF]/30", text: "text-[#00C2FF]", badge: "bg-[#1565C0]" },
  "Clinic":         { bg: "bg-slate-800/60",  border: "border-slate-600/40",  text: "text-slate-300",  badge: "bg-slate-600" },
};

const TIER_BADGE: Record<string, string> = {
  National: "bg-blue-500/20 border border-blue-500/40 text-[#00C2FF]",
  Regional: "bg-blue-500/20 border border-blue-500/40 text-blue-300",
  State:    "bg-[#00C2FF]/20 border border-[#00C2FF]/40 text-[#00C2FF]",
};

const SPORT_ICONS: Record<string, React.ElementType> = {
  Football:    Trophy,
  Basketball:  Flame,
  Baseball:    Target,
  Soccer:      Globe,
  Track:       Zap,
  "Multi-Sport": Star,
};

const SPORTS: SportType[] = ["All", "Football", "Basketball", "Baseball", "Soccer", "Track", "Multi-Sport"];
const CATEGORIES: (EventCategory | "All")[] = [
  "All", "7v7 Tournament", "Elite Camp", "All-Star Game", "Combine", "Showcase", "Tournament", "Invitational",
];

function EliteEventsInner() {
  const [sportFilter, setSportFilter] = useState<SportType | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "All">("All");
  const [tierFilter, setTierFilter] = useState<"All" | "National" | "Regional" | "State">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showScoutsOnly, setShowScoutsOnly] = useState(false);

  const filtered = EVENTS.filter(e => {
    if (sportFilter !== "All" && e.sport !== sportFilter) return false;
    if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
    if (tierFilter !== "All" && e.tier !== tierFilter) return false;
    if (showOpenOnly && !e.registrationOpen) return false;
    if (showScoutsOnly && !e.scoutsAttending) return false;
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !e.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !e.organizer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featured = filtered.filter(e => e.featured);
  const regular = filtered.filter(e => !e.featured);

  return (
    <PlatformLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 px-2">

        {/*  Hero Header  */}
        <div className="bg-gradient-to-r from-[#0d1b3e] via-[#1a3a8f] to-[#0d1b3e] border border-blue-700 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-[#0a1628] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-500/20 border border-blue-500/40 text-[#00C2FF] text-xs font-bold px-2 py-0.5 rounded-full">ELITE EVENTS</span>
                  <span className="bg-[#1E90FF]/20 border border-[#1E90FF]/40 text-[#1E90FF] text-xs font-bold px-2 py-0.5 rounded-full">∞ INFINITY</span>
                </div>
                <h1 className="text-3xl font-black text-white">Elite Camps, Tournaments & All-Stars</h1>
                <p className="text-blue-300 text-sm mt-1">7v7 · Elite 11 · All-American Games · Combines · Showcases · Invitationals</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
                <Bell className="w-4 h-4" /> Get Alerts
              </button>
              <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
                <BookOpen className="w-4 h-4" /> My Events
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Events", value: `${EVENTS.length}+`, icon: Trophy },
              { label: "Sports Covered", value: "6+", icon: Dumbbell },
              { label: "Scouts Attending", value: `${EVENTS.filter(e => e.scoutsAttending).length}`, icon: Shield },
              { label: "Open Registration", value: `${EVENTS.filter(e => e.registrationOpen).length}`, icon: TrendingUp },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <s.icon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-white font-black text-xl">{s.value}</div>
                <div className="text-blue-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/*  Search + Filters  */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events, locations, organizers..."
              className="w-full bg-slate-900/60 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Sport Filter */}
          <div>
            <div className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Sport</div>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(s => {
                const Icon = s !== "All" ? SPORT_ICONS[s] : Filter;
                return (
                  <button
                    key={s}
                    onClick={() => setSportFilter(s)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      sportFilter === s ? "bg-blue-600 text-white" : "bg-slate-900/60 text-slate-400 border border-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">Event Type</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c as EventCategory | "All")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === c ? "bg-[#1565C0] text-white" : "bg-slate-900/60 text-slate-400 border border-slate-700 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Tier + Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {(["All", "National", "Regional", "State"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    tierFilter === t ? "bg-blue-600 text-white" : "bg-slate-900/60 text-slate-400 border border-slate-700 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-3 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setShowOpenOnly(!showOpenOnly)}
                  className={`w-9 h-5 rounded-full transition-all relative ${showOpenOnly ? "bg-[#00C2FF]" : "bg-slate-700"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${showOpenOnly ? "left-4" : "left-0.5"}`} />
                </div>
                <span className="text-slate-400 text-xs">Open Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setShowScoutsOnly(!showScoutsOnly)}
                  className={`w-9 h-5 rounded-full transition-all relative ${showScoutsOnly ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${showScoutsOnly ? "left-4" : "left-0.5"}`} />
                </div>
                <span className="text-slate-400 text-xs">Scouts Attending</span>
              </label>
            </div>
          </div>
        </div>

        {/*  Results Count  */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">
            Showing <span className="text-white font-bold">{filtered.length}</span> events
          </div>
          <div className="text-slate-500 text-xs">Sorted by date</div>
        </div>

        {/*  Featured Events  */}
        {featured.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#00C2FF]" />
              <h2 className="text-white font-black text-lg">Featured Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map(event => <EventCard key={event.id} event={event} featured />)}
            </div>
          </div>
        )}

        {/*  All Events  */}
        {regular.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-white font-black text-lg">All Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {regular.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">No events match your filters.</p>
            <button onClick={() => { setSportFilter("All"); setCategoryFilter("All"); setTierFilter("All"); setSearchQuery(""); }}
              className="mt-3 text-blue-400 hover:text-white text-sm transition-colors">
              Clear all filters
            </button>
          </div>
        )}

        {/*  Host Your Event CTA  */}
        <div className="bg-gradient-to-r from-[#1a3a8f]/60 to-slate-800/60 border border-blue-700/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-black text-lg">Host an Elite Event on AthlynX</h3>
            <p className="text-slate-400 text-sm mt-1">List your camp, tournament, combine, or showcase and reach thousands of athletes and families on the AthlynX platform.</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-[#0a1628] hover:from-blue-500 hover:to-[#0a1628] text-white font-black px-6 py-3 rounded-xl text-sm transition-all whitespace-nowrap flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> List Your Event
          </button>
        </div>

      </div>
    </PlatformLayout>
  );
}

//  Event Card Component 
function EventCard({ event, featured }: { event: EliteEvent; featured?: boolean }) {
  const colors = CATEGORY_COLORS[event.category];
  const Icon = SPORT_ICONS[event.sport] || Trophy;
  const spotsPercent = event.spots && event.spotsLeft ? Math.round(((event.spots - event.spotsLeft) / event.spots) * 100) : null;

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-2xl p-4 flex flex-col gap-3 hover:scale-[1.01] transition-all ${featured ? "ring-1 ring-blue-500/20" : ""}`}>
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              {featured && <Star className="w-3 h-3 text-[#00C2FF] shrink-0" />}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge} text-white`}>{event.category}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_BADGE[event.tier]}`}>{event.tier}</span>
            </div>
            <h3 className="text-white font-black text-sm leading-tight">{event.name}</h3>
          </div>
        </div>
        {event.scoutsAttending && (
          <div className="shrink-0 bg-[#00C2FF]/20 border border-[#00C2FF]/40 rounded-lg px-2 py-1">
            <div className="text-[#00C2FF] text-xs font-bold whitespace-nowrap">Scouts </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          {new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <MapPin className="w-3.5 h-3.5 shrink-0" /> {event.location}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Users className="w-3.5 h-3.5 shrink-0" /> {event.ageGroups.join(" · ")}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{event.description}</p>

      {/* Spots Bar */}
      {spotsPercent !== null && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">{event.spotsLeft} spots left</span>
            <span className={`font-bold ${spotsPercent >= 80 ? "text-[#1E90FF]" : spotsPercent >= 50 ? "text-[#00C2FF]" : "text-[#00C2FF]"}`}>{spotsPercent}% full</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${spotsPercent >= 80 ? "bg-[#1E90FF]" : spotsPercent >= 50 ? "bg-blue-500" : "bg-[#00C2FF]"}`}
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">{event.organizer}</span>
          {event.price && <span className={`text-xs font-bold ${event.price === "Invite Only" ? "text-[#00C2FF]" : "text-[#00C2FF]"}`}>{event.price}</span>}
        </div>
        <button
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            event.registrationOpen
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-slate-700 text-slate-400 cursor-default"
          }`}
        >
          {event.registrationOpen ? (<><span>Register</span><ChevronRight className="w-3 h-3" /></>) : "Invite Only"}
        </button>
      </div>
      <MobileBottomNav />
    </div>
  );
}

//  Plus icon for CTA 
function Plus({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
}

export default function EliteEvents() {
  return <RouteErrorBoundary><EliteEventsInner /></RouteErrorBoundary>;
}
