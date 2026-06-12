/**
 * AUTH STRATEGY — Okta Auth0 PKCE Decision Center
 * Updated: Build 1 Session 2 — June 12, 2026
 * Decision locked: Okta Auth0 PKCE only. Firebase and Supabase auth removed.
 * Colors: #0066ff blue, #00c2ff cyan. NO yellow.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Badge } from "@/components/ui/badge";
import {
  Shield, CheckCircle, XCircle, Building, Key,
} from "lucide-react";

const COMPARISON = [
  { feature: "Free tier", auth0: true, okta: false },
  { feature: "Social login (Google, Apple, X, Facebook)", auth0: true, okta: true },
  { feature: "Custom JWT support", auth0: true, okta: true },
  { feature: "Enterprise SSO (SAML/OIDC)", auth0: true, okta: true },
  { feature: "MFA / Passkeys", auth0: true, okta: true },
  { feature: "B2B / Multi-tenant", auth0: true, okta: true },
  { feature: "React SDK quality", auth0: true, okta: false },
  { feature: "Pricing at scale", auth0: false, okta: false },
  { feature: "HIPAA compliance", auth0: true, okta: true },
  { feature: "Current platform integration", auth0: true, okta: true },
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
             ENTERPRISE AUTH STRATEGY — LOCKED
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">OKTA AUTH0 PKCE</h1>
          <p className="text-[#00c2ff] text-lg font-bold mb-2">Decision Locked — Build 1 Session 2, June 12, 2026</p>
          <p className="text-blue-200/60 max-w-2xl mx-auto">
            Firebase and Supabase auth have been fully removed. AthlynX runs exclusively on Okta Auth0 PKCE — zero legacy auth code remaining.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* Current Status */}
        <div className="bg-[#00C2FF]/10 border border-[#00C2FF]/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-[#00C2FF] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-[#00C2FF] font-black text-lg mb-1">CURRENT STACK — OKTA AUTH0 PKCE</h2>
              <p className="text-[#00C2FF]/80 text-sm">
                Auth0 PKCE flow is live. Domain: dev-8yqdmei0v8kc3qqy.us.auth0.com. All social logins (Google, Apple, Twitter/X, Facebook) route through Auth0. No Firebase. No Supabase auth. Chad A. Dozier Sr. is the only Master Admin.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Okta Auth0 PKCE", "Google Sign-In ✅", "Apple Sign-In ✅", "X Sign-In ✅", "Email + Password ✅", "JWKS Verification ✅"].map(t => (
                  <Badge key={t} className="bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]/30 text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <section>
          <h2 className="text-2xl font-black mb-6 text-center">AUTH0 vs OKTA FEATURE COMPARISON</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-blue-900/30">
                  <th className="text-left py-3 px-4 text-blue-300 font-bold">Feature</th>
                  <th className="text-center py-3 px-4 text-[#00c2ff] font-black">Auth0 (Active ✅)</th>
                  <th className="text-center py-3 px-4 text-[#0066ff] font-black">Okta Direct</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-blue-900/20 ${i % 2 === 0 ? "bg-white/2" : ""}`}>
                    <td className="py-3 px-4 text-white text-sm">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.auth0 ? <CheckCircle className="w-4 h-4 text-[#00C2FF] mx-auto" /> : <XCircle className="w-4 h-4 text-[#1E90FF]/60 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.okta ? <CheckCircle className="w-4 h-4 text-[#00C2FF] mx-auto" /> : <XCircle className="w-4 h-4 text-[#1E90FF]/60 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Options */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "ACTIVE: Auth0 (Okta)",
              subtitle: "Live — Build 1 Session 2",
              color: "cyan",
              icon: Shield,
              pros: ["Enterprise SSO + SAML", "HIPAA compliant", "Excellent React SDK", "B2B multi-tenant ready", "PKCE flow — no client secret exposed"],
              cons: ["Cost at scale", "Requires Auth0 tenant management"],
              verdict: "LOCKED — This is the only auth provider",
            },
            {
              title: "FUTURE: Okta Direct",
              subtitle: "Evaluate at Series A",
              color: "blue",
              icon: Building,
              pros: ["Industry standard enterprise", "Full SAML/OIDC", "HIPAA + SOC2"],
              cons: ["$240/mo minimum", "Complex React integration", "Overkill for current stage"],
              verdict: "EVALUATE at Series A ($15M+)",
            },
          ].map((opt) => {
            const Icon = opt.icon;
            const colorMap: Record<string, string> = { cyan: "#00c2ff", blue: "#0066ff" };
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
                    <div key={p} className="flex items-start gap-2 text-xs text-[#00C2FF]">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {p}
                    </div>
                  ))}
                  {opt.cons.map(con => (
                    <div key={con} className="flex items-start gap-2 text-xs text-[#1E90FF]/70">
                      <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {con}
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

        {/* Locked Decision */}
        <div className="bg-[#0066ff]/10 border-2 border-[#0066ff]/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black mb-3">DECISION LOCKED</h2>
          <p className="text-[#00c2ff] font-black text-lg mb-2">OKTA AUTH0 PKCE — ONLY AUTH PROVIDER</p>
          <p className="text-blue-200/70 max-w-2xl mx-auto text-sm">
            Firebase and Supabase auth fully removed in Build 1 Session 2 (June 12, 2026). Auth chain: okta.ts → PKCE redirect → Auth0 → /auth/callback → handleRedirectResult() → trpc.auth.syncUser → auth0Verifier.ts (jose JWKS) → session cookie → /welcome. No firebase-admin. No @supabase/supabase-js in active code.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge className="bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]/30 text-sm px-4 py-1">
               DECISION LOCKED — BUILD 1 SESSION 2 — JUNE 12, 2026
            </Badge>
            <Badge className="bg-[#0066ff]/20 text-[#0066ff] border-[#0066ff]/30 text-sm px-4 py-1">
              <Key className="w-3 h-3 inline mr-1" /> PKCE FLOW ACTIVE
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
