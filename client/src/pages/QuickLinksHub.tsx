import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";

const systems = {
  core: [
    { name: "Portal Website", description: "Main marketing site with features, pricing, and athlete showcase", icon: "/athlynx-icon.png", link: "/" },
    { name: "NIL Portal App", description: "Instagram-style social feed for athletes to build their brand", icon: "/mobile-app-logo.png", link: "/apps" },
    { name: "NIL Messenger", description: "Private messaging for agents, lawyers, and business conversations", icon: "/nil-messenger-logo.jpeg", link: "/messages" },
    { name: "Transfer Portal", description: "Track athletes, NIL valuations, connect with scouts", icon: "/nil-portal-app-logo.jpeg", link: "/transfer-portal", featured: true },
  ],
  management: [
    { name: "User Management", description: "Manage athletes, agents, brands, and subscriber accounts", icon: "/users-logo.png", link: "/dashboard" },
    { name: "Admin Dashboard", description: "System settings, configurations, and platform controls", icon: "/admin-logo.png", link: "/project-management" },
    { name: "Deals Marketplace", description: "Browse and manage NIL deals, sponsorships, and endorsements", icon: "/deals-logo.png", link: "/nil-marketplace" },
    { name: "Video Upload", description: "Upload and manage athlete highlight reels and content", icon: "/videos-logo.png", link: "/media" },
    { name: "Analytics Dashboard", description: "Platform metrics, user engagement, and revenue tracking", icon: "/analytics-logo.png", link: "/athlete-dashboard" },
    { name: "Contract Management", description: "Create, sign, and manage NIL contracts and agreements", icon: "/contracts-logo.png", link: "/nil-marketplace" },
  ],
  athlete: [
    { name: "AthlynXAI Training Bot", description: "Governed athlete training intelligence and performance workflows", icon: "/athlynxai-icon.png", link: "/ai-training-bot" },
    { name: "Wellness & Performance", description: "Mental and physical health support for athletes", icon: "/wellness-logo-final.png", link: "/medical" },
    { name: "Diamond Grind", description: "Baseball-specific training and analytics platform", icon: "/diamond-grind-icon.png", link: "/diamond-grind" },
  ],
  corporate: [
    { name: "DHG Corporate", description: "Dozier Holdings Group corporate structure and leadership", icon: "/dhg-logo.png", link: "/dhg" },
    { name: "Softmor Inc", description: "Technology division - AthlynX platform development", icon: "/hub-logo.png", link: "/softmor" },
  ],
};

function QuickLinksHubInner() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {/* Header */}
      <div className="text-center py-10 border-b border-white/10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src="/athlynx-icon.png" alt="NIL Portal" className="w-16 h-16 rounded-xl" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            NIL Portal
          </h1>
        </div>
        <p className="text-white/60">One Identity, Every Athlete, Every Platform - 14 Integrated Systems</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Core Applications */}
        <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-5 pl-1">Core Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {systems.core.map((system) => (
            <Link key={system.name} href={system.link}>
              <div className={`bg-white/5 border rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl ${system.featured ? 'border-2 border-[#1E90FF] bg-gradient-to-br from-[#1E90FF]/10 to-white/5' : 'border-white/10 hover:border-blue-500'}`}>
                <img src={system.icon} alt={system.name} className="w-16 h-16 rounded-xl mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{system.name}</h3>
                <p className="text-sm text-white/60 mb-4">{system.description}</p>
                <span className="text-sm font-semibold text-blue-500">Open →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Management Systems */}
        <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-5 pl-1">Management Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {systems.management.map((system) => (
            <Link key={system.name} href={system.link}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500">
                <img src={system.icon} alt={system.name} className="w-16 h-16 rounded-xl mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{system.name}</h3>
                <p className="text-sm text-white/60 mb-4">{system.description}</p>
                <span className="text-sm font-semibold text-blue-500">Open →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Athlete Services */}
        <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-5 pl-1">Athlete Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {systems.athlete.map((system) => (
            <Link key={system.name} href={system.link}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500">
                <img src={system.icon} alt={system.name} className="w-16 h-16 rounded-xl mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{system.name}</h3>
                <p className="text-sm text-white/60 mb-4">{system.description}</p>
                <span className="text-sm font-semibold text-blue-500">Explore →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Corporate */}
        <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-5 pl-1">Corporate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {systems.corporate.map((system) => (
            <Link key={system.name} href={system.link}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500">
                <img src={system.icon} alt={system.name} className="w-16 h-16 rounded-xl mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{system.name}</h3>
                <p className="text-sm text-white/60 mb-4">{system.description}</p>
                <span className="text-sm font-semibold text-blue-500">View →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-white/10">
        <img src="/athlynx-icon.png" alt="NIL Portal" className="w-10 h-10 rounded-lg mx-auto mb-3" />
        <p className="text-white font-semibold">NIL Portal Inc. - A Dozier Holdings Group Company</p>
        <p className="text-white/50 text-sm mt-1">14 integrated systems with shared database</p>
        <p className="text-white/50 text-sm mt-2">© 2024 NIL Portal Inc. All rights reserved.</p>
      </div>
    </div>
  );
}
export default function QuickLinksHub() {
  return <RouteErrorBoundary><QuickLinksHubInner /></RouteErrorBoundary>;
}
