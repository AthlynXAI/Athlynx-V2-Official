import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav';
import {
  TrendingUp, Globe, Cpu, Zap, Shield, Users, BarChart3,
  DollarSign, Building2, Award, Target, ArrowRight, Mail,
  MapPin, ChevronRight, Activity, Database, Network, Layers,
  Trophy, Star, Rocket, Lock, CheckCircle, Play
} from "lucide-react";

// Shared helper — renders a list item as a Link if href is provided, plain text otherwise
function EcoItem({ label, href }: { label: string; href?: string }) {
  return (
    <li className="flex items-start gap-2 text-xs">
      <ChevronRight className="w-3 h-3 text-[#1E90FF] mt-0.5 shrink-0" />
      {href ? (
        <Link href={href} className="text-[#00C2FF] hover:text-white hover:underline transition-colors">
          {label}
        </Link>
      ) : (
        <span className="text-gray-300">{label}</span>
      )}
    </li>
  );
}

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
            <Link href="/mcws-bracket">
              <div className="relative overflow-hidden rounded-2xl border border-[#1E90FF]/40 bg-gradient-to-br from-[#0d1f3c] to-[#0A1628] p-8 cursor-pointer hover:border-[#1E90FF]/70 transition-colors">
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
            </Link>

            {/* Diamond Grind */}
            <Link href="/diamond-grind">
              <div className="relative overflow-hidden rounded-2xl border border-[#00C2FF]/40 bg-gradient-to-br from-[#0d1f3c] to-[#0A1628] p-8 cursor-pointer hover:border-[#00C2FF]/70 transition-colors">
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
            </Link>
          </div>

          {/* DHG Ecosystem */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* AthlynX */}
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
                <EcoItem label="NIL Portal — Deal marketplace" href="/nil-portal" />
                <EcoItem label="Diamond Grind — Elite baseball" href="/diamond-grind" />
                <EcoItem label="Messenger — Private comms" href="/messenger" />
                <EcoItem label="Transfer Portal — Recruiting" href="/transfer-portal" />
                <EcoItem label="AI Training Bots — Fuel Bots" href="/fuel-bots" />
              </ul>
            </div>

            {/* SOFTMOR INC */}
            <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4.5 h-4.5 text-[#1E90FF]" />
                </div>
                <div>
                  <div className="font-black text-white text-sm">SOFTMOR INC</div>
                  <div className="text-gray-400 text-xs">AI & Data Center Solutions</div>
                </div>
              </div>
              <ul className="space-y-1.5">
                <EcoItem label="Enterprise AI platforms" href="/softmor" />
                <EcoItem label="Data center construction" href="/data-centers" />
                <EcoItem label="Hardware distribution" href="/icc-usa" />
                <EcoItem label="Technical support services" href="/softmor" />
                <EcoItem label="Geothermal power integration" />
              </ul>
            </div>

            {/* AI Training Layer */}
            <div className="rounded-2xl border border-[#00C2FF]/30 bg-gradient-to-br from-[#00C2FF]/10 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-lg flex items-center justify-center">
                  <Cpu className="w-4.5 h-4.5 text-[#1E90FF]" />
                </div>
                <div>
                  <div className="font-black text-white text-sm">AI Training Layer</div>
                  <div className="text-gray-400 text-xs">AI Companions Division</div>
                </div>
              </div>
              <ul className="space-y-1.5">
                <EcoItem label="Athletic training robots" href="/fuel-bots" />
                <EcoItem label="Medical response units" href="/fuel-bots" />
                <EcoItem label="Stadium security" href="/fuel-bots" />
                <EcoItem label="Data center operations" href="/data-centers" />
                <EcoItem label="Energy sector automation" />
              </ul>
            </div>

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
              { icon: TrendingUp, value: "$26.6B", label: "Sports Technology", desc: "Global sports tech market growing at 17.5% CAGR. NIL market projected to reach $1.17B by 2026.", href: "/nil-portal" },
              { icon: Activity, value: "$180M", label: "AI Companions", desc: "Annual addressable market for AI companions in sports, data centers, and energy sectors.", href: "/fuel-bots" },
              { icon: Database, value: "$500B+", label: "Data Center Infrastructure", desc: "Global data center market with AI driving unprecedented demand for compute infrastructure.", href: "/data-centers" },
            ].map(({ icon: Icon, value, label, desc, href }) => (
              <Link key={label} href={href}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-[#1E90FF]/40 transition-colors">
                  <div className="w-10 h-10 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#1E90FF]" />
                  </div>
                  <div className="text-4xl font-black text-[#00C2FF] mb-1">{value}</div>
                  <div className="text-white font-bold mb-2">{label}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </Link>
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
                href: "/tiers",
                items: ["Pro: $9.99/mo — 50 AI credits", "Elite: $29.99/mo — 200 AI credits", "Enterprise: Custom pricing"],
              },
              {
                icon: Database,
                title: "Hardware Sales",
                sub: "Enterprise infrastructure",
                href: "/icc-usa",
                items: ["Supermicro servers: $15K–$40K", "Data center packages: $100K–$2.5M+", "Infrastructure Review — NVIDIA Elite Partner"],
              },
              {
                icon: Cpu,
                title: "Fuel Bots Leasing",
                sub: "AI companion contracts",
                href: "/fuel-bots",
                items: ["University contracts: $50K–$500K", "Pro team packages: Custom", "Data subscriptions for coaches"],
              },
              {
                icon: Globe,
                title: "White-Label Licensing",
                sub: "Platform licensing",
                href: "/partner-portal",
                items: ["Sport-specific apps: $5K–$50K", "Enterprise AI suite: $10K+", "API access fees"],
              },
            ].map(({ icon: Icon, title, sub, href, items }) => (
              <Link key={title} href={href}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer hover:border-[#1E90FF]/40 transition-colors">
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
              </Link>
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
            <Link href="/icc-usa">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-[#00C2FF]/40 transition-colors">
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
            </Link>
            <Link href="/dhg">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-[#1E90FF]/40 transition-colors">
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
            </Link>
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
                items: [
                  { text: "Full public launch — athlynx.ai", href: "/" },
                  { text: "MCWS live bracket + Diamond Grind beta", href: "/mcws-bracket" },
                  { text: "10,000 founding members target", href: "/early-access" },
                  { text: "5–10 Fuel Bots per partner university", href: "/fuel-bots" },
                ],
              },
              {
                phase: "2", color: "bg-[#00C2FF]", period: "Q3–Q4 2026",
                title: "Scale & Expand",
                items: [
                  { text: "Roll out 44+ sport platforms", href: "/rankings-hub" },
                  { text: "1,000+ athlete metrics tracked", href: "/data-dashboard" },
                  { text: "Data center partnerships active", href: "/data-centers" },
                  { text: "Enterprise hardware sales pipeline", href: "/icc-usa" },
                ],
              },
              {
                phase: "3", color: "bg-white", period: "2027",
                title: "Market Leadership",
                items: [
                  { text: "50–100 university partnerships", href: "/partner-portal" },
                  { text: "Pro team contracts", href: "/partner-portal" },
                  { text: "International expansion", href: "/dhg" },
                  { text: "IPO preparation", href: "/investor-hub" },
                ],
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
                    {items.map(({ text, href }) => (
                      <li key={text} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-3.5 h-3.5 text-[#1E90FF] mt-0.5 shrink-0" />
                        {href ? (
                          <Link href={href} className="text-gray-400 hover:text-[#00C2FF] hover:underline transition-colors">
                            {text}
                          </Link>
                        ) : (
                          <span className="text-gray-400">{text}</span>
                        )}
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
            <Link href="/the-company">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1E90FF]/40 transition-colors">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1E90FF] to-[#0a1628] border-2 border-[#1E90FF]/40 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#1E90FF]" />
                </div>
                <div className="text-xl font-black text-white mb-1">Chad A. Dozier Sr.</div>
                <div className="text-[#00C2FF] text-sm font-semibold mb-4">Chief Executive Officer &amp; Founder</div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Visionary entrepreneur who built the entire DHG ecosystem from the ground up. Deep expertise in sports technology, AI integration, and enterprise partnerships. 1 man. 1 AI. $1B vision.
                </p>
              </div>
            </Link>
            <Link href="/dhg">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1E90FF]/40 transition-colors">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1E90FF] to-[#0a1628] border-2 border-[#1E90FF]/40 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-[#1E90FF]" />
                </div>
                <div className="text-xl font-black text-white mb-1">Glenn Tse</div>
                <div className="text-[#1E90FF] text-sm font-semibold mb-4">CFO &amp; VP Business Development</div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Strategic financial partner with extensive experience in US-Asia business operations. Based in Hong Kong with connections across China and the United States.
                </p>
              </div>
            </Link>
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
              { icon: Cpu, name: "Nebius H200", desc: "Primary compute rail", href: "/nebius" },
              { icon: Zap, name: "Google Gemini 2.5", desc: "Multimodal AI", href: "/google-workspace" },
              { icon: Activity, name: "OpenAI GPT-4o", desc: "Language intelligence", href: "/athlynx-engine" },
              { icon: Shield, name: "Anthropic Claude", desc: "Safety-first reasoning", href: "/athlynx-engine" },
              { icon: Target, name: "Perplexity Sonar", desc: "Real-time research", href: "/athlynx-engine" },
              { icon: Network, name: "Grok xAI", desc: "Live data analysis", href: "/athlynx-engine" },
            ].map(({ icon: Icon, name, desc, href }) => (
              <Link key={name} href={href}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-[#1E90FF]/40 transition-colors">
                  <div className="w-10 h-10 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#1E90FF]" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{name}</div>
                    <div className="text-gray-400 text-xs">{desc}</div>
                  </div>
                </div>
              </Link>
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
