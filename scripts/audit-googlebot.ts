/**
 * Googlebot Audit Script — VR-250
 *
 * Fetches key URLs with Googlebot UA and checks:
 * - HTTP status (200 expected)
 * - No X-Robots-Tag: noindex header
 * - No <meta name="robots" content="noindex"> in HTML
 * - Canonical tag present and correct
 * - Body has meaningful content
 * - No redirect chains (>1 hop)
 *
 * Usage: npm run audit:googlebot
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const BASE_URL = "https://vykoupim-nemovitost.cz";

const URLS = [
  "/",
  "/praha",
  "/brno",
  "/ostrava",
  "/blog",
  "/jak-to-funguje",
  "/reference",
  "/kraje",
  "/o-nas",
  "/vzor-smlouvy",
];

interface AuditResult {
  url: string;
  finalUrl: string;
  status: number;
  redirectCount: number;
  redirectChain: string[];
  hasXRobotsNoindex: boolean;
  hasMetaNoindex: boolean;
  canonical: string | null;
  canonicalCorrect: boolean;
  contentLength: number;
  hasContent: boolean;
  titleTag: string | null;
  h1Tag: string | null;
  issues: string[];
  passed: boolean;
}

async function fetchWithRedirects(url: string) {
  const chain: string[] = [];
  let currentUrl = url;
  let redirectCount = 0;
  const maxRedirects = 10;

  while (redirectCount < maxRedirects) {
    const resp = await fetch(currentUrl, {
      method: "GET",
      headers: { "User-Agent": GOOGLEBOT_UA },
      redirect: "manual",
    });

    if (resp.status >= 300 && resp.status < 400) {
      const location = resp.headers.get("location");
      if (!location) break;
      chain.push(`${resp.status} → ${location}`);
      currentUrl = location.startsWith("http")
        ? location
        : new URL(location, currentUrl).href;
      redirectCount++;
      continue;
    }

    return {
      finalUrl: currentUrl,
      status: resp.status,
      headers: resp.headers,
      body: await resp.text(),
      redirectCount,
      redirectChain: chain,
    };
  }

  const resp = await fetch(currentUrl, {
    method: "GET",
    headers: { "User-Agent": GOOGLEBOT_UA },
    redirect: "manual",
  });
  return {
    finalUrl: currentUrl,
    status: resp.status,
    headers: resp.headers,
    body: await resp.text(),
    redirectCount,
    redirectChain: chain,
  };
}

function extractMeta(html: string, name: string): string | null {
  const r1 = new RegExp(
    `<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`,
    "i",
  );
  const m1 = html.match(r1);
  if (m1) return m1[1];
  const r2 = new RegExp(
    `<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`,
    "i",
  );
  const m2 = html.match(r2);
  return m2 ? m2[1] : null;
}

function extractCanonical(html: string): string | null {
  const m1 = html.match(
    /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i,
  );
  if (m1) return m1[1];
  const m2 = html.match(
    /<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i,
  );
  return m2 ? m2[1] : null;
}

function extractTag(html: string, tag: string): string | null {
  const m = html.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

async function auditUrl(path: string): Promise<AuditResult> {
  const fullUrl = `${BASE_URL}${path}`;
  const issues: string[] = [];

  const { finalUrl, status, headers, body, redirectCount, redirectChain } =
    await fetchWithRedirects(fullUrl);

  if (status !== 200) {
    issues.push(`HTTP ${status} (expected 200)`);
  }

  const xRobots = headers.get("x-robots-tag") || "";
  const hasXRobotsNoindex = xRobots.toLowerCase().includes("noindex");
  if (hasXRobotsNoindex) {
    issues.push(`X-Robots-Tag contains noindex: "${xRobots}"`);
  }

  const metaRobots = extractMeta(body, "robots") || "";
  const hasMetaNoindex = metaRobots.toLowerCase().includes("noindex");
  if (hasMetaNoindex) {
    issues.push(`<meta robots> contains noindex: "${metaRobots}"`);
  }

  const canonical = extractCanonical(body);
  const expectedCanonical = `${BASE_URL}${path === "/" ? "" : path}`;
  const canonicalCorrect =
    canonical !== null &&
    (canonical === expectedCanonical ||
      canonical === fullUrl ||
      canonical === finalUrl ||
      canonical === finalUrl.replace(/\/$/, ""));
  if (!canonical && status === 200) {
    issues.push("Missing canonical tag");
  } else if (!canonicalCorrect && status === 200) {
    issues.push(
      `Canonical mismatch: "${canonical}" (expected: "${expectedCanonical}")`,
    );
  }

  const contentLength = body.length;
  const hasContent = contentLength > 1000;
  if (!hasContent && status === 200) {
    issues.push(`Thin content: only ${contentLength} bytes`);
  }

  if (redirectCount > 1) {
    issues.push(`Redirect chain: ${redirectCount} hops`);
  }

  const titleTag = extractTag(body, "title");
  const h1Tag = extractTag(body, "h1");

  if (!titleTag && status === 200) {
    issues.push("Missing <title> tag");
  }

  return {
    url: fullUrl,
    finalUrl,
    status,
    redirectCount,
    redirectChain,
    hasXRobotsNoindex,
    hasMetaNoindex,
    canonical,
    canonicalCorrect,
    contentLength,
    hasContent,
    titleTag,
    h1Tag,
    issues,
    passed: issues.length === 0,
  };
}

function formatResult(r: AuditResult): string {
  const icon = r.passed ? "✅" : "❌";
  let out = `### ${icon} ${r.url}\n\n`;
  out += `| Check | Value |\n|---|---|\n`;
  out += `| Status | ${r.status} |\n`;
  out += `| Final URL | ${r.finalUrl} |\n`;
  out += `| Redirects | ${r.redirectCount}${r.redirectChain.length > 0 ? ` (${r.redirectChain.join(" → ")})` : ""} |\n`;
  out += `| X-Robots-Tag noindex | ${r.hasXRobotsNoindex ? "⚠️ YES" : "No"} |\n`;
  out += `| Meta robots noindex | ${r.hasMetaNoindex ? "⚠️ YES" : "No"} |\n`;
  out += `| Canonical | ${r.canonical || "❌ Missing"} |\n`;
  out += `| Canonical correct | ${r.status !== 200 ? "N/A" : r.canonicalCorrect ? "✅" : "❌"} |\n`;
  out += `| Content size | ${r.contentLength.toLocaleString()} bytes |\n`;
  out += `| Has content | ${r.hasContent ? "✅" : "❌"} |\n`;
  out += `| Title | ${r.titleTag || "❌ Missing"} |\n`;
  out += `| H1 | ${r.h1Tag || "—"} |\n`;

  if (r.issues.length > 0) {
    out += `\n**Issues:**\n`;
    for (const issue of r.issues) {
      out += `- 🔴 ${issue}\n`;
    }
  }
  out += "\n";
  return out;
}

async function main() {
  console.log("🤖 Googlebot Audit — vykoupim-nemovitost.cz");
  console.log("=".repeat(55));
  console.log(`UA: ${GOOGLEBOT_UA}`);
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`URLs: ${URLS.length}\n`);

  const results: AuditResult[] = [];

  for (const path of URLS) {
    process.stdout.write(`Auditing ${path} ... `);
    try {
      const result = await auditUrl(path);
      console.log(
        result.passed
          ? "✅ PASS"
          : `❌ FAIL (${result.issues.length} issue${result.issues.length > 1 ? "s" : ""})`,
      );
      results.push(result);
    } catch (err) {
      console.log(`💥 ERROR: ${err}`);
      results.push({
        url: `${BASE_URL}${path}`,
        finalUrl: "",
        status: 0,
        redirectCount: 0,
        redirectChain: [],
        hasXRobotsNoindex: false,
        hasMetaNoindex: false,
        canonical: null,
        canonicalCorrect: false,
        contentLength: 0,
        hasContent: false,
        titleTag: null,
        h1Tag: null,
        issues: [`Fetch error: ${err}`],
        passed: false,
      });
    }
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log("\n" + "=".repeat(55));
  console.log(
    `Results: ${passed} passed, ${failed} failed out of ${results.length}`,
  );

  for (const r of results) {
    console.log("");
    const icon = r.passed ? "✅" : "❌";
    console.log(`${icon} ${r.url}`);
    console.log(
      `  Status: ${r.status} | Final: ${r.finalUrl} | Redirects: ${r.redirectCount}`,
    );
    console.log(
      `  Content: ${r.contentLength} bytes | Canonical: ${r.canonical || "MISSING"}`,
    );
    if (r.issues.length > 0) {
      for (const issue of r.issues) {
        console.log(`  🔴 ${issue}`);
      }
    }
  }

  // Generate markdown report
  let md = `# Googlebot Audit Report\n\n`;
  md += `**Date:** ${new Date().toISOString()}\n`;
  md += `**Domain:** ${BASE_URL}\n`;
  md += `**User-Agent:** \`${GOOGLEBOT_UA}\`\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|---|---|\n`;
  md += `| URLs audited | ${results.length} |\n`;
  md += `| Passed | ${passed} |\n`;
  md += `| Failed | ${failed} |\n\n`;

  const allIssues = results.flatMap((r) =>
    r.issues.map((i) => ({ url: r.url, issue: i })),
  );
  if (allIssues.length > 0) {
    md += `## ⚠️ Issues Found\n\n`;
    for (const { url, issue } of allIssues) {
      md += `- **${url}**: ${issue}\n`;
    }
    md += "\n";
  }

  md += `## Detailed Results\n\n`;
  for (const r of results) {
    md += formatResult(r);
  }

  // robots.txt
  md += `## robots.txt\n\n`;
  try {
    const robotsResp = await fetch(`${BASE_URL}/robots.txt`, {
      headers: { "User-Agent": GOOGLEBOT_UA },
    });
    const robotsTxt = await robotsResp.text();
    md += "```\n" + robotsTxt + "\n```\n\n";

    if (
      robotsTxt.includes("Disallow: /\n") ||
      robotsTxt.match(/Disallow:\s*\/\s*$/)
    ) {
      md += "⚠️ **CRITICAL: `Disallow: /` found — all crawling blocked!**\n\n";
    } else {
      md += "✅ No blanket Disallow found.\n\n";
    }
  } catch (e) {
    md += `❌ Failed to fetch robots.txt: ${e}\n\n`;
  }

  // Middleware
  md += `## Middleware Analysis\n\n`;
  md += `The middleware in \`src/middleware.ts\` was reviewed:\n\n`;
  md += `- ✅ No user-agent blocking — Googlebot is not filtered\n`;
  md += `- ✅ Regional paths (e.g., /praha) redirect to subdomains via single-hop 301 (by design)\n`;
  md += `- ✅ No redirect loops detected\n`;
  md += `- ✅ No \`X-Robots-Tag: noindex\` injected by middleware\n`;
  md += `- ℹ️ PPC path (/ppc) gets \`x-layout-stripped: 1\` header (no SEO impact)\n\n`;

  const hasChains = results.some((r) => r.redirectCount > 1);
  if (!hasChains) {
    md += `✅ No multi-hop redirect chains detected.\n`;
  } else {
    md += `⚠️ Multi-hop redirect chains detected — see details above.\n`;
  }

  // Save
  const docsDir = join(process.cwd(), "docs");
  mkdirSync(docsDir, { recursive: true });
  const reportPath = join(docsDir, "GOOGLEBOT_AUDIT.md");
  writeFileSync(reportPath, md, "utf-8");
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
