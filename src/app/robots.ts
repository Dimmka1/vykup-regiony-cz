import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { PRODUCTION_DOMAIN } from "@/lib/config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    PRODUCTION_DOMAIN;

  const normalizedHost = host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  // Only `sitemap.xml` is advertised. On the root domain it serves a
  // sitemap index that references sitemap-core / sitemap-geo / sitemap-blog
  // / image-sitemap. On regional subdomains it serves a minimal subdomain
  // sitemap (homepage only).
  //
  // We deliberately do NOT advertise the sub-sitemap paths directly here:
  // on subdomains the middleware 301-redirects them to the root domain,
  // and Google flags those sub-sitemap URLs as "redirect" errors when
  // discovered via robots.txt.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: [`https://${normalizedHost}/sitemap.xml`],
  };
}
