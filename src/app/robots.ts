import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "vykoupim-nemovitost.cz";

  const normalizedHost = host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `https://${normalizedHost}/sitemap.xml`,
  };
}
