import type { MetadataRoute } from "next";
import { listRegions } from "@/lib/config";
import { BLOG_POSTS } from "@/app/blog/data";

const BASE_URL = "https://vykoupim-nemovitost.cz";

const STATIC_PAGES = [
  { path: "/", priority: 1.0 },
  // Use case pages
  { path: "/vykup-pri-exekuci", priority: 0.8 },
  { path: "/vykup-pri-dedictvi", priority: 0.8 },
  { path: "/vykup-pri-rozvodu", priority: 0.8 },
  { path: "/vykup-spoluvlastnickeho-podilu", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-hypotekou", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-vecnym-bremenem", priority: 0.8 },
  // Property type pages
  { path: "/vykup-bytu", priority: 0.8 },
  { path: "/vykup-domu", priority: 0.8 },
  { path: "/vykup-pozemku", priority: 0.8 },
  // Blog
  { path: "/blog", priority: 0.8 },
  // Utility pages
  { path: "/reference", priority: 0.6 },
  { path: "/jak-to-funguje", priority: 0.7 },
  { path: "/ochrana-osobnich-udaju", priority: 0.3 },
  { path: "/dekujeme", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const regionEntries: MetadataRoute.Sitemap = listRegions().map((region) => ({
    url: `${BASE_URL}/${region.key}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((entry) => ({
    url: `${BASE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: entry.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...regionEntries, ...blogEntries];
}
