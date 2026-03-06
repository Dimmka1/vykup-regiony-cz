/**
 * SEO Monitor — checks sitemap pages for HTTP status and estimates indexing.
 */

export interface SeoReport {
  timestamp: string;
  sitemapUrl: string;
  totalUrls: number;
  checkedUrls: number;
  healthyUrls: number;
  nonOkUrls: { url: string; status: number }[];
  estimatedIndexed: number | null;
  issues: string[];
}

const SITEMAP_URL = "https://vykoupim-nemovitost.cz/sitemap.xml";
const SITE_DOMAIN = "vykoupim-nemovitost.cz";

/** Parse sitemap XML and extract <loc> URLs */
function extractUrlsFromSitemap(xml: string): string[] {
  const urls: string[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

/** Check HTTP status of a URL (HEAD request with timeout) */
async function checkUrlStatus(
  url: string,
): Promise<{ url: string; status: number }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return { url, status: res.status };
  } catch {
    return { url, status: 0 };
  }
}

/** Estimate indexed pages count via Google site: search (best-effort) */
async function estimateIndexedCount(): Promise<number | null> {
  try {
    const query = encodeURIComponent(`site:${SITE_DOMAIN}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(`https://www.google.com/search?q=${query}&num=1`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEOMonitor/1.0; +https://vykoupim-nemovitost.cz)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const html = await res.text();
    const match = html.match(
      /(?:About |Přibližně )?([0-9,.\s]+)\s+(?:results|výsledk)/i,
    );
    if (match) {
      return parseInt(match[1].replace(/[.,\s]/g, ""), 10);
    }
    return null;
  } catch {
    return null;
  }
}

/** Run the full SEO check and return a report */
export async function runSeoCheck(): Promise<SeoReport> {
  const issues: string[] = [];

  // 1. Fetch sitemap
  let sitemapXml: string;
  try {
    const res = await fetch(SITEMAP_URL);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    sitemapXml = await res.text();
  } catch (err) {
    return {
      timestamp: new Date().toISOString(),
      sitemapUrl: SITEMAP_URL,
      totalUrls: 0,
      checkedUrls: 0,
      healthyUrls: 0,
      nonOkUrls: [],
      estimatedIndexed: null,
      issues: [`Failed to fetch sitemap: ${err}`],
    };
  }

  const urls = extractUrlsFromSitemap(sitemapXml);

  // 2. Check each URL status (batches of 5)
  const results: { url: string; status: number }[] = [];
  for (let i = 0; i < urls.length; i += 5) {
    const batch = urls.slice(i, i + 5).map(checkUrlStatus);
    results.push(...(await Promise.all(batch)));
  }

  const nonOkUrls = results.filter((r) => r.status !== 200 && r.status !== 301);
  if (nonOkUrls.length > 0) {
    issues.push(`${nonOkUrls.length} URL(s) returned non-200/301 status`);
  }

  // 3. Estimate indexed count
  const estimatedIndexed = await estimateIndexedCount();
  if (estimatedIndexed !== null && estimatedIndexed < urls.length * 0.5) {
    issues.push(
      `Low indexing: ~${estimatedIndexed} indexed vs ${urls.length} in sitemap`,
    );
  }

  return {
    timestamp: new Date().toISOString(),
    sitemapUrl: SITEMAP_URL,
    totalUrls: urls.length,
    checkedUrls: results.length,
    healthyUrls: results.filter((r) => r.status === 200).length,
    nonOkUrls,
    estimatedIndexed,
    issues,
  };
}

/** Send Telegram alert with SEO report */
export async function sendTelegramAlert(report: SeoReport): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[seo-monitor] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set",
    );
    return;
  }

  const lines = [
    "⚠️ <b>SEO Monitor Alert</b> — vykoupim-nemovitost.cz",
    "",
    `📊 Sitemap: ${report.totalUrls} URLs`,
    `✅ Healthy: ${report.healthyUrls}`,
    `❌ Non-OK: ${report.nonOkUrls.length}`,
    report.estimatedIndexed !== null
      ? `🔍 Indexed (est.): ~${report.estimatedIndexed}`
      : "🔍 Indexed: unable to estimate",
    "",
    ...report.issues.map((i) => `• ${i}`),
  ];

  if (report.nonOkUrls.length > 0) {
    lines.push("", "<b>Non-OK URLs:</b>");
    for (const u of report.nonOkUrls.slice(0, 10)) {
      lines.push(`  ${u.status} — ${u.url}`);
    }
  }

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "HTML",
    }),
  });
}
