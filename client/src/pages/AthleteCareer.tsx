import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import {
  Briefcase, GraduationCap, TrendingUp, DollarSign,
  Star, MapPin, Calendar, CheckCircle, ArrowRight,
  Users, Award, Target, BookOpen, Zap, Globe,
  Building, Mic, Camera, Code, ChartBar, Heart,
  Shield, Clock, Lightbulb
} from "lucide-react";

const CAREER_PATHS = [
  {
    icon: Mic,
    title: "Sports Media & Broadcasting",
    desc: "ESPN, NFL Network, local sports media. Your story and credibility open doors no journalism degree can.",
    avgSalary: "$45K–$250K",
    demand: "High",
    color: "blue"
  },
  {
    icon: Users,
    title: "Coaching & Training",
    desc: "High school, college, professional, or private coaching. Your playing experience is your credential.",
    avgSalary: "$35K–$500K+",
    demand: "Very High",
    color: "green"
  },
  {
    icon: Building,
    title: "Sports Business & Management",
    desc: "Front office, team management, sports agencies, and athletic departments.",
    avgSalary: "$50K–$300K",
    demand: "High",
    color: "purple"
  },
  {
    icon: Code,
    title: "Sports Technology",
    desc: "Performance analytics, sports tech startups, wearables, and AI in sports.",
    avgSalary: "$70K–$200K",
    demand: "Explosive",
    color: "cyan"
  },
  {
    icon: DollarSign,
    title: "Entrepreneurship & Business",
    desc: "Start your own business, franchise, or brand. Athletes make exceptional entrepreneurs.",
    avgSalary: "Unlimited",
    demand: "Self-Driven",
    color: "yellow"
  },
  {
    icon: GraduationCap,
    title: "Education & Youth Development",
    desc: "Teaching, school administration, youth programs, and community development.",
    avgSalary: "$40K–$120K",
    demand: "High",
    color: "orange"
  },
  {
    icon: Camera,
    title: "Content Creation & Influencer",
    desc: "YouTube, Instagram, TikTok, podcasting. Your athletic brand has built-in audience.",
    avgSalary: "$20K–$5M+",
    demand: "Growing",
    color: "red"
  },
  {
    icon: Heart,
    title: "Healthcare & Sports Medicine",
    desc: "Physical therapy, sports medicine, nutrition, and mental health coaching.",
    avgSalary: "$55K–$180K",
    demand: "High",
    color: "pink"
  }
];

const TRANSITION_RESOURCES = [
  {
    title: "Athlete Identity Transition",
    desc: "Who are you when the game is over? This is the most important question. We help you answer it.",
    icon: Lightbulb,
    color: "purple"
  },
  {
    title: "Resume & LinkedIn Optimization",
    desc: "Translate your athletic career into corporate language. Your leadership, discipline, and performance record are gold.",
    icon: Briefcase,
    color: "blue"
  },
  {
    title: "Interview Coaching",
    desc: "Athletes are natural performers. We teach you how to interview the same way you compete — with preparation and confidence.",
    icon: Mic,
    color: "green"
  },
  {
    title: "Degree Completion Programs",
    desc: "Finish your degree online while you train or after you retire. Partner universities with athlete-friendly programs.",
    icon: GraduationCap,
    color: "yellow"
  },
  {
    title: "Certification Programs",
    desc: "CSCS, RD, financial planning, real estate license, coaching certifications — fast-track programs for athletes.",
    icon: Award,
    color: "orange"
  },
  {
    title: "Networking & Mentorship",
    desc: "Connect with former athletes who have successfully transitioned. Their path is your roadmap.",
    icon: Users,
    color: "cyan"
  }
];

const MENTORS = [
  {
    name: "Marcus Johnson",
    sport: "Former NFL Wide Receiver — 8 Seasons",
    currentRole: "VP of Player Development, NFL Team",
    location: "Dallas, TX",
    rating: 4.9,
    reviews: 87,
    bio: "Transitioned from the field to the front office in 3 years. Helps athletes navigate the business side of sports and build careers that last longer than their playing days.",
    specialties: ["Sports Business", "Networking", "Brand Building", "Front Office Careers"],
    available: true
  },
  {
    name: "Keisha Williams",
    sport: "Former WNBA All-Star — 12 Seasons",
    currentRole: "Sports Media Personality & Entrepreneur",
    location: "Atlanta, GA",
    rating: 4.8,
    reviews: 64,
    bio: "Built a media empire after her WNBA career. Owns three businesses and hosts a top-10 sports podcast. Mentors female athletes on entrepreneurship and media.",
    specialties: ["Media & Broadcasting", "Entrepreneurship", "Women in Sports", "Podcasting"],
    available: true
  },
  {
    name: "David Chen",
    sport: "Former MLB Pitcher — 6 Seasons",
    currentRole: "Sports Tech Founder & VC Investor",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 52,
    bio: "Used his baseball career to fund his first startup. Now runs a sports tech VC fund that has invested in 14 companies. Mentors athletes on tech entrepreneurship.",
    specialties: ["Sports Technology", "Startups", "Investing", "Entrepreneurship"],
    available: false
  }
];

const RETIREMENT_CHECKLIST = [
  "Pension and retirement account setup (401K, IRA, Roth IRA)",
  "Life insurance and disability insurance review",
  "Post-career health insurance planning",
  "Real estate investment strategy",
  "Business formation and tax optimization",
  "Estate planning and will preparation",
  "Social Security optimization strategy",
  "Investment portfolio diversification"
];

const STATS = [
  { value: "78%", label: "of NFL players face financial hardship within 2 years of retirement" },
  { value: "60%", label: "of NBA players go broke within 5 years of retirement" },
  { value: "3x", label: "more likely to succeed with a career plan before retirement" },
  { value: "$0", label: "cost to start planning — the cost of not planning is everything" }
];

function AthleteCareerInner() {
  const [activeTab, setActiveTab] = useState<"careers" | "mentors" | "resources">("careers");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">AthlynX CAREER HUB</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-center mb-3">
          Life After <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">The Game</span>
        </h1>
        <p className="text-slate-300 text-center text-lg max-w-2xl mx-auto mb-6">
          Your athletic career is the beginning, not the end. Career development, post-sports transitions, retirement planning, and mentorship from athletes who have done it — all in one place.
        </p>

        {/* Warning Stats */}
        <div className="bg-red-900/30 border border-red-400/20 rounded-2xl p-4 mb-8 max-w-3xl mx-auto">
          <h3 className="text-red-400 font-bold text-sm text-center mb-3">The Reality No One Talks About</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-black text-red-400">{s.value}</div>
                <div className="text-xs text-slate-400 leading-tight mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {(["careers", "mentors", "resources"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-green-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Careers Tab */}
        {activeTab === "careers" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAREER_PATHS.map((path, i) => {
              const Icon = path.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer">
                  <Icon className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white font-bold mb-1">{path.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{path.desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Avg Salary</div>
                      <div className="text-green-400 text-xs font-bold">{path.avgSalary}</div>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                      path.demand === "Explosive" ? "bg-yellow-500/20 text-yellow-400" :
                      path.demand === "Very High" ? "bg-green-500/20 text-green-400" :
                      path.demand === "High" ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>{path.demand}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === "mentors" && (
          <div className="space-y-5">
            {MENTORS.map((mentor, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black text-white">{mentor.name}</h3>
                    <p className="text-green-400 text-sm font-semibold">{mentor.sport}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{mentor.currentRole}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-400 text-xs">{mentor.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${mentor.available ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mentor.available ? "bg-green-400" : "bg-slate-400"}`} />
                      {mentor.available ? "Taking Mentees" : "Full"}
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-bold">{mentor.rating}</span>
                      <span className="text-slate-400 text-xs">({mentor.reviews})</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{mentor.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.specialties.map((s, j) => <span key={j} className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                  <Calendar className="w-4 h-4" />
                  Request Mentorship Session
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            {/* Transition Resources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRANSITION_RESOURCES.map((res, i) => {
                const Icon = res.icon;
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer">
                    <Icon className="w-7 h-7 text-green-400 mb-3" />
                    <h3 className="text-white font-bold mb-2">{res.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{res.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Retirement Checklist */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Retirement Planning Checklist
              </h2>
              <p className="text-slate-400 text-sm mb-4">Start this checklist the day you go pro. Not the day you retire.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RETIREMENT_CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-400/20 rounded-2xl p-6 sm:p-8 text-center">
          <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-white mb-2">Are You a Career Coach or Mentor?</h3>
          <p className="text-slate-400 text-sm mb-4 max-w-xl mx-auto">
            Join the AthlynX Career Network. Help athletes transition from the field to the boardroom, studio, or startup. Your experience changes lives.
          </p>
          <button className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
            Apply to Join the Network
          </button>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function AthleteCareer() {
  return <RouteErrorBoundary><AthleteCareerInner /></RouteErrorBoundary>;
}
