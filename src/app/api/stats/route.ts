import { NextResponse } from "next/server";

/**
 * VR-151: Dynamic social proof stats endpoint.
 *
 * Data sources (in priority order):
 * 1. GOOGLE_SHEET_STATS_URL — Apps Script GET endpoint or published JSON
 * 2. Env vars: LEAD_COUNT_TOTAL, LEAD_COUNT_MONTH, LEAD_LAST_REGION
 *
 * Response: { totalLeads, monthLeads, lastRegion }
 * Cache: 1 hour (s-maxage + stale-while-revalidate)
 */

interface StatsResponse {
  readonly totalLeads: number;
  readonly monthLeads: number;
  readonly lastRegion: string;
}

let cachedStats: StatsResponse | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000;

async function fetchStatsFromSheet(): Promise<StatsResponse | null> {
  const sheetUrl = process.env.GOOGLE_SHEET_STATS_URL;
  if (!sheetUrl) return null;

  try {
    const res = await fetch(sheetUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data = (await res.json()) as Record<string, unknown>;
    return {
      totalLeads: Number(data.totalLeads) || 0,
      monthLeads: Number(data.monthLeads) || 0,
      lastRegion: String(data.lastRegion || ""),
    };
  } catch {
    console.warn("[api/stats] Failed to fetch from Google Sheets");
    return null;
  }
}

function getEnvFallback(): StatsResponse {
  return {
    totalLeads: Number(process.env.LEAD_COUNT_TOTAL) || 0,
    monthLeads: Number(process.env.LEAD_COUNT_MONTH) || 0,
    lastRegion: process.env.LEAD_LAST_REGION || "",
  };
}

async function getStats(): Promise<StatsResponse> {
  const now = Date.now();
  if (cachedStats && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedStats;
  }

  const sheetStats = await fetchStatsFromSheet();
  const stats = sheetStats ?? getEnvFallback();

  cachedStats = stats;
  cacheTimestamp = now;

  return stats;
}

export async function GET(): Promise<NextResponse<StatsResponse>> {
  const stats = await getStats();

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
