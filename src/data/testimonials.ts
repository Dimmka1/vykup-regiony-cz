export interface NarrativeTestimonial {
  id: string;
  name: string;
  city: string;
  situation: TestimonialSituation;
  situationLabel: string;
  text: string;
  result: string;
  featured: boolean;
}

export type TestimonialSituation =
  | "exekuce"
  | "rozvod"
  | "dedictvi"
  | "hypoteka"
  | "spoluvlastnictvi"
  | "stehovani"
  | "insolvence"
  | "jine";

const SITUATION_LABELS: Record<TestimonialSituation, string> = {
  exekuce: "Exekuce",
  rozvod: "Rozvod",
  dedictvi: "Dědictví",
  hypoteka: "Hypotéka",
  spoluvlastnictvi: "Spoluvlastnictví",
  stehovani: "Stěhování do zahraničí",
  insolvence: "Insolvence",
  jine: "Jiná situace",
};

export function getSituationLabel(situation: TestimonialSituation): string {
  return SITUATION_LABELS[situation];
}

/**
 * 14 narrative testimonials covering 8 different situations.
 * First 6 are featured for homepage display.
 */
export const NARRATIVE_TESTIMONIALS: NarrativeTestimonial[] = [
  {
    id: "t1",
    name: "Petr Novotný",
    city: "Praha 9",
    situation: "exekuce",
    situationLabel: SITUATION_LABELS.exekuce,
    text: "Měl jsem tři exekuce a byt na Proseku mi hrozila dražba. Nevěděl jsem, kam se obrátit — makléři odmítali, banky taky. Tady mi do 24 hodin poslali konkrétní nabídku, vysvětlili celý postup a pomohli s vypořádáním všech dluhů. Advokát zajistil úschovu peněz, exekutoři byli vyplaceni přímo z kupní ceny.",
    result:
      "Za 10 dní jsem měl splacené dluhy a čistý start. Byt šel za férovou cenu.",
    featured: true,
  },
  {
    id: "t2",
    name: "Markéta Dvořáková",
    city: "Brno-Líšeň",
    situation: "rozvod",
    situationLabel: SITUATION_LABELS.rozvod,
    text: "Po rozvodu jsme se s bývalým manželem nemohli dohodnout, co s bytem. On nechtěl prodávat, já potřebovala peníze na nový začátek. Obracela jsem se na několik realitek, ale nikdo neřešil spoluvlastnický podíl. Tady odkoupili můj podíl rychle a bez zbytečných konfliktů. Komunikace byla vždy diskrétní a profesionální.",
    result:
      "Do 14 dní jsem měla peníze na účtu a mohla si zařídit vlastní bydlení.",
    featured: true,
  },
  {
    id: "t3",
    name: "Jaroslav Černý",
    city: "Ostrava-Poruba",
    situation: "dedictvi",
    situationLabel: SITUATION_LABELS.dedictvi,
    text: "Zdědil jsem po tetě byt v Porubě, ale sám bydlím v Plzni a nemovitost jsem vůbec nepotřeboval. Byt byl ve špatném stavu, třicet let se tam neinvestovalo. Klasický prodej by trval měsíce a musel bych nejdřív opravovat. Ozvali se mi den po vyplnění formuláře, přijeli se podívat a nabídli reálnou cenu i přes ten stav.",
    result:
      "Prodej proběhl za 8 dní včetně přepisu na katastru. Ušetřil jsem si měsíce starostí.",
    featured: true,
  },
  {
    id: "t4",
    name: "Alena Procházková",
    city: "Plzeň",
    situation: "hypoteka",
    situationLabel: SITUATION_LABELS.hypoteka,
    text: "Přišla jsem o práci a přestala jsem zvládat splátky hypotéky. Banka mi dala lhůtu tři měsíce, jinak hrozila nucená dražba. Klasický prodej přes realitku by trval příliš dlouho. Zavolala jsem sem v pátek, v pondělí přijel odhadce, ve středu jsem měla nabídku. Pomohli mi splatit hypotéku přímo z kupní ceny a zbytek mi vyplatili na účet.",
    result:
      "Do 12 dní bylo vše vyřešeno. Hypotéka splacená, žádná dražba, zbytek peněz na účtu.",
    featured: true,
  },
  {
    id: "t5",
    name: "Tomáš Veselý",
    city: "Liberec",
    situation: "spoluvlastnictvi",
    situationLabel: SITUATION_LABELS.spoluvlastnictvi,
    text: "S bratrem jsme zdědili dům v Liberci, ale on žije v Německu a odmítal cokoliv řešit. Roky jsem platil daně a údržbu sám. Právník mi řekl, že můžu prodat svůj podíl i bez bratrova souhlasu. Tady mi vysvětlili celý proces, odkoupili můj podíl a vyřešili i komunikaci s bratrem.",
    result:
      "Celý proces trval 3 týdny. Konečně jsem dostal peníze za svůj podíl a nemusím řešit cizí nemovitost.",
    featured: true,
  },
  {
    id: "t6",
    name: "Ivana Šťastná",
    city: "České Budějovice",
    situation: "stehovani",
    situationLabel: SITUATION_LABELS.stehovani,
    text: "Dostala jsem pracovní nabídku v Rakousku a potřebovala jsem prodat byt v Budějovicích do měsíce. Realitky mi říkaly, že za méně než 3 měsíce to nejde. Tady to zvládli za 9 dní — od první schůzky po peníze na účtu. Veškeré papíry včetně katastru vyřídili za mě, nemusela jsem se vracet ani jednou.",
    result:
      "Prodej za 9 dní, peníze na účtu ještě před mým odletem. Bezstarostný start v zahraničí.",
    featured: true,
  },
  {
    id: "t7",
    name: "František Kučera",
    city: "Hradec Králové",
    situation: "exekuce",
    situationLabel: SITUATION_LABELS.exekuce,
    text: "Kvůli neúspěšnému podnikání mi narostly dluhy a na dům jsem měl dvě exekuce. Bál jsem se, že přijdu o střechu nad hlavou a rodina skončí na ulici. Obrátil jsem se sem jako na poslední možnost. Vysvětlili mi, jak výkup funguje, pomohli s jednáním s exekutory a zajistili, že mi z kupní ceny zbyla částka na pronájem bytu.",
    result:
      "Za 14 dní jsem měl vyřešené dluhy a dost peněz na nový pronájem pro rodinu.",
    featured: false,
  },
  {
    id: "t8",
    name: "Věra Horáková",
    city: "Olomouc",
    situation: "dedictvi",
    situationLabel: SITUATION_LABELS.dedictvi,
    text: "Po mamince jsme zdědili byt v Olomouci — čtyři sourozenci, každý jinde v republice. Nikdo z nás tam nechtěl bydlet, ale dohodnout se na ceně a postupu bylo nemožné. Firma to vyřešila elegantně: ocenili byt, nabídli férovou cenu a peníze rozdělili rovným dílem na čtyři účty.",
    result:
      "Všichni čtyři sourozenci dostali peníze do 2 týdnů. Žádné hádky, čistý stůl.",
    featured: false,
  },
  {
    id: "t9",
    name: "Milan Bartoš",
    city: "Zlín",
    situation: "hypoteka",
    situationLabel: SITUATION_LABELS.hypoteka,
    text: "Dostal jsem se do spirály dluhů — hypotéka, spotřebitelský úvěr, kreditní karty. Měsíční splátky přesahovaly můj příjem. Hrozila insolvence. Rozhodl jsem se prodat byt a začít znovu. Ocenil jsem, že mě nikdo nesoudil — prostě pomohli. Právník vyřídil splacení hypotéky i ostatních závazků přímo z kupní ceny.",
    result:
      "Vše vyřízeno za 11 dní. Bez insolvence, bez stresu, s čistým kontem.",
    featured: false,
  },
  {
    id: "t10",
    name: "Lucie Marková",
    city: "Pardubice",
    situation: "rozvod",
    situationLabel: SITUATION_LABELS.rozvod,
    text: "Rozváděla jsem se a byt byl na moje jméno, ale exmanžel tam stále bydlel a odmítal se odstěhovat. Prodej přes realitku nepřicházel v úvahu, protože nikdo nechtěl kupovat obsazený byt. Obrátila jsem se sem a oni to zvládli — odkoupili byt, zajistili právní řešení a vše proběhlo hladce.",
    result:
      "Prodej za 18 dní. Konečně jsem se zbavila nemovitosti, která mi způsobovala jen problémy.",
    featured: false,
  },
  {
    id: "t11",
    name: "Josef Pospíšil",
    city: "Ústí nad Labem",
    situation: "insolvence",
    situationLabel: SITUATION_LABELS.insolvence,
    text: "Vstoupil jsem do insolvence a správce mi doporučil prodat byt. Neměl jsem čas ani energii řešit běžný prodej. Zavolal jsem sem a do dvou dnů mi přijel odhadce. Nabídka byla férová, celý proces koordinovali s insolvenčním správcem. Nemusel jsem prakticky nic řešit sám.",
    result:
      "Prodej proběhl za 3 týdny, v souladu s insolvencí. Krok k oddlužení bez komplikací.",
    featured: false,
  },
  {
    id: "t12",
    name: "Dana Králová",
    city: "Karlovy Vary",
    situation: "jine",
    situationLabel: SITUATION_LABELS.jine,
    text: "Vlastnila jsem starší činžovní dům v centru Karlových Varů. Údržba mě stála statisíce ročně a nájemníci platili nepravidelně. Chtěla jsem dům prodat, ale jeho stav odrazoval kupce. Tady ho odkoupili i v tom stavu, bez požadavku na opravy. Celý proces proběhl profesionálně od začátku do konce.",
    result:
      "Prodej za 3 týdny. Konečně mám klid a peníze místo nekonečných oprav.",
    featured: false,
  },
  {
    id: "t13",
    name: "Radek Svoboda",
    city: "Jihlava",
    situation: "spoluvlastnictvi",
    situationLabel: SITUATION_LABELS.spoluvlastnictvi,
    text: "Měl jsem třetinový podíl na rodinném domě po dědovi. Sestřenice tam bydlely a nechtěly prodávat ani mě vyplatit. Dva roky jsme se soudili. Pak jsem zjistil, že můžu prodat svůj podíl samostatně. Firma můj podíl odkoupila, vyřídila vše právně čistě a já se konečně zbavil neřešitelné situace.",
    result: "Podíl prodaný za 2 týdny. Po dvou letech sporů konečně vyřešeno.",
    featured: false,
  },
  {
    id: "t14",
    name: "Hana Benešová",
    city: "Znojmo",
    situation: "stehovani",
    situationLabel: SITUATION_LABELS.stehovani,
    text: "Manžel dostal práci v Německu a museli jsme se stěhovat do dvou měsíců. Prodávat dům přes realitku by trvalo půl roku. Navíc jsme na domě měli ještě hypotéku. Zavolala jsem a během prvního hovoru mi vysvětlili, jak to celé bude fungovat. Splacení hypotéky vyřešili z kupní ceny, zbytek nám vyplatili na účet.",
    result:
      "Vše hotovo za 16 dní. Hypotéka splacená, peníze na účtu, mohli jsme odjet s čistou hlavou.",
    featured: false,
  },
];

/** Get featured testimonials for homepage (first 6) */
export function getFeaturedTestimonials(): NarrativeTestimonial[] {
  return NARRATIVE_TESTIMONIALS.filter((t) => t.featured);
}

/** Get all testimonials for /reference page */
export function getAllTestimonials(): NarrativeTestimonial[] {
  return NARRATIVE_TESTIMONIALS;
}

/** Get unique situations covered */
export function getCoveredSituations(): TestimonialSituation[] {
  const situations = new Set(NARRATIVE_TESTIMONIALS.map((t) => t.situation));
  return Array.from(situations);
}
