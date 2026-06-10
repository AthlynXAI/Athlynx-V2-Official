/**
 * AUTH STRATEGY — Auth0 vs Okta Decision Center
 * Session 38 — May 6, 2026
 * Enterprise authentication strategy decision page for AthlynX.
 * Colors: #0066ff blue, #00c2ff cyan. NO yellow.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield, Lock, Users, Zap, CheckCircle, XCircle,
  Building, Globe, Key, Server, ArrowRight, AlertTriangle
} from "lucide-react";

const COMPARISON = [
  { feature: "Free tier", auth0: true, okta: false, firebase: true },
  { feature: "Social login (Google, Apple, X, Facebook)", auth0: true, okta: true, firebase: true },
  { feature: "Custom JWT support", auth0: true, okta: true, firebase: true },
  { feature: "Enterprise SSO (SAML/OIDC)", auth0: true, okta: true, firebase: false },
  { feature: "MFA / Passkeys", auth0: true, okta: true, firebase: true },
  { feature: "B2B / Multi-tenant", auth0: true, okta: true, firebase: false },
  { feature: "React SDK quality", auth0: true, okta: false, firebase: true },
  { feature: "Pricing at scale", auth0: false, okta: false, firebase: true },
  { feature: "HIPAA compliance", auth0: true, okta: true, firebase: false },
  { feature: "Current platform integration", auth0: false, okta: false, firebase: true },
];

function AuthStrategyInner() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      <UnifiedNav />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-blue-900/30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/10 via-transparent to-[#00c2ff]/5" />
        <div className="max-w-5xl mx-auto px-4 py-14 relative z-10 text-center">
          <Badge className="bg-[#0066ff]/20 text-[#00c2ff] border-[#0066ff]/30 mb-4 text-sm px-4 py-1">
            🔐 ENTERPRISE AUTH STRATEGY — S38
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">AUTH0 vs OKTA vs FIREBASE</h1>
          <p className="text-[#00c2ff] text-lg font-bold mb-2">Board Meeting Decision — May 5, 2026</p>
          <p className="text-blue-200/60 max-w-2xl mx-auto">
            Finalizing the enterprise authentication strategy for AthlynX as we scale to public launch July 1, 2026. Current stack: Supabase Auth + Custom JWT.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* Current Status */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-green-400 font-black text-lg mb-1">CURRENT STACK — LIVE & WORKING</h2>
              <p className="text-green-200/80 text-sm">
                Supabase Auth + Custom JWT is live, stable, and handling all social logins (Google, Apple, Twitter). All partner accounts have full access. Chad A. Dozier Sr. is the only Master Admin. The current stack is production-ready for the July 1, 2026 public launch.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Supabase Auth", "Custom JWT", "Google Sign-In ✅", "Apple Sign-In ✅", "X Sign-In ✅", "Email + Password ✅"].map(t => (
                  <Badge key={t} className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decision Pending */}
        <div className="bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-[#00c2ff] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-[#00c2ff] font-black text-lg mb-1">DECISION PENDING — BOARD MEETING MAY 5, 2026</h2>
              <p className="text-blue-200/70 text-sm">
                As AthlynX scales to enterprise clients (Pro Teams, School Licensing, White Label), we need to decide whether to migrate to Auth0 or Okta for enterprise SSO, SAML, and multi-tenant B2B capabilities. This decision affects the July 1 launch timeline.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <section>
          <h2 className="text-2xl font-black mb-6 text-center">FEATURE COMPARISON</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-blue-900/30">
                  <th className="text-left py-3 px-4 text-blue-300 font-bold">Feature</th>
                  <th className="text-center py-3 px-4 text-[#00c2ff] font-black">Auth0</th>
                  <th className="text-center py-3 px-4 text-[#0066ff] font-black">Okta</th>
                  <th className="text-center py-3 px-4 text-green-400 font-black">Supabase (Current)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-blue-900/20 ${i % 2 === 0 ? "bg-white/2" : ""}`}>
                    <td className="py-3 px-4 text-white text-sm">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.auth0 ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.okta ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.firebase ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendation */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "OPTION A: Stay Supabase",
              subtitle: "Recommended for July 1 Launch",
              color: "green",
              icon: CheckCircle,
              pros: ["Zero migration risk", "Already live and working", "Free tier covers current scale", "React SDK is excellent"],
              cons: ["No enterprise SSO", "No SAML/OIDC", "Not HIPAA compliant"],
              verdict: "RECOMMENDED for now — migrate post-launch",
            },
            {
              title: "OPTION B: Auth0",
              subtitle: "Best for Post-Launch Enterprise",
              color: "cyan",
              icon: Shield,
              pros: ["Enterprise SSO + SAML", "HIPAA compliant", "Excellent React SDK", "B2B multi-tenant ready"],
              cons: ["Migration effort ~2 weeks", "Cost at scale", "Delay July 1 if done now"],
              verdict: "MIGRATE in S42-S45 post-launch",
            },
            {
              title: "OPTION C: Okta",
              subtitle: "Enterprise-Only Play",
              color: "blue",
              icon: Building,
              pros: ["Industry standard enterprise", "Full SAML/OIDC", "HIPAA + SOC2"],
              cons: ["Expensive", "Complex React integration", "Overkill for current stage"],
              verdict: "EVALUATE at Series A ($15M)",
            },
          ].map((opt) => {
            const Icon = opt.icon;
            const colorMap: Record<string, string> = { green: "#00ff88", cyan: "#00c2ff", blue: "#0066ff" };
            const c = colorMap[opt.color];
            return (
              <div key={opt.title} className="bg-white/3 border border-blue-900/30 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5" style={{ color: c }} />
                  <h3 className="font-black text-white">{opt.title}</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: c }}>{opt.subtitle}</p>
                <div className="space-y-1 mb-4">
                  {opt.pros.map(p => (
                    <div key={p} className="flex items-start gap-2 text-xs text-green-300">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {p}
                    </div>
                  ))}
                  {opt.cons.map(c => (
                    <div key={c} className="flex items-start gap-2 text-xs text-red-300/70">
                      <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {c}
                    </div>
                  ))}
                </div>
                <div className="text-xs font-black p-2 rounded-lg text-center" style={{ backgroundColor: `${c}15`, color: c }}>
                  {opt.verdict}
                </div>
              </div>
            );
          })}
        </section>

        {/* S38 Decision */}
        <div className="bg-[#0066ff]/10 border-2 border-[#0066ff]/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black mb-3">S38 DECISION</h2>
          <p className="text-[#00c2ff] font-black text-lg mb-2">STAY ON FIREBASE + CUSTOM JWT FOR JULY 1 LAUNCH</p>
          <p className="text-blue-200/70 max-w-2xl mx-auto text-sm">
            No migration risk. Platform is stable. Auth0 migration scheduled for post-launch (S42-S45) once we have stable revenue and a dedicated engineering sprint. Okta to be evaluated at Series A.
          </p>
          <div className="mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-sm px-4 py-1">
              ✅ DECISION LOCKED — S38 MAY 6, 2026
            </Badge>
          </div>
        </div>

      </div>

      <UnifiedFooter />
      <MobileBottomNav />
    </div>
  );
}

export default function AuthStrategy() {
  return (
    <RouteErrorBoundary>
      <AuthStrategyInner />
    </RouteErrorBoundary>
  );
}
