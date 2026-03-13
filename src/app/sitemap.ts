import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { BLOG_POSTS } from "@/app/blog/data";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

const ROOT_DOMAIN = "vykoupim-nemovitost.cz";

/** Use-case pages that support ?kraj= and ?mesto= geo parameterization */
const USE_CASE_PATHS = [
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

const CONTENT_PATHS = [
  { path: "/", priority: 1.0 },
  { path: "/caste-dotazy", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  ...USE_CASE_PATHS.map((path) => ({ path, priority: 0.8 })),
  { path: "/reference", priority: 0.6 },
  { path: "/jak-to-funguje", priority: 0.7 },
  { path: "/proc-my", priority: 0.8 },
  { path: "/kraje", priority: 0.7 },
  { path: "/garance-vykupu", priority: 0.7 },
  { path: "/pruvodce-vykupem", priority: 0.7 },
  { path: "/o-nas", priority: 0.7 },
  { path: "/ochrana-osobnich-udaju", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
] as const;

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ROOT_DOMAIN
  )
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  const now = new Date();
  const isRootOrDev = host === ROOT_DOMAIN || !host.endsWith(`.${ROOT_DOMAIN}`);
  const baseUrl = `https://${host}`;
  const regions = listRegions();

  // ─── Subdomain sitemap: homepage + ?mesto= city pages ───
  if (!isRootOrDev) {
    const entries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 1,
      },
    ];

    const region = regions.find((r) =>
      r.hosts.some((h) => h.toLowerCase() === host),
    );
    if (region) {
      for (const city of region.supportedCities) {
        entries.push({
          url: `${baseUrl}?mesto=${slugify(city)}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    return entries;
  }

  // ─── Root domain sitemap: all content + geo-parameterized pages ───
  const entries: MetadataRoute.Sitemap = [];
  const rootUrl = `https://${ROOT_DOMAIN}`;

  // 1. Static content pages (base URLs without params)
  for (const entry of CONTENT_PATHS) {
    entries.push({
      url: `${rootUrl}${entry.path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: entry.priority,
    });
  }

  // 2. Blog post entries
  for (const post of BLOG_POSTS) {
    entries.push({
      url: `${rootUrl}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // 3. Geo-parameterized ?kraj= pages (14 regions × 10 use-case pages = 140 URLs)
  for (const region of regions) {
    for (const useCasePath of USE_CASE_PATHS) {
      entries.push({
        url: `${rootUrl}${useCasePath}?kraj=${region.key}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // 4. Geo-parameterized ?mesto= pages (84 cities × 10 use-case pages = 840 URLs)
  for (const region of regions) {
    for (const city of region.supportedCities) {
      const citySlug = slugify(city);
      for (const useCasePath of USE_CASE_PATHS) {
        entries.push({
          url: `${rootUrl}${useCasePath}?mesto=${citySlug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // 5. Regional subdomain homepages (14 URLs)
  for (const region of regions) {
    const subdomainUrl = getRegionSubdomainUrl(region.key);
    entries.push({
      url: subdomainUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // 6. City-level ?mesto= pages on regional subdomains (84 URLs)
  for (const region of regions) {
    const subdomainUrl = getRegionSubdomainUrl(region.key);
    for (const city of region.supportedCities) {
      entries.push({
        url: `${subdomainUrl}?mesto=${slugify(city)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
