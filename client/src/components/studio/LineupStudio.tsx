/**
 * <LineupStudio /> — Build 27.1 Phase 2.1
 *
 * 9-card baseball/softball starting lineup graphic.
 * - Roster pull from athlete profiles via tRPC (studio.roster.list)
 * - 9 position slots (P, C, 1B, 2B, 3B, SS, LF, CF, RF) with optional DH
 * - PNG export at 1080x1350 via useExportPng
 * - Hook into AI Caption Engine (Phase 2.4) on save
 * - One-Tap Publish (Phase 2.5) on save
 *
 * Doctrine alignment:
 * - Athlete-owned: every card pulls from the athlete's published profile
 * - Routing not inventory: this composes existing identity, doesn't store a new copy
 * - 4.5 quality bar: exports at 2x pixelRatio, brand-bar locked
 */
import { useMemo, useRef, useState } from "react";
import { StudioCard } from "./StudioCard";
import { useExportPng } from "./useExportPng";

//  Position config 
export const BASEBALL_POSITIONS = [
  { code: "P", label: "Pitcher" },
  { code: "C", label: "Catcher" },
  { code: "1B", label: "First Base" },
  { code: "2B", label: "Second Base" },
  { code: "3B", label: "Third Base" },
  { code: "SS", label: "Shortstop" },
  { code: "LF", label: "Left Field" },
  { code: "CF", label: "Center Field" },
  { code: "RF", label: "Right Field" },
] as const;

export type PositionCode = (typeof BASEBALL_POSITIONS)[number]["code"];

//  Roster slot data shape 
export interface LineupSlot {
  position: PositionCode;
  athleteId: number | null;
  displayName: string;
  jerseyNumber: number | null;
  headshotUrl: string | null;
}

export interface RosterAthlete {
  id: number;
  displayName: string;
  jerseyNumber: number | null;
  headshotUrl: string | null;
  position: string | null;
}

export interface LineupStudioProps {
  teamName: string;
  accentColor?: string;
  logoUrl?: string;
  /** Available roster pool to assign into the 9 slots. */
  roster: RosterAthlete[];
  /** Opponent name, optional (rendered in subtitle when present). */
  opponent?: string;
  /** Game date, optional ISO string. */
  gameDate?: string;
  /** Called when the user saves — passes the PNG data URL for downstream wiring. */
  onSave?: (pngDataUrl: string, slots: LineupSlot[]) => void | Promise<void>;
}

const EMPTY_SLOTS: LineupSlot[] = BASEBALL_POSITIONS.map((p) => ({
  position: p.code,
  athleteId: null,
  displayName: "—",
  jerseyNumber: null,
  headshotUrl: null,
}));

export function LineupStudio({
  teamName,
  accentColor = "#FFB400",
  logoUrl,
  roster,
  opponent,
  gameDate,
  onSave,
}: LineupStudioProps) {
  const [slots, setSlots] = useState<LineupSlot[]>(EMPTY_SLOTS);
  const cardRef = useRef<HTMLDivElement>(null);
  const { exportPng, isExporting, lastError } = useExportPng(cardRef);

  const filenameBase = useMemo(() => {
    const datePart = gameDate ?? new Date().toISOString().slice(0, 10);
    return `${teamName}_lineup_${datePart}`;
  }, [teamName, gameDate]);

  function assignSlot(positionIdx: number, athleteId: number | null) {
    setSlots((prev) => {
      const next = [...prev];
      if (athleteId == null) {
        next[positionIdx] = { ...next[positionIdx], athleteId: null, displayName: "—", jerseyNumber: null, headshotUrl: null };
        return next;
      }
      const athlete = roster.find((a) => a.id === athleteId);
      if (!athlete) return prev;
      next[positionIdx] = {
        ...next[positionIdx],
        athleteId,
        displayName: athlete.displayName,
        jerseyNumber: athlete.jerseyNumber,
        headshotUrl: athlete.headshotUrl,
      };
      return next;
    });
  }

  async function handleSave() {
    const dataUrl = await exportPng(filenameBase);
    if (dataUrl && onSave) {
      await onSave(dataUrl, slots);
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/*  Control panel  */}
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <h3 className="text-lg font-bold">Assign positions</h3>
        {BASEBALL_POSITIONS.map((pos, idx) => (
          <div key={pos.code} className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-mono text-sm font-bold">
              {pos.code}
            </span>
            <select
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
              value={slots[idx].athleteId ?? ""}
              onChange={(e) =>
                assignSlot(idx, e.target.value === "" ? null : Number(e.target.value))
              }
              aria-label={`Assign ${pos.label}`}
            >
              <option value="">— Open —</option>
              {roster.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.jerseyNumber ?? "??"} {a.displayName}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-black hover:bg-blue-400 disabled:opacity-50"
          onClick={handleSave}
          disabled={isExporting}
        >
          {isExporting ? "Exporting…" : "Save & Export PNG"}
        </button>
        {lastError ? (
          <p className="text-sm text-red-400" role="alert">
            {lastError}
          </p>
        ) : null}
      </div>

      {/*  Card preview / export surface  */}
      <div className="flex-1 overflow-auto">
        <div className="origin-top-left scale-50 lg:scale-[0.42]">
          <StudioCard
            ref={cardRef}
            studio="Starting Lineup"
            teamName={teamName}
            accentColor={accentColor}
            logoUrl={logoUrl}
          >
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {opponent || gameDate ? (
                <div
                  style={{
                    fontSize: 26,
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: 32,
                  }}
                >
                  {opponent ? `vs ${opponent}` : null}
                  {opponent && gameDate ? " · " : null}
                  {gameDate}
                </div>
              ) : null}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                  flex: 1,
                }}
              >
                {slots.map((slot) => (
                  <div
                    key={slot.position}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `2px solid ${accentColor}33`,
                      borderRadius: 16,
                      padding: 20,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        color: accentColor,
                        fontWeight: 700,
                      }}
                    >
                      {slot.position}
                    </div>
                    {slot.headshotUrl ? (
                      <img
                        src={slot.headshotUrl}
                        alt=""
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.08)",
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.15,
                      }}
                    >
                      {slot.displayName}
                    </div>
                    {slot.jerseyNumber != null ? (
                      <div
                        style={{
                          fontSize: 18,
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        #{slot.jerseyNumber}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </StudioCard>
        </div>
      </div>
    </div>
  );
}
