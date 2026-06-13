import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, AlertTriangle, ChevronRight, Shield, GitBranch, Zap, Trophy, Clock, ArrowRight } from "lucide-react";

const HANDOFF_BLOCK = `<project_instructions>
Build 1 Session 1 handoff for AthlynX "The Athlete's Playbook" — June 11–13, 2026.

SESSION SUMMARY:
This session completed the full Google Drive archive of the AthlynX platform (Firebase/Supabase auth files, all 49 handoff reports from Apr–Jun 2026, 764MB full codebase snapshot, scripts, platform docs, and read-only legacy repos). All 6 Devpost hackathon submissions were completed and confirmed (Build with Gemini XPRIZE, FIND EVIL! SANS AI, UiPath AgentHack, Splunk Agentic Ops, Google Cloud Rapid Agent, Global AI Hackathon with Qwen Cloud). The /session-handoff page was built and deployed to athlynx.ai.

LOCKED DOCTRINE (EVERY SESSION — NO EXCEPTIONS):
- GitHub account: AthlynxChad (chaddozier75@gmail.com) ONLY
- Target repo: AthlynXAI/Athlynx-V2-Official → main branch ONLY
- Vercel team: chad-a-doziers-projects (auto-deploys on push to main)
- After every push: return commit hash + Vercel deployment ID when READY
- NEVER push to: AthlynXAI/AthlynXAI (archived), chaddozier-bot, chaddozier75-bot, chaddozier75-cmd
- App Store / iCloud: Google chaddozier75@gmail.com | iCloud chad.dozier@icloud.com ONLY

AUTH STATUS — BLOCKER:
Authentication is currently broken on athlynx.ai (Firebase wrapper over Supabase OAuth silently failing on /signin). Decision locked: rip out Firebase + Supabase auth entirely and replace with Okta-only (athlynx.okta.com, $240/mo paid).

NEXT SESSION — RESUME AT STEP 2:
1. Delete archived Firebase/Supabase auth files from repo
2. Chad creates new Okta API token at athlynx.okta.com → Security → API → Tokens (previous token rejected)
3. Okta OIDC SPA app setup
4. okta.ts implementation
5. Vercel env vars updated
6. Push to main → return commit hash + Vercel deployment ID when READY
7. Fix broken SCREENS images IMG_7115, IMG_7116, IMG_7119 after Okta is live
</project_instructions>`;

function CopyBlock({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/60">
          <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">{label}</span>
          <button
            onClick={copy}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-5 text-sm text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
          {text}
        </pre>
      </div>
    </div>
  );
}

const hackathons = [
  { name: "Build with Gemini XPRIZE", status: "SUBMITTED", deadline: "Aug 17, 2026", color: "text-green-400" },
  { name: "FIND EVIL! — SANS AI Hackathon", status: "SUBMITTED", deadline: "Jun 16, 2026", color: "text-green-400" },
  { name: "UiPath AgentHack", status: "SUBMITTED", deadline: "TBD", color: "text-green-400" },
  { name: "Splunk Agentic Ops Hackathon", status: "SUBMITTED", deadline: "Jun 15, 2026", color: "text-green-400" },
  { name: "Google Cloud Rapid Agent", status: "SUBMITTED", deadline: "Closed", color: "text-green-400" },
  { name: "Global AI Hackathon — Qwen Cloud", status: "SUBMITTED", deadline: "TBD", color: "text-green-400" },
];

const nextSteps = [
  { step: "01", title: "Delete archived auth files", desc: "Remove Firebase/Supabase auth files from repo — they are archived and no longer needed.", urgent: true },
  { step: "02", title: "Chad creates new Okta API token", desc: "Navigate to athlynx.okta.com → Security → API → Tokens. Previous token was rejected.", urgent: true },
  { step: "03", title: "Okta OIDC SPA app setup", desc: "Configure OIDC Single Page Application in the Okta dashboard for athlynx.ai.", urgent: false },
  { step: "04", title: "Implement okta.ts", desc: "Write the okta.ts auth module — replaces the Firebase/Supabase wrapper entirely.", urgent: false },
  { step: "05", title: "Update Vercel env vars", desc: "Set VITE_OKTA_DOMAIN, VITE_OKTA_CLIENT_ID, and related vars in the chad-a-doziers-projects team.", urgent: false },
  { step: "06", title: "Push to main + confirm deploy", desc: "Push to AthlynXAI/Athlynx-V2-Official main. Return commit hash + Vercel deployment ID when READY.", urgent: false },
  { step: "07", title: "Fix SCREENS images", desc: "Repair broken images IMG_7115, IMG_7116, IMG_7119 after Okta auth is live.", urgent: false },
];

export default function SessionHandoff() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
              Build 1 · Session 1
            </span>
            <span className="text-xs font-mono text-zinc-500">Jun 11–13, 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
            Session<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Handoff</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            The Athlete's Playbook — AthlynX AI Platform. Full session log, locked doctrine, and next session start block. Copy and go.
          </p>
        </div>
      </section>

      {/* Copy Block */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Start Next Session — Paste This Block</h2>
          </div>
          <CopyBlock text={HANDOFF_BLOCK} label="project_instructions · copy to start next session" />
        </div>
      </section>

      {/* Auth Blocker Alert */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-red-300 mb-2">Auth Blocker — Action Required Before Next Session</h3>
              <p className="text-red-200/70 leading-relaxed mb-3">
                Authentication is <strong>broken</strong> on athlynx.ai. The Firebase wrapper over Supabase OAuth is silently failing on <code className="text-red-300 bg-red-900/30 px-1.5 py-0.5 rounded">/signin</code>. Decision is locked: <strong>rip out Firebase + Supabase auth entirely</strong> and replace with Okta-only.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-red-900/40 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-lg font-mono">athlynx.okta.com · $240/mo paid</span>
                <span className="bg-red-900/40 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-lg">Chad must create new Okta API token first</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Was Completed */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-white">Session Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Google Drive Archive</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Full 764MB codebase snapshot, all 49 handoff reports (Apr–Jun 2026), Firebase/Supabase auth files, scripts, platform docs, and read-only legacy repos archived.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-bold text-white mb-2">6 Hackathons Submitted</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">All 6 Devpost hackathon submissions confirmed including Build with Gemini XPRIZE (deadline Aug 17, 2026), FIND EVIL!, UiPath AgentHack, Splunk, Google Cloud, and Qwen Cloud.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">AGENTS.md Doctrine Locked</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Push doctrine locked forever: only AthlynXAI/Athlynx-V2-Official main branch, only AthlynxChad account. All other repos archived. Vercel auto-deploys on every push.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Status */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-white">Hackathon Submissions</h2>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 text-xs font-mono text-zinc-500 uppercase tracking-widest px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <span>Hackathon</span>
              <span className="text-center">Status</span>
              <span className="text-right">Deadline</span>
            </div>
            {hackathons.map((h, i) => (
              <div key={i} className={`grid grid-cols-3 items-center px-6 py-4 ${i < hackathons.length - 1 ? "border-b border-zinc-800/50" : ""}`}>
                <span className="text-sm font-medium text-white">{h.name}</span>
                <span className="text-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {h.status}
                  </span>
                </span>
                <span className="text-right text-sm text-zinc-400 font-mono">{h.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Session Steps */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-black text-white">Next Session</h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest">Resume Here</span>
          </div>
          <div className="space-y-4">
            {nextSteps.map((s, i) => (
              <div key={i} className={`flex gap-5 p-5 rounded-2xl border ${s.urgent ? "bg-red-950/20 border-red-500/20" : "bg-zinc-900/30 border-zinc-800"}`}>
                <div className={`text-2xl font-black font-mono shrink-0 ${s.urgent ? "text-red-400" : "text-zinc-600"}`}>{s.step}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{s.title}</h3>
                    {s.urgent && <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">Blocker</span>}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
                <ChevronRight className={`w-5 h-5 shrink-0 mt-0.5 ${s.urgent ? "text-red-400" : "text-zinc-600"}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locked Doctrine */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-white">Locked Doctrine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-mono text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Always
              </h3>
              <ul className="space-y-3">
                {[
                  "Push to AthlynXAI/Athlynx-V2-Official → main",
                  "Use AthlynxChad (chaddozier75@gmail.com)",
                  "Vercel team: chad-a-doziers-projects",
                  "Return commit hash + Vercel deployment ID",
                  "Google Sign-In for all services except Vercel",
                  "Vercel: GitHub login (AthlynxChad) only",
                  "App Store: chaddozier75@gmail.com",
                  "iCloud: chad.dozier@icloud.com",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-900/30 border border-red-900/30 rounded-2xl p-6">
              <h3 className="text-sm font-mono text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Never
              </h3>
              <ul className="space-y-3">
                {[
                  "AthlynXAI/AthlynXAI — archived, do not use",
                  "chaddozier-bot — WRONG account",
                  "chaddozier75-bot — WRONG account",
                  "chaddozier75-cmd — WRONG account",
                  "chaddozier75-cmd/AthlynXAI-Launch-2026-14",
                  "cdozier14-create — not used at all",
                  "Email/password login (triggers CAPTCHA)",
                  "Any repo not explicitly listed in doctrine",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vercel / Infra Reference */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-white">Infrastructure Reference</h2>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 text-xs font-mono text-zinc-500 uppercase tracking-widest px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <span>Resource</span>
              <span>Value</span>
            </div>
            {[
              ["Repo", "AthlynXAI/Athlynx-V2-Official → main"],
              ["Vercel Team", "chad-a-doziers-projects"],
              ["Vercel Project", "athlynx-platform"],
              ["Vercel Project ID", "prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU"],
              ["Vercel Team ID", "team_7neDSatyrDspOku2p0LxT8zO"],
              ["Okta Domain", "athlynx.okta.com ($240/mo paid)"],
              ["Auth0 Domain", "dev-8yqdmei0v8kc3qqy.us.auth0.com"],
              ["Supabase URL", "https://pgrbkisgwpxgphpqmual.supabase.co"],
              ["Shopify Store", "0010yz-fn.myshopify.com"],
              ["Cloud PC", "cloud-pc-6zoui4fe · 35.196.102.133 (GCP)"],
            ].map(([key, val], i) => (
              <div key={i} className={`grid grid-cols-2 items-center px-6 py-3.5 ${i < 9 ? "border-b border-zinc-800/50" : ""}`}>
                <span className="text-sm text-zinc-400 font-mono">{key}</span>
                <span className="text-sm text-zinc-200 font-mono break-all">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
