/**
 * A/B Test Variants for Hero Section (VR-141)
 *
 * Traffic split: A = 50%, B = 25%, C = 25%
 * Cookie: ab_variant (30 days, sticky)
 */

export type ABVariant = "A" | "B" | "C";

export interface HeroVariantContent {
  headline: string;
  subheadline: string;
  ctaText: string;
}

const VARIANT_OVERRIDES: Record<ABVariant, HeroVariantContent | null> = {
  A: null,
  B: {
    headline: "Prodáme vaši nemovitost do 7 dnů - záloha až {ZALOH} Kč",
    subheadline:
      "Bez provize, bez čekání. Peníze na účtu do týdne. Nezávazná nabídka zdarma.",
    ctaText: "Chci nabídku zdarma",
  },
  C: {
    headline: "Potřebujete rychle prodat? Peníze do 48 hodin, bez provize",
    subheadline:
      "Vykoupíme vaši nemovitost za férovou cenu. Bez realitky, bez starostí.",
    ctaText: "Získat nabídku do 24 h",
  },
};

export const AB_VARIANTS: readonly ABVariant[] = ["A", "B", "C"] as const;

export function pickVariant(): ABVariant {
  const rand = Math.random();
  if (rand < 0.5) return "A";
  if (rand < 0.75) return "B";
  return "C";
}

export function getHeroVariant(variant: string): HeroVariantContent | null {
  if (variant === "B" || variant === "C") {
    return VARIANT_OVERRIDES[variant];
  }
  return null;
}

export const AB_COOKIE_NAME = "ab_variant";
export const AB_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
