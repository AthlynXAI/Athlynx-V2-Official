import { useState, useEffect } from "react";
import { Pencil, Check, X, Upload, Image as ImageIcon, Trophy } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

// Athlynx Build 3 — Editable Everywhere.
// Components for inline-edit hero fields, per-section pencil sheets, avatar/cover picker.
// Top 5 Schools ladder lives in Top5Ladder.tsx. All writes go through profile.updateField.

const C = {
  blue: "#00A3FF",
  gold: "#D4AF37",
  border: "#1F3257",
  text: "#FFFFFF",
  textMuted: "#B7C3D9",
  textFaint: "#6B7A99",
  surface: "#0F1E36",
  elevated: "#142544",
};

// ── Owner gate: only show pencil buttons to the profile owner ─────────────────
export function useIsOwner(profileUserId: number | null | undefined): boolean {
  const meQ = trpc.profile.getMyProfile.useQuery(undefined, {
    staleTime: 60_000,
  });
  if (!profileUserId) return false;
  const meId = (meQ.data as any)?.userId ?? (meQ.data as any)?.id;
  return !!meId && Number(meId) === Number(profileUserId);
}

// ── Pencil button ─────────────────────────────────────────────────────────────
export function PencilButton({
  onClick,
  label,
  ariaLabel,
}: {
  onClick?: () => void;
  label?: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "transparent",
        border: `1px solid ${C.border}`,
        color: C.textMuted,
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: 0.5,
      }}
    >
      <Pencil style={{ width: 12, height: 12 }} />
      {label ?? "Edit"}
    </button>
  );
}

// ── Inline text field (click to edit, Enter to save, Esc to cancel) ──────────
export function InlineField({
  field,
  value,
  placeholder,
  onSaved,
  multiline,
  textStyle,
}: {
  field: string;
  value: string | number | null | undefined;
  placeholder?: string;
  onSaved?: (newValue: string) => void;
  multiline?: boolean;
  textStyle?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(value == null ? "" : String(value));
  const [saving, setSaving] = useState(false);
  const update = trpc.profile.updateField.useMutation();

  useEffect(() => {
    setDraft(value == null ? "" : String(value));
  }, [value]);

  const commit = async () => {
    if (draft === (value == null ? "" : String(value))) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await update.mutateAsync({ field, value: draft });
      onSaved?.(draft);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };
  const cancel = () => {
    setDraft(value == null ? "" : String(value));
    setEditing(false);
  };

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        style={{
          cursor: "text",
          borderBottom: `1px dashed ${C.textFaint}`,
          paddingBottom: 1,
          ...textStyle,
        }}
        title="Click to edit"
      >
        {value == null || value === "" ? (
          <span style={{ color: C.textFaint, fontStyle: "italic" }}>
            {placeholder ?? "Click to add"}
          </span>
        ) : (
          String(value)
        )}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {multiline ? (
        <Textarea
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={3}
          style={{ minWidth: 280, background: C.elevated, color: C.text, border: `1px solid ${C.blue}` }}
        />
      ) : (
        <Input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          style={{ minWidth: 200, background: C.elevated, color: C.text, border: `1px solid ${C.blue}` }}
        />
      )}
      <Button
        size="sm"
        onClick={commit}
        disabled={saving}
        style={{ background: C.blue, color: C.text }}
        aria-label="Save"
      >
        <Check style={{ width: 14, height: 14 }} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={cancel}
        disabled={saving}
        style={{ color: C.textMuted }}
        aria-label="Cancel"
      >
        <X style={{ width: 14, height: 14 }} />
      </Button>
    </span>
  );
}

// ── Pencil sheet — per-section drawer with multiple fields ────────────────────
type SheetField = {
  field: string;
  label: string;
  type?: "text" | "number" | "textarea";
  placeholder?: string;
};

export function PencilSheet({
  trigger,
  title,
  fields,
  currentValues,
  onSaved,
}: {
  trigger: React.ReactNode;
  title: string;
  fields: SheetField[];
  currentValues: Record<string, any>;
  onSaved?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const update = trpc.profile.updateField.useMutation();

  useEffect(() => {
    if (open) {
      const next: Record<string, string> = {};
      for (const f of fields) {
        const v = currentValues[f.field];
        next[f.field] = v == null ? "" : String(v);
      }
      setDraft(next);
    }
  }, [open, fields, currentValues]);

  const save = async () => {
    setSaving(true);
    try {
      for (const f of fields) {
        const old = currentValues[f.field];
        const oldStr = old == null ? "" : String(old);
        const newStr = draft[f.field] ?? "";
        if (oldStr === newStr) continue;
        const value =
          f.type === "number" && newStr !== "" ? Number(newStr) : newStr;
        await update.mutateAsync({ field: f.field, value });
      }
      onSaved?.();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        style={{ background: C.surface, color: C.text, borderColor: C.border, width: 440, maxWidth: "100%" }}
      >
        <SheetHeader>
          <SheetTitle style={{ color: C.text }}>{title}</SheetTitle>
        </SheetHeader>
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map(f => (
            <div key={f.field} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label style={{ color: C.textMuted, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
                {f.label}
              </Label>
              {f.type === "textarea" ? (
                <Textarea
                  value={draft[f.field] ?? ""}
                  onChange={e => setDraft(d => ({ ...d, [f.field]: e.target.value }))}
                  placeholder={f.placeholder}
                  rows={4}
                  style={{ background: C.elevated, color: C.text, border: `1px solid ${C.border}` }}
                />
              ) : (
                <Input
                  type={f.type === "number" ? "number" : "text"}
                  value={draft[f.field] ?? ""}
                  onChange={e => setDraft(d => ({ ...d, [f.field]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ background: C.elevated, color: C.text, border: `1px solid ${C.border}` }}
                />
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Button
              onClick={save}
              disabled={saving}
              style={{ background: C.blue, color: C.text, flex: 1 }}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
              style={{ borderColor: C.border, color: C.textMuted }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Avatar / cover photo picker (curated library OR upload) ───────────────────
export function PhotoPicker({
  trigger,
  kind,
  currentUrl,
  field,
  choiceKeyField,
  onSaved,
}: {
  trigger: React.ReactNode;
  kind: "avatar" | "cover";
  currentUrl?: string | null;
  field: "headshotUrl" | "coverUrl"; // which URL column to write
  choiceKeyField: "avatarChoiceKey" | "coverChoiceKey";
  onSaved?: (url: string, choiceKey: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");

  const libraryQ = trpc.profile.listAvatarLibrary.useQuery(
    { kind },
    { enabled: open }
  );
  const update = trpc.profile.updateField.useMutation();
  const getUpload = trpc.profile.getPhotoUploadUrl.useMutation();

  const pickLibrary = async (item: { key: string; imageUrl: string }) => {
    await update.mutateAsync({ field, value: item.imageUrl });
    await update.mutateAsync({ field: choiceKeyField, value: item.key });
    onSaved?.(item.imageUrl, item.key);
    setOpen(false);
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const sig = await getUpload.mutateAsync({
        kind,
        filename: file.name,
        contentType: file.type || "image/jpeg",
      });
      const put = await fetch(sig.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!put.ok) throw new Error("Upload failed");
      await update.mutateAsync({ field, value: sig.readUrl });
      await update.mutateAsync({ field: choiceKeyField, value: null });
      onSaved?.(sig.readUrl, null);
      setOpen(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        style={{ background: C.surface, color: C.text, borderColor: C.border, width: 520, maxWidth: "100%", overflowY: "auto" }}
      >
        <SheetHeader>
          <SheetTitle style={{ color: C.text }}>
            {kind === "avatar" ? "Profile photo" : "Cover photo"}
          </SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: 20, display: "flex", gap: 6, borderBottom: `1px solid ${C.border}` }}>
          {(["library", "upload"] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                background: "transparent",
                border: "none",
                color: activeTab === t ? C.text : C.textMuted,
                borderBottom: `2px solid ${activeTab === t ? C.blue : "transparent"}`,
                padding: "10px 14px",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 1,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {t === "library" ? <><ImageIcon style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: -2 }} />Library</> : <><Upload style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: -2 }} />Upload</>}
            </button>
          ))}
        </div>

        {activeTab === "library" ? (
          <div style={{ marginTop: 16 }}>
            {libraryQ.isLoading ? (
              <div style={{ color: C.textMuted, fontSize: 13 }}>Loading library…</div>
            ) : (libraryQ.data ?? []).length === 0 ? (
              <div style={{ color: C.textMuted, fontSize: 13 }}>
                Library is being curated. Use Upload for now.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: kind === "avatar" ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                  gap: 10,
                }}
              >
                {(libraryQ.data as any[]).map((item: any) => (
                  <button
                    key={item.key}
                    onClick={() => pickLibrary(item)}
                    style={{
                      background: C.elevated,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: 6,
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.thumbnailUrl ?? item.imageUrl}
                      alt={item.label}
                      style={{
                        width: "100%",
                        aspectRatio: kind === "avatar" ? "1 / 1" : "3 / 1",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, textAlign: "center" }}>
                      {item.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 20 }}>
            {currentUrl ? (
              <img
                src={currentUrl}
                alt="Current"
                style={{
                  width: "100%",
                  aspectRatio: kind === "avatar" ? "1 / 1" : "3 / 1",
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 12,
                  border: `1px solid ${C.border}`,
                }}
              />
            ) : null}
            <Label
              style={{
                display: "block",
                padding: "32px 16px",
                border: `2px dashed ${C.border}`,
                borderRadius: 8,
                textAlign: "center",
                cursor: uploading ? "wait" : "pointer",
                color: C.textMuted,
              }}
            >
              <Upload style={{ width: 24, height: 24, margin: "0 auto 8px", display: "block" }} />
              {uploading ? "Uploading…" : "Click or drop an image"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                disabled={uploading}
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                }}
              />
            </Label>
            <div style={{ marginTop: 12, fontSize: 11, color: C.textFaint, lineHeight: 1.5 }}>
              JPG or PNG. Square works best for profile photos. Wide (3:1) works best for cover photos.
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
