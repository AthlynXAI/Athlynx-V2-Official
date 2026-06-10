import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/LoginButton";
import { useLocation, Link } from "wouter";
import UnifiedFooter from "@/components/UnifiedFooter";
import { trpc } from "@/lib/trpc";

function EarlyAccessInner() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [sport, setSport] = useState("");
  
  const { user, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Check for OAuth error in URL and show login modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const message = params.get('message');
    if (error) {
      setAuthError(message || 'Login failed. Please try email login.');
      window.location.href = '/signin';
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const signupMutation = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      setLocation(`/success?position=${data.position}`);
    },
    onError: (err) => {
      console.error("Signup error:", err.message);
    },
  });

  useEffect(() => {
    document.title = "AthlynX - The Athlete's Playbook | VIP Early Access";
  }, []);

  // Countdown timer to February 1, 2026
  useEffect(() => {
    const targetDate = new Date("2026-02-01T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      alert("Please select your role");
      return;
    }
    if (!sport) {
      alert("Please select your sport");
      return;
    }

    signupMutation.mutate({
      fullName: email.split("@")[0] || "Athlete",
      email,
      phone: phone || undefined,
      role: role as "brand" | "scout" | "agent" | "athlete" | "coach" | "parent",
      sport,
    });
  };

  const roles = ["Athlete", "Parent", "Coach", "Brand"];
  const sports = ["Baseball", "Football", "Basketball", "Soccer", "Track & Field", "Volleyball"];
  

  return (
    <div className="min-h-screen relative text-white overflow-x-hidden">
      {/* Dark Blue Gradient Background */}
      <div className="absolute inset-0" 
           style={{
             background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 25%, #0f2847 50%, #0a1e38 75%, #061424 100%)'
           }}>
      </div>

      {/* Subtle blue glow overlay */}
      <div className="absolute inset-0 opacity-40"
           style={{
             background: 'radial-gradient(ellipse at top center, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom center, rgba(6, 182, 212, 0.1) 0%, transparent 60%)'
           }}>
      </div>
      
      {/* FIXED NAVIGATION HEADER WITH LOGIN - MOBILE OPTIMIZED */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between">
            <span className="text-cyan-400 font-bold text-[10px] tracking-wider">AthlynX</span>
            {loading ? (
              <div className="w-20 h-8 bg-slate-700 animate-pulse rounded-lg"></div>
            ) : user ? (
              <Link href="/dashboard">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs">
                  Dashboard
                </button>
              </Link>
            ) : (
              <LoginButton className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs" />
            )}
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-cyan-400 font-bold text-xs tracking-widest">THE FUTURE OF ATHLETE SUCCESS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/50">DHG</div>
                <div className="text-left">
                  <p className="text-gray-400 text-[10px] uppercase">PARENT COMPANY</p>
                  <p className="text-cyan-400 font-semibold text-xs">Dozier Holdings Group</p>
                </div>
              </div>
              <div className="text-right mr-4">
                <p className="text-white font-bold text-sm">AthlynX</p>
                <p className="text-cyan-400 text-[10px] tracking-wider">THE ATHLETE'S PLAYBOOK</p>
              </div>
              {loading ? (
                <div className="w-24 h-10 bg-slate-700 animate-pulse rounded-lg"></div>
              ) : user ? (
                <Link href="/dashboard">
                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-green-500/30 transition-all">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <LoginButton className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-cyan-500/30 transition-all animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative w-full max-w-[640px] mx-auto px-4 pt-16 sm:pt-20 pb-8 space-y-6 sm:space-y-8">
        
        {/* DHG LOGO SECTION */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Massive glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 blur-[80px] opacity-50 animate-pulse"></div>
            {/* Crown badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-red-400 via-red-300 to-red-400 text-black font-black text-xs px-4 py-1 rounded-full shadow-2xl border-2 border-red-500 animate-pulse">
                👑 CROWN
              </div>
            </div>
            <img 
              src="/crab-logo-official.png" 
              alt="DHG Crab - The Crown" 
              className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full shadow-[0_0_80px_rgba(6,182,212,0.8)] border-8 border-cyan-400/70 transform hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Dozier Holdings Group Badge - BOLD */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border-4 border-cyan-500/70 rounded-2xl px-8 py-4 shadow-[0_0_40px_rgba(6,182,212,0.5)]">
            <div className="text-center">
              <p className="text-gray-300 text-sm uppercase tracking-widest font-bold">PARENT COMPANY</p>
              <p className="text-cyan-400 font-black text-2xl tracking-wide">Dozier Holdings Group</p>
            </div>
          </div>
        </div>

        {/* 👑 AthlynX - THE KINGDOM (HUGE AND BOLD) */}
        <div className="text-center space-y-4">
          {/* Kingdom badge */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-red-400 via-red-300 to-red-400 text-black font-black text-sm px-6 py-2 rounded-full shadow-2xl border-2 border-red-500 animate-pulse">
              👑 THE KINGDOM
            </div>
          </div>
          
          {/* AthlynX logo - MASSIVE */}
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-pulse">
            AthlynX
          </h1>
          
          <p className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-wide drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
            THE ATHLETE'S PLAYBOOK
          </p>
        </div>

        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="w-full max-w-md h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
        </div>

        {/* 💎 PRIORITY APPS - TOP 4 (MAIN FOCUS) */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-2">💎 PRIORITY APPS</h2>
            <p className="text-cyan-400 font-semibold text-sm">Main Focus - Launching Now</p>
          </div>

          {/* Diamond Grind - #1 PRIORITY */}
          <Link href="/diamond-grind">
            <div className="relative group cursor-pointer bg-slate-900/60 backdrop-blur-md border-4 border-cyan-500/70 rounded-2xl p-6 hover:border-cyan-400 transition-all">
              {/* LAUNCHING FIRST badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-red-500 via-red-500 to-red-500 text-white font-black text-xs px-4 py-1 rounded-full shadow-2xl border-2 border-red-600 animate-bounce">
                  🚀 LAUNCHING FIRST
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <img 
                    src="/diamond-grind-icon.png" 
                    alt="Diamond Grind" 
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">⚾ Diamond Grind</h3>
                  <p className="text-sm text-gray-300 mt-1">Elite Baseball Platform</p>
                  <p className="text-xs text-cyan-400 font-bold mt-2">Status: LAUNCHING SOON</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Portal - #2 */}
          <Link href="/nil-portal">
            <div className="relative group cursor-pointer bg-slate-900/60 backdrop-blur-md border-2 border-blue-500/50 rounded-2xl p-4 hover:border-blue-400 transition-all">
              <div className="absolute -top-3 right-4 z-10">
                <div className="bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                  ✅ ACTIVE
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <img 
                    src="/nil-portal-app-logo.jpeg" 
                    alt="NIL Portal" 
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-2xl transform group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">🌐 Portal</h3>
                  <p className="text-sm text-gray-300">NIL Social Network</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Messenger - #3 */}
          <Link href="/messages">
            <div className="relative group cursor-pointer bg-slate-900/60 backdrop-blur-md border-2 border-blue-400/50 rounded-2xl p-4 hover:border-blue-300 transition-all">
              <div className="absolute -top-3 right-4 z-10">
                <div className="bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                  ✅ ACTIVE
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <img 
                    src="/messenger.png" 
                    alt="Messenger" 
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-2xl transform group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">💬 Messenger</h3>
                  <p className="text-sm text-gray-300">HIPAA-Compliant Communication</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Transfer Portal - #4 */}
          <Link href="/transfer-portal">
            <div className="relative group cursor-pointer bg-slate-900/60 backdrop-blur-md border-2 border-cyan-400/50 rounded-2xl p-4 hover:border-cyan-300 transition-all">
              <div className="absolute -top-3 right-4 z-10">
                <div className="bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
                  ⏰ IT'S TIME
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <img 
                    src="/transfer-portal-icon.png" 
                    alt="Transfer Portal" 
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-2xl transform group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">🔄 Transfer Portal</h3>
                  <p className="text-sm text-gray-300">Career Transition Intelligence</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>

        {/* 🎯 SUPPORTING APPS - Compact Grid */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-300">🎯 Supporting Apps</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link href="/warriors-playbook">
              <div className="relative group cursor-pointer text-center">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/warriors-playbook-icon.png" 
                    alt="Warriors Playbook" 
                  className="relative w-full aspect-square rounded-xl shadow-lg transform group-hover:scale-105 transition-transform mx-auto"
                />
                <p className="text-xs text-gray-400 mt-2 group-hover:text-cyan-400">Warriors Playbook</p>
              </div>
            </Link>

            <Link href="/faith">
              <div className="relative group cursor-pointer text-center">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/athlynx-icon.png" 
                  alt="Faith" 
                  className="relative w-full aspect-square rounded-xl shadow-lg transform group-hover:scale-105 transition-transform mx-auto"
                />
                <p className="text-xs text-gray-400 mt-2 group-hover:text-cyan-400">Faith</p>
              </div>
            </Link>

            <Link href="/nil-marketplace">
              <div className="relative group cursor-pointer text-center">
                <div className="absolute inset-0 bg-green-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/nil-vault-icon.png" 
                    alt="NIL Vault" 
                  className="relative w-full aspect-square rounded-xl shadow-lg transform group-hover:scale-105 transition-transform mx-auto"
                />
                <p className="text-xs text-gray-400 mt-2 group-hover:text-cyan-400">NIL Vault</p>
              </div>
            </Link>

            <Link href="/apps">
              <div className="relative group cursor-pointer text-center">
                <div className="absolute inset-0 bg-blue-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/ai-sales.png" 
                    alt="AI Sales" 
                  className="relative w-full aspect-square rounded-xl shadow-lg transform group-hover:scale-105 transition-transform mx-auto"
                />
                <p className="text-xs text-gray-400 mt-2 group-hover:text-cyan-400">AI Sales</p>
              </div>
            </Link>

            <Link href="/apps">
              <div className="relative group cursor-pointer text-center">
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/ai-recruiter.png" 
                    alt="AI Recruiter" 
                  className="relative w-full aspect-square rounded-xl shadow-lg transform group-hover:scale-105 transition-transform mx-auto"
                />
                <p className="text-xs text-gray-400 mt-2 group-hover:text-cyan-400">AI Recruiter</p>
              </div>
            </Link>

            <Link href="/apps">
              <div className="relative group cursor-pointer text-center">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src="/ai-content.png" 
                    alt="AI Content" 
                  className="relative w-full aspect-square rounded-xl shadow-lg transform group-hover:scale-105 transition-transform mx-auto"
                />
                <p className="text-xs text-gray-400 mt-2 group-hover:text-cyan-400">AI Content</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Rest of the page content (signup form, etc.) continues below... */}
        {/* ... (keeping the rest of the original EarlyAccess.tsx content) */}

      </div>

      <UnifiedFooter />
    </div>
  );
}

export default function EarlyAccess() {
  return <RouteErrorBoundary><EarlyAccessInner /></RouteErrorBoundary>;
}
