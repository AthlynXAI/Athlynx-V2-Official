/**
 * PWAInstallBanner — Premium AthlynX ecosystem install rail
 * Replaces the old generic “Add AthlynX to Home Screen” bar with a branded
 * AthlynX / AthlynXAI / AXN / AVN ecosystem prompt.
 */
import { useState, useEffect } from "react";
import { X, Share, Download, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const ICON_URL = "/athlynx-app-icon.png";

const BRAND_LEGS = ["AthlynX", "AthlynXAI", "AXN", "AVN"];

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    const forceShow = () => {
      setShow(true);
      if (!platform) {
        const ua = navigator.userAgent;
        const isIOS = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
        setPlatform(isIOS ? "ios" : "android");
      }
    };
    window.addEventListener("athlynx-show-pwa", forceShow);
    return () => window.removeEventListener("athlynx-show-pwa", forceShow);
  }, [platform]);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    const dismissed = localStorage.getItem("athlynx_pwa_dismissed_v3_brand_ecosystem");
    if (dismissed && Date.now() - parseInt(dismissed) < 3 * 24 * 60 * 60 * 1000) return;

    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
    const isAndroid = /android/i.test(ua);

    if (isIOS) {
      setPlatform("ios");
      const t = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(t);
    }

    if (isAndroid) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setPlatform("android");
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("athlynx_pwa_dismissed_v3_brand_ecosystem", Date.now().toString());
    setShow(false);
  };

  if (!show || !platform) return null;

  return (
    <>
      <style>{`
        @keyframes athlynx-pwa-slide {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes athlynx-pwa-glow {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }
        .athlynx-pwa-bar { animation: athlynx-pwa-slide 0.35s ease-out forwards; }
        .athlynx-pwa-watermark { animation: athlynx-pwa-glow 3.5s ease-in-out infinite; }
      `}</style>

      <div
        className="athlynx-pwa-bar"
        style={{
          position: "fixed",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)",
          left: 0,
          right: 0,
          zIndex: 45,
          background: "linear-gradient(135deg, rgba(2,7,19,0.98) 0%, rgba(7,21,42,0.98) 48%, rgba(0,37,94,0.98) 100%)",
          borderTop: "1.5px solid rgba(0, 194, 255, 0.45)",
          boxShadow: "0 -10px 44px rgba(0, 102, 255, 0.26)",
          padding: "14px calc(env(safe-area-inset-right, 0px) + 16px) 14px calc(env(safe-area-inset-left, 0px) + 16px)",
          overflow: "hidden",
        }}
      >
        <div
          className="athlynx-pwa-watermark"
          style={{
            position: "absolute",
            right: -24,
            top: -44,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,194,255,0.34), rgba(0,102,255,0.10) 45%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={ICON_URL}
            alt="AthlynX official logo"
            style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, boxShadow: "0 0 22px rgba(0,194,255,0.35)" }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <Sparkles size={15} color="#00c2ff" />
              <div style={{ color: "#ffffff", fontWeight: 950, fontSize: 14, lineHeight: 1.1, letterSpacing: "0.02em" }}>
                Install the AthlynX Ecosystem
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 5 }}>
              {BRAND_LEGS.map((leg) => (
                <span
                  key={leg}
                  style={{
                    color: "#dff7ff",
                    background: "rgba(0,194,255,0.10)",
                    border: "1px solid rgba(0,194,255,0.22)",
                    borderRadius: 999,
                    padding: "3px 7px",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.06em",
                  }}
                >
                  {leg}
                </span>
              ))}
            </div>
            <div style={{ color: "#8ba3c7", fontSize: 11, lineHeight: 1.25 }}>
              Native app feel · athlete OS · network · video · vision
            </div>
          </div>

          {platform === "android" ? (
            <button
              onClick={handleAndroidInstall}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg, #0066ff, #00c2ff)",
                color: "#fff",
                border: "none",
                borderRadius: 22,
                padding: "9px 16px",
                fontWeight: 950,
                fontSize: 12,
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <Download size={14} />
              Install
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, color: "#00c2ff", fontWeight: 950, fontSize: 11 }}>
              <Share size={15} />
              Add
            </div>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Dismiss branded app prompt"
            style={{ background: "none", border: "none", color: "#56709b", cursor: "pointer", padding: 4, flexShrink: 0 }}
          >
            <X size={17} />
          </button>
        </div>
      </div>
    </>
  );
}
