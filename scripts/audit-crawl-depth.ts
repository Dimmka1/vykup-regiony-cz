/**
 * Crawl depth audit script.
 * Recursively crawls from localhost:3000 and reports the click-depth of each page.
 * Alerts if any page has depth > 3.
 *
 * Usage: npx tsx scripts/audit-crawl-depth.ts [baseUrl]
 */

const BASE_URL = process.argv[2] || "http://localhost:3000";
const MAX_DEPTH = 50;
const ALERT_THRESHOLD = 3;

interface PageInfo {
  url: string;
  depth: number;
  parent: string | null;
}

async function crawl() {
  const visited = new Map<string, PageInfo>();
  const queue: { url: string; depth: number; parent: string | null }[] = [
    { url: BASE_URL, depth: 0, parent: null },
  ];

  console.log(`\n🕷️  Crawling from ${BASE_URL}...\n`);

  while (queue.length > 0) {
    const item = queue.shift()!;
    const normalizedUrl = normalizeUrl(item.url);

    if (visited.has(normalizedUrl)) continue;
    if (item.depth > MAX_DEPTH) continue;

    visited.set(normalizedUrl, {
      url: normalizedUrl,
      depth: item.depth,
      parent: item.parent,
    });

    try {
      const response = await fetch(item.url, {
        redirect: "follow",
        headers: { "User-Agent": "CrawlDepthAudit/1.0" },
      });

      if (!response.ok) {
        console.log(`  ⚠️  ${response.status} ${normalizedUrl}`);
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) continue;

      const html = await response.text();
      const links = extractLinks(html, item.url);

      for (const link of links) {
        const normalized = normalizeUrl(link);
        if (!visited.has(normalized)) {
          queue.push({
            url: link,
            depth: item.depth + 1,
            parent: normalizedUrl,
          });
        }
      }
    } catch (err) {
      console.log(
        `  ❌ Error fetching ${normalizedUrl}: ${(err as Error).message}`,
      );
    }
  }

  return visited;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    const pathname = u.pathname.replace(/\/$/, "") || "/";
    return `${u.origin}${pathname}`;
  } catch {
    return url;
  }
}

function extractLinks(html: string, pageUrl: string): string[] {
  const links: string[] = [];
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match: RegExpExecArray | null;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href) continue;

    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    )
      continue;

    try {
      const resolved = new URL(href, pageUrl);
      const baseOrigin = new URL(BASE_URL).origin;

      if (resolved.origin !== baseOrigin) continue;

      if (
        /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|xml|json|txt|webp|avif)$/i.test(
          resolved.pathname,
        )
      )
        continue;

      links.push(resolved.href);
    } catch {
      // Invalid URL, skip
    }
  }

  return links;
}

function printReport(pages: Map<string, PageInfo>) {
  const sorted = [...pages.values()].sort((a, b) => a.depth - b.depth);

  console.log("\n📊 Crawl Depth Report");
  console.log("=".repeat(80));
  console.log(`${"Depth".padStart(5)}  ${"URL".padEnd(60)}`);
  console.log("-".repeat(80));

  let alertCount = 0;

  for (const page of sorted) {
    const depthStr = String(page.depth).padStart(5);
    const alert = page.depth > ALERT_THRESHOLD ? " ⚠️" : "";
    if (page.depth > ALERT_THRESHOLD) alertCount++;

    const urlDisplay =
      page.url.length > 58 ? page.url.slice(0, 55) + "..." : page.url;
    console.log(`${depthStr}  ${urlDisplay.padEnd(60)}${alert}`);
  }

  console.log("-".repeat(80));
  console.log(`Total pages: ${pages.size}`);
  console.log(`Max depth: ${Math.max(...sorted.map((p) => p.depth))}`);

  const byDepth = new Map<number, number>();
  for (const page of sorted) {
    byDepth.set(page.depth, (byDepth.get(page.depth) || 0) + 1);
  }
  console.log("\nPages by depth:");
  for (const [depth, count] of [...byDepth.entries()].sort(
    (a, b) => a[0] - b[0],
  )) {
    const bar = "█".repeat(Math.min(count, 50));
    console.log(`  ${String(depth).padStart(3)}: ${bar} (${count})`);
  }

  if (alertCount > 0) {
    console.log(
      `\n🚨 WARNING: ${alertCount} pages have depth > ${ALERT_THRESHOLD}!`,
    );
    console.log("Pages with depth > 3:");
    for (const page of sorted.filter((p) => p.depth > ALERT_THRESHOLD)) {
      console.log(`  depth=${page.depth} ${page.url}`);
      if (page.parent) {
        console.log(`    ← found via: ${page.parent}`);
      }
    }
    process.exit(1);
  } else {
    console.log(
      `\n✅ All pages are within ${ALERT_THRESHOLD} clicks from homepage.`,
    );
  }
}

crawl()
  .then(printReport)
  .catch((err) => {
    console.error("Crawl failed:", err);
    process.exit(1);
  });
