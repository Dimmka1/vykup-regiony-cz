/**
 * Geo-region mapping: Czech cities → our 14 region slugs.
 * Used by middleware to detect the closest region from Vercel geo data.
 */

/** Map of Czech city names (lowercase) → region key */
const CITY_TO_REGION: Record<string, string> = {
  // Praha
  praha: "praha",
  prague: "praha",

  // Středočeský kraj
  kladno: "stredocesky-kraj",
  "mladá boleslav": "stredocesky-kraj",
  "mlada boleslav": "stredocesky-kraj",
  kolín: "stredocesky-kraj",
  kolin: "stredocesky-kraj",
  příbram: "stredocesky-kraj",
  pribram: "stredocesky-kraj",
  beroun: "stredocesky-kraj",
  "kutná hora": "stredocesky-kraj",
  "kutna hora": "stredocesky-kraj",
  mělník: "stredocesky-kraj",
  melnik: "stredocesky-kraj",
  nymburk: "stredocesky-kraj",
  benešov: "stredocesky-kraj",
  benesov: "stredocesky-kraj",
  rakovník: "stredocesky-kraj",
  rakovnik: "stredocesky-kraj",
  říčany: "stredocesky-kraj",
  ricany: "stredocesky-kraj",
  brandýs: "stredocesky-kraj",
  brandys: "stredocesky-kraj",

  // Jihočeský kraj
  "české budějovice": "jihocesky-kraj",
  "ceske budejovice": "jihocesky-kraj",
  tábor: "jihocesky-kraj",
  tabor: "jihocesky-kraj",
  písek: "jihocesky-kraj",
  pisek: "jihocesky-kraj",
  "jindřichův hradec": "jihocesky-kraj",
  "jindrichuv hradec": "jihocesky-kraj",
  strakonice: "jihocesky-kraj",
  "český krumlov": "jihocesky-kraj",
  "cesky krumlov": "jihocesky-kraj",
  prachatice: "jihocesky-kraj",

  // Plzeňský kraj
  plzeň: "plzensky-kraj",
  plzen: "plzensky-kraj",
  pilsen: "plzensky-kraj",
  klatovy: "plzensky-kraj",
  domažlice: "plzensky-kraj",
  domazlice: "plzensky-kraj",
  rokycany: "plzensky-kraj",
  tachov: "plzensky-kraj",

  // Karlovarský kraj
  "karlovy vary": "karlovarsky-kraj",
  cheb: "karlovarsky-kraj",
  sokolov: "karlovarsky-kraj",
  "mariánské lázně": "karlovarsky-kraj",
  "marianske lazne": "karlovarsky-kraj",
  aš: "karlovarsky-kraj",
  as: "karlovarsky-kraj",
  ostrov: "karlovarsky-kraj",

  // Ústecký kraj
  "ústí nad labem": "ustecky-kraj",
  "usti nad labem": "ustecky-kraj",
  děčín: "ustecky-kraj",
  decin: "ustecky-kraj",
  most: "ustecky-kraj",
  teplice: "ustecky-kraj",
  chomutov: "ustecky-kraj",
  litoměřice: "ustecky-kraj",
  litomerice: "ustecky-kraj",
  louny: "ustecky-kraj",
  žatec: "ustecky-kraj",
  zatec: "ustecky-kraj",
  litvínov: "ustecky-kraj",
  litvinov: "ustecky-kraj",

  // Liberecký kraj
  liberec: "liberecky-kraj",
  "jablonec nad nisou": "liberecky-kraj",
  jablonec: "liberecky-kraj",
  "česká lípa": "liberecky-kraj",
  "ceska lipa": "liberecky-kraj",
  turnov: "liberecky-kraj",
  semily: "liberecky-kraj",

  // Královéhradecký kraj
  "hradec králové": "kralovehradecky-kraj",
  "hradec kralove": "kralovehradecky-kraj",
  trutnov: "kralovehradecky-kraj",
  náchod: "kralovehradecky-kraj",
  nachod: "kralovehradecky-kraj",
  jičín: "kralovehradecky-kraj",
  jicin: "kralovehradecky-kraj",
  "rychnov nad kněžnou": "kralovehradecky-kraj",
  "rychnov nad kneznou": "kralovehradecky-kraj",
  "dvůr králové": "kralovehradecky-kraj",
  "dvur kralove": "kralovehradecky-kraj",

  // Pardubický kraj
  pardubice: "pardubicky-kraj",
  chrudim: "pardubicky-kraj",
  svitavy: "pardubicky-kraj",
  "ústí nad orlicí": "pardubicky-kraj",
  "usti nad orlici": "pardubicky-kraj",
  "česká třebová": "pardubicky-kraj",
  "ceska trebova": "pardubicky-kraj",

  // Vysočina
  jihlava: "vysocina",
  třebíč: "vysocina",
  trebic: "vysocina",
  "žďár nad sázavou": "vysocina",
  "zdar nad sazavou": "vysocina",
  "havlíčkův brod": "vysocina",
  "havlickuv brod": "vysocina",
  pelhřimov: "vysocina",
  pelhrimov: "vysocina",

  // Jihomoravský kraj
  brno: "jihomoravsky-kraj",
  znojmo: "jihomoravsky-kraj",
  břeclav: "jihomoravsky-kraj",
  breclav: "jihomoravsky-kraj",
  hodonín: "jihomoravsky-kraj",
  hodonin: "jihomoravsky-kraj",
  vyškov: "jihomoravsky-kraj",
  vyskov: "jihomoravsky-kraj",
  blansko: "jihomoravsky-kraj",

  // Olomoucký kraj
  olomouc: "olomoucky-kraj",
  přerov: "olomoucky-kraj",
  prerov: "olomoucky-kraj",
  prostějov: "olomoucky-kraj",
  prostejov: "olomoucky-kraj",
  šumperk: "olomoucky-kraj",
  sumperk: "olomoucky-kraj",
  jeseník: "olomoucky-kraj",
  jesenik: "olomoucky-kraj",

  // Moravskoslezský kraj
  ostrava: "moravskoslezsky-kraj",
  karviná: "moravskoslezsky-kraj",
  karvina: "moravskoslezsky-kraj",
  "frýdek-místek": "moravskoslezsky-kraj",
  "frydek-mistek": "moravskoslezsky-kraj",
  opava: "moravskoslezsky-kraj",
  havířov: "moravskoslezsky-kraj",
  havirov: "moravskoslezsky-kraj",
  třinec: "moravskoslezsky-kraj",
  trinec: "moravskoslezsky-kraj",
  "nový jičín": "moravskoslezsky-kraj",
  "novy jicin": "moravskoslezsky-kraj",
  bruntál: "moravskoslezsky-kraj",
  bruntal: "moravskoslezsky-kraj",

  // Zlínský kraj
  zlín: "zlinsky-kraj",
  zlin: "zlinsky-kraj",
  "uherské hradiště": "zlinsky-kraj",
  "uherske hradiste": "zlinsky-kraj",
  kroměříž: "zlinsky-kraj",
  kromeriz: "zlinsky-kraj",
  vsetín: "zlinsky-kraj",
  vsetin: "zlinsky-kraj",
  "valašské meziříčí": "zlinsky-kraj",
  "valasske mezirici": "zlinsky-kraj",
  "rožnov pod radhoštěm": "zlinsky-kraj",
  "roznov pod radhostem": "zlinsky-kraj",
};

/**
 * Resolve a city name to our region key.
 * Returns null if city is unknown or not in Czech Republic.
 */
export function resolveGeoRegion(
  city: string | undefined | null,
  country: string | undefined | null,
): string | null {
  if (country && country.toUpperCase() !== "CZ") {
    return null;
  }
  if (!city) {
    return null;
  }
  const normalized = city.toLowerCase().trim();
  return CITY_TO_REGION[normalized] ?? null;
}

/** Cookie name for detected geo region */
export const GEO_REGION_COOKIE = "vn_geo_region";
