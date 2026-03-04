/**
 * Lead qualification scoring module.
 *
 * Assigns a numeric score (0-90) based on property type, region,
 * situation and lead source. Returns a tier + emoji for quick triage.
 */

export interface LeadScoringInput {
  property_type: string;
  region: string;
  situation_type: string;
  /** Optional – the form/widget that generated the lead */
  source?: string;
}

export type LeadTier = "hot" | "warm" | "cold";

export interface LeadScore {
  score: number;
  emoji: string;
  tier: LeadTier;
}

/* ------------------------------------------------------------------ */
/*  Scoring tables                                                     */
/* ------------------------------------------------------------------ */

const PROPERTY_TYPE_SCORES: Record<string, number> = {
  byt: 30,
  dum: 20,
  dům: 20,
  komercni: 15,
  komerční: 15,
  pozemek: 10,
};

const REGION_TIER_1 = new Set(["praha"]);
const REGION_TIER_2 = new Set(["brno", "ostrava"]);
const REGION_TIER_3 = new Set([
  "plzeň",
  "plzen",
  "liberec",
  "olomouc",
  "hradec králové",
  "hradec kralove",
  "české budějovice",
  "ceske budejovice",
  "ústí nad labem",
  "usti nad labem",
  "pardubice",
  "zlín",
  "zlin",
  "karlovy vary",
  "jihlava",
]);

const SITUATION_HIGH = new Set(["exekuce", "insolvence"]);
const SITUATION_MID = new Set(["dedictvi", "dědictví", "rozvod"]);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

function scorePropertyType(raw: string): number {
  return PROPERTY_TYPE_SCORES[normalise(raw)] ?? 10;
}

function scoreRegion(raw: string): number {
  const key = normalise(raw);
  if (REGION_TIER_1.has(key)) return 30;
  if (REGION_TIER_2.has(key)) return 20;
  if (REGION_TIER_3.has(key)) return 15;
  return 10;
}

function scoreSituation(raw: string): number {
  const key = normalise(raw);
  if (SITUATION_HIGH.has(key)) return 20;
  if (SITUATION_MID.has(key)) return 15;
  return 0;
}

function scoreSource(source?: string): number {
  if (!source) return 0;
  return normalise(source) === "quick-estimate" ? 10 : 0;
}

function tierFromScore(score: number): { emoji: string; tier: LeadTier } {
  if (score >= 60) return { emoji: "🔥", tier: "hot" };
  if (score >= 30) return { emoji: "⚡", tier: "warm" };
  return { emoji: "❄️", tier: "cold" };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function calculateLeadScore(lead: LeadScoringInput): LeadScore {
  const score =
    scorePropertyType(lead.property_type) +
    scoreRegion(lead.region) +
    scoreSituation(lead.situation_type) +
    scoreSource(lead.source);

  const { emoji, tier } = tierFromScore(score);

  return { score, emoji, tier };
}
