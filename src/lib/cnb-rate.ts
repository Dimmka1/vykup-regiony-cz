/**
 * ČNB repo rate configuration.
 *
 * Updated automatically via `npm run update:cnb-rate`.
 * Manual edits are safe — the update script rewrites this file.
 */

export interface CnbRateConfig {
  /** 2T repo sazba ČNB (%) */
  readonly repoRate: number;
  /** ISO date of last data update */
  readonly lastUpdated: string;
  /** Human-readable source label */
  readonly source: string;
}

export const CNB_RATE: CnbRateConfig = {
  repoRate: 3.75,
  lastUpdated: "2026-03-07",
  source: "Česká národní banka",
};
