/**
 * Price data per region from PRICE_RESEARCH.json.
 * Embedded at build time — no runtime file reads needed.
 *
 * Source: RealityMIX 02/2026, ČSÚ Q1 2025
 * All prices in CZK per m².
 */

export interface RegionPrices {
  /** Average apartment price per m² */
  readonly bytM2: number;
  /** Average house price per m² */
  readonly dumM2: number;
  /** Average building plot price per m² */
  readonly pozemekM2: number;
}

/**
 * Price data indexed by region key (matching regions.yml keys).
 */
export const REGION_PRICES: Readonly<Record<string, RegionPrices>> = {
  praha: { bytM2: 150_800, dumM2: 105_000, pozemekM2: 14_000 },
  "stredocesky-kraj": { bytM2: 86_500, dumM2: 60_000, pozemekM2: 5_500 },
  "jihocesky-kraj": { bytM2: 72_000, dumM2: 48_000, pozemekM2: 3_000 },
  "plzensky-kraj": { bytM2: 78_000, dumM2: 52_000, pozemekM2: 3_200 },
  "karlovarsky-kraj": { bytM2: 42_000, dumM2: 32_000, pozemekM2: 1_800 },
  "ustecky-kraj": { bytM2: 40_000, dumM2: 28_000, pozemekM2: 1_800 },
  "liberecky-kraj": { bytM2: 68_000, dumM2: 45_000, pozemekM2: 2_500 },
  "kralovehradecky-kraj": { bytM2: 75_000, dumM2: 48_000, pozemekM2: 3_200 },
  "pardubicky-kraj": { bytM2: 72_000, dumM2: 46_000, pozemekM2: 2_800 },
  vysocina: { bytM2: 55_000, dumM2: 38_000, pozemekM2: 1_600 },
  "jihomoravsky-kraj": { bytM2: 91_000, dumM2: 58_000, pozemekM2: 5_000 },
  "olomoucky-kraj": { bytM2: 70_000, dumM2: 42_000, pozemekM2: 2_200 },
  "moravskoslezsky-kraj": { bytM2: 50_000, dumM2: 35_000, pozemekM2: 1_700 },
  "zlinsky-kraj": { bytM2: 68_000, dumM2: 44_000, pozemekM2: 2_400 },
};

/** Format a number as Czech price string, e.g. "150 800 Kč" */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("cs-CZ")} Kč`;
}

/** Format price per m², e.g. "150 800 Kč/m²" */
export function formatPricePerM2(price: number): string {
  return `${price.toLocaleString("cs-CZ")} Kč/m²`;
}

/** Calculate approximate property value for a given area */
export function estimateValue(pricePerM2: number, areaM2: number): string {
  const value = pricePerM2 * areaM2;
  if (value >= 1_000_000) {
    const millions = (value / 1_000_000).toFixed(1).replace(".", ",");
    return `${millions} mil. Kč`;
  }
  return formatPrice(value);
}
