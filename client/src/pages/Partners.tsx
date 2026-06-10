import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Handshake, Users, DollarSign, BarChart3, Shield, Zap, Globe, Code, Building, Star, CheckCircle, ArrowRight, Server, Cpu, Mail, Database, Cloud, GitBranch, Lock, Workflow } from "lucide-react";

const TECH_STACK = [
  { name: "Athlete Intelligence", category: "Platform Capability", role: "Private intelligence layer for recruiting, NIL, training, and athlete growth workflows.", status: "LIVE", color: "from-blue-700 to-blue-800", badge: "OS" },
  { name: "Recruiting Presence", category: "Athlete Growth", role: "Profiles, media, visibility, and coach-facing presentation built into one athlete journey.", status: "LIVE", color: "from-cyan-600 to-blue-700", badge: "GROW" },
  { name: "NIL Readiness", category: "Commerce", role: "Prepared for memberships, credits, brand opportunities, licensing, and partner programs.", status: "LIVE", color: "from-indigo-600 to-blue-700", badge: "NIL" },
  { name: "Transfer Pathway", category: "Athlete Growth", role: "Designed to help athletes improve visibility, compare opportunities, and move toward better fit.", status: "LIVE", color: "from-green-500 to-teal-600", badge: "PATH" },
  { name: "Secure Data Foundation", category: "Protected Operations", role: "User, athlete, and business information handled through controlled internal systems.", status: "LIVE", color: "from-blue-700 to-blue-900", badge: "DATA" },
  { name: "Media & Content", category: "Platform Capability", role: "Video, profiles, highlights, stories, and brand-facing content workflows.", status: "LIVE", color: "from-orange-500 to-red-600", badge: "MEDIA" },
  { name: "Communication Layer", category: "Platform Capability", role: "Messaging, alerts, scheduling, and relationship workflows for platform users.", status: "LIVE", color: "from-red-600 to-red-700", badge: "COMM" },
  { name: "Partner Inquiry", category: "Partnerships", role: "Approved partners can request deeper conversations without exposing the operating blueprint publicly.", status: "LIVE", color: "from-slate-600 to-gray-700", badge: "PARTNER" },
  { name: "Protected Architecture", category: "Protected Operations", role: "The revolutionary system is visible; vendors, routing, accounts, code paths, and implementation details stay private.", status: "LIVE", color: "from-gray-700 to-slate-800", badge: "LOCK" },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Platform Capability": Cpu,
  "Athlete Growth": Star,
  "Commerce": DollarSign,
  "Protected Operations": Shield,
  "Partnerships": Handshake,
};

const BADGE_COLORS: Record<string, string> = {
  OS: "bg-blue-700",
  GROW: "bg-cyan-600",
  NIL: "bg-indigo-600",
  PATH: "bg-green-600",
  DATA: "bg-teal-600",
  MEDIA: "bg-orange-600",
  COMM: "bg-red-600",
  PARTNER: "bg-slate-600",
  LOCK: "bg-gray-700",
};

const PARTNER_TIERS = [
  { name: "Affiliate", commission: "10%", requirements: "No minimum", benefits: ["Referral tracking", "Monthly payouts", "Marketing materials"], color: "from-slate-500 to-gray-600" },
  { name: "Silver", commission: "15%", requirements: "$5K/month revenue", benefits: ["Everything in Affiliate", "Dedicated support", "Co-marketing opportunities"], color: "from-slate-400 to-slate-500" },
  { name: "Gold", commission: "20%", requirements: "$25K/month revenue", benefits: ["Everything in Silver", "API access", "White-label options", "Priority features"], color: "from-red-500 to-red-500" },
  { name: "Platinum", commission: "25%", requirements: "$100K/month revenue", benefits: ["Everything in Gold", "Revenue share", "Board advisory", "Equity options"], color: "from-cyan-400 to-blue-500" },
];

function PartnersInner() {
  const categories = Array.from(new Set(TECH_STACK.map(p => p.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060e24] via-[#0d1b3e] to-[#060e24] text-white">
      {/* Header */}
      <header className="bg-[#080d1a]/90 border-b border-blue-900 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/athlynx-sports-brand.png" alt="AthlynX™" className="h-10 w-10 rounded-xl object-contain" />
              <div>
                <div className="text-white font-black text-lg">AthlynX™</div>
                <div className="text-blue-400 text-xs">A Dozier Holdings Group™ Company</div>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/investor-hub">
              <button className="text-blue-400 hover:text-white px-4 py-2 text-sm transition-colors">Investor Hub</button>
            </Link>
            <Link href="/">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                ← Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,100,255,0.15)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-black tracking-widest uppercase mb-6">
            <Handshake className="w-4 h-4" />
Partners & Platform Inquiry
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white">
            REVOLUTIONARY<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AthlynXAI OS</span>
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            AthlynX™ is built on a protected operating blueprint. Public visitors can see the vision and partner categories; the vendors, routing, accounts, and implementation details stay private.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:contact@athlynx.ai" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-black text-lg flex items-center gap-2 hover:scale-105 transition-transform">
              Become a Partner <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/investor-hub">
              <button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-white/20 transition-colors">
                Investor Hub
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Partnership Card */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-slate-800/80 to-gray-900/80 border-2 border-slate-500/50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center">
              <Server className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-black px-3 py-1 rounded-full">PARTNER INQUIRY</span>
                <span className="bg-slate-600/40 text-slate-300 text-xs font-bold px-2 py-1 rounded">PRIVATE REVIEW</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-2">Strategic Partner Pathway</h3>
              <p className="text-slate-300 mb-4">AthlynXAI evaluates strategic partners through private conversations. The public site explains the opportunity without publishing the internal technology blueprint.</p>
              <div className="flex flex-wrap gap-2">
                {["Athlete Growth", "NIL Readiness", "Private Architecture", "Secure Operations", "Partner Inquiry", "National Scale"].map(tag => (
                  <span key={tag} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-lg">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <a href="mailto:cdozier@dozierholdingsgroup.com" className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-black transition-all block text-center">Request Review →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-4 bg-white/5 border-y border-blue-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-3xl font-black text-cyan-400">Private</div><div className="text-blue-300 text-sm">Architecture</div></div>
          <div><div className="text-3xl font-black text-red-400">$180M+</div><div className="text-blue-300 text-sm">Market Opportunity</div></div>
          <div><div className="text-3xl font-black text-green-400">15+</div><div className="text-blue-300 text-sm">Sport Platforms</div></div>
          <div><div className="text-3xl font-black text-blue-500">7</div><div className="text-blue-300 text-sm">Days Since Launch</div></div>
        </div>
      </section>

      {/* Full Tech Stack Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-xs font-black tracking-widest uppercase mb-2">Protected Operating Categories</p>
            <h2 className="text-4xl font-black text-white">Vision Public. Blueprint Private.</h2>
            <p className="text-blue-300 mt-2">The revolutionary AthlynXAI OS can be understood without revealing how it is built.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TECH_STACK.map((partner) => {
              const Icon = CATEGORY_ICONS[partner.category] || Code;
              return (
                <div key={partner.name} className="bg-white/5 border border-blue-900/50 hover:border-cyan-500/50 rounded-2xl p-5 transition-all hover:bg-white/10 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-lg text-white ${BADGE_COLORS[partner.badge] || 'bg-blue-600'}`}>
                      {partner.badge}
                    </span>
                  </div>
                  <h3 className="text-white font-black text-sm mb-1">{partner.name}</h3>
                  <p className="text-blue-400 text-xs mb-2">{partner.category}</p>
                  <p className="text-blue-300/70 text-xs leading-relaxed">{partner.role}</p>
                  <div className="mt-3 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-bold">LIVE</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="py-16 px-4 bg-white/5 border-y border-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-xs font-black tracking-widest uppercase mb-2">Revenue Share Program</p>
            <h2 className="text-4xl font-black text-white">Partner Tiers</h2>
            <p className="text-blue-300 mt-2">Earn commissions by growing the AthlynX™ ecosystem</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {PARTNER_TIERS.map((tier) => (
              <div key={tier.name} className="bg-[#080d1a] rounded-2xl p-6 border border-blue-900 hover:border-cyan-500/50 transition-all">
                <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${tier.color} mb-6`}></div>
                <h3 className="text-2xl font-black text-white mb-2">{tier.name}</h3>
                <p className="text-4xl font-black text-cyan-400 mb-1">{tier.commission}</p>
                <p className="text-blue-400 text-xs mb-4">Commission Rate</p>
                <p className="text-blue-500 text-xs mb-4">Requires: {tier.requirements}</p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-blue-200 text-xs">
                      <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API & Developer Access */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-blue-900">
              <Code className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-black mb-4 text-white">API Access</h3>
              <p className="text-blue-300 mb-6">
                Integrate AthlynX™ data into your applications. Access athlete profiles, NIL valuations, transfer portal data, and more.
              </p>
              <ul className="space-y-2 mb-6">
                {["Approved data access", "Partner onboarding", "Private technical review", "Workflow planning", "Commercial integration review"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-blue-200 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="mailto:contact@athlynx.ai" className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold inline-block transition-colors">
                Request API Access
              </a>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 border border-blue-900">
              <BarChart3 className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-black mb-4 text-white">Partner Dashboard</h3>
              <p className="text-blue-300 mb-6">
                Track your referrals, commissions, and performance in real-time. Access marketing materials and co-branded assets.
              </p>
              <ul className="space-y-2 mb-6">
                {["Real-time analytics", "Commission tracking", "Marketing asset library", "Co-branded materials", "Dedicated partner support"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-blue-200 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/crm">
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                  Partner Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-12 px-4 bg-white/5 border-y border-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2 text-white">Partner Across All Platforms</h2>
          <p className="text-blue-400 text-sm mb-8">Our growing domain portfolio</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["athlynx.ai", "nilportals.com", "nilportal.ai", "transferportal.ai", "athlynx.ai", "athlynx.ai", "athlynx.ai", "athlynx.ai"].map((domain) => (
              <span key={domain} className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500/40 text-cyan-300 px-4 py-2 rounded-lg font-bold text-sm">
                {domain}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Robotics — Coming Soon */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#0d0d1a] to-[#1a0d2e] border border-purple-500/30 rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(120,0,255,0.08)_0%,_transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-black tracking-widest uppercase mb-6">
                🤖 Robotics Division
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                THE FUTURE IS<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AUTONOMOUS</span>
              </h2>
              <p className="text-purple-200/70 text-lg max-w-2xl mx-auto mb-8">
                AthlynXAI is entering the robotics space — AI-powered companions for training facilities, stadiums, data centers, and beyond. Strategic partnerships are in active discussions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: "🏟️", title: "Stadium Operations", desc: "Autonomous security, logistics, and fan experience robots" },
                  { icon: "🏋️", title: "Training Companions", desc: "AI-powered athletic training and performance bots" },
                  { icon: "🏗️", title: "Data Center Bots", desc: "Automated facility management and infrastructure ops" },
                ].map(item => (
                  <div key={item.title} className="bg-white/5 border border-purple-500/20 rounded-xl p-5">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h4 className="text-white font-black mb-2">{item.title}</h4>
                    <p className="text-purple-300/60 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <span className="inline-block bg-purple-500/20 border border-purple-500/40 text-purple-300 font-black px-8 py-3 rounded-xl text-sm tracking-widest">COMING SOON — PARTNERSHIPS IN DISCUSSIONS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partnerships — Coming Soon */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-sm font-black tracking-widest uppercase mb-6">
              <Star className="w-4 h-4" />
              Strategic Partnerships
            </div>
            <h2 className="text-5xl font-black text-white mb-4">
              WELCOMING NEW<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">PARTNERSHIPS</span>
            </h2>
            <p className="text-blue-300 text-lg max-w-2xl mx-auto">
              AthlynX™ is actively building strategic alliances across sports brands, media, technology, retail, and data. All partnership categories are open.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { category: "Sports Brands & Apparel", icon: "👟", desc: "Gear, apparel, and equipment brands ready to reach the next generation of athletes." },
              { category: "Athletic Equipment", icon: "🏋️", desc: "Training equipment, performance tech, and recovery brands for elite athletes." },
              { category: "Sports Media & Broadcasting", icon: "📺", desc: "Media companies, streaming platforms, and broadcast networks." },
              { category: "Computer Hardware & Software", icon: "💻", desc: "Enterprise hardware, software licenses, and technology distribution partnerships." },
              { category: "Data Center Infrastructure", icon: "🏗️", desc: "Co-location, power, cooling, and data center construction partnerships." },
              { category: "NIL Brands & Sponsors", icon: "💰", desc: "Brands looking to connect directly with college and professional athletes for NIL deals." },
              { category: "Sports Agencies & Agents", icon: "🤝", desc: "Certified agents and agencies managing athlete careers and endorsements." },
              { category: "Universities & Athletic Programs", icon: "🎓", desc: "Colleges, universities, and athletic departments building the next generation." },
              { category: "Investors & Venture Capital", icon: "📈", desc: "Strategic investors aligned with the future of sports technology and athlete empowerment." },
            ].map((item) => (
              <div key={item.category} className="bg-gradient-to-br from-[#0d1b3e] to-[#080d1a] border border-blue-900/60 hover:border-red-500/50 rounded-2xl p-6 transition-all group relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black px-2 py-1 rounded-lg">COMING SOON</span>
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-black text-base mb-2">{item.category}</h3>
                <p className="text-blue-300/70 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-xs font-bold">Accepting Applications</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-red-600/10 to-red-600/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black text-white mb-3">Ready to Build Together?</h3>
            <p className="text-blue-300 mb-6 max-w-xl mx-auto">We are selectively onboarding founding partners across every category. First movers get preferred terms, co-branding, and revenue share.</p>
            <a href="mailto:contact@athlynx.ai?subject=Partnership%20Inquiry%20-%20AthlynX" className="inline-block bg-gradient-to-r from-red-500 to-red-500 text-black font-black px-10 py-4 rounded-xl text-lg hover:scale-105 transition-transform">
              Apply for Partnership →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-500/30 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-black mb-4 text-white">Ready to Partner with AthlynX™?</h2>
            <p className="text-blue-300 mb-8 max-w-2xl mx-auto">
              Join the ecosystem that's building the future of athlete success. Whether you're an investor, technology partner, sports agency, or brand — there's a place for you here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:contact@athlynx.ai" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform">
                Contact: contact@athlynx.ai
              </a>
              <Link href="/investor-hub">
                <button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-white/20 transition-colors">
                  View Investor Hub
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080d1a] border-t border-blue-900 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-blue-600 text-xs">
            © 2026 Dozier Holdings Group™. All Rights Reserved. AthlynX™ | The Athlete's Playbook™ are trademarks of Dozier Holdings Group™. Dreams Do Come True 2026.
          </p>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
export default function Partners() {
  return <RouteErrorBoundary><PartnersInner /></RouteErrorBoundary>;
}
