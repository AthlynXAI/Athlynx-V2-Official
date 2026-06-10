import { useEffect } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { useLocation } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";

const PILLARS = [
  {
    icon: "💧",
    title: "Efficient Cooling Vision",
    desc: "The long-term infrastructure plan prioritizes efficient cooling, lower waste, strong uptime, and controlled operations without publishing facility-level engineering details.",
    stats: [
      { label: "Focus", value: "Efficiency" },
      { label: "Goal", value: "Reliability" },
      { label: "Access", value: "Private" },
    ],
    color: "border-cyan-700/50",
    glow: "shadow-cyan-900/30",
  },
  {
    icon: "🌋",
    title: "Energy-Aware Infrastructure",
    desc: "Future facilities are planned around resilient, cost-aware, and energy-conscious operations. Specific partner, facility, and engineering details remain private.",
    stats: [
      { label: "Carbon Footprint", value: "Net Zero" },
      { label: "Energy Source", value: "Geothermal" },
      { label: "Waste Energy", value: "Zero" },
    ],
    color: "border-green-700/50",
    glow: "shadow-green-900/30",
  },
  {
    icon: "🌿",
    title: "Living Roof — Water + Power",
    desc: "A living grass roof harvests fresh rainwater for immersion cooling fluid replenishment — eliminating municipal water dependency. Photosynthesis energy generation, carbon sequestration, and 30-40% natural insulation. The building is alive.",
    stats: [
      { label: "Water Source", value: "Self-Sufficient" },
      { label: "Insulation", value: "-40% Cooling" },
      { label: "Carbon", value: "Sequestered" },
    ],
    color: "border-green-800/50",
    glow: "shadow-green-950/30",
  },
  {
    icon: "⚛️",
    title: "Next-Generation Compute Research",
    desc: "AthlynXAI tracks emerging compute, security, and athlete-data technologies while keeping research priorities and technical implementation private.",
    stats: [
      { label: "Encryption", value: "Quantum-Grade" },
      { label: "AI Processing", value: "Next-Gen" },
      { label: "Timeline", value: "2026-2027" },
    ],
    color: "border-purple-700/50",
    glow: "shadow-purple-900/30",
  },
];

const PARTNERSHIPS = [
  {
    name: "Private Intelligence Layer",
    role: "Protected AI-assisted platform capability",
    desc: "AthlynXAI OS is designed to support recruiting visibility, NIL readiness, athlete content, and decision support without revealing the vendors, models, routing, or operating method behind the system.",
    icon: "🟢",
    status: "LIVE — Blueprint Protected"
  },
  {
    name: "Secure Platform Foundation",
    role: "Production-ready operating base",
    desc: "The public experience communicates reliability, scale, and speed. The implementation map, provider mix, data topology, and failover logic remain internal company IP.",
    icon: "🔒",
    status: "Protected"
  },
  {
    name: "Long-Term Infrastructure Vision",
    role: "Future-owned infrastructure strategy",
    desc: "The long-term roadmap includes controlled infrastructure, energy-aware facilities, and secure data operations for the full Dozier Holdings Group ecosystem.",
    icon: "🏗️",
    status: "Strategic Roadmap"
  },
  {
    name: "Partner Review Pathway",
    role: "Private conversations only",
    desc: "Strategic infrastructure and technology partnerships are handled through direct review. Public pages do not publish partner names, terms, or system design details unless explicitly approved.",
    icon: "🤝",
    status: "Inquiry Only"
  },
];

const LIVING_DATA_CENTER = [
  {
    icon: "🌋",
    title: "Geothermal Base Power",
    desc: "Advanced horizontal drilling beneath each facility taps into the earth's core heat for continuous, clean base-load power generation — 24/7, weather-independent. No generators. No fuel costs. No downtime."
  },
  {
    icon: "⚡",
    title: "Oil & Gas Turbine (CHP)",
    desc: "Combined Heat & Power turbines for peak demand — waste heat is recycled back into the facility for heating and energy recovery. Zero waste. Maximum efficiency."
  },
  {
    icon: "💧",
    title: "Efficient Cooling Research",
    desc: "Future facilities will prioritize efficiency, resilience, and responsible operations without publishing the technical blueprint."
  },
  {
    icon: "🚀",
    title: "High-Performance Operations",
    desc: "The roadmap focuses on performance, uptime, and cost discipline while keeping operating methods confidential."
  },
  {
    icon: "🌿",
    title: "Living Grass Roof",
    desc: "A living grass roof captures fresh rainwater fed directly into the immersion cooling fluid replenishment system. Natural insulation, carbon sequestration, and photosynthesis energy generation — the building is alive."
  },
  {
    icon: "⚛️",
    title: "Advanced Compute Research",
    desc: "Emerging compute and security research remains part of the long-term vision, with technical details reserved for approved internal review."
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "The Vision Begins",
    desc: "Chad A. Dozier and Glenn Tse form the foundation of AthlynXAI Corporation in Houston, TX. The infrastructure roadmap is drafted.",
  },
  {
    year: "Q1 2025",
    title: "Strategic Partnerships",
    desc: "Key technology and infrastructure partnerships established. Geothermal energy strategy finalized with horizontal drilling approach.",
  },
  {
    year: "Q2 2025",
    title: "Platform Launch",
    desc: "AthlynX platform goes live with 10 core apps. NIL Portal, Transfer Portal, and AI recruiting tools deployed.",
  },
  {
    year: "Q3 2025",
    title: "Infrastructure Build-Out",
    desc: "Data center site selection complete. Robotics integration testing begins. AI infrastructure scaled to support 100K+ athletes.",
  },
  {
    year: "2026",
    title: "Full Ecosystem Online",
    desc: "20-platform ecosystem live. Geothermal-powered data centers operational. AI Trainers, Teammates & Companions available to all members.",
  },
];

function InfrastructureInner() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "AthlynX — Infrastructure & Technology";
  }, []);

  return (
    <div className="min-h-screen bg-[#050d1a] text-white pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-blue-900/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-950/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-green-900/8 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-10 text-center px-4">
        <button
          onClick={() => setLocation("/home")}
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-300 text-sm mb-8 transition-colors"
        >
          ← Back to Platform
        </button>

        <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-600/40 rounded-full px-5 py-2 mb-6 text-blue-300 text-xs font-black tracking-widest">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          AthlynX INFRASTRUCTURE DIVISION
        </div>

        <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
          Built to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400">
            Last Forever
          </span>
        </h1>
        <p className="text-blue-300 text-lg max-w-2xl mx-auto leading-relaxed">
          The physical and digital infrastructure powering the AthlynX ecosystem — 
          geothermal data centers, advanced robotics, and AI systems built for the next generation of athletes.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className={`bg-[#0a1628]/80 border ${pillar.color} rounded-3xl p-8 shadow-xl ${pillar.glow} hover:-translate-y-1 transition-transform`}
            >
              <div className="text-5xl mb-4">{pillar.icon}</div>
              <h3 className="text-2xl font-black text-white mb-3">{pillar.title}</h3>
              <p className="text-blue-300/80 text-sm leading-relaxed mb-6">{pillar.desc}</p>
              <div className="grid grid-cols-3 gap-3">
                {pillar.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#050d1a]/60 rounded-xl p-3 text-center border border-white/5"
                  >
                    <div className="text-white font-black text-sm mb-1">{stat.value}</div>
                    <div className="text-blue-500 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision Statement */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-blue-900/30 to-green-900/20 border border-blue-700/30 rounded-3xl p-10 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h2 className="text-3xl font-black text-white mb-4">
            Geothermal Power Meets Sports Technology
          </h2>
          <p className="text-blue-200/80 text-base leading-relaxed max-w-2xl mx-auto">
            AthlynX is building the world's first athlete-focused data infrastructure powered entirely by 
            clean geothermal energy. Using advanced horizontal drilling techniques, our data centers will 
            operate at net-zero carbon — giving athletes a platform they can be proud of, built on energy 
            that respects the planet they compete on.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { icon: "🌍", label: "Net Zero Carbon" },
              { icon: "⚡", label: "Geothermal Power" },
              { icon: "🔒", label: "100% Secure" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-blue-300 text-xs font-bold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-3xl font-black text-white text-center mb-10">
          The Road We're Building
        </h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-600 to-green-600" />
          <div className="space-y-8">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative pl-16">
                <div className="absolute left-3.5 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-[#050d1a] shadow-lg shadow-blue-500/40" />
                <div className="bg-[#0a1628]/60 border border-blue-900/40 rounded-2xl p-5">
                  <div className="text-cyan-400 text-xs font-black tracking-widest mb-1">{item.year}</div>
                  <h3 className="text-white font-black text-lg mb-2">{item.title}</h3>
                  <p className="text-blue-300/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Partnerships */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-600/40 rounded-full px-5 py-2 mb-6 text-green-300 text-xs font-black tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            STRATEGIC PARTNERSHIPS
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Building With the Best</h2>
          <p className="text-blue-300/70 max-w-2xl mx-auto text-sm">
            DHG is in active discussions with world-class partners to build the most powerful sports infrastructure ever assembled.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PARTNERSHIPS.map((partner) => (
            <div key={partner.name} className="bg-[#0a1628]/80 border border-blue-800/40 rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{partner.icon}</span>
                  <div>
                    <h3 className="text-white font-black text-lg">{partner.name}</h3>
                    <p className="text-cyan-400 text-xs font-bold">{partner.role}</p>
                  </div>
                </div>
                <span className="bg-blue-900/30/40 border border-blue-400/40/40 text-blue-300 text-xs px-3 py-1 rounded-full font-bold">{partner.status}</span>
              </div>
              <p className="text-blue-300/70 text-sm leading-relaxed">{partner.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Living Data Center */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-600/40 rounded-full px-5 py-2 mb-6 text-green-300 text-xs font-black tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            PROPRIETARY INNOVATION
          </div>
          <h2 className="text-3xl font-black text-white mb-3">The Living Data Center™</h2>
          <p className="text-blue-300/70 max-w-2xl mx-auto text-sm">
            DHG's original concept — the world's first self-sustaining, living data center. 
            Geothermal power, gas turbines, grass roofs that harvest fresh water, photosynthesis energy generation, and quantum computing. 
            <span className="text-cyan-400 font-bold"> Patent pending.</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LIVING_DATA_CENTER.map((item) => (
            <div key={item.title} className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-700/30 rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-white font-black text-lg mb-2">{item.title}</h3>
              <p className="text-blue-300/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-gradient-to-r from-green-900/30 to-cyan-900/20 border border-green-700/30 rounded-2xl p-8 text-center">
          <p className="text-white font-black text-xl mb-2">"Own the Data. Own the Hardware. Own the World."</p>
          <p className="text-green-300/80 text-sm">— Chad A. Dozier, Founder · CEO · Chairman, AthlynX</p>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-b from-[#0a1628]/80 to-[#050d1a]/80 border border-blue-900/40 rounded-3xl p-10">
          <h2 className="text-3xl font-black text-white mb-3">
            Strategic Infrastructure Partnerships
          </h2>
          <p className="text-blue-300/80 text-sm mb-6 leading-relaxed">
            AthlynX is actively building partnerships with leading data center operators, 
            geothermal energy companies, and AI infrastructure providers. 
            Interested in partnering with us?
          </p>
          <button
            onClick={() => window.open("mailto:contact@athlynx.ai?subject=Infrastructure Partnership Inquiry", "_blank")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black px-8 py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/30"
          >
            Contact Our Infrastructure Team
          </button>
          <p className="text-blue-700 text-xs mt-6">
            A Dozier Holdings Group Company · AthlynXAI Corporation · Houston, TX
          </p>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function Infrastructure() {
  return <RouteErrorBoundary><InfrastructureInner /></RouteErrorBoundary>;
}
