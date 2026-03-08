/**
 * check-indexability.ts
 *
 * Batch-checks key URLs of vykoupim-nemovitost.cz for indexability issues.
 * For each URL it verifies:
 *   - HTTP status (expect 200)
 *   - X-Robots-Tag header (expect absent or not containing "noindex")
 *   - <meta name="robots"> tag (expect "index, follow" or absent)
 *   - <link rel="canonical"> tag (expect present and correct)
 *   - Googlebot UA parity (same status + headers as default UA)
 *
 * Usage: npx tsx scripts/check-indexability.ts
 */

const URLS = [
  // Homepage
  "https://vykoupim-nemovitost.cz/",
  // Regional subdomains
  "https://praha.vykoupim-nemovitost.cz/",
  "https://jihomoravsky.vykoupim-nemovitost.cz/",
  "https://moravskoslezsky.vykoupim-nemovitost.cz/",
  // Use-case pages
  "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
  "https://vykoupim-nemovitost.cz/vykup-pri-dedictvi",
  "https://vykoupim-nemovitost.cz/vykup-pri-rozvodu",
  // Info pages
  "https://vykoupim-nemovitost.cz/caste-dotazy",
  "https://vykoupim-nemovitost.cz/kraje",
  "https://vykoupim-nemovitost.cz/vykup-bytu",
  // Blog
  "https://vykoupim-nemovitost.cz/blog",
  // Property-type pages
  "https://vykoupim-nemovitost.cz/vykup-spoluvlastnickeho-podilu",
  "https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-hypotekou",
  "https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-vecnym-bremenem",
  "https://vykoupim-nemovitost.cz/zpetny-najem",
  // More regional subdomains
  "https://stredocesky.vykoupim-nemovitost.cz/",
  "https://plzensky.vykoupim-nemovitost.cz/",
  "https://ustecky.vykoupim-nemovitost.cz/",
  // robots.txt + sitemap
  "https://vykoupim-nemovitost.cz/robots.txt",
  "https://vykoupim-nemovitost.cz/sitemap.xml",
];

const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface CheckResult {
  url: string;
  status: number;
  xRobotsTag: string | null;
  metaRobots: string | null;
  canonical: string | null;
  googlebotStatus: number;
  googlebotXRobots: string | null;
  issues: string[];
  pass: boolean;
}

function extractMeta(html: string, name: string): string | null {
  const regex = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const match = html.match(regex);
  if (match) return match[1];
  const regex2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`,
    "i",
  );
  const match2 = html.match(regex2);
  return match2 ? match2[1] : null;
}

function extractCanonical(html: string): string | null {
  const regex = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i;
  const match = html.match(regex);
  if (match) return match[1];
  const regex2 = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i;
  const match2 = html.match(regex2);
  return match2 ? match2[1] : null;
}

async function checkUrl(url: string): Promise<CheckResult> {
  const issues: string[] = [];
  const isAsset = url.endsWith("/robots.txt") || url.endsWith("/sitemap.xml");

  const defaultRes = await fetch(url, {
    headers: { "User-Agent": DEFAULT_UA },
    redirect: "follow",
  });
  const status = defaultRes.status;
  const xRobotsTag =
    defaultRes.headers.get("x-robots-tag")?.toLowerCase() ?? null;
  const body = await defaultRes.text();

  let metaRobots: string | null = null;
  let canonical: string | null = null;

  if (!isAsset) {
    metaRobots = extractMeta(body, "robots");
    canonical = extractCanonical(body);
  }

  const gbRes = await fetch(url, {
    headers: { "User-Agent": GOOGLEBOT_UA },
    redirect: "follow",
  });
  const googlebotStatus = gbRes.status;
  const googlebotXRobots =
    gbRes.headers.get("x-robots-tag")?.toLowerCase() ?? null;
  await gbRes.text();

  if (isAsset) {
    if (status !== 200) issues.push(`HTTP ${status} (expected 200)`);
    if (googlebotStatus !== status)
      issues.push(`Googlebot got HTTP ${googlebotStatus} vs default ${status}`);
  } else {
    if (status !== 200) issues.push(`HTTP ${status} (expected 200)`);
    if (xRobotsTag && xRobotsTag.includes("noindex"))
      issues.push(`X-Robots-Tag contains noindex: "${xRobotsTag}"`);
    if (metaRobots && metaRobots.toLowerCase().includes("noindex"))
      issues.push(`meta robots contains noindex: "${metaRobots}"`);
    if (!canonical) issues.push("Missing canonical tag");
    if (googlebotStatus !== status)
      issues.push(`Googlebot got HTTP ${googlebotStatus} vs default ${status}`);
    if (googlebotXRobots !== xRobotsTag)
      issues.push(
        `Googlebot X-Robots-Tag differs: "${googlebotXRobots}" vs "${xRobotsTag}"`,
      );
  }

  return {
    url,
    status,
    xRobotsTag,
    metaRobots,
    canonical,
    googlebotStatus,
    googlebotXRobots,
    issues,
    pass: issues.length === 0,
  };
}

async function main() {
  console.log("🔍 Indexability Check — vykoupim-nemovitost.cz\n");
  console.log(`Checking ${URLS.length} URLs...\n`);

  const results: CheckResult[] = [];

  for (const url of URLS) {
    try {
      const result = await checkUrl(url);
      results.push(result);
      const icon = result.pass ? "✅" : "❌";
      console.log(`${icon} [${result.status}] ${url}`);
      if (!result.pass) {
        for (const issue of result.issues) {
          console.log(`   ⚠️  ${issue}`);
        }
      }
    } catch (err) {
      console.log(`❌ [ERR] ${url}`);
      console.log(`   ⚠️  ${err instanceof Error ? err.message : err}`);
      results.push({
        url,
        status: 0,
        xRobotsTag: null,
        metaRobots: null,
        canonical: null,
        googlebotStatus: 0,
        googlebotXRobots: null,
        issues: [err instanceof Error ? err.message : String(err)],
        pass: false,
      });
    }
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;

  console.log("\n" + "=".repeat(60));
  console.log(
    `📊 Results: ${passed} PASS / ${failed} FAIL out of ${results.length} URLs`,
  );

  if (failed > 0) {
    console.log("\n❌ FAILED URLs:");
    for (const r of results.filter((r) => !r.pass)) {
      console.log(`  - ${r.url}`);
      for (const issue of r.issues) {
        console.log(`    → ${issue}`);
      }
    }
    process.exit(1);
  } else {
    console.log("\n✅ All URLs pass indexability checks!");
    process.exit(0);
  }
}

main();
