/**
 * VR-230: GSC URL Inspection API — Batch URL Submission
 *
 * Fetches sitemap.xml, prioritizes URLs, and inspects each via
 * Google Search Console URL Inspection API to trigger indexing.
 *
 * Auth: GOOGLE_SERVICE_ACCOUNT_KEY env var (JSON string)
 * Rate limit: 200 URLs/day, 1 request/sec
 */

import { google } from "googleapis";

const SITE_URL = "https://www.vykoupim-nemovitost.cz";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const MAX_URLS_PER_DAY = 200;
const REQUEST_DELAY_MS = 1_000;

// Priority buckets — lower index = higher priority
const PRIORITY_PATTERNS: RegExp[] = [
  /^https:\/\/www\.vykoupim-nemovitost\.cz\/?$/, // homepage
  /\/vykup-nemovitosti-/, // regional pages
  /\/use-case|\/jak-|\/proc-|\/kdy-/, // use cases
  /\/blog|\/clanek/, // blog
];

interface InspectionResult {
  url: string;
  status: "PASS" | "NEUTRAL" | "FAIL" | "ERROR";
  coverageState?: string;
  error?: string;
}

function prioritize(urls: string[]): string[] {
  const buckets: string[][] = PRIORITY_PATTERNS.map(() => []);
  const rest: string[] = [];

  for (const url of urls) {
    let placed = false;
    for (let i = 0; i < PRIORITY_PATTERNS.length; i++) {
      if (PRIORITY_PATTERNS[i].test(url)) {
        buckets[i].push(url);
        placed = true;
        break;
      }
    }
    if (!placed) rest.push(url);
  }

  return [...buckets.flat(), ...rest];
}

async function fetchSitemap(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();

  const urls: string[] = [];
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  console.log(`📥 Fetched ${urls.length} URLs from sitemap`);
  return urls;
}

function getAuthClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error("Missing env var GOOGLE_SERVICE_ACCOUNT_KEY (JSON string)");
  }
  const key = JSON.parse(keyJson);
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });
}

async function inspectUrl(
  accessToken: string,
  inspectionUrl: string,
): Promise<InspectionResult> {
  const res = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inspectionUrl,
        siteUrl: SITE_URL,
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return {
      url: inspectionUrl,
      status: "ERROR",
      error: `${res.status}: ${text}`,
    };
  }

  const data = await res.json();
  const result = data.inspectionResult?.indexStatusResult;
  const verdict = result?.verdict ?? "UNKNOWN";
  const coverageState = result?.coverageState ?? "UNKNOWN";

  return {
    url: inspectionUrl,
    status: verdict as InspectionResult["status"],
    coverageState,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🚀 GSC URL Inspection — Batch Submit\n");

  const allUrls = await fetchSitemap();
  const sorted = prioritize(allUrls);
  const urls = sorted.slice(0, MAX_URLS_PER_DAY);

  console.log(
    `📊 Processing ${urls.length}/${allUrls.length} URLs (limit ${MAX_URLS_PER_DAY}/day)\n`,
  );

  const auth = getAuthClient();
  const accessToken = await auth.getAccessToken();
  if (!accessToken) throw new Error("Failed to obtain access token");

  const results: InspectionResult[] = [];
  const stats = { pass: 0, neutral: 0, fail: 0, error: 0 };

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await inspectUrl(accessToken as string, url);
    results.push(result);

    const icon =
      result.status === "PASS"
        ? "✅"
        : result.status === "NEUTRAL"
          ? "⏳"
          : result.status === "ERROR"
            ? "❌"
            : "⚠️";

    const detail = result.error ?? result.coverageState ?? "";
    console.log(
      `${icon} [${i + 1}/${urls.length}] ${url} — ${result.status} ${detail}`,
    );

    stats[result.status.toLowerCase() as keyof typeof stats]++;

    if (i < urls.length - 1) await sleep(REQUEST_DELAY_MS);
  }

  console.log("\n📋 Summary:");
  console.log(`   ✅ PASS (indexed):    ${stats.pass}`);
  console.log(`   ⏳ NEUTRAL:           ${stats.neutral}`);
  console.log(`   ⚠️  FAIL:              ${stats.fail}`);
  console.log(`   ❌ ERROR:             ${stats.error}`);
  console.log(`   📊 Total:             ${results.length}`);

  if (stats.error > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exitCode = 1;
});
