/**
 * Geographic neighbor mapping for Czech regions.
 */
export const REGION_NEIGHBORS: Record<string, string[]> = {
  praha: ["stredocesky-kraj"],
  "stredocesky-kraj": ["praha", "ustecky-kraj", "liberecky-kraj", "pardubicky-kraj", "vysocina", "plzensky-kraj"],
  "jihocesky-kraj": ["plzensky-kraj", "stredocesky-kraj", "vysocina", "jihomoravsky-kraj"],
  "plzensky-kraj": ["karlovarsky-kraj", "ustecky-kraj", "stredocesky-kraj", "jihocesky-kraj"],
  "karlovarsky-kraj": ["plzensky-kraj", "ustecky-kraj", "stredocesky-kraj"],
  "ustecky-kraj": ["karlovarsky-kraj", "plzensky-kraj", "stredocesky-kraj", "liberecky-kraj"],
  "liberecky-kraj": ["ustecky-kraj", "stredocesky-kraj", "kralovehradecky-kraj"],
  "kralovehradecky-kraj": ["liberecky-kraj", "stredocesky-kraj", "pardubicky-kraj", "olomoucky-kraj"],
  "pardubicky-kraj": ["kralovehradecky-kraj", "stredocesky-kraj", "vysocina", "olomoucky-kraj"],
  vysocina: ["stredocesky-kraj", "pardubicky-kraj", "jihomoravsky-kraj", "jihocesky-kraj"],
  "jihomoravsky-kraj": ["vysocina", "olomoucky-kraj", "zlinsky-kraj", "jihocesky-kraj"],
  "olomoucky-kraj": ["pardubicky-kraj", "moravskoslezsky-kraj", "zlinsky-kraj", "jihomoravsky-kraj"],
  "moravskoslezsky-kraj": ["olomoucky-kraj", "zlinsky-kraj"],
  "zlinsky-kraj": ["jihomoravsky-kraj", "olomoucky-kraj", "moravskoslezsky-kraj"],
};

export function getNeighborKeys(regionKey: string, max = 5): string[] {
  const neighbors = REGION_NEIGHBORS[regionKey];
  if (!neighbors) return [];
  return neighbors.slice(0, max);
}
