import { useState } from "react";
import { OnboardingShell, onboardingStyles as S } from "./_shell";
import { trpc } from "@/lib/trpc";

const SPORTS = ["Football", "Baseball", "Basketball", "Soccer", "Track & Field", "Lacrosse", "Volleyball", "Softball", "Wrestling", "Cross Country"];

export default function Sport() {
  const [sport, setSport] = useState<string>("");
  const updateField = trpc.profile.updateField.useMutation();

  return (
    <OnboardingShell
      step="sport"
      title="What's your sport?"
      subtitle="Pick the one you're known for. You can add more later."
      continueDisabled={!sport || updateField.isPending}
      onContinue={async () => {
        if (sport) await updateField.mutateAsync({ field: "sport", value: sport });
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {SPORTS.map(s => (
          <button key={s} type="button" onClick={() => setSport(s)} style={S.chip(sport === s)}>
            {s}
          </button>
        ))}
      </div>
    </OnboardingShell>
  );
}
