/**
 * Centralized pricing configuration (VR-326).
 *
 * ENV vars:
 *   NEXT_PUBLIC_MAX_ZALOHA       – záloha amount string, default "500 000"
 *   NEXT_PUBLIC_PRICE_PERCENT    – výkupní cena % of market value, default "90"
 *   NEXT_PUBLIC_PRICING_VARIANT  – A/B variant: "zaloha" | "percent" | "combo", default "combo"
 */

export const MAX_ZALOHA = process.env.NEXT_PUBLIC_MAX_ZALOHA || "500 000";
export const PRICE_PERCENT = process.env.NEXT_PUBLIC_PRICE_PERCENT || "90";

export type PricingVariant = "zaloha" | "percent" | "combo";

export const DEFAULT_PRICING_VARIANT: PricingVariant =
  (process.env.NEXT_PUBLIC_PRICING_VARIANT as PricingVariant) || "combo";

/** Cookie name for per-user A/B override */
export const PRICING_COOKIE = "vn_pricing";

/**
 * Resolve the active pricing variant.
 * Priority: cookie override → env var → "combo".
 */
export function resolvePricingVariant(
  cookieValue?: string | null,
): PricingVariant {
  if (
    cookieValue === "zaloha" ||
    cookieValue === "percent" ||
    cookieValue === "combo"
  ) {
    return cookieValue;
  }
  return DEFAULT_PRICING_VARIANT;
}

/* ---- Helper strings for each variant ---- */

export function getHeroPriceBadge(variant: PricingVariant): string {
  switch (variant) {
    case "zaloha":
      return `Záloha až ${MAX_ZALOHA} Kč ihned`;
    case "percent":
      return `Výkupní cena až ${PRICE_PERCENT} % tržní hodnoty`;
    case "combo":
    default:
      return `Až ${PRICE_PERCENT} % tržní ceny · záloha ${MAX_ZALOHA} Kč ihned`;
  }
}

export function getZalohaLine(variant: PricingVariant): string {
  switch (variant) {
    case "zaloha":
      return `Až ${MAX_ZALOHA} Kč ihned`;
    case "percent":
      return `Až ${PRICE_PERCENT} % tržní ceny`;
    case "combo":
    default:
      return `Až ${PRICE_PERCENT} % tržní ceny · záloha ${MAX_ZALOHA} Kč`;
  }
}
