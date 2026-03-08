/**
 * Seznam.cz Sitemap Ping — notify Seznam about sitemap updates.
 * Endpoint: https://search.seznam.cz/sitemap?sitemap=<url>
 */

const SITEMAP_URL = "https://vykoupim-nemovitost.cz/sitemap.xml";
const SEZNAM_PING_ENDPOINT = `https://search.seznam.cz/sitemap?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

async function pingSeznam(): Promise<void> {
  console.log(`🔍 Pinging Seznam.cz with sitemap: ${SITEMAP_URL}`);
  console.log(`📡 Endpoint: ${SEZNAM_PING_ENDPOINT}`);

  const res = await fetch(SEZNAM_PING_ENDPOINT, { method: "GET" });

  console.log(`📬 Seznam response: ${res.status} ${res.statusText}`);

  const body = await res.text().catch(() => "");
  if (body) {
    console.log(`📄 Response body: ${body.slice(0, 500)}`);
  }

  if (res.ok) {
    console.log("✅ Seznam.cz sitemap ping successful");
  } else {
    console.error("❌ Seznam.cz sitemap ping failed");
    process.exit(1);
  }
}

pingSeznam().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
