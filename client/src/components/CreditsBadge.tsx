/**
 * CreditsBadge — AthlynXAI-style credits display in the nav bar
 * Shows current balance, low-credit warning, and opens Buy Credits modal
 */
import { useState } from "react";
import { Zap, X, ArrowUpRight, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const CREDIT_PACKS = [
  {
    id: "credits_100",
    name: "100 Credits",
    credits: 100,
    price: "$9.99",
    badge: "",
  },
  {
    id: "credits_500",
    name: "500 Credits",
    credits: 500,
    price: "$39.99",
    badge: "Best Value",
  },
  {
    id: "credits_1000",
    name: "1,000 Credits",
    credits: 1000,
    price: "$69.99",
    badge: "Power User",
  },
];

export function CreditsBadge() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Admins (founder/staff) do not display a credits badge or low-credit warning.
  // Their access is unlimited; surfacing "0 credits" or a Buy button is wrong.
  if (user?.role === "admin") return null;

  const credits = user?.credits ?? 0;
  const isLow = credits < 50;

  const buyCredits = trpc.stripe.createCreditsCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (err) => {
      alert("Checkout error: " + err.message);
      setLoading(null);
    },
  });

  const handleBuy = (packId: string) => {
    setLoading(packId);
    buyCredits.mutate({ packId, origin: window.location.origin });
  };

  return (
    <>
      {/* Credits Badge in Nav */}
      <button
        onClick={() => setModalOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all border ${
          isLow
            ? "bg-[#1E90FF]/20 border-[#1E90FF]/50 text-[#1E90FF] animate-pulse hover:bg-[#1E90FF]/30"
            : "bg-blue-500/20 border-blue-500/40 text-[#00C2FF] hover:bg-blue-500/30"
        }`}
        title="AI Credits — click to buy more"
      >
        {isLow ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <Zap className="w-3.5 h-3.5" />
        )}
        <span>{credits.toLocaleString()}</span>
        <span className="hidden sm:inline text-xs opacity-70">credits</span>
      </button>

      {/* Low Credit Warning Banner — shown below nav when credits < 50 */}
      {isLow && !modalOpen && (
        <div
          className="fixed top-16 left-0 right-0 z-40 bg-[#1E90FF]/90 backdrop-blur text-white text-sm py-2 px-4 flex items-center justify-between cursor-pointer hover:bg-[#1E90FF]"
          onClick={() => setModalOpen(true)}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>
              You're running low on credits ({credits} remaining). Buy more to keep using AI features.
            </span>
          </div>
          <span className="flex items-center gap-1 font-semibold underline">
            Buy Credits <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}

      {/* Buy Credits Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00C2FF]" />
                  Buy AI Credits
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  Current balance:{" "}
                  <span className={`font-semibold ${isLow ? "text-[#1E90FF]" : "text-[#00C2FF]"}`}>
                    {credits.toLocaleString()} credits
                  </span>
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Credit Packs */}
            <div className="p-6 space-y-3">
              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => handleBuy(pack.id)}
                  disabled={loading === pack.id}
                  className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 rounded-xl px-5 py-4 transition-all group disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#0a1628] rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold flex items-center gap-2">
                        {pack.name}
                        {pack.badge && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            {pack.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {pack.credits.toLocaleString()} AI credits
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{pack.price}</div>
                    <div className="text-slate-400 text-xs">
                      ${(parseFloat(pack.price.replace("$", "")) / pack.credits).toFixed(3)}/credit
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 text-center text-slate-500 text-xs">
              Credits are added to your account instantly after payment.
              <br />
              Powered by Stripe — secure checkout.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
