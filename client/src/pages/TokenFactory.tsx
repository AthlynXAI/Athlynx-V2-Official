/**
 * TOKEN FACTORY — AI Credits Economy
 * Session 38 — May 6, 2026
 * The in-platform credit economy powering every AI interaction on AthlynX.
 * Colors: #0066ff blue, #00c2ff cyan. NO yellow.
 */
import { useState } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap, Star, Trophy, Shield, Crown, Cpu, Brain,
  TrendingUp, Gift, RefreshCw, Lock, ChevronRight,
  Sparkles, Target, BarChart2, DollarSign, Users,
  CheckCircle, ArrowRight, Flame, Award
} from "lucide-react";

const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 500,
    price: "$4.99",
    pricePerCredit: "$0.010",
    color: "#0066ff",
    icon: Zap,
    popular: false,
    features: ["500 AI Credits", "All 9 AI Wizards", "Basic analytics", "30-day expiry"],
  },
  {
    id: "athlete",
    name: "Athlete Pack",
    credits: 2500,
    price: "$19.99",
    pricePerCredit: "$0.008",
    color: "#00c2ff",
    icon: Star,
    popular: true,
    features: ["2,500 AI Credits", "All 9 AI Wizards", "Priority AI queue", "90-day expiry", "Bonus 250 credits"],
  },
  {
    id: "champion",
    name: "Champion Pack",
    credits: 7500,
    price: "$49.99",
    pricePerCredit: "$0.0067",
    color: "#0066ff",
    icon: Trophy,
    popular: false,
    features: ["7,500 AI Credits", "All 9 AI Wizards", "Priority AI queue", "180-day expiry", "Bonus 1,000 credits", "Early access to new AI tools"],
  },
  {
    id: "mvp",
    name: "MVP Pack",
    credits: 25000,
    price: "$149.99",
    pricePerCredit: "$0.006",
    color: "#00c2ff",
    icon: Crown,
    popular: false,
    features: ["25,000 AI Credits", "All 9 AI Wizards", "Dedicated AI queue", "1-year expiry", "Bonus 5,000 credits", "Early access + beta features", "Direct support line"],
  },
];

const AI_TOOLS_COST = [
  { name: "AI Recruiter", icon: Target, cost: 10, desc: "Per recruiting analysis" },
  { name: "Agent Wizard", icon: Users, cost: 15, desc: "Per agent negotiation session" },
  { name: "Financial Wizard", icon: DollarSign, cost: 20, desc: "Per NIL deal valuation" },
  { name: "Lawyer Wizard", icon: Shield, cost: 25, desc: "Per contract review" },
  { name: "Transfer Wizard", icon: RefreshCw, cost: 10, desc: "Per school match analysis" },
  { name: "Career Wizard", icon: TrendingUp, cost: 15, desc: "Per career path report" },
  { name: "Scout Wizard", icon: BarChart2, cost: 20, desc: "Per scouting report" },
  { name: "Scholarship Wizard", icon: Award, cost: 15, desc: "Per scholarship search" },
  { name: "Life Wizard", icon: Sparkles, cost: 10, desc: "Per life coaching session" },
  { name: "AI Content Creator", icon: Flame, cost: 5, desc: "Per content piece" },
  { name: "AI Training Bot", icon: Cpu, cost: 8, desc: "Per training session" },
  { name: "AI Sales Assistant", icon: Brain, cost: 12, desc: "Per brand outreach" },
];

const EARN_CREDITS = [
  { action: "Complete your athlete profile", credits: 100, icon: CheckCircle },
  { action: "Upload a highlight reel", credits: 50, icon: Star },
  { action: "Refer a teammate", credits: 200, icon: Users },
  { action: "Daily login streak (7 days)", credits: 75, icon: Flame },
  { action: "Complete onboarding", credits: 150, icon: Trophy },
  { action: "Connect social media", credits: 25, icon: TrendingUp },
];

function TokenFactoryInner() {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>("athlete");

  const mockCredits = 1250;
  const mockMaxCredits = 2500;

  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      <UnifiedNav />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-blue-900/30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/10 via-transparent to-[#00c2ff]/5" />
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10 text-center">
          <Badge className="bg-[#0066ff]/20 text-[#00c2ff] border-[#0066ff]/30 mb-4 text-sm px-4 py-1">
             AI CREDITS ECONOMY
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            TOKEN FACTORY™
          </h1>
          <p className="text-[#00c2ff] text-xl font-bold mb-2">
            Power Every AI Interaction on AthlynX
          </p>
          <p className="text-blue-200/60 max-w-2xl mx-auto mb-8">
            Credits fuel every AI wizard, analysis, and tool on the platform. Buy once, use across all 9 AI wizards, recruiting tools, NIL valuations, and more.
          </p>

          {/* Credit Balance Card */}
          {user ? (
            <div className="inline-block bg-white/5 border border-blue-500/20 rounded-2xl p-6 text-left min-w-[320px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-300 text-sm font-bold">YOUR CREDIT BALANCE</span>
                <Badge className="bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]/30">ACTIVE</Badge>
              </div>
              <div className="text-5xl font-black text-white mb-1">{mockCredits.toLocaleString()}</div>
              <div className="text-blue-400 text-sm mb-3">of {mockMaxCredits.toLocaleString()} credits</div>
              <Progress value={(mockCredits / mockMaxCredits) * 100} className="h-2 bg-blue-900/50" />
              <div className="mt-3 text-xs text-blue-400">Expires in 87 days · Athlete Pack</div>
            </div>
          ) : (
            <Link href="/signup">
              <Button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg px-8 py-4 rounded-xl">
                GET FREE CREDITS — START NOW <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* Credit Packages */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">BUY CREDITS</h2>
            <p className="text-blue-300/70">One-time purchase. No subscription required. Use across all AI tools.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDIT_PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              const isSelected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 ${
                    isSelected
                      ? "border-[#0066ff] bg-[#0066ff]/10 scale-105"
                      : "border-blue-900/30 bg-white/3 hover:border-blue-500/40"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[#00c2ff] text-[#050d1a] font-black text-xs px-3">MOST POPULAR</Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pkg.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: pkg.color }} />
                    </div>
                    <div>
                      <div className="font-black text-white text-sm">{pkg.name}</div>
                      <div className="text-xs text-blue-400">{pkg.pricePerCredit}/credit</div>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-white mb-1">{pkg.credits.toLocaleString()}</div>
                  <div className="text-blue-400 text-sm mb-4">AI Credits</div>
                  <div className="text-2xl font-black mb-4" style={{ color: pkg.color }}>{pkg.price}</div>
                  <ul className="space-y-1 mb-4">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-blue-200/70">
                        <CheckCircle className="w-3 h-3 text-[#00C2FF] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={user ? "/billing" : "/signup"}>
                    <Button
                      className="w-full font-black text-sm"
                      style={{ backgroundColor: isSelected ? pkg.color : "transparent", borderColor: pkg.color, border: "1px solid" }}
                    >
                      {user ? "Buy Now" : "Sign Up to Buy"}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Credit Cost Per Tool */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">CREDIT COSTS PER TOOL</h2>
            <p className="text-blue-300/70">Transparent pricing. Know exactly what each AI action costs.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AI_TOOLS_COST.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.name} className="bg-white/3 border border-blue-900/30 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[#00c2ff]" />
                    <span className="text-white font-bold text-sm">{tool.name}</span>
                  </div>
                  <div className="text-2xl font-black text-[#0066ff]">{tool.cost}</div>
                  <div className="text-xs text-blue-400">credits · {tool.desc}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Earn Free Credits */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">EARN FREE CREDITS</h2>
            <p className="text-blue-300/70">Complete actions on the platform to earn credits without spending a dime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EARN_CREDITS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.action} className="flex items-center gap-4 bg-white/3 border border-blue-900/30 rounded-xl p-4 hover:border-[#00c2ff]/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#00c2ff]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#00c2ff]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">{item.action}</div>
                    <div className="text-[#00c2ff] font-black">+{item.credits} credits</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Subscription Tiers with Credits */}
        <section className="bg-white/3 border border-blue-900/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">SUBSCRIPTION TIERS INCLUDE CREDITS</h2>
            <p className="text-blue-300/70">Every monthly plan includes a monthly credit allowance. Upgrade for more.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { name: "Starter", price: "$9.99", credits: 250, color: "#0066ff" },
              { name: "Champion", price: "$19.99", credits: 750, color: "#00c2ff" },
              { name: "MVP", price: "$39.99", credits: 2000, color: "#0066ff" },
              { name: "Pro Teams", price: "$99.99", credits: 10000, color: "#00c2ff" },
              { name: "Partner", price: "Full Access", credits: "Unlimited", color: "#00ff88" },
            ].map((tier) => (
              <div key={tier.name} className="bg-white/5 rounded-xl p-4 border border-blue-900/30">
                <div className="font-black text-white mb-1">{tier.name}</div>
                <div className="text-sm font-bold mb-2" style={{ color: tier.color }}>{tier.price}/mo</div>
                <div className="text-2xl font-black" style={{ color: tier.color }}>
                  {typeof tier.credits === "number" ? tier.credits.toLocaleString() : tier.credits}
                </div>
                <div className="text-xs text-blue-400">credits/mo</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/pricing-tiers">
              <Button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black px-8">
                VIEW ALL SUBSCRIPTION TIERS <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-black mb-4">READY TO POWER YOUR CAREER WITH AI?</h2>
          <p className="text-blue-300/70 mb-8 max-w-xl mx-auto">
            Every AI wizard, every analysis, every edge — powered by AthlynX credits. Start free, scale as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? "/billing" : "/signup"}>
              <Button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg px-8 py-4 rounded-xl">
                <Zap className="mr-2 w-5 h-5" />
                {user ? "Buy Credits Now" : "Start Free — Get 100 Credits"}
              </Button>
            </Link>
            <Link href="/wizards">
              <Button variant="outline" className="border-[#00c2ff] text-[#00c2ff] hover:bg-[#00c2ff]/10 font-black text-lg px-8 py-4 rounded-xl">
                Explore AI Wizards
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <UnifiedFooter />
      <MobileBottomNav />
    </div>
  );
}

export default function TokenFactory() {
  return (
    <RouteErrorBoundary>
      <TokenFactoryInner />
    </RouteErrorBoundary>
  );
}
