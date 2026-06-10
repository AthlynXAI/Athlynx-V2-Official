/**
 * AthlynX — Vexo Analytics (web-compatible wrapper)
 * Calls the Vexo analytics API directly without the React Native SDK.
 * App ID: 5c0b1865-f655-4664-bc5a-b65786bdee1a
 */

const VEXO_APP_ID = '5c0b1865-f655-4664-bc5a-b65786bdee1a';
const VEXO_API = 'https://api.vexo.co';

let initialized = false;

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem('vexo_sid');
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem('vexo_sid', sid);
    }
    return sid;
  } catch {
    return 'unknown';
  }
}

function getDeviceId(): string {
  try {
    let did = localStorage.getItem('vexo_did');
    if (!did) {
      did = crypto.randomUUID();
      localStorage.setItem('vexo_did', did);
    }
    return did;
  } catch {
    return 'unknown';
  }
}

async function sendEvent(eventName: string, properties: Record<string, unknown> = {}) {
  try {
    await fetch(`${VEXO_API}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appId: VEXO_APP_ID,
        event: eventName,
        sessionId: getSessionId(),
        deviceId: getDeviceId(),
        timestamp: new Date().toISOString(),
        properties: {
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          ...properties,
        },
      }),
      keepalive: true,
    });
  } catch {
    // Analytics should never break the app
  }
}

/**
 * Initialize Vexo analytics — call once at app startup.
 */
export function vexo(_appId: string = VEXO_APP_ID) {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // Track initial page view
  sendEvent('page_view', { path: window.location.pathname });

  // Track page views on navigation
  const originalPushState = history.pushState.bind(history);
  history.pushState = function (...args) {
    originalPushState(...args);
    sendEvent('page_view', { path: window.location.pathname });
  };

  window.addEventListener('popstate', () => {
    sendEvent('page_view', { path: window.location.pathname });
  });
}

/**
 * Identify the current user by email (after login).
 */
export function identifyDevice(email: string) {
  sendEvent('identify', { email });
}

/**
 * Track a custom event.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  sendEvent(name, properties);
}
