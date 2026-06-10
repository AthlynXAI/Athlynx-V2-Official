// SovereigntyManifesto.tsx
// AthlynX Doctrine section — Chad Dozier's response to HUMAIN's positioning.
// "The athlete leap is here. Sovereignty decides who leads it. Love decides who survives."
// Pure React + Tailwind. No auth dependency. No API calls.

export default function SovereigntyManifesto() {
  const pillars = [
    {
      title: "FULL-STACK SOVEREIGNTY",
      subtitle: "Compute. Cloud. Models. Apps.",
      body: "Nebius H200 semifinalist. AthlynXAI OS. The Athlete's Playbook engine. Mobile + web + PWA, native end to end. We do not rent the future — we own the layers beneath every athlete identity we mint.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="24" height="5" rx="1.5" fill="#1E90FF" />
          <rect x="2" y="11.5" width="24" height="5" rx="1.5" fill="#00C2FF" opacity="0.8" />
          <rect x="2" y="19" width="24" height="5" rx="1.5" fill="#1E90FF" opacity="0.5" />
        </svg>
      ),
    },
    {
      title: "IDENTITY FOR LIFE",
      subtitle: "Youth. High school. College. Pro. Retired. Coach. Next generation.",
      body: "Compute deprecates. Software deprecates. Identity compounds. AthlynX is the only platform that travels with an athlete through every season of their life — and through every athlete who comes after them.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          {/* Infinity loop */}
          <path
            d="M4 14c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5zm10 0c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5z"
            stroke="#1E90FF"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M14 14c0-2.761 2.239-5 5-5"
            stroke="#00C2FF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ),
    },
    {
      title: "LOVABLE BY EVERY ATHLETE",
      subtitle: "30-second profiles. Free to start. Built to share.",
      body: "Sovereignty wins the long game. Love wins the launch. Every athlete spins up a brand-locked AthlynX identity in under thirty seconds — free, mobile-first, parent-approved. Then the ecosystem unlocks for life.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          {/* Heart with athletic pulse line */}
          <path
            d="M14 22s-9-5.5-9-11.5A5.5 5.5 0 0 1 14 7a5.5 5.5 0 0 1 9 3.5C23 16.5 14 22 14 22z"
            fill="#1E90FF"
            opacity="0.25"
            stroke="#1E90FF"
            strokeWidth="1.5"
          />
          {/* Pulse line through heart */}
          <polyline
            points="6,14 9,14 11,10 13,18 15,12 17,14 22,14"
            stroke="#00C2FF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      className="bg-gradient-to-b from-black via-[#0a1628] to-black border-t border-[#1E90FF]/20 py-20 md:py-28 px-4"
      aria-label="The AthlynX Doctrine — Sovereignty Manifesto"
    >
      <div className="max-w-6xl mx-auto">
        {/*  Eyebrow  */}
        <div className="text-center mb-6">
          <span
            className="inline-block text-[11px] font-black uppercase tracking-[0.32em] text-[#1E90FF]"
            aria-label="Section label"
          >
            THE ATHLYNX DOCTRINE
          </span>
        </div>

        {/*  Main headline  */}
        <h2 className="text-center font-black tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
          The athlete leap{" "}
          <span className="text-[#00C2FF]">is here.</span>
        </h2>

        {/*  Sub-headline  */}
        <div className="text-center mb-8">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white/80 leading-snug">
            Sovereignty decides who leads it.
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1E90FF] leading-snug mt-1">
            Love decides who survives.
          </p>
        </div>

        {/*  Opening paragraph  */}
        <p className="max-w-3xl mx-auto text-center text-white/70 leading-relaxed text-base md:text-lg mb-14">
          Every full-stack AI thesis is converging on one truth: models are
          commoditizing, and sovereignty over the stack beneath them is what
          compounds. HUMAIN is building it for nations. AthlynX is building it
          for athletes — the one identity that travels with them from youth to
          pro to retirement.
        </p>

        {/*  Three-Pillar Grid  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="border border-[#1E90FF]/30 bg-black/40 rounded-xl p-6 hover:border-[#1E90FF] transition-all duration-200 flex flex-col gap-4"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/20">
                {pillar.icon}
              </div>

              {/* Title */}
              <div>
                <h3 className="font-black text-white tracking-tight text-base md:text-lg leading-tight mb-1">
                  {pillar.title}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E90FF]/80">
                  {pillar.subtitle}
                </p>
              </div>

              {/* Body */}
              <p className="text-sm text-white/65 leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/*  Closing manifesto line  */}
        <div className="text-center mb-12">
          <p className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            One identity. Every athlete. Every platform.
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-black text-white/70 tracking-tight leading-tight mt-1">
            Built for life. Built to be loved.
          </p>
        </div>

        {/*  CTAs  */}
        <div className="flex flex-wrap gap-3 justify-center mb-14">
          <a
            href="/investor-deck"
            className="inline-block rounded-xl bg-[#1E90FF] px-6 py-3 text-sm font-black text-white tracking-wide hover:bg-[#1a7ee0] transition-colors duration-200"
          >
            See the Roadmap
          </a>
          <a
            href="/founders"
            className="inline-block rounded-xl border border-[#1E90FF] px-6 py-3 text-sm font-black text-[#1E90FF] tracking-wide hover:bg-[#1E90FF]/10 transition-colors duration-200"
          >
            Meet the Founders
          </a>
          <a
            href="/signup"
            className="inline-block rounded-xl bg-[#00C2FF] px-6 py-3 text-sm font-black text-black tracking-wide hover:bg-[#00aee6] transition-colors duration-200"
          >
            Join the Movement
          </a>
        </div>

        {/*  Bottom signoff  */}
        <div className="text-center space-y-1.5">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest text-white/40"
            style={{ fontVariant: "small-caps" }}
          >
            Iron Sharpens Iron · Proverbs 27:17
          </p>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest text-white/35"
            style={{ fontVariant: "small-caps" }}
          >
            © 2026 AthlynX™ · AthlynXAI™ · XAI™ · AXN™ · AVN™ · AthlynXOS™ · A Dozier Holdings Group Company
          </p>
        </div>
      </div>
    </section>
  );
}
