export default function AthletePlaybookEpisode1() {
  const launchStats = [
    { label: "Season", value: "1" },
    { label: "Episode", value: "1" },
    { label: "Video", value: "2" },
    { label: "Launch day", value: "Memorial Day" },
  ];

  const rails = [
    "Spotify distribution: The Athlete’s Playbook — Episode 1 video podcast",
    "Suno music rail: Blueprint to Glory by Chad Allen Dozier Sr | AthlynXAI",
    "Athlynx.ai platform: one-identity platform and profile-growth mission",
    "AthlynXAI OS source-of-truth vault for podcast, media, proof, and audit continuity",
  ];

  const continuityLinks = [
    {
      label: "Watch on Spotify",
      href: "https://open.spotify.com/episode/3pBeGKonds1DoM39P2zhlq",
    },
    {
      label: "Suno — Blueprint to Glory",
      href: "https://suno.com/song/c9c8c213-b200-4b04-b8fa-e1b9769514a1",
    },
    {
      label: "Visit Athlynx.ai",
      href: "https://athlynx.ai",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-[#1E90FF]/20 px-5 py-16 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(36,145,255,0.24),transparent_38%),linear-gradient(135deg,rgba(4,12,35,0.98),rgba(0,8,28,0.96))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#00C2FF]">AthlynXAI Memorial Day Launch</p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              The Athlete&apos;s Playbook — Season 1, Episode 1, Video 2
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
              From the AthlynX and AthlynXAI family of companies, we honor every veteran who served this country, and we especially remember the brave men and women who fought for our freedom and never made it home. Memorial Day belongs to them, their families, and the freedoms their sacrifice made possible.
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
              What an honor to launch this Athlete&apos;s Playbook video on a day with this much meaning. ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM is not just a tagline. It is the mission: built by athletes, backed by faith, and powered by purpose for the next generation navigating recruiting, NIL, media, mindset, and opportunity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/athlynxai-os" className="rounded-full bg-[#1E90FF] px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 shadow-lg shadow-sky-500/25">
                Explore AthlynXAI OS
              </a>
              <a href="/athlete-playbook" className="rounded-full border border-[#1E90FF]/60 px-6 py-3 text-sm font-black uppercase tracking-wide text-white">
                Athlete Playbook
              </a>
              {continuityLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/30 px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:border-[#1E90FF]">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#1E90FF]/25 bg-black/40 p-3 shadow-2xl shadow-sky-950/60">
            <video className="aspect-[9/16] w-full rounded-[1.5rem] bg-black object-cover" controls playsInline preload="metadata">
              <source src="/media/podcast/episode-1/athlynxai-episode1-video2-memorial-day.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-4 lg:px-16">
        {launchStats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-[#1E90FF]/20 bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00C2FF]">{item.label}</p>
            <p className="mt-3 text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">Launch doctrine</h2>
            <p className="mt-4 leading-7 text-slate-200">
              The Athlete&apos;s Playbook is not a one-off podcast asset. It is a media operating layer inside AthlynXAI OS, designed to route attention back into athlete profiles, recruiting visibility, NIL readiness, brand development, AXN programming, and long-term opportunity for every athlete and every sport. This Memorial Day launch connects Spotify, Suno, Athlynx.ai, and the AthlynXAI source-of-truth workflow into one proof-backed lane.
            </p>
            </div>
          <div className="rounded-[2rem] border border-[#1E90FF]/20 bg-[#1E90FF]/30 p-8">
            <h2 className="text-3xl font-black">Episode 1 Video 2 rails</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {rails.map((rail) => (
                <div key={rail} className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm font-bold text-slate-100">
                  {rail}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
