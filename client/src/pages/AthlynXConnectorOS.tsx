import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useState } from "react";
import {
  Plug, Globe, Heart, Users, DollarSign, GraduationCap,
  Handshake, CheckCircle, Clock, Zap, Shield, Activity,
  Calendar, BarChart3, Link2, ArrowRight
} from "lucide-react";

type ConnectorStatus = "active" | "pending" | "available";

interface Connector {
  name: string;
  desc: string;
  status: ConnectorStatus;
  category: string;
}

const CONNECTOR_CATEGORIES: { key: string; label: string; icon: React.ComponentType<{ className?: string }>; color: string; connectors: Connector[] }[] = [
  {
    key: "social",
    label: "Social Media",
    icon: Globe,
    color: "from-pink-500 to-purple-600",
    connectors: [
      { name: "Instagram", desc: "Sync followers, engagement, posts, brand mentions", status: "active", category: "social" },
      { name: "Meta / Facebook", desc: "Facebook page, ad account, audience insights", status: "active", category: "social" },
      { name: "X / Twitter", desc: "Followers, tweets, engagement, brand monitoring", status: "active", category: "social" },
      { name: "TikTok", desc: "Followers, video views, engagement rate, viral content", status: "active", category: "social" },
      { name: "LinkedIn", desc: "Professional network, endorsements, career posts", status: "pending", category: "social" },
      { name: "YouTube", desc: "Subscribers, video analytics, channel performance", status: "available", category: "social" },
    ],
  },
  {
    key: "calendar",
    label: "Calendar & Scheduling",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500",
    connectors: [
      { name: "Google Calendar", desc: "Sync all games, practices, camps, NIL events", status: "active", category: "calendar" },
      { name: "Apple Calendar", desc: "iCloud calendar sync for iOS/macOS users", status: "active", category: "calendar" },
      { name: "Outlook Calendar", desc: "Microsoft 365 calendar integration", status: "available", category: "calendar" },
      { name: "TeamSnap", desc: "Team schedule sync — practices, games, travel", status: "available", category: "calendar" },
    ],
  },
  {
    key: "health",
    label: "Health & Biosignals",
    icon: Heart,
    color: "from-red-500 to-pink-600",
    connectors: [
      { name: "Libre Link (GlucoAthlete)", desc: "Continuous glucose monitoring — HIPAA-compliant", status: "active", category: "health" },
      { name: "Apple Health", desc: "Steps, heart rate, sleep, workouts, HRV", status: "active", category: "health" },
      { name: "WHOOP", desc: "Recovery score, strain, sleep performance", status: "active", category: "health" },
      { name: "Garmin Connect", desc: "GPS training data, VO2 max, performance metrics", status: "pending", category: "health" },
      { name: "Oura Ring", desc: "Sleep stages, readiness score, temperature", status: "available", category: "health" },
      { name: "Google Fit", desc: "Android health data sync", status: "available", category: "health" },
    ],
  },
  {
    key: "team",
    label: "Team & Performance",
    icon: Users,
    color: "from-green-500 to-teal-600",
    connectors: [
      { name: "Hudl", desc: "Game film, play analysis, highlight creation", status: "active", category: "team" },
      { name: "MaxPreps", desc: "High school stats, rankings, team records", status: "active", category: "team" },
      { name: "SportsEngine", desc: "Youth and club team management", status: "pending", category: "team" },
      { name: "Synergy Sports", desc: "Advanced analytics for college and pro", status: "available", category: "team" },
    ],
  },
  {
    key: "financial",
    label: "Financial",
    icon: DollarSign,
    color: "from-blue-500 to-blue-500",
    connectors: [
      { name: "Plaid (Bank Sync)", desc: "Read-only bank account balance and transaction history", status: "active", category: "financial" },
      { name: "Stripe", desc: "NIL payment processing, subscription billing", status: "active", category: "financial" },
      { name: "PayPal / Venmo", desc: "NIL payment receipt tracking", status: "pending", category: "financial" },
      { name: "Scholarship Disbursement", desc: "Track scholarship payments from your institution", status: "available", category: "financial" },
    ],
  },
  {
    key: "recruiting",
    label: "Recruiting",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-700",
    connectors: [
      { name: "247Sports", desc: "Recruiting profile, star rating, school interest", status: "active", category: "recruiting" },
      { name: "Rivals", desc: "Recruiting rankings, offers, commitment tracking", status: "active", category: "recruiting" },
      { name: "On3", desc: "NIL valuation, recruiting profile, transfer portal", status: "pending", category: "recruiting" },
      { name: "ESPN Recruiting", desc: "ESPN recruiting rankings and school interest", status: "available", category: "recruiting" },
    ],
  },
  {
    key: "nil",
    label: "NIL & Endorsements",
    icon: Handshake,
    color: "from-cyan-500 to-blue-500",
    connectors: [
      { name: "Opendorse", desc: "NIL deal management, brand partnerships, compliance", status: "active", category: "nil" },
      { name: "Athlete's Thread", desc: "NIL marketplace, brand deals, payment processing", status: "pending", category: "nil" },
      { name: "INFLCR", desc: "Content sharing, brand compliance, NIL tracking", status: "available", category: "nil" },
      { name: "Dreamfield", desc: "NIL experiences, fan interactions, autograph sessions", status: "available", category: "nil" },
    ],
  },
];

const STATUS_CONFIG: Record<ConnectorStatus, { label: string; bg: string; text: string; border: string }> = {
  active: { label: "Active", bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/40" },
  pending: { label: "Connecting", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40" },
  available: { label: "Connect", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40" },
};

export default function AthlynXConnectorOS() {
  const [activeCategory, setActiveCategory] = useState("social");

  const activeCategory_ = CONNECTOR_CATEGORIES.find(c => c.key === activeCategory)!;
  const totalActive = CONNECTOR_CATEGORIES.flatMap(c => c.connectors).filter(c => c.status === "active").length;
  const totalConnectors = CONNECTOR_CATEGORIES.flatMap(c => c.connectors).length;

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] pb-24">

          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/15 via-transparent to-cyan-500/10 pointer-events-none" />
            <div className="relative px-4 pt-8 pb-10 max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-cyan-500 flex items-center justify-center">
                  <Plug className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">AthlynX OS</p>
                  <h1 className="text-2xl font-black text-white">Connector OS</h1>
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-2">Everything Connected.</p>
              <p className="text-3xl font-black bg-gradient-to-r from-[#1E90FF] to-cyan-400 bg-clip-text text-transparent mb-4">One Platform.</p>
              <p className="text-blue-300 text-sm max-w-xl leading-relaxed">
                Link your social media, health devices, team platforms, financial accounts, recruiting profiles, and NIL tools — all flowing into AthlynX OS v1 and your CRM.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6 max-w-sm">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-black text-xl">{totalActive}</p>
                  <p className="text-blue-400 text-xs font-bold">Active</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-xl p-3 text-center">
                  <p className="text-white font-black text-xl">{totalConnectors}</p>
                  <p className="text-blue-400 text-xs font-bold">Total</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-xl p-3 text-center">
                  <p className="text-cyan-400 font-black text-xl">7</p>
                  <p className="text-blue-400 text-xs font-bold">Categories</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 max-w-6xl mx-auto space-y-8">

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CONNECTOR_CATEGORIES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === key
                      ? "bg-[#1E90FF] text-white"
                      : "bg-[#0d1a3a] border border-blue-700/50 text-blue-300 hover:border-blue-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Active Category */}
            <div className="space-y-4">
              <div className={`bg-gradient-to-r ${activeCategory_.color} p-0.5 rounded-2xl`}>
                <div className="bg-[#0d1a3a] rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <activeCategory_.icon className="w-6 h-6 text-white" />
                    <div>
                      <h2 className="text-white font-black text-lg">{activeCategory_.label} Connectors</h2>
                      <p className="text-blue-300 text-xs">{activeCategory_.connectors.filter(c => c.status === "active").length} of {activeCategory_.connectors.length} connected</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeCategory_.connectors.map((connector, i) => {
                  const cfg = STATUS_CONFIG[connector.status];
                  return (
                    <div key={i} className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-4 hover:border-blue-500 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-black">{connector.name}</h3>
                          <p className="text-blue-300 text-xs mt-0.5">{connector.desc}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border} whitespace-nowrap ml-2`}>
                          {connector.status === "active" && <span>✓ </span>}
                          {cfg.label}
                        </span>
                      </div>
                      {connector.status !== "active" && (
                        <button className={`w-full mt-2 bg-gradient-to-r ${activeCategory_.color} text-white font-bold py-2 rounded-xl text-xs hover:opacity-90 transition-opacity`}>
                          {connector.status === "pending" ? "Finish Setup" : `Connect ${connector.name}`}
                        </button>
                      )}
                      {connector.status === "active" && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-green-400 text-xs font-bold">Syncing to AthlynX CRM</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
                <h2 className="text-white font-black text-lg">How AthlynX Connectors Work</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: "1", title: "Connect", desc: "Authorize via secure OAuth — we never see your password", icon: Link2 },
                  { step: "2", title: "Sync", desc: "Data flows automatically into your AthlynX profile and CRM", icon: Activity },
                  { step: "3", title: "Analyze", desc: "AthlynX AI analyzes your data for NIL value, health insights, and recruiting opportunities", icon: BarChart3 },
                  { step: "4", title: "Act", desc: "Get personalized recommendations based on your connected data", icon: ArrowRight },
                ].map(({ step, title, desc, icon: Icon }) => (
                  <div key={step} className="bg-[#050c1a] border border-blue-700/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#1E90FF] flex items-center justify-center text-white font-black text-xs">{step}</div>
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                    <p className="text-blue-300 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#1E90FF]" />
                <h2 className="text-white font-black text-lg">Security &amp; Privacy</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "OAuth 2.0", desc: "Industry-standard secure authorization" },
                  { label: "No Password Storage", desc: "We never see or store your passwords" },
                  { label: "HIPAA Compliant", desc: "Medical data protected by HIPAA" },
                  { label: "You Own Your Data", desc: "Disconnect and export anytime" },
                ].map(({ label, desc }) => (
                  <div key={label} className="bg-[#050c1a] border border-blue-700/40 rounded-xl p-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mb-2" />
                    <p className="text-white font-bold text-sm">{label}</p>
                    <p className="text-blue-400 text-xs mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-blue-700/30 pt-6 text-center">
              <p className="text-blue-600 text-xs">Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™</p>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
