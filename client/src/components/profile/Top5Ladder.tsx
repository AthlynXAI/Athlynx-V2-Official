import { useState } from "react";
import { ArrowUpDown, Upload, FileText, Eye, EyeOff, ChevronUp, ChevronDown, X as XIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Athlynx Build 3 — Top 5 Schools Ladder.
// Athlete-controlled rank 1-5 board. Direction toggle (countdown 5→1 or topdown 1→5).
// Each slot supports a letter upload (PDF/image), letter type, and public/private flag.
// When letter is public the world sees it next to the school.

const C = {
  blue: "#00A3FF",
  gold: "#D4AF37",
  border: "#1F3257",
  text: "#FFFFFF",
  textMuted: "#B7C3D9",
  textFaint: "#6B7A99",
  surface: "#0F1E36",
  elevated: "#142544",
  red: "#A12C7B",
  green: "#437A22",
};

const LETTER_LABELS: Record<string, string> = {
  offer: "Offer",
  commitment: "Commitment",
  interest: "Interest",
  ncaa_loi: "NCAA LOI",
  camp_invite: "Camp Invite",
};

export function Top5Ladder({
  athleteId,
  isOwner,
}: {
  athleteId: number;
  isOwner: boolean;
}) {
  const ladderQ = trpc.recruiting.getTopFiveLadder.useQuery({ athleteId });
  const boardQ = trpc.recruiting.getBoardForAthlete.useQuery({ athleteId });
  const setDir = trpc.recruiting.setLadderDirection.useMutation();
  const setRank = trpc.recruiting.setSlotRank.useMutation();
  const utils = trpc.useUtils();

  const data = ladderQ.data;
  const allEntries = boardQ.data ?? [];
  const slots = data?.slots ?? [];
  const direction: "countdown" | "topdown" = data?.direction ?? "countdown";

  // Build the 5 slot positions in display order based on direction
  const positions = direction === "countdown" ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

  const slotByRank = new Map<number, any>();
  for (const s of slots) {
    if (s.rank != null) slotByRank.set(Number(s.rank), s);
  }

  const flipDirection = async () => {
    const newDir = direction === "countdown" ? "topdown" : "countdown";
    await setDir.mutateAsync({ athleteId, direction: newDir });
    await utils.recruiting.getTopFiveLadder.invalidate({ athleteId });
  };

  const refresh = async () => {
    await utils.recruiting.getTopFiveLadder.invalidate({ athleteId });
    await utils.recruiting.getBoardForAthlete.invalidate({ athleteId });
  };

  if (ladderQ.isLoading) {
    return <div style={{ color: C.textMuted, padding: 24 }}>Loading Top 5…</div>;
  }

  return (
    <section
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 20,
        marginTop: 16,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: C.text,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: -0.3,
            }}
          >
            Top 5 Schools
          </h3>
          <div
            style={{
              color: C.textFaint,
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {direction === "countdown" ? "Countdown · 5 to 1" : "Top down · 1 to 5"}
          </div>
        </div>
        {isOwner ? (
          <Button
            size="sm"
            variant="outline"
            onClick={flipDirection}
            style={{ borderColor: C.border, color: C.textMuted }}
          >
            <ArrowUpDown style={{ width: 14, height: 14, marginRight: 6 }} />
            Flip direction
          </Button>
        ) : null}
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {positions.map(rank => {
          const slot = slotByRank.get(rank);
          return (
            <LadderSlot
              key={rank}
              rank={rank}
              slot={slot}
              athleteId={athleteId}
              isOwner={isOwner}
              allEntries={allEntries}
              onChange={refresh}
            />
          );
        })}
      </div>
    </section>
  );
}

function LadderSlot({
  rank,
  slot,
  athleteId,
  isOwner,
  allEntries,
  onChange,
}: {
  rank: number;
  slot: any | undefined;
  athleteId: number;
  isOwner: boolean;
  allEntries: any[];
  onChange: () => void;
}) {
  const setRank = trpc.recruiting.setSlotRank.useMutation();
  const setLetter = trpc.recruiting.setSlotLetter.useMutation();
  const getUpload = trpc.recruiting.getLetterUploadUrl.useMutation();

  const [assignOpen, setAssignOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  const filled = !!slot;
  const accent = rank === 1 ? C.gold : C.blue;

  const clearSlot = async () => {
    if (!slot) return;
    await setRank.mutateAsync({ athleteId, entryId: slot.id, rank: null });
    onChange();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: C.elevated,
        border: `1px solid ${filled ? accent : C.border}`,
        borderLeft: `4px solid ${filled ? accent : C.border}`,
        borderRadius: 6,
        padding: 14,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: filled ? accent : C.textFaint,
          width: 40,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        #{rank}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {filled ? (
          <>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {slot.collegeName}
            </div>
            <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>
              {[slot.division, slot.conference, slot.level]
                .filter(Boolean)
                .join(" · ")}
            </div>
            {slot.coachName ? (
              <div style={{ color: C.textFaint, fontSize: 11, marginTop: 2 }}>
                Coach: {slot.coachName}
                {slot.coachEmail ? ` · ${slot.coachEmail}` : ""}
              </div>
            ) : null}
            {slot.letterUrl ? (
              <a
                href={slot.letterUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: accent,
                  fontSize: 12,
                  fontWeight: 700,
                  marginTop: 8,
                  textDecoration: "none",
                  background: "rgba(0,163,255,0.08)",
                  border: `1px solid ${accent}`,
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                <FileText style={{ width: 12, height: 12 }} />
                {slot.letterType ? LETTER_LABELS[slot.letterType] : "Letter"}
                {slot.letterPublic ? null : (
                  <span style={{ color: C.textFaint, fontWeight: 600 }}> · private</span>
                )}
              </a>
            ) : null}
          </>
        ) : (
          <div style={{ color: C.textFaint, fontSize: 14, fontStyle: "italic" }}>
            Empty slot
          </div>
        )}
      </div>

      {isOwner ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <AssignSchoolSheet
            rank={rank}
            athleteId={athleteId}
            entries={allEntries}
            currentEntryId={slot?.id}
            open={assignOpen}
            onOpenChange={setAssignOpen}
            onChange={onChange}
          />
          {filled ? (
            <LetterSheet
              athleteId={athleteId}
              entry={slot}
              open={letterOpen}
              onOpenChange={setLetterOpen}
              onChange={onChange}
            />
          ) : null}
          {filled ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSlot}
              style={{ color: C.textFaint }}
              aria-label="Clear slot"
            >
              <XIcon style={{ width: 14, height: 14 }} />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function AssignSchoolSheet({
  rank,
  athleteId,
  entries,
  currentEntryId,
  open,
  onOpenChange,
  onChange,
}: {
  rank: number;
  athleteId: number;
  entries: any[];
  currentEntryId?: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChange: () => void;
}) {
  const setRank = trpc.recruiting.setSlotRank.useMutation();

  const pick = async (entryId: number) => {
    await setRank.mutateAsync({ athleteId, entryId, rank });
    onOpenChange(false);
    onChange();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          style={{ borderColor: C.border, color: C.textMuted }}
        >
          {currentEntryId ? "Swap" : "Assign"}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        style={{
          background: C.surface,
          color: C.text,
          borderColor: C.border,
          width: 460,
          maxWidth: "100%",
          overflowY: "auto",
        }}
      >
        <SheetHeader>
          <SheetTitle style={{ color: C.text }}>
            Assign #{rank} on your ladder
          </SheetTitle>
        </SheetHeader>
        <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>
          Pick a school from your recruiting board. If the school you want isn't
          here yet, add it from the Recruiting tab first.
        </p>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {entries.length === 0 ? (
            <div style={{ color: C.textFaint, fontStyle: "italic", padding: 12 }}>
              No schools on your board yet.
            </div>
          ) : (
            entries.map((e: any) => (
              <button
                key={e.id}
                onClick={() => pick(e.id)}
                style={{
                  textAlign: "left",
                  background: e.id === currentEntryId ? "rgba(0,163,255,0.12)" : C.elevated,
                  border: `1px solid ${e.id === currentEntryId ? C.blue : C.border}`,
                  borderRadius: 6,
                  padding: 12,
                  cursor: "pointer",
                  color: C.text,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>{e.collegeName}</div>
                <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>
                  {[e.division, e.conference, e.level].filter(Boolean).join(" · ")}
                </div>
                {e.rank ? (
                  <div style={{ color: C.gold, fontSize: 11, marginTop: 4, fontWeight: 700 }}>
                    Currently at #{e.rank}
                  </div>
                ) : null}
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LetterSheet({
  athleteId,
  entry,
  open,
  onOpenChange,
  onChange,
}: {
  athleteId: number;
  entry: any;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChange: () => void;
}) {
  const setLetter = trpc.recruiting.setSlotLetter.useMutation();
  const getUpload = trpc.recruiting.getLetterUploadUrl.useMutation();
  const [type, setType] = useState<string>(entry.letterType ?? "offer");
  const [isPublic, setIsPublic] = useState<boolean>(entry.letterPublic ?? true);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const sig = await getUpload.mutateAsync({
        athleteId,
        filename: file.name,
        contentType: file.type || "application/pdf",
      });
      const put = await fetch(sig.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/pdf" },
        body: file,
      });
      if (!put.ok) throw new Error("Upload failed");
      await setLetter.mutateAsync({
        athleteId,
        entryId: entry.id,
        letterUrl: sig.readUrl,
        letterType: type as any,
        letterFilename: file.name,
        letterPublic: isPublic,
      });
      onChange();
      onOpenChange(false);
    } finally {
      setUploading(false);
    }
  };

  const saveMeta = async () => {
    await setLetter.mutateAsync({
      athleteId,
      entryId: entry.id,
      letterUrl: entry.letterUrl ?? null,
      letterType: (type as any) ?? null,
      letterFilename: entry.letterFilename ?? null,
      letterPublic: isPublic,
    });
    onChange();
    onOpenChange(false);
  };

  const removeLetter = async () => {
    await setLetter.mutateAsync({
      athleteId,
      entryId: entry.id,
      letterUrl: null,
      letterType: null,
      letterFilename: null,
      letterPublic: true,
    });
    onChange();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          style={{ borderColor: C.border, color: C.textMuted }}
        >
          <Upload style={{ width: 12, height: 12, marginRight: 4 }} />
          {entry.letterUrl ? "Letter" : "Add letter"}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        style={{
          background: C.surface,
          color: C.text,
          borderColor: C.border,
          width: 460,
          maxWidth: "100%",
          overflowY: "auto",
        }}
      >
        <SheetHeader>
          <SheetTitle style={{ color: C.text }}>
            Letter — {entry.collegeName}
          </SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <Label style={{ color: C.textMuted, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
              Letter type
            </Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {Object.entries(LETTER_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  style={{
                    background: type === key ? C.blue : C.elevated,
                    color: type === key ? C.text : C.textMuted,
                    border: `1px solid ${type === key ? C.blue : C.border}`,
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label style={{ color: C.textMuted, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
              Visibility
            </Label>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={() => setIsPublic(true)}
                style={{
                  flex: 1,
                  background: isPublic ? C.green : C.elevated,
                  color: isPublic ? C.text : C.textMuted,
                  border: `1px solid ${isPublic ? C.green : C.border}`,
                  borderRadius: 6,
                  padding: "10px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Eye style={{ width: 14, height: 14 }} />
                Public
              </button>
              <button
                onClick={() => setIsPublic(false)}
                style={{
                  flex: 1,
                  background: !isPublic ? C.textFaint : C.elevated,
                  color: !isPublic ? C.surface : C.textMuted,
                  border: `1px solid ${!isPublic ? C.textFaint : C.border}`,
                  borderRadius: 6,
                  padding: "10px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <EyeOff style={{ width: 14, height: 14 }} />
                Private
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: C.textFaint, lineHeight: 1.5 }}>
              Public letters appear on your profile next to the school. Private letters are visible only to you.
            </div>
          </div>

          {entry.letterUrl ? (
            <div
              style={{
                padding: 12,
                background: C.elevated,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              <div style={{ color: C.textMuted, marginBottom: 4 }}>Current file</div>
              <a
                href={entry.letterUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.blue, textDecoration: "none", wordBreak: "break-all" }}
              >
                {entry.letterFilename ?? entry.letterUrl}
              </a>
            </div>
          ) : null}

          <Label
            style={{
              display: "block",
              padding: "24px 16px",
              border: `2px dashed ${C.border}`,
              borderRadius: 8,
              textAlign: "center",
              cursor: uploading ? "wait" : "pointer",
              color: C.textMuted,
            }}
          >
            <Upload style={{ width: 22, height: 22, margin: "0 auto 6px", display: "block" }} />
            {uploading ? "Uploading…" : entry.letterUrl ? "Replace file" : "Upload letter (PDF or image)"}
            <input
              type="file"
              accept="application/pdf,image/*"
              style={{ display: "none" }}
              disabled={uploading}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </Label>

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <Button
              onClick={saveMeta}
              style={{ background: C.blue, color: C.text, flex: 1 }}
              disabled={uploading}
            >
              Save settings
            </Button>
            {entry.letterUrl ? (
              <Button
                variant="outline"
                onClick={removeLetter}
                style={{ borderColor: C.red, color: C.red }}
                disabled={uploading}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
