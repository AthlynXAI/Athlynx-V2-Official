import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { useLocation } from "wouter";
import {
  Search, Filter, Star, MapPin, Phone, Mail, ExternalLink,
  Award, Shield, DollarSign, Users, ChevronRight, Handshake,
  CheckCircle, Zap, Calendar, ArrowRight, Trophy, Target,
  FileText, TrendingUp, Globe
} from "lucide-react";

const SPORTS = ["All Sports", "Football", "Basketball", "Baseball", "Soccer", "Track & Field", "Tennis", "Golf", "Swimming", "Volleyball", "Softball", "Wrestling"];

const AGENT_TYPES = [
  { id: "all", label: "All Agents" },
  { id: "nfl", label: "NFL Certified" },
  { id: "nba", label: "NBA Certified" },
  { id: "mlb", label: "MLB Certified" },
  { id: "nil", label: "NIL Specialists" },
  { id: "headhunter", label: "Headhunters" }
];

const AGENTS = [
  {
    id: 1,
    name: "Marcus Thompson",
    firm: "Elite Sports Management",
    type: "nfl",
    sports: ["Football"],
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 127,
    clients: 34,
    deals: "$142M",
    certified: ["NFLPA", "NIL"],
    specialties: ["Contract Negotiation", "NIL Deals", "Endorsements", "Free Agency"],
    bio: "Former NFL player turned agent with 15 years of experience. Specializes in offensive linemen and skill positions. Has negotiated over $142M in contracts.",
    available: true,
    featured: true,
    responseTime: "< 2 hours"
  },
  {
    id: 2,
    name: "Keisha Williams",
    firm: "Williams Sports Group",
    type: "nba",
    sports: ["Basketball"],
    location: "Atlanta, GA",
    rating: 4.8,
    reviews: 89,
    clients: 22,
    deals: "$89M",
    certified: ["NBPA", "WNBA", "NIL"],
    specialties: ["NBA Draft Prep", "Overseas Contracts", "NIL Maximization", "Brand Building"],
    bio: "Top female sports agent specializing in basketball. Represents players from high school through professional leagues worldwide.",
    available: true,
    featured: true,
    responseTime: "< 4 hours"
  },
  {
    id: 3,
    name: "David Chen",
    firm: "Pacific Rim Sports",
    type: "mlb",
    sports: ["Baseball"],
    location: "Seattle, WA",
    rating: 4.7,
    reviews: 64,
    clients: 18,
    deals: "$67M",
    certified: ["MLBPA", "NIL"],
    specialties: ["MLB Draft", "International Signings", "Arbitration", "NIL for Prospects"],
    bio: "Bilingual agent (English/Mandarin) specializing in MLB and international baseball. Expert in Pacific Rim player development.",
    available: true,
    featured: false,
    responseTime: "< 6 hours"
  },
  {
    id: 4,
    name: "Jordan Rivera",
    firm: "NIL Nation Agency",
    type: "nil",
    sports: ["Football", "Basketball", "Baseball", "Soccer"],
    location: "Miami, FL",
    rating: 4.9,
    reviews: 203,
    clients: 87,
    deals: "$8.4M NIL",
    certified: ["NIL Specialist", "NFLPA"],
    specialties: ["NIL Deal Structuring", "Brand Partnerships", "Social Media Monetization", "Collective Deals"],
    bio: "The #1 NIL specialist in the country. Has structured over $8.4M in NIL deals for college athletes across all sports.",
    available: true,
    featured: true,
    responseTime: "< 1 hour"
  },
  {
    id: 5,
    name: "Tyrone Jackson",
    firm: "Gridiron Elite Agency",
    type: "nfl",
    sports: ["Football"],
    location: "Dallas, TX",
    rating: 4.6,
    reviews: 156,
    clients: 41,
    deals: "$198M",
    certified: ["NFLPA", "NIL"],
    specialties: ["Defensive Players", "Contract Extensions", "Holdout Strategy", "Post-Career Planning"],
    bio: "25-year veteran agent with deep relationships at every NFL team. Specializes in defensive players and high-stakes contract negotiations.",
    available: false,
    featured: false,
    responseTime: "< 24 hours"
  },
  {
    id: 6,
    name: "Sarah Mitchell",
    firm: "Mitchell Headhunters",
    type: "headhunter",
    sports: ["Football", "Basketball", "Soccer", "Track & Field"],
    location: "New York, NY",
    rating: 4.8,
    reviews: 91,
    clients: 156,
    deals: "2,400+ Placements",
    certified: ["Certified Headhunter", "NIL"],
    specialties: ["Corporate Placements", "NIL Job Matching", "Brand Ambassador Deals", "Media Appearances"],
    bio: "Top sports headhunter connecting athletes with brands, media companies, and corporate partners. Think Indeed — but for athletes.",
    available: true,
    featured: true,
    responseTime: "< 2 hours"
  }
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Your Profile", desc: "Tell us your sport, level, goals, and what you need from an agent." },
  { step: "02", title: "Get Matched", desc: "Our AI matches you with certified agents who specialize in your sport and situation." },
  { step: "03", title: "Schedule Consultations", desc: "Book free 30-minute calls with your top matches via Calendly." },
  { step: "04", title: "Sign & Win", desc: "Choose your agent, sign your representation agreement, and let them go to work." }
];

function AgentFinderInner() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [selectedType, setSelectedType] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filtered = AGENTS.filter(a => {
    const matchSearch = search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.firm.toLowerCase().includes(search.toLowerCase()) || a.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchSport = selectedSport === "All Sports" || a.sports.includes(selectedSport);
    const matchType = selectedType === "all" || a.type === selectedType;
    const matchAvail = !showAvailableOnly || a.available;
    return matchSearch && matchSport && matchType && matchAvail;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2">
              <Handshake className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-semibold">AthlynX AGENT FINDER</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-center mb-3">
            Find Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Sports Agent</span>
          </h1>
          <p className="text-slate-300 text-center text-lg max-w-2xl mx-auto mb-8">
            NFLPA, NBPA, MLBPA certified agents and NIL specialists. Find the right rep to negotiate your contracts, maximize your NIL, and protect your career.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            {[
              { value: "2,400+", label: "Certified Agents" },
              { value: "$2.1B+", label: "Total Deals Negotiated" },
              { value: "All", label: "Major Sports Leagues" },
              { value: "Free", label: "Initial Consultation" }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-blue-400">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search agents, firms, or specialties..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>
            <select
              value={selectedSport}
              onChange={e => setSelectedSport(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400"
            >
              {SPORTS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {AGENT_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedType === t.id ? "bg-blue-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              className={`ml-auto px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${showAvailableOnly ? "bg-green-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
            >
              <CheckCircle className="w-3 h-3" />
              Available Now
            </button>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-400 text-sm">{filtered.length} agents found</p>
          <button
            onClick={() => navigate("/nil-jobs")}
            className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            View NIL Jobs Board <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(agent => (
            <div key={agent.id} className={`bg-white/5 border rounded-2xl p-6 hover:bg-white/10 transition-all ${agent.featured ? "border-blue-400/40" : "border-white/10"}`}>
              {agent.featured && (
                <div className="flex items-center gap-1 text-xs text-blue-300 font-semibold mb-3">
                  <Star className="w-3 h-3 fill-[#1E90FF]" />
                  FEATURED AGENT
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white">{agent.name}</h3>
                  <p className="text-blue-400 text-sm font-semibold">{agent.firm}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400 text-xs">{agent.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${agent.available ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.available ? "bg-green-400" : "bg-slate-400"}`} />
                    {agent.available ? "Available" : "Busy"}
                  </div>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <Star className="w-3 h-3 text-blue-300 fill-[#1E90FF]" />
                    <span className="text-white text-sm font-bold">{agent.rating}</span>
                    <span className="text-slate-400 text-xs">({agent.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-sm font-black text-blue-400">{agent.clients}</div>
                  <div className="text-xs text-slate-400">Clients</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-sm font-black text-green-400">{agent.deals}</div>
                  <div className="text-xs text-slate-400">Negotiated</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-xs font-black text-blue-300">{agent.responseTime}</div>
                  <div className="text-xs text-slate-400">Response</div>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.certified.map((c, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                    <Shield className="w-2.5 h-2.5" />
                    {c}
                  </span>
                ))}
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4">{agent.bio}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.specialties.map((s, i) => (
                  <span key={i} className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                  <Calendar className="w-4 h-4" />
                  Book Free Call
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
                  <Mail className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-black text-white text-center mb-8">How Agent Finder Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-3xl font-black text-blue-400/40 mb-2">{step.step}</div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Are You an Agent CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-400/20 rounded-2xl p-6 sm:p-8 text-center">
          <Handshake className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-white mb-2">Are You a Certified Sports Agent?</h3>
          <p className="text-slate-400 text-sm mb-4 max-w-xl mx-auto">
            Join the AthlynX Agent Network and get matched with athletes who need your expertise. 
            Access our full database of prospects, NIL opportunities, and recruiting intelligence.
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
            Apply to Join the Network
          </button>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function AgentFinder() {
  return <RouteErrorBoundary><AgentFinderInner /></RouteErrorBoundary>;
}
