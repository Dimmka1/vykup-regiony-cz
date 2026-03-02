import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import {
  getRegionByHost,
  listRegions,
  getRegionSubdomainUrl,
} from "@/lib/config";

const STATIC_PATHS = [
  { path: "/caste-dotazy", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/blog/jak-probiha-rychly-vykup", priority: 0.7 },
  { path: "/blog/5-duvodu-proc-prodat", priority: 0.7 },
  { path: "/blog/vykup-v-exekuci", priority: 0.7 },
  { path: "/vykup-pri-exekuci", priority: 0.8 },
  { path: "/vykup-pri-dedictvi", priority: 0.8 },
  { path: "/vykup-pri-rozvodu", priority: 0.8 },
  { path: "/vykup-spoluvlastnickeho-podilu", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-hypotekou", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-vecnym-bremenem", priority: 0.8 },
  { path: "/vykup-bytu", priority: 0.8 },
  { path: "/vykup-domu", priority: 0.8 },
  { path: "/vykup-pozemku", priority: 0.8 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "vykoupim-nemovitost.cz"
  )
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  const baseUrl = `https://${host}`;
  const now = new Date();

  // Home page for current subdomain
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  // Static content pages (same on every subdomain)
  for (const entry of STATIC_PATHS) {
    entries.push({
      url: `${baseUrl}${entry.path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: entry.priority,
    });
  }

  // On root domain, also include cross-links to all regional subdomains
  const isRootDomain =
    host === "vykoupim-nemovitost.cz" ||
    !host.endsWith(".vykoupim-nemovitost.cz");

  if (isRootDomain) {
    for (const region of listRegions()) {
      const subdomainUrl = getRegionSubdomainUrl(region.key);
      entries.push({
        url: subdomainUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
  }

  return entries;
}
