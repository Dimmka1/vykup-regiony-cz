import { headers } from "next/headers";
import {
  ROOT_DOMAIN,
  BUILD_DATE,
  PRICE_DATA_DATE,
  buildSitemapIndexXml,
  buildSitemapXml,
  XML_HEADERS,
} from "@/lib/sitemap-helpers";

/**
 * GET /sitemap.xml
 *
 * Root domain → sitemap index pointing to 4 sub-sitemaps
 *               (core, geo, blog, image).
 * Regional subdomain → minimal sitemap with the subdomain homepage only.
 *
 * Subdomain ?mesto= URLs were removed because the subdomain homepage
 * does not differentiate content by `mesto` — only by host (region).
 * Listing them caused them to be canonicalized to the bare subdomain URL,
 * resulting in "Alternate page with proper canonical tag" reports in GSC.
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

  // ─── Subdomain sitemap: homepage only ───
  if (!isRootOrDev) {
    const baseUrl = `https://${host}`;

    const entries = [
      {
        url: baseUrl,
        lastmod: BUILD_DATE,
        changefreq: "monthly",
        priority: 1.0,
      },
    ];

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
    { loc: `${rootUrl}/image-sitemap.xml`, lastmod: latestDate },
  ]);

  return new Response(xml, { status: 200, headers: XML_HEADERS });
}
