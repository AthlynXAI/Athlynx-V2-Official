/**
 * AthlynX API Client
 *
 * Single source of truth for all remote data fetching.
 * Change API_BASE_URL to point at any backend — everything else just works.
 * Falls back to bundled seed data on network error or missing endpoint.
 */

import type { CWSBracket, D1Conference, MLBDraftProspect, NILDeal, NILValuationSnapshot } from '@/types';
import { CWS_2026_BRACKET } from '@/data/cwsData';
import { D1_BASEBALL_CONFERENCES_2026, MLB_DRAFT_2026_PROSPECTS } from '@/data/diamondGrindData';
import { NIL_RECENT_DEALS, NIL_VALUATIONS } from '@/data/nilData';

// ─── Config ───────────────────────────────────────────────────────────────────
// Change this ONE constant to point at your real backend.
const API_BASE_URL = 'https://athlynx.ai/api';
const TIMEOUT_MS = 8000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout<T>(url: string, fallback: T): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data as T;
  } catch {
    clearTimeout(timer);
    return fallback;
  }
}

// ─── CWS / Brackets ───────────────────────────────────────────────────────────

export async function fetchCWSBracket(): Promise<CWSBracket> {
  return fetchWithTimeout<CWSBracket>(`${API_BASE_URL}/mcws`, CWS_2026_BRACKET);
}

// ─── Diamond Grind ────────────────────────────────────────────────────────────

export async function fetchD1Conferences(): Promise<D1Conference[]> {
  return fetchWithTimeout<D1Conference[]>(
    `${API_BASE_URL}/d1-conferences`,
    D1_BASEBALL_CONFERENCES_2026,
  );
}

export async function fetchMLBDraftProspects(): Promise<MLBDraftProspect[]> {
  return fetchWithTimeout<MLBDraftProspect[]>(
    `${API_BASE_URL}/mlb-draft-prospects`,
    MLB_DRAFT_2026_PROSPECTS,
  );
}

// ─── NIL ──────────────────────────────────────────────────────────────────────

export async function fetchNILDeals(): Promise<NILDeal[]> {
  return fetchWithTimeout<NILDeal[]>(`${API_BASE_URL}/nil-deals`, NIL_RECENT_DEALS);
}

export async function fetchNILValuations(): Promise<NILValuationSnapshot[]> {
  return fetchWithTimeout<NILValuationSnapshot[]>(
    `${API_BASE_URL}/nil-valuations`,
    NIL_VALUATIONS,
  );
}
