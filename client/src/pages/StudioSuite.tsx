/**
 * StudioSuite — Build 27.1 Phase 2.1–2.5 entry page.
 *
 * Three studios behind a tab switcher:
 * - Phase 2.1 LineupStudio
 * - Phase 2.2 MatchDayStudio
 * - Phase 2.3 FinalScoreStudio
 *
 * Wired to:
 * - Phase 2.4 AI Caption Engine (studio.generateCaptions, Nebius Llama 3.3-70B)
 * - Phase 2.5 One-Tap Publish (studio.publish, Buffer + Zapier)
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LineupStudio, type LineupSlot } from "@/components/studio/LineupStudio";
import { MatchDayStudio, type MatchDaySlot } from "@/components/studio/MatchDayStudio";
import { FinalScoreStudio, type FinalScoreSlot } from "@/components/studio/FinalScoreStudio";

type StudioTab = "lineup" | "matchday" | "finalscore";

const TABS: Array<{ id: StudioTab; label: string }> = [
  { id: "lineup", label: "Lineup" },
  { id: "matchday", label: "Match Day" },
  { id: "finalscore", label: "Final Score" },
];

function StudioSuiteInner() {
  const [tab, setTab] = useState<StudioTab>("lineup");
  const [teamName, setTeamName] = useState("AthlynX Team");
  const [lastGraphic, setLastGraphic] = useState<{
    id: number;
    type: StudioTab;
    captions: string[];
  } | null>(null);

  const rosterQ = trpc.studio.rosterList.useQuery();
  const upcomingQ = trpc.studio.upcomingGames.useQuery({ limit: 10 });
  // Phase 2.3b — GameChanger auto-ingest pull. Refetches every 60s so a
  // freshly-ended game appears in the Final Score studio without a manual
  // reload. Refresh on tab focus too in case the laptop was asleep.
  const autoIngestQ = trpc.studio.latestAutoIngest.useQuery(undefined, {
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  const saveGraphic = trpc.studio.saveGraphic.useMutation();
  const generateCaptions = trpc.studio.generateCaptions.useMutation();
  const publish = trpc.studio.publish.useMutation();

  async function persistAndCaption(
    type: StudioTab,
    payload: unknown,
    extras: {
      opponent?: string;
      gameDate?: string;
      topPerformer?: string;
      result?: "W" | "L" | "T";
      score?: string;
    } = {},
  ) {
    try {
      const saved = await saveGraphic.mutateAsync({
        type,
        teamName,
        opponent: extras.opponent,
        gameDate: extras.gameDate,
        payload,
      });
      toast.success(`${type === "lineup" ? "Lineup" : type === "matchday" ? "Match Day" : "Final Score"} saved`, {
        description: `Graphic #${saved.id} — generating captions…`,
      });
      const cap = await generateCaptions.mutateAsync({
        graphicId: saved.id,
        type,
        teamName,
        ...extras,
      });
      setLastGraphic({ id: saved.id, type, captions: cap.captions });
      toast.success("Captions ready", {
        description: `${cap.captions.length} captions generated. Pick one and publish.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error("Could not save graphic", { description: msg });
    }
  }

  async function handlePublish(caption: string, channels: Array<"buffer" | "zapier">) {
    if (!lastGraphic) return;
    try {
      const res = await publish.mutateAsync({
        graphicId: lastGraphic.id,
        caption,
        channels,
      });
      const okList = Object.entries(res.results)
        .filter(([, v]) => v.ok)
        .map(([k]) => k);
      const failList = Object.entries(res.results)
        .filter(([, v]) => !v.ok)
        .map(([k, v]) => `${k}: ${v.error ?? "failed"}`);
      if (okList.length > 0) {
        toast.success(`Published to ${okList.join(" + ")}`);
      }
      if (failList.length > 0) {
        toast.error("Some channels failed", { description: failList.join("\n") });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Publish failed";
      toast.error("Publish failed", { description: msg });
    }
  }

  function handleLineupSave(_png: string, slots: LineupSlot[]) {
    return persistAndCaption("lineup", { slots });
  }
  function handleMatchDaySave(_png: string, slot: MatchDaySlot) {
    return persistAndCaption("matchday", slot, {
      opponent: slot.opponent,
      gameDate: slot.date,
    });
  }
  function handleFinalScoreSave(_png: string, slot: FinalScoreSlot) {
    return persistAndCaption("finalscore", slot, {
      opponent: slot.opponent,
      gameDate: slot.date,
      result: slot.result,
      score: `${slot.teamScore}-${slot.opponentScore}`,
      topPerformer: slot.topPerformer,
    });
  }

  return (
    <PlatformLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Studio Suite</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Build 27.1 · Lineup, Match Day, Final Score. Save exports a PNG,
              fires the AI Caption Engine, and queues One-Tap Publish.
            </p>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-neutral-300">Team name</span>
            <input
              type="text"
              className="rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-base"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              maxLength={120}
            />
          </label>
        </header>

        {/* ─── Tab switcher ─────────────────────────────────────────── */}
        <div className="mb-6 flex gap-2 border-b border-neutral-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`px-4 py-2 text-sm font-semibold transition ${
                tab === t.id
                  ? "border-b-2 border-blue-400 text-sky-300"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Active studio ────────────────────────────────────────── */}
        {tab === "lineup" ? (
          rosterQ.isLoading ? (
            <div className="rounded border border-neutral-800 p-8 text-center text-neutral-400">
              Loading roster…
            </div>
          ) : (
            <LineupStudio
              teamName={teamName}
              roster={rosterQ.data?.athletes ?? []}
              onSave={handleLineupSave}
            />
          )
        ) : null}

        {tab === "matchday" ? (
          <MatchDayStudio
            teamName={teamName}
            upcomingGames={(upcomingQ.data?.games ?? []) as never}
            onSave={handleMatchDaySave}
          />
        ) : null}

        {tab === "finalscore" ? (
          <>
            {autoIngestQ.data?.ingest ? (
              <div className="mb-4 rounded border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <strong className="font-semibold">GameChanger auto-ingest:</strong>{" "}
                {teamName} vs {autoIngestQ.data.ingest.opponent} —{" "}
                {autoIngestQ.data.ingest.teamScore}-{autoIngestQ.data.ingest.opponentScore}{" "}
                ({autoIngestQ.data.ingest.result ?? "—"}). Prefilled below.
              </div>
            ) : null}
            <FinalScoreStudio
              key={autoIngestQ.data?.ingest?.gcEventId ?? "manual"}
              teamName={teamName}
              onSave={handleFinalScoreSave}
              initial={
                autoIngestQ.data?.ingest
                  ? {
                      opponent: autoIngestQ.data.ingest.opponent,
                      teamScore: autoIngestQ.data.ingest.teamScore,
                      opponentScore: autoIngestQ.data.ingest.opponentScore,
                      result: autoIngestQ.data.ingest.result ?? "W",
                      date:
                        autoIngestQ.data.ingest.gameDate ??
                        new Date().toISOString().slice(0, 10),
                      topPerformer: autoIngestQ.data.ingest.topPerformer,
                    }
                  : undefined
              }
            />
          </>
        ) : null}

        {/* ─── Caption + publish dock ───────────────────────────────── */}
        {lastGraphic && lastGraphic.type === tab ? (
          <CaptionPublishDock
            graphicId={lastGraphic.id}
            captions={lastGraphic.captions}
            onPublish={handlePublish}
            publishing={publish.isPending}
          />
        ) : null}
      </div>
    </PlatformLayout>
  );
}

interface CaptionPublishDockProps {
  graphicId: number;
  captions: string[];
  onPublish: (caption: string, channels: Array<"buffer" | "zapier">) => Promise<void>;
  publishing: boolean;
}

function CaptionPublishDock({ graphicId, captions, onPublish, publishing }: CaptionPublishDockProps) {
  const [selected, setSelected] = useState(0);
  const [channels, setChannels] = useState<Array<"buffer" | "zapier">>(["buffer", "zapier"]);

  function toggleChannel(ch: "buffer" | "zapier") {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-blue-500/30 bg-neutral-950 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">
          Captions for graphic #{graphicId}
        </h3>
        <span className="text-xs uppercase tracking-widest text-sky-400">
          AI Caption Engine · Llama 3.3-70B
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {captions.map((c, idx) => (
          <label
            key={idx}
            className={`flex cursor-pointer items-start gap-3 rounded border p-3 text-sm transition ${
              selected === idx
                ? "border-blue-500 bg-blue-500/10"
                : "border-neutral-800 hover:border-neutral-600"
            }`}
          >
            <input
              type="radio"
              checked={selected === idx}
              onChange={() => setSelected(idx)}
              className="mt-1"
            />
            <span className="flex-1">{c}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={channels.includes("buffer")}
              onChange={() => toggleChannel("buffer")}
            />
            <span>Buffer</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={channels.includes("zapier")}
              onChange={() => toggleChannel("zapier")}
            />
            <span>Zapier</span>
          </label>
        </div>
        <button
          type="button"
          className="rounded bg-blue-500 px-5 py-2 font-semibold text-black hover:bg-blue-400 disabled:opacity-50"
          onClick={() => onPublish(captions[selected], channels)}
          disabled={publishing || channels.length === 0}
        >
          {publishing ? "Publishing…" : "One-Tap Publish"}
        </button>
      </div>
    </div>
  );
}

export default function StudioSuite() {
  return (
    <RouteErrorBoundary>
      <StudioSuiteInner />
    </RouteErrorBoundary>
  );
}
