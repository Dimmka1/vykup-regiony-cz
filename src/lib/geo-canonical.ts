/**
 * Utility for building self-referencing canonical URLs
 * that include geo query parameters (?kraj=, ?mesto=).
 *
 * VR-304: Ensures Google indexes each geo-parameterized page individually
 * instead of treating them all as duplicates of the base URL.
 */

import type { Metadata } from "next";
import { PRODUCTION_DOMAIN } from "@/lib/config";

/** Allowed geo-related search params for canonical URLs */
const GEO_PARAMS = ["kraj", "mesto"] as const;

/**
 * Build a self-referencing canonical URL for a content page,
 * including any geo query parameters (?kraj=, ?mesto=).
 *
 * @param pathname - The page pathname, e.g. "/vykup-pri-exekuci"
 * @param searchParams - The page's searchParams (from Next.js)
 * @returns Absolute canonical URL with geo params if present
 *
 * @example
 * buildGeoCanonicalUrl("/vykup-pri-exekuci", { kraj: "praha" })
 * // => "https://vykoupim-nemovitost.cz/vykup-pri-exekuci?kraj=praha"
 *
 * buildGeoCanonicalUrl("/vykup-pri-exekuci", {})
 * // => "https://vykoupim-nemovitost.cz/vykup-pri-exekuci"
 */
export function buildGeoCanonicalUrl(
  pathname: string,
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const baseUrl = `https://${PRODUCTION_DOMAIN}${pathname}`;

  const params = new URLSearchParams();
  for (const key of GEO_PARAMS) {
    const value = searchParams[key];
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Build the `robots` Metadata field for use-case pages with geo params.
 *
 * Use-case pages render region-differentiated content only when `?kraj=`
 * is present (handled by `resolveGeoRegion`). When only `?mesto=` is set,
 * the page renders identical base content as the canonical use-case URL,
 * which Google flags as "Duplicate, Google chose different canonical than user."
 *
 * To prevent indexing of these duplicate pages, return `{ index: false, follow: true }`
 * when `?mesto=` is present without `?kraj=`. Otherwise return `undefined` so
 * the root layout's default (`index: true, follow: true`) applies.
 */
export function buildGeoMetadataRobots(
  searchParams: Record<string, string | string[] | undefined>,
): Metadata["robots"] {
  const hasKraj =
    typeof searchParams.kraj === "string" && searchParams.kraj.length > 0;
  const hasMesto =
    typeof searchParams.mesto === "string" && searchParams.mesto.length > 0;

  if (hasMesto && !hasKraj) {
    return { index: false, follow: true };
  }
  return undefined;
}
