/**
 * IndexNow Bulk URL Submission Script
 *
 * Fetches all URLs from the production sitemap and submits them
 * to the IndexNow API in batches. Supported engines: Bing, Yandex, Seznam.cz.
 *
 * Usage: npx tsx scripts/indexnow-submit.ts
 */

const HOST = "vykoupim-nemovitost.cz";
const INDEXNOW_KEY = "ae4088d2d61e4151a087d0c21597acd1";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const BATCH_SIZE = 100;

const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://yandex.com/indexnow",
  "https://search.seznam.cz/indexnow",
] as const;

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

interface SubmissionResult {
  endpoint: string;
  batch: number;
  urlCount: number;
  status: number;
  success: boolean;
}

async function extractLocs(xml: string): Promise<string[]> {
  const locs: string[] = [];
  const locRegex = /<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}

/**
 * Recursively expand a sitemap (or sitemap index) into a flat list of leaf
 * URLs. Image-sitemap and other XML namespaces are detected by the host
 * domain match — we only follow same-host index entries.
 */
async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  console.log(`Fetching sitemap from ${sitemapUrl}...`);

  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch sitemap: ${response.status} ${response.statusText}`,
    );
  }
  const xml = await response.text();
  const isIndex = xml.includes("<sitemapindex");
  const locs = await extractLocs(xml);

  if (!isIndex) {
    console.log(`  → ${locs.length} leaf URLs`);
    return locs;
  }

  // sitemapindex: recurse into each child sitemap, but skip image-sitemap
  // (image-sitemap entries point to the same page URLs as the other sub-sitemaps,
  // and IndexNow doesn't index image URLs anyway).
  console.log(`  → sitemapindex with ${locs.length} children, recursing...`);
  const all: string[] = [];
  for (const child of locs) {
    if (child.includes("image-sitemap")) {
      console.log(`    skip ${child} (image sitemap)`);
      continue;
    }
    const childUrls = await fetchSitemapUrls(child);
    all.push(...childUrls);
  }

  // De-dupe (geo URLs can theoretically appear in multiple sub-sitemaps)
  const unique = Array.from(new Set(all));
  console.log(`Total unique leaf URLs: ${unique.length}`);
  return unique;
}

function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

async function submitBatch(
  endpoint: string,
  urls: string[],
  batchIndex: number,
): Promise<SubmissionResult> {
  const payload: IndexNowPayload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return {
      endpoint,
      batch: batchIndex + 1,
      urlCount: urls.length,
      status: response.status,
      success: response.status >= 200 && response.status < 300,
    };
  } catch (err) {
    // Network failures (DNS, timeout, blocked region) — log and continue
    // so a single flaky engine doesn't kill the whole submission.
    return {
      endpoint,
      batch: batchIndex + 1,
      urlCount: urls.length,
      status: 0,
      success: false,
    };
  }
}

async function submitToEndpoint(
  endpoint: string,
  batches: string[][],
): Promise<SubmissionResult[]> {
  const results: SubmissionResult[] = [];

  for (let i = 0; i < batches.length; i++) {
    const result = await submitBatch(endpoint, batches[i], i);
    results.push(result);

    const statusIcon = result.success ? "✅" : "❌";
    console.log(
      `  ${statusIcon} Batch ${result.batch}/${batches.length} → ${endpoint} ` +
        `(${result.urlCount} URLs, HTTP ${result.status})`,
    );
  }

  return results;
}

function printSummary(allResults: SubmissionResult[]): void {
  console.log("\n" + "=".repeat(60));
  console.log("SUBMISSION SUMMARY");
  console.log("=".repeat(60));

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    const endpointResults = allResults.filter((r) => r.endpoint === endpoint);
    const successCount = endpointResults.filter((r) => r.success).length;
    const failCount = endpointResults.length - successCount;
    const totalUrls = endpointResults.reduce((sum, r) => sum + r.urlCount, 0);

    console.log(`\n${endpoint}:`);
    console.log(`  URLs submitted: ${totalUrls}`);
    console.log(`  Batches: ${successCount} success, ${failCount} failed`);
  }

  const totalSuccess = allResults.filter((r) => r.success).length;
  const totalFail = allResults.length - totalSuccess;

  console.log("\n" + "-".repeat(60));
  console.log(
    `TOTAL: ${totalSuccess} successful, ${totalFail} failed submissions`,
  );
  console.log("=".repeat(60));
}

async function main(): Promise<void> {
  console.log("IndexNow Bulk URL Submission");
  console.log(`Host: ${HOST}`);
  console.log(`Key: ${INDEXNOW_KEY}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log("");

  const urls = await fetchSitemapUrls(SITEMAP_URL);

  if (urls.length === 0) {
    console.error("No URLs found in sitemap. Aborting.");
    process.exit(1);
  }

  const batches = createBatches(urls, BATCH_SIZE);
  console.log(
    `\nSplit into ${batches.length} batches of up to ${BATCH_SIZE} URLs each.\n`,
  );

  const allResults: SubmissionResult[] = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    console.log(`\nSubmitting to ${endpoint}...`);
    const results = await submitToEndpoint(endpoint, batches);
    allResults.push(...results);
  }

  printSummary(allResults);

  const hasFailures = allResults.some((r) => !r.success);
  if (hasFailures) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
