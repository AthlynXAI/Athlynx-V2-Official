import { useState } from "react";
import { OnboardingShell, onboardingStyles as S } from "./_shell";
import { trpc } from "@/lib/trpc";

export default function PositionClass() {
  const [position, setPosition] = useState("");
  const [classYear, setClassYear] = useState("");
  const updateField = trpc.profile.updateField.useMutation();

  const ready = position.trim().length > 0 && classYear.trim().length === 4;

  return (
    <OnboardingShell
      step="position-class"
      title="Position and class year"
      subtitle="Just the basics. Coach Lynx will fill in the rest."
      continueDisabled={!ready || updateField.isPending}
      onContinue={async () => {
        if (position) await updateField.mutateAsync({ field: "position", value: position.trim() });
        if (classYear) await updateField.mutateAsync({ field: "classYear", value: classYear.trim() });
      }}
    >
      <div>
        <label style={S.label}>Position</label>
        <input
          value={position}
          onChange={e => setPosition(e.target.value)}
          placeholder="e.g. QB, WR, PG, LHP"
          style={S.input}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={S.label}>Class of</label>
        <input
          value={classYear}
          onChange={e => setClassYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="e.g. 2027"
          style={S.input}
          inputMode="numeric"
        />
      </div>
    </OnboardingShell>
  );
}
