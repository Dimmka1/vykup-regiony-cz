import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { PRODUCTION_DOMAIN } from "@/lib/config";

/**
 * AI / LLM crawler user-agents we explicitly allow.
 *
 * Two categories per Anthropic / OpenAI / Perplexity docs:
 *   - Training crawlers (Category 1) — broader index used for model training.
 *   - Search/retrieval crawlers (Category 2) — fetch on-demand to answer
 *     a user query, equivalent to Googlebot for AI search engines.
 *
 * We allow both because we *want* our content in their training corpus and
 * in their live retrieval. There is no private content on this site and no
 * paid wall to protect.
 *
 * Order matters slightly for robots.txt readability. We list general-purpose
 * crawlers first, then per-vendor groups.
 */
const AI_CRAWLER_USER_AGENTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Google AI (separate from Googlebot)
  "Google-Extended",
  "GoogleOther",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Apple Intelligence
  "Applebot-Extended",
  // Meta AI
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  // Microsoft Bing / Copilot
  "Bingbot",
  "BingPreview",
  // Cohere
  "cohere-ai",
  "cohere-training-data-crawler",
  // Mistral
  "mistralai-User",
  // Amazon
  "Amazonbot",
  // ByteDance
  "Bytespider",
  // Common Crawl (downstream of many models)
  "CCBot",
  // DuckDuckGo
  "DuckAssistBot",
  "DuckDuckBot",
  // You.com
  "YouBot",
  // Diffbot
  "Diffbot",
  // Timpi
  "Timpibot",
] as const;

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

  const aiRules = AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
    userAgent,
    allow: "/",
    disallow: "/api/",
  }));

  return {
    rules: [
      // Default rule for all other crawlers (Googlebot included).
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      // Explicit AI / LLM crawler allowlist.
      ...aiRules,
    ],
    sitemap: [`https://${normalizedHost}/sitemap.xml`],
  };
}
