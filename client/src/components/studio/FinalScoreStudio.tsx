/**
 * <FinalScoreStudio /> — Build 27.1 Phase 2.3
 *
 * Final score recap graphic.
 * - V1: manual entry (team score / opponent score / W-L / quick recap)
 * - V2 (Phase 2.3b): GameChanger webhook auto-fills slot data
 * - PNG export at 1080x1350 via useExportPng
 * - Same StudioCard frame
 *
 * Doctrine:
 * - Lifecycle not snapshot: this is the post-game node. Match Day → Final Score
 *   share the same teamName and opponent so the lifecycle records cleanly.
 * - Routing not inventory: V2 GameChanger webhook composes existing game data.
 */
import { useMemo, useRef, useState } from "react";
import { StudioCard } from "./StudioCard";
import { useExportPng } from "./useExportPng";

export type GameResult = "W" | "L" | "T";

export interface FinalScoreSlot {
  opponent: string;
  teamScore: number;
  opponentScore: number;
  result: GameResult;
  date: string;
  topPerformer: string;
  recap: string;
}

export interface FinalScoreStudioProps {
  teamName: string;
  accentColor?: string;
  logoUrl?: string;
  /** Initial values for prefill (e.g. from MatchDayStudio handoff or GameChanger webhook). */
  initial?: Partial<FinalScoreSlot>;
  onSave?: (pngDataUrl: string, slot: FinalScoreSlot) => void | Promise<void>;
}

function buildEmptySlot(initial?: Partial<FinalScoreSlot>): FinalScoreSlot {
  return {
    opponent: initial?.opponent ?? "",
    teamScore: initial?.teamScore ?? 0,
    opponentScore: initial?.opponentScore ?? 0,
    result: initial?.result ?? "W",
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    topPerformer: initial?.topPerformer ?? "",
    recap: initial?.recap ?? "",
  };
}

const RESULT_COLORS: Record<GameResult, string> = {
  W: "#22c55e",
  L: "#ef4444",
  T: "#a3a3a3",
};

const RESULT_LABELS: Record<GameResult, string> = {
  W: "Win",
  L: "Loss",
  T: "Tie",
};

export function FinalScoreStudio({
  teamName,
  accentColor = "#FFB400",
  logoUrl,
  initial,
  onSave,
}: FinalScoreStudioProps) {
  const [slot, setSlot] = useState<FinalScoreSlot>(() => buildEmptySlot(initial));
  const cardRef = useRef<HTMLDivElement>(null);
  const { exportPng, isExporting, lastError } = useExportPng(cardRef);

  // Auto-update the result band if scores change and user has not overridden.
  function patch<K extends keyof FinalScoreSlot>(key: K, value: FinalScoreSlot[K]) {
    setSlot((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "teamScore" || key === "opponentScore") {
        if (next.teamScore > next.opponentScore) next.result = "W";
        else if (next.teamScore < next.opponentScore) next.result = "L";
        else next.result = "T";
      }
      return next;
    });
  }

  const filenameBase = useMemo(() => {
    const opp = slot.opponent ? slot.opponent.replace(/\s+/g, "_") : "final";
    return `${teamName}_finalscore_${opp}_${slot.date}`;
  }, [teamName, slot.opponent, slot.date]);

  async function handleSave() {
    const dataUrl = await exportPng(filenameBase);
    if (dataUrl && onSave) {
      await onSave(dataUrl, slot);
    }
  }

  const resultColor = RESULT_COLORS[slot.result];
  const resultLabel = RESULT_LABELS[slot.result];

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/*  Control panel  */}
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <h3 className="text-lg font-bold">Final Score</h3>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Opponent</span>
          <input
            type="text"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.opponent}
            onChange={(e) => patch("opponent", e.target.value)}
            maxLength={64}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-neutral-300">Us</span>
            <input
              type="number"
              min={0}
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
              value={slot.teamScore}
              onChange={(e) => patch("teamScore", Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-neutral-300">Them</span>
            <input
              type="number"
              min={0}
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
              value={slot.opponentScore}
              onChange={(e) => patch("opponentScore", Number(e.target.value))}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Result</span>
          <select
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.result}
            onChange={(e) => patch("result", e.target.value as GameResult)}
          >
            <option value="W">Win</option>
            <option value="L">Loss</option>
            <option value="T">Tie</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Date</span>
          <input
            type="date"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.date}
            onChange={(e) => patch("date", e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Top performer</span>
          <input
            type="text"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.topPerformer}
            onChange={(e) => patch("topPerformer", e.target.value)}
            placeholder="e.g. #14 J. Carter — 3 RBI, 2 H"
            maxLength={160}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-neutral-300">Recap</span>
          <textarea
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={slot.recap}
            onChange={(e) => patch("recap", e.target.value)}
            rows={3}
            maxLength={280}
            placeholder="One-line story of the game."
          />
        </label>

        <button
          type="button"
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-black hover:bg-blue-400 disabled:opacity-50"
          onClick={handleSave}
          disabled={isExporting || !slot.opponent}
        >
          {isExporting ? "Exporting…" : "Save & Export PNG"}
        </button>
        {lastError ? (
          <p className="text-sm text-red-400" role="alert">
            {lastError}
          </p>
        ) : null}

        <p className="text-xs text-neutral-500">
          Phase 2.3b: GameChanger webhook will prefill these fields automatically.
        </p>
      </div>

      {/*  Card preview / export surface  */}
      <div className="flex-1 overflow-auto">
        <div className="origin-top-left scale-50 lg:scale-[0.42]">
          <StudioCard
            ref={cardRef}
            studio="Final Score"
            teamName={teamName}
            accentColor={accentColor}
            logoUrl={logoUrl}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    borderRadius: 999,
                    background: resultColor,
                    color: "#0a0a0a",
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                  }}
                >
                  {resultLabel}
                </div>
                <div
                  style={{
                    fontSize: 36,
                    color: "rgba(255,255,255,0.6)",
                    marginTop: 24,
                  }}
                >
                  vs {slot.opponent || "Opponent"}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  gap: 32,
                  marginTop: 24,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 22,
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: 4,
                    }}
                  >
                    {teamName}
                  </div>
                  <div
                    style={{
                      fontSize: 200,
                      fontWeight: 900,
                      lineHeight: 1,
                      color: accentColor,
                    }}
                  >
                    {slot.teamScore}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 80,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  —
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 22,
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: 4,
                    }}
                  >
                    {slot.opponent || "Opp"}
                  </div>
                  <div
                    style={{
                      fontSize: 200,
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {slot.opponentScore}
                  </div>
                </div>
              </div>

              <div>
                {slot.topPerformer ? (
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 18,
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                      }}
                    >
                      Top Performer
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>
                      {slot.topPerformer}
                    </div>
                  </div>
                ) : null}
                {slot.recap ? (
                  <div
                    style={{
                      fontSize: 22,
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.4,
                    }}
                  >
                    {slot.recap}
                  </div>
                ) : null}
              </div>
            </div>
          </StudioCard>
        </div>
      </div>
    </div>
  );
}
