import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Shield, FileText, Lock, Scale, Cookie, Database, Building, Users, FileSignature, Handshake, Trophy, Briefcase, GraduationCap, Globe, Heart } from "lucide-react";

function LegalHubInner() {
  const legalSections = [
    {
      title: "HIPAA Compliance",
      description: "Healthcare data protection and privacy standards",
      icon: Shield,
      href: "/hipaa",
      color: "from-[#00C2FF] to-emerald-600",
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data",
      icon: Lock,
      href: "/privacy",
      color: "from-blue-500 to-[#0a1628]",
    },
    {
      title: "Terms of Service",
      description: "Terms and conditions for using AthlynX",
      icon: FileText,
      href: "/terms",
      color: "from-blue-600 to-blue-700",
    },
    {
      title: "Cookie Policy",
      description: "How we use cookies and tracking technologies",
      icon: Cookie,
      href: "/cookies",
      color: "from-[#1E90FF] to-[#0a1628]",
    },
    {
      title: "Data Protection",
      description: "GDPR, CCPA, and data security measures",
      icon: Database,
      href: "/data-protection",
      color: "from-[#1E90FF] to-[#0a1628]",
    },
    {
      title: "Corporate Documents",
      description: "Business formation and corporate governance",
      icon: Building,
      href: "/corporate",
      color: "from-slate-500 to-gray-600",
    },
    {
      title: "Contracts & Agreements",
      description: "NIL contracts, partnerships, and legal templates",
      icon: FileSignature,
      href: "/contracts",
      color: "from-[#1E90FF] to-blue-600",
    },
    {
      title: "Partners Portal",
      description: "Partner agreements and collaboration hub",
      icon: Handshake,
      href: "/partners",
      color: "from-[#00C2FF] to-[#0a1628]",
    },
    {
      title: "NCAA Compliance",
      description: "NIL rules, eligibility, transfer portal, recruiting compliance",
      icon: Trophy,
      href: "/legal-compliance",
      color: "from-[#0066ff] to-blue-700",
    },
    {
      title: "MHSAA & High School",
      description: "Michigan HSAA, all 50 state HSAAs, NFHS, HS NIL rules",
      icon: GraduationCap,
      href: "/mhsaa-compliance",
      color: "from-[#22c55e] to-emerald-700",
    },
    {
      title: "IRS & Tax Compliance",
      description: "1099-NEC, W-9, NIL income reporting, self-employment tax",
      icon: Briefcase,
      href: "/legal-compliance",
      color: "from-[#0066ff] to-blue-800",
    },
    {
      title: "Government & Federal",
      description: "FERPA, Title IX, NLRB, FTC, Executive Orders, federal law",
      icon: Globe,
      href: "/legal-compliance",
      color: "from-[#a855f7] to-purple-700",
    },
    {
      title: "HIPAA — Health Data",
      description: "Medical vault, BAA-ready, AES-256, athlete health records",
      icon: Heart,
      href: "/hipaa",
      color: "from-[#ef4444] to-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/athlynx-icon.png" alt="AthlynX" className="h-12 rounded-lg" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="bg-gradient-to-r from-blue-600 to-[#0a1628] text-white px-4 py-2 rounded-lg font-medium">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#00C2FF]/20 text-[#00C2FF] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            LEGAL & COMPLIANCE CENTER
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-[#1E90FF] via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Legal Hub
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            AthlynX is committed to transparency, compliance, and protecting our users. 
            Access all legal documents, policies, and corporate information here.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00C2FF]" /> HIPAA Compliant
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" /> GDPR Ready
            </span>
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" /> CCPA Compliant
            </span>
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#1E90FF]" /> SOC 2 Type II
            </span>
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#0066ff]" /> NCAA Compliant
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#22c55e]" /> MHSAA / All 50 HSAAs
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#0066ff]" /> IRS 1099-NEC
            </span>
          </div>
        </div>
      </section>

      {/* Legal Sections Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalSections.map((section) => (
              <Link key={section.href} href={section.href}>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-[#1E90FF] transition-all cursor-pointer group">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <section.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                  <p className="text-slate-400 text-sm">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-12 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Corporate Information</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <Building className="w-10 h-10 text-[#00C2FF] mb-4" />
              <h3 className="text-xl font-bold mb-4">Parent Company</h3>
              <p className="text-slate-300 font-semibold">Dozier Holdings Group, LLC</p>
              <p className="text-slate-400 text-sm mt-2">
                12036 Lake Portal Drive<br />
                Houston, TX 77047
              </p>
              <p className="text-slate-400 text-sm mt-2">
                831 West 28th Street<br />
                Laurel, MS 39440
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <Users className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-4">Leadership</h3>
              <p className="text-slate-300 font-semibold">Chad A. Dozier</p>
              <p className="text-slate-400 text-sm">Founder · CEO · Chairman</p>
              <p className="text-slate-400 text-sm mt-4">
                Email: contact@athlynx.ai<br />
                Phone: Book a call
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <Scale className="w-10 h-10 text-[#1E90FF] mb-4" />
              <h3 className="text-xl font-bold mb-4">Legal Contact</h3>
              <p className="text-slate-300 font-semibold">Legal Department</p>
              <p className="text-slate-400 text-sm mt-2">
                Email: contact@athlynx.ai
              </p>
              <p className="text-slate-400 text-sm mt-4">
                For legal inquiries, subpoenas, or compliance matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DHG Empire Companies */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">The DHG Empire</h2>
          <p className="text-slate-400 text-center mb-12">12 Companies Under Dozier Holdings Group</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "AthlynXAI Corp",
              "VC Technologies",
              "VC Data Centers",
              "The VIRT (Crypto)",
              "VC Energy",
              "Uma Real Estate",
              "Villa Agape",
              "Compassionate Care",
              "Pisces Resort",
              "Venus Venue",
              "Pomodoro Restaurant",
              "Softmor Inc",
            ].map((company) => (
              <div key={company} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
                <p className="text-sm font-medium text-slate-300">{company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © 2026 Chad A. Dozier Sr. / Dozier Holdings Group, LLC / AthlynX entities. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed max-w-4xl mx-auto">
            AthlynX™, AthlynXAI™, AXN™, AVN™, AthlynX Medical™, Medical BioSignal OS™, GlucoAthlete OS™, BioSignal Channel™, related marks, logos, source code, workflows, founder-tested Libre Link proof paths, product concepts, and evidence packages are proprietary intellectual property. Formal copyright and trademark filings may be completed by counsel; this public notice preserves claim, authorship, ownership, and evidence of use.
          </p>
        </div>
      </footer>
    <MobileBottomNav />
    </div>
  );
}
export default function LegalHub() {
  return <RouteErrorBoundary><LegalHubInner /></RouteErrorBoundary>;
}
