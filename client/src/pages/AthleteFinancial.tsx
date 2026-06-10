import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import {
  DollarSign, TrendingUp, PieChart, Shield, Calculator,
  Star, MapPin, Calendar, CheckCircle, ArrowRight, Award,
  Briefcase, Home, CreditCard, BarChart3, Landmark, Users,
  FileText, Zap, Target, Lock, Globe, Phone
} from "lucide-react";

const SERVICES = [
  {
    icon: TrendingUp,
    title: "Wealth Management",
    desc: "Build generational wealth from your first contract. Diversified portfolios designed for athlete income cycles.",
    color: "blue"
  },
  {
    icon: Calculator,
    title: "Tax Strategy",
    desc: "Multi-state tax filing, jock tax compliance, NIL income optimization. Never overpay the IRS again.",
    color: "green"
  },
  {
    icon: PieChart,
    title: "Investment Planning",
    desc: "Real estate, stocks, private equity, and business ventures — grow your money while you play.",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Contract Financial Analysis",
    desc: "Understand every dollar of your contract — signing bonuses, guarantees, incentives, and deferred money.",
    color: "yellow"
  },
  {
    icon: Home,
    title: "Real Estate",
    desc: "From your first home to a full real estate portfolio. Athlete-specific mortgage programs and investment properties.",
    color: "orange"
  },
  {
    icon: Landmark,
    title: "Retirement Planning",
    desc: "Your career ends. Your money doesn't have to. 401(k), IRA, pension, and post-career income strategies.",
    color: "cyan"
  },
  {
    icon: CreditCard,
    title: "Credit & Banking",
    desc: "Build elite credit, manage cash flow, and access athlete-friendly banking with no hidden fees.",
    color: "pink"
  },
  {
    icon: Briefcase,
    title: "Business Formation",
    desc: "Set up your LLC, S-Corp, or holding company to protect your assets and maximize tax efficiency.",
    color: "indigo"
  }
];

const ADVISORS = [
  {
    name: "Robert Finley, CFP",
    firm: "Athlete Wealth Partners",
    location: "New York, NY",
    rating: 4.9,
    reviews: 143,
    aum: "$340M",
    clients: 67,
    specialties: ["NFL/NBA Contracts", "Tax Strategy", "Real Estate", "Business Ventures"],
    certifications: ["CFP", "CFA", "Athlete Financial Advisor"],
    bio: "Former Wall Street analyst turned athlete financial advisor. Manages $340M in athlete assets. Specializes in protecting first-generation wealth.",
    featured: true,
    available: true
  },
  {
    name: "Angela Brooks, CPA",
    firm: "Brooks Sports Tax Group",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 211,
    aum: "$0",
    clients: 189,
    specialties: ["NIL Tax Planning", "Multi-State Tax", "Jock Tax", "Business Formation"],
    certifications: ["CPA", "EA", "NIL Tax Specialist"],
    bio: "The #1 sports tax CPA in the country. Has filed taxes for over 500 professional athletes. NIL income expert.",
    featured: true,
    available: true
  },
  {
    name: "Marcus Webb, CFP",
    firm: "Webb Capital Management",
    location: "Atlanta, GA",
    rating: 4.7,
    reviews: 98,
    aum: "$180M",
    clients: 44,
    specialties: ["Investment Management", "Retirement Planning", "Real Estate", "Credit Building"],
    certifications: ["CFP", "ChFC", "Athlete Advisor"],
    bio: "Former college athlete who became a top financial advisor. Understands the unique challenges athletes face with sudden wealth.",
    featured: false,
    available: true
  }
];

const NIL_TAX_TIPS = [
  { title: "NIL income is self-employment income", desc: "You owe both income tax AND self-employment tax (15.3%). Set aside 30-40% of every NIL payment." },
  { title: "Form an LLC immediately", desc: "Running NIL through an LLC can save thousands in taxes and protects your personal assets." },
  { title: "Track every expense", desc: "Equipment, travel, social media tools, and agent fees are all deductible business expenses." },
  { title: "Quarterly estimated taxes", desc: "If you earn more than $1,000 in NIL, you must pay quarterly estimated taxes to avoid penalties." }
];

const WEALTH_STAGES = [
  { stage: "High School", title: "Build Your Foundation", items: ["Open a Roth IRA", "Build credit early", "Learn financial literacy", "Understand NIL basics"] },
  { stage: "College", title: "Maximize Your NIL", items: ["Form an LLC for NIL", "Hire a CPA", "Start investing small", "Avoid lifestyle inflation"] },
  { stage: "Draft / Pro", title: "Protect Your Contract", items: ["Hire a CFP immediately", "Diversify investments", "Buy real estate", "Create a budget"] },
  { stage: "Career", title: "Build Generational Wealth", items: ["Max retirement accounts", "Build a business portfolio", "Estate planning", "Teach your family"] },
  { stage: "Post-Career", title: "Your Money Works for You", items: ["Passive income streams", "Philanthropy strategy", "Business leadership", "Legacy planning"] }
];

function AthleteFinancialInner() {
  const [activeTab, setActiveTab] = useState<"advisors" | "services" | "education">("advisors");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">AthlynX FINANCIAL HUB</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-center mb-3">
          Protect & Grow <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Your Wealth</span>
        </h1>
        <p className="text-slate-300 text-center text-lg max-w-2xl mx-auto mb-8">
          78% of NFL players go broke within 2 years of retirement. Not you. Connect with certified financial advisors, tax experts, and wealth managers who specialize in athlete finances.
        </p>

        {/* Warning Stat */}
        <div className="max-w-3xl mx-auto bg-red-900/30 border border-red-400/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-200 text-sm">
            <strong>The #1 threat to your career earnings isn't taxes — it's not having the right team.</strong> The average NFL career is 3.3 years. The average NBA career is 4.5 years. Your financial decisions in those years determine the next 50.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          {[
            { value: "78%", label: "NFL players broke in 2 yrs" },
            { value: "60%", label: "NBA players broke in 5 yrs" },
            { value: "$0", label: "Cost to consult an advisor" },
            { value: "500+", label: "Certified Athlete Advisors" }
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className={`text-xl font-black ${i < 2 ? "text-red-400" : "text-green-400"}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {(["advisors", "services", "education"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-green-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Advisors Tab */}
        {activeTab === "advisors" && (
          <div className="space-y-5">
            {ADVISORS.map((adv, i) => (
              <div key={i} className={`bg-white/5 border rounded-2xl p-6 hover:bg-white/10 transition-all ${adv.featured ? "border-green-400/40" : "border-white/10"}`}>
                {adv.featured && (
                  <div className="flex items-center gap-1 text-xs text-yellow-400 font-semibold mb-3">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    FEATURED ADVISOR
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{adv.name}</h3>
                    <p className="text-green-400 text-sm font-semibold">{adv.firm}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-400 text-xs">{adv.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${adv.available ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${adv.available ? "bg-green-400" : "bg-slate-400"}`} />
                      {adv.available ? "Available" : "Busy"}
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-bold">{adv.rating}</span>
                      <span className="text-slate-400 text-xs">({adv.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {adv.aum !== "$0" && <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-sm font-black text-green-400">{adv.aum}</div><div className="text-xs text-slate-400">AUM</div></div>}
                  <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-sm font-black text-blue-400">{adv.clients}</div><div className="text-xs text-slate-400">Clients</div></div>
                  <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-xs font-black text-yellow-400">Free</div><div className="text-xs text-slate-400">Consultation</div></div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {adv.certifications.map((c, j) => (
                    <span key={j} className="flex items-center gap-1 text-xs bg-green-500/20 text-green-300 border border-green-400/30 px-2 py-0.5 rounded-full">
                      <Award className="w-2.5 h-2.5" />{c}
                    </span>
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{adv.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {adv.specialties.map((s, j) => <span key={j} className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                    <Calendar className="w-4 h-4" />
                    Book Free Consultation
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              const colors: Record<string, string> = {
                blue: "text-blue-400 bg-blue-500/20 border-blue-400/30",
                green: "text-green-400 bg-green-500/20 border-green-400/30",
                purple: "text-purple-400 bg-purple-500/20 border-purple-400/30",
                yellow: "text-yellow-400 bg-yellow-500/20 border-yellow-400/30",
                orange: "text-orange-400 bg-orange-500/20 border-orange-400/30",
                cyan: "text-cyan-400 bg-cyan-500/20 border-cyan-400/30",
                pink: "text-pink-400 bg-pink-500/20 border-pink-400/30",
                indigo: "text-indigo-400 bg-indigo-500/20 border-indigo-400/30"
              };
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${colors[svc.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{svc.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <div className="space-y-8">
            {/* NIL Tax Tips */}
            <div>
              <h2 className="text-xl font-black text-white mb-4">NIL Tax Essentials Every Athlete Must Know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {NIL_TAX_TIPS.map((tip, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-bold text-sm mb-1">{tip.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wealth Stages */}
            <div>
              <h2 className="text-xl font-black text-white mb-4">Your Wealth Journey — Stage by Stage</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {WEALTH_STAGES.map((stage, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-xs text-green-400 font-bold mb-1">{stage.stage}</div>
                    <h3 className="text-white font-bold text-sm mb-3">{stage.title}</h3>
                    <ul className="space-y-1">
                      {stage.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-slate-400">
                          <ArrowRight className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-400/20 rounded-2xl p-6 sm:p-8 text-center">
          <DollarSign className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-white mb-2">Are You a Certified Financial Advisor?</h3>
          <p className="text-slate-400 text-sm mb-4 max-w-xl mx-auto">
            Join the AthlynX Financial Network and connect with athletes at every level — from high school NIL to professional contracts.
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

export default function AthleteFinancial() {
  return <RouteErrorBoundary><AthleteFinancialInner /></RouteErrorBoundary>;
}
