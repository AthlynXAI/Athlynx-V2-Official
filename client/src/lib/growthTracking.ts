export type GrowthAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  ref?: string;
  sourceUrl?: string;
  landingPath?: string;
};

const STORAGE_KEY = "athlynx_growth_attribution";

function readStoredAttribution(): GrowthAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as GrowthAttribution : {};
  } catch {
    return {};
  }
}

export function captureGrowthAttribution(): GrowthAttribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const next: GrowthAttribution = {
    ...readStoredAttribution(),
    utmSource: params.get("utm_source") || readStoredAttribution().utmSource,
    utmMedium: params.get("utm_medium") || readStoredAttribution().utmMedium,
    utmCampaign: params.get("utm_campaign") || readStoredAttribution().utmCampaign,
    utmContent: params.get("utm_content") || readStoredAttribution().utmContent,
    utmTerm: params.get("utm_term") || readStoredAttribution().utmTerm,
    ref: params.get("ref") || params.get("referral") || readStoredAttribution().ref,
    sourceUrl: document.referrer || readStoredAttribution().sourceUrl,
    landingPath: `${window.location.pathname}${window.location.search}`,
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can fail in private browsing; tracking must never block signup.
  }
  return next;
}

export function getGrowthAttribution(extra?: Record<string, unknown>): GrowthAttribution & Record<string, unknown> {
  return { ...readStoredAttribution(), ...extra };
}
