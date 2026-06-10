// AthlynXAI OS v1 — Beta Signup / User Acquisition Page
// High-converting landing page for real user onboarding.
// Routes: /beta, /join, /get-started, /sign-up
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const SPORTS = [
  "Baseball", "Softball", "Football", "Basketball", "Soccer",
  "Track & Field", "Swimming", "Tennis", "Golf", "Wrestling",
  "Volleyball", "Lacrosse", "Hockey", "Gymnastics", "Cross Country",
  "Rowing", "Water Polo", "Field Hockey", "Cheer", "Other",
];

const ROLES = [
  { id: "athlete", label: "Athlete", icon: "", desc: "I'm competing or training" },
  { id: "coach", label: "Coach", icon: "", desc: "I coach athletes or teams" },
  { id: "recruiter", label: "Recruiter / Scout", icon: "", desc: "I evaluate and recruit talent" },
  { id: "parent", label: "Parent / Guardian", icon: "", desc: "Supporting my athlete" },
  { id: "agent", label: "Agent / Advisor", icon: "", desc: "I represent athletes" },
  { id: "brand", label: "Brand / Sponsor", icon: "", desc: "I partner with athletes" },
];

const BENEFITS = [
  { icon: "", title: "AthlynXAI OS v1", desc: "The first fully autonomous athlete operating system. Powered by Nebius H200." },
  { icon: "", title: "NIL Portal", desc: "Find deals, track earnings, and manage your NIL brand — all in one place." },
  { icon: "", title: "AI Recruiting Hub", desc: "AI-powered recruiting tools that match you with the right programs and coaches." },
  { icon: "", title: "iOS & Android App", desc: "Native mobile app with push notifications, offline mode, and biometric auth." },
  { icon: "", title: "AI Training Bot", desc: "Personalized training plans built by AI, adapted to your sport and position." },
  { icon: "", title: "Athlete Dashboard", desc: "Track your stats, highlights, and recruiting activity in real time." },
];

export default function BetaSignup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"role" | "info" | "sport" | "done">("role");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signupMutation = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      setStep("done");
    },
    onError: (err) => {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    },
  });

  const handleSubmit = async () => {
    if (!email || !name) {
      setError("Please fill in your name and email.");
      return;
    }
    setLoading(true);
    setError("");
    signupMutation.mutate({ email, name, role, sport, phone });
  };

  const shareUrl = "https://athlynx.ai/beta";
  const shareText = "I just joined the AthlynXAI beta — the first autonomous athlete OS. 1 Man. 1 AI. $1B. BE THE LEGACY. Join me:";

  if (step === "done") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6"></div>
          <h1 className="text-3xl font-black mb-3">You're In.</h1>
          <p className="text-white/60 mb-8">Welcome to AthlynXAI. You're now part of the first autonomous athlete OS. We'll send your access link to <strong className="text-white">{email}</strong>.</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <p className="text-white/60 text-sm mb-4">Share with your teammates and get early access faster:</p>
            <div className="flex gap-3 justify-center">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 text-[#1DA1F2] rounded-lg text-sm font-bold hover:bg-[#1DA1F2]/30 transition-colors"
              >
                 Share
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-[#1E90FF]/20 border border-[#1E90FF]/30 text-[#1E90FF] rounded-lg text-sm font-bold hover:bg-[#1E90FF]/30 transition-colors"
              >
                 Instagram
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(`${shareText} ${shareUrl}`); }}
                className="flex-1 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-bold hover:bg-white/20 transition-colors"
              >
                 Copy
              </button>
            </div>
          </div>
          <Link href="/" className="inline-block px-6 py-3 bg-[#1E90FF] text-white rounded-xl font-bold hover:bg-[#1E90FF]/80 transition-colors">
            Enter the Platform →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <div className="border-b border-white/10 px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl"></span>
          <span className="font-black text-lg tracking-tight">AthlynX</span>
        </Link>
        <Link href="/signin" className="text-white/50 hover:text-white text-sm transition-colors">
          Already have an account? Sign in →
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Value Prop */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-full text-[#1E90FF] text-xs font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E90FF] animate-pulse" />
              BETA ACCESS — LIMITED SPOTS
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              The First Autonomous<br />
              <span className="text-[#1E90FF]">Athlete OS.</span>
            </h1>
            <p className="text-white/60 text-lg mb-2">1 Man. 1 AI. $1 Billion.</p>
            <p className="text-white/40 text-sm mb-8">Powered by Nebius H200 · AthlynXAI OS v1 · BE THE LEGACY</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map(b => (
                <div key={b.title} className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-2xl flex-shrink-0">{b.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{b.title}</div>
                    <div className="text-white/50 text-xs mt-0.5">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["", "", "", "", ""].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm">
                    {e}
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-sm"><strong className="text-white">2,400+ athletes</strong> already on the waitlist</p>
            </div>
          </div>

          {/* Right — Signup Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {["role", "info", "sport"].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                  step === s ? "bg-[#1E90FF]" :
                  (step === "info" && i === 0) || (step === "sport" && i <= 1) || step === "done" ? "bg-[#1E90FF]/50" :
                  "bg-white/10"
                }`} />
              ))}
            </div>

            {/* Step 1: Role */}
            {step === "role" && (
              <div>
                <h2 className="text-xl font-black mb-1">I am a...</h2>
                <p className="text-white/50 text-sm mb-6">Select your role to personalize your experience</p>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { setRole(r.id); setStep("info"); }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:border-[#1E90FF]/50 hover:bg-[#1E90FF]/5 transition-all group"
                    >
                      <div className="text-2xl mb-2">{r.icon}</div>
                      <div className="font-semibold text-sm group-hover:text-[#1E90FF] transition-colors">{r.label}</div>
                      <div className="text-white/40 text-xs mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Info */}
            {step === "info" && (
              <div>
                <h2 className="text-xl font-black mb-1">Create your account</h2>
                <p className="text-white/50 text-sm mb-6">You'll use this to log in to AthlynXAI</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Chad Dozier"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@athlynx.ai"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-1.5">Phone (optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (601) 555-0100"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                  </div>
                  {error && <p className="text-[#1E90FF] text-sm">{error}</p>}
                  <button
                    onClick={() => { if (email && name) setStep("sport"); else setError("Please fill in your name and email."); }}
                    className="w-full py-3 bg-[#1E90FF] text-white rounded-xl font-bold hover:bg-[#1E90FF]/80 transition-colors"
                  >
                    Continue →
                  </button>
                  <button onClick={() => setStep("role")} className="w-full text-center text-white/40 text-sm hover:text-white/60 transition-colors">
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Sport */}
            {step === "sport" && (
              <div>
                <h2 className="text-xl font-black mb-1">Your sport</h2>
                <p className="text-white/50 text-sm mb-6">We'll personalize your experience for your sport</p>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto mb-4">
                  {SPORTS.map(s => (
                    <button
                      key={s}
                      onClick={() => setSport(s)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold text-left transition-all ${sport === s ? "bg-[#1E90FF] text-white" : "bg-white/5 border border-white/10 text-white/70 hover:border-[#1E90FF]/50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {error && <p className="text-[#1E90FF] text-sm mb-3">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 bg-[#1E90FF] text-white rounded-xl font-bold hover:bg-[#1E90FF]/80 transition-colors disabled:opacity-50"
                >
                  {loading ? "Joining..." : "Join Beta — BE THE LEGACY "}
                </button>
                <button onClick={() => setStep("info")} className="w-full mt-2 text-center text-white/40 text-sm hover:text-white/60 transition-colors">
                  ← Back
                </button>
              </div>
            )}

            <p className="text-white/30 text-xs text-center mt-6">
              By joining, you agree to our{" "}
              <Link href="/terms" className="text-white/50 hover:text-white underline">Terms</Link> and{" "}
              <Link href="/privacy" className="text-white/50 hover:text-white underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
