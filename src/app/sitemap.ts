import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { listRegions } from "@/lib/config";
import { BLOG_POSTS } from "@/app/blog/data";

const ROOT_DOMAIN = "vykoupim-nemovitost.cz";

function buildHreflangAlternates(path: string) {
  const regions = listRegions();
  const languages: Record<string, string> = {
    "x-default": `https://${ROOT_DOMAIN}${path}`,
  };
  // For subdomain regions, add cs hreflang
  // Note: sitemap alternates use xhtml:link which supports multiple same-lang entries
  // But Next.js MetadataRoute types expect Record<string, string>
  // We add root + all subdomains
  for (const region of regions) {
    const subHost = region.hosts.find(
      (h: string) =>
        h.endsWith(`.${ROOT_DOMAIN}`) &&
        !h.startsWith("www.") &&
        !h.startsWith("dev."),
    );
    if (subHost) {
      languages[`cs-${region.key}`] = `https://${subHost}${path}`;
    }
  }
  // Root domain
  languages["cs"] = `https://${ROOT_DOMAIN}${path}`;
  return languages;
}

const CONTENT_PATHS = [
  { path: "/", priority: 1.0 },
  { path: "/caste-dotazy", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/vykup-pri-exekuci", priority: 0.8 },
  { path: "/vykup-pri-dedictvi", priority: 0.8 },
  { path: "/vykup-pri-rozvodu", priority: 0.8 },
  { path: "/vykup-spoluvlastnickeho-podilu", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-hypotekou", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-vecnym-bremenem", priority: 0.8 },
  { path: "/zpetny-najem", priority: 0.8 },
  { path: "/vykup-bytu", priority: 0.8 },
  { path: "/vykup-domu", priority: 0.8 },
  { path: "/vykup-pozemku", priority: 0.8 },
  { path: "/reference", priority: 0.6 },
  { path: "/jak-to-funguje", priority: 0.7 },
  { path: "/proc-my", priority: 0.8 },
  { path: "/cenova-garancia", priority: 0.8 },
  { path: "/kraje", priority: 0.7 },
  { path: "/ochrana-osobnich-udaju", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
] as const;

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

  // Subdomain sitemap: ONLY home page (content lives on root domain)
  if (!isRootOrDev) {
    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 1,
        alternates: {
          languages: buildHreflangAlternates("/"),
        },
      },
    ];
  }

  // Root domain sitemap: all content pages + blog posts
  const entries: MetadataRoute.Sitemap = CONTENT_PATHS.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: entry.priority,
    alternates: {
      languages: buildHreflangAlternates(entry.path),
    },
  }));

  // Blog post entries
  for (const post of BLOG_POSTS) {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: buildHreflangAlternates(`/blog/${post.slug}`),
      },
    });
  }

  return entries;
}
