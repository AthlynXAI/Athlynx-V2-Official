// TeamProfileCard — unified, brand-locked profile card for AthlynX team members.
// Brand: cobalt #1E90FF + true black + white. No gold/yellow/orange.
// Equal billing across all four people. Same crop, same fields, same length.

import { Link } from "wouter";
import LivePlayerStats from "./LivePlayerStats";

// Optional career stats block — used when the team member is also an athlete
// whose playing record matters (e.g. our First Athlete Partner Tony Locey).
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
  accessTier: "Master Admin" | "Full Admin";  // locked access hierarchy
  unlimitedCredits: boolean;  // platform-feature credits never throttled
  billingExempt: boolean;     // never charged for anything — Master Admin covers all
  partnerStatus: "Partner & Team Member";  // every roster entry is both — locked
  career?: CareerProfile;    // optional — present for player-partners only
  partners?: PartnerProfile[]; // optional — partners/family attached to this member
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
          <div className="absolute top-3 left-3 bg-[#1E90FF] text-white text-[10px] font-black uppercase tracking-[0.18em] px-2 py-1 rounded">
            {profile.badge}
          </div>
        )}
      </div>

      {/* Text block */}
      <div className={`p-5 ${isLarge ? "md:p-6" : ""}`}>
        {/* Section label — always present so the layout reads as a real profile */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            {profile.career ? "Business Profile · Partner" : "Team Profile"}
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
                  : "text-[#88a8ff] font-bold uppercase tracking-widest text-[10px]"
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
          {showEmail && profile.athlynxEmail && (
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
export const ATHLYNX_TEAM: TeamProfile[] = [
  {
    slug: "chad-dozier",
    name: "Chad A. Dozier Sr.",
    title: "Founder · CEO · Chairman",
    tagline: "Founder · Builder of the Complete Athlete Lane",
    bio:
      "Chad A. Dozier Sr. is the Founder, CEO, and Chairman of AthlynX and Dozier Holdings Group. A lifelong builder and athlete, Chad founded AthlynX to give every athlete — youth through pro, men and women, every sport — one identity that travels with them for life. He hosts The Athlete's Playbook Podcast and leads platform strategy, brand direction, and partner development across the AthlynX ecosystem. Chad started the AthlynX journey in Orange Beach, Alabama in 2022, then Madison, Mississippi, then back home to Laurel, Mississippi, then to Houston, Texas — and now operates from all of the above. AthlynX is headquartered in Houston, with deep ties to the SEC and the youth-baseball community his father coached for decades. His operating principle: One identity. Every athlete. Every platform.",
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
    title: "V.P. of Sales, Marketing & Partnerships · Co-Host, The Athlete's Playbook Podcast",
    tagline: "V.P. Sales · Co-Host, The Athlete's Playbook · Business Partner",
    bio:
      "Leronious (Lee) Marshall Jr. is a visionary leader at the forefront of the sports technology revolution. His journey is a testament to the power of professional reinvention. After a career-altering ACL injury in high school, Lee realized during his first year of college that his football days were behind him. Pivoting with purpose, he was recruited by the Jackson State University Tumbling and Cheer Squad, marking the beginning of a legendary 30-year engagement in the sport. From elite competitor and athlete to coach, producer, and marketer, Lee has captured numerous state and national recognitions, cementing his legacy in the world of competitive cheer. Today, as the V.P. of Sales, Marketing, and Partnerships for Athlynx.ai, Lee leverages this deep industry expertise to bridge the gap between athletic talent and modern technology. He is a specialist in creating cutting-edge digital marketing content for firms including Dozier Holdings Group and Athlynx.ai. Beyond his executive duties, he serves as the Co-Host of The Athlete's Playbook Podcast, sharing insights on the evolving landscape of sports and NIL. At 50, Lee is taking a leap of faith to serve athletes and families on a global platform, ensuring that mentorship remains at the heart of every digital innovation.",
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
    title: "Chief Financial Officer & Chief Operating Officer",
    tagline: "CFO · COO · Operator",
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
    slug: "tony-locey",
    name: "Tony Locey",
    title: "First Athlete Partner & Partner · True Athlete",
    tagline: "Athlete Partner · Network Builder",
    bio:
      "Tony Locey is AthlynX's First Athlete Partner & Partner — our first true athlete on the team. A former professional baseball pitcher and University of Georgia alumnus, Tony brings the perspective every athlete-facing platform needs: someone who has stood on the mound, navigated the recruiting and pro pipelines firsthand, and built a network across SEC baseball and Georgia youth sports. As Partner, Tony serves as a tester, advisor, and network connector — helping AthlynX pressure-test the platform against the realities athletes and families actually face. He represents the athlete voice that turns a product roadmap into a movement.",
    photo: "/team/tony-locey.jpg",
    athlynxEmail: "tlockey24@athlynx.ai",
    personalEmail: "tony@nexphase.us",
    location: "Houston County, Georgia · 706-304-8669",
    badge: "First True Athlete",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tony-locey-55a3803b3" },
      { label: "NexPhase (Managing Partner)", href: "https://nexphase.us" },
      { label: "TL Sod Company (Owner)", href: "https://tlsodcompany.com" },
      { label: "MLB.com", href: "https://www.mlb.com/player/tony-locey-666138" },
      { label: "MiLB.com", href: "https://www.milb.com/player/tony-locey-666138" },
      { label: "ESPN", href: "https://www.espn.com/mlb/player/_/id/4081257/tony-locey" },
      { label: "Georgia Bulldogs", href: "https://georgiadogs.com/sports/baseball/roster/tony-locey/3530" },
      { label: "Baseball America", href: "https://www.baseballamerica.com/players/8401-tony-locey/" },
      { label: "Wikipedia", href: "https://en.wikipedia.org/wiki/Tony_Locey" },
    ],
    accessTier: "Full Admin",
    unlimitedCredits: true,
    billingExempt: true,
    partnerStatus: "Partner & Team Member",
    career: {
      position: "RHP",
      bats: "R",
      throws: "R",
      height: "6'3\"",
      weight: "239 lb",
      born: "July 29, 1998 · Columbus, GA",
      draft: "2019 MLB Draft · Round 3 (96th overall) · St. Louis Cardinals · $604,800 signing bonus",
      levels: [
        {
          level: "High School",
          team: "Houston County High School · Warner Robins, GA",
          years: "2013–2016",
          summary:
            "Georgia's top-rated high school pitcher in 2016. Won a Georgia state title in 2016 as a teammate of Orioles LHP D.L. Hall and Buffalo Bills QB Jake Fromm.",
          lines: [
            { label: "2016 Sr.", value: "Georgia's #1 high school pitcher (class of 2016)", note: "State champion" },
            { label: "HS Teammates", value: "D.L. Hall (MLB LHP) · Jake Fromm (NFL QB)" },
          ],
        },
        {
          level: "Summer / Other",
          team: "Brewster Whitecaps · Cape Cod Baseball League",
          years: "2017",
          summary: "Played a summer in the Cape — the nation's premier wood-bat collegiate league — between his freshman and sophomore years at Georgia.",
          lines: [
            { label: "2017 Cape Cod", value: "Brewster Whitecaps rotation" },
          ],
        },
        {
          level: "College",
          team: "University of Georgia Bulldogs (SEC)",
          years: "2017–2019",
          summary:
            "Three years in the Bulldog rotation. Career: 20–8, 3.92 ERA in 59 appearances (28 starts), 194 K in 186 IP. 2019 Friday-night ace.",
          lines: [
            {
              label: "2017 Fr.",
              value: "2–4 · 6.38 ERA · 37 K in 42.1 IP · 16 G (8 GS)",
              note: "First career win — 7-0 combined shutout at Georgia Southern",
            },
            {
              label: "2018 So.",
              value: "7–2 · 4.28 ERA · 60 K in 54.2 IP · 27 G (5 GS) · .220 opp avg",
              note: "Wins over South Carolina, at Alabama, and #15 Vanderbilt",
            },
            {
              label: "2019 Jr.",
              value: "11–2 · 2.53 ERA · 97 K in 89 IP · 15 GS · .168 opp avg",
              note: "SEC Pitcher of the Week (x2) · NPOY semifinalist · first Bulldog to 11 wins since 1990",
            },
            {
              label: "UGA Career",
              value: "20–8 · 3.92 ERA · 194 K · 106 BB · 186 IP · 59 G (28 GS)",
            },
          ],
        },
        {
          level: "Pro",
          team: "Cardinals / Rockies / Rays organizations (MiLB)",
          years: "2019–2023",
          summary:
            "Drafted in the 3rd round by St. Louis in 2019. Traded to Colorado in the Nolan Arenado deal (Feb 2021). Traded to Tampa Bay in 2023. Career: 13–8, 5.09 ERA, 221 K in 203.1 IP across 79 games.",
          lines: [
            {
              label: "2019 Pro Debut",
              value: "GCL Cardinals → Low-A Peoria · 1–2 · 5.29 ERA · 31 K in 17 IP",
              note: "28 K in 15 IP at Peoria",
            },
            { label: "2020", value: "No games — MiLB season cancelled (COVID-19)" },
            {
              label: "2021",
              value: "Low-A Fresno Grizzlies · 3–0 · 3.34 ERA · 80 K in 64.2 IP · 25 G (10 GS)",
              note: "Acquired in Feb 1, 2021 Nolan Arenado trade to Colorado",
            },
            {
              label: "2022",
              value: "High-A Spokane / Double-A Hartford · 6.22 ERA in 102.2 IP",
            },
            {
              label: "2023",
              value: "High-A Bowling Green Hot Rods · 4.74 ERA · 17 K in 19 IP · 16 G",
              note: "Traded to Tampa Bay (Mar 28, 2023) · Released (Aug 7, 2023)",
            },
            {
              label: "MiLB Career",
              value: "13–8 · 5.09 ERA · 221 K · 1.59 WHIP · 203.1 IP · 79 G (30 GS · 1 SV)",
            },
          ],
        },
      ],
      sources: [
        { label: "Georgia Athletics", href: "https://georgiadogs.com/sports/baseball/roster/tony-locey/3530" },
        { label: "MiLB.com", href: "https://www.milb.com/player/tony-locey-666138" },
        { label: "Baseball America", href: "https://www.baseballamerica.com/players/8401-tony-locey/" },
        { label: "Wikipedia", href: "https://en.wikipedia.org/wiki/Tony_Locey" },
        { label: "SicEmDawgs (2019 MLB Draft)", href: "https://sicemdawgs.com/2019/06/eight-bulldogs-selected-in-2019-mlb-draft/" },
      ],
      // LIVE: hydrate from MLB Stats API at render so the record stays authoritative.
      live: {
        mlbPlayerId: 666138,    // Anthony Quinn Locey
        espnPlayerId: 4081257,  // ESPN player id
      },
    },
    // Partners attached to Tony's profile — add entries here as we get names.
    // Schema is wired; UI auto-renders the block when at least one partner exists.
    partners: [],
  },
];
