import {
  ROOT_URL,
  BUILD_DATE,
  USE_CASE_PATHS,
  buildSitemapXml,
  XML_HEADERS,
} from "@/lib/sitemap-helpers";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

/**
 * GET /sitemap-core.xml
 *
 * High-priority pages (≤50 URLs, priority ≥0.8):
 * - Homepage (1)
 * - /kraje (1)
 * - 14 regional subdomain homepages
 * - 10 use-case pages
 * - Static content pages: jak-to-funguje, garance-vykupu, proc-my, etc.
 * Total: ~40 URLs
 */
export async function GET(): Promise<Response> {
  const regions = listRegions();

  const entries: Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }> = [];

  // 1. Homepage — priority 1.0
  entries.push({
    url: ROOT_URL,
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: 1.0,
  });

  // 2. /kraje — priority 0.9
  entries.push({
    url: `${ROOT_URL}/kraje`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: 0.9,
  });

  // 3. 14 regional subdomain homepages — priority 0.9
  for (const region of regions) {
    entries.push({
      url: getRegionSubdomainUrl(region.key),
      lastmod: BUILD_DATE,
      changefreq: "monthly",
      priority: 0.9,
    });
  }

  // 4. 10 use-case pages — priority 0.8
  for (const path of USE_CASE_PATHS) {
    entries.push({
      url: `${ROOT_URL}${path}`,
      lastmod: BUILD_DATE,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  // 5. Key static pages — priority 0.8
  const staticPages = [
    { path: "/jak-to-funguje", priority: 0.8 },
    { path: "/garance-vykupu", priority: 0.8 },
    { path: "/proc-my", priority: 0.8 },
    { path: "/pruvodce-vykupem", priority: 0.8 },
    { path: "/caste-dotazy", priority: 0.8 },
    { path: "/o-nas", priority: 0.8 },
    { path: "/vykup-cinzovnich-domu", priority: 0.8 },
    { path: "/vykup-pri-privatizaci", priority: 0.8 },
    { path: "/odhad-ceny-nemovitosti", priority: 0.8 },
  ] as const;

  for (const page of staticPages) {
    entries.push({
      url: `${ROOT_URL}${page.path}`,
      lastmod: BUILD_DATE,
      changefreq: "monthly",
      priority: page.priority,
    });
  }

  const xml = buildSitemapXml(entries);
  return new Response(xml, { status: 200, headers: XML_HEADERS });
}
