import { headers } from "next/headers";
import {
  ROOT_DOMAIN,
  BUILD_DATE,
  PRICE_DATA_DATE,
  buildSitemapIndexXml,
  buildSitemapXml,
  slugify,
  XML_HEADERS,
  USE_CASE_PATHS,
} from "@/lib/sitemap-helpers";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

/**
 * GET /sitemap.xml
 *
 * Root domain → sitemap index pointing to 3 sub-sitemaps.
 * Regional subdomain → full sitemap for that subdomain (homepage + city pages).
 */
export async function GET(): Promise<Response> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ROOT_DOMAIN
  )
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  const isRootOrDev = host === ROOT_DOMAIN || !host.endsWith(`.${ROOT_DOMAIN}`);

  // ─── Subdomain sitemap: homepage + ?mesto= city pages ───
  if (!isRootOrDev) {
    const baseUrl = `https://${host}`;
    const regions = listRegions();
    const region = regions.find((r) =>
      r.hosts.some((h) => h.toLowerCase() === host),
    );

    const entries = [
      {
        url: baseUrl,
        lastmod: BUILD_DATE,
        changefreq: "monthly",
        priority: 1.0,
      },
    ];

    if (region) {
      for (const city of region.supportedCities) {
        entries.push({
          url: `${baseUrl}?mesto=${slugify(city)}`,
          lastmod: PRICE_DATA_DATE,
          changefreq: "monthly",
          priority: 0.7,
        });
      }
    }

    const xml = buildSitemapXml(entries);
    return new Response(xml, { status: 200, headers: XML_HEADERS });
  }

  // ─── Root domain: sitemap index ───
  const rootUrl = `https://${ROOT_DOMAIN}`;
  const latestDate =
    BUILD_DATE > PRICE_DATA_DATE ? BUILD_DATE : PRICE_DATA_DATE;

  const xml = buildSitemapIndexXml([
    { loc: `${rootUrl}/sitemap-core.xml`, lastmod: latestDate },
    { loc: `${rootUrl}/sitemap-geo.xml`, lastmod: PRICE_DATA_DATE },
    { loc: `${rootUrl}/sitemap-blog.xml`, lastmod: latestDate },
  ]);

  return new Response(xml, { status: 200, headers: XML_HEADERS });
}
