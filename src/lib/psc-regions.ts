/**
 * Maps Czech PSČ (postal code) prefix to region key.
 * PSČ format: XXX XX — first 1-2 digits determine the region.
 */

const PSC_PREFIX_MAP: Record<string, string> = {
  "10": "praha",
  "11": "praha",
  "12": "praha",
  "13": "praha",
  "14": "praha",
  "15": "praha",
  "16": "praha",
  "17": "praha",
  "18": "praha",
  "19": "praha",
  "20": "stredocesky-kraj",
  "21": "stredocesky-kraj",
  "22": "stredocesky-kraj",
  "23": "stredocesky-kraj",
  "24": "stredocesky-kraj",
  "25": "stredocesky-kraj",
  "26": "stredocesky-kraj",
  "27": "stredocesky-kraj",
  "28": "stredocesky-kraj",
  "29": "stredocesky-kraj",
  "37": "jihocesky-kraj",
  "38": "jihocesky-kraj",
  "39": "jihocesky-kraj",
  "30": "plzensky-kraj",
  "31": "plzensky-kraj",
  "32": "plzensky-kraj",
  "33": "plzensky-kraj",
  "34": "plzensky-kraj",
  "35": "karlovarsky-kraj",
  "36": "karlovarsky-kraj",
  "40": "ustecky-kraj",
  "41": "ustecky-kraj",
  "43": "ustecky-kraj",
  "46": "liberecky-kraj",
  "47": "liberecky-kraj",
  "50": "kralovehradecky-kraj",
  "51": "kralovehradecky-kraj",
  "54": "kralovehradecky-kraj",
  "55": "kralovehradecky-kraj",
  "52": "pardubicky-kraj",
  "53": "pardubicky-kraj",
  "56": "pardubicky-kraj",
  "57": "vysocina",
  "58": "vysocina",
  "59": "vysocina",
  "60": "jihomoravsky-kraj",
  "61": "jihomoravsky-kraj",
  "62": "jihomoravsky-kraj",
  "63": "jihomoravsky-kraj",
  "64": "jihomoravsky-kraj",
  "65": "jihomoravsky-kraj",
  "66": "jihomoravsky-kraj",
  "67": "jihomoravsky-kraj",
  "77": "olomoucky-kraj",
  "78": "olomoucky-kraj",
  "75": "zlinsky-kraj",
  "76": "zlinsky-kraj",
  "70": "moravskoslezsky-kraj",
  "71": "moravskoslezsky-kraj",
  "72": "moravskoslezsky-kraj",
  "73": "moravskoslezsky-kraj",
  "74": "moravskoslezsky-kraj",
  "79": "moravskoslezsky-kraj",
};

export const REGION_NAMES: Record<string, string> = {
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

export interface PscLookupResult {
  regionKey: string;
  regionName: string;
}

export function resolveRegionByPsc(psc: string): PscLookupResult | null {
  const digits = psc.replace(/\s/g, "");
  if (!/^\d{5}$/.test(digits)) return null;

  const prefix2 = digits.slice(0, 2);
  const regionKey = PSC_PREFIX_MAP[prefix2];
  if (!regionKey) return null;

  return { regionKey, regionName: REGION_NAMES[regionKey] ?? regionKey };
}
