import { useState } from "react";
import { OnboardingShell, onboardingStyles as S } from "./_shell";
import { trpc } from "@/lib/trpc";

export default function School() {
  const [school, setSchool] = useState("");
  const [state, setState] = useState("");
  const updateField = trpc.profile.updateField.useMutation();

  return (
    <OnboardingShell
      step="school"
      title="Where do you play?"
      subtitle="Your high school or club program. State helps us match scouts in your area."
      continueDisabled={!school.trim() || updateField.isPending}
      onContinue={async () => {
        if (school) await updateField.mutateAsync({ field: "school", value: school.trim() });
        if (state) await updateField.mutateAsync({ field: "state", value: state.trim() });
      }}
    >
      <div>
        <label style={S.label}>School / Program</label>
        <input value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Manvel High School" style={S.input} />
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={S.label}>State</label>
        <input value={state} onChange={e => setState(e.target.value.toUpperCase().slice(0, 2))} placeholder="e.g. TX" style={S.input} />
      </div>
    </OnboardingShell>
  );
}
