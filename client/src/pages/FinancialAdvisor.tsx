import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import {
  DollarSign, TrendingUp, PieChart, Shield, Calculator,
  Star, MapPin, Calendar, CheckCircle, ArrowRight, Award,
  Briefcase, Home, CreditCard, BarChart3, Landmark, Users,
  FileText, Zap, Target, Lock, Globe, Phone, AlertTriangle,
  BookOpen, ChevronDown, ChevronUp
} from "lucide-react";

const ADVISOR_CATEGORIES = [
  {
    icon: "💰",
    title: "Certified Financial Planners (CFP)",
    desc: "Holistic financial planning covering investments, taxes, insurance, estate planning, and retirement. The gold standard for athlete wealth management.",
    credential: "CFP® Certified",
    color: "#1E90FF"
  },
  {
    icon: "📊",
    title: "Certified Public Accountants (CPA)",
    desc: "Tax strategy, multi-state jock tax compliance, NIL income reporting, business entity structuring, and IRS representation.",
    credential: "CPA Licensed",
    color: "#00BFFF"
  },
  {
    icon: "⚖️",
    title: "Sports Contract Advisors",
    desc: "Contract financial analysis, guaranteed money structures, incentive clauses, signing bonus optimization, and deferred compensation.",
    credential: "NFLPA/NBPA Certified",
    color: "#4169E1"
  },
  {
    icon: "🏠",
    title: "Real Estate Advisors",
    desc: "Athlete-specific mortgage programs, investment property portfolios, 1031 exchanges, and real estate syndication opportunities.",
    credential: "Licensed Realtor + CFA",
    color: "#1E90FF"
  },
  {
    icon: "🛡️",
    title: "Insurance Specialists",
    desc: "Disability insurance, career-ending injury policies, life insurance, and liability coverage for high-net-worth athletes.",
    credential: "CLU® Chartered",
    color: "#00BFFF"
  },
  {
    icon: "🏦",
    title: "Wealth Managers",
    desc: "Multi-million dollar portfolio management, alternative investments, private equity access, hedge fund strategies, and family office services.",
    credential: "CFA® Chartered",
    color: "#4169E1"
  }
];

const ADVISORS = [
  {
    name: "Robert Finley, CFP®",
    firm: "Athlete Wealth Partners",
    location: "New York, NY",
    rating: 4.9,
    reviews: 143,
    aum: "$340M",
    clients: 67,
    specialties: ["NFL/NBA Contracts", "Tax Strategy", "Real Estate", "Business Ventures"],
    certifications: ["CFP", "CFA", "AFPA"],
    bio: "Former Wall Street analyst turned athlete financial advisor. Manages $340M in athlete assets. Specializes in protecting first-generation wealth for professional athletes.",
    featured: true,
    available: true,
    sports: ["NFL", "NBA", "MLB"]
  },
  {
    name: "Angela Brooks, CPA",
    firm: "Brooks Sports Tax Group",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 98,
    aum: "$180M",
    clients: 52,
    specialties: ["NIL Tax Strategy", "Multi-State Filing", "Jock Tax", "Business Formation"],
    certifications: ["CPA", "EA"],
    bio: "Nationally recognized sports tax expert. Has filed taxes for over 200 professional and college athletes. NIL compliance specialist.",
    featured: false,
    available: true,
    sports: ["College", "NFL", "NBA", "MLB"]
  },
  {
    name: "Marcus Webb, CFA®",
    firm: "Webb Capital Management",
    location: "Chicago, IL",
    rating: 4.9,
    reviews: 71,
    aum: "$520M",
    clients: 38,
    specialties: ["Portfolio Management", "Private Equity", "Real Estate", "Retirement Planning"],
    certifications: ["CFA", "CFP", "CIMA"],
    bio: "20-year veteran managing athlete portfolios. Former NFL player himself — understands the unique financial challenges of a sports career.",
    featured: true,
    available: false,
    sports: ["NFL", "NBA", "NHL", "MLB"]
  },
  {
    name: "Dr. Priya Sharma, CFP®",
    firm: "Elite Athlete Financial Group",
    location: "Miami, FL",
    rating: 4.7,
    reviews: 56,
    aum: "$95M",
    clients: 44,
    specialties: ["NIL Planning", "College Athlete Finances", "Scholarship Optimization", "First Contract"],
    certifications: ["CFP", "ChFC"],
    bio: "Specializes in college athletes transitioning to professional careers. Expert in NIL financial planning, scholarship implications, and first professional contract analysis.",
    featured: false,
    available: true,
    sports: ["College", "Emerging Pro"]
  }
];

const WEALTH_STAGES = [
  {
    stage: "College Athlete",
    icon: "🎓",
    income: "$0 – $500K/yr (NIL)",
    priorities: ["NIL tax compliance", "Budget basics", "Emergency fund", "Credit building"],
    mistakes: ["Spending NIL money without tax planning", "No emergency fund", "Co-signing loans"],
    color: "#1E90FF"
  },
  {
    stage: "Rookie / First Contract",
    icon: "🌟",
    income: "$500K – $5M/yr",
    priorities: ["Tax strategy", "Emergency fund (2 yrs expenses)", "Disability insurance", "Basic investment portfolio"],
    mistakes: ["Overspending on lifestyle", "Trusting family with finances", "No disability insurance"],
    color: "#00BFFF"
  },
  {
    stage: "Established Pro",
    icon: "💼",
    income: "$5M – $50M/yr",
    priorities: ["Diversified portfolio", "Real estate", "Business ventures", "Estate planning"],
    mistakes: ["Concentrated stock positions", "Bad business investments", "Ignoring estate planning"],
    color: "#4169E1"
  },
  {
    stage: "Max Contract / Elite",
    icon: "👑",
    income: "$50M+/yr",
    priorities: ["Family office setup", "Generational wealth", "Philanthropy", "Legacy planning"],
    mistakes: ["No family office", "Excessive entourage costs", "No succession plan"],
    color: "#1E90FF"
  },
  {
    stage: "Post-Career",
    icon: "🏆",
    income: "Investment income",
    priorities: ["Retirement income streams", "Second career", "Business ownership", "Mental health investment"],
    mistakes: ["No post-career income plan", "Selling assets too early", "Isolation and depression"],
    color: "#00BFFF"
  }
];

const NIL_TAX_RULES = [
  { rule: "NIL income is taxable", detail: "All NIL compensation — cash, merchandise, services — is taxable income. Must be reported on Schedule C or as self-employment income." },
  { rule: "Quarterly estimated taxes", detail: "NIL earners must pay quarterly estimated taxes (April 15, June 15, September 15, January 15) to avoid underpayment penalties." },
  { rule: "Multi-state filing", detail: "If you compete in multiple states, you may owe taxes in each state. Jock tax applies to pro athletes; college athletes face similar rules in some states." },
  { rule: "Business entity advantages", detail: "Setting up an LLC or S-Corp for NIL income can reduce self-employment taxes and create deductible business expenses." },
  { rule: "Scholarship not taxable", detail: "Athletic scholarships covering tuition, fees, books, and room/board are generally not taxable. NIL income above scholarship value is taxable." },
  { rule: "Agent/advisor fees deductible", detail: "Fees paid to financial advisors, agents, and accountants for NIL-related work may be deductible as business expenses." }
];

const CONTRACT_TERMS = [
  { term: "Guaranteed Money", def: "Money the team must pay regardless of injury, performance, or roster decisions. The most important number in any contract." },
  { term: "Signing Bonus", def: "Upfront payment upon signing. Often prorated over the contract length for salary cap purposes. Fully guaranteed in most cases." },
  { term: "Roster Bonus", def: "Payment triggered when a player is on the roster at a specific date. Not always guaranteed — can be cut to avoid payment." },
  { term: "Incentive Clauses", def: "Performance-based bonuses (LTBE vs NLTBE). Likely-to-be-earned incentives count against the salary cap; unlikely ones do not." },
  { term: "Void Years", def: "Fake contract years that accelerate dead cap money if a player is released. Used to spread cap hits across future years." },
  { term: "No-Trade Clause", def: "Contractual protection preventing the team from trading the player without consent. Full or partial NTC options available." },
  { term: "Deferred Compensation", def: "Salary paid after the contract period ends. Can reduce current-year tax burden but creates future tax liability." },
  { term: "Option Year", def: "A team or player option to extend the contract at a predetermined salary. Provides flexibility for both sides." }
];

export default function FinancialAdvisor() {
  const [activeTab, setActiveTab] = useState("advisors");
  const [expandedAdvisor, setExpandedAdvisor] = useState<number | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  const tabs = [
    { id: "advisors", label: "Find Advisors", icon: "👤" },
    { id: "stages", label: "Wealth Stages", icon: "📈" },
    { id: "nil-tax", label: "NIL Tax Guide", icon: "🧾" },
    { id: "contracts", label: "Contract Terms", icon: "📋" },
    { id: "categories", label: "Advisor Types", icon: "🏦" }
  ];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#0a0f1e] text-white pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#0a0f1e] border-b border-blue-900/40 px-4 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,144,255,0.12),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#4169E1] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                💰
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E90FF] tracking-widest uppercase mb-1">AthlynX Financial OS</div>
                <h1 className="text-3xl font-black text-white">Financial Advisor Hub</h1>
              </div>
            </div>
            <p className="text-blue-200 text-lg mb-6 max-w-2xl">
              The complete athlete financial ecosystem. From your first NIL deal to generational wealth — find certified advisors, understand your contracts, and build a legacy that outlasts your career.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">$340M+</span> in athlete assets managed
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">200+</span> certified advisors
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">All sports</span> covered
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-400 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-20 bg-[#0a0f1e]/95 backdrop-blur border-b border-blue-900/40 px-4">
          <div className="max-w-4xl mx-auto flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1E90FF] text-white shadow-lg shadow-blue-500/30"
                    : "text-blue-300 hover:text-white hover:bg-blue-900/30"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* ADVISORS TAB */}
          {activeTab === "advisors" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Certified Athlete Financial Advisors</h2>
                <span className="text-xs text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">200+ nationwide</span>
              </div>
              {ADVISORS.map((advisor, i) => (
                <div key={i} className={`bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border rounded-2xl overflow-hidden transition-all ${
                  advisor.featured ? "border-[#1E90FF]/50 shadow-lg shadow-blue-500/10" : "border-blue-900/40"
                }`}>
                  {advisor.featured && (
                    <div className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] px-4 py-1 text-xs font-black text-white tracking-wider">
                      ⭐ FEATURED ADVISOR
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF]/20 to-[#4169E1]/20 border border-[#1E90FF]/30 flex items-center justify-center text-2xl flex-shrink-0">
                          👤
                        </div>
                        <div>
                          <h3 className="text-white font-black text-lg">{advisor.name}</h3>
                          <div className="text-[#1E90FF] text-sm font-bold">{advisor.firm}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-blue-400">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{advisor.location}</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-blue-400 fill-blue-400" />{advisor.rating} ({advisor.reviews})</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        advisor.available ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        {advisor.available ? "Available" : "Waitlist"}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                      <div className="bg-[#0a0f1e] rounded-xl p-3">
                        <div className="text-[#1E90FF] font-black text-lg">{advisor.aum}</div>
                        <div className="text-blue-400 text-xs">Assets Managed</div>
                      </div>
                      <div className="bg-[#0a0f1e] rounded-xl p-3">
                        <div className="text-[#1E90FF] font-black text-lg">{advisor.clients}</div>
                        <div className="text-blue-400 text-xs">Active Clients</div>
                      </div>
                      <div className="bg-[#0a0f1e] rounded-xl p-3">
                        <div className="text-[#1E90FF] font-black text-lg">{advisor.certifications.length}</div>
                        <div className="text-blue-400 text-xs">Certifications</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {advisor.specialties.map((s, j) => (
                        <span key={j} className="px-2 py-1 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-lg text-xs text-blue-300">{s}</span>
                      ))}
                    </div>

                    <button
                      onClick={() => setExpandedAdvisor(expandedAdvisor === i ? null : i)}
                      className="flex items-center gap-2 text-[#1E90FF] text-sm font-bold mt-3 hover:text-white transition-colors"
                    >
                      {expandedAdvisor === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {expandedAdvisor === i ? "Show Less" : "View Full Profile"}
                    </button>

                    {expandedAdvisor === i && (
                      <div className="mt-4 space-y-3 border-t border-blue-900/40 pt-4">
                        <p className="text-blue-200 text-sm">{advisor.bio}</p>
                        <div>
                          <div className="text-xs text-blue-400 mb-2">Sports Served:</div>
                          <div className="flex flex-wrap gap-2">
                            {advisor.sports.map((s, j) => (
                              <span key={j} className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-blue-400 mb-2">Credentials:</div>
                          <div className="flex flex-wrap gap-2">
                            {advisor.certifications.map((c, j) => (
                              <span key={j} className="px-2 py-1 bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-lg text-xs text-[#1E90FF] font-bold">{c}</span>
                            ))}
                          </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity">
                          Request Consultation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WEALTH STAGES TAB */}
          {activeTab === "stages" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Athlete Wealth Stages</h2>
                <p className="text-blue-300 text-sm">Every stage of your career requires a different financial strategy. Know where you are — and where you're going.</p>
              </div>
              {WEALTH_STAGES.map((stage, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF]/20 to-[#4169E1]/20 border border-[#1E90FF]/30 flex items-center justify-center text-2xl">
                      {stage.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg">{stage.stage}</h3>
                      <div className="text-[#1E90FF] text-sm font-bold">{stage.income}</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-green-400 mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> PRIORITIES</div>
                      <ul className="space-y-1">
                        {stage.priorities.map((p, j) => (
                          <li key={j} className="text-blue-200 text-sm flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-[#1E90FF] mt-0.5 flex-shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> COMMON MISTAKES</div>
                      <ul className="space-y-1">
                        {stage.mistakes.map((m, j) => (
                          <li key={j} className="text-blue-200 text-sm flex items-start gap-2">
                            <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NIL TAX TAB */}
          {activeTab === "nil-tax" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NIL Tax Guide for College Athletes</h2>
                <p className="text-blue-300 text-sm">NIL income changed everything. Here's what every college athlete needs to know about taxes.</p>
              </div>
              <div className="bg-gradient-to-br from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-bold">Critical: NIL Income Is Taxable</h3>
                </div>
                <p className="text-blue-200 text-sm">Since July 1, 2021, college athletes can earn NIL income. Unlike scholarships, NIL compensation is fully taxable. Failure to report NIL income can result in penalties, back taxes, and interest from the IRS.</p>
              </div>
              {NIL_TAX_RULES.map((rule, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1E90FF]/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-[#1E90FF]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{rule.rule}</h3>
                      <p className="text-blue-300 text-sm mt-1">{rule.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">2025–2026 NIL Tax Deadlines</h3>
                <div className="space-y-2">
                  {[
                    { date: "April 15, 2026", event: "Q1 estimated taxes due (Jan–Mar income)" },
                    { date: "June 16, 2026", event: "Q2 estimated taxes due (Apr–May income)" },
                    { date: "September 15, 2026", event: "Q3 estimated taxes due (Jun–Aug income)" },
                    { date: "January 15, 2027", event: "Q4 estimated taxes due (Sep–Dec income)" },
                    { date: "April 15, 2027", event: "Annual tax return due (or extension)" }
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-blue-900/30 last:border-0">
                      <span className="text-[#1E90FF] font-bold text-sm">{d.date}</span>
                      <span className="text-blue-200 text-sm">{d.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTRACT TERMS TAB */}
          {activeTab === "contracts" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Contract Financial Glossary</h2>
                <p className="text-blue-300 text-sm">Understand every dollar in your contract before you sign. These terms can mean millions of dollars difference.</p>
              </div>
              {CONTRACT_TERMS.map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedTerm(expandedTerm === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1E90FF]/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#1E90FF]" />
                      </div>
                      <span className="text-white font-bold">{item.term}</span>
                    </div>
                    {expandedTerm === i ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400" />}
                  </button>
                  {expandedTerm === i && (
                    <div className="px-4 pb-4">
                      <p className="text-blue-200 text-sm">{item.def}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ADVISOR TYPES TAB */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Types of Financial Advisors</h2>
                <p className="text-blue-300 text-sm">Not all financial advisors are the same. Know which type you need for your situation.</p>
              </div>
              <div className="grid gap-4">
                {ADVISOR_CATEGORIES.map((cat, i) => (
                  <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF]/20 to-[#4169E1]/20 border border-[#1E90FF]/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {cat.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="text-white font-black">{cat.title}</h3>
                          <span className="px-2 py-1 bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-lg text-xs text-[#1E90FF] font-bold">{cat.credential}</span>
                        </div>
                        <p className="text-blue-200 text-sm mt-2">{cat.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="text-white font-black text-xl mb-2">Build Your Financial Legacy</h3>
            <p className="text-blue-200 text-sm mb-4">Connect with a certified athlete financial advisor today. Your career is your business — run it like one.</p>
            <button className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30">
              Get Matched with an Advisor
            </button>
            <div className="text-xs text-blue-400 mt-3 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
