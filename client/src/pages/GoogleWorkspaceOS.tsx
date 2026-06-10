/**
 * AthlynXAI OS v1 — Google Workspace Command Center
 * Full Google Workspace integration with Gemini AI capabilities
 * Gmail · Drive · Docs · Sheets · Slides · Calendar · Meet · Gemini
 * Brand: cobalt #1E90FF + true black + white. BE THE LEGACY.
 */

import { useState } from "react";
import { Link } from "wouter";

//  OWL MARK 
function OwlMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="13" cy="18" r="8" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="27" cy="18" r="8" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="13" cy="18" r="3" fill="currentColor" />
      <circle cx="27" cy="18" r="3" fill="currentColor" />
      <path d="M10 10 L13 5 L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 10 L27 5 L30 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

//  WORKSPACE APPS 
const WORKSPACE_APPS = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "",
    color: "from-[#1E90FF] to-[#0a1628]",
    border: "border-[#1E90FF]/30",
    url: "https://mail.google.com",
    desc: "Athlete communications, NIL deal threads, recruiting outreach",
    features: ["Smart Compose", "AI Summaries", "Label Automation", "Bulk Outreach"],
    badge: "18 connectors",
  },
  {
    id: "drive",
    name: "Google Drive",
    icon: "",
    color: "from-[#1E90FF] to-orange-500",
    border: "border-[#1E90FF]/30",
    url: "https://drive.google.com",
    desc: "All AthlynXAI assets, contracts, media, and documents",
    features: ["Shared Drives", "AI Search", "Version Control", "Team Folders"],
    badge: "Live sync",
  },
  {
    id: "docs",
    name: "Google Docs",
    icon: "",
    color: "from-blue-500 to-blue-600",
    border: "border-blue-500/30",
    url: "https://docs.google.com",
    desc: "NIL contracts, recruiting letters, press releases, playbooks",
    features: ["AI Writing", "Real-time Collab", "Templates", "E-Signature Ready"],
    badge: "Gemini AI",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    icon: "",
    color: "from-[#00C2FF] to-[#0a1628]",
    border: "border-[#00C2FF]/30",
    url: "https://sheets.google.com",
    desc: "Athlete databases, NIL deal tracking, revenue dashboards",
    features: ["AI Formulas", "Live Data", "Charts", "API Integration"],
    badge: "Gemini AI",
  },
  {
    id: "slides",
    name: "Google Slides",
    icon: "",
    color: "from-[#1E90FF] to-yellow-500",
    border: "border-[#1E90FF]/30",
    url: "https://slides.google.com",
    desc: "Investor decks, brand proposals, recruiting presentations",
    features: ["AI Layouts", "Brand Templates", "Presenter Mode", "Export"],
    badge: "Gemini AI",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    icon: "",
    color: "from-blue-400 to-[#0a1628]",
    border: "border-[#1E90FF]/30",
    url: "https://calendar.google.com",
    desc: "All athlete events, recruiting visits, NIL meetings, camps",
    features: ["Calendly Sync", "Team Calendars", "Smart Scheduling", "Reminders"],
    badge: "Calendly sync",
  },
  {
    id: "meet",
    name: "Google Meet",
    icon: "",
    color: "from-[#00C2FF] to-[#00C2FF]",
    border: "border-[#00C2FF]/30",
    url: "https://meet.google.com",
    desc: "Virtual recruiting visits, NIL brand calls, team meetings",
    features: ["HD Video", "AI Transcripts", "Recording", "Breakout Rooms"],
    badge: "Live",
  },
  {
    id: "forms",
    name: "Google Forms",
    icon: "",
    color: "from-[#1E90FF] to-[#0a1628]",
    border: "border-[#1E90FF]/30",
    url: "https://forms.google.com",
    desc: "Athlete intake, NIL applications, recruiting questionnaires",
    features: ["Auto-Collect", "Conditional Logic", "Sheets Integration", "AI Analysis"],
    badge: "Jotform sync",
  },
  {
    id: "chat",
    name: "Google Chat",
    icon: "",
    color: "from-blue-500 to-indigo-600",
    border: "border-[#1E90FF]/30",
    url: "https://chat.google.com",
    desc: "Team communication, athlete support, brand partnerships",
    features: ["Spaces", "Bots", "File Sharing", "Meet Integration"],
    badge: "Live",
  },
];

//  GEMINI CAPABILITIES 
const GEMINI_CAPABILITIES = [
  {
    icon: "",
    title: "Gemini 2.5 Flash",
    desc: "Ultra-fast AI for real-time athlete analysis, NIL valuations, and recruiting insights",
    action: "Ask Gemini",
    href: "https://gemini.google.com",
  },
  {
    icon: "",
    title: "AI Document Writer",
    desc: "Generate NIL contracts, recruiting letters, press releases, and playbooks in seconds",
    action: "Write Now",
    href: "https://docs.google.com",
  },
  {
    icon: "",
    title: "AI Data Analysis",
    desc: "Analyze athlete performance data, NIL deal pipelines, and revenue forecasts",
    action: "Analyze",
    href: "https://sheets.google.com",
  },
  {
    icon: "",
    title: "AI Recruiting Intel",
    desc: "Gemini-powered prospect matching, school fit analysis, and offer comparisons",
    action: "Scout Now",
    href: "/ai-recruiter",
  },
  {
    icon: "",
    title: "NIL Valuation Engine",
    desc: "AI-powered NIL deal valuation based on sport, school, social reach, and performance",
    action: "Calculate",
    href: "/nil-calculator",
  },
  {
    icon: "",
    title: "AI Content Generator",
    desc: "Auto-generate social posts, highlight captions, and press kit content",
    action: "Create",
    href: "/social-hub",
  },
];

//  INTEGRATION STATUS 
const INTEGRATIONS = [
  { name: "Gmail → CRM", status: "LIVE", desc: "New emails auto-create CRM contacts" },
  { name: "Drive → Media Vault", status: "LIVE", desc: "Drive assets sync to AthlynX media vault" },
  { name: "Sheets → NIL Dashboard", status: "LIVE", desc: "NIL deal data flows to analytics" },
  { name: "Calendar → Athlete Calendar", status: "LIVE", desc: "Google Calendar syncs with AthlynX calendar" },
  { name: "Docs → Contract Builder", status: "LIVE", desc: "Templates pull from Google Docs" },
  { name: "Forms → Athlete Intake", status: "LIVE", desc: "Form submissions create athlete profiles" },
  { name: "Meet → Booking Hub", status: "LIVE", desc: "Video calls scheduled through booking system" },
  { name: "Gemini → AI Wizards", status: "LIVE", desc: "All 8 AI wizards powered by Gemini" },
  { name: "Gemini → CRM Enrichment", status: "LIVE", desc: "Auto-enriches every new signup" },
  { name: "Gemini → Scouting Reports", status: "LIVE", desc: "AI scouting reports via Gemini + Nebius" },
];

export default function GoogleWorkspaceOS() {
  const [activeTab, setActiveTab] = useState<"apps" | "gemini" | "integrations" | "admin">("apps");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-12 border-b border-white/10 bg-gradient-to-b from-[#0a1a3a] via-black to-black overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <OwlMark className="w-10 h-10 text-blue-500" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase text-blue-500">AthlynXAI OS v1</span>
              <span className="text-white/20">·</span>
              <span className="text-xs font-black tracking-widest uppercase text-white/40">Google Workspace</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4 leading-none">
            Google Workspace
            <br />
            <span className="text-blue-500">Command Center</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mb-6">
            All Google Workspace apps wired into AthlynXAI OS v1. Gemini AI across every tool. The full back-office for the first $1B autonomous athlete platform.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "9 Workspace Apps", color: "text-white" },
              { label: "Gemini 2.5 Flash", color: "text-blue-400" },
              { label: "10 Live Integrations", color: "text-[#00C2FF]" },
              { label: "Google Cloud", color: "text-white" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <span className={`text-sm font-black ${badge.color}`}>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-40 px-6 py-3 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto flex gap-2">
          {[
            { id: "apps", label: "Workspace Apps" },
            { id: "gemini", label: "Gemini AI" },
            { id: "integrations", label: "Integrations" },
            { id: "admin", label: "Admin" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-10 max-w-6xl mx-auto">
        {/* WORKSPACE APPS TAB */}
        {activeTab === "apps" && (
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wide mb-6">All Workspace Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORKSPACE_APPS.map((app) => (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#07111F] to-black p-5 transition-all hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/15 hover:scale-[1.02] overflow-hidden"
                >
                  <OwlMark className="absolute bottom-3 right-3 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{app.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30">
                      {app.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mb-0.5 group-hover:text-blue-400 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-xs text-white/60 leading-snug mb-3">{app.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {app.features.map((f) => (
                      <span key={f} className="text-[9px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Access Bar */}
            <div className="mt-10 bg-gradient-to-r from-[#0a1628] to-[#07111F] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black uppercase tracking-wide mb-4">Quick Access</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {WORKSPACE_APPS.slice(0, 5).map((app) => (
                  <a
                    key={app.id}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-white/10 transition-all"
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="text-[10px] font-black text-white/70">{app.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GEMINI AI TAB */}
        {activeTab === "gemini" && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-[#0a1628] flex items-center justify-center text-2xl">
                
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wide">Gemini AI</h2>
                <p className="text-white/50 text-sm">Google's most capable AI — wired into every AthlynXAI OS tool</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {GEMINI_CAPABILITIES.map((cap) => (
                <a
                  key={cap.title}
                  href={cap.href}
                  target={cap.href.startsWith("http") ? "_blank" : undefined}
                  rel={cap.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#07111F] to-black p-5 transition-all hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/15"
                >
                  <span className="text-3xl block mb-3">{cap.icon}</span>
                  <h3 className="text-base font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-snug mb-4">{cap.desc}</p>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
                    {cap.action} →
                  </span>
                </a>
              ))}
            </div>

            {/* Gemini Models */}
            <div className="bg-gradient-to-r from-[#0a1628] to-[#07111F] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black uppercase tracking-wide mb-4">Gemini Models in Use</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { model: "gemini-2.5-flash", use: "Real-time AI tools, CRM enrichment, wizard responses", speed: "Ultra-fast" },
                  { model: "gemini-2.5-pro", use: "Deep analysis, contract review, investor decks", speed: "High-quality" },
                  { model: "gemini-1.5-flash", use: "Bulk processing, data analysis, content generation", speed: "Efficient" },
                ].map((m) => (
                  <div key={m.model} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 font-black text-sm mb-1">{m.model}</p>
                    <p className="text-white/60 text-xs mb-2">{m.use}</p>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30">
                      {m.speed}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INTEGRATIONS TAB */}
        {activeTab === "integrations" && (
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Live Integrations</h2>
            <div className="space-y-3">
              {INTEGRATIONS.map((intg) => (
                <div
                  key={intg.name}
                  className="flex items-center gap-4 bg-gradient-to-r from-[#07111F] to-black border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors"
                >
                  <div className="w-2 h-2 bg-[#00C2FF] rounded-full animate-pulse flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-black text-sm">{intg.name}</p>
                    <p className="text-white/50 text-xs">{intg.desc}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30 flex-shrink-0">
                    {intg.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Integration CTA */}
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-[#0a1628]/10 border border-blue-500/20 rounded-2xl p-6 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">Connector OS</p>
              <h3 className="text-xl font-black text-white mb-2">Add More Integrations</h3>
              <p className="text-white/50 text-sm mb-4">Connect Zapier, Slack, Stripe, Supabase, and 50+ more services through the Connector OS</p>
              <Link href="/connector-health" className="inline-block bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider transition-colors">
                Open Connector OS →
              </Link>
            </div>
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === "admin" && (
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Google Admin Console</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: "", title: "User Management", desc: "Manage all AthlynXAI Google Workspace users", href: "https://admin.google.com/ac/users" },
                { icon: "", title: "Security Center", desc: "2FA, access controls, and security alerts", href: "https://admin.google.com/ac/security" },
                { icon: "", title: "Usage Reports", desc: "Workspace usage analytics and audit logs", href: "https://admin.google.com/ac/reporting" },
                { icon: "", title: "Apps Configuration", desc: "Configure all Workspace app settings", href: "https://admin.google.com/ac/apps" },
                { icon: "", title: "Billing", desc: "Workspace subscription and billing management", href: "https://admin.google.com/ac/billing" },
                { icon: "", title: "Organization", desc: "Organizational units and group management", href: "https://admin.google.com/ac/orgunits" },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#07111F] to-black p-5 transition-all hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/15"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="text-base font-black text-white mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Domain Info */}
            <div className="bg-gradient-to-r from-[#0a1628] to-[#07111F] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black uppercase tracking-wide mb-4">Domain Configuration</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Primary Domain", value: "athlynx.ai" },
                  { label: "Admin Email", value: "cdozier14@athlynx.ai" },
                  { label: "Workspace Plan", value: "Business Plus" },
                  { label: "Users", value: "Active" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-white font-black text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <section className="px-6 py-16 bg-gradient-to-t from-[#0a1628] to-black border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <OwlMark className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <p className="text-xs font-black tracking-widest uppercase text-blue-500 mb-3">AthlynXAI OS v1</p>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4">BE THE LEGACY</h2>
          <p className="text-white/60 text-lg mb-8">
            Google Workspace + Gemini AI + Nebius H200 + 18 connectors. The complete back-office for the first $1B autonomous athlete platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/crm" className="bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-all shadow-lg shadow-blue-500/30">
              Open CRM →
            </Link>
            <Link href="/connector-health" className="border border-white/20 hover:border-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-colors">
              Connector Health
            </Link>
            <Link href="/athlynxai-os" className="border border-white/20 hover:border-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-colors">
              AthlynXAI OS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
