/**
 * VR-325: SSR Crawlability Audit Script
 *
 * Verifies that all key URLs return proper SSR-rendered HTML
 * for search engine bots (Googlebot, BingBot, SeznamBot).
 *
 * Checks:
 * - HTTP status code (expect 200)
 * - Canonical tag presence and correctness
 * - Robots meta tag (no noindex)
 * - X-Robots-Tag header (no noindex)
 * - Full SSR content (not empty JS shell)
 * - No redirect loops for bot User-Agents
 * - Cache-Control headers
 *
 * Usage: npx tsx scripts/audit-crawlability.ts
 */

import { execSync } from "child_process";

// ──────────────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────────────

const PROD_DOMAIN = "vykoupim-nemovitost.cz";
const PROTOCOL = "https";

/** 20 key URLs across all page types */
const AUDIT_URLS: { url: string; label: string; contentMarkers: string[] }[] = [
  // Homepage (root domain)
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/`,
    label: "Homepage (root)",
    contentMarkers: ["Vykoup", "nemovitost"],
  },
  // 3 subdomain homepages
  {
    url: `${PROTOCOL}://praha.${PROD_DOMAIN}/`,
    label: "Subdomain: Praha",
    contentMarkers: ["Praha", "nemovitost"],
  },
  {
    url: `${PROTOCOL}://jihomoravsky.${PROD_DOMAIN}/`,
    label: "Subdomain: Jihomoravský",
    contentMarkers: ["Jihomoravsk", "nemovitost"],
  },
  {
    url: `${PROTOCOL}://moravskoslezsky.${PROD_DOMAIN}/`,
    label: "Subdomain: Moravskoslezský",
    contentMarkers: ["Moravskoslezsk", "nemovitost"],
  },
  // 5 use case pages
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/vykup-pri-exekuci`,
    label: "Use case: Exekuce",
    contentMarkers: ["exekuc", "nemovitost"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/vykup-pri-dedictvi`,
    label: "Use case: Dědictví",
    contentMarkers: ["nemovitost"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/vykup-pri-rozvodu`,
    label: "Use case: Rozvod",
    contentMarkers: ["rozvo", "nemovitost"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/zpetny-najem`,
    label: "Use case: Zpětný nájem",
    contentMarkers: ["najem", "nemovitost"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/vykup-bytu`,
    label: "Use case: Byty",
    contentMarkers: ["byt"],
  },
  // 5 blog posts
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/blog`,
    label: "Blog index",
    contentMarkers: ["blog"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/blog/jak-rychle-prodat-nemovitost`,
    label: "Blog: Jak rychle prodat",
    contentMarkers: ["prodat", "nemovitost"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/blog/vykup-krok-za-krokem`,
    label: "Blog: Krok za krokem",
    contentMarkers: ["nemovitost"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/blog/kolik-stoji-vykup`,
    label: "Blog: Kolik stojí",
    contentMarkers: ["nemovitost"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/blog/vykup-vs-drazba`,
    label: "Blog: Vykup vs drazba",
    contentMarkers: ["nemovitost"],
  },
  // Programmatic pages (geo-parameterized)
  {
    url: `${PROTOCOL}://praha.${PROD_DOMAIN}/?kraj=praha&mesto=Praha+1`,
    label: "Programmatic: Praha 1",
    contentMarkers: ["Praha"],
  },
  {
    url: `${PROTOCOL}://jihomoravsky.${PROD_DOMAIN}/?kraj=jihomoravsky-kraj&mesto=Brno`,
    label: "Programmatic: Brno",
    contentMarkers: ["Brno"],
  },
  // Other content pages
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/reference`,
    label: "Reference (testimonials)",
    contentMarkers: ["reference"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/jak-to-funguje`,
    label: "Jak to funguje",
    contentMarkers: ["funguje"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/kraje`,
    label: "Kraje hub",
    contentMarkers: ["kraj"],
  },
  {
    url: `${PROTOCOL}://${PROD_DOMAIN}/garance-vykupu`,
    label: "Garance vykupu",
    contentMarkers: ["garanc"],
  },
];

/** User-Agent strings for different search engine bots */
const USER_AGENTS: { name: string; ua: string }[] = [
  {
    name: "Googlebot",
    ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
  {
    name: "BingBot",
    ua: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  },
  {
    name: "SeznamBot",
    ua: "Mozilla/5.0 (compatible; SeznamBot/4.0; +http://napoveda.seznam.cz/seznambot-intro/)",
  },
  {
    name: "curl",
    ua: "curl/8.0",
  },
];

// ──────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────

interface CurlResult {
  httpCode: number;
  headers: Record<string, string>;
  body: string;
  redirectChain: { status: number; location: string }[];
  finalUrl: string;
  error: string | null;
}

interface AuditResult {
  url: string;
  label: string;
  userAgent: string;
  httpCode: number;
  canonical: string | null;
  canonicalCorrect: boolean;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  hasNoindex: boolean;
  hasContent: boolean;
  missingMarkers: string[];
  redirectChain: { status: number; location: string }[];
  redirectLoop: boolean;
  cacheControl: string | null;
  contentLength: number;
  issues: string[];
}

// ──────────────────────────────────────────────────────
// Curl executor
// ──────────────────────────────────────────────────────

function curlFetch(url: string, userAgent: string): CurlResult {
  const redirectChain: { status: number; location: string }[] = [];
  let currentUrl = url;
  let httpCode = 0;
  let headers: Record<string, string> = {};
  let body = "";
  let error: string | null = null;
  const maxRedirects = 10;
  let redirectCount = 0;
  const visitedUrls = new Set<string>();

  while (redirectCount < maxRedirects) {
    if (visitedUrls.has(currentUrl)) {
      error = `Redirect loop detected at ${currentUrl}`;
      break;
    }
    visitedUrls.add(currentUrl);

    try {
      // Fetch headers + body in one call, follow no redirects manually
      const rawOutput = execSync(
        `curl -sS --max-time 30 --no-location ` +
          `-H "User-Agent: ${userAgent}" ` +
          `"${currentUrl}"` +
          ` -D /dev/stderr 2>&1 1>/tmp/curl_body_$$`,
        {
          encoding: "utf-8",
          maxBuffer: 10 * 1024 * 1024,
          timeout: 35000,
        },
      );

      // Better approach: use -w for status code and -D for headers
    } catch {
      // Fall through to simpler approach
    }

    // Simpler approach: two calls
    try {
      // Get HTTP code and headers
      const headerOutput = execSync(
        `curl -sS --max-time 30 --no-location -o /dev/null ` +
          `-w "HTTP_CODE:%{http_code}\\nREDIRECT_URL:%{redirect_url}" ` +
          `-D - ` +
          `-H "User-Agent: ${userAgent}" ` +
          `"${currentUrl}"`,
        {
          encoding: "utf-8",
          maxBuffer: 1024 * 1024,
          timeout: 35000,
        },
      );

      // Parse status code from -w output
      const codeMatch = headerOutput.match(/HTTP_CODE:(\d+)/);
      httpCode = codeMatch ? parseInt(codeMatch[1], 10) : 0;

      // Parse headers
      headers = {};
      for (const line of headerOutput.split(/\r?\n/)) {
        const colonIdx = line.indexOf(":");
        if (
          colonIdx > 0 &&
          !line.startsWith("HTTP_CODE") &&
          !line.startsWith("REDIRECT_URL")
        ) {
          const key = line.substring(0, colonIdx).trim().toLowerCase();
          const value = line.substring(colonIdx + 1).trim();
          headers[key] = value;
        }
      }

      // Handle redirects
      if ([301, 302, 307, 308].includes(httpCode) && headers["location"]) {
        const location = headers["location"];
        redirectChain.push({ status: httpCode, location });
        if (location.startsWith("/")) {
          const urlObj = new URL(currentUrl);
          currentUrl = `${urlObj.protocol}//${urlObj.host}${location}`;
        } else if (location.startsWith("http")) {
          currentUrl = location;
        } else {
          currentUrl = new URL(location, currentUrl).toString();
        }
        redirectCount++;
        continue;
      }

      // Get body (only for final non-redirect response)
      body = execSync(
        `curl -sS --max-time 30 --no-location ` +
          `-H "User-Agent: ${userAgent}" ` +
          `"${currentUrl}"`,
        {
          encoding: "utf-8",
          maxBuffer: 10 * 1024 * 1024,
          timeout: 35000,
        },
      );

      break;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      break;
    }
  }

  if (redirectCount >= maxRedirects) {
    error = `Exceeded max redirects (${maxRedirects})`;
  }

  return {
    httpCode,
    headers,
    body,
    redirectChain,
    finalUrl: currentUrl,
    error,
  };
}

// ──────────────────────────────────────────────────────
// HTML parsers
// ──────────────────────────────────────────────────────

function extractCanonical(html: string): string | null {
  const match = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
  );
  if (match) return match[1];
  const match2 = html.match(
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
  );
  return match2 ? match2[1] : null;
}

function extractRobotsMeta(html: string): string | null {
  const match = html.match(
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i,
  );
  if (match) return match[1];
  const match2 = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i,
  );
  return match2 ? match2[1] : null;
}

function hasSubstantialContent(html: string): boolean {
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return textContent.length > 500;
}

function checkContentMarkers(html: string, markers: string[]): string[] {
  const lowerHtml = html.toLowerCase();
  return markers.filter((m) => !lowerHtml.includes(m.toLowerCase()));
}

function isJsShellOnly(html: string): boolean {
  const hasNextData = html.includes("__NEXT_DATA__");
  if (hasNextData) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const bodyText = bodyMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return bodyText.length < 200;
    }
  }
  return false;
}

// ──────────────────────────────────────────────────────
// Audit logic
// ──────────────────────────────────────────────────────

function auditUrl(
  entry: (typeof AUDIT_URLS)[number],
  ua: (typeof USER_AGENTS)[number],
): AuditResult {
  const result = curlFetch(entry.url, ua.ua);
  const issues: string[] = [];

  if (result.error) {
    issues.push(`CURL ERROR: ${result.error}`);
  }
  if (result.httpCode !== 200) {
    issues.push(`HTTP ${result.httpCode} (expected 200)`);
  }

  const canonical = extractCanonical(result.body);
  let canonicalCorrect = false;
  if (!canonical) {
    issues.push("Missing canonical tag");
  } else {
    const canonicalLower = canonical.toLowerCase();
    if (
      canonicalLower.includes(PROD_DOMAIN) &&
      !canonicalLower.includes("undefined")
    ) {
      canonicalCorrect = true;
    } else {
      issues.push(`Suspicious canonical: ${canonical}`);
    }
  }

  const robotsMeta = extractRobotsMeta(result.body);
  const xRobotsTag = result.headers["x-robots-tag"] ?? null;
  const hasNoindex =
    (robotsMeta?.toLowerCase().includes("noindex") ?? false) ||
    (xRobotsTag?.toLowerCase().includes("noindex") ?? false);

  if (hasNoindex) {
    issues.push("CRITICAL: noindex detected!");
  }

  const hasContent = hasSubstantialContent(result.body);
  if (!hasContent) {
    issues.push("WARNING: Insufficient text content (possible JS shell)");
  }

  if (isJsShellOnly(result.body)) {
    issues.push("CRITICAL: Page appears to be an empty JS shell (no SSR)");
  }

  const missingMarkers = checkContentMarkers(result.body, entry.contentMarkers);
  if (missingMarkers.length > 0) {
    issues.push(`Missing content markers: ${missingMarkers.join(", ")}`);
  }

  const redirectLoop =
    result.error?.includes("loop") ?? result.redirectChain.length >= 10;
  if (redirectLoop) {
    issues.push("CRITICAL: Redirect loop detected!");
  }

  const cacheControl = result.headers["cache-control"] ?? null;

  return {
    url: entry.url,
    label: entry.label,
    userAgent: ua.name,
    httpCode: result.httpCode,
    canonical,
    canonicalCorrect,
    robotsMeta,
    xRobotsTag,
    hasNoindex,
    hasContent,
    missingMarkers,
    redirectChain: result.redirectChain,
    redirectLoop,
    cacheControl,
    contentLength: result.body.length,
    issues,
  };
}

// ──────────────────────────────────────────────────────
// Report
// ──────────────────────────────────────────────────────

function printReport(results: AuditResult[]): void {
  const totalChecks = results.length;
  const passed = results.filter((r) => r.issues.length === 0).length;
  const failed = totalChecks - passed;
  const critical = results.filter((r) =>
    r.issues.some((i) => i.includes("CRITICAL")),
  ).length;

  console.log("\n" + "=".repeat(80));
  console.log("  SSR CRAWLABILITY AUDIT REPORT");
  console.log("=".repeat(80));
  console.log(`  Date: ${new Date().toISOString()}`);
  console.log(`  Domain: ${PROD_DOMAIN}`);
  console.log(`  URLs tested: ${AUDIT_URLS.length}`);
  console.log(`  User-Agents: ${USER_AGENTS.map((u) => u.name).join(", ")}`);
  console.log(`  Total checks: ${totalChecks}`);
  console.log(`  Passed: ${passed}  Failed: ${failed}  Critical: ${critical}`);
  console.log("=".repeat(80));

  // Group by URL
  const byUrl = new Map<string, AuditResult[]>();
  for (const r of results) {
    const key = r.url;
    if (!byUrl.has(key)) byUrl.set(key, []);
    byUrl.get(key)!.push(r);
  }

  for (const [url, urlResults] of byUrl) {
    const firstResult = urlResults[0];
    const allPassed = urlResults.every((r) => r.issues.length === 0);
    const icon = allPassed ? "PASS" : "FAIL";

    console.log(`\n[${icon}] ${firstResult.label}`);
    console.log(`   URL: ${url}`);

    for (const r of urlResults) {
      const status = r.issues.length === 0 ? "OK" : "ISSUE";
      console.log(`   [${status}] [${r.userAgent}] HTTP ${r.httpCode}`);

      if (r.redirectChain.length > 0) {
        console.log(
          `      Redirects: ${r.redirectChain.map((rc) => `${rc.status} -> ${rc.location}`).join(" -> ")}`,
        );
      }

      console.log(
        `      Canonical: ${r.canonical ?? "MISSING"} ${r.canonicalCorrect ? "(correct)" : "(incorrect)"}`,
      );
      console.log(`      Robots meta: ${r.robotsMeta ?? "none"}`);
      if (r.xRobotsTag) console.log(`      X-Robots-Tag: ${r.xRobotsTag}`);
      console.log(`      Cache-Control: ${r.cacheControl ?? "none"}`);
      console.log(
        `      Content: ${r.contentLength} bytes, SSR: ${r.hasContent ? "YES" : "NO"}`,
      );

      if (r.missingMarkers.length > 0) {
        console.log(`      Missing markers: ${r.missingMarkers.join(", ")}`);
      }

      for (const issue of r.issues) {
        console.log(`      >> ${issue}`);
      }
    }
  }

  // Summary of all issues
  const allIssues = results.filter((r) => r.issues.length > 0);
  if (allIssues.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("  ALL ISSUES SUMMARY");
    console.log("-".repeat(80));

    const issueMap = new Map<string, string[]>();
    for (const r of allIssues) {
      for (const issue of r.issues) {
        if (!issueMap.has(issue)) issueMap.set(issue, []);
        issueMap.get(issue)!.push(`${r.label} [${r.userAgent}]`);
      }
    }

    for (const [issue, affected] of issueMap) {
      console.log(`\n  ${issue}`);
      for (const a of affected) {
        console.log(`    -> ${a}`);
      }
    }
  }

  // Redirect chain analysis
  const withRedirects = results.filter((r) => r.redirectChain.length > 0);
  if (withRedirects.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("  REDIRECT CHAINS");
    console.log("-".repeat(80));
    for (const r of withRedirects) {
      console.log(`\n  [${r.userAgent}] ${r.url}`);
      for (const rc of r.redirectChain) {
        console.log(`    ${rc.status} -> ${rc.location}`);
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  if (critical > 0) {
    console.log("  CRITICAL ISSUES FOUND - INDEXING MAY BE BLOCKED");
  } else if (failed > 0) {
    console.log("  SOME ISSUES FOUND - REVIEW RECOMMENDED");
  } else {
    console.log("  ALL CHECKS PASSED - SSR RENDERING OK FOR CRAWLERS");
  }
  console.log("=".repeat(80) + "\n");

  if (critical > 0) {
    process.exit(2);
  } else if (failed > 0) {
    process.exit(1);
  }
}

// ──────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────

function main(): void {
  console.log("Starting SSR Crawlability Audit...");
  console.log(
    `   Testing ${AUDIT_URLS.length} URLs x ${USER_AGENTS.length} User-Agents = ${AUDIT_URLS.length * USER_AGENTS.length} checks\n`,
  );

  const results: AuditResult[] = [];

  for (const entry of AUDIT_URLS) {
    for (const ua of USER_AGENTS) {
      process.stdout.write(`  Testing ${entry.label} [${ua.name}]... `);
      try {
        const result = auditUrl(entry, ua);
        results.push(result);
        const status = result.issues.length === 0 ? "OK" : "FAIL";
        console.log(
          `${status} HTTP ${result.httpCode} (${result.contentLength} bytes)`,
        );
      } catch (e) {
        console.log(`ERROR: ${e instanceof Error ? e.message : e}`);
        results.push({
          url: entry.url,
          label: entry.label,
          userAgent: ua.name,
          httpCode: 0,
          canonical: null,
          canonicalCorrect: false,
          robotsMeta: null,
          xRobotsTag: null,
          hasNoindex: false,
          hasContent: false,
          missingMarkers: entry.contentMarkers,
          redirectChain: [],
          redirectLoop: false,
          cacheControl: null,
          contentLength: 0,
          issues: [`Fatal error: ${e instanceof Error ? e.message : e}`],
        });
      }
    }
  }

  printReport(results);
}

main();
