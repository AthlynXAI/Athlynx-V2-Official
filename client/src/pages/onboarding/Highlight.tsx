import { useState } from "react";
import { OnboardingShell, onboardingStyles as S, ONBOARDING_COLORS as C } from "./_shell";
import { trpc } from "@/lib/trpc";

const ACCEPTED = [/youtube\.com|youtu\.be/, /hudl\.com/, /maxpreps\.com/, /vimeo\.com/, /instagram\.com/];

export default function Highlight() {
  const [url, setUrl] = useState("");
  const updateField = trpc.profile.updateField.useMutation();
  const ok = ACCEPTED.some(re => re.test(url));

  return (
    <OnboardingShell
      step="highlight"
      title="Drop your highlight reel"
      subtitle="Paste a Hudl, YouTube, MaxPreps, Vimeo, or Instagram link."
      continueDisabled={!ok || updateField.isPending}
      onContinue={async () => {
        if (url) await updateField.mutateAsync({ field: "highlightUrl", value: url.trim() });
      }}
    >
      <label style={S.label}>Highlight URL</label>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtu.be/..." style={S.input} />
      {!ok && url.length > 0 && (
        <div style={{ color: C.textMuted, fontSize: 12, marginTop: 10 }}>
          Use a Hudl, YouTube, MaxPreps, Vimeo, or Instagram link.
        </div>
      )}
    </OnboardingShell>
  );
}
