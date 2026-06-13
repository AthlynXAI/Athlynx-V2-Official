import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";

const appFeatures = [
  { icon: "", title: "FUEL Bot AI", desc: "Your personal AI coach in your pocket. Training plans, recruiting advice, NIL guidance — 24/7." },
  { icon: "", title: "Social Feed", desc: "Stay connected with athletes worldwide. Share highlights, training clips, and recruiting updates." },
  { icon: "", title: "Live Tournaments", desc: "Real-time tournament brackets, scores, and standings. Never miss a moment of the action." },
  { icon: "", title: "NIL Deals", desc: "Browse, apply, and manage NIL deals directly from your phone. Your brand, your business." },
  { icon: "", title: "Film Review", desc: "Upload, tag, and share game film instantly. Get AI-powered breakdowns on the go." },
  { icon: "", title: "Smart Alerts", desc: "Recruiting windows, coach views, deal deadlines — get notified before it's too late." },
];

const screenshots = [
  { label: "Dashboard", src: "/brand/uploads-permanent/landing-screen-01.PNG" },
  { label: "NIL Portal", src: "/brand/uploads-permanent/landing-screen-03.PNG" },
  { label: "FUEL Bot", src: "/brand/uploads-permanent/landing-screen-05.PNG" },
  { label: "Tournaments", src: "/brand/uploads-permanent/landing-screen-09.PNG" },
];

const xFactorSportApps = [
  "Baseball", "Football", "Basketball", "Tennis", "Soccer", "Track and Field",
  "Softball", "Volleyball", "Wrestling", "Golf", "Lacrosse", "Hockey",
  "Swimming", "Cross Country", "Gymnastics", "Cheer", "Dance", "Rugby",
  "Boxing", "MMA", "Esports", "Cricket", "Field Hockey", "Rowing",
  "Cycling", "Skiing", "Snowboarding", "Skateboarding", "Surfing", "Pickleball",
  "Bowling", "Archery", "Equestrian", "Fencing", "Water Polo", "Triathlon",
  "Powerlifting", "Weightlifting", "Marathon", "Youth Sports", "College Sports", "Pro Sports",
  "Recruiting", "NIL", "Transfer Portal", "Film Room", "Training", "Nutrition",
  "Recovery", "Mental Performance", "Academics", "Calendar", "Messaging", "CRM",
];

function MobileAppInner() {
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [notified, setNotified] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setNotified(true);
  };

  return (
    <div className="min-h-screen bg-[#060d1a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#060d1a]/95 backdrop-blur border-b border-blue-900/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← AthlynX</Link>
            <span className="text-gray-600">|</span>
            <span className="text-white font-bold">Mobile App</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#notify"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#060d1a] to-blue-950 opacity-60" />
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-[#00C2FF]/40 border border-[#00C2FF]/50 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#00C2FF] rounded-full animate-pulse" />
              <span className="text-[#00C2FF] text-xs font-bold tracking-widest">NATIVE APPS IN TESTING</span>
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">iOS TestFlight · Google Play</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-none">
              AthlynX<br />
              <span className="text-blue-400">IN YOUR</span><br />
              <span className="text-[#00C2FF]">POCKET</span>
            </h1>
            <p className="text-gray-300 text-xl mb-8">
              The full power of AthlynX — FUEL Bot AI, NIL deals, recruiting tools, tournaments — all in one mobile app.
            </p>

            <div className="flex gap-4 mb-8 flex-wrap">
              <button
                onClick={() => setPlatform("ios")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                  platform === "ios"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="text-2xl"></span>
                <div className="text-left">
                  <div className="text-xs opacity-70">Testing on</div>
                  <div className="font-black">App Store</div>
                  <div className="text-[10px] text-[#00C2FF] font-bold">TESTFLIGHT LIVE</div>
                </div>
              </button>
              <button
                onClick={() => setPlatform("android")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                  platform === "android"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="text-2xl"></span>
                <div className="text-left">
                  <div className="text-xs opacity-70">Review on</div>
                  <div className="font-black">Google Play</div>
                  <div className="text-[10px] text-[#00C2FF] font-bold">CLOSED TESTING</div>
                </div>
              </button>
            </div>

            <div className="bg-[#00C2FF]/30 border border-[#00C2FF]/40 rounded-xl p-4">
              <p className="text-[#00C2FF] text-sm">
                <span className="font-bold"> AthlynX native apps are in store testing now.</span> iOS is on TestFlight and Google Play closed testing has been sent for review. The public download pages use the black and white A/X app icon.
              </p>
            </div>
          </div>

          {/* Approved mobile app-store promo artwork */}
          <div className="flex justify-center">
            <img
              src="/brand/athlynxai-epx-app-mark.png"
              alt="AthlynXAI EPX all-in-one app mark"
              className="w-72 max-w-full rounded-[2rem] border border-[#1E90FF]/30 bg-black/40 object-contain shadow-2xl shadow-cyan-500/20"
            />
          </div>
        </div>
      </section>

      {/* EPX App Standard */}
      <section className="py-16 px-4 border-y border-[#1E90FF]/30 bg-gradient-to-b from-black via-[#061226] to-black">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-[#1E90FF]/30 bg-black shadow-2xl shadow-cyan-500/20">
            <img
              src="/brand/athlynxai-epx-app-card.png"
              alt="AthlynXAI EPX app icon and brand card"
              className="h-[520px] w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#00C2FF]">AthlynXAI EPX</p>
              <h2 className="mt-2 text-3xl font-black text-white">One app standard. Every sport.</h2>
            </div>
          </div>

          <div>
            <div className="mb-5 inline-flex rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#00C2FF]">
              App Store · Google Play · Web
            </div>
            <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
              The EPX mark becomes the master app template.
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-300">
              AthlynXAI uses this mark as the mobile icon direction for the all-in-one athlete app, Diamond Grind baseball, and every future sport service. Each sport receives its own proof profile, film room, scorecard, calendar, training plan, messaging path, and recruiting or NIL lane while staying inside one connected account.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Diamond Grind baseball template",
                "Sport-specific scorecards",
                "Coach and parent dashboards",
                "App store-ready brand system",
                "Facebook and LinkedIn funnels",
                "Reusable 50+ app service map",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-bold text-[#00C2FF]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#00C2FF]">50+ sport and service apps</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {xFactorSportApps.map((sport) => (
              <span key={sport} className="rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-3 py-1.5 text-xs font-bold text-[#00C2FF]">
                {sport}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">Everything You Need, On the Go</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {appFeatures.map((f) => (
              <div key={f.title} className="bg-white/5 border border-blue-900/20 rounded-xl p-5 hover:border-blue-600/40 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 border-y border-blue-900/20 bg-black/20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "PWA Live", label: "Available Now", icon: "" },
            { value: "<2s", label: "Load Time", icon: "" },
            { value: "iOS & Android", label: "PWA Platforms", icon: "" },
            { value: "Free", label: "Install", icon: "" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-blue-400">{s.value}</div>
              <div className="text-gray-400 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Early Access Form */}
      <section id="notify" className="py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-4 hidden"></div>
          <h2 className="text-3xl font-black text-white mb-3">Get Early Access</h2>
          <p className="text-gray-300 mb-8">
            Be among the first to experience AthlynX on mobile. Early access members get exclusive perks and lifetime discounts.
          </p>
          {notified ? (
            <div className="bg-[#00C2FF]/30 border border-[#00C2FF]/40 rounded-2xl p-8">
              <div className="text-5xl mb-3"></div>
              <h3 className="text-white font-black text-xl mb-2">You're on the list!</h3>
              <p className="text-gray-300 text-sm">We'll notify you the moment the app drops. Get ready to level up.</p>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-blue-900/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          )}
          <p className="text-gray-600 text-xs mt-4">No spam. Unsubscribe anytime. We respect your privacy.</p>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-blue-950/10 border-t border-blue-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-8">Web vs Mobile</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-gray-400 text-sm font-bold pb-3 pr-4">Feature</th>
                  <th className="text-center text-blue-400 text-sm font-bold pb-3 px-4">Web App</th>
                  <th className="text-center text-[#00C2FF] text-sm font-bold pb-3 px-4">Mobile App</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  { feature: "FUEL Bot AI", web: true, mobile: true },
                  { feature: "NIL Deals", web: true, mobile: true },
                  { feature: "Recruiting Tools", web: true, mobile: true },
                  { feature: "Push Notifications", web: false, mobile: true },
                  { feature: "Offline Film Review", web: false, mobile: true },
                  { feature: "Camera Integration", web: false, mobile: true },
                  { feature: "Location-Based Spots", web: false, mobile: true },
                  { feature: "Live Tournament Updates", web: true, mobile: true },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-blue-900/20">
                    <td className="text-gray-300 text-sm py-3 pr-4">{row.feature}</td>
                    <td className="text-center py-3 px-4">
                      {row.web ? <span className="text-[#00C2FF]"></span> : <span className="text-gray-700">—</span>}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.mobile ? <span className="text-[#00C2FF]"></span> : <span className="text-gray-700">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 
           FUTURISTIC APP SCREENSHOT GALLERY — REAL SCREENS
       */}
      <section className="py-20 px-4 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#00c2ff]/10 border border-[#00c2ff]/30 rounded-full px-5 py-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00c2ff] animate-pulse" />
              <span className="text-[#00c2ff] text-xs font-black tracking-widest uppercase">Live Platform Preview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-none mb-3">
              BUILT FOR THE
              <span className="block" style={{ background: "linear-gradient(90deg, #00c2ff, #0066ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                NEXT GENERATION
              </span>
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">Every screen. Every feature. Engineered to make athletes impossible to ignore.</p>
          </div>

          {/* Promo hero banner */}
          <div className="relative rounded-3xl overflow-hidden mb-10 border border-[#00c2ff]/20" style={{ boxShadow: "0 0 60px rgba(0,194,255,0.15)" }}>
            <img src="/brand/athlynx-promo.png" alt="AthlynX Platform" className="w-full object-cover max-h-[500px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-black text-2xl md:text-3xl">THE PLATFORM THAT CHANGES EVERYTHING.</p>
              <p className="text-[#00c2ff] text-sm font-bold mt-1">athlynx.ai — Where Athletes Become Legends</p>
            </div>
          </div>

          {/* Investor/brand banner */}
          <div className="relative rounded-3xl overflow-hidden mb-10 border border-[#00c2ff]/20" style={{ boxShadow: "0 0 60px rgba(0,102,255,0.15)" }}>
            <img src="/brand/athlynx-investor.png" alt="AthlynX Investor" className="w-full object-cover max-h-[400px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>

          {/* AthlynXAI App Showcase — 8 real product screens with AthlynXAI brand placement */}
          <div className="text-center mb-6">
            <p className="text-[#00c2ff] text-xs font-black uppercase tracking-[0.3em] mb-2">App Preview</p>
            <h2 className="text-white text-3xl md:text-4xl font-black">Inside the AthlynXAI Platform</h2>
            <p className="text-gray-400 text-sm mt-2">The first sports network built for athletes — powered by our own brand.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { src: "/brand/uploads-permanent/landing-screen-01.PNG", label: "Dashboard" },
              { src: "/brand/uploads-permanent/landing-screen-02.PNG", label: "Athlete Profile" },
              { src: "/brand/uploads-permanent/landing-screen-03.PNG", label: "NIL Portal" },
              { src: "/brand/uploads-permanent/landing-screen-04.PNG", label: "C-Factor Hub" },
              { src: "/brand/uploads-permanent/landing-screen-05.PNG", label: "EPX Score" },
              { src: "/brand/uploads-permanent/landing-screen-06.PNG", label: "Transfer Portal" },
              { src: "/brand/uploads-permanent/landing-screen-07.PNG", label: "Diamond Grind" },
              { src: "/brand/uploads-permanent/landing-screen-08.PNG", label: "Warriors Playbook" },
            ].map((screen, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 group" style={{ boxShadow: "0 0 30px rgba(0,194,255,0.08)" }}>
                <img src={screen.src} alt={`AthlynXAI ${screen.label}`} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[#00c2ff] text-xs font-black uppercase tracking-wider">{screen.label}</span>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-[#00c2ff]/40 rounded-md px-2 py-0.5">
                  <span className="text-[#00c2ff] text-[10px] font-bold uppercase tracking-wider">Preview</span>
                </div>
              </div>
            ))}
          </div>

          {/* DHG Empire hero banner */}
          <div className="relative rounded-3xl overflow-hidden border border-[#00c2ff]/20 mb-4" style={{ boxShadow: "0 0 80px rgba(0,194,255,0.12)" }}>
            <img src="/brand/dhg-empire-hero.png" alt="Dozier Holdings Group" className="w-full object-cover max-h-[400px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-black text-xl md:text-2xl">DOZIER HOLDINGS GROUP</p>
              <p className="text-[#00c2ff] text-sm font-bold mt-1">The Empire Behind AthlynX · Houston, TX</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-blue-900/30 text-center">
        <p className="text-gray-600 text-sm">AthlynXAI Mobile · A Dozier Holdings Group Company</p>
        <Link href="/" className="text-blue-400 text-sm hover:text-blue-300 mt-2 inline-block">← Back to AthlynXAI Platform</Link>
      </footer>
    </div>
  );
}

export default function MobileApp() {
  return <RouteErrorBoundary><MobileAppInner /></RouteErrorBoundary>;
}
