import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Shield, CheckCircle, Lock, Server, Users, FileText, AlertTriangle, Phone } from "lucide-react";

function HIPAAComplianceInner() {
  const readinessFeatures = [
    {
      title: "Encryption by design",
      description: "Health and wellness data surfaces are designed for encrypted transport, encrypted storage, and limited-access handling.",
      icon: Lock,
    },
    {
      title: "Role-based access",
      description: "Athlete, guardian, coach, trainer, and administrator access should be separated by role and least-privilege authorization.",
      icon: Users,
    },
    {
      title: "Audit-ready workflows",
      description: "The platform is designed around traceable data access, activity history, approval gates, and accountable operations.",
      icon: FileText,
    },
    {
      title: "BAA-capable infrastructure",
      description: "Vendor selection and cloud infrastructure are being organized around business-associate agreement readiness where PHI workflows apply.",
      icon: Server,
    },
  ];

  const safeguards = [
    {
      category: "Administrative readiness",
      items: [
        "Security responsibility and owner review",
        "Access-management policies",
        "Incident-response procedures",
        "Vendor and BAA review workflow",
        "Staff and operator training plan",
      ],
    },
    {
      category: "Technical readiness",
      items: [
        "Role-based access control",
        "Multi-factor authentication where available",
        "Audit logging and evidence capture",
        "Encryption in transit and at rest",
        "Data minimization and segmentation",
      ],
    },
    {
      category: "Privacy readiness",
      items: [
        "Consent-controlled athlete data use",
        "Guardian-aware workflows for minors",
        "Anonymized data for public or model-evaluation claims",
        "Human oversight for health-sensitive recommendations",
        "No diagnostic or clinician-replacement claims",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/athlynx-icon.png" alt="AthlynX" className="h-12 rounded-lg" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/legal">
              <button className="text-slate-300 hover:text-white px-4 py-2">Legal Hub</button>
            </Link>
            <Link href="/competition-readiness">
              <button className="bg-gradient-to-r from-blue-600 to-[#0a1628] text-white px-4 py-2 rounded-lg font-medium">
                Competition Readiness
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#1E90FF]/20 text-[#00C2FF] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            HIPAA-ALIGNED BY DESIGN
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-[#1E90FF] to-emerald-400 bg-clip-text text-transparent">
              Privacy-first health data readiness
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            AthlynX is building athlete health and wellness workflows with HIPAA-aligned safeguards, consent-controlled data access, and audit-ready operating discipline. We do not present public health features as diagnosis, medical-device functionality, FDA approval, or a replacement for licensed clinicians.
          </p>
          <div className="bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-2xl p-6 inline-block text-left">
            <p className="text-[#00C2FF] font-semibold">Public compliance position</p>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">
              General AthlynX operations are athlete-wellness and performance-support workflows. Where covered-entity, provider, institutional, or PHI workflows apply, AthlynX is designed to support BAA review, restricted access, audit trails, and privacy-first implementation before production use.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Readiness features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {readinessFeatures.map((feature) => (
              <div key={feature.title} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <feature.icon className="w-10 h-10 text-[#00C2FF] mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Safeguard roadmap</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {safeguards.map((safeguard) => (
              <div key={safeguard.category} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-[#00C2FF] mb-4">{safeguard.category}</h3>
                <ul className="space-y-2">
                  {safeguard.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#00C2FF] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              BAA and vendor posture
            </h2>
            <p className="text-slate-300 mb-6">
              AthlynX separates public athlete-wellness content from restricted health-data workflows. When a workflow involves protected health information, provider relationships, or institutional deployment, vendor review and Business Associate Agreement readiness are handled before production use.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Cloud and database hosting review",
                "Identity and role-management review",
                "Email and notification workflow review",
                "Analytics/data-minimization review",
                "Support and operations access review",
                "Incident-response evidence capture",
              ].map((partner) => (
                <div key={partner} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#00C2FF]" />
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-[#00C2FF]" />
              Responsible health-tech boundary
            </h2>
            <p className="text-slate-300 mb-4">
              AthlynX health and wellness surfaces are designed to support athletes, families, coaches, trainers, and institutions. They are not marketed as diagnostic tools, medical-device software, emergency medicine systems, or clinician replacements.
            </p>
            <p className="text-slate-300">
              Any future clinical workflow, provider workflow, or medical-record workflow should be reviewed with qualified legal, security, and clinical advisors before launch.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Privacy and health-data questions?</h2>
          <p className="text-slate-300 mb-8">
            Contact the AthlynXAI team for privacy, BAA-readiness, or health-data workflow questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:privacy@athlynx.ai" className="bg-gradient-to-r from-[#1E90FF] to-[#00C2FF] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
              <FileText className="w-5 h-5" />
              privacy@athlynx.ai
            </a>
            <a href="/book" className="bg-slate-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Book a call
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">© 2026 Dozier Holdings Group, LLC. All rights reserved.</p>
          <p className="text-slate-500 text-xs mt-2">Last Updated: May 23, 2026</p>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}

export default function HIPAACompliance() {
  return <RouteErrorBoundary><HIPAAComplianceInner /></RouteErrorBoundary>;
}
