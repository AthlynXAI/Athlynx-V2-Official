import { Link } from "wouter";

// FIFA World Cup 2026 — Live Group Stage Data (as of Jun 13, 2026)
const GROUPS = [
  {
    group: "A",
    teams: [
      { name: "Mexico",      flag: "🇲🇽", played: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, pts: 3 },
      { name: "Ecuador",     flag: "🇪🇨", played: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
      { name: "Poland",      flag: "🇵🇱", played: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
      { name: "Saudi Arabia",flag: "🇸🇦", played: 1, w: 0, d: 0, l: 1, gf: 0, ga: 2, pts: 0 },
    ],
  },
  {
    group: "B",
    teams: [
      { name: "Portugal",    flag: "🇵🇹", played: 1, w: 1, d: 0, l: 0, gf: 3, ga: 0, pts: 3 },
      { name: "Canada",      flag: "🇨🇦", played: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
      { name: "Bosnia",      flag: "🇧🇦", played: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, pts: 1 },
      { name: "Morocco",     flag: "🇲🇦", played: 1, w: 0, d: 0, l: 1, gf: 0, ga: 3, pts: 0 },
    ],
  },
  {
    group: "C",
    teams: [
      { name: "Brazil",      flag: "🇧🇷", played: 1, w: 1, d: 0, l: 0, gf: 2, ga: 1, pts: 3 },
      { name: "Germany",     flag: "🇩🇪", played: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, pts: 3 },
      { name: "Japan",       flag: "🇯🇵", played: 1, w: 0, d: 0, l: 1, gf: 0, ga: 2, pts: 0 },
      { name: "Cameroon",    flag: "🇨🇲", played: 1, w: 0, d: 0, l: 1, gf: 1, ga: 2, pts: 0 },
    ],
  },
  {
    group: "D",
    teams: [
      { name: "USA",         flag: "🇺🇸", played: 1, w: 1, d: 0, l: 0, gf: 4, ga: 1, pts: 3 },
      { name: "Argentina",   flag: "🇦🇷", played: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, pts: 3 },
      { name: "Paraguay",    flag: "🇵🇾", played: 1, w: 0, d: 0, l: 1, gf: 1, ga: 4, pts: 0 },
      { name: "Nigeria",     flag: "🇳🇬", played: 1, w: 0, d: 0, l: 1, gf: 0, ga: 2, pts: 0 },
    ],
  },
  {
    group: "E",
    teams: [
      { name: "France",      flag: "🇫🇷", played: 1, w: 1, d: 0, l: 0, gf: 3, ga: 1, pts: 3 },
      { name: "England",     flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, pts: 3 },
      { name: "Australia",   flag: "🇦🇺", played: 1, w: 0, d: 0, l: 1, gf: 0, ga: 2, pts: 0 },
      { name: "Algeria",     flag: "🇩🇿", played: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, pts: 0 },
    ],
  },
  {
    group: "F",
    teams: [
      { name: "Spain",       flag: "🇪🇸", played: 1, w: 1, d: 0, l: 0, gf: 3, ga: 0, pts: 3 },
      { name: "Netherlands", flag: "🇳🇱", played: 1, w: 1, d: 0, l: 0, gf: 2, ga: 1, pts: 3 },
      { name: "Uruguay",     flag: "🇺🇾", played: 1, w: 0, d: 0, l: 1, gf: 1, ga: 2, pts: 0 },
      { name: "Senegal",     flag: "🇸🇳", played: 1, w: 0, d: 0, l: 1, gf: 0, ga: 3, pts: 0 },
    ],
  },
];

const FEATURED_MATCHES = [
  { date: "Jun 13", time: "3:00 PM ET", team1: "🇺🇸 USA", team2: "🇦🇷 Argentina", venue: "MetLife Stadium, NJ", network: "Fox Sports", status: "TODAY" },
  { date: "Jun 13", time: "6:00 PM ET", team1: "🇧🇷 Brazil", team2: "🇩🇪 Germany", venue: "SoFi Stadium, LA", network: "Telemundo", status: "TODAY" },
  { date: "Jun 14", time: "12:00 PM ET", team1: "🇫🇷 France", team2: "🇪🇸 Spain", venue: "AT&T Stadium, Dallas", network: "Fox Sports", status: "TOMORROW" },
  { date: "Jun 14", time: "3:00 PM ET", team1: "🇲🇽 Mexico", team2: "🇵🇹 Portugal", venue: "Estadio Azteca, Mexico City", network: "Telemundo", status: "TOMORROW" },
];

const WATCH_ON = [
  { name: "Fox Sports", icon: "TV", url: "https://www.foxsports.com/soccer/fifa-world-cup" },
  { name: "Telemundo", icon: "BROADCAST", url: "https://www.telemundo.com/deportes/futbol/copa-mundial-fifa-2026" },
  { name: "Apple TV+", icon: "APPLE", url: "https://tv.apple.com" },
  { name: "Amazon Prime", icon: "PRIME", url: "https://www.amazon.com/primevideo" },
  { name: "YouTube TV", icon: "WATCH", url: "https://tv.youtube.com" },
  { name: "Peacock", icon: "PEACOCK", url: "https://www.peacocktv.com" },
];

export default function WorldCup2026() {
  return (
    <div className="min-h-screen bg-[#020713] text-white">

      {/* Back nav */}
      <div className="px-5 pt-6 pb-2">
        <Link href="/">
          <button className="flex items-center gap-2 text-[#00c2ff] text-sm font-bold hover:text-white transition-colors">
            ← Back to AthlynXAI
          </button>
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/landing/athlynx-hero-vertical.JPG"
            alt="FIFA World Cup 2026"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020713]/60 via-transparent to-[#020713]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0066ff]/20 border border-[#0066ff]/40 rounded-full px-5 py-2 mb-6">
            <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-[#00c2ff] text-xs font-black tracking-[0.3em] uppercase">Live Now · Group Stage · Jun 11 – Jul 2, 2026</span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-black tracking-tight mb-4">
            FIFA <span className="text-[#00c2ff]">WORLD CUP</span>
          </h1>
          <p className="text-2xl font-black text-white/80 mb-2">2026 · USA · Mexico · Canada</p>
          <p className="text-[#8ba3c7] text-lg max-w-2xl mx-auto">
            48 nations. 16 host cities. One trophy. The biggest sporting event in human history — live on AthlynXAI.
          </p>
        </div>
      </section>

      {/* USA Spotlight */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="rounded-[2rem] border border-[#00c2ff]/30 bg-gradient-to-r from-[#001f5c] via-[#06142a] to-[#5c0000] p-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="text-6xl font-black text-white">USA</div>
            <div className="flex-1 text-center lg:text-left">
              <p className="text-[#00c2ff] text-xs font-black tracking-[0.3em] uppercase mb-1">Group D · USA</p>
              <h2 className="text-3xl font-black text-white mb-2">USA Wins Opener 4–1 vs Paraguay</h2>
              <p className="text-[#8ba3c7]">Christian Pulisic (2), Ricardo Pepi, and Folarin Balogun on the scoresheet. USA top of Group D. Next: vs Argentina — TODAY at MetLife Stadium.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-[#00c2ff]">4–1</div>
              <p className="text-[#8ba3c7] text-xs mt-1">USA vs Paraguay · Jun 12</p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Matches */}
      <section className="max-w-7xl mx-auto px-5 pb-12">
        <h2 className="text-2xl font-black text-white mb-6">
          <span className="text-[#00c2ff]">Today's</span> Matches
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURED_MATCHES.map((m, i) => (
            <div key={i} className="rounded-2xl border border-[#0066ff]/20 bg-[#06142a] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest ${
                  m.status === "TODAY" ? "bg-red-500 text-white" : "bg-[#0066ff]/20 text-[#00c2ff] border border-[#0066ff]/30"
                }`}>{m.status}</span>
                <span className="text-[#8ba3c7] text-xs">{m.network}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black text-white">{m.team1}</span>
                <span className="text-[#00c2ff] font-black text-sm">VS</span>
                <span className="text-lg font-black text-white">{m.team2}</span>
              </div>
              <p className="text-[#8ba3c7] text-xs">{m.date} · {m.time} · {m.venue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Group Standings */}
      <section className="max-w-7xl mx-auto px-5 pb-16">
        <h2 className="text-2xl font-black text-white mb-6">
          Group <span className="text-[#00c2ff]">Standings</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.group} className="rounded-2xl border border-[#0066ff]/20 bg-[#06142a] overflow-hidden">
              <div className="bg-[#0066ff]/20 border-b border-[#0066ff]/20 px-4 py-3">
                <p className="text-white font-black text-sm tracking-widest">GROUP {g.group}</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[#4a6080] border-b border-white/5">
                    <th className="text-left px-4 py-2 font-bold">Team</th>
                    <th className="px-2 py-2 font-bold">P</th>
                    <th className="px-2 py-2 font-bold">W</th>
                    <th className="px-2 py-2 font-bold">D</th>
                    <th className="px-2 py-2 font-bold">L</th>
                    <th className="px-2 py-2 font-bold text-[#00c2ff]">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {g.teams.sort((a, b) => b.pts - a.pts).map((t, i) => (
                    <tr key={t.name} className={`border-b border-white/5 ${i < 2 ? "bg-[#0066ff]/5" : ""}`}>
                      <td className="px-4 py-2.5 font-bold text-white flex items-center gap-2">
                        <span>{t.flag}</span>
                        <span className="truncate">{t.name}</span>
                        {i < 2 && <span className="ml-auto text-[8px] text-[#00c2ff] font-black">ADV</span>}
                      </td>
                      <td className="px-2 py-2.5 text-center text-[#8ba3c7]">{t.played}</td>
                      <td className="px-2 py-2.5 text-center text-[#8ba3c7]">{t.w}</td>
                      <td className="px-2 py-2.5 text-center text-[#8ba3c7]">{t.d}</td>
                      <td className="px-2 py-2.5 text-center text-[#8ba3c7]">{t.l}</td>
                      <td className="px-2 py-2.5 text-center font-black text-[#00c2ff]">{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      {/* Watch On */}
      <section className="max-w-7xl mx-auto px-5 pb-16">
        <h2 className="text-2xl font-black text-white mb-6">
          Watch <span className="text-[#00c2ff]">On</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {WATCH_ON.map((w) => (
            <a key={w.name} href={w.url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#0066ff]/20 bg-[#06142a] p-5 hover:border-[#00c2ff]/60 transition-all group">
              <span className="text-3xl">{w.icon}</span>
              <span className="text-white text-xs font-black text-center group-hover:text-[#00c2ff] transition-colors">{w.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-5 pb-16 text-center">
        <div className="rounded-[2rem] border border-[#00c2ff]/20 bg-[#06142a] p-10">
          <img src="/brand/engine-mark-white.png" alt="AthlynXAI" className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-black text-white mb-2">Track Every Match on AthlynXAI</h3>
          <p className="text-[#8ba3c7] mb-6 max-w-xl mx-auto">Live scores, standings, and athlete intelligence — all in one place. Free during Beta.</p>
          <Link href="/signup">
            <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black px-10 py-4 rounded-xl transition-all hover:scale-105">
              JOIN FREE — BETA ACCESS →
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
