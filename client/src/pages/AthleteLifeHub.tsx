import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { useLocation } from "wouter";
import {
  Shield, DollarSign, Scale, Heart, Briefcase, TrendingUp,
  Star, ArrowRight, Users, Award, Phone, Calendar,
  ChevronRight, Zap, Lock, Globe, Target, BookOpen,
  Activity, Brain, Utensils, Dumbbell, GraduationCap,
  Building2, UserCheck, FileText, Handshake, Trophy
} from "lucide-react";

const LIFE_SERVICES = [
  {
    id: "agents",
    title: "Sports Agents",
    subtitle: "Find Your Rep",
    icon: Handshake,
    color: "from-blue-600 to-blue-800",
    accent: "blue",
    href: "/agent-finder",
    description: "NFLPA, NBPA, MLB, and WNBA certified agents. Negotiate your contracts, protect your rights, maximize your value.",
    stats: ["2,400+ Certified Agents", "All Major Sports", "NIL Specialists"],
    features: ["Contract Negotiation", "NIL Deal Structuring", "Endorsement Deals", "Free Agent Strategy"],
    badge: "Most Popular"
  },
  {
    id: "financial",
    title: "Financial Advisors",
    subtitle: "Build Your Wealth",
    icon: DollarSign,
    color: "from-green-600 to-green-800",
    accent: "green",
    href: "/athlete-financial",
    description: "Athlete-specialized financial advisors, CPAs, and wealth managers. Build generational wealth from day one.",
    stats: ["500+ Advisors", "Avg $2.1M Managed", "Tax Specialists"],
    features: ["Wealth Management", "Tax Strategy", "Investment Planning", "NIL Income Planning"],
    badge: "Critical"
  },
  {
    id: "legal",
    title: "Legal Services",
    subtitle: "LegalZoom for Athletes",
    icon: Scale,
    color: "from-purple-600 to-purple-800",
    accent: "purple",
    href: "/athlete-legal",
    description: "Sports attorneys, NIL lawyers, contract reviewers. Know your rights in every state. Never sign blind again.",
    stats: ["800+ Sports Attorneys", "All 50 States", "NIL Law Experts"],
    features: ["Contract Review", "NIL Rights Protection", "State Law Compliance", "Dispute Resolution"],
    badge: "Essential"
  },
  {
    id: "health",
    title: "Health & Medical",
    subtitle: "Peak Performance Care",
    icon: Heart,
    color: "from-red-600 to-red-800",
    accent: "red",
    href: "/athlete-health",
    description: "Team physicians, orthopedic surgeons, physical therapists, sports psychologists, and nutritionists — all in one place.",
    stats: ["1,200+ Providers", "HIPAA Compliant", "Telehealth Available"],
    features: ["Sports Medicine", "Physical Therapy", "Mental Health", "Nutrition Plans"],
    badge: "HIPAA Secure"
  },
  {
    id: "career",
    title: "Career Development",
    subtitle: "Life After the Game",
    icon: Briefcase,
    color: "from-orange-600 to-orange-800",
    accent: "orange",
    href: "/athlete-career",
    description: "Career coaches, resume builders, corporate partnerships, and post-sports transition planning. Your career does not end when the game does.",
    stats: ["300+ Career Coaches", "Fortune 500 Partners", "Avg 3.2yr Transition"],
    features: ["Career Coaching", "Resume Building", "Corporate Placement", "Entrepreneurship"],
    badge: "Life-Changing"
  },
  {
    id: "training",
    title: "Elite Trainers & PTs",
    subtitle: "Train Like a Pro",
    icon: Dumbbell,
    color: "from-yellow-600 to-yellow-800",
    accent: "yellow",
    href: "/training",
    description: "Certified strength coaches, speed trainers, position-specific coaches, and physical therapists. Train with the best.",
    stats: ["3,000+ Trainers", "All Sports", "Remote & In-Person"],
    features: ["Strength & Conditioning", "Speed Training", "Position Coaching", "Injury Rehab"],
    badge: "Top Rated"
  },
  {
    id: "mental",
    title: "Mental Performance",
    subtitle: "Win the Mind Game",
    icon: Brain,
    color: "from-teal-600 to-teal-800",
    accent: "teal",
    href: "/athlete-health",
    description: "Sports psychologists, mindset coaches, and mental performance specialists. The mental game separates good from great.",
    stats: ["400+ Specialists", "Confidential", "Proven Methods"],
    features: ["Mindset Coaching", "Anxiety Management", "Focus Training", "Confidence Building"],
    badge: "Game Changer"
  },
  {
    id: "nutrition",
    title: "Nutrition & Recovery",
    subtitle: "Fuel Your Body",
    icon: Utensils,
    color: "from-lime-600 to-lime-800",
    accent: "lime",
    href: "/athlete-health",
    description: "Registered dietitians, sports nutritionists, and recovery specialists. Eat right, recover faster, perform longer.",
    stats: ["600+ Nutritionists", "Custom Meal Plans", "Recovery Protocols"],
    features: ["Custom Meal Plans", "Supplement Guidance", "Recovery Nutrition", "Weight Management"],
    badge: "Science-Backed"
  },
  {
    id: "education",
    title: "Education & Scholarships",
    subtitle: "Your Degree Matters",
    icon: GraduationCap,
    color: "from-indigo-600 to-indigo-800",
    accent: "indigo",
    href: "/wizard-hub",
    description: "Academic advisors, scholarship finders, tutoring services, and transfer academic planning. Education is your foundation.",
    stats: ["$2.4B in Scholarships", "All Divisions", "Academic Advisors"],
    features: ["Scholarship Search", "Academic Advising", "Tutoring", "Transfer Planning"],
    badge: "Free Resources"
  }
];

const LIFE_STATS = [
  { value: "142+", label: "Platform Services" },
  { value: "8,500+", label: "Verified Professionals" },
  { value: "50", label: "States Covered" },
  { value: "Life", label: "To Retirement" }
];

function AthleteLifeHubInner() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Services" },
    { id: "money", label: "Money & Legal" },
    { id: "health", label: "Health & Body" },
    { id: "career", label: "Career & Life" }
  ];

  const filtered = LIFE_SERVICES.filter(s => {
    if (activeFilter === "all") return true;
    if (activeFilter === "money") return ["agents", "financial", "legal"].includes(s.id);
    if (activeFilter === "health") return ["health", "training", "mental", "nutrition"].includes(s.id);
    if (activeFilter === "career") return ["career", "education"].includes(s.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2">
              <Trophy className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-semibold tracking-wide">AthlynX LIFE PLATFORM</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-center mb-4 leading-tight">
            We Take Care of You
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              From Life to Retirement
            </span>
          </h1>

          <p className="text-xl text-slate-300 text-center max-w-3xl mx-auto mb-8 leading-relaxed">
            Agents. Financial Advisors. Lawyers. Doctors. Trainers. Physical Therapists. Mental Health. Nutrition. Career Coaches.
            <span className="text-blue-300 font-semibold"> This is a marriage — we are with you every step of the way.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
            {LIFE_STATS.map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-blue-400">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/wizard-hub")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              <Zap className="w-5 h-5" />
              Talk to an AI Advisor — Free
            </button>
            <button
              onClick={() => navigate("/agent-finder")}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              <Users className="w-5 h-5" />
              Find My Agent
            </button>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-y border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-slate-200 italic leading-relaxed">
            "If they fail, it's on them — they tried. But we are going to give every athlete the best possible chance to make it to the league, the show, or wherever their dream takes them. 
            <span className="text-blue-300 font-bold not-italic"> We take care of them from life to death. That's the AthlynX promise."</span>
          </p>
          <p className="text-slate-400 text-sm mt-3">— Chad A. Dozier, Founder · CEO · Chairman, AthlynXAI Corporation</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => navigate(service.href)}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-400/40 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-black text-white mb-1">{service.title}</h3>
                <p className="text-blue-400 text-sm font-semibold mb-3">{service.subtitle}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.stats.map((stat, i) => (
                    <span key={i} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                      {stat}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-1 mb-5">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  Explore {service.title}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Promise Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-400/20 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-bold text-sm tracking-wide uppercase">The AthlynX Promise</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                We Are With You
                <br />
                <span className="text-blue-400">Every Step of the Way</span>
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                From the moment you sign up to the day you retire — and beyond — AthlynX is your partner. 
                We connect you with the best professionals in every field so you can focus on what you do best: 
                being an athlete.
              </p>
              <div className="space-y-3">
                {[
                  { icon: UserCheck, text: "Verified professionals in every field" },
                  { icon: Lock, text: "HIPAA-compliant and fully secure" },
                  { icon: Globe, text: "Available in all 50 states" },
                  { icon: Target, text: "Tailored to your sport and level" }
                ].map(({ icon: I, text }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <I className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, title: "Draft Day Ready", desc: "Full legal & financial prep before you sign" },
                { icon: TrendingUp, title: "NIL Maximized", desc: "Agents & advisors working your deals" },
                { icon: Heart, title: "Health First", desc: "Medical team on call, always" },
                { icon: BookOpen, title: "Life After Sports", desc: "Career planning from day one" }
              ].map(({ icon: I, title, desc }, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <I className="w-6 h-6 text-blue-400 mb-2" />
                  <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Resources */}
      <div className="py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">⚡ Quick Resources</h2>
            <p className="text-slate-400 text-sm">Essential tools and information every athlete needs to know</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "📋", title: "NIL State Laws", desc: "All 50 states have different NIL rules. Know yours before you sign anything.", link: "/athlete-legal", cta: "Check Your State" },
              { icon: "💰", title: "NIL Value Calculator", desc: "Estimate your NIL market value based on your sport, school, and social following.", link: "/nil-calculator", cta: "Calculate My Value" },
              { icon: "🤝", title: "Find an Agent", desc: "Browse NFLPA, NBPA, and MLB-certified agents who specialize in your sport.", link: "/agent-finder", cta: "Find My Agent" },
              { icon: "⚖️", title: "Contract Review", desc: "Never sign a NIL deal without legal review. Our attorneys review contracts fast.", link: "/athlete-legal", cta: "Get Review" },
              { icon: "🏦", title: "Athlete Banking", desc: "Special banking products designed for athletes — NIL income management, tax prep, and more.", link: "/athlete-financial", cta: "Open Account" },
              { icon: "🎓", title: "Scholarship Wizard", desc: "AI-powered scholarship matching across all sports and academic levels.", link: "/wizard-hub", cta: "Find Scholarships" },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 border border-white/10 hover:border-blue-400/50 rounded-xl p-4 transition-all group">
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="text-white font-black text-sm mb-1">{r.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">{r.desc}</p>
                <a href={r.link} className="text-blue-400 hover:text-white text-xs font-bold transition-colors group-hover:text-white">
                  {r.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NIL State Laws Quick Reference */}
      <div className="py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">⚖️ NIL Laws — Know Your State</h2>
            <p className="text-slate-400 text-sm">Every state has different NIL rules. These are the key states for college athletes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { state: "Texas", status: "✅ Open", key: "No restrictions on NIL deals. Athletes can sign with agents. No school approval required.", color: "border-green-600" },
              { state: "California", status: "✅ Open", key: "SB 206 — first state to pass NIL law. Athletes can hire agents and earn from endorsements.", color: "border-green-600" },
              { state: "Florida", status: "✅ Open", key: "Comprehensive NIL law. Athletes can earn from social media, appearances, and endorsements.", color: "border-green-600" },
              { state: "Alabama", status: "✅ Open", key: "NIL allowed. Athletes must disclose deals to their school. No pay-for-play.", color: "border-green-600" },
              { state: "Mississippi", status: "✅ Open", key: "NIL allowed. Athletes must report deals. School cannot restrict deals with competing brands.", color: "border-green-600" },
              { state: "Georgia", status: "✅ Open", key: "NIL allowed. Athletes can earn from autographs, appearances, and social media.", color: "border-green-600" },
              { state: "Ohio", status: "✅ Open", key: "NIL allowed. Athletes can hire agents. Schools cannot prevent athletes from earning NIL.", color: "border-green-600" },
              { state: "Pennsylvania", status: "✅ Open", key: "NIL allowed. Athletes can earn from any legal source. School approval not required.", color: "border-green-600" },
              { state: "New York", status: "✅ Open", key: "NIL allowed. Comprehensive protections for athletes. Agents permitted.", color: "border-green-600" },
            ].map((state, si) => (
              <div key={si} className={`bg-white/5 border ${state.color} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-black text-sm">{state.state}</span>
                  <span className="text-xs font-bold text-green-400">{state.status}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{state.key}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a href="/athlete-legal" className="text-blue-400 hover:text-white text-sm font-bold transition-colors">
              View All 50 States + Full Legal Guide →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/10 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ready to Build Your Team?
          </h2>
          <p className="text-slate-400 mb-6">
            Start with a free AI consultation — tell us your situation and we will match you with the right professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/wizard-hub")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              <Zap className="w-5 h-5" />
              Start Free AI Consultation
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              <Star className="w-5 h-5" />
              View Membership Plans
            </button>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function AthleteLifeHub() {
  return <RouteErrorBoundary><AthleteLifeHubInner /></RouteErrorBoundary>;
}
