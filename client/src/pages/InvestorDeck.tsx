import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav';
import {
  TrendingUp, Globe, Cpu, Zap, Shield, Users, BarChart3,
  DollarSign, Building2, Award, Target, ArrowRight, Mail,
  MapPin, ChevronRight, Activity, Database, Network, Layers,
  Trophy, Star, Rocket, Lock, CheckCircle, Play
} from "lucide-react";

function InvestorDeckInner() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">

      {/*  HERO  */}
      <section className="relative py-24 overflow-hidden border-b border-white/10">
        {/* Stadium lights background */}
        <div className="absolute inset-0 bg-[url('/stadium-lights.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/60 via-[#0A1628]/80 to-[#0A1628]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#1E90FF]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/athlynx-owl-mark.png"
                alt="AthlynXAI"
                className="h-20 w-20 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E90FF]/15 border border-[#1E90FF]/30 rounded-full mb-6">
              <Lock className="w-3.5 h-3.5 text-[#1E90FF]" />
              <span className="text-[#00C2FF] text-xs font-bold tracking-widest uppercase">Confidential — Investment Opportunity</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-3 tracking-tight">
              DOZIER HOLDINGS GROUP
            </h1>
            <p className="text-xl md:text-2xl text-[#00C2FF] font-semibold mb-2 tracking-wide">
              AthlynXAI OS v1 · Diamond Grind · SOFTMOR INC
            </p>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-base">
              The world's first fully autonomous, tokenized, AI-native sports operating system — built by 1 man, powered by Nebius H200 infrastructure, and engineered to run a $1 billion company.
            </p>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Sports Tech Market", value: "$26.6B", icon: TrendingUp },
                { label: "Hardware Pipeline", value: "$27.5M", icon: Database },
                { label: "AI Compute Rail", value: "H200 Nebius", icon: Cpu },
                { label: "Target Valuation", value: "$1B+", icon: DollarSign },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Icon className="w-5 h-5 text-[#1E90FF] mx-auto mb-2" />
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-gray-400 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  THE PLATFORM  */}
      <section className="py-20 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">AthlynXAI OS v1</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The first athlete operating system that runs recruiting, NIL, training, health, commerce, and AI — in one unified platform.
            </p>
          </div>

          {/* Stars: MCWS + Diamond Grind */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
            {/* MCWS */}
            <div className="relative overflow-hidden rounded-2xl border border-[#1E90FF]/40 bg-gradient-to-br from-[#0d1f3c] to-[#0A1628] p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#1E90FF]/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#1E90FF]/20 border border-[#1E90FF]/40 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#1E90FF]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#00C2FF] tracking-widest uppercase">Live Now</div>
                    <h3 className="text-xl font-black text-white">Men's College World Series</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  AthlynXAI OS is the official bracket, live score, and recruiting intelligence platform for the 2026 MCWS — Charles Schwab Field, Omaha. 8 teams. Real-time data. Auto-refreshing every 60 seconds.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Live Brackets", "Real-Time Scores", "Recruiting Profiles", "NIL Valuations"].map(t => (
                    <span key={t} className="text-xs px-3 py-1 bg-[#1E90FF]/15 border border-[#1E90FF]/30 rounded-full text-[#00C2FF]">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Diamond Grind */}
            <div className="relative overflow-hidden rounded-2xl border border-[#00C2FF]/40 bg-gradient-to-br from-[#0d1f3c] to-[#0A1628] p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#00C2FF]/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#00C2FF]/20 border border-[#00C2FF]/40 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#00C2FF]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#00C2FF] tracking-widest uppercase">Elite Baseball</div>
                    <h3 className="text-xl font-black text-white">Diamond Grind</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  The premier baseball recruiting and development platform inside AthlynXAI OS. Connects elite youth, high school, and college players to coaches, scouts, and NIL opportunities nationwide.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Elite Recruiting", "Showcase Events", "Coach Network", "AI Scouting Reports"].map(t => (
                    <span key={t} className="text-xs px-3 py-1 bg-[#00C2FF]/15 border border-[#00C2FF]/30 rounded-full text-[#00C2FF]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DHG Ecosystem */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* AthlynX — custom render so Diamond Grind is a clickable link */}
            <div className="rounded-2xl border border-[#1E90FF]/30 bg-gradient-to-br from-[#1E90FF]/10 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-lg flex items-center justify-center">
                  <Layers className="w-4.5 h-4.5 text-[#1E90FF]" />
                </div>
                <div>
                  <div className="font-black text-white text-sm">AthlynX</div>
                  <div className="text-gray-400 text-xs">The Athlete's Playbook</div>
                </div>
              </div>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-gray-300 text-xs">
                  <ChevronRight className="w-3 h-3 text-[#1E90FF] mt-0.5 shrink-0" />
                  NIL Portal — Deal marketplace
                </li>
                <li className="flex items-start gap-2 text-xs">
                  <ChevronRight className="w-3 h-3 text-[#1E90FF] mt-0.5 shrink-0" />
                  <Link href="/diamond-grind" className="text-[#00C2FF] hover:text-white hover:underline transition-colors">
                    Diamond Grind — Elite baseball
                  </Link>
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-xs">
                  <ChevronRight className="w-3 h-3 text-[#1E90FF] mt-0.5 shrink-0" />
                  Messenger — Private comms
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-xs">
                  <ChevronRight className="w-3 h-3 text-[#1E90FF] mt-0.5 shrink-0" />
                  Transfer Portal — Recruiting
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-xs">
                  <ChevronRight className="w-3 h-3 text-[#1E90FF] mt-0.5 shrink-0" />
                  AI Training Bots — Fuel Bots
                </li>
              </ul>
            </div>

            {/* SOFTMOR INC + AI Training Layer — unchanged, still use shared map */}
            {[
              {
                icon: Building2,
                name: "SOFTMOR INC",
                sub: "AI & Data Center Solutions",
                items: ["Enterprise AI platforms", "Data center construction", "Hardware distribution", "Technical support services", "Geothermal power integration"],
                border: "border-white/20",
                bg: "from-white/5 to-transparent",
              },
              {
                icon: Cpu,
                name: "AI Training Layer",
                sub: "AI Companions Division",
                items: ["Athletic training robots", "Medical response units", "Stadium security", "Data center operations", "Energy sector automation"],
                border: "border-[#00C2FF]/30",
                bg: "from-[#00C2FF]/10 to-transparent",
              },
            ].map(({ icon: Icon, name, sub, items, border, bg }) => (
              <div key={name} className={`rounded-2xl border ${border} bg-gradient-to-br ${bg} p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-[#1E90FF]" />
                  </div>
                  <div>
                    <div className="font-black text-white text-sm">{name}</div>
                    <div className="text-gray-400 text-xs">{sub}</div>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-gray-300 text-xs">
                      <ChevronRight className="w-3 h-3 text-[#1E90FF] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/*  MARKET OPPORTUNITY  */}
      <section className="py-20 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Market Opportunity</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              DHG operates at the intersection of three explosive growth markets simultaneously.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: TrendingUp, value: "$26.6B", label: "Sports Technology", desc: "Global sports tech market growing at 17.5% CAGR. NIL market projected to reach $1.17B by 2026." },
              { icon: Activity, value: "$180M", label: "AI Companions", desc: "Annual addressable market for AI companions in sports, data centers, and energy sectors." },
              { icon: Database, value: "$500B+", label: "Data Center Infrastructure", desc: "Global data center market with AI driving unprecedented demand for compute infrastructure." },
            ].map(({ icon: Icon, value, label, desc }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="w-10 h-10 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#1E90FF]" />
                </div>
                <div className="text-4xl font-black text-[#00C2FF] mb-1">{value}</div>
                <div className="text-white font-bold mb-2">{label}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  REVENUE MODEL  */}
      <section className="py-20 bg-white/[0.02] border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Revenue Model</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four diversified revenue streams across SaaS, hardware, AI, and licensing.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: "Subscriptions",
                sub: "Recurring SaaS revenue",
                items: ["Pro: $9.99/mo — 50 AI credits", "Elite: $29.99/mo — 200 AI credits", "Enterprise: Custom pricing"],
              },
              {
                icon: Database,
                title: "Hardware Sales",
                sub: "Enterprise infrastructure",
                items: ["Supermicro servers: $15K–$40K", "Data center packages: $100K–$2.5M+", "Infrastructure Review — NVIDIA Elite Partner"],
              },
              {
                icon: Cpu,
                title: "Fuel Bots Leasing",
                sub: "AI companion contracts",
                items: ["University contracts: $50K–$500K", "Pro team packages: Custom", "Data subscriptions for coaches"],
              },
              {
                icon: Globe,
                title: "White-Label Licensing",
                sub: "Platform licensing",
                items: ["Sport-specific apps: $5K–$50K", "Enterprise AI suite: $10K+", "API access fees"],
              },
            ].map(({ icon: Icon, title, sub, items }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1E90FF]" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{title}</div>
                    <div className="text-gray-400 text-xs">{sub}</div>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-gray-300 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-[#1E90FF] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  STRATEGIC PARTNERSHIPS  */}
      <section className="py-20 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Strategic Partnerships</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#00C2FF]/15 border border-[#00C2FF]/30 rounded-xl flex items-center justify-center">
                  <Network className="w-6 h-6 text-[#00C2FF]" />
                </div>
                <div>
                  <div className="text-white font-black text-lg">ICC-USA</div>
                  <div className="text-[#00C2FF] text-sm">NVIDIA Elite Partner of the Year 2024</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Enterprise hardware partnership providing access to Supermicro servers, NVIDIA networking, and data center infrastructure at competitive pricing.
              </p>
              <div className="text-2xl font-black text-[#00C2FF]">$27.5M Pipeline</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#1E90FF]/15 border border-[#1E90FF]/30 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#1E90FF]" />
                </div>
                <div>
                  <div className="text-white font-black text-lg">Global Expansion</div>
                  <div className="text-[#1E90FF] text-sm">US — China — Hong Kong Operations</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Strategic positioning for international data center development, hardware distribution, and AI companion manufacturing with established relationships in key markets.
              </p>
              <div className="text-2xl font-black text-[#1E90FF]">3 Continents</div>
            </div>
          </div>
        </div>
      </section>

      {/*  ROADMAP  */}
      <section className="py-20 bg-white/[0.02] border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Implementation Roadmap</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                phase: "1", color: "bg-[#1E90FF]", period: "Q1–Q2 2026",
                title: "AthlynXAI OS v1 Launch",
                items: ["Full public launch — athlynx.ai", "MCWS live bracket + Diamond Grind beta", "10,000 founding members target", "5–10 Fuel Bots per partner university"],
              },
              {
                phase: "2", color: "bg-[#00C2FF]", period: "Q3–Q4 2026",
                title: "Scale & Expand",
                items: ["Roll out 44+ sport platforms", "1,000+ athlete metrics tracked", "Data center partnerships active", "Enterprise hardware sales pipeline"],
              },
              {
                phase: "3", color: "bg-white", period: "2027",
                title: "Market Leadership",
                items: ["50–100 university partnerships", "Pro team contracts", "International expansion", "IPO preparation"],
              },
            ].map(({ phase, color, period, title, items }) => (
              <div key={phase} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-[#0A1628] font-black text-sm shrink-0`}>{phase}</div>
                  <div className="w-0.5 bg-white/10 flex-1 mt-2" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 mb-2">
                  <div className="text-[#00C2FF] text-xs font-bold tracking-widest uppercase mb-1">{period}</div>
                  <div className="text-white font-black text-lg mb-3">{title}</div>
                  <ul className="space-y-1.5">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-gray-400 text-sm">
                        <ArrowRight className="w-3.5 h-3.5 text-[#1E90FF] mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  LEADERSHIP  */}
      <section className="py-20 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Leadership</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1E90FF] to-[#0a1628] border-2 border-[#1E90FF]/40 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#1E90FF]" />
              </div>
              <div className="text-xl font-black text-white mb-1">Chad A. Dozier Sr.</div>
              <div className="text-[#00C2FF] text-sm font-semibold mb-4">Chief Executive Officer &amp; Founder</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Visionary entrepreneur who built the entire DHG ecosystem from the ground up. Deep expertise in sports technology, AI integration, and enterprise partnerships. 1 man. 1 AI. $1B vision.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1E90FF] to-[#0a1628] border-2 border-[#1E90FF]/40 rounded-full mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-[#1E90FF]" />
              </div>
              <div className="text-xl font-black text-white mb-1">Glenn Tse</div>
              <div className="text-[#1E90FF] text-sm font-semibold mb-4">CFO &amp; VP Business Development</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Strategic financial partner with extensive experience in US-Asia business operations. Based in Hong Kong with connections across China and the United States.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*  AI INFRASTRUCTURE  */}
      <section className="py-20 bg-white/[0.02] border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">AI Infrastructure</h2>
            <p className="text-gray-400 max-w-xl mx-auto">AthlynXAI OS runs on the most powerful AI compute stack available — all wired into one platform.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Cpu, name: "Nebius H200", desc: "Primary compute rail" },
              { icon: Zap, name: "Google Gemini 2.5", desc: "Multimodal AI" },
              { icon: Activity, name: "OpenAI GPT-4o", desc: "Language intelligence" },
              { icon: Shield, name: "Anthropic Claude", desc: "Safety-first reasoning" },
              { icon: Target, name: "Perplexity Sonar", desc: "Real-time research" },
              { icon: Network, name: "Grok xAI", desc: "Live data analysis" },
            ].map(({ icon: Icon, name, desc }) => (
              <div key={name} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1E90FF]" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{name}</div>
                  <div className="text-gray-400 text-xs">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E90FF]/15 border border-[#1E90FF]/30 rounded-full mb-6">
              <Rocket className="w-3.5 h-3.5 text-[#1E90FF]" />
              <span className="text-[#00C2FF] text-xs font-bold tracking-widest uppercase">Be The Legacy</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Join the Future</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
              DHG is positioned at the intersection of sports technology, AI, and infrastructure — three of the fastest-growing markets in the world. We are looking for strategic partners who share our vision.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Link href="/partner-portal">
                <button className="flex items-center gap-2 px-8 py-4 bg-[#1E90FF] hover:bg-[#1565C0] text-white font-bold rounded-xl transition-all">
                  <ArrowRight className="w-4 h-4" />
                  Partner Portal Access
                </button>
              </Link>
              <Link href="/dhg">
                <button className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 transition-all">
                  <Play className="w-4 h-4" />
                  Learn More About DHG
                </button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> contact@athlynx.ai</span>
              <span className="hidden sm:block">·</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Dozier Holdings Group — Houston, Texas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 text-xs">
            &copy; 2026 Chad A. Dozier Sr. and affiliated Dozier Holdings Group / AthlynXAI entities. All rights reserved. Confidential and proprietary.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function InvestorDeck() {
  return (
    <PlatformLayout>
      <InvestorDeckInner />
      <MobileBottomNav />
    </PlatformLayout>
  );
}
