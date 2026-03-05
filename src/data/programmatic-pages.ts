// VR-162: Programmatic long-tail landing pages — typ nemovitosti × situace

export interface PropertyType {
  key: string;
  slug: string;
  nominative: string;
  genitive: string;
  genitiveFull: string;
  accusative: string;
  icon: string;
}

export interface Situation {
  key: string;
  slug: string;
  locative: string;
  genitive: string;
  nominative: string;
  adjective: string;
}

export const PROPERTY_TYPES: readonly PropertyType[] = [
  {
    key: "byt",
    slug: "bytu",
    nominative: "Byt",
    genitive: "bytu",
    genitiveFull: "bytu",
    accusative: "byt",
    icon: "Building2",
  },
  {
    key: "dum",
    slug: "domu",
    nominative: "Dům",
    genitive: "domu",
    genitiveFull: "rodinného domu",
    accusative: "dům",
    icon: "Home",
  },
  {
    key: "pozemek",
    slug: "pozemku",
    nominative: "Pozemek",
    genitive: "pozemku",
    genitiveFull: "pozemku",
    accusative: "pozemek",
    icon: "LandPlot",
  },
  {
    key: "garaze",
    slug: "garaze",
    nominative: "Garáž",
    genitive: "garáže",
    genitiveFull: "garáže",
    accusative: "garáž",
    icon: "Warehouse",
  },
  {
    key: "komerci",
    slug: "komercni-nemovitosti",
    nominative: "Komerční nemovitost",
    genitive: "komerční nemovitosti",
    genitiveFull: "komerční nemovitosti",
    accusative: "komerční nemovitost",
    icon: "Store",
  },
  {
    key: "chata",
    slug: "chaty",
    nominative: "Chata",
    genitive: "chaty",
    genitiveFull: "chaty nebo chalupy",
    accusative: "chatu",
    icon: "TreePine",
  },
] as const;

export const SITUATIONS: readonly Situation[] = [
  {
    key: "exekuce",
    slug: "pri-exekuci",
    locative: "při exekuci",
    genitive: "exekuce",
    nominative: "exekuce",
    adjective: "exekuční",
  },
  {
    key: "dedictvi",
    slug: "pri-dedictvi",
    locative: "při dědictví",
    genitive: "dědictví",
    nominative: "dědictví",
    adjective: "dědický",
  },
  {
    key: "rozvod",
    slug: "pri-rozvodu",
    locative: "při rozvodu",
    genitive: "rozvodu",
    nominative: "rozvod",
    adjective: "rozvodový",
  },
  {
    key: "hypoteka",
    slug: "s-hypotekou",
    locative: "s hypotékou",
    genitive: "hypotéky",
    nominative: "hypotéka",
    adjective: "hypoteční",
  },
  {
    key: "insolvence",
    slug: "pri-insolvenci",
    locative: "při insolvenci",
    genitive: "insolvence",
    nominative: "insolvence",
    adjective: "insolvenční",
  },
  {
    key: "rychly-prodej",
    slug: "rychly-prodej",
    locative: "— rychlý prodej",
    genitive: "rychlého prodeje",
    nominative: "rychlý prodej",
    adjective: "expresní",
  },
] as const;

export interface ProgrammaticPage {
  slug: string;
  type: PropertyType;
  situation: Situation;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  steps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
  breadcrumbLabel: string;
}

function generateIntro(type: PropertyType, situation: Situation): string {
  const intros: Record<string, Record<string, string>> = {
    exekuce: {
      byt: `Prodej ${type.genitiveFull} zatíženého exekucí je situace, kterou řeší tisíce Čechů ročně. Pokud se nacházíte v tíživé finanční situaci a hrozí vám dražba, nabízíme rychlé a diskrétní řešení. Výkup ${type.genitiveFull} ${situation.locative} provedeme tak, aby byly uhrazeny veškeré pohledávky přímo z kupní ceny. Celý proces zvládneme během 7–14 dnů, bez zbytečné byrokracie a bez provize. Naši právníci komunikují přímo s exekutorským úřadem a zajistí bezpečný převod vlastnictví. Získáte férovou cenu, rychlé vyplacení a zbavíte se dluhového břemene.`,
      dum: `Vlastníte rodinný dům, na kterém leží exekuce? Nezoufejte — existuje legální cesta, jak ${type.accusative} prodat rychle a za férovou cenu, aniž byste čekali na dražbu. Specializujeme se na výkup ${type.genitiveFull} v exekuci a celý proces řešíme od A do Z. Uhradíme exekuční pohledávky z kupní ceny, zajistíme komunikaci s exekutorem a převod dokončíme během 2–4 týdnů. Získáte peníze, vyřešíte dluhy a můžete začít znovu. Bez provize, bez skrytých poplatků, s plnou právní podporou.`,
      pozemek: `Pozemek zatížený exekucí může být komplikací při prodeji přes klasickou realitku. My se ale na tyto situace specializujeme. Výkup ${type.genitiveFull} ${situation.locative} řešíme rychle — od prvního kontaktu po vyplacení to může být i 10 dnů. Exekuční pohledávky uhradíme z kupní ceny, zajistíme právní servis a vy se nemusíte starat o papírování. Nezáleží na tom, zda jde o stavební parcelu, zahradu nebo zemědělský pozemek — připravíme vám nezávaznou nabídku do 24 hodin.`,
      garaze: `Garáž nebo garážové stání v exekuci? I tuto situaci umíme vyřešit. Výkup ${type.genitiveFull} ${situation.locative} provedeme rychle, diskrétně a za férovou cenu. Z kupní ceny uhradíme veškeré exekuční pohledávky, takže se zbavíte dluhového břemene jedním krokem. Celý proces je bez provize a bez skrytých poplatků. Právní servis zajistíme my — vy jen podepíšete smlouvu a obdržíte peníze.`,
      komerci: `Komerční nemovitost zatížená exekucí představuje specifickou výzvu — kupci se bojí rizik a banky nefinancují. My kupujeme za vlastní prostředky a ${situation.adjective} situace nás neodradí. Výkup ${type.genitiveFull} ${situation.locative} řešíme profesionálně s týmem právníků. Pohledávky uhradíme z kupní ceny, převod zvládneme do 3 týdnů. Ať jde o kancelář, obchod nebo sklad — ozvěte se a do 24 hodin máte nabídku.`,
      chata: `Chata nebo chalupa v exekuci? Víme, jak na to. Výkup rekreační nemovitosti ${situation.locative} řešíme i v případech, kdy jiní kupci couvnou. Uhradíme exekuční pohledávky, postaráme se o veškerou administrativu a peníze vám vyplatíme do 7–14 dnů. Celý proces probíhá bez provize, s právním servisem zdarma. Kontaktujte nás — pomůžeme vám situaci vyřešit rychle a bezbolestně.`,
    },
    dedictvi: {
      byt: `Zdědili jste ${type.accusative} a nevíte si rady? Dědické řízení bývá zdlouhavé a komplikované, zvláště pokud je více dědiců. Nabízíme rychlý výkup ${type.genitiveFull} z dědictví — bez čekání na dohodu všech stran. Zajistíme ocenění, právní servis i komunikaci s notářem. Celý proces provedeme diskrétně a rychle, aby se dědictví neprotahovalo zbytečně. Vyplatíme vás do 14 dnů od podpisu smlouvy, bez provize a skrytých poplatků.`,
      dum: `Zděděný rodinný dům může být požehnáním i zátěží — zvláště když se dědicové neshodnou na dalším postupu. Specializujeme se na výkup ${type.genitiveFull} z dědictví a pomáháme situaci vyřešit rychle a férově. Odkoupíme i podíl jednoho dědice, vyplatíme ostatní a postaráme se o veškerou administrativu včetně komunikace s notářem. Cena odpovídá aktuální tržní hodnotě a peníze obdržíte do 14 dnů.`,
      pozemek: `Zdědili jste ${type.accusative} a chcete ho rychle zpeněžit? Ať už jde o stavební parcelu nebo zahradu, nabízíme expresní výkup ${type.genitiveFull} z dědictví. Pomůžeme s oceněním, právním servisem i komunikací s notářem. Pokud se dědicové neshodnou, odkoupíme i jednotlivé podíly. Peníze máte do 14 dnů, bez provize.`,
      garaze: `Garáž z dědictví, o kterou nemáte zájem? Výkup ${type.genitiveFull} ${situation.locative} provedeme rychle a bez komplikací. Zajistíme ocenění, právní servis i koordinaci s notářem. Vyplatíme vás do 14 dnů od podpisu. Bez provize, bez skrytých nákladů.`,
      komerci: `Zdědili jste komerční prostory a nechcete je spravovat? Výkup ${type.genitiveFull} z dědictví je naše specializace. Odkoupíme i podíl od jednoho dědice, vyřešíme administrativu a vyplatíme férovou cenu do 14 dnů. S námi je dědické řízení jednodušší.`,
      chata: `Zděděná chata nebo chalupa, o kterou se nechcete starat? Nabízíme rychlý výkup ${type.genitiveFull} z dědictví. Postaráme se o veškerou administrativu, komunikaci s notářem a ocenění. Vyplatíme vás do 14 dnů. I když je více dědiců — odkoupíme váš podíl a ostatní vyplatíme.`,
    },
    rozvod: {
      byt: `Rozvod je emocionálně náročný a majetkové vypořádání ho dělá ještě složitějším. Pokud se s partnerem neshodnete na osudu společného ${type.genitiveFull}, nabízíme rychlé řešení — výkup ${type.genitiveFull} ${situation.locative}. Odkoupíme nemovitost za tržní cenu, vyplatíme oba partnery a zajistíme veškerý právní servis. Celý proces zvládneme do 14 dnů, diskrétně a bez provize.`,
      dum: `Společný dům ${situation.locative} — to je situace, kterou řešíme často. Pokud se s partnerem nedohodnete, kdo zůstane a kdo odejde, nabízíme rychlý výkup ${type.genitiveFull}. Vyplatíme oba partnery férově, zajistíme právní servis a celý převod provedeme do 2–3 týdnů. Bez soudních sporů, bez provize, bez stresu.`,
      pozemek: `Společný ${type.accusative} ${situation.locative} nemusí být problém. Odkoupíme ${type.accusative} za tržní cenu, vyplatíme oba partnery a zajistíme veškerou administrativu. Rychlý a bezbolestný prodej do 14 dnů. Bez provize, s právním servisem zdarma.`,
      garaze: `I garáž může být předmětem majetkového vypořádání ${situation.locative}. Nabízíme rychlý výkup ${type.genitiveFull} — férová cena, rychlé vyplacení obou stran a nulová provize. Celý proces řešíme diskrétně a profesionálně.`,
      komerci: `Komerční nemovitost ${situation.locative} — specifická situace, kterou ale umíme vyřešit. Odkoupíme ${type.accusative} za tržní cenu, vyplatíme oba partnery a postaráme se o veškerou administrativu. Rychle, férově, bez provize.`,
      chata: `Rekreační nemovitost ${situation.locative} bývá častým předmětem sporu. Nabízíme rychlý výkup ${type.genitiveFull} — vyplatíme oba partnery, zajistíme právní servis a celý převod zvládneme do 14 dnů. Bez provize a bez zbytečného stresu.`,
    },
    hypoteka: {
      byt: `Nesplácíte hypotéku a hrozí vám, že banka zahájí dražbu? Výkup ${type.genitiveFull} ${situation.locative} je rychlejší a výhodnější alternativa. Uhradíme zbytek hypotéky z kupní ceny, doplatíme rozdíl přímo vám a celý proces zvládneme dříve, než banka stihne reagovat. Právní servis je v ceně, provize nulová. Ozvěte se nám a do 24 hodin máte nezávaznou nabídku.`,
      dum: `Hypotéka na rodinný dům, kterou už nezvládáte splácet? Nabízíme výkup ${type.genitiveFull} ${situation.locative} — splatíme úvěr z kupní ceny a zbytek vyplatíme vám. Proces je rychlejší než bankrotová dražba a výhodnější pro vás. Do 14 dnů máte situaci vyřešenou.`,
      pozemek: `Pozemek s nesplacenou hypotékou? Výkup ${type.genitiveFull} ${situation.locative} provedeme rychle — uhradíme zbytek úvěru z kupní ceny a doplatíme vám rozdíl. Bez čekání, bez provize, s právním servisem zdarma.`,
      garaze: `I garáž může být zatížena hypotékou. Nabízíme výkup ${type.genitiveFull} ${situation.locative} — splatíme úvěr a vyplatíme vám rozdíl. Rychle, bez provize, s právní podporou.`,
      komerci: `Komerční nemovitost s hypotékou, kterou nezvládáte splácet? Výkup ${type.genitiveFull} ${situation.locative} je rychlé řešení — uhradíme úvěr z kupní ceny, doplatíme rozdíl vám a celý proces provedeme do 3 týdnů. Bez provize, s plným právním servisem.`,
      chata: `Rekreační nemovitost s hypotékou? Výkup ${type.genitiveFull} ${situation.locative} provedeme rychle a diskrétně. Splatíme úvěr z kupní ceny, vyplatíme vám rozdíl a postaráme se o veškerou administrativu. Bez provize, do 14 dnů.`,
    },
    insolvence: {
      byt: `Nacházíte se v insolvenci a potřebujete prodat ${type.accusative}? Výkup ${type.genitiveFull} ${situation.locative} řešíme ve spolupráci s insolvenčním správcem. Zajistíme ocenění znalcem, získáme souhlas soudu a celý proces provedeme v souladu s insolvenčním zákonem. Výtěžek z prodeje pomůže snížit vaše dluhy a vy se můžete soustředit na nový začátek. Bez provize, s právním servisem v ceně.`,
      dum: `Insolvenční řízení a rodinný dům? Nabízíme výkup ${type.genitiveFull} ${situation.locative} v souladu se zákonem. Spolupracujeme s insolvenčním správcem, zajistíme znalecký posudek a souhlas soudu. Výtěžek jde na úhradu dluhů — vy získáte klid a možnost nového začátku.`,
      pozemek: `Pozemek v insolvenci? Výkup ${type.genitiveFull} ${situation.locative} provedeme v souladu s insolvenčním zákonem. Spolupracujeme se správcem, zajistíme znalecké ocenění a veškerou administrativu. Rychlé a zákonné řešení vaší situace.`,
      garaze: `Garáž v insolvenčním řízení? Odkoupíme ${type.accusative} v souladu se zákonem, ve spolupráci s insolvenčním správcem. Postaráme se o znalecký posudek, souhlas soudu a veškerou administrativu.`,
      komerci: `Komerční nemovitost v insolvenci? Výkup ${type.genitiveFull} ${situation.locative} provádíme ve spolupráci s insolvenčním správcem a v souladu se zákonem. Zajistíme znalecké ocenění, souhlas soudu a rychlý převod. Profesionální přístup bez provize.`,
      chata: `Chata nebo chalupa v insolvenci? Výkup ${type.genitiveFull} ${situation.locative} řešíme zákonnou cestou — spolupracujeme s insolvenčním správcem, zajistíme ocenění i souhlas soudu. Pomůžeme vám situaci vyřešit rychle a správně.`,
    },
    "rychly-prodej": {
      byt: `Potřebujete prodat ${type.accusative} rychle? Ať už kvůli stěhování, finanční nouzi nebo jiným důvodům — nabízíme expresní výkup ${type.genitiveFull} do 7 dnů. Žádné čekání na zájemce, žádné prohlídky s realitkou. Zavoláte, do 24 hodin máte nabídku, do týdne peníze na účtu. Kupujeme za férovou cenu (80–90 % tržní hodnoty), bez provize a s právním servisem v ceně.`,
      dum: `Rychlý prodej rodinného domu nemusí znamenat prodělat. Nabízíme expresní výkup ${type.genitiveFull} za férovou cenu — do 24 hodin nabídka, do 14 dnů peníze. Bez realitky, bez prohlídek, bez provize. Kupujeme domy v jakémkoliv stavu, i s drobnými právními komplikacemi.`,
      pozemek: `Potřebujete rychle zpeněžit ${type.accusative}? Expresní výkup ${type.genitiveFull} provedeme do 7–14 dnů. Bez realitky, bez čekání na kupce, za férovou cenu. Kupujeme stavební parcely, zahrady i zemědělské pozemky.`,
      garaze: `Rychlý prodej garáže? Nabídku máte do 24 hodin, peníze do 7 dnů. Výkup ${type.genitiveFull} provádíme expresně, bez provize a s právním servisem zdarma. Jednoduše a rychle.`,
      komerci: `Potřebujete rychle prodat komerční prostory? Expresní výkup ${type.genitiveFull} je naše specializace. Nabídku máte do 24 hodin, peníze do 3 týdnů. Bez realitky, bez provize, za férovou cenu. Kupujeme kanceláře, obchody, sklady i výrobní prostory.`,
      chata: `Rychlý prodej chaty nebo chalupy? Nabídku máte do 24 hodin, peníze do 14 dnů. Výkup ${type.genitiveFull} provádíme rychle a bez komplikací. Bez realitky, bez provize, v jakémkoliv stavu nemovitosti.`,
    },
  };
  return (
    intros[situation.key]?.[type.key] ??
    `Nabízíme rychlý výkup ${type.genitiveFull} ${situation.locative}. Celý proces řešíme od A do Z — od ocenění přes právní servis až po vyplacení. Bez provize, bez skrytých poplatků. Kontaktujte nás a do 24 hodin máte nezávaznou nabídku.`
  );
}

function generateFaq(
  type: PropertyType,
  situation: Situation,
): { question: string; answer: string }[] {
  // Base questions adapted per combo
  const faqs: { question: string; answer: string }[] = [];

  // Q1: Can I sell?
  const canSellMap: Record<string, string> = {
    exekuce: `Ano, prodej ${type.genitiveFull} v exekuci je možný se souhlasem exekutora. Postaráme se o veškerou komunikaci s exekutorským úřadem a zajistíme hladký průběh.`,
    dedictvi: `Ano, po pravomocném usnesení o dědictví můžete nemovitost prodat. My zajistíme ocenění, právní servis i komunikaci s notářem.`,
    rozvod: `Ano, ${type.accusative} lze prodat v rámci majetkového vypořádání. Vyplatíme oba partnery férově a zajistíme veškerý právní servis.`,
    hypoteka: `Ano, ${type.accusative} s hypotékou lze prodat. Uhradíme zbytek úvěru z kupní ceny a rozdíl vyplatíme vám.`,
    insolvence: `Ano, se souhlasem insolvenčního správce a soudu. Zajistíme znalecký posudek a veškerou administrativu.`,
    "rychly-prodej": `Ano, ${type.accusative} můžete prodat kdykoliv. My zajistíme expresní výkup do 7–14 dnů bez realitky.`,
  };
  faqs.push({
    question: `Mohu prodat ${type.accusative} ${situation.locative}?`,
    answer: canSellMap[situation.key] ?? "",
  });

  // Q2: Price
  faqs.push({
    question: `Kolik za ${type.accusative} ${situation.locative} dostanu?`,
    answer: `Nabízíme 80–90 % tržní hodnoty ${type.genitiveFull}. Ocenění provedeme zdarma a nezávazně do 24 hodin. Neplatíte žádnou provizi ani skryté poplatky.`,
  });

  // Q3: How long
  const timeMap: Record<string, string> = {
    exekuce:
      "Od prvního kontaktu po vyplacení to může být i 7 dnů. Standardně 2–4 týdny včetně vyřízení exekuce a zápisu do katastru.",
    dedictvi:
      "Od podpisu smlouvy do 14 dnů máte peníze na účtu. Celý proces včetně administrativy řešíme za vás.",
    rozvod:
      "Celý proces zvládneme do 14 dnů od podpisu smlouvy. Vyplatíme oba partnery současně.",
    hypoteka:
      "Od kontaktu po vyplacení 2–3 týdny. Záleží na rychlosti spolupráce s bankou.",
    insolvence:
      "Vzhledem k nutnosti soudního souhlasu počítejte s 4–8 týdny. Přípravu ale zahájíme okamžitě.",
    "rychly-prodej":
      "Nabídku máte do 24 hodin, peníze do 7–14 dnů od podpisu smlouvy.",
  };
  faqs.push({
    question: `Jak rychle proběhne výkup ${type.genitiveFull}?`,
    answer:
      timeMap[situation.key] ??
      "Celý proces standardně zvládneme do 2–4 týdnů.",
  });

  // Q4: Commission
  faqs.push({
    question: "Platím provizi nebo skryté poplatky?",
    answer:
      "Ne, naše služby jsou zcela bez provize. Právní servis, ocenění a veškerou administrativu zajistíme na naše náklady.",
  });

  // Q5: situation-specific
  const specificMap: Record<string, { question: string; answer: string }> = {
    exekuce: {
      question: "Co když mám více exekucí na nemovitosti?",
      answer:
        "I v případě více exekucí dokážeme situaci vyřešit. Naši právníci koordinují úhradu všech pohledávek z kupní ceny.",
    },
    dedictvi: {
      question: "Co když se dědicové neshodnou?",
      answer: `Odkoupíme i podíl jednoho dědice. Ostatní dědice vyplatíme z kupní ceny. Nemusíte čekat na dohodu všech stran.`,
    },
    rozvod: {
      question: "Mohu prodat jen svůj podíl?",
      answer:
        "Ano, odkoupíme i spoluvlastnický podíl. Nemusíte čekat na souhlas druhé strany.",
    },
    hypoteka: {
      question: "Co když dlužím víc, než je nemovitost hodnota?",
      answer:
        "I v tomto případě vám pomůžeme najít řešení. Kontaktujte nás pro individuální konzultaci zdarma.",
    },
    insolvence: {
      question: "Kdo schvaluje prodej při insolvenci?",
      answer:
        "Prodej schvaluje insolvenční správce a soud. My zajistíme znalecký posudek a veškerou administrativu potřebnou pro schválení.",
    },
    "rychly-prodej": {
      question: `Kupujete i ${type.accusative} ve špatném stavu?`,
      answer:
        "Ano, kupujeme nemovitosti v jakémkoliv technickém stavu. Stav zohledníme v nabídkové ceně, ale neodmítneme vás.",
    },
  };
  const specific = specificMap[situation.key];
  if (specific) faqs.push(specific);

  return faqs;
}

function generateSteps(
  type: PropertyType,
  situation: Situation,
): { title: string; description: string }[] {
  return [
    {
      title: "1. Kontaktujte nás",
      description: `Zavolejte nebo vyplňte formulář. Do 24 hodin se vám ozveme s předběžnou nabídkou na výkup ${type.genitiveFull} ${situation.locative}.`,
    },
    {
      title: "2. Ocenění nemovitosti",
      description: `Provedeme bezplatné ocenění ${type.genitiveFull} na základě aktuální tržní hodnoty a stavu. Bez závazků.`,
    },
    {
      title: "3. Smlouva a právní servis",
      description:
        "Připravíme kupní smlouvu s plným právním servisem. Vše transparentně a srozumitelně.",
    },
    {
      title: "4. Vyplacení",
      description:
        "Po podpisu smlouvy obdržíte peníze na účet. Rychle, bez provize a bez skrytých poplatků.",
    },
  ];
}

export function generateAllPages(): ProgrammaticPage[] {
  const pages: ProgrammaticPage[] = [];
  for (const type of PROPERTY_TYPES) {
    for (const situation of SITUATIONS) {
      const slug = `vykup-${type.slug}-${situation.slug}`;
      const h1 = `Výkup ${type.genitiveFull} ${situation.locative}`;
      pages.push({
        slug,
        type,
        situation,
        title: `${h1} — rychlé řešení`,
        metaTitle: `Výkup ${type.genitiveFull} ${situation.locative} | Do 24h nabídka | Bez provize`,
        metaDescription: `Potřebujete prodat ${type.accusative} ${situation.locative}? Nabídka do 24 hodin, výplata do 7 dnů, bez provize. Právní servis zdarma. Celá ČR.`,
        h1,
        intro: generateIntro(type, situation),
        steps: generateSteps(type, situation),
        faq: generateFaq(type, situation),
        ctaTitle: `Řešte ${type.accusative} ${situation.locative} ještě dnes`,
        ctaText: `Nezávazná konzultace zdarma. Nabídku na výkup ${type.genitiveFull} ${situation.locative} máte do 24 hodin.`,
        breadcrumbLabel: h1,
      });
    }
  }
  return pages;
}

export const ALL_PROGRAMMATIC_SLUGS = generateAllPages().map((p) => p.slug);

export function getPageBySlug(slug: string): ProgrammaticPage | undefined {
  return generateAllPages().find((p) => p.slug === slug);
}

export function getRelatedPages(
  currentSlug: string,
  limit = 6,
): ProgrammaticPage[] {
  const current = getPageBySlug(currentSlug);
  if (!current) return [];
  const all = generateAllPages().filter((p) => p.slug !== currentSlug);
  const sameSituation = all.filter(
    (p) => p.situation.key === current.situation.key,
  );
  const sameType = all.filter((p) => p.type.key === current.type.key);
  const seen = new Set<string>();
  const result: ProgrammaticPage[] = [];
  for (const p of [...sameSituation, ...sameType]) {
    if (!seen.has(p.slug) && result.length < limit) {
      seen.add(p.slug);
      result.push(p);
    }
  }
  return result;
}
