#!/usr/bin/env tsx
/**
 * Indexability health check script.
 * Checks crawl chain for vykoupim-nemovitost.cz and all subdomains.
 *
 * Usage: npx tsx scripts/check-indexability.ts
 */

const PRODUCTION_DOMAIN = "vykoupim-nemovitost.cz";
const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const SUBDOMAINS = [
  "praha",
  "stredocesky",
  "jihocesky",
  "plzensky",
  "karlovarsky",
  "ustecky",
  "liberecky",
  "kralovehradecky",
  "pardubicky",
  "vysocina",
  "jihomoravsky",
  "olomoucky",
  "moravskoslezsky",
  "zlinsky",
];

const KEY_URLS = [
  `https://${PRODUCTION_DOMAIN}/`,
  `https://${PRODUCTION_DOMAIN}/kraje`,
  `https://${PRODUCTION_DOMAIN}/blog`,
  `https://${PRODUCTION_DOMAIN}/vykup-pri-exekuci`,
  `https://${PRODUCTION_DOMAIN}/proc-my`,
  `https://praha.${PRODUCTION_DOMAIN}/`,
  `https://stredocesky.${PRODUCTION_DOMAIN}/`,
  `https://jihomoravsky.${PRODUCTION_DOMAIN}/`,
];

interface CheckResult {
  url: string;
  status: number;
  xRobotsTag: string | null;
  metaRobots: string | null;
  canonical: string | null;
  issues: string[];
}

async function checkUrl(url: string): Promise<CheckResult> {
  const issues: string[] = [];

  const response = await fetch(url, {
    headers: { "User-Agent": GOOGLEBOT_UA },
    redirect: "follow",
  });

  const status = response.status;
  const xRobotsTag = response.headers.get("x-robots-tag");

  if (status !== 200) {
    issues.push(`HTTP ${status} (expected 200)`);
  }

  if (xRobotsTag?.includes("noindex")) {
    issues.push(`X-Robots-Tag contains noindex: ${xRobotsTag}`);
  }

  const html = await response.text();

  // Extract meta robots
  const metaRobotsMatch = html.match(/name="robots"\s+content="([^"]*)"/i);
  const metaRobots = metaRobotsMatch?.[1] ?? null;

  if (metaRobots?.includes("noindex")) {
    issues.push(`meta robots contains noindex: ${metaRobots}`);
  }

  // Extract canonical
  const canonicalMatch = html.match(/rel="canonical"\s+href="([^"]*)"/i);
  const canonical = canonicalMatch?.[1] ?? null;

  if (!canonical) {
    issues.push("No canonical tag found");
  }

  return { url, status, xRobotsTag, metaRobots, canonical, issues };
}

async function checkRobotsTxt(domain: string): Promise<{
  domain: string;
  status: number;
  content: string;
  issues: string[];
}> {
  const issues: string[] = [];
  const url = `https://${domain}/robots.txt`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": GOOGLEBOT_UA },
    });

    const status = response.status;
    const content = await response.text();

    if (status !== 200) {
      issues.push(`robots.txt returned HTTP ${status}`);
    }

    if (
      content.includes("Disallow: /") &&
      !content.includes("Disallow: /api")
    ) {
      // Check if there's a blanket Disallow
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim().toLowerCase();
        if (trimmed === "disallow: /" || trimmed === "disallow:/") {
          issues.push("Blanket Disallow: / found — blocks all crawling!");
        }
      }
    }

    if (content.toLowerCase().includes("user-agent: googlebot")) {
      const gbSection = content
        .split(/user-agent:\s*googlebot/i)[1]
        ?.split(/user-agent:/i)[0];
      if (gbSection?.includes("Disallow")) {
        issues.push("Googlebot-specific Disallow rules found");
      }
    }

    return { domain, status, content, issues };
  } catch (error) {
    return {
      domain,
      status: 0,
      content: "",
      issues: [`Failed to fetch: ${error}`],
    };
  }
}

async function checkSitemap(url: string): Promise<{
  url: string;
  status: number;
  urlCount: number;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": GOOGLEBOT_UA },
    });

    const status = response.status;
    if (status !== 200) {
      return { url, status, urlCount: 0, issues: [`HTTP ${status}`] };
    }

    const xml = await response.text();

    if (!xml.includes("<?xml")) {
      issues.push("Not valid XML (missing XML declaration)");
    }

    const urlCount = (xml.match(/<loc>/g) || []).length;

    if (urlCount === 0) {
      issues.push("Sitemap contains 0 URLs");
    }

    return { url, status, urlCount, issues };
  } catch (error) {
    return { url, status: 0, urlCount: 0, issues: [`Failed: ${error}`] };
  }
}

async function main(): Promise<void> {
  let hasErrors = false;

  console.log("=== INDEXABILITY HEALTH CHECK ===\n");

  // 1. Check key URLs as Googlebot
  console.log("--- 1. Googlebot URL Checks ---");
  for (const url of KEY_URLS) {
    const result = await checkUrl(url);
    const status = result.issues.length === 0 ? "✅" : "❌";
    console.log(`${status} ${result.url}`);
    console.log(
      `   HTTP: ${result.status} | Meta robots: ${result.metaRobots ?? "none"} | X-Robots-Tag: ${result.xRobotsTag ?? "none"}`,
    );
    console.log(`   Canonical: ${result.canonical ?? "MISSING"}`);
    if (result.issues.length > 0) {
      hasErrors = true;
      for (const issue of result.issues) {
        console.log(`   ⚠️  ${issue}`);
      }
    }
    console.log();
  }

  // 2. Check robots.txt
  console.log("--- 2. robots.txt Checks ---");
  const robotsDomains = [
    PRODUCTION_DOMAIN,
    ...SUBDOMAINS.map((s) => `${s}.${PRODUCTION_DOMAIN}`),
  ];
  for (const domain of robotsDomains) {
    const result = await checkRobotsTxt(domain);
    const status = result.issues.length === 0 ? "✅" : "❌";
    console.log(`${status} ${domain}/robots.txt — HTTP ${result.status}`);
    if (result.issues.length > 0) {
      hasErrors = true;
      for (const issue of result.issues) {
        console.log(`   ⚠️  ${issue}`);
      }
    }
  }
  console.log();

  // 3. Check sitemaps
  console.log("--- 3. Sitemap Checks ---");
  const sitemapUrls = [
    `https://${PRODUCTION_DOMAIN}/sitemap.xml`,
    ...SUBDOMAINS.map((s) => `https://${s}.${PRODUCTION_DOMAIN}/sitemap.xml`),
  ];
  for (const url of sitemapUrls) {
    const result = await checkSitemap(url);
    const status = result.issues.length === 0 ? "✅" : "❌";
    console.log(`${status} ${result.url} — ${result.urlCount} URLs`);
    if (result.issues.length > 0) {
      hasErrors = true;
      for (const issue of result.issues) {
        console.log(`   ⚠️  ${issue}`);
      }
    }
  }

  console.log("\n=== SUMMARY ===");
  if (hasErrors) {
    console.log("❌ Issues found — see above for details");
    process.exit(1);
  } else {
    console.log("✅ All checks passed — site is indexable");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
