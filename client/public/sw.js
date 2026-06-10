// ATHLYNX Service Worker — v2.1.0
// Layer Cake Architecture: Offline-first, background sync, push notifications
// Facebook-scale PWA: works perfectly on any phone, anywhere in the world
// Chad A. Dozier Sr. — Founder & CEO, ATHLYNX AI | Dozier Holdings Group

// v2.2.0 — May 17 2026 — Force clean activation + remove gold from offline page (brand rule).
const CACHE_VERSION = 'athlynx-v2.2.0';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE     = `${CACHE_VERSION}-api`;
const IMAGE_CACHE   = `${CACHE_VERSION}-images`;

// Core app shell — always available offline
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/athlynx-icon.png',
  '/logos/dhg-crab-logo.png',
];

// CDN assets to pre-cache
const CDN_ASSETS = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028706780/CwaxehSqJgGxbN8KdgWNph/icon-192_52ef996c.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028706780/CwaxehSqJgGxbN8KdgWNph/icon-512_816b3f83.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028706780/CwaxehSqJgGxbN8KdgWNph/apple-touch-icon_6f0ee0ef.png',
];

// Routes that work offline with cached data
const OFFLINE_ROUTES = ['/', '/feed', '/profile', '/nil-portal', '/transfer-portal', '/dhg', '/softmor'];

// ── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW v2.1] Installing ATHLYNX service worker...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) =>
        cache.addAll(APP_SHELL).catch((err) =>
          console.warn('[SW] App shell cache partial failure:', err)
        )
      ),
      caches.open(STATIC_CACHE).then((cache) =>
        Promise.allSettled(
          CDN_ASSETS.map((url) =>
            fetch(url, { mode: 'cors' })
              .then((res) => { if (res.ok) cache.put(url, res); })
              .catch(() => {})
          )
        )
      ),
    ]).then(() => {
      console.log('[SW v2.1] Installed. Skipping waiting...');
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW v2.1] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name.startsWith('athlynx-') && ![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE].includes(name))
          .map((name) => {
            console.log('[SW] Purging old cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => {
      console.log('[SW v2.1] Active. Claiming clients...');
      return self.clients.claim();
    })
  );
});

// ── FETCH STRATEGY ───────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, and non-http requests
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;
  if (url.hostname === 'localhost' && url.pathname.startsWith('/trpc')) return;

  // Strategy 1: API calls — Network first, fall back to cache
  if (url.pathname.startsWith('/trpc') || url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Strategy 2: Images — Cache first, network fallback
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
    return;
  }

  // Strategy 3: Static assets (JS, CSS, fonts) — Cache first
  if (url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/) || url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Strategy 4: Navigation (HTML pages) — Network first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Serve cached version or offline shell
          return caches.match(request)
            .then((cached) => cached || caches.match('/'))
            .then((response) => response || new Response(
              `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ATHLYNX — Offline</title><style>body{background:#040c1a;color:#ffffff;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:20px}h1{background:linear-gradient(90deg,#3b82f6,#06b6d4);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:2rem;margin-bottom:1rem;font-weight:900;letter-spacing:2px}p{color:#94a3b8;font-size:1rem}button{background:linear-gradient(90deg,#3b82f6,#06b6d4);color:white;border:none;padding:12px 24px;border-radius:8px;font-size:1rem;cursor:pointer;margin-top:1rem;font-weight:700}</style></head><body><div><img src="/athlynx-icon.png" style="width:80px;border-radius:16px;margin-bottom:1rem"><h1>ATHLYNX</h1><p>You're offline. Connect to the internet to access the platform.</p><button onclick="location.reload()">Try Again</button></div></body></html>`,
              { headers: { 'Content-Type': 'text/html' } }
            ))
        })
    );
    return;
  }

  // Default: network with dynamic cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ── PUSH NOTIFICATIONS ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title   = data.title   ?? 'ATHLYNX';
  const body    = data.body    ?? 'You have a new notification';
  const icon    = data.icon    ?? '/athlynx-icon.png';
  const badge   = data.badge   ?? '/athlynx-icon.png';
  const url     = data.url     ?? '/feed';
  const tag     = data.tag     ?? 'athlynx-notification';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      data: { url },
      vibrate: [200, 100, 200],
      requireInteraction: data.requireInteraction ?? false,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/feed';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── BACKGROUND SYNC ──────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'athlynx-sync') {
    console.log('[SW] Background sync: athlynx-sync');
    // Sync any queued actions when connection is restored
  }
});

console.log('[SW v2.1] ATHLYNX Service Worker loaded — Layer Cake Architecture active');
