/**
 * AthlynX — Public OS Overview
 *
 * Public-facing version only. The true AthlynXAI OS layer cake, vendor map,
 * engine routing, deployment topology, and operating blueprint are confidential
 * company IP and must not be published on the public website.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";
import { useEffect, useState } from "react";

// Live compute manifest — fetched from /api/os/compute (no keys, public-safe).
type ComputeManifest = {
  hardware?: string;
  nebius_configured?: boolean;
  open_model_alignment?: string[];
  ising_readiness?: boolean;
};

function NvidiaComputeProofPanel() {
  const [m, setM] = useState<ComputeManifest | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("/api/os/compute", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => alive && setM(data))
      .catch(() => alive && setErr(true));
    return () => { alive = false; };
  }, []);
  if (err || !m) return null;
  return (
    <div className="rounded-2xl border-2 border-[#1E90FF] bg-gradient-to-br from-[#0a1628] via-black to-[#0a1628] p-5 md:p-6 shadow-[0_0_36px_-8px_rgba(30,144,255,0.55)]">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white bg-[#1E90FF] px-2 py-1 rounded">
          AthlynXAI OS · Compute Layer
        </span>
        <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#88a8ff]">
          {m.hardware ?? "NVIDIA H200 · Nebius AI Cloud"}
        </span>
        <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${m.nebius_configured ? "bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/50" : "bg-white/5 text-white/40 border border-white/20"}`}>
          {m.nebius_configured ? "● NEBIUS LIVE" : "○ Not configured"}
        </span>
      </div>
      <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2">
        NVIDIA-Class compute, wired into the OS.
      </h3>
      <p className="text-sm text-white/80 leading-snug max-w-3xl mb-4">
        AthlynXAI OS runs production inference on NVIDIA H200 GPUs via Nebius AI Cloud, including NVIDIA Nemotron Ultra 253B. We are positioned alongside NVIDIA’s open-model portfolio as a vertical sports workload generator.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(m.open_model_alignment ?? []).map((line, i) => (
          <div key={i} className="flex items-start gap-2 rounded-md border border-[#1E90FF]/25 bg-black/40 px-3 py-2">
            <span className="text-[#1E90FF] font-black mt-0.5">▸</span>
            <span className="text-xs text-white/85 leading-snug">{line}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
        <span className="text-[#88a8ff]">Ising readiness:</span>
        <span className={m.ising_readiness ? "text-[#1E90FF]" : "text-white/45"}>
          {m.ising_readiness ? "● ENABLED" : "○ Standby (flip NEBIUS_ISING_ENABLED when live via Nebius)"}
        </span>
      </div>
    </div>
  );
}

const PUBLIC_CAPABILITIES = [
  {
    layer: "Intelligence",
    name: "Athlete Intelligence",
    role: "Private AI-Assisted Operating Layer",
    desc: "Recruiting, NIL, training, media, and career tools designed to work together behind a protected architecture.",
    color: "from-blue-500 to-cyan-500",
    icon: "⚡",
    badge: "PROTECTED",
    badgeColor: "bg-blue-600",
  },
  {
    layer: "Compute",
    name: "NVIDIA-Class AI Compute",
    role: "Quantum-AI Aligned Infrastructure",
    desc: "AthlynXAI OS runs production inference on NVIDIA H200 GPU infrastructure via Nebius AI Cloud. The platform is positioned alongside NVIDIA’s open-model portfolio (Nemotron, Cosmos, Ising) as a vertical-AI workload generator for sports.",
    color: "from-[#1E90FF] to-[#0080FF]",
    icon: "🖥️",
    badge: "NVIDIA H200",
    badgeColor: "bg-[#1E90FF]",
  },
  {
    layer: "Experience",
    name: "Unified Athlete OS",
    role: "One Flow Across the Athlete Journey",
    desc: "Profiles, content, communication, discovery, scheduling, and opportunity workflows connected through one platform experience.",
    color: "from-purple-500 to-violet-500",
    icon: "🧠",
    badge: "UNIFIED",
    badgeColor: "bg-purple-600",
  },
  {
    layer: "Reliability",
    name: "Production Platform",
    role: "Built for Live Operations",
                desc: "The public experience communicates scale and reliability without exposing the internal blueprint.",
    color: "from-green-500 to-emerald-500",
    icon: "🛡️",
    badge: "LIVE",
    badgeColor: "bg-green-600",
  },
  {
    layer: "Commerce",
    name: "Monetization Ready",
    role: "Memberships, Credits, Licensing, and Partner Programs",
    desc: "AthlynXAI OS is structured to support athlete services, brand relationships, licensing models, and business operations at scale.",
    color: "from-indigo-500 to-violet-600",
    icon: "💳",
    badge: "READY",
    badgeColor: "bg-indigo-600",
  },
  {
    layer: "Security",
    name: "Confidential Architecture",
    role: "Blueprint Protected",
    desc: "Vendor names, engine routing, deployment paths, data topology, and operating logic are internal company IP and available only through approved inquiry.",
    color: "from-slate-600 to-gray-800",
    icon: "🔒",
    badge: "PRIVATE",
    badgeColor: "bg-gray-700",
  },
];

const PUBLIC_LAYERS = [
  {
    tier: "ATHLETE EXPERIENCE",
    color: "border-blue-600 bg-blue-900/10",
    titleColor: "text-blue-400",
    items: [
      { name: "Recruiting Presence", desc: "Tools that help athletes build a stronger recruiting and media profile.", icon: "🏆" },
      { name: "NIL Readiness", desc: "A structured path for brand value, opportunity tracking, and monetization workflows.", icon: "💼" },
      { name: "Transfer Journey", desc: "A guided experience for athletes working toward better fit, visibility, and opportunity.", icon: "🔁" },
    ],
  },
  {
    tier: "PLATFORM EXPERIENCE",
    color: "border-cyan-600 bg-cyan-900/10",
    titleColor: "text-cyan-400",
    items: [
      { name: "Profiles & Media", desc: "Athlete profiles, highlights, content, and public-facing presentation tools.", icon: "🎥" },
      { name: "Communication", desc: "Messaging, alerts, and relationship workflows for users and operators.", icon: "💬" },
      { name: "Marketplace Direction", desc: "Built to support athletes, brands, teams, services, and future licensing channels.", icon: "🛒" },
    ],
  },
  {
    tier: "OPERATING FOUNDATION",
    color: "border-green-600 bg-green-900/10",
    titleColor: "text-green-400",
    items: [
      { name: "Live Platform", desc: "Production systems are monitored and operated without publishing sensitive implementation details.", icon: "✅" },
      { name: "Protected Data", desc: "User, business, and operational data are handled through controlled internal systems.", icon: "🔐" },
      { name: "Private OS Blueprint", desc: "The full layer cake is confidential AthlynXAI company IP, not public marketing copy.", icon: "🔒" },
    ],
  },
  {
    tier: "AI COMPUTE · NVIDIA-CLASS",
    color: "border-[#1E90FF] bg-[#0a1628]/40",
    titleColor: "text-[#1E90FF]",
    items: [
      { name: "NVIDIA H200 Inference", desc: "AthlynXAI OS runs production AI workloads on NVIDIA H200 GPU infrastructure via Nebius AI Cloud.", icon: "⚡" },
      { name: "Open-Model Aligned", desc: "Designed to integrate with NVIDIA’s open-model portfolio (Nemotron, Cosmos, Ising) as vertical sports AI evolves.", icon: "🧠" },
      { name: "Workload Generator", desc: "AthlynX is the demand-side workload for AI infrastructure — recruiting, NIL valuation, Battery Coach, scouting, content. Every athlete query = inference cycles.", icon: "📊" },
    ],
  },
];

const PUBLIC_STATS = [
  { label: "Platform", value: "Live", icon: "✅", color: "text-green-400" },
  { label: "Blueprint", value: "Private", icon: "🔒", color: "text-cyan-400" },
  { label: "Athletes", value: "First", icon: "🏆", color: "text-cyan-400" },
  { label: "Inquiry", value: "Open", icon: "✉️", color: "text-blue-400" },
];

function LayerCakeInner() {
  return (
    <PlatformLayout title="AthlynXAI OS">
      <div className="max-w-6xl mx-auto px-2 py-4 space-y-6">
        <div className="bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-700 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #00d4ff 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-black mb-4 tracking-widest">
REVOLUTIONARY AthlynXAI OS
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
The CERN of US Sports Tech
            </h1>
            <p className="text-blue-300 text-base max-w-3xl mx-auto mb-4">
              A revolutionary operating system for athlete visibility, recruiting presence, NIL readiness, communication, media, and long-term opportunity.
              The public can see the vision; the internal engine map and implementation blueprint stay confidential.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {["Revolutionary", "Athlete-first", "NIL-ready", "Blueprint protected"].map((label) => (
                <span key={label} className="bg-blue-900/50 border border-blue-600 text-blue-300 px-3 py-1 rounded-full font-bold">{label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-green-500 bg-green-900/20 p-4 flex items-center gap-4">
          <div className="text-3xl">🔒</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-black text-sm">CONFIDENTIAL ARCHITECTURE PROTECTED</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-green-500/20 border-green-500 text-green-400">● LIVE</span>
            </div>
            <p className="text-blue-300 text-xs">
              Public visitors see the revolutionary mission and capability categories. The true operating blueprint stays internal.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-green-400 font-black text-sm">PRIVATE</div>
            <div className="text-green-300 text-[10px]">IP LOCKED</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PUBLIC_STATS.map((stat) => (
            <div key={stat.label} className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-blue-500 text-[9px] mt-0.5 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-700" />
            <h2 className="text-white font-black text-lg px-3">AthlynXAI OS — PUBLIC OVERVIEW</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-700" />
          </div>
          <div className="space-y-3">
            {PUBLIC_CAPABILITIES.map((engine, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 overflow-hidden hover:border-blue-600 transition-all">
                <div className={`bg-gradient-to-r ${engine.color} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{engine.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-black text-base">{engine.name}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${engine.badgeColor}`}>{engine.badge}</span>
                      </div>
                      <div className="text-white/80 text-xs">{engine.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs font-mono">{engine.layer}</span>
                    <span className="bg-green-500/20 border border-green-500 text-green-400 text-[9px] font-black px-2 py-0.5 rounded-full">● LIVE</span>
                  </div>
                </div>
                <div className="px-4 py-2">
                  <p className="text-blue-300 text-xs">{engine.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live NVIDIA-class compute proof panel (fetched from /api/os/compute) */}
        <NvidiaComputeProofPanel />

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-700" />
            <h2 className="text-white font-black text-lg px-3">OPERATING CATEGORIES</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-700" />
          </div>
          <div className="space-y-4">
            {PUBLIC_LAYERS.map((layer, i) => (
              <div key={i} className={`rounded-2xl border-2 ${layer.color} p-4`}>
                <div className={`text-xs font-black tracking-widest mb-3 ${layer.titleColor}`}>{layer.tier}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {layer.items.map((item, j) => (
                    <div key={j} className="bg-[#0d1b3e]/80 rounded-xl border border-blue-900 p-3 flex items-start gap-2">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="text-white font-bold text-xs">{item.name}</span>
                          <span className="text-green-400 text-[9px] font-black">● ACTIVE</span>
                        </div>
                        <p className="text-blue-400 text-[10px] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0a0f1e] to-[#1a1a2e] rounded-2xl border border-cyan-700/50 p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0">✉️</div>
            <div>
              <h3 className="text-white font-black text-lg mb-2">Questions or Partnership Inquiries</h3>
              <p className="text-blue-300 text-sm leading-relaxed mb-3">
                AthlynXAI OS is built for serious athletes, teams, operators, brands, and strategic partners. Public materials explain what the platform does; the private implementation map is shared only through approved conversations.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Athlete platform", "NIL readiness", "Recruiting visibility", "Private architecture", "Partner inquiry"].map((tag) => (
                  <span key={tag} className="bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Contact", href: "/contact", icon: "✉️" },
            { label: "Athlete Playbook", href: "/athlete-playbook", icon: "🏆" },
            { label: "NIL Portal", href: "/nil-portal", icon: "💼" },
            { label: "Transfer Portal", href: "/transfer-portal", icon: "🔁" },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center hover:border-cyan-600 hover:bg-blue-900/30 transition-all cursor-pointer">
                <div className="text-2xl mb-1">{link.icon}</div>
                <div className="text-white text-xs font-bold">{link.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function LayerCake() {
  return <RouteErrorBoundary><LayerCakeInner /></RouteErrorBoundary>;
}
