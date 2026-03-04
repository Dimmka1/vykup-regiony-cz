/**
 * Záloha A/B Test Variants (VR-149)
 *
 * Three hero záloha copy variants tested via cookie.
 * Traffic split: A = 34%, B = 33%, C = 33%
 * Cookie: zaloha_variant (30 days, sticky)
 */

export type ZalohaVariant = "A" | "B" | "C";

export const ZALOHA_VARIANTS: readonly ZalohaVariant[] = [
  "A",
  "B",
  "C",
] as const;

/** Hero badge text per variant */
export const ZALOHA_BADGE_TEXT: Record<ZalohaVariant, string> = {
  A: "Záloha až 500 000 Kč ihned",
  B: "Záloha až 1 000 000 Kč ihned",
  C: "Záloha dle hodnoty nemovitosti — ihned při podpisu",
};

export const ZALOHA_COOKIE_NAME = "zaloha_variant";
export const ZALOHA_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/** Pick a random variant for new visitors */
export function pickZalohaVariant(): ZalohaVariant {
  const rand = Math.random();
  if (rand < 0.34) return "A";
  if (rand < 0.67) return "B";
  return "C";
}

/** Validate and narrow a string to ZalohaVariant */
export function isValidZalohaVariant(
  value: string | null | undefined,
): value is ZalohaVariant {
  return value === "A" || value === "B" || value === "C";
}
