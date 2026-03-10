/**
 * Multi-factor property valuation model.
 * Used by both /api/valuation and client-side calculator.
 */

// --- Types ---

export type PropertyType = "byt" | "dum" | "pozemek" | "komercni";
export type PropertyCondition = "vyborny" | "dobry" | "horsi" | "rekonstrukce";
export type FloorCategory = "prizemi" | "1-3" | "4+" | "podkrovi";

export interface ValuationInput {
  region: string;
  type: PropertyType;
  m2: number;
  condition: PropertyCondition;
  floor: FloorCategory;
}

export interface ValuationResult {
  marketEstimate: number;
  min: number;
  max: number;
  vykupMin: number;
  vykupMax: number;
  currency: "CZK";
}

// --- Constants ---

/** Base price per m² by region (CZK). Source: PRICE_RESEARCH + YAML */
const REGION_BASE_PRICES: Record<string, number> = {
  praha: 85_000,
  "stredocesky-kraj": 55_000,
  "jihocesky-kraj": 42_000,
  "plzensky-kraj": 55_000,
  "karlovarsky-kraj": 30_000,
  "ustecky-kraj": 28_000,
  "liberecky-kraj": 45_000,
  "kralovehradecky-kraj": 48_000,
  "pardubicky-kraj": 46_000,
  vysocina: 38_000,
  "jihomoravsky-kraj": 65_000,
  "olomoucky-kraj": 42_000,
  "moravskoslezsky-kraj": 35_000,
  "zlinsky-kraj": 44_000,
};

const DEFAULT_BASE_PRICE = 45_000;

const CONDITION_MULTIPLIERS: Record<PropertyCondition, number> = {
  vyborny: 1.0,
  dobry: 0.85,
  horsi: 0.7,
  rekonstrukce: 0.55,
};

const TYPE_MULTIPLIERS: Record<PropertyType, number> = {
  byt: 1.0,
  dum: 0.95,
  pozemek: 0.8,
  komercni: 0.9,
};

const FLOOR_ADJUSTMENTS: Record<FloorCategory, number> = {
  prizemi: -0.03,
  "1-3": 0,
  "4+": 0.02,
  podkrovi: -0.05,
};

/** Výkupní cena = market × 0.75–0.85 */
const VYKUP_LOW = 0.75;
const VYKUP_HIGH = 0.85;

/** Market estimate tolerance ±8% */
const MARKET_TOLERANCE = 0.08;

// --- Calculation ---

export function getBasePrice(region: string): number {
  return REGION_BASE_PRICES[region] ?? DEFAULT_BASE_PRICE;
}

export function calculateValuation(input: ValuationInput): ValuationResult {
  const basePrice = getBasePrice(input.region);
  const conditionMul = CONDITION_MULTIPLIERS[input.condition];
  const typeMul = TYPE_MULTIPLIERS[input.type];
  const floorAdj = FLOOR_ADJUSTMENTS[input.floor];

  const marketEstimate = Math.round(
    input.m2 * basePrice * conditionMul * typeMul * (1 + floorAdj),
  );

  const min = Math.round(marketEstimate * (1 - MARKET_TOLERANCE));
  const max = Math.round(marketEstimate * (1 + MARKET_TOLERANCE));

  const vykupMin = Math.round(marketEstimate * VYKUP_LOW);
  const vykupMax = Math.round(marketEstimate * VYKUP_HIGH);

  return {
    marketEstimate,
    min,
    max,
    vykupMin,
    vykupMax,
    currency: "CZK",
  };
}

// --- Labels (for UI) ---

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  byt: "Byt",
  dum: "Rodinný dům",
  pozemek: "Pozemek",
  komercni: "Komerční",
};

export const CONDITION_LABELS: Record<PropertyCondition, string> = {
  vyborny: "Výborný",
  dobry: "Dobrý",
  horsi: "Horší",
  rekonstrukce: "K rekonstrukci",
};

export const FLOOR_LABELS: Record<FloorCategory, string> = {
  prizemi: "Přízemí",
  "1-3": "1.–3. patro",
  "4+": "4. patro a výše",
  podkrovi: "Podkroví",
};

export const REGION_LABELS: Record<string, string> = {
  praha: "Praha",
  "stredocesky-kraj": "Středočeský kraj",
  "jihocesky-kraj": "Jihočeský kraj",
  "plzensky-kraj": "Plzeňský kraj",
  "karlovarsky-kraj": "Karlovarský kraj",
  "ustecky-kraj": "Ústecký kraj",
  "liberecky-kraj": "Liberecký kraj",
  "kralovehradecky-kraj": "Královéhradecký kraj",
  "pardubicky-kraj": "Pardubický kraj",
  vysocina: "Vysočina",
  "jihomoravsky-kraj": "Jihomoravský kraj",
  "olomoucky-kraj": "Olomoucký kraj",
  "moravskoslezsky-kraj": "Moravskoslezský kraj",
  "zlinsky-kraj": "Zlínský kraj",
};
