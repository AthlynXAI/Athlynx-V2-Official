import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from 'wouter';
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Server, Zap, Globe, Shield, TrendingUp, ChevronRight, ArrowLeft, Building2, Cpu, Wifi } from 'lucide-react';

function DataCentersInner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><div className="flex items-center gap-3 cursor-pointer">
            <img src="/images/logos/athlynx-main-logo.png" alt="AthlynX" className="w-10 h-10 rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            <div><div className="text-white font-black text-lg tracking-widest">AthlynX</div><div className="text-blue-400 text-xs tracking-wider">THE ATHLETE'S PLAYBOOK</div></div>
          </div></Link>
          <Link href="/dhg-home"><button className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors text-sm"><ArrowLeft className="w-4 h-4" /> DHG Empire</button></Link>
        </div>
      </header>
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 rounded-full px-4 py-2 text-blue-300 text-sm mb-6"><Building2 className="w-4 h-4" /> A DOZIER HOLDINGS GROUP COMPANY</div>
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"><Server className="w-10 h-10 text-white" /></div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight"><span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">VC DATA CENTERS</span></h1>
          <p className="text-xl text-blue-200 mb-2 font-bold">Next-Generation Infrastructure</p>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">Enterprise-grade data center operations powering the entire DHG ecosystem with 99.99% uptime, geothermal energy initiatives, and AI-optimized compute infrastructure.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/infrastructure"><button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all">View Infrastructure <ChevronRight className="inline w-4 h-4" /></button></Link>
            <Link href="/dhg"><button className="border border-blue-500 text-blue-300 hover:bg-blue-900/40 font-bold px-8 py-3 rounded-xl transition-all">DHG Corporate</button></Link>
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 text-white">INFRASTRUCTURE CAPABILITIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Server, title: 'Tier IV Data Centers', desc: 'Fault-tolerant facilities with redundant power, cooling, and network connectivity for zero-downtime operations.', link: '/infrastructure' },
              { icon: Cpu, title: 'AI Compute Clusters', desc: 'High-performance GPU clusters for AI model training, inference, and real-time data processing at scale.', link: '/infrastructure-manager' },
              { icon: Zap, title: 'Geothermal Power', desc: 'Sustainable energy initiatives leveraging geothermal and advanced drilling technologies for clean compute power.', link: '/infrastructure' },
              { icon: Globe, title: 'Global CDN', desc: 'Content delivery network spanning multiple regions ensuring sub-50ms response times for all DHG platforms.', link: '/infrastructure' },
              { icon: Shield, title: 'Security Operations', desc: 'SOC 2 Type II certified, 24/7 monitoring, DDoS protection, and enterprise-grade cybersecurity protocols.', link: '/hipaa' },
              { icon: Wifi, title: 'Network Operations', desc: 'Multi-carrier redundant connectivity with BGP routing and automatic failover for maximum reliability.', link: '/infrastructure-manager' },
            ].map((s, i) => (
              <Link key={i} href={s.link}><div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group">
                <s.icon className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-green-400 text-sm font-semibold">Learn More <ChevronRight className="w-4 h-4" /></div>
              </div></Link>
            ))}
          </div>
        </div>
      </section>
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
export default function DataCenters() {
  return <RouteErrorBoundary><DataCentersInner /></RouteErrorBoundary>;
}
