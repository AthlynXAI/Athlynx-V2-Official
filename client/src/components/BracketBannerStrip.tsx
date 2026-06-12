/**
 * BracketBannerStrip — premium AthlynX-branded MCWS bracket banner
 * pinned at the top of athlynx.ai.
 *
 * Locked by Chad 2026-06-01 06:01 CDT:
 *   "All I want is the bracket banners live and at top."
 *   "Brand it for AthlynX. Best them at their own game. Make it ours and very cool."
 *
 * Updated 2026-06-12: WCWS is complete — MCWS only.
 * Image lives at /brackets/mcws-banner.jpg
 *
 * Brand-locked: cobalt #1E90FF · cyan #00C2FF · true black · white.
 * Signoff:  */

interface BannerBlockProps {
  imgSrc: string;
  alt: string;
  href: string;
  ncaaHref: string;
  testId: string;
}

function BannerBlock({ imgSrc, alt, href, ncaaHref, testId }: BannerBlockProps) {
  return (
    <a
      href={ncaaHref}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      className="group relative block overflow-hidden rounded-2xl border border-[#1E90FF]/40 bg-black shadow-[0_8px_32px_rgba(30,144,255,0.18)] transition hover:border-[#1E90FF] hover:shadow-[0_12px_48px_rgba(30,144,255,0.45)]"
    >
      <img
        src={imgSrc}
        alt={alt}
        loading="eager"
        decoding="async"
        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.015]"
      />
      {/* Hover overlay nudge */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {/* Bottom-right secondary nav: AthlynX live view (separate link) */}
      <a
        href={href}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-3 hidden md:inline-flex items-center gap-2 rounded-xl border border-white/30 bg-black/55 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur transition hover:border-[#1E90FF]/70 hover:bg-black/75 hover:text-white"
      >
        AthlynX Live View
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </a>
  );
}

export default function BracketBannerStrip() {
  return (
    <section
      className="relative border-b border-[#1E90FF]/30 bg-black px-3 py-5 md:py-6"
      data-testid="bracket-banner-strip"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#1E90FF]"></span>
            <h1 className="text-xs font-black uppercase tracking-[0.28em] text-white md:text-sm">
              Live Championship Brackets · MCWS
            </h1>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Men. Women. Every Athlete.
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <BannerBlock
            imgSrc="/brackets/mcws-banner.jpg"
            alt="AthlynX Road to Omaha — 2026 NCAA D1 Baseball Championship, live regionals, super regionals, MCWS"
            href="/brackets/mcws"
            ncaaHref="https://www.ncaa.com/brackets/baseball/d1/2026"
            testId="bracket-banner-mcws"
          />
        </div>
      </div>
    </section>
  );
}
