import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { CheckCircle, X } from "lucide-react";
import MeetAthletes from "@/components/MeetAthletes";
import ConsentGate from "@/components/ConsentGate";

// ─── Role Definitions ─────────────────────────────────────────────────────────
export const ROLES = [
  { id: "athlete", label: "Athlete", emoji: "🏆", desc: "I'm the player" },
  { id: "parent", label: "Parent", emoji: "👨‍👩‍👧", desc: "Supporting my child" },
  { id: "coach", label: "Coach", emoji: "📋", desc: "I coach athletes" },
  { id: "agent", label: "Agent", emoji: "🤝", desc: "I represent athletes" },
  { id: "friend", label: "Friend", emoji: "👫", desc: "Supporting a friend" },
  { id: "fan", label: "Fan", emoji: "📣", desc: "I follow athletes" },
  { id: "brand", label: "Brand", emoji: "🏢", desc: "We want NIL deals" },
  { id: "sponsor", label: "Sponsor", emoji: "💰", desc: "I sponsor athletes" },
  { id: "financial_advisor", label: "Financial Advisor", emoji: "📊", desc: "I manage athlete finances" },
  { id: "pastor", label: "Pastor / Chaplain", emoji: "✝️", desc: "Spiritual support" },
  { id: "sibling", label: "Sibling", emoji: "👥", desc: "Supporting my sibling" },
  { id: "medical_doctor", label: "Doctor (MD)", emoji: "🩺", desc: "Athlete medical care" },
  { id: "physical_therapist", label: "Physical Therapist", emoji: "🦴", desc: "Rehab & recovery" },
  { id: "trainer", label: "Personal Trainer", emoji: "💪", desc: "I train athletes" },
  { id: "scout", label: "Scout / Recruiter", emoji: "🔭", desc: "I find talent" },
  { id: "media", label: "Media / Journalist", emoji: "🎙️", desc: "I cover athletes" },
  { id: "nutritionist", label: "Nutritionist", emoji: "🥗", desc: "Athlete nutrition" },
  { id: "mental_coach", label: "Mental Performance Coach", emoji: "🧠", desc: "Mental skills training" },
] as const;

export type RoleId = typeof ROLES[number]["id"];

// ─── Component ────────────────────────────────────────────────────────────────
interface AIOnboardingProps {
  onComplete: (data: Record<string, string>) => void;
  onDismiss?: () => void;
}

export default function AIOnboarding({ onComplete, onDismiss }: AIOnboardingProps) {
  // "consent" is the FIRST step — required before anything else
  const [step, setStep] = useState<"consent" | "welcome" | "role" | "activating" | "meet">("consent");
  const [activationStep, setActivationStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  // Check if user already signed consent — skip ConsentGate if already done
  const { data: me } = trpc.auth.me.useQuery(undefined, { retry: false, staleTime: 60_000 });
  useEffect(() => {
    if (me && (me as any).hipaaConsentSigned === 1) {
      // Already consented — skip to welcome
      setStep("welcome");
    }
  }, [me]);

  const saveOnboarding = trpc.profile.saveOnboarding.useMutation({
    onSuccess: () => { runActivation(); },
    onError: () => { runActivation(); },
  });

  // Cinematic welcome auto-advance
  useEffect(() => {
    if (step === "welcome") {
      const t = setTimeout(() => setStep("role"), 3200);
      return () => clearTimeout(t);
    }
  }, [step]);

  const runActivation = () => {
    setStep("activating");
    const totalSteps = 5;
    for (let i = 0; i < totalSteps; i++) {
      setTimeout(() => {
        setActivationStep(i + 1);
        if (i === totalSteps - 1) {
          setTimeout(() => {
            setStep("meet");
          }, 800);
        }
      }, i * 700);
    }
  };

  const handleRoleSelect = (roleId: RoleId) => {
    setSelectedRole(roleId);
    saveOnboarding.mutate({ role: roleId, data: {} });
  };

  // ── CONSENT GATE ── Required first step — HIPAA + Medical Waiver + Data Rights
  if (step === "consent") {
    return (
      <ConsentGate
        userName={(me as any)?.name ?? ""}
        onComplete={() => setStep("welcome")}
      />
    );
  }

  // ── WELCOME SCREEN ── Cinematic intro
  if (step === "welcome") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020812]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-indigo-900/30" />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,100,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="mb-6">
            <img src="/img-athlete-multisport.jpg" alt="AthlynX" className="w-20 h-20 rounded-2xl mx-auto shadow-2xl shadow-blue-500/30" style={{ animation: "bounce 2s infinite" }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AthlynX</span>
          </h1>
          <p className="text-blue-300 text-lg font-medium mb-2">The Athlete's Playbook</p>
          <p className="text-blue-500 text-sm mb-6">Building your personalized experience...</p>
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── ACTIVATION SCREEN ── Real-time profile building
  if (step === "activating") {
    const activationSteps = [
      { text: "Securing your account", icon: "🔐" },
      { text: "Building your profile", icon: "🏆" },
      { text: "Activating your AI Trainer", icon: "🤖" },
      { text: "Connecting you to the platform", icon: "📊" },
      { text: "You're ready. Welcome to AthlynX", icon: "🚀" },
    ];
    return (
      <div className="fixed inset-0 z-[100] bg-[#020812] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/20" />
        <div className="relative z-10 w-full max-w-sm px-6 text-center">
          <div className="mb-6">
            <img src="/img-athlete-multisport.jpg" alt="AthlynX" className="w-16 h-16 rounded-2xl mx-auto shadow-2xl shadow-blue-500/30" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Building Your Profile</h2>
          <p className="text-blue-400 text-sm mb-8">Your AthlynX journey starts now.</p>
          <div className="space-y-3 mb-8">
            {activationSteps.map((s, i) => {
              const done = activationStep > i;
              const active = activationStep === i;
              return (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                  done ? "bg-blue-600/20 border border-blue-500/30" :
                  active ? "bg-blue-900/30 border border-blue-700/30" :
                  "opacity-30"
                }`}>
                  <div className={`text-xl ${done ? "" : active ? "animate-bounce" : ""}`}>
                    {done ? "✅" : s.icon}
                  </div>
                  <span className={`text-sm font-semibold flex-1 text-left ${
                    done ? "text-white" : active ? "text-blue-300" : "text-blue-700"
                  }`}>{s.text}</span>
                  {done && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                </div>
              );
            })}
          </div>
          <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${(activationStep / activationSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Role Selection ── (single question — the only question)
  if (step === "role") {
    return (
      <div className="fixed inset-0 z-50 bg-[#050c1a] backdrop-blur-sm flex items-end md:items-center justify-center p-4">
        <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-900/50">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-t-3xl p-5 text-center">
            {onDismiss && (
              <button onClick={onDismiss} className="absolute top-4 right-4 text-blue-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="text-4xl mb-2">🤖</div>
            <h2 className="text-xl font-black text-white">Welcome to AthlynX!</h2>
            <p className="text-blue-200 text-sm mt-1">I'm your AI Trainer. First — who are you?</p>
          </div>

          <div className="p-5">
            {saveOnboarding.isPending ? (
              <div className="flex items-center justify-center py-12 gap-3 text-blue-300">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold">Setting up your profile...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-900 border border-blue-800/40 hover:bg-blue-800/50 hover:border-blue-600/60 transition-all text-left group"
                  >
                    <span className="text-2xl shrink-0">{role.emoji}</span>
                    <div>
                      <div className="font-bold text-white text-sm leading-tight">{role.label}</div>
                      <div className="text-blue-400 text-xs">{role.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {onDismiss && !saveOnboarding.isPending && (
              <button onClick={onDismiss} className="w-full mt-4 text-blue-500 text-sm hover:text-blue-300 transition-colors py-2">
                Skip for now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Meet Athletes Step ──
  if (step === "meet") {
    return (
      <div className="fixed inset-0 z-50 bg-[#050c1a] backdrop-blur-sm overflow-y-auto">
        <div className="min-h-screen flex items-start justify-center p-4 pt-8">
          <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-3xl w-full max-w-2xl shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-t-3xl p-6 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-2xl font-black text-white">You're In! Meet Your Athletes</h2>
              <p className="text-blue-200 text-sm mt-1">Connect with athletes in your sport, at your school, and around the world.</p>
            </div>
            <div className="p-6">
              <MeetAthletes variant="onboarding" showCoaches={true} />
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => { onComplete({}); window.location.href = "/portal"; }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black py-4 rounded-2xl text-lg hover:scale-105 transition-all"
                >
                  Enter the Platform →
                </button>
              </div>
              <button
                onClick={() => { onComplete({}); window.location.href = "/browse-athletes"; }}
                className="w-full mt-3 text-blue-400 text-sm hover:text-white transition-colors"
              >
                See all athletes →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Done fallback ──
  return (
    <div className="fixed inset-0 z-50 bg-[#050c1a] backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1a3a] border border-green-700/50 rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
        <div className="text-6xl mb-4">🎉</div>
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h2 className="text-2xl font-black text-white mb-2">You're In!</h2>
        <p className="text-blue-300 mb-4">Profile set up. Welcome to AthlynX.</p>
      </div>
    </div>
  );
}
