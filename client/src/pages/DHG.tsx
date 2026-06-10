import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { Link } from "wouter";

const CDN = "/";

const SUBSIDIARIES = [
  {
    name: "AthlynX",
    tagline: "The Crown — The Athlete's Playbook",
    desc: "The flagship platform. 10 AI-powered apps giving every athlete the tools of a professional. NIL deals, recruiting, training, strategy — all in one place.",
    status: "LIVE",
    icon: "/athlynx-icon.png",
    href: "/",
    isCrown: true,
  },
  {
    name: "Softmor",
    tagline: "The Engine — Hardware & Software",
    desc: "The technology backbone that powers the entire DHG empire. Softmor builds the infrastructure, AI systems, and software that runs every platform.",
    status: "LIVE",
    icon: "/logos/dhg-crab-logo.png",
    href: "/softmor",
    isEngine: true,
  },
  {
    name: "NIL Portals",
    tagline: "Name. Image. Likeness.",
    desc: "The dedicated NIL marketplace connecting athletes with brands for life-changing deals. Every athlete deserves to profit from their name.",
    status: "LIVE",
    icon: "/logos/nil-portal-logo.png",
    href: "https://nilportals.com",
  },
  {
    name: "Transfer Portal AI",
    tagline: "Find Your Next Chapter",
    desc: "AI-powered transfer portal helping athletes find the right school, the right program, and the right opportunity to elevate their career.",
    status: "LIVE",
    icon: "/images/logos/dhg-logo.png",
    href: "https://transferportal.ai",
  },
  {
    name: "Diamond Grind",
    tagline: "Elite Baseball Training",
    desc: "Performance analytics and training programs built for baseball athletes who refuse to settle. Grind harder. Play smarter.",
    status: "LIVE",
    icon: "/images/logos/dhg-logo.png",
    href: "/diamond-grind",
  },
  {
    name: "Warriors Playbook",
    tagline: "Strategy. Film. Victory.",
    desc: "The digital playbook for coaches and teams. Film room, play designer, and team strategy board — all in one platform.",
    status: "LIVE",
    icon: "/images/logos/dhg-logo.png",
    href: "/warriors-playbook",
  },
  {
    name: "aibotecosys",
    tagline: "AI Ecosystem",
    desc: "The AI automation ecosystem powering the next generation of athlete and business intelligence across the DHG portfolio.",
    status: "BUILDING",
    icon: "/images/logos/dhg-logo.png",
    href: "https://athlynx.ai",
  },
  {
    name: "AthlynX Robotics",
    tagline: "The Robot Companion — In Every Moment",
    desc: "AI-powered robot companions for athletes — in training, in the stands, on the field, in recovery, and everywhere in between. Robotics partnership currently in development.",
    status: "COMING",
    icon: "/athlynx-icon.png",
    href: "/robotics",
    isRobot: true,
  },
  {
    name: "DHG Media",
    tagline: "Stories Worth Telling",
    desc: "Sports content production and distribution. Athlete stories, brand content, and the media arm of the DHG empire.",
    status: "COMING",
    icon: "/logos/dhg-crab-logo.png",
    href: "#",
  },
];

function DHGInner() {
  return (
    <PlatformLayout>
      <div className="space-y-5 pb-20 lg:pb-6">

        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#0a1628] via-[#1a3a8f] to-[#0a1628] border border-blue-700 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #0066ff 0%, transparent 70%)" }} />
          <div className="relative p-6 text-center">
            <img
              src={"/logos/dhg-crab-logo.png"}
              alt="Dozier Holdings Group"
              className="w-24 h-24 rounded-3xl object-cover shadow-2xl mx-auto mb-4 border-2 border-blue-500"
            />
            <div className="text-blue-400 text-xs uppercase tracking-[0.3em] mb-1">The Iron Core</div>
            <h1 className="text-3xl font-black text-white mb-1">DOZIER HOLDINGS GROUP</h1>
            <div className="text-blue-300 text-sm font-semibold mb-4">Iron Sharpens Iron</div>
            <div className="w-16 h-0.5 bg-blue-600 mx-auto mb-4" />
            <p className="text-blue-200 text-sm leading-relaxed max-w-lg mx-auto">
              Founded in Houston, Texas — November 2024. Built by a group who refused to let adversity define them.
            </p>
          </div>
        </div>

        {/* The Origin Story */}
        <div className="bg-[#1a3a8f] border border-blue-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-900 border border-blue-700 flex items-center justify-center text-xs font-black text-blue-300 tracking-wider">DHG</div>
            <div>
              <h2 className="text-white font-black text-lg">Dozier Holdings Group</h2>
              <div className="text-blue-400 text-xs">Houston, TX · Est. November 2024</div>
            </div>
          </div>
          <div className="space-y-3 text-blue-200 text-sm leading-relaxed">
            <p>
              DHG is a private holding company. We own and operate a small group of brands across sports media, software, NIL, and military family programs.
            </p>
            <p>
              <strong className="text-white">AthlynX</strong> is the flagship — built for athletes from youth ball to the retirement chapter.
            </p>
            <p>
              <strong className="text-white">Softmor Inc.</strong> is the software arm. NIL Portals, Transfer Portal AI, Diamond Grind, and Warriors Playbook round out the portfolio.
            </p>
            <p>
              We're not trying to be the biggest. We're trying to build the stuff well, ship on time, and treat the people using it like we'd want to be treated.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Founded", value: "2024", sub: "Houston, TX" },
            { label: "Portfolio", value: "8+", sub: "Companies" },
            { label: "Athletes", value: "50K+", sub: "Served" },
            { label: "NIL Value", value: "$12M+", sub: "Deals Closed" },
          ].map((s, i) => (
            <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-blue-400">{s.value}</div>
              <div className="text-white text-xs font-bold mt-0.5">{s.label}</div>
              <div className="text-blue-500 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Leadership */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-2xl p-5">
          <h3 className="text-white font-black text-lg mb-4">Leadership</h3>
          <div className="space-y-3">
            {[
              { name: "Chad A. Dozier", title: "Founder · CEO · Chairman", desc: "Founder, athlete advocate, and the driving vision behind DHG. Built the company in Houston in November 2024 — the long way, the honest way.", avatar: "/team/chad-dozier.jpg" },
              { name: "Glenn Tse", title: "Co-Founder · CFO & COO", desc: "Co-founder and financial architect. Glenn brings the engineering discipline and operational rigor that turns the vision into shipping software.", avatar: "/team/glenn-tse.jpg" },
            ].map((person, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#1530a0] rounded-xl p-4">
                <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full border-2 border-blue-400 shrink-0 object-cover" />
                <div>
                  <div className="font-black text-white">{person.name}</div>
                  <div className="text-blue-400 text-xs font-semibold mb-1">{person.title}</div>
                  <div className="text-blue-300 text-xs leading-relaxed">{person.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Engine — Softmor */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#1a3a8f] border border-blue-600 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white"><img src="/logos/dhg-crab-logo.png" alt="Softmor Inc" className="w-full h-full object-contain p-0.5" /></div>
            <div>
              <h3 className="text-white font-black">Softmor — The Engine</h3>
              <div className="text-blue-400 text-xs">Hardware & Software Infrastructure</div>
            </div>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            Softmor is the hardware and software backbone that runs the entire DHG engine. Every platform, every AI tool, every data pipeline — Softmor builds and powers it. Without the engine, the empire doesn't move.
          </p>
        </div>

        {/* ConCreator™ — Softmor's Enterprise AI Product */}
        <div className="bg-gradient-to-br from-[#0a1628] via-[#0d2040] to-[#0a1628] border border-cyan-600/50 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <img src="/images/logos/athlynx-main-logo.png" alt="ConCreator" className="w-12 h-12 rounded-xl border border-cyan-500/30" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black">ConCreator™</h3>
                <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
              <div className="text-cyan-400 text-xs">Data Intelligence &amp; AI Credit System · by Softmor Inc.</div>
            </div>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed mb-4">
            ConCreator™ is Softmor's enterprise-grade AI data intelligence platform — delivering machine analytics, anomaly detection, predictive trend analysis, and automated reporting. Four tiers from $297 to $1,997/month per machine.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { tier: 'Pulse', price: '$297/mo', credits: '500 credits' },
              { tier: 'Insight', price: '$597/mo', credits: '2,000 credits' },
              { tier: 'Command', price: '$997/mo', credits: '5,000 credits', rec: true },
              { tier: 'Enterprise', price: '$1,997/mo', credits: 'Unlimited' },
            ].map((t, i) => (
              <div key={i} className={`rounded-lg p-3 text-center border ${t.rec ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-white/10 bg-white/5'}`}>
                <div className="text-white text-xs font-black">{t.tier}</div>
                <div className="text-cyan-400 text-xs font-bold">{t.price}</div>
                <div className="text-gray-500 text-xs">{t.credits}</div>
                {t.rec && <div className="text-emerald-400 text-xs font-bold mt-1">RECOMMENDED</div>}
              </div>
            ))}
          </div>
          <a href="/softmor" className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm font-semibold hover:bg-cyan-600/30 transition">
            View Full ConCreator™ Details →
          </a>
        </div>

        {/* Portfolio — The Legs */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-white font-black text-lg">DHG Portfolio</h3>
          </div>
          <div className="space-y-3">
            {SUBSIDIARIES.map((co, i) => (
              <a
                key={i}
                href={co.href}
                target={co.href.startsWith("http") ? "_blank" : undefined}
                rel={co.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`flex items-center gap-4 rounded-xl p-4 transition-all hover:scale-[1.01] cursor-pointer block ${
                  co.isCrown
                    ? "bg-gradient-to-r from-[#0066ff]/20 to-[#1530a0] border border-blue-500"
                    : co.isEngine
                    ? "bg-gradient-to-r from-[#1530a0] to-[#0a1628] border border-blue-700"
                    : "bg-[#1530a0] border border-blue-900"
                }`}
              >
                <img src={co.icon} alt={co.name} className="w-12 h-12 rounded-xl object-cover shadow-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white">{co.name}</span>
                    {co.isCrown && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">👑 CROWN</span>}
                    {co.isEngine && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">⚙️ ENGINE</span>}
                    {(co as any).isRobot && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">🤖 ROBOT</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      co.status === "LIVE" ? "bg-green-900 text-green-400" :
                      co.status === "BUILDING" ? "bg-blue-900 text-blue-400" :
                      "bg-gray-800 text-gray-400"
                    }`}>{co.status}</span>
                  </div>
                  <div className="text-blue-400 text-xs font-semibold">{co.tagline}</div>
                  <div className="text-blue-300 text-xs mt-0.5 leading-relaxed line-clamp-2">{co.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-[#0a1628] to-[#1a3a8f] border border-blue-700 rounded-2xl p-5 text-center">
          <h3 className="text-white font-black text-xl mb-2">Small portfolio. Built on purpose.</h3>
          <p className="text-blue-200 text-sm leading-relaxed max-w-md mx-auto mb-4">
            Each company is its own thing, run by people who actually use it. They don't compete with each other — they share what they learn.
          </p>
          <div className="text-blue-400 text-xs uppercase tracking-widest">Dozier Holdings Group • Houston, TX • Est. 2024</div>
        </div>

        {/* Videos */}
        <div className="space-y-4">
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-2xl overflow-hidden">
            <video className="w-full" controls muted loop playsInline>
              <source src={"https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/mQeioRPSvzxsvCcY.mov"} type="video/mp4" />
            </video>
            <div className="p-3 text-center text-blue-300 text-sm font-semibold">DHG Corporate Overview</div>
          </div>
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-2xl overflow-hidden">
            <video className="w-full" controls muted loop playsInline>
              <source src="https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/xnXNQvBUfirjVkId.mp4" type="video/mp4" />
            </video>
            <div className="p-3 text-center text-blue-300 text-sm font-semibold">DHG AI Compute & Data Centers</div>
          </div>
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-2xl overflow-hidden">
            <video className="w-full" controls muted loop playsInline>
              <source src="https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/mQeioRPSvzxsvCcY.mov" type="video/mp4" />
            </video>
            <div className="p-3 text-center text-blue-300 text-sm font-semibold">DHG Urban Innovation & City Hubs</div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-2xl p-5">
          <h3 className="text-white font-black mb-3">Contact DHG</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 text-blue-200">
              <span className="text-blue-500">📍</span>
              <span>HQ: 12306 Lake Portal Drive, Houston, TX 77047 | SE: 831 West 28th Street, Laurel, MS 39440</span>
            </div>
            <div className="flex items-center gap-3 text-blue-200">
              <span className="text-blue-500">✉️</span>
              <a href="mailto:contact@athlynx.ai" className="hover:text-white transition-colors">contact@athlynx.ai</a>
            </div>
            <div className="flex items-center gap-3 text-blue-200">
              <span className="text-blue-500">🌐</span>
              <a href="/dhg" className="hover:text-white transition-colors">DHG Corporate Site</a>
            </div>
          </div>
        </div>

      </div>
    </PlatformLayout>
  );
}
export default function DHG() {
  return <RouteErrorBoundary><DHGInner /></RouteErrorBoundary>;
}
