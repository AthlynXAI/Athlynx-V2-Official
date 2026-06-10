import { trpc, trpcClient } from "@/lib/trpc";

// PWA Service Worker registration.
// All failures are swallowed locally so they never bubble to Sentry as
// unhandled errors. SW failures are non-fatal — the app still works without
// offline support — so they should be a log warning at most.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] Service worker registered:', registration.scope);
          // Avoid aggressive polling for /sw.js. Browsers already check service
          // worker updates on navigation; frequent registration.update() calls
          // turn brief network/server hiccups into noisy Sentry TypeErrors.
          try {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (!newWorker) return;
              newWorker.addEventListener('statechange', () => {
                try {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    (window as any).__swNewWorker = newWorker;
                    window.dispatchEvent(new CustomEvent('swUpdateAvailable'));
                  }
                } catch (e) {
                  console.warn('[PWA] SW statechange handler error (non-fatal):', e);
                }
              });
            });
          } catch (e) {
            console.warn('[PWA] SW updatefound listener error (non-fatal):', e);
          }
        })
        .catch((err) => {
          // Failed to update a ServiceWorker for scope (...) lands here.
          // Non-fatal. Log only — do not let Sentry escalate it.
          console.warn('[PWA] SW registration failed (non-fatal):', err);
        });
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing && (window as any).__swUserRequestedUpdate) {
          refreshing = true;
          window.location.reload();
        }
      });
    } catch (e) {
      console.warn('[PWA] SW bootstrap error (non-fatal):', e);
    }
  });
}

import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";
import { initClientSentry } from "./lib/sentry";
import { probeSupabaseHealth } from "./lib/supabaseClient";
import { logStripeStatus } from "./lib/stripeInit";

initClientSentry();

// ─── Build 52: Boot probes ────────────────────────────────────────────────────
// Fire-and-forget — never block render. Surfaces broken env vars in the
// console immediately so auth + payment issues are caught before an athlete
// hits a broken signup or checkout button.
probeSupabaseHealth();
logStripeStatus();
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE_SRC =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="AthlynX image placeholder"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0f2a62"/><stop offset="0.55" stop-color="#0b1738"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs><rect width="400" height="300" rx="28" fill="url(#g)"/><circle cx="200" cy="128" r="44" fill="rgba(255,255,255,0.14)"/><path d="M88 238c36-54 72-81 108-81s72 27 116 81" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="18" stroke-linecap="round"/><text x="200" y="270" text-anchor="middle" fill="rgba(255,255,255,0.72)" font-family="Arial, sans-serif" font-size="24" font-weight="700">AthlynX</text></svg>`
  );

if (typeof window !== "undefined") {
  window.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.dataset.athlynxFallbackApplied === "true") return;
      target.dataset.athlynxFallbackApplied = "true";
      target.src = FALLBACK_IMAGE_SRC;
    },
    true
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 5000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
    },
  },
});

// Public/marketing routes — NEVER redirect away from these even if unauthenticated
const PUBLIC_ROUTES = [
  '/', '/signup', '/early-access', '/early-access-v2',
  '/signin', '/login', '/callback', '/auth/callback',
  '/forgot-password', '/demo', '/how-it-works',
  '/welcome', '/about', '/platform', '/contact',
  '/digital-health', '/privacy', '/terms', '/hipaa',
  '/pricing-tiers', '/nil-jobs', '/founder-dedication',
  '/layer-cake', '/infrastructure',
  '/investor-hub', '/investor-deck', '/founders',
  '/pricing', '/partners', '/partner', '/nil-portal',
  '/diamond-grind', '/diamond-grind/road-to-omaha', '/road-to-omaha',
  '/season-engine', '/athlynxai-season-engine', '/all-sports-season-hubs',
  '/growth-crm', '/athletic-journey-crm', '/elite-athlete-pipeline', '/recruiting-profile-crm',
  '/warriors-playbook',
  '/faith', '/ai-recruiter',
  // Build 10: public profile surfaces for Family Circle + Small Circle
  '/family', '/team', '/os',
  // Build 11: founder card, athlete public profiles, browse, doctrine, connector-os
  '/founder', '/founder-story', '/chad', '/card',
  // Build 26.5: athlete-pattern founder profile (public; edits are owner-gated inside)
  '/me',
  '/athlete', '/profile',
  '/discover', '/browse-athletes',
  '/connector-os', '/doctrine', '/audit',
  // Phase 1/1.5: /founder-dedication is public founder-story/marketing context.
  // The other transparency pages remain public.
  '/family', '/journey', '/careers', '/jobs',
  '/leadership-principles', '/blue-collar', '/veterans',
  '/military-division', '/operation-warrior-pipeline',
  '/basketball', '/hockey', '/rowing', '/water-polo',
  '/lacrosse', '/softball',
  // Live brackets + tournament pages — public for game-day traffic.
  // Required so unauthenticated visitors (investors, press, fans clicking
  // from socials) can see WCWS + MCWS live scores without a sign-in wall.
  '/brackets', '/brackets/mcws', '/brackets/wcws',
  '/mcws', '/wcws',
  '/ncaa-baseball-regionals', '/baseball-regionals',
  '/college-world-series', '/college-world-series-2026',
  '/road-to-omaha', '/road-to-omaha-2026',
  // Portals — keep public for game-day traffic from socials/ESPN/SEC
  '/transfer-portal', '/nil-gateway', '/nil-portals',
  // Lane 8 sport pages — additive allowlist so unauthenticated visitors
  // can read the marketing surface without being kicked to /signin when
  // an internal tRPC query (e.g. feed.getFeed) fails for an unauthed user.
  // No auth/role/permission surface changed — pages remain public-by-design.
  '/track', '/track-field', '/track-and-field',
  '/swimming', '/swim-surge',
  '/baseball',
  '/cricket',
  '/cheer', '/cheerleading',
  '/gymnastics',
  '/field-hockey',
  '/cross-country',
  '/volleyball', '/net-setters',
  '/tennis', '/racket-kings',
  '/wrestling', '/mat-warriors',
  '/golf',
  '/hunting', '/hunt-pro',
  '/fishing', '/reel-masters',
  '/rugby',
  '/football', '/gridiron-nexus',
  '/soccer', '/pitch-pulse',
  '/court-kings',
  '/ice-breakers',
];

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === 'undefined') return;
  if (error.message !== UNAUTHED_ERR_MSG) return;
  const currentPath = window.location.pathname;
  // Never redirect away from public/marketing pages — visitors must see the home page
  const isPublicRoute = PUBLIC_ROUTES.some(
    route => currentPath === route || currentPath.startsWith(route + '/')
  );
  if (isPublicRoute) return;
  // Redirect to /signin (not /signup) — session expired for existing user
  window.location.href = '/signin';
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.query.state.error);
  }
});
queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.mutation.state.error);
  }
});

createRoot(document.getElementById("root")!).render(
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <App />
      </trpc.Provider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);
