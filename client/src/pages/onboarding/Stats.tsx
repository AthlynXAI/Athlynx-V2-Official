import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  OnboardingShell,
  onboardingStyles as S,
  ONBOARDING_COLORS as C,
} from "./_shell";

export default function StatsScreenshot() {
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
        kind: "stats_screenshot",
        filename: file.name,
        contentType: file.type || "image/png",
      });
      const putResp = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/png" },
        body: file,
      });
      if (!putResp.ok) throw new Error(`Upload failed: ${putResp.status}`);
      setUploadedUrl(presign.readUrl);
      await updateField
        .mutateAsync({ field: "statScreenshotUrl", value: presign.readUrl })
        .catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <OnboardingShell
      step="stats"
      title="Drop a stats screenshot"
      subtitle="MaxPreps, Perfect Game, team sheet — Coach Lynx will read it."
      continueDisabled={busy}
    >
      <input
        type="file"
        accept="image/*"
        onChange={pickFile}
        disabled={busy}
        style={{ color: C.textSecondary }}
      />
      {uploadedUrl && (
        <img
          src={uploadedUrl}
          alt="Stats"
          style={{
            marginTop: 16,
            maxWidth: "100%",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
          }}
        />
      )}
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
      <p style={{ ...S.label, marginTop: 20 }}>
        You can skip this for now and add it later.
      </p>
    </OnboardingShell>
  );
}
