import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  OnboardingShell,
  ONBOARDING_COLORS as C,
  onboardingStyles as S,
} from "./_shell";

// TODO: schema column athleteProfiles.headshotUrl — for Build 1 we reuse coverUrl/avatarUrl.

export default function Headshot() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestUpload = trpc.media.requestUpload.useMutation();
  const updateField = trpc.profile.updateField.useMutation();

  async function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const presign = await requestUpload.mutateAsync({
        kind: "headshot",
        filename: file.name,
        contentType: file.type || "image/jpeg",
      });
      const putResp = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!putResp.ok) throw new Error(`Upload failed: ${putResp.status}`);
      setUploadedUrl(presign.readUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <OnboardingShell
      step="headshot"
      title="Add your headshot"
      subtitle="Front-facing, shoulders up. You can change it any time."
      continueDisabled={busy}
      onContinue={async () => {
        if (uploadedUrl) {
          // Build 2: write to dedicated headshotUrl column. coverUrl mirror kept for older readers.
          await updateField.mutateAsync({
            field: "headshotUrl",
            value: uploadedUrl,
          });
          await updateField
            .mutateAsync({ field: "coverUrl", value: uploadedUrl })
            .catch(() => {});
        }
      }}
    >
      {uploadedUrl ? (
        <img
          src={uploadedUrl}
          alt="Uploaded headshot"
          style={{
            width: 180,
            height: 180,
            borderRadius: 12,
            objectFit: "cover",
            border: `2px solid ${C.blue}`,
          }}
        />
      ) : (
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 12,
            border: `2px dashed ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.textMuted,
            fontSize: 13,
          }}
        >
          No headshot yet
        </div>
      )}
      <label style={{ ...S.label, marginTop: 16, display: "block" }}>
        Upload from device
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={pickFile}
        disabled={busy}
        style={{ color: C.textSecondary }}
      />
      {busy && (
        <div style={{ color: C.textMuted, marginTop: 12, fontSize: 13 }}>
          Uploading…
        </div>
      )}
      {error && (
        <div style={{ color: "#fca5a5", marginTop: 12, fontSize: 13 }}>
          {error}
        </div>
      )}
    </OnboardingShell>
  );
}
