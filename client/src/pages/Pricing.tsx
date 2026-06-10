import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from '@/components/MobileBottomNav'
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Zap, Shield, Star, CreditCard, Phone } from "lucide-react";

const PLAN_ICONS: Record<string, React.ReactNode> = {
  athlete_free: <Check className="w-6 h-6" />,
  athlete_starter: <Check className="w-6 h-6" />,
  athlete_pro: <Zap className="w-6 h-6" />,
  athlete_elite: <Star className="w-6 h-6" />,
  athlete_champion: <Shield className="w-6 h-6" />,
  athlete_mvp: <Star className="w-6 h-6" />,
  nil_vault: <Shield className="w-6 h-6" />,
  pro_teams: <Star className="w-6 h-6" />,
};

// Hardcoded fallback plans shown when tRPC backend is unavailable
const FALLBACK_PLANS = [
  {
    id: "athlete_free",
    name: "Athlete Free",
    description: "Get started at no cost. 7-day free trial — converts to Starter ($9.99/mo) on day 8.",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["Basic Athlete Profile", "NIL Deal Discovery", "Community Feed", "Transfer Portal Access", "7-Day Free Trial"],
    badge: "Free Trial",
    color: "#0066ff",
  },
  {
    id: "athlete_starter",
    name: "Athlete Starter",
    description: "Essential access to the AthlynX platform — NIL discovery, messaging, and community features.",
    priceMonthly: 999,
    priceYearly: 9588,
    features: ["Basic Athlete Profile", "NIL Deal Discovery", "Community Messaging", "Transfer Portal Access", "Diamond Grind Training", "7-Day Free Trial"],
    badge: "Best for Beginners",
    color: "#0099ff",
  },
  {
    id: "athlete_pro",
    name: "Athlete Pro",
    description: "Full platform access with AI recruiting, NIL deal tracking, and transfer portal intelligence.",
    priceMonthly: 1999,
    priceYearly: 19188,
    features: ["Everything in Starter", "AI Recruiter Tools", "NIL Deal Marketplace", "Warriors Playbook", "AI Sales Automation", "Priority Support"],
    badge: "Most Popular",
    color: "#00c2ff",
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "The complete AthlynX experience — NIL management, brand deals, and 1-on-1 strategy.",
    priceMonthly: 3999,
    priceYearly: 38388,
    features: ["Everything in Pro", "NIL Vault (Contract Archive)", "Brand Deal Negotiation AI", "Dedicated Account Manager", "White-label Branding", "API Access"],
    badge: "Best Value",
    color: "#7c3aed",
  },
  {
    id: "athlete_champion",
    name: "Athlete Champion",
    description: "Advanced NIL analytics, custom athlete page, and early access to new features.",
    priceMonthly: 5999,
    priceYearly: 57588,
    features: ["Everything in Elite", "Advanced NIL Analytics", "Custom Athlete Page", "Early Access Features", "Priority Deal Matching", "Champion Badge"],
    badge: "Champion Tier",
    color: "#1E90FF",
  },
  {
    id: "athlete_mvp",
    name: "Athlete MVP",
    description: "1-on-1 strategy, VIP network, unlimited credits, and white-glove service.",
    priceMonthly: 9999,
    priceYearly: 95988,
    features: ["Everything in Champion", "1-on-1 Strategy Sessions", "VIP Athlete Network", "Unlimited AI Credits", "White-Glove Service", "MVP Badge & Verified"],
    badge: "MVP — Top Tier",
    color: "#ef4444",
  },
  {
    id: "pro_teams",
    name: "Pro Teams",
    description: "Full platform access for professional sports organizations — NFL, NBA, MLB, NHL, MLS, WNBA, Pro Pro Baseball.",
    priceMonthly: 250000,
    priceYearly: 2400000,
    features: ["Roster Management", "Contract & Cap Tracking", "AI Scouting Intelligence", "Brand Deals & NIL", "Advanced Analytics", "Dedicated Account Manager", "API Access", "30-Day Trial"],
    badge: "Pro Teams",
    color: "#ef4444",
  },
];

function PricingInner() {
  const [yearly, setYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: plansData = [] } = trpc.stripe.getPlans.useQuery();
  const plans = plansData.length > 0 ? plansData : FALLBACK_PLANS;
  const { data: creditPacks = [] } = trpc.stripe.getCreditPacks.useQuery();
  const createSubscription = trpc.stripe.createSubscriptionCheckout.useMutation();
  const createCredits = trpc.stripe.createCreditsCheckout.useMutation();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }
    setLoadingPlan(planId);
    try {
      const result = await createSubscription.mutateAsync({
        planId,
        interval: yearly ? "year" : "month",
        origin: window.location.origin,
      });
      if (result.url) {
        toast.info("Redirecting to secure checkout...");
        window.location.href = result.url;
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleBuyCredits = async (packId: string) => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }
    setLoadingPlan(packId);
    try {
      const result = await createCredits.mutateAsync({
        packId,
        origin: window.location.origin,
      });
      if (result.url) {
        toast.info("Redirecting to secure checkout...");
        window.location.href = result.url;
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-blue-950/20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative z-10">
          <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-500/30 px-4 py-1">
            AthlynX MEMBERSHIP
          </Badge>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
            Every MVP Deserves the Best
          </h1>
          <p className="text-xl text-blue-200/70 max-w-2xl mx-auto mb-8">
            NIL deals, recruiting tools, AI Trainers, Teammates &amp; Companions — the complete athlete platform.
            7-day free trial — credit card required, not charged until day 8.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <Label className="text-blue-200">Monthly</Label>
            <Switch
              checked={yearly}
              onCheckedChange={setYearly}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label className="text-blue-200">
              Yearly{" "}
              <span className="ml-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5">
                Save 33%
              </span>
            </Label>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const isPopular = plan.badge === "Most Popular";
            const price = yearly ? plan.priceYearly : plan.priceMonthly;
            const monthlyEquiv = yearly ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] ${
                  isPopular
                    ? "border-blue-500 bg-blue-950/40 shadow-2xl shadow-blue-500/20"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.badge && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg"
                    style={{ backgroundColor: plan.color + "33", color: plan.color, border: `1px solid ${plan.color}44` }}
                  >
                    {plan.badge}
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: plan.color + "22", color: plan.color }}
                    >
                      {PLAN_ICONS[plan.id]}
                    </div>
                    <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-blue-200/60 text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-black text-white">
                      {formatPrice(monthlyEquiv)}
                    </span>
                    <span className="text-blue-300/60 ml-1">/mo</span>
                    {yearly && (
                      <div className="text-sm text-green-400 mt-1">
                        Billed {formatPrice(price)}/year
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-blue-100/80">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full font-bold mt-4 bg-[#0066ff] hover:bg-[#0052cc] text-white border-0 rounded-lg py-3 text-base"
                    disabled={loadingPlan === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {loadingPlan === plan.id ? "Loading..." : "Get Started — Free 7 Days"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Free Tier */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Athlete Free</h3>
          <p className="text-blue-200/60 mb-4">Get started at no cost. Upgrade anytime.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {["Social Feed", "Basic Profile", "Transfer Portal (View)", "Community Access"].map(f => (
              <span key={f} className="flex items-center gap-1 text-sm text-blue-200/70">
                <Check className="w-3 h-3 text-green-400" /> {f}
              </span>
            ))}
          </div>
          <Button
            className="bg-[#0066ff] hover:bg-[#0052cc] text-white border-0 rounded-lg py-3 px-8 text-base font-bold"
            onClick={() => { if (user) navigate('/'); else window.location.href = '/signup'; }}
          >
            {user ? "You're on Free Trial" : "Sign Up Free — 7 Days"}
          </Button>
        </div>

        {/* Credits Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">AI Credits</h2>
          <p className="text-blue-200/60">
            Power your AI Trainers, Teammates &amp; Companions. Credits never expire — use them anytime.
          </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creditPacks.map((pack) => (
              <Card key={pack.id} className="bg-white/5 border-white/10 hover:border-blue-500/40 transition-all">
                <CardContent className="p-6 text-center">
                  <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-black text-white mb-1">{pack.name}</div>
                  <div className="text-3xl font-black text-blue-400 mb-4">
                    {formatPrice(pack.price)}
                  </div>
                  <Button
                    className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white border-0 rounded-lg py-3 text-base font-bold"
                    disabled={loadingPlan === pack.id}
                    onClick={() => handleBuyCredits(pack.id)}
                  >
                    {loadingPlan === pack.id ? "Loading..." : "Buy Credits"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center py-8 mb-8 border border-white/5 rounded-2xl bg-white/[0.02]">
          <p className="text-blue-400/60 text-xs uppercase tracking-widest mb-5">Accepted Payment Methods</p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {[
              { label: "Apple Pay", bg: "bg-black", border: "border-gray-700", text: "text-white", icon: "🍎" },
              { label: "Google Pay", bg: "bg-white", border: "border-gray-300", text: "text-black", icon: "G" },
              { label: "PayPal", bg: "bg-[#003087]", border: "border-[#003087]", text: "text-white", icon: "P" },
              { label: "Cash App", bg: "bg-[#00d632]", border: "border-[#00d632]", text: "text-black", icon: "$" },
              { label: "Visa", bg: "bg-[#1a1f71]", border: "border-[#1a1f71]", text: "text-white", icon: "VISA" },
              { label: "Mastercard", bg: "bg-[#eb001b]", border: "border-[#eb001b]", text: "text-white", icon: "MC" },
              { label: "Link", bg: "bg-[#00d4ff]", border: "border-[#00d4ff]", text: "text-black", icon: "⚡" },
            ].map(m => (
              <div key={m.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${m.bg} ${m.border} ${m.text}`}>
                <span className="text-sm">{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
          <p className="text-blue-400/40 text-xs mt-4">All payments secured by Stripe · 256-bit SSL encryption · credit card required — not charged for 7 days for free trial</p>
        </div>

        {/* Team & School Billing */}
        <div className="bg-gradient-to-r from-red-900/30 to-red-900/30 border border-red-500/30 rounded-2xl p-8 text-center mb-8">
          <div className="text-4xl mb-3">🏫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Team &amp; School Billing</h2>
          <p className="text-red-200/70 max-w-xl mx-auto mb-6 text-sm">
            Coaches — get AthlynX for your entire roster at a discounted rate. Schools and athletic departments get one invoice, one admin dashboard, and full roster management.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {[
              { size: "5–15 Athletes", price: "$7.99", label: "per athlete / mo" },
              { size: "16–50 Athletes", price: "$5.99", label: "per athlete / mo" },
              { size: "51+ Athletes", price: "Custom", label: "contact us" },
            ].map(tier => (
              <div key={tier.size} className="bg-black/30 border border-red-500/20 rounded-xl px-6 py-4 min-w-[140px]">
                <div className="text-red-400 font-black text-2xl">{tier.price}</div>
                <div className="text-red-200/60 text-xs">{tier.label}</div>
                <div className="text-white text-xs mt-1 font-semibold">{tier.size}</div>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-400 text-black font-black px-8"
            onClick={() => window.open("mailto:contact@athlynx.ai?subject=Team+School+Billing+Inquiry", "_blank")}
          >
            Get Team Pricing
          </Button>
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-blue-900/40 to-blue-950/40 border border-blue-500/20 rounded-2xl p-10 text-center">
          <Phone className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Need a Custom Solution?</h2>
          <p className="text-blue-200/70 max-w-xl mx-auto mb-6">
            Schools, agencies, and organizations — contact us for enterprise licensing,
            white-label branding, and volume pricing.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8"
            onClick={() => window.open("mailto:contact@athlynx.ai?subject=Enterprise Inquiry", "_blank")}
          >
            Request a Call
          </Button>
        </div>

        {/* Dedication */}
        <div className="mt-12 text-center border border-blue-900/30 rounded-2xl p-8 bg-blue-950/20">
          <div className="text-3xl mb-3">🏆</div>
          <p className="text-blue-300/80 text-sm italic max-w-xl mx-auto leading-relaxed">
            "Built for every athlete who was told they weren't good enough. Dedicated to those who fought the hardest battles off the field — and won."
          </p>
          <p className="text-blue-700 text-xs mt-4">AthlynXAI Corporation · A Dozier Holdings Group Company · 2026</p>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function Pricing() {
  return <RouteErrorBoundary><PricingInner /></RouteErrorBoundary>;
}
