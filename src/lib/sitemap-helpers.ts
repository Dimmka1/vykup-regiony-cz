/**
 * Shared helpers for sitemap generation.
 * Used by sitemap index + sub-sitemap route handlers.
 */

export const ROOT_DOMAIN = "vykoupim-nemovitost.cz";
export const ROOT_URL = `https://${ROOT_DOMAIN}`;

/**
 * Build-time constant for lastmod of static/deploy-dependent pages.
 * Set BUILD_DATE env var in CI/CD (e.g. Vercel) for accurate deploy dates.
 */
export const BUILD_DATE = process.env.BUILD_DATE || "2026-03-14";

/**
 * Date of the last price data update (from PRICE_RESEARCH.json).
 * Used for geo-parameterized pages (?kraj=, ?mesto=) whose content
 * depends on regional pricing data.
 */
export const PRICE_DATA_DATE = "2026-03-01";

/** Use-case pages that support ?kraj= and ?mesto= geo parameterization */
export const USE_CASE_PATHS = [
  "/vykup-pri-exekuci",
  "/vykup-pri-dedictvi",
  "/vykup-pri-rozvodu",
  "/vykup-spoluvlastnickeho-podilu",
  "/vykup-nemovitosti-s-hypotekou",
  "/vykup-nemovitosti-s-vecnym-bremenem",
  "/zpetny-najem",
  "/vykup-bytu",
  "/vykup-domu",
  "/vykup-pozemku",
] as const;

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

/** Build a standard sitemap XML from entries */
export function buildSitemapXml(entries: SitemapEntry[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const entry of entries) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

interface SitemapIndexEntry {
  loc: string;
  lastmod: string;
}

/** Build a sitemap index XML */
export function buildSitemapIndexXml(sitemaps: SitemapIndexEntry[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const s of sitemaps) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${escapeXml(s.loc)}</loc>\n`;
    xml += `    <lastmod>${s.lastmod}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;
  return xml;
}

/** Standard XML response headers */
export const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=86400, s-maxage=86400",
} as const;
