import { useState } from "react";
import { OnboardingShell, onboardingStyles as S } from "./_shell";
import { trpc } from "@/lib/trpc";

export default function Measurements() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const updateField = trpc.profile.updateField.useMutation();

  return (
    <OnboardingShell
      step="measurements"
      title="Height and weight"
      subtitle="What's on the camp roster. We never inflate numbers."
      continueDisabled={updateField.isPending}
      onContinue={async () => {
        if (height) await updateField.mutateAsync({ field: "height", value: height.trim() });
        const w = parseInt(weight, 10);
        if (Number.isFinite(w)) await updateField.mutateAsync({ field: "weight", value: w });
      }}
    >
      <div>
        <label style={S.label}>Height</label>
        <input value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 6'2&quot;" style={S.input} />
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={S.label}>Weight (lbs)</label>
        <input value={weight} onChange={e => setWeight(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="e.g. 195" style={S.input} inputMode="numeric" />
      </div>
    </OnboardingShell>
  );
}
