/**
 * VR-341: Geo SEO metadata helpers.
 *
 * Injects region locative form into title, H1, and meta description
 * for use-case pages with ?kraj= parameter, ensuring unique metadata
 * per region × use-case combination (14 regions × 10 use-cases = 140 unique pages).
 */

import { getRegionByKey } from "@/lib/config";
import type { RegionConfig } from "@/lib/types";

/**
 * Resolve region from the ?kraj= search param.
 * Returns null for unknown keys or missing param.
 */
export function resolveGeoRegion(
  searchParams: Record<string, string | string[] | undefined>,
): RegionConfig | null {
  const krajParam =
    typeof searchParams.kraj === "string" ? searchParams.kraj : null;
  if (!krajParam) return null;

  const region = getRegionByKey(krajParam);
  // getRegionByKey falls back to default region — check if the key actually matched
  if (region.key !== krajParam) return null;

  return region;
}

/**
 * Inject region locative into a title string.
 *
 * Strategy: insert locative before the first " - " separator.
 * E.g. "Výkup bytů - rychlý prodej" → "Výkup bytů v Praze - rychlý prodej"
 *
 * If no separator, append locative.
 * E.g. "Výkup nemovitosti při exekuci" → "Výkup nemovitosti při exekuci v Praze"
 */
export function injectRegionIntoTitle(
  baseTitle: string,
  locative: string,
): string {
  const separatorIndex = baseTitle.indexOf(" - ");
  if (separatorIndex !== -1) {
    const before = baseTitle.slice(0, separatorIndex);
    const after = baseTitle.slice(separatorIndex);
    return `${before} ${locative}${after}`;
  }

  // For titles with " — " (em-dash)
  const emDashIndex = baseTitle.indexOf(" — ");
  if (emDashIndex !== -1) {
    const before = baseTitle.slice(0, emDashIndex);
    const after = baseTitle.slice(emDashIndex);
    return `${before} ${locative}${after}`;
  }

  // For titles with " | " separator
  const pipeIndex = baseTitle.indexOf(" | ");
  if (pipeIndex !== -1) {
    const before = baseTitle.slice(0, pipeIndex);
    const after = baseTitle.slice(pipeIndex);
    return `${before} ${locative}${after}`;
  }

  return `${baseTitle} ${locative}`;
}

/**
 * Inject region locative into a meta description.
 *
 * Strategy: insert locative after the first verb/action phrase.
 * Falls back to appending region context.
 */
export function injectRegionIntoDescription(
  baseDescription: string,
  locative: string,
): string {
  // Common patterns in our descriptions where we can insert the locative
  const patterns: Array<[RegExp, string]> = [
    // "Vykoupíme váš byt" → "Vykoupíme váš byt v Praze"
    [/^(Vykoupíme váš spoluvlastnický podíl na nemovitosti)/, `$1 ${locative}`],
    [/^(Vykoupíme váš (?:rodinný )?(?:byt|dům|pozemek))/, `$1 ${locative}`],
    // "Vykoupíme nemovitost" → "Vykoupíme nemovitost v Praze"
    [/^(Vykoupíme (?:váš )?nemovitost)/, `$1 ${locative}`],
    // "Prodejte nemovitost" → "Prodejte nemovitost v Praze"
    [/^(Prodejte nemovitost)/, `$1 ${locative}`],
    // "Vykoupíme zděděný byt" → "Vykoupíme zděděný byt v Praze"
    [/^(Vykoupíme zděděný (?:byt|dům))/, `$1 ${locative}`],
    // "Zdědili jste nemovitost" → "Zdědili jste nemovitost v Praze"
    [/^(Zdědili jste nemovitost)/, `$1 ${locative}`],
    // "Řešíte rozvod" — inject region later in the sentence
    [
      /^(Řešíte rozvod a potřebujete rychle prodat společnou nemovitost\?)/,
      `$1 Působíme ${locative}.`,
    ],
  ];

  for (const [regex, replacement] of patterns) {
    if (regex.test(baseDescription)) {
      return baseDescription.replace(regex, replacement);
    }
  }

  // Fallback: append region context
  return `${baseDescription} Působíme ${locative} a okolí.`;
}

/**
 * Inject region locative into an H1 heading.
 * Same strategy as title — insert before separator or append.
 */
export function injectRegionIntoH1(baseH1: string, locative: string): string {
  return injectRegionIntoTitle(baseH1, locative);
}

/** Convenience: get the kraj param as string | null */
export function getKrajParam(
  searchParams: Record<string, string | string[] | undefined>,
): string | null {
  return typeof searchParams.kraj === "string" ? searchParams.kraj : null;
}
