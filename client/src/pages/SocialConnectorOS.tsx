import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useState } from "react";
import {
  Link2, Globe, BarChart3, Users, TrendingUp, Shield,
  CheckCircle, AlertCircle, RefreshCw, Eye, DollarSign,
  Bell, Settings, Zap, ArrowRight, Activity
} from "lucide-react";

const PLATFORMS = [
  {
    name: "Instagram",
    handle: "@yourathlynx",
    color: "from-pink-500 to-purple-600",
    borderColor: "border-pink-500/40",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-300",
    followers: "12,400",
    following: "834",
    engagement: "4.8%",
    lastPost: "2 hours ago",
    status: "connected",
    nilValue: "$18,600–$62,000",
    icon: "IG",
  },
  {
    name: "TikTok",
    handle: "@yourathlynx",
    color: "from-gray-900 to-red-600",
    borderColor: "border-red-500/40",
    bgColor: "bg-red-500/10",
    textColor: "text-red-300",
    followers: "8,200",
    following: "412",
    engagement: "6.2%",
    lastPost: "5 hours ago",
    status: "connected",
    nilValue: "$12,300–$41,000",
    icon: "TT",
  },
  {
    name: "X / Twitter",
    handle: "@yourathlynx",
    color: "from-gray-800 to-gray-600",
    borderColor: "border-gray-500/40",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-300",
    followers: "5,100",
    following: "623",
    engagement: "2.1%",
    lastPost: "1 day ago",
    status: "connected",
    nilValue: "$7,650–$25,500",
    icon: "X",
  },
  {
    name: "Facebook",
    handle: "Your AthlynX Page",
    color: "from-blue-700 to-blue-500",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-300",
    followers: "3,800",
    following: "210",
    engagement: "1.4%",
    lastPost: "3 days ago",
    status: "connected",
    nilValue: "$5,700–$19,000",
    icon: "FB",
  },
  {
    name: "LinkedIn",
    handle: "Your Name",
    color: "from-blue-600 to-blue-800",
    borderColor: "border-blue-600/40",
    bgColor: "bg-blue-600/10",
    textColor: "text-blue-200",
    followers: "1,200",
    following: "890",
    engagement: "3.5%",
    lastPost: "1 week ago",
    status: "pending",
    nilValue: "$1,800–$6,000",
    icon: "LI",
  },
  {
    name: "Meta / Facebook Ads",
    handle: "Ad Account",
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-indigo-500/40",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-300",
    followers: "—",
    following: "—",
    engagement: "—",
    lastPost: "—",
    status: "available",
    nilValue: "Ad reach analytics",
    icon: "META",
  },
];

const NIL_VALUE_TABLE = [
  { range: "1K–10K followers", nilMin: "$1,500", nilMax: "$15,000", platform: "Instagram/TikTok" },
  { range: "10K–50K followers", nilMin: "$15,000", nilMax: "$75,000", platform: "All Platforms" },
  { range: "50K–100K followers", nilMin: "$75,000", nilMax: "$150,000", platform: "All Platforms" },
  { range: "100K–500K followers", nilMin: "$150,000", nilMax: "$750,000", platform: "All Platforms" },
  { range: "500K–1M followers", nilMin: "$500,000", nilMax: "$2,000,000", platform: "All Platforms" },
  { range: "1M+ followers", nilMin: "$2,000,000", nilMax: "$10,000,000+", platform: "All Platforms" },
];

export default function SocialConnectorOS() {
  const [activeTab, setActiveTab] = useState<"overview" | "platforms" | "analytics" | "nil" | "privacy">("overview");

  const totalFollowers = PLATFORMS
    .filter(p => p.followers !== "—")
    .reduce((sum, p) => sum + parseInt(p.followers.replace(/,/g, "")), 0);

  const connectedCount = PLATFORMS.filter(p => p.status === "connected").length;

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] pb-24">

          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/15 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="relative px-4 pt-8 pb-10 max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-purple-500 flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">AthlynX OS</p>
                  <h1 className="text-2xl font-black text-white">Social Connector OS</h1>
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-2">One Platform.</p>
              <p className="text-3xl font-black bg-gradient-to-r from-[#1E90FF] to-purple-400 bg-clip-text text-transparent mb-4">Every Network. Total Control.</p>
              <p className="text-blue-300 text-sm max-w-xl leading-relaxed">
                Connect Meta, X, LinkedIn, TikTok, and Facebook to your AthlynX profile. All your social data flows into your CRM, NIL calculator, and brand analytics — in one place.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6 max-w-md">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-xl p-3 text-center">
                  <p className="text-white font-black text-xl">{connectedCount}</p>
                  <p className="text-blue-400 text-xs font-bold">Connected</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-xl p-3 text-center">
                  <p className="text-white font-black text-xl">{(totalFollowers / 1000).toFixed(1)}K</p>
                  <p className="text-blue-400 text-xs font-bold">Total Reach</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-xl p-3 text-center">
                  <p className="text-white font-black text-xl">3.8%</p>
                  <p className="text-blue-400 text-xs font-bold">Avg Engagement</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 max-w-6xl mx-auto space-y-8">

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { key: "overview", label: "Overview", icon: Globe },
                { key: "platforms", label: "Platforms", icon: Link2 },
                { key: "analytics", label: "Analytics", icon: BarChart3 },
                { key: "nil", label: "NIL Value", icon: DollarSign },
                { key: "privacy", label: "Privacy", icon: Shield },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === key
                      ? "bg-[#1E90FF] text-white"
                      : "bg-[#0d1a3a] border border-blue-700/50 text-blue-300 hover:border-blue-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#1E90FF]/20 to-purple-500/10 border border-[#1E90FF]/50 rounded-2xl p-6">
                  <h2 className="text-white font-black text-lg mb-3">How AthlynX Social Connector Works</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { step: "1", title: "Connect Your Accounts", desc: "Link TikTok, X, LinkedIn, and Meta in one click via secure OAuth.", icon: Link2 },
                      { step: "2", title: "Data Flows to Your CRM", desc: "Follower counts, engagement rates, brand mentions, and post performance sync to your AthlynX CRM automatically.", icon: Activity },
                      { step: "3", title: "Unlock Your NIL Value", desc: "Your social reach directly impacts your NIL value. AthlynX calculates your brand worth in real-time.", icon: DollarSign },
                    ].map(({ step, title, desc, icon: Icon }) => (
                      <div key={step} className="bg-[#0d1a3a] border border-blue-700/40 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-[#1E90FF] flex items-center justify-center text-white font-black text-sm">{step}</div>
                          <Icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-bold mb-1">{title}</h3>
                        <p className="text-blue-300 text-xs leading-relaxed">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Status Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PLATFORMS.map((p, i) => (
                    <div key={i} className={`bg-[#0d1a3a] border ${p.borderColor} rounded-xl p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-black text-xs`}>
                          {p.icon}
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          p.status === "connected" ? "bg-green-500/20 text-green-400 border border-green-500/40" :
                          p.status === "pending" ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" :
                          "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}>
                          {p.status === "connected" ? "Connected" : p.status === "pending" ? "Pending" : "Available"}
                        </span>
                      </div>
                      <h3 className="text-white font-black text-sm">{p.name}</h3>
                      <p className={`text-xs ${p.textColor}`}>{p.handle}</p>
                      {p.followers !== "—" && (
                        <p className="text-blue-300 text-xs mt-1">{p.followers} followers</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platforms Tab */}
            {activeTab === "platforms" && (
              <div className="space-y-4">
                {PLATFORMS.map((p, i) => (
                  <div key={i} className={`bg-[#0d1a3a] border ${p.borderColor} rounded-2xl p-5`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-black text-sm`}>
                          {p.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-black">{p.name}</h3>
                          <p className={`text-xs ${p.textColor}`}>{p.handle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                          p.status === "connected" ? "bg-green-500/20 text-green-400 border border-green-500/40" :
                          p.status === "pending" ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" :
                          "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}>
                          {p.status === "connected" ? "✓ Connected" : p.status === "pending" ? "⏳ Pending" : "Connect"}
                        </span>
                        {p.status === "connected" && (
                          <button className="p-2 rounded-xl bg-blue-900/30 border border-blue-700/40 hover:border-blue-500 transition-colors">
                            <RefreshCw className="w-4 h-4 text-blue-400" />
                          </button>
                        )}
                      </div>
                    </div>
                    {p.followers !== "—" ? (
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-[#050c1a] rounded-xl p-3 text-center">
                          <p className="text-white font-black text-sm">{p.followers}</p>
                          <p className="text-blue-400 text-xs">Followers</p>
                        </div>
                        <div className="bg-[#050c1a] rounded-xl p-3 text-center">
                          <p className="text-white font-black text-sm">{p.following}</p>
                          <p className="text-blue-400 text-xs">Following</p>
                        </div>
                        <div className="bg-[#050c1a] rounded-xl p-3 text-center">
                          <p className="text-cyan-400 font-black text-sm">{p.engagement}</p>
                          <p className="text-blue-400 text-xs">Engagement</p>
                        </div>
                        <div className="bg-[#050c1a] rounded-xl p-3 text-center">
                          <p className="text-blue-300 font-bold text-xs">{p.lastPost}</p>
                          <p className="text-blue-400 text-xs">Last Post</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#050c1a] rounded-xl p-3">
                        <p className="text-blue-300 text-sm">{p.nilValue}</p>
                      </div>
                    )}
                    {p.status !== "connected" && (
                      <button className={`w-full mt-3 bg-gradient-to-r ${p.color} text-white font-bold py-2 rounded-xl text-sm hover:opacity-90 transition-opacity`}>
                        Connect {p.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Reach", value: `${(totalFollowers / 1000).toFixed(1)}K`, icon: Users, color: "text-[#1E90FF]" },
                    { label: "Avg Engagement", value: "3.8%", icon: TrendingUp, color: "text-green-400" },
                    { label: "Brand Mentions", value: "247", icon: Bell, color: "text-cyan-400" },
                    { label: "AthlynX Score", value: "74/100", icon: Activity, color: "text-blue-400" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-[#0d1a3a] border border-blue-700/50 rounded-xl p-4 text-center">
                      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                      <p className={`font-black text-xl ${color}`}>{value}</p>
                      <p className="text-blue-400 text-xs font-bold">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
                  <h3 className="text-white font-black mb-4">Follower Growth by Platform</h3>
                  <div className="space-y-3">
                    {PLATFORMS.filter(p => p.followers !== "—").map((p, i) => {
                      const count = parseInt(p.followers.replace(/,/g, ""));
                      const pct = Math.round((count / totalFollowers) * 100);
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`font-bold ${p.textColor}`}>{p.name}</span>
                            <span className="text-white font-bold">{p.followers}</span>
                          </div>
                          <div className="w-full bg-blue-900/30 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${p.color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
                  <h3 className="text-white font-black mb-4">Best Posting Times</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { platform: "Instagram", time: "6–9 PM", day: "Tuesday & Thursday" },
                      { platform: "TikTok", time: "7–9 PM", day: "Friday & Saturday" },
                      { platform: "X / Twitter", time: "12–3 PM", day: "Monday & Wednesday" },
                      { platform: "Facebook", time: "1–4 PM", day: "Wednesday & Friday" },
                      { platform: "LinkedIn", time: "8–10 AM", day: "Tuesday & Thursday" },
                      { platform: "YouTube", time: "2–4 PM", day: "Saturday & Sunday" },
                    ].map((item, i) => (
                      <div key={i} className="bg-[#050c1a] border border-blue-700/40 rounded-xl p-3">
                        <p className="text-white font-bold text-sm">{item.platform}</p>
                        <p className="text-cyan-400 font-black text-base">{item.time}</p>
                        <p className="text-blue-400 text-xs">{item.day}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NIL Value Tab */}
            {activeTab === "nil" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/10 border border-green-500/40 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    <h2 className="text-white font-black text-lg">Your Social Media NIL Value</h2>
                  </div>
                  <p className="text-blue-300 text-sm mb-4">Based on your connected accounts, your estimated NIL value from social media alone:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0d1a3a] rounded-xl p-4 text-center">
                      <p className="text-blue-400 text-xs font-bold uppercase mb-1">Conservative Estimate</p>
                      <p className="text-green-400 font-black text-2xl">$45,250</p>
                      <p className="text-blue-400 text-xs">per year</p>
                    </div>
                    <div className="bg-[#0d1a3a] rounded-xl p-4 text-center">
                      <p className="text-blue-400 text-xs font-bold uppercase mb-1">High Estimate</p>
                      <p className="text-cyan-400 font-black text-2xl">$153,000</p>
                      <p className="text-blue-400 text-xs">per year</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
                  <h3 className="text-white font-black mb-4">NIL Value by Follower Count</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-700/50">
                          {["Follower Range", "Min NIL Value", "Max NIL Value", "Best Platform"].map(h => (
                            <th key={h} className="text-left text-blue-400 font-bold py-2 pr-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {NIL_VALUE_TABLE.map((row, i) => (
                          <tr key={i} className="border-b border-blue-700/30">
                            <td className="text-white font-bold py-3 pr-4">{row.range}</td>
                            <td className="text-green-400 font-bold py-3 pr-4">{row.nilMin}</td>
                            <td className="text-cyan-400 font-bold py-3 pr-4">{row.nilMax}</td>
                            <td className="text-blue-300 py-3">{row.platform}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-6">
                  <h3 className="text-white font-black mb-3">AthlynX Commission on Social NIL Deals</h3>
                  <p className="text-blue-300 text-sm mb-4">When AthlynX facilitates a brand deal through your social media presence, we take 10–15% of the deal value. You keep 85–90%.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { deal: "$10,000 NIL Deal", athlynx: "$1,000–$1,500", athlete: "$8,500–$9,000" },
                      { deal: "$50,000 NIL Deal", athlynx: "$5,000–$7,500", athlete: "$42,500–$45,000" },
                      { deal: "$100,000 NIL Deal", athlynx: "$10,000–$15,000", athlete: "$85,000–$90,000" },
                    ].map((row, i) => (
                      <div key={i} className="bg-[#050c1a] border border-blue-700/40 rounded-xl p-3">
                        <p className="text-white font-bold text-sm mb-2">{row.deal}</p>
                        <p className="text-blue-400 text-xs">AthlynX: <span className="text-[#1E90FF] font-bold">{row.athlynx}</span></p>
                        <p className="text-blue-400 text-xs">You keep: <span className="text-green-400 font-bold">{row.athlete}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#1E90FF]/20 to-cyan-500/10 border border-[#1E90FF]/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-[#1E90FF]" />
                    <h2 className="text-white font-black text-lg">Your Data. Your Control.</h2>
                  </div>
                  <p className="text-blue-300 text-sm leading-relaxed">
                    AthlynX connects to your social accounts via secure OAuth — we never store your passwords. You can disconnect any platform at any time. Your data is never sold to third parties.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "What AthlynX Stores", items: ["Follower count (synced daily)", "Engagement rate (synced daily)", "Post count", "Account handle and bio"], icon: CheckCircle, color: "text-green-400" },
                    { title: "What AthlynX Does NOT Store", items: ["Your social media passwords", "Private messages or DMs", "Financial information from social platforms", "Location data from social apps"], icon: AlertCircle, color: "text-red-400" },
                    { title: "How Your Data Is Used", items: ["Calculate your NIL value in real-time", "Enrich your AthlynX CRM profile", "Show recruiting coaches your brand reach", "Generate brand partnership opportunities"], icon: Eye, color: "text-cyan-400" },
                  ].map(({ title, items, icon: Icon, color }) => (
                    <div key={title} className="bg-[#0d1a3a] border border-blue-700/50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`w-5 h-5 ${color}`} />
                        <h3 className="text-white font-black">{title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-blue-300 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full ${color.replace("text-", "bg-")}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
