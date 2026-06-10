// AthlynXAI — /sports landing page (Build 15)
// Every sport. Create everything in one place.
// 13 hero cards: Softball,
//                Wrestling, Lacrosse, Hockey

import { Link } from "wouter";

type Sport = {
  slug: string;
  label: string;
  tagline: string;
  image: string;
  href: string;
};

const SPORTS: Sport[] = [
  { slug: "football",   label: "Football",   tagline: "Highlights · Recruiting · NIL", image: "/sports/football.png",   href: "/onboarding/sport?sport=football" },
  { slug: "basketball", label: "Basketball", tagline: "Court Kings · NIL · Reels",     image: "/sports/basketball.png", href: "/onboarding/sport?sport=basketball" },
  { slug: "baseball",   label: "Baseball",   tagline: "Diamond Grind · Stats · Film",  image: "/sports/baseball.png",   href: "/onboarding/sport?sport=baseball" },
  { slug: "softball",   label: "Softball",   tagline: "Diamond Grind · Stats · Film",  image: "/sports/softball.png",   href: "/onboarding/sport?sport=softball" },
  { slug: "soccer",     label: "Soccer",     tagline: "Highlights · Combine · NIL",    image: "/sports/soccer.png",     href: "/onboarding/sport?sport=soccer" },
  { slug: "track",      label: "Track",      tagline: "Times · PRs · Recruiting",      image: "/sports/track.png",      href: "/onboarding/sport?sport=track" },
  { slug: "volleyball", label: "Volleyball", tagline: "Film · Club Ball · NIL",        image: "/sports/volleyball.png", href: "/onboarding/sport?sport=volleyball" },
  { slug: "wrestling",  label: "Wrestling",  tagline: "Matches · Weight · Ranks",      image: "/sports/wrestling.png",  href: "/onboarding/sport?sport=wrestling" },
  { slug: "tennis",     label: "Tennis",     tagline: "UTR · Match Film · NIL",        image: "/sports/tennis.png",     href: "/onboarding/sport?sport=tennis" },
  { slug: "golf",       label: "Golf",       tagline: "Scorecard · Swing Film · NIL",  image: "/sports/golf.png",       href: "/onboarding/sport?sport=golf" },
  { slug: "swimming",   label: "Swimming",   tagline: "Splits · Meet Film · NIL",      image: "/sports/swimming.png",   href: "/onboarding/sport?sport=swimming" },
  { slug: "lacrosse",   label: "Lacrosse",   tagline: "Film · Club · Recruiting",      image: "/sports/lacrosse.png",   href: "/onboarding/sport?sport=lacrosse" },
  { slug: "hockey",     label: "Hockey",     tagline: "Film · Tier · Recruiting",      image: "/sports/hockey.png",     href: "/onboarding/sport?sport=hockey" },
];

export default function Sports() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* Hero */}
      <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-400/30 text-xs font-bold tracking-widest text-cyan-300 mb-6">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          EVERY SPORT · EVERY ATHLETE · ONE PLATFORM
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5">
          <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
            Create Everything
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            In One Place.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          AthlynXAI is the highway every sport rides on.
          Profiles, film, music, recruiting, NIL — all created here, shipped everywhere.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            href="/signup"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Start Your Profile
          </Link>
          <Link
            href="/how-it-works"
            className="px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-base transition-all"
          >
            How It Works
          </Link>
        </div>
      </section>

      {/* 13-sport grid */}
      <section className="px-4 md:px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {SPORTS.map((sport) => (
            <Link
              key={sport.slug}
              href={sport.href}
              className="group relative block overflow-hidden rounded-3xl bg-gray-900 border border-white/5 hover:border-cyan-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <div className="aspect-[2/3] overflow-hidden bg-black">
                <img
                  src={sport.image}
                  alt={`AthlynXAI ${sport.label} — Create everything in one place.`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-lg">
                      {sport.label}
                    </h3>
                    <p className="text-xs font-medium text-cyan-300/90 uppercase tracking-wider mt-1">
                      {sport.tagline}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Branded Profile CTA */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <Link href="/ai-trainer/build" className="block rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-[#660000]/40 via-blue-950/40 to-cyan-950/40 p-6 md:p-8 hover:border-cyan-400/60 transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-cyan-300 mb-2">AI Trainer · Birth to Death</div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
                Your Top 5 Schools On Page One.
              </h3>
              <p className="text-sm md:text-base text-gray-300">
                Branded for your school, college, and pro team. NIL pipeline built in. We do it all.
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black tracking-wider uppercase text-sm">
              Build My Profile →
            </span>
          </div>
        </Link>
      </section>

      {/* Highway thesis */}
      <section className="px-6 pb-24 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-br from-blue-950/40 via-gray-950 to-cyan-950/40 border border-cyan-500/20 p-8 md:p-14">
          <p className="text-xs font-bold tracking-widest text-cyan-300 mb-4">THE AthlynXAI THESIS</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-5">
            <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              We are the highway.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Every other platform is a truck. They haul athlete content from one place to another.
            We are the <span className="text-cyan-300 font-bold">road</span> they all drive on —
            and we control the speed.
          </p>
          <p className="mt-6 text-base text-gray-400 max-w-2xl mx-auto">
            Profiles. Film. Music. NIL. Recruiting. Create it once on AthlynXAI.
            Ship it to YouTube, Vimeo, TikTok, CapCut — everywhere.
          </p>
        </div>
      </section>

      {/* Closer */}
      <footer className="px-6 pb-16 text-center">
        <p className="text-sm text-gray-500 italic">
          Iron Sharpens Iron — Proverbs 27:17
        </p>
      </footer>
    </div>
  );
}
