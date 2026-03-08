import { google, webmasters_v3 } from "googleapis";

function getAuth() {
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyBase64) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env not set");
  }

  const keyJson = JSON.parse(
    Buffer.from(keyBase64, "base64").toString("utf-8"),
  ) as { client_email: string; private_key: string };

  return new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

const SITE_URL = process.env.GSC_SITE_URL ?? "https://vykoupim-nemovitost.cz/";

export interface AnalyticsRow {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface AnalyticsResponse {
  rows: AnalyticsRow[];
  totals: {
    clicks: number;
    impressions: number;
    avgPosition: number;
  };
}

export interface CoverageResponse {
  submitted: number;
  indexed: number;
  sitemaps: Array<{
    path: string;
    submitted: number;
    indexed: number;
    lastSubmitted: string;
  }>;
}

export async function fetchSearchAnalytics(): Promise<AnalyticsResponse> {
  const auth = getAuth();
  const webmasters = google.webmasters({ version: "v3", auth });

  const now = new Date();
  const endDate = new Date(now.getTime() - 2 * 86400000)
    .toISOString()
    .split("T")[0];
  const startDate = new Date(now.getTime() - 30 * 86400000)
    .toISOString()
    .split("T")[0];

  const requestBody: webmasters_v3.Schema$SearchAnalyticsQueryRequest = {
    startDate,
    endDate,
    dimensions: ["query"],
    rowLimit: 20,
  };

  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody,
  });

  const rows: AnalyticsRow[] = (res.data.rows ?? []).map(
    (r: webmasters_v3.Schema$ApiDataRow) => ({
      query: r.keys?.[0] ?? "",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      position: Math.round((r.position ?? 0) * 10) / 10,
    }),
  );

  let totalClicks = 0;
  let totalImpressions = 0;
  let totalPosition = 0;
  for (const row of rows) {
    totalClicks += row.clicks;
    totalImpressions += row.impressions;
    totalPosition += row.position;
  }

  return {
    rows,
    totals: {
      clicks: totalClicks,
      impressions: totalImpressions,
      avgPosition:
        rows.length > 0
          ? Math.round((totalPosition / rows.length) * 10) / 10
          : 0,
    },
  };
}

export async function fetchCoverageData(): Promise<CoverageResponse> {
  const auth = getAuth();
  const webmasters = google.webmasters({ version: "v3", auth });

  const res = await webmasters.sitemaps.list({ siteUrl: SITE_URL });

  let totalSubmitted = 0;
  let totalIndexed = 0;

  const sitemaps = (res.data.sitemap ?? []).map(
    (s: webmasters_v3.Schema$WmxSitemap) => {
      const submitted = Number(s.contents?.[0]?.submitted ?? 0);
      const indexed = Number(s.contents?.[0]?.indexed ?? 0);
      totalSubmitted += submitted;
      totalIndexed += indexed;
      return {
        path: s.path ?? "",
        submitted,
        indexed,
        lastSubmitted: s.lastSubmitted ?? "",
      };
    },
  );

  return {
    submitted: totalSubmitted,
    indexed: totalIndexed,
    sitemaps,
  };
}
