/**
 * AthlynxPortalBoard
 * ---------------------------------------------------------------------------
 * The AthlynX Transfer Portal board. AthlynX-native, no third-party
 * services named or linked. Replaces the previous NotableTransfersBoard.
 *
 * What this is, in one line:
 *   The place where college athletes ENTER the transfer portal on AthlynX,
 *   not where they get listed afterward.
 *
 * Three sources of entries (each gets its own chip on the row):
 *   ATHLYNX VERIFIED  — athlete entered the portal directly via athlynx.ai
 *   SCHOOL ANNOUNCED  — athlete's school athletic department announced
 *   ATHLETE ANNOUNCED — athlete announced the move on their own public channel
 *
 * Two CTAs:
 *   "Enter the Portal via AthlynX"  — kicks off the native entry flow
 *   "Claim This Profile"            — on every non-AthlynX row, lets the
 *                                     athlete convert it to a verified entry
 *
 * Footer is one line: "Powered by AthlynX · No third-party services" — full
 * stop. We do not link to, name, or pay competitors here.
 */

import { useEffect, useMemo, useState } from "react";

// ─── Shapes ────────────────────────────────────────────────────────────────

interface SportSummary {
  slug: string;
  label: string;
  icon: string;
  tagline: string;
  totalCount: number;
  nativeCount: number;
  hasNative: boolean;
}

type EntrySource = "athlynx_native" | "school_press" | "athlete_public";

interface Entry {
  position: string;
  firstName: string;
  lastName: string;
  fromSchool: string;
  toSchool: string;
  classYear?: string;
  note?: string;
  source: EntrySource;
  sourceUrl?: string;
  entered: string;
}

interface BoardResponse {
  poweredBy: string;
  slug: string;
  label: string;
  icon: string;
  tagline: string;
  entries: Entry[];
}

// ─── Position chip colors (sport-agnostic mapping) ─────────────────────────

const POSITION_PALETTE: Record<string, string> = {
  P: "#dc2626", RHP: "#dc2626", LHP: "#dc2626", SP: "#dc2626", RP: "#dc2626",
  C: "#dc2626",
  "1B": "#b91c1c", "2B": "#b91c1c", "3B": "#b91c1c", SS: "#b91c1c",
  OF: "#b91c1c", "C/OF": "#b91c1c", INF: "#b91c1c",
  QB: "#1d4ed8", RB: "#1d4ed8", WR: "#1d4ed8", TE: "#1d4ed8", OT: "#1d4ed8",
  EDGE: "#7c2d12", LB: "#7c2d12", DB: "#7c2d12", DL: "#7c2d12",
  PG: "#7e22ce", SG: "#7e22ce", G: "#7e22ce", SF: "#a21caf", PF: "#a21caf", F: "#a21caf",
  GK: "#0f766e", D: "#0f766e", M: "#15803d", FW: "#16a34a",
  OH: "#9333ea", MB: "#9333ea", S: "#9333ea", L: "#9333ea",
  A: "#dc2626",
};

function chipColor(pos: string): string {
  return POSITION_PALETTE[pos.toUpperCase()] || "#1E90FF";
}

// ─── Source chip styling ───────────────────────────────────────────────────

const SOURCE_META: Record<EntrySource, { label: string; bg: string; text: string; ring?: string }> = {
  athlynx_native:   { label: "AthlynX Verified", bg: "#1E90FF", text: "#ffffff", ring: "#00C2FF" },
  school_press:     { label: "School Announced", bg: "#0a1628", text: "#00C2FF", ring: "#1E90FF" },
  athlete_public:   { label: "Athlete Announced", bg: "#0a1628", text: "#ffffff", ring: "#ffffff20" },
};

// ─── Component ────────────────────────────────────────────────────────────

export default function AthlynxPortalBoard() {
  const [sports, setSports] = useState<SportSummary[] | null>(null);
  const [active, setActive] = useState<string>("baseball");
  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEnterModal, setShowEnterModal] = useState(false);

  // Load sports list once
  useEffect(() => {
    let alive = true;
    fetch("/api/transfer-portal/sports")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setSports(d.sports || []);
      })
      .catch(() => {
        if (alive) setSports([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Load board for active sport
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/transfer-portal/board?sport=${active}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setBoard(d);
      })
      .catch(() => {
        if (alive) setBoard(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [active]);

  const activeSport = useMemo(
    () => sports?.find((s) => s.slug === active),
    [sports, active]
  );

  const totalNative = useMemo(
    () => (sports || []).reduce((sum, s) => sum + s.nativeCount, 0),
    [sports]
  );

  return (
    <section
      className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1628] via-black to-[#0a1628] overflow-hidden"
      data-testid="athlynx-portal-board"
    >
      {/* ── HEADER ── */}
      <div className="px-5 pt-5 pb-3 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="inline-block bg-[#1E90FF] text-white text-[10px] font-black uppercase tracking-[0.22em] px-2.5 py-1 rounded">
            AthlynX Portal
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
            Native entries · School announcements · Athlete announcements
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              The Portal Board
            </h2>
            <p className="text-sm text-white/65 mt-1 max-w-2xl">
              The first transfer portal where athletes <span className="text-[#00C2FF] font-bold">enter</span> the
              portal on the platform itself — not where they get listed after the fact.
              {totalNative > 0 && (
                <>
                  {" "}
                  <span className="text-white font-bold">{totalNative}</span>{" "}
                  athlete{totalNative === 1 ? "" : "s"} have entered via AthlynX.
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowEnterModal(true)}
            data-testid="enter-via-athlynx-cta"
            className="shrink-0 inline-flex items-center gap-2 bg-[#00C2FF] text-black text-xs font-black uppercase tracking-[0.16em] px-4 py-2.5 rounded-lg hover:brightness-110 transition"
          >
            Enter the Portal via AthlynX →
          </button>
        </div>
      </div>

      {/* ── SPORT TABS ── */}
      <div className="px-5 pt-4 border-b border-white/10 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {(sports ?? []).map((s) => {
            const isActive = s.slug === active;
            return (
              <button
                key={s.slug}
                onClick={() => setActive(s.slug)}
                data-testid={`sport-tab-${s.slug}`}
                className={[
                  "flex items-center gap-1.5 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] whitespace-nowrap transition border-b-2",
                  isActive
                    ? "text-white border-[#1E90FF]"
                    : "text-white/45 border-transparent hover:text-white/80",
                ].join(" ")}
              >
                <span aria-hidden>{s.icon}</span>
                <span>{s.label}</span>
                <span className="ml-1 text-[9px] text-white/40">
                  {s.totalCount}
                </span>
                {s.hasNative && (
                  <span
                    className="ml-1 inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-[#00C2FF]"
                    title={`${s.nativeCount} verified via AthlynX`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00C2FF]" />
                    AX
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="p-5">
        {activeSport && (
          <div className="mb-4">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
              {activeSport.label} · {activeSport.totalCount} on the board
            </div>
            <p className="text-xs text-white/55 mt-1">{activeSport.tagline}</p>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center text-white/40 text-sm">
            Loading the AthlynX board…
          </div>
        )}

        {!loading && board && board.entries.length === 0 && (
          <div className="py-8 text-center text-white/40 text-sm">
            No entries on the board for this sport yet.
            <div className="mt-2">
              <button
                onClick={() => setShowEnterModal(true)}
                className="text-[#00C2FF] hover:underline font-bold"
              >
                Be the first — enter via AthlynX →
              </button>
            </div>
          </div>
        )}

        {!loading && board && board.entries.length > 0 && (
          <ol
            className="divide-y divide-white/5 rounded-xl border border-white/5 overflow-hidden bg-black/40"
            data-testid="board-list"
          >
            {board.entries.map((e, i) => {
              const color = chipColor(e.position);
              const meta = SOURCE_META[e.source];
              const isNative = e.source === "athlynx_native";
              return (
                <li
                  key={i}
                  className={[
                    "flex items-stretch gap-0 hover:bg-white/[0.03] transition",
                    isNative ? "bg-[#1E90FF]/[0.06]" : "",
                  ].join(" ")}
                  data-testid={`board-row-${i}`}
                >
                  {/* Position chip */}
                  <div
                    className="flex items-center justify-center min-w-[64px] px-2 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-white"
                    style={{ backgroundColor: color }}
                  >
                    {e.position}
                  </div>

                  {/* Name + school + meta */}
                  <div className="flex-1 min-w-0 px-4 py-3">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-white/85 font-medium whitespace-nowrap">
                        {e.firstName}
                      </span>
                      <span className="text-white font-black uppercase tracking-tight text-lg whitespace-nowrap">
                        {e.lastName}
                      </span>
                      <span className="text-white/50 italic text-sm whitespace-nowrap">
                        {e.toSchool && e.toSchool !== "Transferring" && e.toSchool !== "Returning"
                          ? `${e.fromSchool} → ${e.toSchool}`
                          : e.fromSchool}
                      </span>
                      {e.classYear && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#00C2FF]/80 ml-auto">
                          {e.classYear}
                        </span>
                      )}
                    </div>

                    {e.note && (
                      <div className="text-[11px] text-white/55 mt-0.5 italic">
                        {e.note}
                      </div>
                    )}

                    {/* Source chip + Claim CTA */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.16em]"
                        style={{
                          backgroundColor: meta.bg,
                          color: meta.text,
                          boxShadow: meta.ring ? `inset 0 0 0 1px ${meta.ring}` : undefined,
                        }}
                      >
                        {isNative && <span aria-hidden>✓</span>}
                        {meta.label}
                      </span>
                      {e.sourceUrl && !isNative && (
                        <a
                          href={e.sourceUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[10px] text-white/35 hover:text-white/70 truncate max-w-[260px]"
                        >
                          {new URL(e.sourceUrl).hostname}
                        </a>
                      )}
                      <span className="text-[10px] uppercase tracking-widest text-white/30">
                        {e.entered}
                      </span>
                      {!isNative && (
                        <button
                          onClick={() => setShowEnterModal(true)}
                          className="ml-auto text-[10px] font-black uppercase tracking-[0.16em] text-[#00C2FF] hover:text-white transition"
                          data-testid={`claim-row-${i}`}
                        >
                          Claim this profile →
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="px-5 py-3 border-t border-white/10 bg-black/40">
        <p className="text-[10px] uppercase tracking-widest text-white/45">
          Powered by AthlynX · No third-party services · {board?.entries.length || 0} on this board
        </p>
      </div>

      {/* ── ENTER MODAL ── */}
      {showEnterModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 p-4"
          onClick={() => setShowEnterModal(false)}
          data-testid="enter-modal"
        >
          <div
            className="w-full max-w-md bg-[#0a1628] border border-[#1E90FF]/40 rounded-2xl p-5 shadow-2xl"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
                  AthlynX Portal Entry
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mt-1">
                  Enter the Portal via AthlynX
                </h3>
              </div>
              <button
                onClick={() => setShowEnterModal(false)}
                className="text-white/45 hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-white/75 leading-snug mb-4">
              You stay in control of your record. We package your stats,
              highlights, and contact preferences into a compliance-ready
              entry your school's compliance officer can submit to the NCAA.
              Your AthlynX profile becomes the verified source coaches
              recruit from — no third party in between.
            </p>
            <ol className="text-xs text-white/65 leading-relaxed space-y-1 mb-4">
              <li>1. Sign in to AthlynX (or claim your existing profile)</li>
              <li>2. Confirm sport · position · current school</li>
              <li>3. Set contact preferences and NIL rules</li>
              <li>4. We generate your compliance-ready PDF</li>
              <li>5. Hand it to your compliance officer · You're in.</li>
            </ol>
            <div className="flex gap-2">
              <a
                href="/signin?next=/transfer-portal/enter"
                className="flex-1 text-center bg-[#00C2FF] text-black text-xs font-black uppercase tracking-[0.16em] px-4 py-2.5 rounded-lg hover:brightness-110 transition"
              >
                Sign in & Start
              </a>
              <button
                onClick={() => setShowEnterModal(false)}
                className="text-xs font-black uppercase tracking-[0.16em] text-white/55 hover:text-white px-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
