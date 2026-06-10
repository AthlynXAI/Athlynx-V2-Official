import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Button } from "@/components/ui/button";

/**
 * ATHLYNX AI PLATFORM
 * A DOZIER HOLDINGS GROUP COMPANY
 * 
 * "Logic will take you from A to B. Imagination will take you everywhere." - Einstein
 */

function ManusPartnershipInner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-2">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">ATHLYNX AI</h1>
                <p className="text-cyan-400 text-xs">UNIFIED PARTNERSHIP</p>
              </div>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 via-cyan-500/20 to-blue-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 shadow-2xl shadow-blue-600/30">
              <span className="text-6xl">🤖</span>
              <p className="text-white font-bold mt-2">ATHLYNX AI</p>
            </div>
            <div className="text-5xl text-cyan-400 animate-pulse">×</div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 shadow-2xl shadow-cyan-500/30">
              <span className="text-6xl">🦁</span>
              <p className="text-white font-bold mt-2">ATHLYNX</p>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              UNIFIED
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
            Two powerhouses. One mission. <span className="text-cyan-400 font-semibold">Expert-grade AI</span> meets 
            <span className="text-blue-500 font-semibold"> athlete empowerment</span>.
          </p>
          
          <p className="text-lg text-cyan-400 italic">
            "Logic will take you from A to B. Imagination will take you everywhere." — Albert Einstein
          </p>
        </div>
      </section>

      {/* What Manus Does Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            What <span className="text-blue-500">Manus</span> Does for <span className="text-cyan-400">ATHLYNX</span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Manus is our trusted AI partner, powering the intelligence behind every feature
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "NIL Valuation Engine",
                description: "AI-powered market analysis that calculates an athlete's true NIL value based on social reach, performance, and market trends.",
                credits: "50 credits"
              },
              {
                icon: "📝",
                title: "Contract Analysis",
                description: "Intelligent contract review that identifies red flags, suggests improvements, and ensures fair deals for athletes.",
                credits: "30 credits"
              },
              {
                icon: "🎬",
                title: "Highlight Review",
                description: "AI feedback on highlight videos with suggestions for improvement and what scouts are looking for.",
                credits: "15 credits"
              },
              {
                icon: "🤝",
                title: "Brand Matching",
                description: "Smart algorithm that connects athletes with brands that align with their values and audience.",
                credits: "10 credits"
              },
              {
                icon: "💬",
                title: "AI Coach",
                description: "24/7 AI assistant for career advice, negotiation tips, and personal branding strategies.",
                credits: "1 credit/message"
              },
              {
                icon: "📊",
                title: "Performance Analytics",
                description: "Deep analysis of stats, trends, and comparisons to help athletes understand their market position.",
                credits: "20 credits"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50 hover:border-blue-600/50 transition-all hover:shadow-lg hover:shadow-blue-600/10"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                <div className="inline-block bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                  Powered by Manus • {feature.credits}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DHG Empire Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Powering the <span className="text-red-400">DHG Empire</span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Manus AI infrastructure supports all Dozier Holdings Group companies
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Technology Division */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-cyan-500/30">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                <span className="text-3xl">💻</span> Technology Division
              </h3>
              <ul className="space-y-4">
                {[
                  { name: "VC Technologies", desc: "R&D, cryptocurrency platform, data center design" },
                  { name: "VC Data Centers", desc: "AI-optimized cloud services" },
                  { name: "The VIRT", desc: "AI-powered cryptocurrency trading" },
                  { name: "VC Energy", desc: "Smart grid optimization for data centers" },
                ].map((company, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">▸</span>
                    <div>
                      <span className="text-white font-semibold">{company.name}</span>
                      <p className="text-slate-400 text-sm">{company.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real Estate Division */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30">
              <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                <span className="text-3xl">🏠</span> Real Estate Division
              </h3>
              <ul className="space-y-4">
                {[
                  { name: "Villa Agape", desc: "IoT health monitoring for cancer recovery" },
                  { name: "Compassionate Care", desc: "AI-assisted clinic operations" },
                  { name: "Pisces Resort", desc: "Smart resort management" },
                  { name: "Venus Venue & Vineyard", desc: "AI event planning & wine production" },
                ].map((company, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">▸</span>
                    <div>
                      <span className="text-white font-semibold">{company.name}</span>
                      <p className="text-slate-400 text-sm">{company.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Credit System Section */}
      <section className="py-20 bg-gradient-to-r from-blue-950/30 via-slate-900 to-cyan-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="text-blue-500">AI Credits</span> System
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Powered by Manus • Use credits for AI features across the platform
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Starter", credits: 50, price: "$4.99", perCredit: "$0.10" },
              { name: "Value", credits: 150, price: "$12.99", perCredit: "$0.087", popular: true },
              { name: "Pro", credits: 500, price: "$39.99", perCredit: "$0.08" },
              { name: "Elite", credits: 1500, price: "$99.99", perCredit: "$0.067" },
            ].map((pack, i) => (
              <div 
                key={i}
                className={`relative rounded-2xl p-6 border ${
                  pack.popular 
                    ? "bg-gradient-to-br from-blue-700/30 to-cyan-600/30 border-blue-600" 
                    : "bg-slate-800/50 border-slate-700"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
                <div className="text-4xl font-black text-cyan-400 mb-1">{pack.credits}</div>
                <div className="text-slate-400 text-sm mb-4">credits</div>
                <div className="text-2xl font-bold text-white mb-1">{pack.price}</div>
                <div className="text-slate-500 text-xs">{pack.perCredit}/credit</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Ready Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            📱 Share the <span className="text-cyan-400">Partnership</span>
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Copy and share on your social media
          </p>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
            <div className="prose prose-invert max-w-none">
              <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
                <p className="text-white text-lg leading-relaxed mb-4">
                  🚀 <strong>BIG ANNOUNCEMENT!</strong> 🚀
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  @ATHLYNX is proud to partner with @Manus_AI as our trusted AI technology partner! 🤖🦁
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Together, we're building the future of athlete success with:
                </p>
                <ul className="text-slate-300 space-y-2 mb-4">
                  <li>🎯 AI-powered NIL valuations</li>
                  <li>📝 Smart contract analysis</li>
                  <li>🤝 Intelligent brand matching</li>
                  <li>💬 24/7 AI coaching</li>
                  <li>📊 Advanced performance analytics</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mb-4">
                  "Logic will take you from A to B. Imagination will take you everywhere." — Einstein
                </p>
                <p className="text-cyan-400 font-semibold">
                  #ATHLYNX #ManusAI #NIL #AthleteSuccess #DHG #DozierHoldingsGroup #DreamsComeTrue
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  className="bg-[#1DA1F2] hover:bg-[#1a8cd8]"
                  onClick={() => {
                    const text = encodeURIComponent("🚀 BIG ANNOUNCEMENT! @ATHLYNX partners with @Manus_AI as our trusted AI technology partner! Together building the future of athlete success. #ATHLYNX #ManusAI #NIL #DreamsComeTrue");
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                  }}
                >
                  Share on X/Twitter
                </Button>
                <Button 
                  className="bg-[#0A66C2] hover:bg-[#094d92]"
                  onClick={() => {
                    window.open('https://www.linkedin.com/sharing/share-offsite/', '_blank');
                  }}
                >
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-3xl">🤖</span>
            <span className="text-2xl text-slate-600">×</span>
            <span className="text-3xl">🦁</span>
          </div>
          <p className="text-slate-400 mb-2">
            <span className="text-blue-500 font-semibold">Manus</span> × <span className="text-cyan-400 font-semibold">ATHLYNX</span> Unified
          </p>
          <p className="text-slate-500 text-sm mb-4">
            A Dozier Holdings Group Company
          </p>
          <p className="text-slate-600 text-xs">
            © 2026 Dozier Holdings Group, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    <MobileBottomNav />
    </div>
  );
}
export default function ManusPartnership() {
  return <RouteErrorBoundary><ManusPartnershipInner /></RouteErrorBoundary>;
}
