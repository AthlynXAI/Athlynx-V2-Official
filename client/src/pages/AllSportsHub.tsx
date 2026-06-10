// AthlynX — All Sports Hub
// Replaces 35+ individual *Elite pages with one fast, brand-locked surface
// driven by /client/src/data/sportsConfig.ts
//
// Brand: cobalt #1E90FF + true black + white. No gold/yellow/orange.

import { Link, useRoute } from "wouter";
import { useMemo, useState } from "react";
import { SPORTS, FEATURED_SPORTS, SPORTS_BY_CATEGORY, getSport, type Sport } from "@/data/sportsConfig";

const CATEGORY_LABELS: Record<Sport["category"], string> = {
  team: "Team Sports",
  individual: "Individual Sports",
  racquet: "Racquet & Net",
  combat: "Combat",
  endurance: "Endurance & Track",
  winter: "Winter Sports",
  water: "Water Sports",
  youth: "Youth Development",
  outdoor: "Outdoor",
};

function SportCard({ sport }: { sport: Sport }) {
  return (
    <Link
      href={`/sports/${sport.slug}`}
      className="group block rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0a1a3a] to-black p-5 transition-all hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]"
      data-testid={`sport-card-${sport.slug}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl">{sport.icon}</span>
        <span className="text-[10px] font-black tracking-widest uppercase text-blue-400/80">{sport.season}</span>
      </div>
      <h3 className="text-xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">{sport.name}</h3>
      <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">{sport.brand}</p>
      <p className="text-sm text-white/70 leading-snug">{sport.tagline}</p>
    </Link>
  );
}

function SportDetailView({ sport }: { sport: Sport }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-12 border-b border-white/10 bg-gradient-to-b from-[#0a1a3a] via-black to-black">
        <div className="max-w-5xl mx-auto">
          <Link href="/sports" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-6">
            ← All Sports
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-6xl">{sport.icon}</span>
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-blue-500">{sport.brand}</p>
              <h1 className="text-5xl font-black uppercase tracking-tight">{sport.name}</h1>
            </div>
          </div>
          <p className="text-xl text-white/80 max-w-2xl">{sport.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider transition-colors">
              Claim Your Profile
            </Link>
            <Link href="/dashboard" className="border border-white/20 hover:border-blue-500 text-white font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider transition-colors">
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black uppercase tracking-wide mb-8">What you get on AthlynX</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "AI Recruiter", desc: "AI-driven prospect matching tuned for your sport.", href: "/ai-recruiter" },
            { title: "NIL Portal", desc: "Run deals, deliverables, and payouts in one place.", href: "/nil-portal" },
            { title: "Highlight Studio", desc: "Auto-cut, captioned, and distribution-ready clips.", href: "/highlight-reel-studio" },
            { title: "Athlete Profile", desc: "One identity that travels with the athlete for life.", href: "/profile" },
            { title: "Brackets & Live", desc: "Every regional, every super, every championship.", href: "/brackets" },
            { title: "AI Training Bot", desc: "Position-specific drills and film breakdowns.", href: "/trainer-bot" },
          ].map((f) => (
            <Link key={f.title} href={f.href} className="block rounded-2xl border border-white/10 bg-black p-5 hover:border-blue-500/60 transition-all">
              <h3 className="text-lg font-black mb-2">{f.title}</h3>
              <p className="text-sm text-white/70">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AllSportsHub() {
  const [match, params] = useRoute("/sports/:slug");
  const slug = match ? params?.slug : null;
  const sport = slug ? getSport(slug) : null;

  if (sport) return <SportDetailView sport={sport} />;
  if (slug && !sport) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-black mb-2">Sport not found</h1>
          <p className="text-white/70 mb-6">"{slug}" isn’t one of the AthlynX sports yet.</p>
          <Link href="/sports" className="inline-block bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider">
            See All Sports
          </Link>
        </div>
      </div>
    );
  }

  const [filter, setFilter] = useState<Sport["category"] | "all">("all");
  const list = useMemo(
    () => (filter === "all" ? SPORTS : SPORTS_BY_CATEGORY[filter] ?? []),
    [filter]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="px-6 pt-20 pb-10 border-b border-white/10 bg-gradient-to-b from-[#0a1a3a] via-black to-black">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-black tracking-widest uppercase text-blue-500 mb-2">AthlynX · Every Sport</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-3">All Sports Hub</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            One identity. Every athlete. Every sport. Built for youth, college, pro, and post-career.
          </p>
        </div>
      </section>

      {/* Featured strip */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Featured</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {FEATURED_SPORTS.map((s) => <SportCard key={s.slug} sport={s} />)}
        </div>
      </section>

      {/* Filter chips */}
      <section className="px-6 pt-4 pb-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === "all" ? "bg-blue-500 text-black" : "border border-white/15 text-white/70 hover:text-white hover:border-white/30"
            }`}
          >
            All ({SPORTS.length})
          </button>
          {(Object.keys(SPORTS_BY_CATEGORY) as Sport["category"][]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === cat ? "bg-blue-500 text-black" : "border border-white/15 text-white/70 hover:text-white hover:border-white/30"
              }`}
            >
              {CATEGORY_LABELS[cat]} ({SPORTS_BY_CATEGORY[cat].length})
            </button>
          ))}
        </div>
      </section>

      {/* All sports grid */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((s) => <SportCard key={s.slug} sport={s} />)}
        </div>
      </section>
    </div>
  );
}
