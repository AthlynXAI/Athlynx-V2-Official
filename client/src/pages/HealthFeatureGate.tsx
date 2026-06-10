import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

type HealthFeatureGateProps = {
  title: string;
  eyebrow: string;
  description: string;
};

function HealthFeatureGateInner({ title, eyebrow, description }: HealthFeatureGateProps) {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07111f] via-[#0b1b34] to-[#0f3460] text-white">
      <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-black tracking-tight text-white">AthlynX</Link>
          <Link href="/digital-health" className="rounded-xl border border-[#1E90FF]/30 px-4 py-2 text-sm font-bold text-[#00C2FF] hover:border-[#1E90FF] hover:text-white">
            Digital Health Hub
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-4xl items-center px-4 py-16">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/20 md:p-12">
          <span className="mb-5 inline-block rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-4 py-1 text-sm font-bold text-[#00C2FF]">
            {eyebrow}
          </span>
          <h1 className="mb-5 text-4xl font-black md:text-6xl">{title}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-300">{description}</p>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-gray-300">Checking your AthlynX session…</div>
          ) : user ? (
            <div className="rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 p-6">
              <h2 className="mb-2 text-2xl font-black text-white">Coming soon — connecting your medical-grade insights</h2>
              <p className="text-gray-300">This Phase 1 surface is safe and ready. Deeper personalized wiring begins only after Chad-approved Phase 2 verification.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
              <h2 className="mb-2 text-2xl font-black text-white">Sign in to track yours</h2>
              <p className="mb-6 text-gray-300">Your private athlete health, wellness, training, and AI support surfaces live behind your AthlynX account.</p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/signin" className="rounded-xl bg-[#1E90FF] px-6 py-3 font-black text-[#07111f] hover:bg-[#1E90FF]">Sign In</Link>
                <Link href="/signup" className="rounded-xl bg-white/10 px-6 py-3 font-black text-white hover:bg-white/20">Create Account</Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default function HealthFeatureGate(props: HealthFeatureGateProps) {
  return <RouteErrorBoundary><HealthFeatureGateInner {...props} /></RouteErrorBoundary>;
}

export function MedicalGate() {
  return <HealthFeatureGate title="Medical" eyebrow="ATHLETE HEALTH" description="Sign in to manage your athlete health resources, medical journey, and privacy-first wellness support." />;
}

export function MentalHealthGate() {
  return <HealthFeatureGate title="Mental Health" eyebrow="MENTAL PERFORMANCE" description="Sign in to access your athlete mindset, pressure, burnout, and support workflows." />;
}

export function AITrainerGate() {
  return <HealthFeatureGate title="AI Trainer" eyebrow="AI SUPPORT" description="Sign in to access your AI trainer, training plans, and athlete support conversations." />;
}

export function TrainerGate() {
  return <HealthFeatureGate title="Trainer" eyebrow="TRAINING SUPPORT" description="Sign in to access your workouts, schedules, and performance routines." />;
}

export function FuelBotsGate() {
  return <HealthFeatureGate title="Fuel Bots" eyebrow="ATHLETE NUTRITION" description="Sign in to access your fueling, nutrition, and performance support workflows." />;
}

export function WellnessGate() {
  return <HealthFeatureGate title="Wellness" eyebrow="RECOVERY & WELLNESS" description="Sign in to track your recovery, wellness, hydration, and athlete support routines." />;
}

export function MindsetGate() {
  return <HealthFeatureGate title="Mindset" eyebrow="MENTAL PERFORMANCE" description="Sign in to build resilience, confidence, and game-day focus inside your AthlynX account." />;
}
