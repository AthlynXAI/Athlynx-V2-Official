import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: string;
}

function ComingSoonInner({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040c1a] via-[#0a1628] to-[#040c1a] text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Real AthlynX Logo */}
        <div className="flex justify-center">
          <img src="/athlynx-icon.png" alt="AthlynXAI" className="w-20 h-20 rounded-2xl shadow-2xl shadow-cyan-900/50" />
        </div>
        {/* Sport Icon */}
        <div className="text-7xl">{icon}</div>
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white">{title}</h1>
        {/* Description */}
        <p className="text-lg text-blue-300 leading-relaxed">{description}</p>
        {/* Status Badge */}
        <div className="inline-flex items-center gap-3 bg-blue-900/60 border border-blue-700/50 px-6 py-3 rounded-full">
          <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></span>
          <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Launching July 1, 2026</span>
        </div>
        {/* Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { icon: "🎯", label: "Recruiting Hub", desc: "Connect with coaches nationwide" },
            { icon: "💰", label: "NIL Deals", desc: "Get paid for your brand" },
            { icon: "🤖", label: "AI Coach", desc: "24/7 personal AI trainer" },
          ].map((item, i) => (
            <div key={i} className="bg-blue-900/40 border border-blue-800/50 rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white font-bold text-sm">{item.label}</div>
              <div className="text-blue-400 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/signup">
            <a className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black px-8 py-4 rounded-xl text-base shadow-xl transition-all hover:scale-105">
              Join Free — 7 Day Trial
            </a>
          </Link>
          <Link href="/portal">
            <a className="bg-[#1a3a8f] hover:bg-[#1530a0] text-white font-bold px-8 py-4 rounded-xl text-base border border-blue-700/50 transition-all">
              Explore Platform
            </a>
          </Link>
        </div>
        <p className="text-blue-600 text-xs">AthlynXAI · athlynx.ai · Houston, TX · Iron Sharpens Iron — Proverbs 27:17</p>
      </div>
    </div>
  );
}
export default function ComingSoon({ title = "Coming Soon", description = "This feature is launching soon. Stay tuned!", icon = "🚀" }: Partial<ComingSoonProps>) {
  return <RouteErrorBoundary><ComingSoonInner title={title} description={description} icon={icon} /></RouteErrorBoundary>;
}
