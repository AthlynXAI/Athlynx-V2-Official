/**
 * AthletePartnerProfile
 * ---------------------------------------------------------------------------
 * Maven-grade athlete profile card for AthlynX partners.
 *
 * Layout:
 *   [ HERO        ]  Full-bleed photo with dark gradient bottom.
 *   [             ]  Big bold name, sub-line (position · team · status).
 *   [             ]  Tiny "FIRST ATHLETE PARTNER" badge ABOVE photo card,
 *                    never overlapping the face.
 *
 *   [ AT A GLANCE ]  4 stat tiles: Draft / Bonus / College ERA / Pro K
 *
 *   [ TABS         ]  HIGH SCHOOL · COLLEGE · PRO · TIMELINE
 *
 *   [ TAB BODY     ]  Year-by-year table + season highlights + awards
 *
 * No LinkedIn styling, no third-party-platform chrome — pure AthlynX brand.
 *
 * Brand: cobalt #1E90FF · cyan #00C2FF · true black · white.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

// ─── Data shapes ───────────────────────────────────────────────────────────

export interface PitchingLine {
  /** Year (e.g., "2019" or "2018-19") */
  season: string;
  /** Age during the season (optional) */
  age?: number;
  /** Team(s) */
  team: string;
  /** Level: HS · Cape · Freshman · Sophomore · Junior · A · A+ · AA · AAA · MLB · Rookie · GCL */
  level: string;
  /** Wins-Losses */
  wl?: string;
  /** Earned run average */
  era?: string;
  /** Appearances / games */
  g?: string;
  /** Games started */
  gs?: string;
  /** Innings pitched */
  ip?: string;
  /** Hits */
  h?: string;
  /** Walks */
  bb?: string;
  /** Strikeouts */
  so?: string;
  /** WHIP */
  whip?: string;
  /** Opponent batting average against */
  baa?: string;
  /** Saves */
  sv?: string;
  /** Note / highlight */
  note?: string;
}

export interface CareerSection {
  /** "HIGH SCHOOL" / "CAPE COD" / "COLLEGE" / "PROFESSIONAL" */
  label: string;
  /** Brief subtitle, e.g. "Houston County HS · Warner Robins, GA · 2013–2016" */
  subtitle: string;
  /** Year-by-year stat rows */
  rows: PitchingLine[];
  /** Highlights / awards / notes (bullet list) */
  highlights?: string[];
  /** Career line summary row (optional, displayed as 'CAREER' footer) */
  careerLine?: PitchingLine;
}

export interface TransactionEntry {
  date: string; // "Feb 1, 2021"
  description: string;
}

export interface AthletePartnerData {
  slug: string;
  /** Display name */
  name: string;
  /** Short position + handedness (RHP · R/R) */
  positionLine: string;
  /** Sub-line: HT · WT · BORN · HOMETOWN */
  bioLine: string;
  /** Free-floating headline that sits below name on hero (one sentence). */
  tagline: string;
  /** Hero photo (action shot, landscape preferred) */
  heroPhoto: string;
  /** Card photo (3:4 portrait, used for /team grid + thumbnail) */
  cardPhoto: string;
  /** Optional gallery (extra photos beyond hero) */
  gallery?: { src: string; caption?: string }[];
  /** Partner status — shows in hero kicker */
  partnerKicker: string; // "FIRST ATHLETE PARTNER · ATHLYNX NETWORK"
  /** 4 quick-glance tiles */
  atAGlance: { label: string; value: string }[];
  /** Career stat sections ordered HS → Cape → College → Pro */
  career: CareerSection[];
  /** Transactions timeline (pro only) */
  transactions?: TransactionEntry[];
  /** Sources / data attribution */
  sources?: { label: string; href: string }[];
}

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  athlete: AthletePartnerData;
}

export default function AthletePartnerProfile({ athlete }: Props) {
  const sectionLabels = useMemo(
    () => athlete.career.map((s) => s.label),
    [athlete.career]
  );
  const [activeTab, setActiveTab] = useState<string>(sectionLabels[0] ?? "");
  useEffect(() => {
    document.title = `${athlete.name} — Partner · AthlynX`;
  }, [athlete.name]);

  const activeSection =
    athlete.career.find((s) => s.label === activeTab) ?? athlete.career[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-5 py-6 md:py-10">
        {/* ── Brand strip ── */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/team" className="group flex items-center gap-3" data-testid="link-back-team">
              <img
                src="/athlynx-icon-neon.jpg"
                alt="AthlynX"
                className="h-9 w-9 rounded-lg ring-1 ring-[#1E90FF]/40 transition group-hover:ring-[#1E90FF]"
              />
              <div className="leading-tight">
                <div className="text-sm font-black tracking-widest text-white">
                  AthlynX<span className="text-[#1E90FF]">XAI</span>
                </div>
                <div className="text-[9px] uppercase tracking-[0.22em] text-[#1E90FF]">
                  The Athlete's Playbook
                </div>
              </div>
            </Link>
          <div className="hidden md:block text-[10px] uppercase tracking-widest text-white/35">
            athlynx.ai/partner/{athlete.slug}
          </div>
        </div>

        {/* ── Kicker (above hero so it never sits on top of the photo) ── */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-block bg-[#00C2FF] text-black text-[10px] font-black uppercase tracking-[0.22em] px-2.5 py-1 rounded">
            {athlete.partnerKicker.split(" · ")[0] || "First Athlete Partner"}
          </span>
          {athlete.partnerKicker.includes("·") && (
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">
              {athlete.partnerKicker.split(" · ").slice(1).join(" · ")}
            </span>
          )}
        </div>

        {/* ── HERO CARD (full-bleed photo + gradient + name overlay) ── */}
        <section
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628]"
          data-testid="hero-card"
        >
          {/* Photo */}
          <div className="relative aspect-[4/5] md:aspect-[16/9] w-full">
            <img
              src={athlete.heroPhoto}
              alt={`${athlete.name} — action photo`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="eager"
            />
            {/* Gradient overlay — strong at bottom for text legibility, light at top */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
          </div>

          {/* Name overlay — sits at bottom-left, never crosses the face */}
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
            <h1
              className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95] text-white drop-shadow"
              data-testid="hero-name"
            >
              {athlete.name}
            </h1>
            <p className="mt-2 text-sm md:text-base font-bold uppercase tracking-[0.15em] text-[#00C2FF]">
              {athlete.positionLine}
            </p>
            <p className="mt-1 text-xs md:text-sm text-white/75">
              {athlete.bioLine}
            </p>
          </div>
        </section>

        {/* ── Tagline ── */}
        <p className="mt-5 text-base md:text-lg text-white/85 leading-snug max-w-3xl">
          {athlete.tagline}
        </p>

        {/* ── AT A GLANCE ── */}
        <div
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
          data-testid="at-a-glance"
        >
          {athlete.atAGlance.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-[#0a1628]/80 px-4 py-3"
            >
              <div className="text-[9px] font-black uppercase tracking-[0.18em] text-[#00C2FF]">
                {s.label}
              </div>
              <div className="mt-1 text-xl md:text-2xl font-black text-white">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div
          className="mt-10 flex flex-wrap gap-1 border-b border-white/10"
          role="tablist"
        >
          {sectionLabels.map((label) => {
            const active = label === activeTab;
            return (
              <button
                key={label}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(label)}
                data-testid={`tab-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={[
                  "px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition",
                  active
                    ? "text-white border-b-2 border-[#1E90FF]"
                    : "text-white/45 hover:text-white/80 border-b-2 border-transparent",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── TAB BODY ── */}
        <div className="mt-6">
          {activeSection && (
            <>
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 mb-3">
                {activeSection.subtitle}
              </div>

              {/* Year-by-year table */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-white/5">
                    <tr className="text-[10px] font-black uppercase tracking-[0.16em] text-[#00C2FF]">
                      <th className="px-3 py-2 text-left">Season</th>
                      <th className="px-3 py-2 text-left">Team / Level</th>
                      <th className="px-3 py-2 text-right">W-L</th>
                      <th className="px-3 py-2 text-right">ERA</th>
                      <th className="px-3 py-2 text-right">G</th>
                      <th className="px-3 py-2 text-right">GS</th>
                      <th className="px-3 py-2 text-right">IP</th>
                      <th className="px-3 py-2 text-right">SO</th>
                      <th className="px-3 py-2 text-right">BB</th>
                      <th className="px-3 py-2 text-right">WHIP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSection.rows.map((r, i) => (
                      <tr
                        key={i}
                        className="border-t border-white/5 text-white/90"
                      >
                        <td className="px-3 py-2 font-bold whitespace-nowrap">
                          {r.season}
                          {r.age ? (
                            <span className="ml-1 text-[10px] text-white/40">
                              ({r.age})
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-semibold">{r.team}</div>
                          <div className="text-[10px] uppercase tracking-widest text-white/45">
                            {r.level}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.wl ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.era ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.g ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.gs ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.ip ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.so ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.bb ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {r.whip ?? "—"}
                        </td>
                      </tr>
                    ))}
                    {activeSection.careerLine && (
                      <tr className="border-t-2 border-[#1E90FF]/60 bg-[#1E90FF]/10 text-white">
                        <td className="px-3 py-2 font-black uppercase tracking-widest text-[10px] text-[#00C2FF]">
                          Career
                        </td>
                        <td className="px-3 py-2 text-[11px] text-white/80">
                          {activeSection.careerLine.team}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.wl ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.era ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.g ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.gs ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.ip ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.so ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.bb ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-black tabular-nums">
                          {activeSection.careerLine.whip ?? "—"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Highlights */}
              {activeSection.highlights && activeSection.highlights.length > 0 && (
                <div className="mt-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00C2FF] mb-2">
                    Highlights & Awards
                  </div>
                  <ul className="space-y-2 text-sm text-white/85">
                    {activeSection.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#1E90FF] font-black">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── TRANSACTIONS TIMELINE ── */}
        {athlete.transactions && athlete.transactions.length > 0 && (
          <section className="mt-10" data-testid="transactions">
            <h2 className="text-xs font-black uppercase tracking-[0.22em] text-[#00C2FF] mb-3">
              Professional Transactions
            </h2>
            <ol className="relative border-l border-white/10 pl-5 space-y-3">
              {athlete.transactions.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-2 w-2 rounded-full bg-[#1E90FF] ring-2 ring-black" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/55">
                    {t.date}
                  </div>
                  <div className="text-sm text-white/90 mt-0.5">
                    {t.description}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── GALLERY ── */}
        {athlete.gallery && athlete.gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xs font-black uppercase tracking-[0.22em] text-[#00C2FF] mb-3">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {athlete.gallery.map((g, i) => (
                <figure
                  key={i}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#0a1628]"
                >
                  <img
                    src={g.src}
                    alt={g.caption || `${athlete.name} photo ${i + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                  {g.caption && (
                    <figcaption className="px-3 py-2 text-[10px] uppercase tracking-widest text-white/55">
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── SOURCES ── */}
        {athlete.sources && athlete.sources.length > 0 && (
          <section className="mt-10 border-t border-white/10 pt-5">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45 mb-2">
              Data Sources
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/65">
              {athlete.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-[#1E90FF] underline-offset-2 hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── FOOTER NAV ── */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <Link href="/team" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55 hover:text-[#1E90FF]">
              ← Back to Full Team
            </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/35">
            ONE IDENTITY · EVERY ATHLETE · EVERY PLATFORM
          </div>
        </div>
      </div>
    </div>
  );
}
