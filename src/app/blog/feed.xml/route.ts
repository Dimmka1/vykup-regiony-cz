import { BLOG_POSTS } from "../data";

const SITE_URL = "https://vykoupim-nemovitost.cz";
const FEED_TITLE = "Výkup nemovitostí — Blog";
const FEED_DESCRIPTION =
  "Nejnovější články o výkupu nemovitostí, prodeji a realitním trhu v ČR.";
const MAX_ITEMS = 20;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toUTCString();
}

export function GET() {
  const posts = BLOG_POSTS.slice(0, MAX_ITEMS);

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
    </item>`,
    )
    .join("\n");

  const lastBuildDate =
    posts.length > 0 ? toRfc822(posts[0].date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>cs</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
