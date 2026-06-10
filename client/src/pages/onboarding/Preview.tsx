import { OnboardingShell, ONBOARDING_COLORS as C } from "./_shell";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Preview() {
  const profileQuery = trpc.profile.getMyProfile.useQuery();
  const profile = profileQuery.data as any;
  const updateField = trpc.profile.updateField.useMutation();
  const [going, setGoing] = useState(false);

  return (
    <OnboardingShell
      step="preview"
      title="Here's what coaches see"
      subtitle="Tap any section later to refine. When you're ready, go live."
      continueLabel={going ? "Going live..." : "Looks good — go live"}
      continueDisabled={going}
      onContinue={async () => {
        setGoing(true);
        try {
          await updateField.mutateAsync({ field: "published", value: true });
        } catch {
          // non-blocking; SigningDay will flip it too
        } finally {
          setGoing(false);
        }
      }}
    >
      <div
        style={{
          background: C.base,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div
          style={{
            color: C.textMuted,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Profile preview
        </div>
        <h2
          style={{
            color: C.white,
            fontWeight: 800,
            fontSize: 24,
            margin: "10px 0",
          }}
        >
          {profile?.name ?? "Your name"}
        </h2>
        <div style={{ color: C.textSecondary, fontSize: 14 }}>
          {profile?.position ?? "—"} · Class of {profile?.classYear ?? "—"}
        </div>
        <div style={{ color: C.textSecondary, fontSize: 14 }}>
          {profile?.school ?? "—"}
          {profile?.state ? ` · ${profile.state}` : ""}
        </div>
        <div style={{ color: C.textSecondary, fontSize: 14, marginTop: 6 }}>
          {profile?.height ?? "—"} ·{" "}
          {profile?.weight ? `${profile.weight} lbs` : "—"}
        </div>
        {profile?.highlightUrl && (
          <div
            style={{
              marginTop: 12,
              color: C.blue,
              fontSize: 13,
              wordBreak: "break-all",
            }}
          >
            Highlight: {profile.highlightUrl}
          </div>
        )}
      </div>
    </OnboardingShell>
  );
}
