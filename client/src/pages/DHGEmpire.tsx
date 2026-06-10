import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useState } from 'react';
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from 'wouter';
import {
  Building2, Users, Cpu, Home, Utensils, Wine, Heart, TreePine, Zap, Database,
  Globe, Trophy, Dumbbell, Shield, Briefcase,
  Server, TrendingUp, Target, Crown, Star, Rocket, MapPin, Mail,
  ArrowRight, CheckCircle2, Layers, BarChart3, Bitcoin, Coins, Leaf, GraduationCap, Phone, Landmark
} from 'lucide-react';

const CDN = "/";

type Division = 'all' | 'sports' | 'technology' | 'realestate' | 'hospitality' | 'healthcare' | 'finance' | 'trading';

interface Company {
  name: string;
  shortName: string;
  division: Division;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'development' | 'planned';
  link?: string;
  highlight?: string;
  logo?: string;
}

const COMPANIES: Company[] = [
  {
    name: "AthlynXAI Corporation",
    shortName: "AthlynX",
    division: "sports",
    tagline: "The Athlete's Playbook",
    description: "Complete athlete ecosystem: NIL deals, transfer portal, AI recruiting, training, messaging — all in one platform. The crown jewel of the DHG empire.",
    icon: <Trophy className="w-6 h-6" />,
    status: "active",
    link: "/",
    highlight: "FLAGSHIP",
    logo: "/athlynx-icon.png",
  },
  {
    name: "Diamond Grind Baseball",
    shortName: "Diamond Grind",
    division: "sports",
    tagline: "Grind Harder. Play Smarter.",
    description: "White-label baseball platform with player rankings, tournaments, training programs, and recruiting pipelines for coaches and athletes.",
    icon: <Dumbbell className="w-6 h-6" />,
    status: "active",
    link: "/diamond-grind",
    logo: "/images/logos/dhg-logo.png",
  },
  {
    name: "Warriors Playbook",
    shortName: "Warriors",
    division: "sports",
    tagline: "Strategy. Film. Victory.",
    description: "The digital playbook for coaches and teams. Film room, play designer, and team strategy board — all in one platform.",
    icon: <Shield className="w-6 h-6" />,
    status: "active",
    link: "/warriors-playbook",
    logo: "/images/logos/dhg-logo.png",
  },
  {
    name: "NIL Portal Inc.",
    shortName: "NIL Portal",
    division: "sports",
    tagline: "Your NIL. Your Value.",
    description: "Dedicated NIL marketplace connecting athletes with brands, managing contracts, compliance, and monetization across all 50 states.",
    icon: <Star className="w-6 h-6" />,
    status: "active",
    link: "/nil-portal",
    logo: "/images/logos/dhg-logo.png",
  },
  {
    name: "Softmor Inc.",
    shortName: "Softmor",
    division: "technology",
    tagline: "Software That Moves Markets",
    description: "AI-powered enterprise software solutions, custom platform development, and the technical backbone powering the entire DHG ecosystem. The engine of the empire.",
    icon: <Cpu className="w-6 h-6" />,
    status: "active",
    highlight: "TECH ENGINE",
  },
  {
    name: "VC Technologies, LLC",
    shortName: "VC Tech",
    division: "technology",
    tagline: "Enterprise AI & Automation",
    description: "Enterprise-grade AI automation, machine learning pipelines, and intelligent business systems for Fortune 500 clients and growing companies.",
    icon: <Rocket className="w-6 h-6" />,
    status: "active",
  },
  {
    name: "VC Data Centers, LLC",
    shortName: "VC Data Centers",
    division: "technology",
    tagline: "Power. Speed. Reliability.",
    description: "Custom GPU server infrastructure and cloud computing solutions. Tier-4 data center operations supporting AI workloads and enterprise applications.",
    icon: <Server className="w-6 h-6" />,
    status: "development",
    logo: "/images/logos/dhg-logo.png",
  },
  {
    name: "VC Energy, LLC",
    shortName: "VC Energy",
    division: "technology",
    tagline: "Clean Power for the Digital Age",
    description: "Low-cost geothermal power generation supplying clean energy to DHG real estate projects and data centers — reducing costs and carbon footprint.",
    icon: <Zap className="w-6 h-6" />,
    status: "development",
  },
  {
    name: "aibotecosys",
    shortName: "AIBotEcosys",
    division: "technology",
    tagline: "AI Ecosystem",
    description: "The AI automation ecosystem powering the next generation of athlete and business intelligence across the entire DHG portfolio.",
    icon: <Database className="w-6 h-6" />,
    status: "active",
    link: "https://athlynx.ai",
  },
  {
    name: "The VIRT, LLC",
    shortName: "VIRT",
    division: "finance",
    tagline: "Tokenized Mining Exposure",
    description: "Proprietary cryptocurrency with tokenized mining exposure and smart contract rewards. Bitcoin mining facility with 97% uptime and immersion cooling.",
    icon: <Bitcoin className="w-6 h-6" />,
    status: "active",
    link: "/bitcoin-mining",
    highlight: "BITCOIN MINING",
  },
  {
    name: "Uma Real Estate Investment, LLC",
    shortName: "UMA Real Estate",
    division: "realestate",
    tagline: "Land. Build. Grow.",
    description: "Strategic land acquisitions and development for DHG businesses near Livingston and the Trinity River corridor in Texas.",
    icon: <Building2 className="w-6 h-6" />,
    status: "active",
  },
  {
    name: "VC Residential, LLC",
    shortName: "VC Residential",
    division: "realestate",
    tagline: "Homes That Build Wealth",
    description: "Residential real estate investments, development, and management across high-growth Texas markets.",
    icon: <Home className="w-6 h-6" />,
    status: "active",
  },
  {
    name: "Serenity Memorial Services",
    shortName: "Serenity",
    division: "realestate",
    tagline: "Dignity. Care. Legacy.",
    description: "$13B funeral industry opportunity — first funeral home in Orange Beach, Alabama. Serving families with compassion and dignity.",
    icon: <Leaf className="w-6 h-6" />,
    status: "development",
    link: "/serenity-memorial",
    highlight: "$650K INVESTMENT",
  },
  {
    name: "Villa Agape, LLC",
    shortName: "Villa Agape",
    division: "healthcare",
    tagline: "Healing. Home. Hope.",
    description: "Home-away-from-home residences for patients in long recovery, with IoT health monitoring and the kind of dignity hospitals can't always give.",
    icon: <Heart className="w-6 h-6" />,
    status: "development",
    highlight: "MISSION",
  },
  {
    name: "Compassionate Care, LLC",
    shortName: "Compassionate Care",
    division: "healthcare",
    tagline: "Care Without Compromise",
    description: "On-site clinic at Villa Agape providing daily care, health monitoring, and medical services to residents.",
    icon: <Heart className="w-6 h-6" />,
    status: "development",
  },
  {
    name: "Pisces Resort, LLC",
    shortName: "Pisces Resort",
    division: "hospitality",
    tagline: "Luxury in the Wild",
    description: "Luxury resort with spa, gym, swimming, fishing, and premium prefab cabin accommodations on the Trinity River.",
    icon: <TreePine className="w-6 h-6" />,
    status: "planned",
  },
  {
    name: "Venus Venue & Vineyard, LLC",
    shortName: "Venus Venue",
    division: "hospitality",
    tagline: "Where Love Meets Legacy",
    description: "Stunning wedding venue with glass chapel, premium event hosting, and award-winning wine production.",
    icon: <Wine className="w-6 h-6" />,
    status: "planned",
  },
  {
    name: "Pomodoro Restaurant, LLC",
    shortName: "Pomodoro",
    division: "hospitality",
    tagline: "Italian Excellence",
    description: "Award-winning Italian fine dining with luxury catering and full-service event capabilities.",
    icon: <Utensils className="w-6 h-6" />,
    status: "planned",
  },
  {
    name: "The Silk Road Trading, LLC",
    shortName: "Silk Road",
    division: "trading",
    tagline: "Global Sourcing. Maximum Profit.",
    description: "Worldwide product sourcing and trading with strong profit outlooks. Connecting global markets to DHG business needs.",
    icon: <Globe className="w-6 h-6" />,
    status: "active",
  },
  {
    name: "VC Global, LLC",
    shortName: "VC Global",
    division: "trading",
    tagline: "International Trade & Expansion",
    description: "International trade partnerships, import/export operations, and global market expansion across Asia, Europe, and the Americas.",
    icon: <TrendingUp className="w-6 h-6" />,
    status: "development",
  },
];

const DIVISIONS = [
  { id: "all", label: "All Companies", icon: <Layers className="w-4 h-4" />, color: "from-blue-500 to-indigo-600" },
  { id: "sports", label: "Sports & Media", icon: <Trophy className="w-4 h-4" />, color: "from-cyan-500 to-blue-600" },
  { id: "technology", label: "Technology", icon: <Cpu className="w-4 h-4" />, color: "from-blue-600 to-blue-700" },
  { id: "finance", label: "Finance & Crypto", icon: <Bitcoin className="w-4 h-4" />, color: "from-red-500 to-red-600" },
  { id: "realestate", label: "Real Estate", icon: <Building2 className="w-4 h-4" />, color: "from-emerald-500 to-green-600" },
  { id: "healthcare", label: "Healthcare", icon: <Heart className="w-4 h-4" />, color: "from-red-500 to-red-600" },
  { id: "hospitality", label: "Hospitality", icon: <TreePine className="w-4 h-4" />, color: "from-red-500 to-red-600" },
  { id: "trading", label: "Global Trading", icon: <Globe className="w-4 h-4" />, color: "from-teal-500 to-cyan-600" },
];

const STATS = [
  { value: "20+", label: "Companies", sub: "Across 7 Divisions", icon: <Building2 className="w-5 h-5" /> },
  { value: "50K+", label: "Athletes Served", sub: "And Growing", icon: <Users className="w-5 h-5" /> },
  { value: "$12M+", label: "NIL Value", sub: "Deals Closed", icon: <BarChart3 className="w-5 h-5" /> },
  { value: "99.9%", label: "Uptime", sub: "Global Infrastructure", icon: <Shield className="w-5 h-5" /> },
];

const LEADERSHIP = [
  { name: "Chad A. Dozier", title: "Founder & CEO", initials: "CD", bio: "Founder and driving force behind DHG. Chad built this company in Houston in November 2024 — the long way, the honest way.", color: "from-blue-500 to-cyan-500", phone: "", email: "contact@athlynx.ai" },
  { name: "Lee Marshall", title: "Sales & Partnerships", initials: "LM", bio: "Business partner and relationship builder supporting athlete outreach, revenue growth, and The Athlete’s Playbook momentum.", color: "from-red-500 to-red-500", phone: "", email: "lmarshall@athlynx.ai" },
  { name: "Glenn Tse", title: "Finance & Operations", initials: "GT", bio: "Co-founder and financial architect supporting operations, governance, and controlled growth across the DHG portfolio.", color: "from-emerald-500 to-teal-500", phone: "", email: "contact@athlynx.ai" },

];

const statusConfig = {
  active: { label: "ACTIVE", bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
  development: { label: "IN DEVELOPMENT", bg: "bg-red-500/20", text: "text-red-400", dot: "bg-red-400" },
  planned: { label: "PLANNED", bg: "bg-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" },
};

const divisionGradients: Record<string, string> = {
  sports: "from-cyan-900/40 to-blue-900/20 border-cyan-800/40",
  technology: "from-blue-950/40 to-blue-950/20 border-blue-900/40",
  finance: "from-red-900/40 to-red-900/20 border-red-800/40",
  realestate: "from-emerald-900/40 to-green-900/20 border-emerald-800/40",
  healthcare: "from-red-900/40 to-red-900/20 border-red-800/40",
  hospitality: "from-red-900/40 to-red-900/20 border-red-800/40",
  trading: "from-teal-900/40 to-cyan-900/20 border-teal-800/40",
};

function DHGEmpireInner() {
  const [activeDiv, setActiveDiv] = useState<Division>("all");
  const filtered = activeDiv === "all" ? COMPANIES : COMPANIES.filter(c => c.division === activeDiv);
  const activeCount = COMPANIES.filter(c => c.status === "active").length;

  return (
    <div className="min-h-screen bg-[#060d1f] text-white">
      {/* Gold top accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f4a] to-[#060d1f]" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(0,102,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.10) 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-red-500/20 blur-xl scale-150" />
                <img src={"/logos/dhg-crab-logo.png"} alt="Dozier Holdings Group" className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover shadow-2xl border-2 border-red-500/50" />
              </div>
            </div>
            <div className="text-red-400 text-xs sm:text-sm uppercase tracking-[0.4em] font-bold mb-3">Dozier Holdings Group</div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-none">THE DHG EMPIRE</h1>
            <div className="text-blue-300 text-lg sm:text-xl font-semibold mb-6 tracking-wide">Iron Sharpens Iron</div>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-8" />
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Founded in Houston, Texas — November 2024. Built by a group who refused to let adversity define them. Today, <strong className="text-white">20+ companies</strong> across 7 divisions form one unified family of brands.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {STATS.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-center mb-2 text-red-400">{s.icon}</div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
                  <div className="text-white/80 text-sm font-semibold">{s.label}</div>
                  <div className="text-white/40 text-xs">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Origin Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-[#0a1628] to-[#0d1f4a] border border-red-500/20 rounded-3xl p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-bold mb-3">About DHG</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">A holding company<br />for the brands<br />we actually use.</h2>
              <div className="space-y-4 text-blue-200 text-base leading-relaxed">
                <p>Dozier Holdings Group is a private holding company headquartered in Houston, Texas. Founded November 2024.</p>
                <p><strong className="text-white">AthlynX</strong> is the flagship — sports media and a data platform for athletes from youth ball to the retirement chapter. <strong className="text-white">Softmor Inc.</strong> is the software arm. Other subsidiaries cover NIL, transfer-portal tools, and military family programs.</p>
                <p>We're not trying to be the biggest. We're trying to build the stuff well, on a timeline that respects the people using it.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Crown className="w-6 h-6" />, title: "One Vision", desc: "Every company serves one unified mission: empower athletes and build generational wealth." },
                { icon: <Shield className="w-6 h-6" />, title: "Built to Last", desc: "Each subsidiary is designed for long-term value creation, not short-term gains." },
                { icon: <Target className="w-6 h-6" />, title: "Precision Execution", desc: "Military-grade discipline applied to every business decision across the portfolio." },
                { icon: <Rocket className="w-6 h-6" />, title: "Unstoppable Growth", desc: "From 0 to 20+ companies in under 12 months. The empire is just getting started." },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-red-400 mb-3">{item.icon}</div>
                  <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                  <div className="text-blue-300 text-xs leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Companies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-10">
          <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-bold mb-3">The Portfolio</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">All DHG Companies</h2>
          <p className="text-blue-300 text-base max-w-xl mx-auto">{activeCount} active companies. 20+ total. Every one built with purpose.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {DIVISIONS.map(div => (
            <button key={div.id} onClick={() => setActiveDiv(div.id as Division)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeDiv === div.id ? `bg-gradient-to-r ${div.color} text-white shadow-lg scale-105` : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"}`}>
              {div.icon}{div.label}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((company, i) => {
            const sc = statusConfig[company.status];
            const dg = divisionGradients[company.division] || "from-blue-900/40 to-indigo-900/20 border-blue-800/40";
            const inner = (
              <div className={`group relative bg-gradient-to-br ${dg} border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/30 h-full ${company.link ? "cursor-pointer" : ""}`}>
                {company.highlight && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">{company.highlight}</span>
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {company.logo ? <img src={company.logo} alt={company.shortName} className="w-10 h-10 object-cover rounded-lg" /> : <div className="text-white/70">{company.icon}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
                    <div className="text-white/50 text-xs mt-0.5">{company.tagline}</div>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{company.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                  </span>
                  {company.link && <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />}
                </div>
              </div>
            );
            if (!company.link) return <div key={i}>{inner}</div>;
            if (company.link.startsWith("http")) return <a key={i} href={company.link} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>;
            return <Link key={i} href={company.link} className="block">{inner}</Link>;
          })}
        </div>
      </div>

      {/* Leadership */}
      <div className="bg-gradient-to-b from-[#060d1f] to-[#0a1628] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-bold mb-3">The Team</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Leadership</h2>
            <p className="text-blue-300 text-base max-w-xl mx-auto">The team that built an empire from a hospital room.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEADERSHIP.map((leader, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${leader.color} flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg`}>{leader.initials}</div>
                <div className="text-white font-bold text-base mb-1">{leader.name}</div>
                <div className="text-red-400 text-xs font-semibold mb-3 uppercase tracking-wide">{leader.title}</div>
                <p className="text-white/50 text-xs leading-relaxed mb-3">{leader.bio}</p>
                {leader.phone && <div className="text-white/30 text-xs flex items-center justify-center gap-1"><Phone className="w-3 h-3" />{leader.phone}</div>}
                {leader.email && <div className="text-blue-400/60 text-xs flex items-center justify-center gap-1 mt-1"><Mail className="w-3 h-3" />{leader.email}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #dc2626 0%, transparent 70%)" }} />
          <div className="relative">
            <Crown className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">One Mission. One Empire.</h2>
            <p className="text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto mb-8">Every company in the DHG portfolio exists to create opportunity, build generational wealth, and prove that adversity is not an obstacle — it is the foundation.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {["Houston, TX — Founded 2024", "20+ Active Companies", "7 Industry Divisions", "Global Reach"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={"/logos/dhg-crab-logo.png"} alt="DHG" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <div className="text-white font-black text-lg">Dozier Holdings Group</div>
                <div className="text-white/40 text-sm">Houston, TX · Est. 2024</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="mailto:contact@athlynx.ai" className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors"><Mail className="w-4 h-4" />contact@athlynx.ai</a>
              <a href="https://dozierholdingsgroup.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors"><Globe className="w-4 h-4" />dozierholdingsgroup.com</a>
              <span className="flex items-center gap-2 text-white/40"><MapPin className="w-4 h-4" />Houston, TX</span>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function DHGEmpire() {
  return <RouteErrorBoundary><DHGEmpireInner /></RouteErrorBoundary>;
}
