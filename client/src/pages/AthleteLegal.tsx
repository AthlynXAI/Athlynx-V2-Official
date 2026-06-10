import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import {
  Scale, FileText, Shield, AlertTriangle, CheckCircle,
  Star, MapPin, Calendar, ArrowRight, Award, Gavel,
  Lock, Globe, Users, DollarSign, Phone, Mail,
  BookOpen, Zap, Target, Search, Download
} from "lucide-react";

const LEGAL_SERVICES = [
  {
    icon: FileText,
    title: "NIL Contract Review",
    desc: "Every NIL deal reviewed by a sports attorney before you sign. Protect your eligibility and your money.",
    price: "From $149",
    color: "blue",
    popular: true
  },
  {
    icon: Shield,
    title: "Name & Image Protection",
    desc: "Trademark your name, image, and likeness. Stop unauthorized use of your brand before it costs you.",
    price: "From $299",
    color: "purple",
    popular: false
  },
  {
    icon: Scale,
    title: "Agent Contract Review",
    desc: "Know exactly what you're signing with your agent. Standard player-agent agreements reviewed and explained.",
    price: "From $199",
    color: "green",
    popular: false
  },
  {
    icon: Gavel,
    title: "Dispute Resolution",
    desc: "NIL deal gone wrong? Unpaid endorsements? We fight for what you're owed.",
    price: "Contingency",
    color: "red",
    popular: false
  },
  {
    icon: Globe,
    title: "Transfer Portal Legal",
    desc: "Understand your rights in the transfer portal. Eligibility, waivers, and scholarship protection.",
    price: "From $99",
    color: "cyan",
    popular: false
  },
  {
    icon: Lock,
    title: "Privacy & Social Media",
    desc: "DMCA takedowns, defamation, and social media legal protection for high-profile athletes.",
    price: "From $249",
    color: "yellow",
    popular: false
  },
  {
    icon: DollarSign,
    title: "Business Formation",
    desc: "Set up your LLC, S-Corp, or holding company the right way with full legal documentation.",
    price: "From $399",
    color: "orange",
    popular: false
  },
  {
    icon: BookOpen,
    title: "Endorsement Agreements",
    desc: "Full endorsement contract drafting and negotiation. Royalties, exclusivity, and performance clauses.",
    price: "From $499",
    color: "indigo",
    popular: false
  }
];

const ATTORNEYS = [
  {
    name: "Darius Hamilton, Esq.",
    firm: "Hamilton Sports Law",
    location: "Washington, D.C.",
    rating: 4.9,
    reviews: 187,
    cases: 340,
    specialties: ["NIL Law", "Contract Negotiation", "Name & Image Rights", "Endorsements"],
    bar: ["DC", "MD", "VA", "NY", "CA"],
    bio: "Former NCAA compliance officer turned sports attorney. Has reviewed over 340 NIL deals totaling $12M+. Knows every loophole in the rulebook.",
    featured: true,
    available: true,
    responseTime: "< 2 hours"
  },
  {
    name: "Priya Sharma, Esq.",
    firm: "Sharma & Associates Sports Law",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 124,
    cases: 210,
    specialties: ["Agent Agreements", "Trademark & IP", "Social Media Law", "Business Formation"],
    bar: ["CA", "NY", "TX", "FL"],
    bio: "Top entertainment and sports attorney specializing in athlete brand protection. Has trademarked over 200 athlete names and brands.",
    featured: true,
    available: true,
    responseTime: "< 4 hours"
  },
  {
    name: "James Okafor, Esq.",
    firm: "Okafor Law Group",
    location: "Houston, TX",
    rating: 4.7,
    reviews: 93,
    cases: 178,
    specialties: ["Transfer Portal", "NCAA Eligibility", "Scholarship Disputes", "Collective Agreements"],
    bar: ["TX", "LA", "OK", "AR"],
    bio: "The go-to attorney for transfer portal and NCAA eligibility issues. Has won 94% of eligibility waiver cases.",
    featured: false,
    available: true,
    responseTime: "< 6 hours"
  }
];

const STATE_NIL_LAWS = [
  { state: "Alabama", key: "Allowed since 2021. No school involvement required. Collectives permitted." },
  { state: "California", key: "SB 206 — first state to legalize NIL. Strong athlete protections." },
  { state: "Florida", key: "Allows NIL for high school athletes too. One of the most permissive states." },
  { state: "Georgia", key: "Collectives allowed. No academic performance requirements." },
  { state: "Ohio", key: "Schools can facilitate NIL deals. Revenue sharing model in development." },
  { state: "Texas", key: "Strong NIL market. Schools actively involved in collective deals." },
  { state: "Mississippi", key: "Allowed since 2021. No restrictions on school involvement." },
  { state: "North Carolina", key: "Allows NIL with standard eligibility requirements." }
];

const CONTRACT_CHECKLIST = [
  "Payment terms and schedule clearly defined",
  "Exclusivity clauses — what brands are you blocked from?",
  "Usage rights — where can they use your image?",
  "Termination clauses — how do you get out?",
  "Performance requirements — what do you have to deliver?",
  "Intellectual property ownership",
  "Dispute resolution process",
  "NCAA eligibility compliance language"
];

function AthleteLegalInner() {
  const [activeTab, setActiveTab] = useState<"attorneys" | "services" | "resources">("attorneys");
  const [stateSearch, setStateSearch] = useState("");

  const filteredStates = STATE_NIL_LAWS.filter(s =>
    s.state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-full px-4 py-2">
            <Scale className="w-4 h-4 text-[#1E90FF]" />
            <span className="text-[#1E90FF] text-sm font-semibold">AthlynX LEGAL HUB</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-center mb-3">
          Athlete Legal <span className="bg-gradient-to-r from-[#1E90FF] to-violet-400 bg-clip-text text-transparent">Protection</span>
        </h1>
        <p className="text-slate-300 text-center text-lg max-w-2xl mx-auto mb-8">
          LegalZoom-style legal services built for athletes. NIL contracts, agent agreements, trademark protection, and eligibility defense — all in one place.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          {[
            { value: "500+", label: "Sports Attorneys" },
            { value: "50", label: "States Covered" },
            { value: "$12M+", label: "NIL Deals Reviewed" },
            { value: "94%", label: "Win Rate" }
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-[#1E90FF]">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {(["attorneys", "services", "resources"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-[#1E90FF] text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Attorneys Tab */}
        {activeTab === "attorneys" && (
          <div className="space-y-5">
            {ATTORNEYS.map((atty, i) => (
              <div key={i} className={`bg-white/5 border rounded-2xl p-6 hover:bg-white/10 transition-all ${atty.featured ? "border-[#1E90FF]/40" : "border-white/10"}`}>
                {atty.featured && (
                  <div className="flex items-center gap-1 text-xs text-[#00C2FF] font-semibold mb-3">
                    <Star className="w-3 h-3 fill-blue-400" />
                    FEATURED ATTORNEY
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{atty.name}</h3>
                    <p className="text-[#1E90FF] text-sm font-semibold">{atty.firm}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-400 text-xs">{atty.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${atty.available ? "bg-[#00C2FF]/20 text-[#00C2FF]" : "bg-slate-500/20 text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${atty.available ? "bg-[#00C2FF]" : "bg-slate-400"}`} />
                      {atty.available ? "Available" : "Busy"}
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <Star className="w-3 h-3 text-[#00C2FF] fill-blue-400" />
                      <span className="text-white text-sm font-bold">{atty.rating}</span>
                      <span className="text-slate-400 text-xs">({atty.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-sm font-black text-[#1E90FF]">{atty.cases}</div><div className="text-xs text-slate-400">Cases</div></div>
                  <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-xs font-black text-[#00C2FF]">{atty.responseTime}</div><div className="text-xs text-slate-400">Response</div></div>
                  <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-xs font-black text-[#00C2FF]">Free</div><div className="text-xs text-slate-400">Consult</div></div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {atty.bar.map((b, j) => (
                    <span key={j} className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30 px-2 py-0.5 rounded-full">Bar: {b}</span>
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{atty.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {atty.specialties.map((s, j) => <span key={j} className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#1E90FF] hover:bg-[#1E90FF] text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                    <Calendar className="w-4 h-4" />
                    Book Free Consultation
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
                    <Mail className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LEGAL_SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i} className={`bg-white/5 border rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer relative ${svc.popular ? "border-[#1E90FF]/40" : "border-white/10"}`}>
                  {svc.popular && <div className="absolute -top-2 left-4 bg-[#1E90FF] text-white text-xs font-bold px-2 py-0.5 rounded-full">MOST POPULAR</div>}
                  <Icon className="w-8 h-8 text-[#1E90FF] mb-3" />
                  <h3 className="text-white font-bold mb-1">{svc.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{svc.desc}</p>
                  <div className="text-[#1E90FF] text-sm font-bold">{svc.price}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            {/* NIL Contract Checklist */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#00C2FF]" />
                NIL Contract Review Checklist
              </h2>
              <p className="text-slate-400 text-sm mb-4">Before you sign ANY NIL deal, make sure these 8 items are clearly addressed:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONTRACT_CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-[#00C2FF] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* State NIL Laws */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                State NIL Laws — Know Your Rights
              </h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your state..."
                  value={stateSearch}
                  onChange={e => setStateSearch(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-[#1E90FF] text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredStates.map((law, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3">
                    <div className="text-white font-bold text-sm mb-1">{law.state}</div>
                    <div className="text-slate-400 text-xs leading-relaxed">{law.key}</div>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-4">* Laws change frequently. Always consult a licensed attorney in your state before signing any NIL agreement.</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#1E90FF]/50 to-violet-900/50 border border-[#1E90FF]/20 rounded-2xl p-6 sm:p-8 text-center">
          <Scale className="w-10 h-10 text-[#1E90FF] mx-auto mb-3" />
          <h3 className="text-xl font-black text-white mb-2">Are You a Sports Attorney?</h3>
          <p className="text-slate-400 text-sm mb-4 max-w-xl mx-auto">
            Join the AthlynX Legal Network and connect with athletes who need your expertise. Access our NIL deal database and athlete profile system.
          </p>
          <button className="bg-[#1E90FF] hover:bg-[#1E90FF] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
            Apply to Join the Network
          </button>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function AthleteLegal() {
  return <RouteErrorBoundary><AthleteLegalInner /></RouteErrorBoundary>;
}
