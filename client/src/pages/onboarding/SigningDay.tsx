import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  OnboardingShell,
  ONBOARDING_COLORS as C,
  onboardingStyles as S,
} from "./_shell";

export default function SigningDay() {
  const [slots, setSlots] = useState<string[]>(["", "", "", "", ""]);
  const [saving, setSaving] = useState(false);
  const profileQuery = trpc.profile.getMyProfile.useQuery();
  const setTopFive = trpc.recruiting.setTopFive.useMutation();
  const updatePublished = trpc.profile.updateField.useMutation();

  return (
    <OnboardingShell
      step="signing-day"
      title="Five schools you dream about"
      subtitle="Your Signing Day Board. Type names you'd be proud to wear."
      continueLabel={saving ? "Saving..." : "Finish"}
      continueDisabled={saving}
      onContinue={async () => {
        setSaving(true);
        try {
          const colleges = slots
            .map(s => s.trim())
            .filter(Boolean)
            .slice(0, 5);
          const athleteId = profileQuery.data?.id;
          if (athleteId && colleges.length > 0) {
            await setTopFive.mutateAsync({ athleteId, colleges });
          }
          // Flip published flag so the profile goes live.
          await updatePublished
            .mutateAsync({ field: "published", value: true })
            .catch(() => {});
        } finally {
          setSaving(false);
          if (typeof window !== "undefined") {
            window.location.href = "/profile";
          }
        }
      }}
    >
      <div style={{ display: "grid", gap: 12 }}>
        {slots.map((value, i) => (
          <div
            key={i}
            style={{
              background: C.base,
              border: `1px solid ${C.gold ?? "#D4AF37"}`,
              borderRadius: 10,
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: "#D4AF37",
                color: C.base,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}
            >
              {i + 1}
            </div>
            <input
              style={{
                ...S.input,
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              placeholder={`School #${i + 1}`}
              value={value}
              onChange={e => {
                const next = [...slots];
                next[i] = e.target.value;
                setSlots(next);
              }}
            />
          </div>
        ))}
      </div>
    </OnboardingShell>
  );
}
