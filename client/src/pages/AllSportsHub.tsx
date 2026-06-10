// AthlynXAI — All Sports Hub
// Complete coverage: 44+ sports, men's & women's divisions, NIL data, recruiting stats.
// Brand: cobalt #1E90FF + true black + white. Stadium lights. Owl mark. BE THE LEGACY.

import { Link, useRoute } from "wouter";
import { useState, useMemo } from "react";
import {
  SPORTS,
  FEATURED_SPORTS,
  SPORTS_BY_CATEGORY,
  MENS_SPORTS,
  WOMENS_SPORTS,
  COED_SPORTS,
  getSport,
  type Sport,
} from "@/data/sportsConfig";

const CATEGORY_LABELS: Record<Sport["category"], string> = {
  team: "Team Sports",
  individual: "Individual Sports",
  racquet: "Racquet & Net",
  combat: "Combat & Strength",
  endurance: "Endurance & Track",
  winter: "Winter Sports",
  water: "Water Sports",
  youth: "Youth Development",
  outdoor: "Outdoor & Adventure",
};

type GenderFilter = "all" | "mens" | "womens" | "coed";

function GenderBadge({ sport }: { sport: Sport }) {
  const both = sport.hasMens && sport.hasWomens;
  const mensOnly = sport.hasMens && !sport.hasWomens;
  const womensOnly = !sport.hasMens && sport.hasWomens;
  if (both) return (
    <span className="text-[9px] font-black tracking-widest uppercase text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
      M + W
    </span>
  );
  if (mensOnly) return (
    <span className="text-[9px] font-black tracking-widest uppercase text-sky-400/80 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
      Men's
    </span>
  );
  if (womensOnly) return (
    <span className="text-[9px] font-black tracking-widest uppercase text-pink-400/80 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
      Women's
    </span>
  );
  return null;
}

function SportCard({ sport }: { sport: Sport }) {
  return (
    <Link
      href={`/sports/${sport.slug}`}
      className="group block rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0a1a3a] to-black p-5 transition-all hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
      data-testid={`sport-card-${sport.slug}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{sport.icon}</span>
        <div className="flex flex-col items-end gap-1">
          <GenderBadge sport={sport} />
          <span className="text-[9px] font-black tracking-widest uppercase text-blue-400/60">{sport.season}</span>
        </div>
      </div>
      <h3 className="text-lg font-black text-white mb-0.5 group-hover:text-blue-400 transition-colors leading-tight">
        {sport.name}
      </h3>
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-2">{sport.brand}</p>
      <p className="text-xs text-white/65 leading-snug mb-3">{sport.tagline}</p>
      {sport.avgNILValue && (
        <div className="flex items-center gap-1.5 mt-auto">
          <span className="text-[9px] font-black uppercase tracking-wider text-green-400/70">NIL</span>
          <span className="text-[9px] text-white/50">{sport.avgNILValue}</span>
        </div>
      )}
    </Link>
  );
}

function SportDetailView({ sport }: { sport: Sport }) {
  const features = sport.features ?? ["AI Recruiter", "NIL Vault", "Highlight Studio", "Athlete Profile"];
  const featureLinks: Record<string, string> = {
    "AI Recruiter": "/ai-recruiter",
    "NIL Vault": "/nil-vault",
    "NIL Portal": "/nil-portal",
    "Highlight Studio": "/highlight-reel-studio",
    "Athlete Profile": "/profile",
    "Transfer Portal": "/transfer-portal",
    "X-Factor": "/x-factor",
    "Brackets": "/brackets",
    "Diamond Grind IQ": "/diamond-grind-iq",
    "Pitch Pulse": "/baseball",
    "Warriors Playbook": "/warriors-playbook",
  };
  const featureDescs: Record<string, string> = {
    "AI Recruiter": "AI-driven prospect matching tuned for your sport.",
    "NIL Vault": "Run deals, deliverables, and payouts in one place.",
    "NIL Portal": "Full NIL marketplace — brands, deals, and contracts.",
    "Highlight Studio": "Auto-cut, captioned, and distribution-ready clips.",
    "Athlete Profile": "One identity that travels with the athlete for life.",
    "Transfer Portal": "Every portal entry, every school, every offer.",
    "X-Factor": "Your competitive edge — tracked and amplified.",
    "Brackets": "Every regional, every super, every championship.",
    "Diamond Grind IQ": "Position-specific baseball analytics and film.",
    "Pitch Pulse": "Live pitch tracking and arm health monitoring.",
    "Warriors Playbook": "Coaching playbooks, film, and game planning.",
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative px-6 pt-20 pb-12 border-b border-white/10 bg-gradient-to-b from-[#0a1a3a] via-black to-black">
        <div className="max-w-5xl mx-auto">
          <Link href="/sports" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            ← All Sports
          </Link>
          <div className="flex items-center gap-5 mb-4">
            <span className="text-7xl">{sport.icon}</span>
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-blue-500 mb-1">{sport.brand}</p>
              <h1 className="text-5xl font-black uppercase tracking-tight leading-none">{sport.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <GenderBadge sport={sport} />
                <span className="text-xs text-white/50 font-bold uppercase tracking-wider">{sport.season}</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mb-6">{sport.tagline}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider transition-colors">
              Claim Your Profile
            </Link>
            <Link href="/dashboard" className="border border-white/20 hover:border-blue-500 text-white font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider transition-colors">
              Open Dashboard
            </Link>
            <Link href="/nil-portal" className="border border-green-500/40 hover:border-green-400 text-green-400 font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider transition-colors">
              NIL Portal
            </Link>
          </div>
        </div>
      </section>
      {(sport.avgNILValue || sport.ncaaScholarships || sport.recruitingWindow) && (
        <section className="px-6 py-8 border-b border-white/10 bg-[#050A12]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {sport.avgNILValue && (
              <div className="text-center">
                <p className="text-2xl font-black text-green-400">{sport.avgNILValue}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/50 mt-1">Avg NIL Value</p>
              </div>
            )}
            {sport.ncaaScholarships && (
              <div className="text-center">
                <p className="text-2xl font-black text-blue-400">{sport.ncaaScholarships}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/50 mt-1">NCAA Scholarships</p>
              </div>
            )}
            {sport.recruitingWindow && (
              <div className="text-center">
                <p className="text-2xl font-black text-white">{sport.recruitingWindow}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/50 mt-1">Recruiting Window</p>
              </div>
            )}
          </div>
        </section>
      )}
      {sport.topConferences && sport.topConferences.length > 0 && (
        <section className="px-6 py-6 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-3">Top Conferences</p>
            <div className="flex flex-wrap gap-2">
              {sport.topConferences.map((conf) => (
                <span key={conf} className="text-sm font-black text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">{conf}</span>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black uppercase tracking-wide mb-8">What You Get on AthlynX</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <Link key={f} href={featureLinks[f] ?? "/dashboard"} className="block rounded-xl border border-white/10 bg-[#07111F] p-4 hover:border-blue-500/40 hover:bg-[#0a1628] transition-all group">
              <h3 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors mb-1">{f}</h3>
              <p className="text-xs text-white/55 leading-relaxed">{featureDescs[f] ?? "Powered by AthlynXAI OS v1."}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="px-6 py-16 bg-gradient-to-t from-[#0a1628] to-black border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-black tracking-widest uppercase text-blue-500 mb-3">AthlynXAI OS v1</p>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4">BE THE LEGACY</h2>
          <p className="text-white/60 text-lg mb-8">One platform. Every {sport.name} athlete. Zero middlemen.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup" className="bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/30">
              Enter the Portal
            </Link>
            <Link href="/sports" className="border border-white/20 hover:border-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-colors">
              All Sports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AllSportsHub() {
  const [matchDetail, paramsDetail] = useRoute("/sports/:slug");
  const slug = matchDetail ? paramsDetail?.slug : null;
  const sport = slug ? getSport(slug) : null;

  const [gender, setGender] = useState<GenderFilter>("all");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Sport["category"] | "all">("all");

  const filteredSports = useMemo(() => {
    let list = SPORTS;
    if (gender === "mens") list = list.filter((s) => s.hasMens !== false);
    else if (gender === "womens") list = list.filter((s) => s.hasWomens === true);
    else if (gender === "coed") list = list.filter((s) => s.hasMens && s.hasWomens);
    if (activeCategory !== "all") list = list.filter((s) => s.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q)
      );
    }
    return list;
  }, [gender, activeCategory, search]);

  if (sport) return <SportDetailView sport={sport} />;
  if (slug && !sport) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-black mb-2">Sport not found</h1>
          <p className="text-white/70 mb-6">"{slug}" isn't in the AthlynX sports catalog yet.</p>
          <Link href="/sports" className="inline-block bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider">
            See All Sports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative px-6 pt-20 pb-12 border-b border-white/10 bg-gradient-to-b from-[#0a1a3a] via-black to-black overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-xs font-black tracking-widest uppercase text-blue-500 mb-3">AthlynXAI OS v1</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 leading-none">All Sports Hub</h1>
          <p className="text-xl text-white/70 max-w-2xl mb-6">
            Every sport. Men's and women's. AI recruiting, NIL valuation, and lifetime athlete identity.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-black text-white">{SPORTS.length} Sports</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-sm font-black text-blue-400">{MENS_SPORTS.length} Men's</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-sm font-black text-pink-400">{WOMENS_SPORTS.length} Women's</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-sm font-black text-green-400">{COED_SPORTS.length} Co-ed</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-40 px-6 py-4 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(["all", "mens", "womens", "coed"] as GenderFilter[]).map((g) => (
              <button key={g} onClick={() => setGender(g)}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                  gender === g ? "bg-blue-500 text-black" : "border border-white/20 text-white/70 hover:border-blue-500/50 hover:text-white"
                }`}>
                {g === "all" ? "All" : g === "mens" ? "Men's" : g === "womens" ? "Women's" : "Co-ed"}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Search sports..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm font-bold px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500/60 w-full md:w-64" />
        </div>
        <div className="max-w-6xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-1">
          {(["all", ...Object.keys(SPORTS_BY_CATEGORY)] as (Sport["category"] | "all")[]).map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "text-white/40 hover:text-white/70"
              }`}>
              {cat === "all" ? "All Categories" : CATEGORY_LABELS[cat as Sport["category"]] ?? cat}
            </button>
          ))}
        </div>
      </section>

      {gender === "all" && activeCategory === "all" && !search && (
        <section className="px-6 py-10 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase tracking-wide">Flagship Brands</h2>
              <span className="text-xs font-black uppercase tracking-widest text-blue-500">AthlynX Originals</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {FEATURED_SPORTS.map((s) => <SportCard key={s.slug} sport={s} />)}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black uppercase tracking-wide">
              {filteredSports.length} Sport{filteredSports.length !== 1 ? "s" : ""}
              {gender !== "all" && <span className="ml-2 text-blue-400">— {gender === "mens" ? "Men's" : gender === "womens" ? "Women's" : "Co-ed"}</span>}
            </h2>
          </div>
          {filteredSports.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg font-bold">No sports found.</p>
              <button onClick={() => { setSearch(""); setGender("all"); setActiveCategory("all"); }}
                className="mt-4 text-blue-400 text-sm font-black hover:text-blue-300">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredSports.map((s) => <SportCard key={s.slug} sport={s} />)}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-16 bg-gradient-to-t from-[#0a1628] to-black border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-black tracking-widest uppercase text-blue-500 mb-3">First of Its Kind</p>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4">BE THE LEGACY</h2>
          <p className="text-white/60 text-lg mb-8">The first 1-man, 1-AI, $1B autonomous athlete platform. Every sport. Every tool. Zero middlemen.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup" className="bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/30">
              Enter the Portal
            </Link>
            <Link href="/innovations" className="border border-white/20 hover:border-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-colors">
              Platform Innovations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
