import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const PRODUCTION_DOMAIN = "vykoupim-nemovitost.cz";

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
  { path: "/jak-to-funguje", priority: 0.8 },
  { path: "/reference", priority: 0.8 },
  { path: "/ochrana-osobnich-udaju", priority: 0.3 },
  { path: "/kraje", priority: 0.7 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    PRODUCTION_DOMAIN
  )
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  const baseUrl = `https://${host}`;
  const now = new Date();

  const isRootDomain =
    host === PRODUCTION_DOMAIN || !host.endsWith(`.${PRODUCTION_DOMAIN}`);

  // Home page for current host
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  // Content pages ONLY on root domain (or dev/preview)
  if (isRootDomain) {
    for (const entry of STATIC_PATHS) {
      entries.push({
        url: `${baseUrl}${entry.path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: entry.priority,
      });
    }
  }

  // Subdomains: only home page, no content paths, no cross-host URLs

  return entries;
}
