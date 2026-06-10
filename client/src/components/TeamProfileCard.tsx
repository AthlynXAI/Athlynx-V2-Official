// TeamProfileCard — unified, brand-locked profile card for AthlynX team members.
// Brand: cobalt #1E90FF + true black + white. No gold/yellow/orange.
// Equal billing across all four people. Same crop, same fields, same length.

import { Link } from "wouter";
import LivePlayerStats from "./LivePlayerStats";

// Optional career stats block — used when the team member is also an athlete
// whose playing record matters.
// Source citations are kept inline so the card can render a sourced footnote.
export interface CareerStatLine {
  label: string;             // e.g. "2019 (Junior)"
  value: string;             // e.g. "11-2 · 2.53 ERA · 97 K in 89 IP"
  note?: string;             // optional context, e.g. "SEC Pitcher of the Week (x2)"
}

export interface CareerLevel {
  level: "High School" | "College" | "Pro" | "Summer / Other";
  team: string;              // e.g. "University of Georgia (SEC)"
  years: string;             // e.g. "2017–2019"
  summary: string;           // 1–2 sentence headline
  lines: CareerStatLine[];   // chronological stat lines
}

export interface CareerProfile {
  position: string;          // e.g. "RHP"
  bats: string;              // e.g. "R"
  throws: string;            // e.g. "R"
  height: string;            // e.g. "6'3\""
  weight: string;            // e.g. "239 lb"
  born: string;              // e.g. "July 29, 1998 · Columbus, GA"
  draft?: string;            // e.g. "2019 MLB Draft · Round 3 (96th overall) · St. Louis Cardinals"
  levels: CareerLevel[];
  sources?: { label: string; href: string }[]; // citation links
  /** Wire live MLB Stats API data underneath the static record. */
  live?: {
    mlbPlayerId: number;
    espnPlayerId?: number;
  };
}

/**
 * Optional partner attached to a player-partner's profile (spouse,
 * agent, business partner, manager, etc.). Schema is here so additional
 * partner entries can slot in without further code changes.
 */
export interface PartnerProfile {
  name: string;
  relationship: string;       // e.g. "Spouse", "Business Partner", "Agent"
  bio?: string;
  photo?: string;
  email?: string;
  location?: string;
  links?: { label: string; href: string }[];
}

export interface TeamProfile {
  slug: string;              // e.g. "chad-dozier"
  name: string;              // display name
  title: string;             // full title block
  tagline: string;           // one-line summary for cards
  bio: string;               // 95-130 word paragraph
  photo: string;             // public asset path
  athlynxEmail?: string;
  personalEmail?: string;
  location?: string;
  links?: { label: string; href: string }[];
  badge?: string;            // optional, e.g. "First Athlete Partner & Partner"
  isFounder?: boolean;       // true for Chad, Glenn, Lee — displays Founder badge
  // Locked access hierarchy. Per OWNERSHIP.md directive (2026-06-02):
  //   Master Admin = Chad A. Dozier Sr. only.
  //   Full Admin   = Lee Marshall, Glenn Tse only.
  //   Customer     = everyone else. Paying tier, no
  //                  admin powers, no platform overrides, normal billing.
  accessTier: "Master Admin" | "Full Admin" | "Customer";
  unlimitedCredits: boolean;  // true only for the three admins
  billingExempt: boolean;     // true only for the three admins; customers pay
  // Partnership tag — separate from admin tier. A person can be an athlete
  // partner (relationship) AND a customer (billing/access).
  partnerStatus: "Partner & Team Member" | "Athlete Partner" | "Customer";
  career?: CareerProfile;    // optional — present for player-partners only
  partners?: PartnerProfile[]; // optional — partners/family attached to this member
  /**
   * Suspension flag — when true, this member's email/login CTAs and any
   * inbound action surfaces are hidden across the app. Reinstatement is a
   * single boolean flip here (no JSX edits required at the call sites).
   * Optional so existing entries without the field stay TypeScript-valid.
   */
  accessSuspended?: boolean;
}

interface TeamProfileCardProps {
  profile: TeamProfile;
  size?: "default" | "large";
  showEmail?: boolean;
  showCareer?: boolean;      // render Player Profile block when career exists
}

export default function TeamProfileCard({
  profile,
  size = "default",
  showEmail = true,
  showCareer = true,
}: TeamProfileCardProps) {
  const isLarge = size === "large";
  const initials = profile.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <article
      className="group h-full border border-white/10 bg-black/60 rounded-xl overflow-hidden hover:border-[#1E90FF]/50 transition"
      data-testid={`card-team-${profile.slug}`}
    >
      {/* Photo block (3:4 portrait, cobalt-bordered placeholder if no asset) */}
      <div className="relative aspect-[3/4] bg-gradient-to-b from-[#0a1628] to-black ring-1 ring-[#1E90FF]/30">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={`${profile.name} portrait`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-black text-[#1E90FF]/30 tracking-tighter">
              {initials}
            </div>
          </div>
        )}
        {profile.badge && (
          // Bottom-left corner so it never overlays the subject's face
          <div className="absolute bottom-3 left-3 bg-[#1E90FF] text-white text-[10px] font-black uppercase tracking-[0.18em] px-2 py-1 rounded shadow-lg">
            {profile.badge}
          </div>
        )}
        {profile.isFounder && (
          <div className="absolute top-3 right-3 bg-black/85 border border-[#00C2FF] text-[#00C2FF] text-[10px] font-black uppercase tracking-[0.18em] px-2 py-1 rounded">
            Founder
          </div>
        )}
      </div>

      {/* Text block */}
      <div className={`p-5 ${isLarge ? "md:p-6" : ""}`}>
        {/* Section label — always present so the layout reads as a real profile */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            {profile.career ? "Athlete Partner · AthlynX Network" : "Team Profile"}
          </span>
          <span className="flex-1 h-px bg-[#1E90FF]/20"></span>
        </div>
        <h3 className={`font-black text-white tracking-tight ${isLarge ? "text-2xl" : "text-xl"} mb-1`}>
          {profile.name}
        </h3>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E90FF] leading-snug mb-3">
          {profile.title}
        </p>
        <p className={`text-white/75 leading-relaxed ${isLarge ? "text-sm" : "text-[13px]"} mb-4`}>
          {profile.bio}
        </p>

        <div className="border-t border-white/10 pt-3 space-y-1">
          <div className="flex items-baseline gap-2 text-[11px]">
            <span className="text-white/40 uppercase tracking-widest">Access</span>
            <span
              className={
                profile.accessTier === "Master Admin"
                  ? "text-[#1E90FF] font-bold uppercase tracking-widest text-[10px] bg-[#1E90FF]/10 px-1.5 py-0.5 rounded border border-[#1E90FF]/40"
                  : profile.accessTier === "Full Admin"
                  ? "text-[#88a8ff] font-bold uppercase tracking-widest text-[10px]"
                  : "text-white/60 font-bold uppercase tracking-widest text-[10px]"
              }
              data-testid={`tier-${profile.slug}`}
            >
              {profile.accessTier}
            </span>
          </div>
          {profile.unlimitedCredits && (
            <div className="flex items-baseline gap-2 text-[11px]">
              <span className="text-white/40 uppercase tracking-widest">Credits</span>
              <span
                className="text-[#1E90FF] font-bold uppercase tracking-widest text-[10px]"
                data-testid={`credits-${profile.slug}`}
              >
                Unlimited
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-2 text-[11px]">
            <span className="text-white/40 uppercase tracking-widest">Status</span>
            <span
              className="text-[#88a8ff] font-bold uppercase tracking-widest text-[10px]"
              data-testid={`status-${profile.slug}`}
            >
              {profile.partnerStatus}
            </span>
          </div>
          {showEmail && profile.athlynxEmail && !profile.accessSuspended && (
            <div className="flex items-baseline gap-2 text-[11px]">
              <span className="text-white/40 uppercase tracking-widest">Email</span>
              <a
                href={`mailto:${profile.athlynxEmail}`}
                className="text-[#88a8ff] hover:text-white truncate"
                data-testid={`link-email-${profile.slug}`}
              >
                {profile.athlynxEmail}
              </a>
            </div>
          )}
          {/* Suspended members render identically to active members — just
              without the email row. No public chip or badge is shown so the
              hold remains invisible to the person being evaluated and to
              anyone they might show the site to. */}
          {profile.location && (
            <div className="flex items-baseline gap-2 text-[11px]">
              <span className="text-white/40 uppercase tracking-widest">Based</span>
              <span className="text-white/70">{profile.location}</span>
            </div>
          )}
          {profile.links && profile.links.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {profile.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-widest text-white/50 hover:text-[#1E90FF]"
                  data-testid={`link-${profile.slug}-${l.label.toLowerCase()}`}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Athlete Profile — only rendered when career data exists.
            Section is explicitly labeled so it reads as a distinct profile,
            paired with the Business Profile block above. */}
        {showCareer && profile.career && (
          <div
            className="mt-5 pt-5 border-t-2 border-[#1E90FF]/40"
            data-testid={`career-${profile.slug}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-[#1E90FF] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.22em] text-white">
                Athlete Profile · Player
              </span>
              <span className="flex-1 h-px bg-[#1E90FF]/30"></span>
            </div>

            {/* Vitals row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { l: "Pos", v: profile.career.position },
                { l: "B / T", v: `${profile.career.bats} / ${profile.career.throws}` },
                { l: "Ht / Wt", v: `${profile.career.height} / ${profile.career.weight}` },
              ].map((c) => (
                <div key={c.l} className="bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded px-2 py-1.5">
                  <div className="text-[9px] uppercase tracking-widest text-white/40">{c.l}</div>
                  <div className="text-[12px] font-bold text-white">{c.v}</div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-white/60 mb-3">
              <span className="text-white/40 uppercase tracking-widest mr-1">Born</span>
              {profile.career.born}
              {profile.career.draft && (
                <div className="mt-1">
                  <span className="text-white/40 uppercase tracking-widest mr-1">Draft</span>
                  {profile.career.draft}
                </div>
              )}
            </div>

            {/* Levels — HS → College → Pro */}
            <div className="space-y-3">
              {profile.career.levels.map((lvl, i) => (
                <div key={i} className="bg-black/40 border border-white/10 rounded-lg p-3">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#1E90FF]">
                      {lvl.level}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{lvl.years}</span>
                  </div>
                  <div className="text-[13px] font-bold text-white mb-1">{lvl.team}</div>
                  <p className="text-[11.5px] text-white/65 leading-relaxed mb-2">{lvl.summary}</p>
                  {lvl.lines.length > 0 && (
                    <ul className="space-y-1">
                      {lvl.lines.map((line, j) => (
                        <li key={j} className="text-[11px] text-white/75">
                          <span className="text-[#88a8ff] font-bold">{line.label}:</span>{" "}
                          {line.value}
                          {line.note && (
                            <span className="text-white/45 italic"> — {line.note}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {profile.career.sources && profile.career.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Sources</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {profile.career.sources.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-white/50 hover:text-[#1E90FF] underline-offset-2 hover:underline"
                    >
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* LIVE STATS — hydrates from MLB Stats API at render */}
            {profile.career.live && (
              <LivePlayerStats
                mlbPlayerId={profile.career.live.mlbPlayerId}
                espnPlayerId={profile.career.live.espnPlayerId}
                displayName={profile.name}
                slug={profile.slug}
              />
            )}
          </div>
        )}

        {/* PARTNERS — spouse, agent, business partner, etc. */}
        {profile.partners && profile.partners.length > 0 && (
          <div
            className="mt-4 pt-4 border-t border-[#1E90FF]/30"
            data-testid={`partners-${profile.slug}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
                Partners
              </span>
              <span className="flex-1 h-px bg-[#1E90FF]/20"></span>
            </div>
            <div className="space-y-3">
              {profile.partners.map((p, i) => (
                <div key={`${p.name}-${i}`} className="flex gap-3 rounded-lg border border-white/10 bg-black/40 p-3">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={`${p.name} portrait`}
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover ring-1 ring-[#1E90FF]/30"
                    />
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#1E90FF]/10 text-sm font-black text-[#1E90FF] ring-1 ring-[#1E90FF]/30">
                      {p.name.split(/\s+/).map((x) => x[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-bold text-white">{p.name}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#88a8ff]">
                        {p.relationship}
                      </span>
                    </div>
                    {p.bio && (
                      <p className="mt-1 text-[11.5px] leading-relaxed text-white/65">{p.bio}</p>
                    )}
                    {(p.email || p.location || (p.links && p.links.length > 0)) && (
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[10px]">
                        {p.email && (
                          <a
                            href={`mailto:${p.email}`}
                            className="text-white/55 hover:text-[#1E90FF]"
                          >
                            {p.email}
                          </a>
                        )}
                        {p.location && <span className="text-white/45">{p.location}</span>}
                        {p.links?.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/55 hover:text-[#1E90FF]"
                          >
                            {l.label} ↗
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical team roster — the source of truth.
// Used by /team page AND by the homepage 3-up + Athlete Partner band.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Single source of truth for suspension state. Accepts a slug OR a display
 * name so call sites that store team members in ad-hoc local arrays (with
 * different shapes) can still gate against the canonical roster without
 * needing to import ATHLYNX_TEAM directly.
 */
export function isSuspended(slugOrName: string): boolean {
  const needle = slugOrName.trim().toLowerCase();
  return ATHLYNX_TEAM.some(
    (p) =>
      p.accessSuspended === true &&
      (p.slug.toLowerCase() === needle || p.name.toLowerCase() === needle),
  );
}

export const ATHLYNX_TEAM: TeamProfile[] = [
  {
    slug: "chad-dozier",
    name: "Chad A. Dozier Sr.",
    title: "Founder · CEO · Chairman",
    tagline: "Founder · Builder of the Complete Athlete Lane",
    bio:
      "Chad A. Dozier Sr. is the Founder, CEO, and Chairman of AthlynX and Dozier Holdings Group. A lifelong builder and athlete, Chad founded AthlynX to give every athlete — youth through pro, men and women, every sport — one identity that travels with them for life. He hosts The Athlete's Playbook Podcast and leads platform strategy, brand direction, and partner development across the AthlynX ecosystem. Chad started the AthlynX journey in Orange Beach, Alabama in 2022, then Madison, Mississippi, then back home to Laurel, Mississippi, then to Houston, Texas — and now operates from all of the above. AthlynX is headquartered in Houston, with deep ties to the SEC and the youth-baseball community his father coached for decades. His operating principle: One identity. Every athlete. Every platform.",
    isFounder: true,
    photo: "/team/chad-dozier.jpg",
    athlynxEmail: "cdozier14@athlynx.ai",
    personalEmail: "chaddozier75@gmail.com",
    location: "Houston, TX · HQ · Laurel, MS",
    badge: "Master Admin",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/chad-a-dozier-494391136" },
      { label: "Calendly", href: "https://calendly.com/cdozier14" },
      { label: "AthlynX", href: "https://athlynx.ai" },
      { label: "Dozier Holdings", href: "https://dozierholdingsgroup.com" },
      { label: "NIL Portal", href: "https://nilportal.ai" },
      { label: "The Athlete's Playbook · YouTube", href: "https://www.youtube.com/@AthlynXChad" },
    ],
    accessTier: "Master Admin",
    unlimitedCredits: true,
    billingExempt: true,
    partnerStatus: "Partner & Team Member",
  },
  {
    slug: "lee-marshall",
    name: "Leronious (Lee) Marshall Jr.",
    title: "Co-Founder · V.P. Sales, Marketing & Partnerships · Co-Host",
    tagline: "Co-Founder · V.P. Sales · Co-Host, The Athlete's Playbook",
    isFounder: true,
    bio:
      "Leronious (Lee) Marshall Jr. is a visionary leader at the forefront of the sports technology revolution. His journey is a testament to the power of professional reinvention. After a career-altering ACL injury in high school, Lee realized during his first year of college that his football days were behind him. Pivoting with purpose, he was recruited by the Jackson State University Tumbling and Cheer Squad, marking the beginning of a legendary 30-year engagement in the sport. From elite competitor and athlete to coach, producer, and marketer, Lee has captured numerous state and national recognitions, cementing his legacy in the world of competitive cheer. Today, as the V.P. of Sales, Marketing, and Partnerships for Athlynx.ai, Lee leverages this deep industry expertise to bridge the gap between athletic talent and modern technology. He is a specialist in creating cutting-edge digital marketing content for firms including Dozier Holdings Group and Athlynx.ai. Beyond his executive duties, he serves as the Co-Host of The Athlete's Playbook sharing insights on the evolving landscape of sports and NIL. At 50, Lee is taking a leap of faith to serve athletes and families on a global platform, ensuring that mentorship remains at the heart of every digital innovation.",
    photo: "/team/lee-marshall.jpg",
    athlynxEmail: "lmarshall@athlynx.ai",
    personalEmail: "leronious@gmail.com",
    location: "Jackson, Mississippi",
    badge: "V.P. Sales & Partnerships",
    links: [
      { label: "LinkedIn (search)", href: "https://www.linkedin.com/search/results/people/?keywords=Leronious%20Marshall%20Jackson%20State" },
      { label: "The Athlete's Playbook", href: "https://athlynx.ai" },
    ],
    accessTier: "Full Admin",
    unlimitedCredits: true,
    billingExempt: true,
    partnerStatus: "Partner & Team Member",
  },
  {
    slug: "glenn-tse",
    name: "Glenn M. Tse",
    title: "Co-Founder · CFO · COO",
    tagline: "Co-Founder · CFO · COO · Operator",
    isFounder: true,
    bio:
      "Glenn M. Tse serves as Chief Financial Officer and Chief Operating Officer of AthlynX. A seasoned operator with deep finance and operations expertise, Glenn is responsible for AthlynX's financial discipline, operational rigor, and the scaling infrastructure that lets a platform built for every athlete actually serve every athlete reliably. He partners with the Founder & CEO on capital strategy, vendor partnerships, and the day-to-day systems that turn a fast-moving startup into a durable institution. Glenn brings the operator's mindset that distinguishes companies that ship from companies that promise.",
    photo: "/team/glenn-tse.jpg",
    athlynxEmail: "gtse@dozierholdingsgroup.com",
    personalEmail: "glenn.tse@gmail.com",
    location: "Hong Kong · Global Operations",
    badge: "CFO / COO",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/glenn-tse-42b71719" },
      { label: "Kson Optics USA", href: "https://www.ksonusa.com" },
      { label: "Dozier Holdings", href: "https://dozierholdingsgroup.com" },
      { label: "AthlynX", href: "https://athlynx.ai" },
    ],
    accessTier: "Full Admin",
    unlimitedCredits: true,
    billingExempt: true,
    partnerStatus: "Partner & Team Member",
  },
  {
    // DEMO ATHLETE — placeholder for platform demos and investor shows.
    // Original athlete profile is archived in /vault/suspended_accounts/
    slug: "marcus-johnson",
    name: "Marcus Johnson",
    title: "Wide Receiver · Demo Athlete",
    tagline: "Platform Demo · Showing Athletes How It Works",
    bio:
      "Marcus Johnson is AthlynX's demo athlete profile — built to show every athlete, coach, and recruiter exactly how the platform works from day one. Marcus walks new users through setting up their profile, activating NIL opportunities, connecting with coaches, and using the AI tools that power the AthlynX OS. His profile demonstrates the full athlete journey — from setup to first NIL deal — in under 10 minutes.",
    photo: "/team/demo-athlete.jpg",
    athlynxEmail: "demo@athlynx.ai",
    personalEmail: "",
    location: "Houston, TX",
    badge: "Demo Athlete",
    links: [],
    accessTier: "Customer",
    unlimitedCredits: false,
    billingExempt: false,
    partnerStatus: "Athlete Partner",
    accessSuspended: false,
    career: {
      position: "WR",
      bats: "",
      throws: "R",
      height: "6'1\"",
      weight: "195 lb",
      born: "January 15, 2001 · Houston, TX",
      draft: "Undrafted Free Agent · 2023",
      levels: [
        {
          level: "High School",
          team: "Westfield High School · Houston, TX",
          years: "2016–2019",
          summary: "Three-star recruit. 68 receptions, 1,240 yards, 14 TDs senior season. District MVP.",
          lines: [
            { label: "2019 Sr.", value: "68 rec · 1,240 yds · 14 TD", note: "District MVP" },
          ],
        },
        {
          level: "College",
          team: "Prairie View A&M Panthers (SWAC)",
          years: "2019–2022",
          summary: "Four-year starter. 187 career receptions, 2,840 yards, 28 TDs. SWAC All-Conference 2021 & 2022.",
          lines: [
            { label: "2021 Jr.", value: "54 rec · 890 yds · 9 TD", note: "SWAC All-Conference" },
            { label: "2022 Sr.", value: "61 rec · 1,020 yds · 11 TD", note: "SWAC All-Conference" },
            { label: "Career", value: "187 rec · 2,840 yds · 28 TD" },
          ],
        },
      ],
      sources: [],
      live: undefined,
    },
    partners: [],
  },
];
