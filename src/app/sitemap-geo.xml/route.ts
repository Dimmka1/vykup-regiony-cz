import {
  ROOT_URL,
  PRICE_DATA_DATE,
  USE_CASE_PATHS,
  slugify,
  buildSitemapXml,
  XML_HEADERS,
} from "@/lib/sitemap-helpers";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

/**
 * GET /sitemap-geo.xml
 *
 * Programmatic geo-parameterized pages (priority 0.5):
 * - ?kraj= pages: 14 regions × 10 use-cases = 140 URLs
 * - ?mesto= pages on root: ~84 cities × 10 use-cases = ~840 URLs
 * - ?mesto= pages on subdomains: ~84 city pages
 * Total: ~1064 URLs
 */
export async function GET(): Promise<Response> {
  const regions = listRegions();

  const entries: Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }> = [];

  // 1. Geo-parameterized ?kraj= pages (14 regions × 10 use-case pages)
  for (const region of regions) {
    for (const useCasePath of USE_CASE_PATHS) {
      entries.push({
        url: `${ROOT_URL}${useCasePath}?kraj=${region.key}`,
        lastmod: PRICE_DATA_DATE,
        changefreq: "monthly",
        priority: 0.5,
      });
    }
  }

  // 2. Geo-parameterized ?mesto= pages on root domain (cities × use-cases)
  for (const region of regions) {
    for (const city of region.supportedCities) {
      const citySlug = slugify(city);
      for (const useCasePath of USE_CASE_PATHS) {
        entries.push({
          url: `${ROOT_URL}${useCasePath}?mesto=${citySlug}`,
          lastmod: PRICE_DATA_DATE,
          changefreq: "monthly",
          priority: 0.5,
        });
      }
    }
  }

  // 3. City-level ?mesto= pages on regional subdomains
  for (const region of regions) {
    const subdomainUrl = getRegionSubdomainUrl(region.key);
    for (const city of region.supportedCities) {
      entries.push({
        url: `${subdomainUrl}?mesto=${slugify(city)}`,
        lastmod: PRICE_DATA_DATE,
        changefreq: "monthly",
        priority: 0.5,
      });
    }
  }

  const xml = buildSitemapXml(entries);
  return new Response(xml, { status: 200, headers: XML_HEADERS });
}
