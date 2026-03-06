import priceResearch from "../../PRICE_RESEARCH.json";

export interface RegionPrices {
  byt_m2: number;
  dum_m2: number;
  pozemek_m2: number;
}

interface PriceResearchData {
  regions: Record<string, RegionPrices>;
}

const data = priceResearch as PriceResearchData;

/** Výkupní discount factor (we buy at 70-80% of market price) */
const VYKUP_LOW_FACTOR = 0.7;
const VYKUP_HIGH_FACTOR = 0.8;

export interface AggregateOfferPrices {
  lowPrice: number;
  highPrice: number;
  offerCount: number;
}

/**
 * Compute výkupní (buyout) price range for a region.
 * lowPrice = min across property types × 0.7
 * highPrice = max across property types × 0.8
 */
export function getRegionVykupPrices(
  regionKey: string,
): AggregateOfferPrices | null {
  const prices = data.regions[regionKey];
  if (!prices) return null;

  const allPrices = [prices.byt_m2, prices.dum_m2, prices.pozemek_m2];
  const minMarket = Math.min(...allPrices);
  const maxMarket = Math.max(...allPrices);

  return {
    lowPrice: Math.round(minMarket * VYKUP_LOW_FACTOR),
    highPrice: Math.round(maxMarket * VYKUP_HIGH_FACTOR),
    offerCount: 3, // byt, dům, pozemek
  };
}
