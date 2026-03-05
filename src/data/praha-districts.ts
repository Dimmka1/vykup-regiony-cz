export interface DistrictData {
  slug: string;
  name: string;
  fullName: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  heroText: string;
  description: string;
  typicalProperties: string;
  localFeatures: string;
  avgPriceFlat: string;
  avgPriceHouse: string;
  avgPricePerM2: string;
  ctaRegionValue: string;
  keywords: string[];
}

export const PRAHA_DISTRICTS: DistrictData[] = [
  {
    slug: "praha-4",
    name: "Praha 4",
    fullName: "Praha 4 (Nusle, Podolí, Braník, Krč, Lhotka, Kunratice)",
    seoTitle:
      "Výkup nemovitostí Praha 4 | Nusle, Podolí, Braník | Nabídka do 24h",
    seoDescription:
      "Rychlý výkup bytů a domů na Praze 4 – Nusle, Podolí, Braník, Krč. Nabídka do 24 hodin, bez provize, právní servis zdarma.",
    h1: "Výkup nemovitostí na Praze 4",
    heroText:
      "Potřebujete rychle prodat byt nebo dům na Praze 4? Zajistíme výkup v Nuslích, Podolí, Braníku i Krči – s nabídkou do 24 hodin a bez skrytých poplatků.",
    description:
      "Praha 4 je jedním z nejžádanějších rezidenčních obvodů hlavního města. Zahrnuje oblíbené čtvrti jako Nusle, Podolí, Braník, Krč, Lhotka a Kunratice. Díky výborné občanské vybavenosti, blízkosti centra a zeleni kolem Vltavy patří Praha 4 k lokalitám s trvale vysokou poptávkou po bydlení.",
    typicalProperties:
      "Na Praze 4 převažují panelové byty 2+1 a 3+1 v Nuslích a Krči, cihlové byty v Podolí a Braníku a rodinné domy v Kunraticích a Lhotce. Časté jsou i podíly v činžovních domech v širším centru.",
    localFeatures:
      "Výborná dostupnost metra C (Vyšehrad, Pražského povstání, Pankrác, Budějovická, Kačerov), nákupní centrum Arkády Pankrác, Thomayerova nemocnice, přístup k Vltavě a cyklostezky podél řeky.",
    avgPriceFlat: "4 200 000 – 6 800 000 Kč",
    avgPriceHouse: "9 500 000 – 16 000 000 Kč",
    avgPricePerM2: "105 000 – 135 000 Kč/m²",
    ctaRegionValue: "Praha 4",
    keywords: [
      "výkup nemovitostí Praha 4",
      "prodej bytu Praha 4",
      "výkup bytu Nusle",
      "výkup domu Braník",
      "rychlý prodej nemovitosti Praha 4",
    ],
  },
  {
    slug: "praha-5",
    name: "Praha 5",
    fullName: "Praha 5 (Smíchov, Košíře, Motol, Jinonice, Radlice, Hlubočepy)",
    seoTitle: "Výkup nemovitostí Praha 5 | Smíchov, Košíře, Motol | Do 24h",
    seoDescription:
      "Výkup bytů a domů na Praze 5 – Smíchov, Košíře, Motol, Jinonice. Rychlá nabídka, férová cena, bez provize.",
    h1: "Výkup nemovitostí na Praze 5",
    heroText:
      "Prodáváte nemovitost na Praze 5? Vykoupíme váš byt nebo dům na Smíchově, v Košířích i Motole – rychle, diskrétně a za férovou cenu.",
    description:
      "Praha 5 patří mezi největší a nejrozmanitější pražské obvody. Smíchov prochází dynamickou proměnou s novými developerskými projekty, zatímco Košíře a Motol si zachovávají klidnější rezidenční charakter. Obvod nabízí skvělou dopravní dostupnost a pestrou občanskou vybavenost.",
    typicalProperties:
      "Smíchov nabízí mix nových developerských bytů a starších cihlových domů. V Košířích a Radlicích najdete panelové i cihlové byty, v Jinonicích a Hlubočepech rodinné domy. Časté jsou rekonstruované byty v prvorepublikových činžácích.",
    localFeatures:
      "Metro B (Smíchovské nádraží, Anděl), Nový Smíchov – velké nákupní centrum, FN Motol, kampus ČVUT v Dejvicích na dosah, Prokopské údolí pro rekreaci.",
    avgPriceFlat: "4 500 000 – 7 500 000 Kč",
    avgPriceHouse: "10 000 000 – 18 000 000 Kč",
    avgPricePerM2: "110 000 – 145 000 Kč/m²",
    ctaRegionValue: "Praha 5",
    keywords: [
      "výkup nemovitostí Praha 5",
      "prodej bytu Smíchov",
      "výkup bytu Košíře",
      "výkup domu Praha 5",
      "rychlý prodej nemovitosti Praha 5",
    ],
  },
  {
    slug: "praha-9",
    name: "Praha 9",
    fullName: "Praha 9 (Vysočany, Prosek, Střížkov, Letňany, Hloubětín)",
    seoTitle: "Výkup nemovitostí Praha 9 | Vysočany, Prosek, Letňany | Do 24h",
    seoDescription:
      "Rychlý výkup nemovitostí na Praze 9 – Vysočany, Prosek, Střížkov, Letňany. Nabídka do 24 hodin, bez provize.",
    h1: "Výkup nemovitostí na Praze 9",
    heroText:
      "Chcete rychle prodat nemovitost na Praze 9? Vykupujeme byty a domy ve Vysočanech, na Proseku, Střížkově i v Letňanech – férově a bez zbytečného čekání.",
    description:
      "Praha 9 je jedním z nejrychleji se rozvíjejících pražských obvodů. Vysočany se proměnily z průmyslové zóny v moderní rezidenční čtvrť, Prosek a Střížkov nabízejí dostupné bydlení s výborným napojením na metro. Letňany lákají rodiny díky Letňanským lužinám a OC Letňany.",
    typicalProperties:
      "Dominují panelové byty na Proseku a Střížkově (2+kk až 3+1), nové developerské projekty ve Vysočanech (Harfa, Nová Harfa), rodinné domy v Hloubětíně a starších částech Letňan.",
    localFeatures:
      "Metro B (Vysočanská, Kolbenova) a C (Prosek, Střížkov, Letňany), O2 Arena, OC Letňany, PVA Expo Praha, nové kancelářské komplexy a rezidence ve Vysočanech.",
    avgPriceFlat: "3 800 000 – 5 800 000 Kč",
    avgPriceHouse: "8 000 000 – 14 000 000 Kč",
    avgPricePerM2: "95 000 – 120 000 Kč/m²",
    ctaRegionValue: "Praha 9",
    keywords: [
      "výkup nemovitostí Praha 9",
      "prodej bytu Vysočany",
      "výkup bytu Prosek",
      "výkup domu Praha 9",
      "rychlý prodej nemovitosti Letňany",
    ],
  },
  {
    slug: "praha-10",
    name: "Praha 10",
    fullName: "Praha 10 (Vršovice, Strašnice, Záběhlice, Malešice, Hostivař)",
    seoTitle:
      "Výkup nemovitostí Praha 10 | Vršovice, Strašnice | Nabídka do 24h",
    seoDescription:
      "Výkup bytů a domů na Praze 10 – Vršovice, Strašnice, Hostivař. Rychle, bez provize, s právním servisem zdarma.",
    h1: "Výkup nemovitostí na Praze 10",
    heroText:
      "Prodáváte nemovitost na Praze 10? Zajistíme rychlý výkup ve Vršovicích, Strašnicích, Hostivaři i Záběhlicích – s nabídkou do 24 hodin.",
    description:
      "Praha 10 je rozlehlý rezidenční obvod s pestrou nabídkou bydlení. Vršovice zažívají renesanci jako trendy čtvrť s kavárnami a galerií, Strašnice nabízejí klidné bydlení s výbornou dostupností centra, Hostivař láká na blízkost přehrady a lesoparku.",
    typicalProperties:
      "Ve Vršovicích převažují cihlové byty v činžovních domech, ve Strašnicích a Záběhlicích panelové byty 2+1 a 3+1, v Malešicích a Hostivaři najdete i rodinné domy a novější bytové projekty.",
    localFeatures:
      "Metro A (Strašnická, Skalka, Depo Hostivař), tramvajové spojení do centra, Hostivařská přehrada, Eden (Vršovice), nákupní centrum Outlet Arena Hostivař, blízkost D1.",
    avgPriceFlat: "3 900 000 – 6 200 000 Kč",
    avgPriceHouse: "8 500 000 – 15 000 000 Kč",
    avgPricePerM2: "98 000 – 125 000 Kč/m²",
    ctaRegionValue: "Praha 10",
    keywords: [
      "výkup nemovitostí Praha 10",
      "prodej bytu Vršovice",
      "výkup bytu Strašnice",
      "výkup domu Praha 10",
      "rychlý prodej nemovitosti Hostivař",
    ],
  },
];

export const DISTRICT_SLUGS = PRAHA_DISTRICTS.map((d) => d.slug);

export function getDistrictBySlug(slug: string): DistrictData | undefined {
  return PRAHA_DISTRICTS.find((d) => d.slug === slug);
}
