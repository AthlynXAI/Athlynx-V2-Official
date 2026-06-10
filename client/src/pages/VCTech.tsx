import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from 'wouter';
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Code2, Cpu, Globe, Shield, Zap, ChevronRight, ArrowLeft, Building2, Layers, Database, Cloud } from 'lucide-react';

function VCTechInner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/images/logos/athlynx-main-logo.png" alt="AthlynX" className="w-10 h-10 rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              <div>
                <div className="text-white font-black text-lg tracking-widest">AthlynX</div>
                <div className="text-blue-400 text-xs tracking-wider">THE ATHLETE'S PLAYBOOK</div>
              </div>
            </div>
          </Link>
          <Link href="/dhg-home">
            <button className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> DHG Empire
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 rounded-full px-4 py-2 text-blue-300 text-sm mb-6">
            <Building2 className="w-4 h-4" /> A DOZIER HOLDINGS GROUP COMPANY
          </div>
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">VC TECHNOLOGIES</span>
          </h1>
          <p className="text-xl text-blue-200 mb-2 font-bold">Enterprise Software & AI Solutions</p>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            The technology backbone of the Dozier Holdings Group empire. Building enterprise-grade software, AI systems, and digital infrastructure that powers every platform in the ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/infrastructure">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all">
                View Infrastructure <ChevronRight className="inline w-4 h-4" />
              </button>
            </Link>
            <Link href="/dhg">
              <button className="border border-blue-500 text-blue-300 hover:bg-blue-900/40 font-bold px-8 py-3 rounded-xl transition-all">
                DHG Corporate
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 text-white">CORE CAPABILITIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'AI & Machine Learning', desc: 'Custom AI models, training pipelines, and intelligent automation systems built for enterprise scale.', link: '/ai-training-bot' },
              { icon: Cloud, title: 'Cloud Infrastructure', desc: 'Scalable cloud architecture, DevOps pipelines, and 99.99% uptime SLA for all DHG platforms.', link: '/infrastructure' },
              { icon: Database, title: 'Data Engineering', desc: 'Real-time data pipelines, analytics platforms, and business intelligence dashboards.', link: '/infrastructure-manager' },
              { icon: Shield, title: 'Cybersecurity', desc: 'HIPAA-compliant security architecture, penetration testing, and enterprise-grade data protection.', link: '/hipaa' },
              { icon: Layers, title: 'Platform Development', desc: 'Full-stack web and mobile application development powering 20+ platforms in the DHG ecosystem.', link: '/platform' },
              { icon: Globe, title: 'API & Integrations', desc: 'Third-party API integrations, microservices architecture, and seamless ecosystem connectivity.', link: '/capabilities' },
            ].map((service, i) => (
              <Link key={i} href={service.link}>
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group">
                  <service.icon className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-cyan-400 text-sm font-semibold">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Powered Platforms */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4 text-white">PLATFORMS WE POWER</h2>
          <p className="text-center text-gray-400 mb-12">Every platform in the DHG ecosystem runs on VC Technologies infrastructure</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'AthlynXAI', link: '/', status: 'LIVE' },
              { name: 'NIL Portal', link: '/nil-portal', status: 'LIVE' },
              { name: 'Transfer Portal', link: '/transfer-portal', status: 'LIVE' },
              { name: 'Gridiron Nexus', link: '/gridiron-nexus', status: 'LIVE' },
              { name: 'Court Kings', link: '/court-kings', status: 'LIVE' },
              { name: 'Diamond Grind', link: '/diamond-grind', status: 'LIVE' },
              { name: 'FUEL Bots', link: '/fuel-bots', status: 'LIVE' },
              { name: 'AI Recruiter', link: '/ai-recruiter', status: 'LIVE' },
            ].map((p, i) => (
              <Link key={i} href={p.link}>
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center hover:border-cyan-500/50 transition-all cursor-pointer">
                  <div className="text-xs text-green-400 font-bold mb-1">{p.status}</div>
                  <div className="text-white font-bold text-sm">{p.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">PART OF THE DHG EMPIRE</h2>
          <p className="text-gray-400 mb-8">Founded by Chad A. Dozier and Glenn Tse in Houston, TX — November 2024</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dhg-home"><button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all">View All Companies</button></Link>
            <Link href="/contact"><button className="border border-slate-600 text-gray-300 hover:bg-slate-800 font-bold px-6 py-3 rounded-xl transition-all">Contact Us</button></Link>
          </div>
        </div>
      </section>
    <MobileBottomNav />
    </div>
  );
}
export default function VCTech() {
  return <RouteErrorBoundary><VCTechInner /></RouteErrorBoundary>;
}
