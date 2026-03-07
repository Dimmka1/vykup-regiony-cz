/**
 * PPC Region slug mapping.
 * Maps short PPC slugs to region keys from regions.yml
 */

export const PPC_SLUG_TO_REGION_KEY: Record<string, string> = {
  praha: "praha",
  stredocesky: "stredocesky-kraj",
  jihocesky: "jihocesky-kraj",
  plzensky: "plzensky-kraj",
  karlovarsky: "karlovarsky-kraj",
  ustecky: "ustecky-kraj",
  liberecky: "liberecky-kraj",
  kralovehradecky: "kralovehradecky-kraj",
  pardubicky: "pardubicky-kraj",
  vysocina: "vysocina",
  jihomoravsky: "jihomoravsky-kraj",
  olomoucky: "olomoucky-kraj",
  zlinsky: "zlinsky-kraj",
  moravskoslezsky: "moravskoslezsky-kraj",
};

export const PPC_REGION_NAMES: Record<string, string> = {
  praha: "Praha",
  stredocesky: "Středočeský kraj",
  jihocesky: "Jihočeský kraj",
  plzensky: "Plzeňský kraj",
  karlovarsky: "Karlovarský kraj",
  ustecky: "Ústecký kraj",
  liberecky: "Liberecký kraj",
  kralovehradecky: "Královéhradecký kraj",
  pardubicky: "Pardubický kraj",
  vysocina: "Kraj Vysočina",
  jihomoravsky: "Jihomoravský kraj",
  olomoucky: "Olomoucký kraj",
  zlinsky: "Zlínský kraj",
  moravskoslezsky: "Moravskoslezský kraj",
};

export const PPC_REGION_LOCATIVES: Record<string, string> = {
  praha: "v Praze",
  stredocesky: "ve Středočeském kraji",
  jihocesky: "v Jihočeském kraji",
  plzensky: "v Plzeňském kraji",
  karlovarsky: "v Karlovarském kraji",
  ustecky: "v Ústeckém kraji",
  liberecky: "v Libereckém kraji",
  kralovehradecky: "v Královéhradeckém kraji",
  pardubicky: "v Pardubickém kraji",
  vysocina: "na Vysočině",
  jihomoravsky: "v Jihomoravském kraji",
  olomoucky: "v Olomouckém kraji",
  zlinsky: "ve Zlínském kraji",
  moravskoslezsky: "v Moravskoslezském kraji",
};

export const PPC_SOCIAL_PROOF_COUNTS: Record<string, number> = {
  praha: 127,
  stredocesky: 89,
  jihocesky: 54,
  plzensky: 47,
  karlovarsky: 31,
  ustecky: 62,
  liberecky: 38,
  kralovehradecky: 42,
  pardubicky: 36,
  vysocina: 33,
  jihomoravsky: 98,
  olomoucky: 41,
  zlinsky: 35,
  moravskoslezsky: 73,
};

export const ALL_PPC_SLUGS = Object.keys(PPC_SLUG_TO_REGION_KEY);
