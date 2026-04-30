import {
  ROOT_URL,
  PRICE_DATA_DATE,
  USE_CASE_PATHS,
  buildSitemapXml,
  XML_HEADERS,
} from "@/lib/sitemap-helpers";
import { listRegions } from "@/lib/config";

/**
 * GET /sitemap-geo.xml
 *
 * Programmatic geo-parameterized pages (priority 0.5):
 * - ?kraj= pages: 14 regions × 10 use-cases = 140 URLs
 *
 * Note: ?mesto= URLs were removed because the use-case pages do not
 * differentiate content by `mesto` (only by `kraj` via resolveGeoRegion).
 * Including them caused Google Search Console to report ~840 URLs as
 * "Duplicate, Google chose different canonical than user."
 * Pages with ?mesto= without ?kraj= now return `<meta robots="noindex,follow">`
 * (see buildGeoMetadataRobots in lib/geo-canonical.ts).
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

  const xml = buildSitemapXml(entries);
  return new Response(xml, { status: 200, headers: XML_HEADERS });
}
