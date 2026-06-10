import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
/**
 * AthlynX — Onboarding Page
 * New users land here after Firebase login to select their role.
 * Uses the full AIOnboarding component with all 19 roles.
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import AIOnboarding from "@/components/AIOnboarding";

function OnboardingInner() {
  const { isAuthenticated, loading: isLoading } = useAuth();

  useEffect(() => {
    document.title = "Welcome to AthlynX — Set Up Your Profile";
  }, []);

  // If not authenticated, send back to sign in. Synchronous URL change during render
  // so the address bar actually updates (not a soft re-render).
  if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
    try {
      sessionStorage.setItem("auth_return_to", "/onboarding");
    } catch { /* ignore */ }
    window.location.replace("/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050c1a] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#00c2ff]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-[#00c2ff] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#050c1a]">
      <AIOnboarding
        onComplete={(_data: Record<string, string>) => {
          // PR #43: hand off to /welcome two-door selector instead of /portal.
          window.location.href = "/welcome";
        }}
        onDismiss={() => {
          window.location.href = "/welcome";
        }}
      />
    </div>
  );
}

export default function Onboarding() {
  return <RouteErrorBoundary><OnboardingInner /></RouteErrorBoundary>;
}
