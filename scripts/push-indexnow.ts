/**
 * IndexNow — batch-submit all URLs from sitemap.xml to search engines.
 * Covers: Bing, Yandex, Seznam.cz (one ping via api.indexnow.org).
 */

const SITEMAP_URL = "https://vykoupim-nemovitost.cz/sitemap.xml";
const HOST = "vykoupim-nemovitost.cz";
const KEY = "697638b4d8bb7235a6b86d4ead53526d";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urls: string[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function pushIndexNow(urls: string[]): Promise<void> {
  console.log(`📡 Submitting ${urls.length} URLs to IndexNow...`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`📬 IndexNow response: ${res.status} ${res.statusText}`);

  if (res.status === 200 || res.status === 202) {
    console.log("✅ URLs submitted successfully");
  } else {
    const text = await res.text().catch(() => "");
    console.error(`❌ IndexNow rejected the request: ${text}`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log(`🔍 Fetching sitemap from ${SITEMAP_URL}`);
  const urls = await fetchSitemapUrls();

  if (urls.length === 0) {
    console.warn("⚠️  No URLs found in sitemap");
    return;
  }

  console.log(`📄 Found ${urls.length} URLs:`);
  urls.forEach((url) => console.log(`   ${url}`));

  await pushIndexNow(urls);
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
