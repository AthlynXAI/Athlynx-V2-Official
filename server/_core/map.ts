/**
 * Google Maps API Integration — AthlynX
 * Direct Google Maps API calls via GOOGLE_MAPS_API_KEY.
 * NO forge proxy dependencies.
 */

const GOOGLE_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api";

function getApiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }
  return key;
}

type MapRequestParams = Record<string, string | number | boolean | undefined>;

export async function makeRequest<T>(
  endpoint: string,
  params: MapRequestParams = {}
): Promise<T> {
  const apiKey = getApiKey();
  const url = new URL(`${GOOGLE_MAPS_BASE_URL}/${endpoint}/json`);
  url.searchParams.set("key", apiKey);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Maps API request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Maps API error: ${data.status} — ${data.error_message || ""}`);
  }

  return data as T;
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

export async function geocode(address: string) {
  return makeRequest<{ results: any[]; status: string }>("geocode", { address });
}

export async function reverseGeocode(lat: number, lng: number) {
  return makeRequest<{ results: any[]; status: string }>("geocode", { latlng: `${lat},${lng}` });
}

export async function placesSearch(query: string, location?: string, radius?: number) {
  return makeRequest<{ results: any[]; status: string }>("place/textsearch", {
    query,
    ...(location ? { location } : {}),
    ...(radius ? { radius } : {}),
  });
}

export async function placeDetails(placeId: string) {
  return makeRequest<{ result: any; status: string }>("place/details", { place_id: placeId });
}

export async function distanceMatrix(origins: string, destinations: string) {
  return makeRequest<{ rows: any[]; status: string }>("distancematrix", {
    origins,
    destinations,
    units: "imperial",
  });
}
