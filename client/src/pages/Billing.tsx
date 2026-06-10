import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useLocation } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, CheckCircle, AlertCircle, ArrowUpRight, Zap, Star, Shield } from "lucide-react";

const PLAN_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  athlete_starter:  { label: "Athlete Starter",  icon: <CheckCircle className="w-4 h-4" />, color: "#0099ff" },
  athlete_pro:      { label: "Athlete Pro",      icon: <Zap className="w-4 h-4" />,         color: "#0066ff" },
  athlete_elite:    { label: "Athlete Elite",    icon: <Star className="w-4 h-4" />,        color: "#00c2ff" },
  athlete_champion: { label: "Athlete Champion", icon: <Star className="w-4 h-4" />,        color: "#1E90FF" },
  athlete_mvp:      { label: "Athlete MVP",      icon: <Shield className="w-4 h-4" />,      color: "#ef4444" },
  pro_teams:        { label: "Pro Teams",        icon: <Shield className="w-4 h-4" />,      color: "#ef4444" },
  nil_vault:        { label: "NIL Vault",        icon: <Shield className="w-4 h-4" />,      color: "#1e3a8a" },
  owner:            { label: "Master Admin — Full Access", icon: <Shield className="w-4 h-4" />, color: "#1E90FF" },
  partner:          { label: "Partner — Full Access",      icon: <Shield className="w-4 h-4" />, color: "#00c2ff" },
};

// Master Admin — Chad A. Dozier Sr. only. Canonical: contact@athlynx.ai.
const OWNER_EMAILS = [
  "contact@athlynx.ai",
  "contact@athlynx.ai",
  "cdozier@dozierholdingsgroup.com",
];
// Partners — full platform access, no paywall
const PARTNER_EMAILS = [
  "gtse@athlynx.ai", "lmarshall@athlynx.ai",
];

function BillingInner() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const { data: subscription, isLoading } = trpc.stripe.getSubscription.useQuery(undefined, {
    enabled: !!user,
  });
  const createBillingPortal = trpc.stripe.createBillingPortal.useMutation();

  // Wait for auth to resolve before showing sign-in wall
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-black border border-blue-500/30 p-8 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
          <h2 className="text-white text-xl font-black mb-2">Sign In</h2>
          <p className="text-white/60 mb-4 text-sm">Sign in to manage your billing.</p>
          <Button
            className="bg-[#1E90FF] hover:bg-blue-400 text-black font-black"
            onClick={() => { window.location.href = '/signin'; }}
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const handleManageBilling = async () => {
    try {
      const result = await createBillingPortal.mutateAsync({
        origin: window.location.origin,
      });
      if (result.url) {
        toast.info("Opening billing portal...");
        window.open(result.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Could not open billing portal");
    }
  };

  const isOwnerAccount = user?.email && OWNER_EMAILS.includes(user.email.toLowerCase());
  const isPartnerAccount = user?.email && PARTNER_EMAILS.includes(user.email.toLowerCase());
  const planInfo = isOwnerAccount
    ? PLAN_LABELS["owner"]
    : isPartnerAccount
    ? PLAN_LABELS["partner"]
    : subscription?.plan ? PLAN_LABELS[subscription.plan] : null;
  const isActive = isOwnerAccount || isPartnerAccount || subscription?.status === "active" || subscription?.status === "trialing";

  // Check for success/cancelled query params
  const params = new URLSearchParams(window.location.search);
  const justSubscribed = params.get("success") === "1";
  const justCancelled = params.get("cancelled") === "1";

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Billing & Subscription</h1>
          <p className="text-blue-200/60">Manage your AthlynX membership and credits.</p>
        </div>

        {/* Success / Cancelled banners */}
        {justSubscribed && (
          <div className="mb-6 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-green-300 font-medium">
              Payment successful! Your subscription is now active.
            </span>
          </div>
        )}
        {justCancelled && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 font-medium">
              Checkout was cancelled. No charge was made.
            </span>
          </div>
        )}

        {/* Current Plan Card */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 bg-white/5 animate-pulse rounded-lg" />
            ) : isActive && planInfo ? (
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: planInfo.color + "22", color: planInfo.color }}
                  >
                    {planInfo.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{planInfo.label}</div>
                    <div className="text-blue-200/60 text-sm capitalize">
                      Status:{" "}
                      <span className="text-green-400 font-medium">{isOwnerAccount || isPartnerAccount ? "active" : subscription?.status}</span>
                      {subscription?.cancelAtPeriodEnd && (
                        <span className="ml-2 text-red-400">(Cancels at period end)</span>
                      )}
                    </div>
                    {subscription?.currentPeriodEnd && (
                      <div className="text-blue-200/50 text-xs mt-1">
                        Next billing:{" "}
                        {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Active
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-white font-bold text-lg">Athlete Free</div>
                  <div className="text-blue-200/60 text-sm">Basic access — upgrade to unlock all features</div>
                </div>
                <Button
                  className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold rounded-lg py-3 px-6"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade Now <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credits Balance Card */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-300" />
              AI Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-4xl font-black text-blue-300">{user?.credits ?? 0}</div>
                <div className="text-blue-200/60 text-sm mt-1">Credits remaining — used for AI features across the platform</div>
              </div>
              <Button
                className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold rounded-lg py-3 px-6"
                onClick={() => navigate("/pricing#credits")}
              >
                Buy Credits <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Manage Billing */}
        {isActive && (
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-white font-bold mb-1">Manage Billing</div>
                  <div className="text-blue-200/60 text-sm">
                    Update payment method, download invoices, or cancel your subscription.
                  </div>
                </div>
                <Button
                  className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold rounded-lg py-3 px-6"
                  disabled={createBillingPortal.isPending}
                  onClick={handleManageBilling}
                >
                  {createBillingPortal.isPending ? "Loading..." : "Open Billing Portal"}
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade CTA */}
        {!isActive && (
          <Card className="bg-gradient-to-r from-blue-900/40 to-blue-950/40 border-blue-500/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to level up?</h3>
              <p className="text-blue-200/60 mb-6">
                Unlock NIL deals, AI recruiting tools, and the full AthlynX suite.
              </p>
              <Button
                size="lg"
                className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold px-8 rounded-lg py-3"
                onClick={() => navigate("/pricing")}
              >
                View Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
export default function Billing() {
  return <RouteErrorBoundary><BillingInner /></RouteErrorBoundary>;
}
