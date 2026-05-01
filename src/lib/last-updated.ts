/**
 * Per-page "last updated" registry.
 *
 * AI Overview citations correlate strongly with content freshness — pages
 * with recent dateModified are 4× more likely to be cited (44% of AI
 * Overview citations come from 2025+ content per BrightEdge 2026 study).
 *
 * Pattern: each priority page declares its real last-modified date here.
 * The visible <LastUpdated /> component reads from this map and renders
 * "Aktualizováno: 1. května 2026". Article schema dateModified pulls the
 * same value, so user-visible freshness and machine-readable freshness
 * stay in sync.
 *
 * No faking — when a page actually gets edited, bump its entry. CI could
 * enforce a "no entry older than 12 months" rule as a future iteration.
 */

/** ISO-8601 date string, YYYY-MM-DD. */
export type IsoDate = `${number}-${number}-${number}`;

const LAST_UPDATED: Record<string, IsoDate> = {
  // Use-case pages
  "/vykup-bytu": "2026-05-01",
  "/vykup-domu": "2026-05-01",
  "/vykup-pozemku": "2026-05-01",
  "/vykup-pri-exekuci": "2026-05-01",
  "/vykup-pri-dedictvi": "2026-05-01",
  "/vykup-pri-rozvodu": "2026-05-01",
  "/vykup-spoluvlastnickeho-podilu": "2026-05-01",
  "/vykup-nemovitosti-s-hypotekou": "2026-05-01",
  "/vykup-nemovitosti-s-vecnym-bremenem": "2026-05-01",
  "/zpetny-najem": "2026-05-01",
  "/vykup-cinzovnich-domu": "2026-05-01",
  "/vykup-pri-privatizaci": "2026-05-01",
  "/vykup-v-drazbe": "2026-05-01",

  // Information pages
  "/jak-to-funguje": "2026-05-01",
  "/o-nas": "2026-05-01",
  "/proc-my": "2026-05-01",
  "/garance-vykupu": "2026-05-01",
  "/caste-dotazy": "2026-05-01",
  "/pruvodce-vykupem": "2026-05-01",

  // New authority pages (added in this rollout)
  "/jak-stanovujeme-cenu": "2026-05-01",
  "/redakcni-zasady": "2026-05-01",
  "/slovnik-pojmu": "2026-05-01",
  "/zdroje-a-citace": "2026-05-01",
  "/index-vykupnich-cen": "2026-05-01",

  // Homepage
  "/": "2026-05-01",
};

/**
 * Get the last-updated date for a given pathname (no query string, no host).
 * Returns null if the path is not registered — caller decides fallback.
 */
export function getLastUpdated(pathname: string): IsoDate | null {
  return LAST_UPDATED[pathname] ?? null;
}

/** Czech-language month names in genitive case (used by formatLastUpdatedCs). */
const CZECH_MONTHS_GENITIVE = [
  "ledna",
  "února",
  "března",
  "dubna",
  "května",
  "června",
  "července",
  "srpna",
  "září",
  "října",
  "listopadu",
  "prosince",
] as const;

/**
 * Format an ISO date as a Czech long-form string ("1. května 2026").
 */
export function formatLastUpdatedCs(iso: IsoDate): string {
  const [yearStr, monthStr, dayStr] = iso.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const monthName = CZECH_MONTHS_GENITIVE[month - 1] ?? "";
  return `${day}. ${monthName} ${year}`;
}

/**
 * Convenience: Czech-formatted string for a given page, or null if unregistered.
 */
export function getLastUpdatedFormatted(pathname: string): string | null {
  const iso = getLastUpdated(pathname);
  return iso ? formatLastUpdatedCs(iso) : null;
}
