import {
  ROOT_URL,
  BUILD_DATE,
  buildSitemapXml,
  XML_HEADERS,
} from "@/lib/sitemap-helpers";
import { BLOG_POSTS } from "@/app/blog/data";

/**
 * GET /sitemap-blog.xml
 *
 * Blog posts + content pages (priority 0.6):
 * - /blog listing page
 * - Individual blog posts
 * - Legal/info pages (lower priority)
 */
export async function GET(): Promise<Response> {
  const entries: Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }> = [];

  // 1. Blog listing page
  entries.push({
    url: `${ROOT_URL}/blog`,
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: 0.7,
  });

  // 2. Individual blog posts
  for (const post of BLOG_POSTS) {
    entries.push({
      url: `${ROOT_URL}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: "monthly",
      priority: 0.6,
    });
  }

  // 3. Legal/info pages
  const contentPages = [
    { path: "/ochrana-osobnich-udaju", priority: 0.3 },
    { path: "/cookies", priority: 0.3 },
  ] as const;

  for (const page of contentPages) {
    entries.push({
      url: `${ROOT_URL}${page.path}`,
      lastmod: BUILD_DATE,
      changefreq: "yearly",
      priority: page.priority,
    });
  }

  const xml = buildSitemapXml(entries);
  return new Response(xml, { status: 200, headers: XML_HEADERS });
}
