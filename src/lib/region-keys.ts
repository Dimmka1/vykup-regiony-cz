/**
 * Static set of region keys for client-side use.
 * Must match the keys defined in src/data/regions.yml.
 *
 * This file exists because lib/config.ts uses node:fs (server-only).
 * Client components that need region key lookup import from here instead.
 */
export const REGION_KEY_LIST: ReadonlySet<string> = new Set([
  "praha",
  "stredocesky-kraj",
  "jihocesky-kraj",
  "plzensky-kraj",
  "karlovarsky-kraj",
  "ustecky-kraj",
  "liberecky-kraj",
  "kralovehradecky-kraj",
  "pardubicky-kraj",
  "vysocina",
  "jihomoravsky-kraj",
  "olomoucky-kraj",
  "moravskoslezsky-kraj",
  "zlinsky-kraj",
]);
