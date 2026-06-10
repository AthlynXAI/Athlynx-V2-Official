import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import { Briefcase, Star, TrendingUp, Search, Filter, ChevronRight, CheckCircle, DollarSign, Users, Zap, Award, ArrowLeft, MapPin, Clock, Building2, Target, BarChart3 } from "lucide-react";

const JOB_LISTINGS = [
  // NIL Deals
  { id: 1, title: "Brand Ambassador — Social Media", company: "Gatorade", logo: "🟡", location: "Remote", pay: "$500–$2,000/mo", type: "NIL Deal", sport: "All Sports", tier: "starter", followers: "1K+", deadline: "May 15", tags: ["Social Media", "Content Creation"], hot: true },
  { id: 2, title: "Local Car Dealership Spokesperson", company: "AutoNation Group", logo: "🚗", location: "Dallas, TX", pay: "$1,000–$5,000", type: "Endorsement", sport: "Football", tier: "rising", followers: "5K+", deadline: "May 20", tags: ["Spokesperson", "Video"], hot: false },
  { id: 3, title: "Youth Football Camp Instructor", company: "Elite Sports Camps", logo: "🏈", location: "Houston, TX", pay: "$75/hr", type: "Training Job", sport: "Football", tier: "starter", followers: "Any", deadline: "June 1", tags: ["Coaching", "Youth"], hot: false },
  { id: 4, title: "Protein Brand Content Creator", company: "Optimum Nutrition", logo: "💪", location: "Remote", pay: "$2,500–$8,000", type: "NIL Deal", sport: "All Sports", tier: "rising", followers: "10K+", deadline: "May 25", tags: ["Nutrition", "Content"], hot: true },
  { id: 5, title: "College Recruiting Analyst", company: "AthlynXAI", logo: "⚡", location: "Remote", pay: "$3,000/mo", type: "Full-Time", sport: "All Sports", tier: "pro", followers: "Any", deadline: "Rolling", tags: ["Analytics", "Recruiting"], hot: true },
  { id: 6, title: "Sports Apparel Model", company: "Under Armour", logo: "🦸", location: "Baltimore, MD", pay: "$5,000–$15,000", type: "Endorsement", sport: "All Sports", tier: "pro", followers: "25K+", deadline: "June 10", tags: ["Modeling", "Apparel"], hot: false },
  { id: 7, title: "Basketball Skills Trainer", company: "Pro Skills Academy", logo: "🏀", location: "Los Angeles, CA", pay: "$50–$150/hr", type: "Training Job", sport: "Basketball", tier: "starter", followers: "Any", deadline: "Rolling", tags: ["Training", "Basketball"], hot: false },
  { id: 8, title: "NIL Podcast Co-Host", company: "The Athlete's Playbook", logo: "🎙️", location: "Remote", pay: "$1,500/episode", type: "Media", sport: "All Sports", tier: "rising", followers: "15K+", deadline: "May 30", tags: ["Podcast", "Media"], hot: true },
  { id: 9, title: "Regional Sports Bank Ambassador", company: "First National Bank", logo: "🏦", location: "Southeast US", pay: "$10,000–$25,000/yr", type: "Endorsement", sport: "All Sports", tier: "elite", followers: "50K+", deadline: "June 15", tags: ["Finance", "Ambassador"], hot: false },
  { id: 10, title: "eSports Content Creator", company: "EA Sports", logo: "🎮", location: "Remote", pay: "$3,000–$12,000", type: "NIL Deal", sport: "All Sports", tier: "rising", followers: "20K+", deadline: "May 28", tags: ["Gaming", "Content"], hot: true },
  { id: 11, title: "Athlete Mentor — High School Program", company: "Boys & Girls Club", logo: "🌟", location: "Nationwide", pay: "$25/hr", type: "Community", sport: "All Sports", tier: "starter", followers: "Any", deadline: "Rolling", tags: ["Mentorship", "Community"], hot: false },
  { id: 12, title: "Golf Equipment Influencer", company: "Callaway Golf", logo: "⛳", location: "Remote", pay: "$8,000–$20,000", type: "Endorsement", sport: "Golf", tier: "elite", followers: "30K+", deadline: "June 5", tags: ["Golf", "Influencer"], hot: false },
  // Headhunter — Elite Placements
  { id: 13, title: "D1 Transfer Portal — Quarterback", company: "AthlynXAI Headhunter", logo: "🏈", location: "Nationwide", pay: "Full Scholarship + NIL", type: "Headhunter", sport: "Football", tier: "pro", followers: "Any", deadline: "Rolling", tags: ["Transfer Portal", "QB", "D1"], hot: true },
  { id: 14, title: "NBA G-League Tryout Placement", company: "AthlynXAI Headhunter", logo: "🏀", location: "Multiple Cities", pay: "$35,000–$125,000/yr", type: "Headhunter", sport: "Basketball", tier: "elite", followers: "Any", deadline: "Rolling", tags: ["Pro Basketball", "G-League"], hot: true },
  { id: 15, title: "MLB Draft Prep — Pitcher Showcase", company: "AthlynXAI Headhunter", logo: "⚾", location: "Houston, TX", pay: "Draft Eligible", type: "Headhunter", sport: "Baseball", tier: "elite", followers: "Any", deadline: "June 1", tags: ["MLB Draft", "Pitcher"], hot: true },
  { id: 16, title: "Nike Athlete Ambassador — Multi-Year", company: "Nike", logo: "✔️", location: "Remote + Events", pay: "$50,000–$500,000/yr", type: "Endorsement", sport: "All Sports", tier: "elite", followers: "100K+", deadline: "Rolling", tags: ["Nike", "Ambassador", "Multi-Year"], hot: true },
  { id: 17, title: "ESPN College GameDay Analyst", company: "ESPN", logo: "📺", location: "Bristol, CT / Remote", pay: "$75,000–$150,000/yr", type: "Media", sport: "Football", tier: "elite", followers: "50K+", deadline: "July 1", tags: ["ESPN", "Analyst", "TV"], hot: false },
  { id: 18, title: "Adidas Signature Shoe Deal", company: "Adidas", logo: "👟", location: "Remote", pay: "$100,000–$2M+", type: "Endorsement", sport: "Basketball", tier: "elite", followers: "500K+", deadline: "Rolling", tags: ["Adidas", "Signature", "Shoe Deal"], hot: true },
  { id: 19, title: "College Head Coach — D2 Football", company: "University Search", logo: "🏫", location: "Southeast US", pay: "$120,000–$200,000/yr", type: "Full-Time", sport: "Football", tier: "elite", followers: "Any", deadline: "June 15", tags: ["Coaching", "Head Coach", "D2"], hot: false },
  { id: 20, title: "Sports Agent — NIL Specialist", company: "AthlynXAI Headhunter", logo: "🤝", location: "Remote", pay: "Commission + Base", type: "Full-Time", sport: "All Sports", tier: "pro", followers: "Any", deadline: "Rolling", tags: ["Agent", "NIL", "Sports Law"], hot: true },
  { id: 21, title: "Rawlings Baseball Brand Partner", company: "Rawlings", logo: "⚾", location: "Remote", pay: "$15,000–$50,000/yr", type: "Endorsement", sport: "Baseball", tier: "rising", followers: "10K+", deadline: "May 31", tags: ["Rawlings", "Baseball", "Equipment"], hot: false },
  { id: 22, title: "Wilson Basketball Ambassador", company: "Wilson Sporting Goods", logo: "🏀", location: "Remote", pay: "$20,000–$75,000/yr", type: "Endorsement", sport: "Basketball", tier: "pro", followers: "25K+", deadline: "June 20", tags: ["Wilson", "Basketball", "Equipment"], hot: false },
  { id: 23, title: "Rogue Fitness Athlete Sponsorship", company: "Rogue Fitness", logo: "🏋️", location: "Remote", pay: "$10,000–$40,000/yr", type: "Endorsement", sport: "All Sports", tier: "rising", followers: "15K+", deadline: "Rolling", tags: ["Rogue", "Fitness", "Strength"], hot: true },
  { id: 24, title: "Theragun Recovery Partner", company: "Hyperice", logo: "💪", location: "Remote", pay: "$5,000–$25,000/yr", type: "Endorsement", sport: "All Sports", tier: "rising", followers: "10K+", deadline: "Rolling", tags: ["Recovery", "Theragun", "Wellness"], hot: false },
];

const TIERS = [
  { id: "all", label: "All Tiers", color: "bg-blue-900/40 text-blue-300 border-blue-700/40" },
  { id: "starter", label: "🌱 Starter", color: "bg-green-900/40 text-green-300 border-green-700/40", desc: "Any follower count, any level" },
  { id: "rising", label: "📈 Rising Star", color: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40", desc: "5K–25K followers" },
  { id: "pro", label: "⭐ Pro", color: "bg-purple-900/40 text-purple-300 border-purple-700/40", desc: "25K–100K followers" },
  { id: "elite", label: "👑 Elite", color: "bg-red-900/40 text-red-300 border-red-700/40", desc: "100K+ followers" },
];

const NIL_SCORE_FACTORS = [
  { label: "Social Following", weight: 25, icon: Users },
  { label: "Athletic Performance", weight: 30, icon: Award },
  { label: "Academic Standing", weight: 15, icon: Star },
  { label: "Brand Engagement", weight: 20, icon: TrendingUp },
  { label: "Market Demand", weight: 10, icon: BarChart3 },
];

const CAREER_LADDER = [
  { tier: "🌱 Starter", range: "$0–$500/mo", req: "Active profile, any sport", color: "border-green-500", active: true },
  { tier: "📈 Rising Star", range: "$500–$5K/mo", req: "1K+ followers, 3+ deals", color: "border-yellow-500", active: false },
  { tier: "⭐ Pro", range: "$5K–$25K/mo", req: "10K+ followers, verified athlete", color: "border-purple-500", active: false },
  { tier: "👑 Elite", range: "$25K–$100K/mo", req: "50K+ followers, D1/Pro athlete", color: "border-red-500", active: false },
  { tier: "💎 Legend", range: "$100K+/mo", req: "Pro contract, national brand deals", color: "border-blue-400", active: false },
];

function NILJobsInner() {
  const [activeTier, setActiveTier] = useState("all");
  const [activeTab, setActiveTab] = useState<"jobs" | "score" | "ladder" | "post">("jobs");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = JOB_LISTINGS.filter(j => {
    const matchesTier = activeTier === "all" || j.tier === activeTier;
    const matchesSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()) || j.sport.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Portal</span>
          </Link>
          <span className="text-xl font-black text-white">AthlynX <span className="text-yellow-400">JOBS</span></span>
          <Link href="/nil-marketplace" className="text-sm text-blue-400 hover:text-white transition-colors">NIL Market →</Link>
        </div>
      </header>

      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Hero */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold mb-4">
              💼 NIL HEADHUNTER & JOBS PLATFORM
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Your Worth. <span className="text-yellow-400">Your Market.</span>
            </h1>
            <p className="text-blue-300 text-lg max-w-2xl mx-auto mb-6">
              Every athlete has value. Start small, grow big. We match you to real paid opportunities based on exactly where you are — then help you climb to where you deserve to be.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                { icon: "💰", text: "Real Paying Jobs" },
                { icon: "🤖", text: "AI Matching Engine" },
                { icon: "📈", text: "NIL Value Score" },
                { icon: "🏆", text: "Career Ladder" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <span>{item.icon}</span>
                  <span className="text-white font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Jobs", value: "2,847", icon: Briefcase, color: "text-yellow-400" },
              { label: "Athletes Placed", value: "14,200+", icon: Users, color: "text-green-400" },
              { label: "Total Paid Out", value: "$4.2M", icon: DollarSign, color: "text-blue-400" },
              { label: "Brand Partners", value: "380+", icon: Building2, color: "text-purple-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "jobs", label: "🔍 Browse Jobs" },
              { id: "score", label: "📊 My NIL Score" },
              { id: "ladder", label: "🪜 Career Ladder" },
              { id: "post", label: "📢 Post a Job" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-yellow-500 text-black"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* JOBS TAB */}
          {activeTab === "jobs" && (
            <div>
              {/* Search + Filter */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, sports..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {TIERS.map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => setActiveTier(tier.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                        activeTier === tier.id
                          ? "bg-yellow-500 text-black border-yellow-500"
                          : `${tier.color} hover:border-yellow-500/50`
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(job => (
                  <div key={job.id} className="bg-[#0d1a3a] border border-blue-900/40 rounded-2xl p-5 hover:border-yellow-500/40 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">{job.logo}</div>
                        <div>
                          <div className="text-white font-bold text-sm leading-tight">{job.title}</div>
                          <div className="text-gray-400 text-xs">{job.company}</div>
                        </div>
                      </div>
                      {job.hot && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">🔥 HOT</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-800/30">{tag}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div className="flex items-center gap-1 text-gray-400"><DollarSign className="w-3 h-3 text-green-400" /><span className="text-green-400 font-bold">{job.pay}</span></div>
                      <div className="flex items-center gap-1 text-gray-400"><MapPin className="w-3 h-3" />{job.location}</div>
                      <div className="flex items-center gap-1 text-gray-400"><Users className="w-3 h-3" />{job.followers} followers</div>
                      <div className="flex items-center gap-1 text-gray-400"><Clock className="w-3 h-3" />Due {job.deadline}</div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-black py-2.5 rounded-xl text-sm hover:from-yellow-400 hover:to-yellow-300 transition-all">
                      Apply Now →
                    </button>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No jobs found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          )}

          {/* NIL SCORE TAB */}
          {activeTab === "score" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#0d1a3a] border border-blue-900/40 rounded-2xl p-8 text-center mb-6">
                <div className="text-6xl font-black text-yellow-400 mb-2">742</div>
                <div className="text-white font-bold text-xl mb-1">Your NIL Score</div>
                <div className="text-blue-300 text-sm mb-4">Rising Star Tier — Top 35% of Athletes</div>
                <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-3 rounded-full" style={{ width: "74%" }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0</span><span>500</span><span>750</span><span>1000</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {NIL_SCORE_FACTORS.map((factor, i) => (
                  <div key={i} className="bg-[#0d1a3a] border border-blue-900/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <factor.icon className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm font-bold">{factor.label}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{factor.weight}% weight</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" style={{ width: `${60 + i * 8}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-5">
                <h3 className="text-white font-black mb-3">🚀 How to Boost Your Score</h3>
                <ul className="space-y-2 text-sm text-blue-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />Complete your athlete profile (adds +50 pts)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />Upload highlight reel (adds +75 pts)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />Connect social accounts (adds +100 pts)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />Complete first NIL deal (adds +150 pts)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-red-400 flex-shrink-0" />Get verified by AthlynX (adds +200 pts)</li>
                </ul>
              </div>
            </div>
          )}

          {/* CAREER LADDER TAB */}
          {activeTab === "ladder" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-white mb-2">Your Career Ladder</h2>
                <p className="text-blue-300 text-sm">Every athlete starts somewhere. We help you climb every rung — from your first $100 deal to your first $100K month.</p>
              </div>
              <div className="space-y-4">
                {CAREER_LADDER.map((rung, i) => (
                  <div key={i} className={`bg-[#0d1a3a] border-l-4 ${rung.color} border border-blue-900/40 rounded-2xl p-5 ${rung.active ? "ring-2 ring-yellow-500/30" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-black text-lg">{rung.tier}</div>
                      {rung.active && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">YOU ARE HERE</span>}
                    </div>
                    <div className="text-green-400 font-bold text-sm mb-1">{rung.range}</div>
                    <div className="text-gray-400 text-xs">{rung.req}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 border border-yellow-500/20 rounded-2xl p-6 text-center">
                <div className="text-yellow-400 text-3xl mb-2">💎</div>
                <h3 className="text-white font-black text-xl mb-2">The Legend Tier</h3>
                <p className="text-gray-300 text-sm">Pro contracts, national brand deals, $100K+ per month. This is where AthlynX athletes go when they make it to the league or the show. We are with you every step of the way — from your first deal to your last.</p>
              </div>
            </div>
          )}

          {/* POST A JOB TAB */}
          {activeTab === "post" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#0d1a3a] border border-blue-900/40 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-2">Post a Job or NIL Deal</h2>
                <p className="text-blue-300 text-sm mb-6">Brands, schools, agencies, and businesses — post your opportunity and our AI will match you with the perfect athletes.</p>
                <div className="space-y-4">
                  {[
                    { label: "Job Title / Opportunity Name *", placeholder: "e.g. Brand Ambassador, Camp Instructor, Spokesperson" },
                    { label: "Company / Organization *", placeholder: "Your company name" },
                    { label: "Compensation / Pay Range *", placeholder: "e.g. $500–$2,000/mo or $75/hr" },
                    { label: "Location", placeholder: "Remote, City/State, or Nationwide" },
                    { label: "Minimum Followers Required", placeholder: "e.g. 1K, 10K, or None" },
                    { label: "Sport(s)", placeholder: "Football, Basketball, All Sports..." },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="text-gray-300 text-xs font-bold uppercase tracking-wide mb-1 block">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-xl px-4 py-3 placeholder-blue-600 focus:outline-none focus:border-yellow-500/50"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-gray-300 text-xs font-bold uppercase tracking-wide mb-1 block">Job Description *</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the opportunity, requirements, and what you are looking for in an athlete..."
                      className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-xl px-4 py-3 placeholder-blue-600 focus:outline-none focus:border-yellow-500/50 resize-none"
                    />
                  </div>
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-black py-4 rounded-xl text-base hover:from-yellow-400 hover:to-yellow-300 transition-all">
                    Post Job — AI Matching Starts Immediately 🚀
                  </button>
                  <p className="text-center text-gray-500 text-xs">Free for the first 30 days. Pro posting plans available in the Marketplace.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function NILJobs() {
  return <RouteErrorBoundary><NILJobsInner /></RouteErrorBoundary>;
}
