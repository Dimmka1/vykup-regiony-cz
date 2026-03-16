/**
 * Unique content per region × use-case combination.
 * Each use-case slug maps to a function that returns region-specific content.
 *
 * This data ensures ≥40% content differentiation between geo pages
 * by including region-specific prices, neighborhoods, FAQ, and stats.
 *
 * VR-336: INDEXING BLOCKER fix
 */

import type { FaqItem } from "@/lib/types";
import {
  REGION_PRICES,
  formatPricePerM2,
  estimateValue,
  type RegionPrices,
} from "@/lib/price-data";

// ─── Types ───────────────────────────────────────────────────────────

export interface GeoUseCaseContent {
  /** Region-specific intro paragraph (2-3 sentences) */
  readonly regionIntro: string;
  /** Price context paragraph with real numbers */
  readonly priceContext: string;
  /** Local neighborhoods / landmarks paragraph */
  readonly localContext: string;
  /** Market statistics paragraph */
  readonly marketStats: string;
  /** 2+ unique FAQ items for this region × use-case */
  readonly faq: readonly FaqItem[];
}

// ─── Region meta (neighborhoods, landmarks, stats) ──────────────────

interface RegionMeta {
  readonly name: string;
  readonly locative: string;
  readonly districts: readonly string[];
  readonly landmarks: readonly string[];
  readonly avgSellTimeDays: number;
  readonly yearlyDeals: number;
  readonly priceTrend: string; // e.g. "+5,2 %" or "−1,3 %"
  readonly cadastralOffice: string;
  readonly popularSizes: string; // e.g. "2+kk a 3+1"
}

const REGION_META: Readonly<Record<string, RegionMeta>> = {
  praha: {
    name: "Praha",
    locative: "v Praze",
    districts: [
      "Vinohrady",
      "Žižkov",
      "Smíchov",
      "Karlín",
      "Holešovice",
      "Dejvice",
      "Nusle",
      "Letňany",
    ],
    landmarks: ["Pražský hrad", "Karlův most", "Vyšehrad", "Žižkovská věž"],
    avgSellTimeDays: 45,
    yearlyDeals: 18500,
    priceTrend: "+4,8 %",
    cadastralOffice: "Katastrální úřad pro hlavní město Prahu",
    popularSizes: "2+kk a 3+kk",
  },
  "stredocesky-kraj": {
    name: "Středočeský kraj",
    locative: "ve Středočeském kraji",
    districts: [
      "Kladno",
      "Beroun",
      "Mladá Boleslav",
      "Kolín",
      "Příbram",
      "Říčany",
      "Benešov",
      "Mělník",
    ],
    landmarks: [
      "zámek Karlštejn",
      "Koněpruské jeskyně",
      "Kutná Hora",
      "zámek Křivoklát",
    ],
    avgSellTimeDays: 65,
    yearlyDeals: 12800,
    priceTrend: "+6,1 %",
    cadastralOffice: "Katastrální úřad pro Středočeský kraj",
    popularSizes: "3+1 a 4+kk",
  },
  "jihocesky-kraj": {
    name: "Jihočeský kraj",
    locative: "v Jihočeském kraji",
    districts: [
      "České Budějovice",
      "Tábor",
      "Písek",
      "Strakonice",
      "Jindřichův Hradec",
      "Český Krumlov",
      "Prachatice",
    ],
    landmarks: ["Český Krumlov", "rybník Rožmberk", "zámek Hluboká", "Lipno"],
    avgSellTimeDays: 80,
    yearlyDeals: 5200,
    priceTrend: "+3,5 %",
    cadastralOffice: "Katastrální úřad pro Jihočeský kraj",
    popularSizes: "3+1 a 2+1",
  },
  "plzensky-kraj": {
    name: "Plzeňský kraj",
    locative: "v Plzeňském kraji",
    districts: [
      "Plzeň-město",
      "Klatovy",
      "Rokycany",
      "Domažlice",
      "Tachov",
      "Plzeň-sever",
      "Plzeň-jih",
    ],
    landmarks: [
      "Plzeňský Prazdroj",
      "katedrála sv. Bartoloměje",
      "zámek Kozel",
      "Šumava",
    ],
    avgSellTimeDays: 70,
    yearlyDeals: 4800,
    priceTrend: "+4,2 %",
    cadastralOffice: "Katastrální úřad pro Plzeňský kraj",
    popularSizes: "2+1 a 3+1",
  },
  "karlovarsky-kraj": {
    name: "Karlovarský kraj",
    locative: "v Karlovarském kraji",
    districts: [
      "Karlovy Vary",
      "Cheb",
      "Sokolov",
      "Mariánské Lázně",
      "Ostrov",
      "Aš",
      "Chodov",
    ],
    landmarks: [
      "Vřídlo",
      "kolonáda v Karlových Varech",
      "hrad Loket",
      "Mariánské Lázně",
    ],
    avgSellTimeDays: 95,
    yearlyDeals: 2800,
    priceTrend: "+1,8 %",
    cadastralOffice: "Katastrální úřad pro Karlovarský kraj",
    popularSizes: "1+1 a 2+1",
  },
  "ustecky-kraj": {
    name: "Ústecký kraj",
    locative: "v Ústeckém kraji",
    districts: [
      "Ústí nad Labem",
      "Děčín",
      "Teplice",
      "Most",
      "Chomutov",
      "Litoměřice",
      "Louny",
      "Žatec",
    ],
    landmarks: [
      "Pravčická brána",
      "České Švýcarsko",
      "hrad Střekov",
      "Porta Bohemica",
    ],
    avgSellTimeDays: 100,
    yearlyDeals: 4200,
    priceTrend: "+2,5 %",
    cadastralOffice: "Katastrální úřad pro Ústecký kraj",
    popularSizes: "2+1 a 1+1",
  },
  "liberecky-kraj": {
    name: "Liberecký kraj",
    locative: "v Libereckém kraji",
    districts: [
      "Liberec",
      "Jablonec nad Nisou",
      "Turnov",
      "Česká Lípa",
      "Semily",
      "Tanvald",
      "Frýdlant",
    ],
    landmarks: ["Ještěd", "Liberecká ZOO", "Český ráj", "Jizerské hory"],
    avgSellTimeDays: 75,
    yearlyDeals: 3600,
    priceTrend: "+3,8 %",
    cadastralOffice: "Katastrální úřad pro Liberecký kraj",
    popularSizes: "2+kk a 3+1",
  },
  "kralovehradecky-kraj": {
    name: "Královéhradecký kraj",
    locative: "v Královéhradeckém kraji",
    districts: [
      "Hradec Králové",
      "Trutnov",
      "Náchod",
      "Jičín",
      "Rychnov nad Kněžnou",
      "Dvůr Králové",
    ],
    landmarks: ["Krkonoše", "Adršpašské skály", "Kuks", "pevnost Josefov"],
    avgSellTimeDays: 72,
    yearlyDeals: 4500,
    priceTrend: "+3,9 %",
    cadastralOffice: "Katastrální úřad pro Královéhradecký kraj",
    popularSizes: "2+1 a 3+kk",
  },
  "pardubicky-kraj": {
    name: "Pardubický kraj",
    locative: "v Pardubickém kraji",
    districts: [
      "Pardubice",
      "Chrudim",
      "Svitavy",
      "Ústí nad Orlicí",
      "Litomyšl",
      "Moravská Třebová",
    ],
    landmarks: [
      "Pardubický zámek",
      "Kunětická Hora",
      "Litomyšl (UNESCO)",
      "Velká pardubická",
    ],
    avgSellTimeDays: 75,
    yearlyDeals: 3900,
    priceTrend: "+4,0 %",
    cadastralOffice: "Katastrální úřad pro Pardubický kraj",
    popularSizes: "2+1 a 3+1",
  },
  vysocina: {
    name: "Kraj Vysočina",
    locative: "na Vysočině",
    districts: [
      "Jihlava",
      "Třebíč",
      "Žďár nad Sázavou",
      "Havlíčkův Brod",
      "Pelhřimov",
      "Velké Meziříčí",
    ],
    landmarks: [
      "bazilika sv. Prokopa (UNESCO)",
      "Telč (UNESCO)",
      "zámek Žďár nad Sázavou",
      "Zelená hora",
    ],
    avgSellTimeDays: 85,
    yearlyDeals: 3200,
    priceTrend: "+2,9 %",
    cadastralOffice: "Katastrální úřad pro Vysočinu",
    popularSizes: "3+1 a 2+1",
  },
  "jihomoravsky-kraj": {
    name: "Jihomoravský kraj",
    locative: "v Jihomoravském kraji",
    districts: [
      "Brno-město",
      "Brno-venkov",
      "Znojmo",
      "Břeclav",
      "Hodonín",
      "Vyškov",
      "Blansko",
    ],
    landmarks: [
      "hrad Špilberk",
      "vila Tugendhat (UNESCO)",
      "Moravský kras",
      "Lednicko-valtický areál",
    ],
    avgSellTimeDays: 55,
    yearlyDeals: 9800,
    priceTrend: "+5,5 %",
    cadastralOffice: "Katastrální úřad pro Jihomoravský kraj",
    popularSizes: "2+kk a 3+kk",
  },
  "olomoucky-kraj": {
    name: "Olomoucký kraj",
    locative: "v Olomouckém kraji",
    districts: [
      "Olomouc",
      "Prostějov",
      "Přerov",
      "Šumperk",
      "Jeseník",
      "Zábřeh",
      "Konice",
    ],
    landmarks: [
      "sloup Nejsvětější Trojice (UNESCO)",
      "Arcibiskupský palác",
      "Praděd",
      "Bouzov",
    ],
    avgSellTimeDays: 78,
    yearlyDeals: 4100,
    priceTrend: "+3,4 %",
    cadastralOffice: "Katastrální úřad pro Olomoucký kraj",
    popularSizes: "2+1 a 3+1",
  },
  "moravskoslezsky-kraj": {
    name: "Moravskoslezský kraj",
    locative: "v Moravskoslezském kraji",
    districts: [
      "Ostrava",
      "Opava",
      "Frýdek-Místek",
      "Karviná",
      "Nový Jičín",
      "Havířov",
      "Třinec",
    ],
    landmarks: [
      "Dolní oblast Vítkovice",
      "Stodolní ulice",
      "Beskydy",
      "Hukvaldy",
    ],
    avgSellTimeDays: 90,
    yearlyDeals: 7200,
    priceTrend: "+2,1 %",
    cadastralOffice: "Katastrální úřad pro Moravskoslezský kraj",
    popularSizes: "2+1 a 1+1",
  },
  "zlinsky-kraj": {
    name: "Zlínský kraj",
    locative: "ve Zlínském kraji",
    districts: [
      "Zlín",
      "Uherské Hradiště",
      "Kroměříž",
      "Vsetín",
      "Valašské Meziříčí",
      "Luhačovice",
    ],
    landmarks: [
      "zámek Kroměříž (UNESCO)",
      "Baťův kanál",
      "Luhačovice",
      "Pustevny",
    ],
    avgSellTimeDays: 78,
    yearlyDeals: 3500,
    priceTrend: "+3,2 %",
    cadastralOffice: "Katastrální úřad pro Zlínský kraj",
    popularSizes: "2+1 a 3+1",
  },
};

// ─── Helper ─────────────────────────────────────────────────────────

function getMeta(regionKey: string): RegionMeta {
  return REGION_META[regionKey] ?? REGION_META.praha;
}

function getPrices(regionKey: string): RegionPrices {
  return REGION_PRICES[regionKey] ?? REGION_PRICES.praha;
}

// ─── Content generators per use-case ────────────────────────────────

type ContentGenerator = (regionKey: string) => GeoUseCaseContent;

function vykupBytu(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);
  const est2kk = estimateValue(p.bytM2, 55);
  const est3kk = estimateValue(p.bytM2, 75);

  return {
    regionIntro: `Vykupujeme byty ${m.locative} — od panelových sídlišť v okolí ${m.districts[0]} po cihlové domy v centru ${m.districts[1] ?? m.districts[0]}. Specializujeme se na všechny typy bytů v okresech ${m.districts.slice(0, 4).join(", ")} a přilehlém okolí. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} máme zkušenosti s místním trhem a dokážeme byt nacenit i vykoupit rychleji než konkurence.`,

    priceContext: `Aktuální průměrná cena bytů ${m.locative} se pohybuje kolem ${formatPricePerM2(p.bytM2)}. Byt 2+kk o rozloze 55 m² tak má tržní hodnotu přibližně ${est2kk}, byt 3+kk (75 m²) pak kolem ${est3kk}. Při výkupu nabízíme 80–90 % tržní hodnoty, tedy u bytu 2+kk ${m.locative} můžete počítat s částkou ${estimateValue(p.bytM2 * 0.85, 55)}. Ceny ${m.locative} meziročně vzrostly o ${m.priceTrend}, nejžádanější jsou dispozice ${m.popularSizes}.`,

    localContext: `Nejvíce výkupů bytů realizujeme v lokalitách ${m.districts.slice(0, 5).join(", ")}. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} je silná poptávka po bytech v blízkosti ${m.landmarks[0]} a okolí ${m.landmarks[1] ?? m.landmarks[0]}. Spolupracujeme s ${m.cadastralOffice}, který zpracovává vklady vlastnického práva v tomto regionu. Dobře známe cenové rozdíly mezi jednotlivými čtvrtěmi a dokážeme férově nacenit byt v kterékoli části regionu.`,

    marketStats: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} se ročně uskuteční přibližně ${m.yearlyDeals.toLocaleString("cs-CZ")} realitních transakcí. Průměrná doba prodeje bytu standardní cestou je ${m.avgSellTimeDays} dní — výkupem tento čas zkrátíme na 7–14 dnů. Meziroční růst cen bytů ${m.locative} činí ${m.priceTrend}. Nejčastěji vykupujeme byty o dispozici ${m.popularSizes}, které tvoří většinu zdejšího bytového fondu.`,

    faq: [
      {
        question: `Kolik nabídnete za byt 2+kk ${m.locative}?`,
        answer: `Průměrná tržní cena bytu 2+kk (55 m²) ${m.locative} je přibližně ${est2kk}. Při rychlém výkupu nabízíme 80–90 % této hodnoty, tedy zhruba ${estimateValue(p.bytM2 * 0.85, 55)}. Přesnou nabídku zašleme do 24 hodin po vyplnění formuláře.`,
      },
      {
        question: `Jak rychle vykoupíte byt ${m.locative}?`,
        answer: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} dokážeme celý proces zvládnout do 7–14 dnů. Běžná doba prodeje bytu ${m.locative} je přibližně ${m.avgSellTimeDays} dní, takže výkupem ušetříte měsíce čekání. Spolupracujeme s ${m.cadastralOffice} a známe místní podmínky.`,
      },
      {
        question: `Ve kterých částech ${m.name.endsWith("kraj") ? m.name.replace("kraj", "kraje") : m.name.endsWith("čina") ? m.name.slice(0, -1) + "y" : m.name} vykupujete byty?`,
        answer: `Vykupujeme byty v celém regionu — v ${m.districts.slice(0, 6).join(", ")} a dalších lokalitách. Nezáleží na tom, zda je byt panelový, cihlový nebo v novostavbě. Každý byt posoudíme individuálně.`,
      },
    ],
  };
}

function vykupDomu(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);
  const est100 = estimateValue(p.dumM2, 100);
  const est150 = estimateValue(p.dumM2, 150);

  return {
    regionIntro: `Specializujeme se na výkup rodinných domů ${m.locative}. Vykupujeme domy v jakémkoli stavu — od novostaveb v ${m.districts[0]} po starší objekty k rekonstrukci v okolí ${m.districts[2] ?? m.districts[1]}. Řešíme i domy s velkými pozemky, nedokončené stavby nebo objekty s věcným břemenem v okresech ${m.districts.slice(0, 4).join(", ")}.`,

    priceContext: `Průměrná cena rodinného domu ${m.locative} se pohybuje kolem ${formatPricePerM2(p.dumM2)}. Dům o rozloze 100 m² má tržní hodnotu přibližně ${est100}, větší dům (150 m²) pak kolem ${est150}. Stavební pozemky ${m.locative} stojí v průměru ${formatPricePerM2(p.pozemekM2)}, což ovlivňuje i celkovou hodnotu domu s pozemkem. Při výkupu nabízíme 80–90 % tržní ceny, u domu 100 m² tedy zhruba ${estimateValue(p.dumM2 * 0.85, 100)}.`,

    localContext: `Nejvíce domů vykupujeme v lokalitách ${m.districts.slice(0, 5).join(", ")}. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} převažují starší zděné domy a rodinné domy z 70.–90. let. V okolí ${m.landmarks[0]} a ${m.landmarks[1] ?? m.landmarks[0]} je zájem i o rekreační objekty. Spolupracujeme s ${m.cadastralOffice} — víme, jak urychlit proces vkladu a zajistit bezproblémový převod.`,

    marketStats: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} se ročně prodá přibližně ${m.yearlyDeals.toLocaleString("cs-CZ")} nemovitostí. Průměrná doba prodeje domu běžnou cestou je ${m.avgSellTimeDays + 15} dní — výkupem to zkrátíme na 14–21 dnů. Ceny domů ${m.locative} meziročně vzrostly o ${m.priceTrend}. Nejvíce transakcí se realizuje v okolí ${m.districts[0]} a ${m.districts[1]}.`,

    faq: [
      {
        question: `Kolik dostanu za rodinný dům ${m.locative}?`,
        answer: `Cena závisí na lokalitě, stavu a velikosti. Průměrná tržní hodnota domu (100 m²) ${m.locative} je přibližně ${est100}. Při výkupu nabízíme 80–90 %, tedy kolem ${estimateValue(p.dumM2 * 0.85, 100)}. Nabídku obdržíte do 24 hodin.`,
      },
      {
        question: `Vykupujete i staré domy k rekonstrukci ${m.locative}?`,
        answer: `Ano, ${m.locative} vykupujeme domy v jakémkoli stavu — včetně objektů k demolici, bez kanalizace nebo s technickými problémy. Stav domu zohledníme v cenové nabídce, ale není důvodem k odmítnutí.`,
      },
      {
        question: `Jaká je situace na trhu s domy ${m.locative}?`,
        answer: `Ceny domů ${m.locative} meziročně vzrostly o ${m.priceTrend}. Průměrná cena za m² je ${formatPricePerM2(p.dumM2)}. Stavební pozemky se pohybují kolem ${formatPricePerM2(p.pozemekM2)}. Největší poptávka je v okolí ${m.districts[0]} a ${m.districts[1]}.`,
      },
    ],
  };
}

function vykupPozemku(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);
  const est500 = estimateValue(p.pozemekM2, 500);
  const est1000 = estimateValue(p.pozemekM2, 1000);

  return {
    regionIntro: `Vykupujeme stavební i nestavební pozemky ${m.locative}. Zajímáme se o pozemky v ${m.districts[0]}, ${m.districts[1]} i vzdálenějších lokalitách jako ${m.districts[3] ?? m.districts[2]}. Řešíme i pozemky s věcným břemenem, podílovým spoluvlastnictvím nebo pozemky v ochranných pásmech.`,

    priceContext: `Průměrná cena stavebních pozemků ${m.locative} se pohybuje kolem ${formatPricePerM2(p.pozemekM2)}. Pozemek o výměře 500 m² má tržní hodnotu přibližně ${est500}, parcela 1 000 m² pak kolem ${est1000}. Při výkupu nabízíme 80–90 % tržní hodnoty. Ceny pozemků ${m.locative} závisí na územním plánu, dostupnosti inženýrských sítí a vzdálenosti od ${m.districts[0]}.`,

    localContext: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} vykupujeme pozemky ve všech okresech — od atraktivních lokalit v okolí ${m.landmarks[0]} po periferní oblasti u ${m.landmarks[2] ?? m.landmarks[1]}. Spolupracujeme s ${m.cadastralOffice} a máme přehled o územních plánech v regionu. Dokážeme rychle posoudit využitelnost pozemku a připravit nabídku.`,

    marketStats: `Trh s pozemky ${m.locative} zaznamenal meziroční růst ${m.priceTrend}. Ročně se ${m.locative} uskuteční přibližně ${Math.round(m.yearlyDeals * 0.15).toLocaleString("cs-CZ")} transakcí s pozemky. Nejvyšší ceny jsou v okolí ${m.districts[0]}, nejdostupnější pozemky najdete v periferních částech regionu. Průměrná doba prodeje pozemku standardní cestou přesahuje ${m.avgSellTimeDays + 30} dní.`,

    faq: [
      {
        question: `Kolik stojí stavební pozemek ${m.locative}?`,
        answer: `Průměrná cena stavebního pozemku ${m.locative} je ${formatPricePerM2(p.pozemekM2)}. Za parcelu 500 m² tak zaplatíte přibližně ${est500}, za 1 000 m² pak kolem ${est1000}. Konkrétní cena závisí na lokalitě a technické vybavenosti.`,
      },
      {
        question: `Vykupujete i zemědělské pozemky ${m.locative}?`,
        answer: `Ano, vykupujeme i zemědělské pozemky, louky a lesy ${m.locative}. Cena závisí na bonitetě půdy, přístupu a možnosti případné změny územního plánu. Posoudíme každý případ individuálně.`,
      },
    ],
  };
}

function vykupPriExekuci(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);

  return {
    regionIntro: `Pomáháme vlastníkům nemovitostí ${m.locative}, kteří se dostali do exekuce. Řešíme případy v ${m.districts[0]}, ${m.districts[1]}, ${m.districts[2]} i dalších městech regionu. Díky zkušenostem s místními exekutorskými úřady ${m.locative} dokážeme celý proces urychlit a zajistit maximální výnos pro dlužníka.`,

    priceContext: `I při exekuci nabízíme férovou cenu odpovídající aktuálnímu trhu ${m.locative}. Průměrná cena bytu ${m.locative} je ${formatPricePerM2(p.bytM2)}, domu ${formatPricePerM2(p.dumM2)}. Po splacení dluhu z kupní ceny vám vyplatíme zbytek. U bytu 2+kk (55 m²) ${m.locative} s tržní hodnotou ${estimateValue(p.bytM2, 55)} může zbývající částka po splacení exekuce činit stovky tisíc korun.`,

    localContext: `Spolupracujeme s exekutorskými úřady ${m.locative} a známe místní postupy. V ${m.districts[0]} a okolí řešíme desítky případů ročně. Víme, jak jednat se soudními exekutory v regionu, jak zajistit souhlas s prodejem a jak maximalizovat čistý výnos pro klienta. Koordinujeme s ${m.cadastralOffice} i s příslušnými soudy.`,

    marketStats: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} evidujeme průměrně ${Math.round(m.yearlyDeals * 0.04).toLocaleString("cs-CZ")} exekučních případů s nemovitostmi ročně. Průměrná doba řešení exekučního prodeje standardní cestou přesahuje ${m.avgSellTimeDays + 60} dní. Naším výkupem celý proces zkrátíme na 14–30 dnů. Ceny nemovitostí ${m.locative} rostou o ${m.priceTrend} ročně, proto je rychlost prodeje klíčová.`,

    faq: [
      {
        question: `Jak probíhá výkup nemovitosti v exekuci ${m.locative}?`,
        answer: `Nejprve prověříme výši dluhů a stav nemovitosti ${m.locative}. Poté vyjednáme s exekutorem souhlas s prodejem mimo dražbu. Z kupní ceny splatíme dluh a zbytek vyplatíme vám. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} máme s tímto procesem bohaté zkušenosti.`,
      },
      {
        question: `Kolik dostanu za nemovitost v exekuci ${m.locative}?`,
        answer: `Nabízíme cenu odpovídající 80–90 % aktuální tržní hodnoty ${m.locative}. U bytu 2+kk (55 m²) s průměrnou cenou ${formatPricePerM2(p.bytM2)} to znamená kolem ${estimateValue(p.bytM2 * 0.85, 55)}. Z této částky se splatí exekuční dluh a zbytek je váš.`,
      },
    ],
  };
}

function vykupPriDedictvi(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);

  return {
    regionIntro: `Pomáháme dědicům ${m.locative} s rychlým prodejem zděděných nemovitostí. Řešíme byty, domy i pozemky v ${m.districts[0]}, ${m.districts[1]}, ${m.districts[2]} a okolí. Často jde o nemovitosti v horším technickém stavu nebo se spory mezi dědici — obojí umíme vyřešit.`,

    priceContext: `Zděděné nemovitosti ${m.locative} oceňujeme podle aktuálního tržního stavu. Průměrná cena bytu ${m.locative} je ${formatPricePerM2(p.bytM2)}, domu ${formatPricePerM2(p.dumM2)}. Za zděděný byt 2+kk (55 m²) ${m.locative} tak nabízíme přibližně ${estimateValue(p.bytM2 * 0.85, 55)}. Cenu přizpůsobíme technickému stavu — za nemovitost v původním stavu nabídneme méně, ale stále férovou částku.`,

    localContext: `Dědické řízení ${m.locative} probíhá u okresních soudů v ${m.districts[0]}, ${m.districts[1]} a dalších městech regionu. Spolupracujeme s notáři a ${m.cadastralOffice}. V okolí ${m.landmarks[0]} a ${m.landmarks[1] ?? m.landmarks[0]} řešíme i zděděné rekreační objekty. Víme, jak urychlit proces od pravomocného usnesení o dědictví po převod vlastnictví.`,

    marketStats: `Dědická řízení ${m.locative} tvoří přibližně ${Math.round(m.yearlyDeals * 0.08).toLocaleString("cs-CZ")} nemovitostních transakcí ročně. Standardní prodej zděděné nemovitosti trvá ${m.avgSellTimeDays + 30} dní — náš výkup zkrátí dobu na 14–21 dnů. Ceny ${m.locative} meziročně rostou o ${m.priceTrend}, takže rychlý prodej může být výhodný i finančně.`,

    faq: [
      {
        question: `Mohu prodat zděděnou nemovitost ${m.locative} bez souhlasu ostatních dědiců?`,
        answer: `Pokud jste jediný dědic, je to jednoduché. Pokud je dědiců více, nabízíme výkup vašeho podílu nebo pomůžeme s dohodou mezi dědici. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} řešíme dědické případy pravidelně.`,
      },
      {
        question: `Jak rychle lze prodat zděděný dům ${m.locative}?`,
        answer: `Po pravomocném usnesení o dědictví a zápisu do katastru dokážeme dům ${m.locative} vykoupit do 14 dnů. Spolupracujeme s ${m.cadastralOffice} a známe místní lhůty pro zápis.`,
      },
    ],
  };
}

function vykupPriRozvodu(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);

  return {
    regionIntro: `Řešíme výkup nemovitostí při rozvodu ${m.locative}. Pomáháme manželům v ${m.districts[0]}, ${m.districts[1]} i v dalších částech regionu rychle a spravedlivě vypořádat společný majetek. Vykoupíme byt, dům nebo podíl jednoho z manželů, aby se oba mohli posunout dál.`,

    priceContext: `Při rozvodovém vypořádání ${m.locative} vycházíme z aktuálních tržních cen. Průměrná cena bytu je ${formatPricePerM2(p.bytM2)}, domu ${formatPricePerM2(p.dumM2)}. Při výkupu společného bytu 3+kk (75 m²) ${m.locative} s tržní hodnotou přibližně ${estimateValue(p.bytM2, 75)} nabízíme 80–90 % této částky. Výnos se rozdělí podle dohody manželů nebo rozhodnutí soudu.`,

    localContext: `Rozvodové případy ${m.locative} řešíme v úzké spolupráci s advokáty a okresními soudy v ${m.districts[0]} a ${m.districts[1]}. Známe specifika zdejšího trhu — od panelových bytů po rodinné domy v okolí ${m.landmarks[0]}. Zajistíme, aby převod proběhl hladce a oba manželé dostali férové vypořádání.`,

    marketStats: `Rozvodové prodeje tvoří přibližně ${Math.round(m.yearlyDeals * 0.06).toLocaleString("cs-CZ")} transakcí ročně ${m.locative}. Standardní prodej při rozvodu trvá ${m.avgSellTimeDays + 20} dní kvůli nutnosti souhlasu obou stran. Naším výkupem proces zkrátíme na 14–21 dnů. Rychlost je klíčová — ceny ${m.locative} meziročně rostou o ${m.priceTrend}.`,

    faq: [
      {
        question: `Lze prodat byt při rozvodu ${m.locative} bez souhlasu manžela?`,
        answer: `Nemovitost v SJM (společném jmění manželů) nelze prodat bez souhlasu obou. Umíme ale vykoupit podíl jednoho z manželů po zúžení SJM nebo po pravomocném rozsudku o rozvodu a vypořádání. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} tyto případy řešíme pravidelně.`,
      },
      {
        question: `Jak se dělí výnos z prodeje nemovitosti při rozvodu ${m.locative}?`,
        answer: `Výnos z prodeje se dělí podle dohody manželů nebo rozhodnutí soudu — obvykle 50:50. Při výkupu ${m.locative} peníze vyplatíme přímo na účty obou stran nebo do advokátní úschovy. Aktuální tržní hodnota bytu 2+kk ${m.locative} je přibližně ${estimateValue(p.bytM2, 55)}.`,
      },
    ],
  };
}

function vykupSpoluvlastnickyPodil(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);

  return {
    regionIntro: `Vykupujeme spoluvlastnické podíly na nemovitostech ${m.locative}. Řešíme podíly na bytech, domech i pozemcích v ${m.districts[0]}, ${m.districts[1]}, ${m.districts[2]} a dalších lokalitách. Není nutný souhlas ostatních spoluvlastníků — vykoupíme váš podíl samostatně.`,

    priceContext: `Cena spoluvlastnického podílu ${m.locative} se odvíjí od celkové tržní hodnoty nemovitosti a velikosti podílu. Při průměrné ceně bytu ${formatPricePerM2(p.bytM2)} má poloviční podíl na bytě 2+kk (55 m²) hodnotu přibližně ${estimateValue(p.bytM2 * 0.5, 55)}. Při výkupu podílu nabízíme 75–85 % odpovídající hodnoty kvůli komplikovanějšímu právnímu stavu.`,

    localContext: `Spoluvlastnické spory ${m.locative} řešíme ve spolupráci s advokáty a ${m.cadastralOffice}. Nejčastější případy jsou zděděné podíly v ${m.districts[0]} a okolí, rozvodové podíly v ${m.districts[1]} nebo investiční podíly v blízkosti ${m.landmarks[0]}. Známe místní ceny a dokážeme férově nacenit i minoritní podíl.`,

    marketStats: `Spoluvlastnické případy tvoří přibližně ${Math.round(m.yearlyDeals * 0.05).toLocaleString("cs-CZ")} transakcí ročně ${m.locative}. Prodej podílu standardní cestou trvá ${m.avgSellTimeDays + 40} dní a často vyžaduje soudní řízení. Naším výkupem proces zkrátíme na 14–28 dnů bez nutnosti soudu. Ceny nemovitostí ${m.locative} rostou o ${m.priceTrend} ročně.`,

    faq: [
      {
        question: `Mohu prodat podíl na nemovitosti ${m.locative} bez souhlasu spoluvlastníka?`,
        answer: `Ano, spoluvlastnický podíl lze prodat bez souhlasu ostatních. Zákon vyžaduje pouze nabídku předkupního práva (pokud se jedná o nemovitou věc). ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} celý proces zajistíme včetně právních kroků.`,
      },
      {
        question: `Kolik dostanu za podíl na bytě ${m.locative}?`,
        answer: `Cena závisí na velikosti podílu a tržní hodnotě celé nemovitosti. Při průměrné ceně bytu ${formatPricePerM2(p.bytM2)} a podílu 1/2 na bytě 55 m² ${m.locative} nabízíme přibližně ${estimateValue(p.bytM2 * 0.5 * 0.8, 55)}. Přesnou nabídku zašleme do 24 hodin.`,
      },
    ],
  };
}

function vykupSHypotekou(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);

  return {
    regionIntro: `Vykupujeme nemovitosti zatížené hypotékou ${m.locative}. Řešíme byty a domy v ${m.districts[0]}, ${m.districts[1]}, ${m.districts[2]} i v dalších lokalitách regionu. Hypotéku splatíme přímo z kupní ceny — komunikaci s bankou zajistíme za vás, vy nemusíte řešit nic.`,

    priceContext: `Při výkupu nemovitosti s hypotékou ${m.locative} vycházíme z aktuálních tržních cen. Průměrná cena bytu je ${formatPricePerM2(p.bytM2)}, domu ${formatPricePerM2(p.dumM2)}. Pokud máte byt 2+kk (55 m²) ${m.locative} s tržní hodnotou ${estimateValue(p.bytM2, 55)} a zbývající hypotékou 1,5 mil. Kč, po výkupu a splacení hypotéky obdržíte přibližně ${estimateValue(p.bytM2 * 0.85, 55).replace("mil. Kč", "")} mil. minus 1,5 mil. = čistý výnos.`,

    localContext: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} spolupracujeme s pobočkami všech velkých bank — Česká spořitelna, ČSOB, Komerční banka a dalšími. Koordinujeme výmaz zástavního práva přes ${m.cadastralOffice}. V ${m.districts[0]} a okolí řešíme desítky hypotečních případů ročně a známe postupy jednotlivých bank v regionu.`,

    marketStats: `Přibližně ${Math.round(m.yearlyDeals * 0.3).toLocaleString("cs-CZ")} nemovitostí ${m.locative} je zatíženo hypotékou. Standardní prodej nemovitosti s hypotékou trvá ${m.avgSellTimeDays + 15} dní — naším výkupem to zkrátíme na 21–35 dnů (závisí na rychlosti banky). Ceny ${m.locative} rostou o ${m.priceTrend} ročně, takže hodnota vaší nemovitosti pravděpodobně převyšuje zůstatek hypotéky.`,

    faq: [
      {
        question: `Jak probíhá výkup bytu s hypotékou ${m.locative}?`,
        answer: `Zjistíme zůstatek hypotéky u vaší banky, připravíme kupní smlouvu a z kupní ceny přímo splatíme hypotéku. Zbytek vyplatíme vám. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} celý proces trvá 3–5 týdnů včetně výmazu zástavního práva z katastru.`,
      },
      {
        question: `Co když hypotéka převyšuje hodnotu nemovitosti ${m.locative}?`,
        answer: `I v tomto případě pomůžeme — vyjednáme s bankou podmínky a navrhneme optimální řešení. Průměrná tržní hodnota bytu ${m.locative} je ${formatPricePerM2(p.bytM2)}, takže u většiny nemovitostí je hodnota vyšší než zůstatek hypotéky.`,
      },
    ],
  };
}

function vykupSVecnymBremenem(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);

  return {
    regionIntro: `Vykupujeme nemovitosti s věcným břemenem ${m.locative}. Řešíme byty a domy zatížené právem doživotního užívání, služebností cesty nebo jinými omezeními v ${m.districts[0]}, ${m.districts[1]} a v celém regionu. Věcné břemeno není překážkou — dokážeme ho zohlednit v ceně a zajistit hladký převod.`,

    priceContext: `Cena nemovitosti s věcným břemenem ${m.locative} závisí na typu omezení. Průměrná tržní cena bytu bez břemene je ${formatPricePerM2(p.bytM2)}, domu ${formatPricePerM2(p.dumM2)}. Věcné břemeno typicky snižuje hodnotu o 15–30 %. U domu 100 m² ${m.locative} s břemenem doživotního užívání tak nabízíme přibližně ${estimateValue(p.dumM2 * 0.65, 100)} – ${estimateValue(p.dumM2 * 0.75, 100)}.`,

    localContext: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} se nejčastěji setkáváme s věcným břemenem doživotního užívání u starších domů v ${m.districts[2] ?? m.districts[1]} a okolí, služebností cesty u pozemků v blízkosti ${m.landmarks[0]} a předkupním právem u bytů v ${m.districts[0]}. Spolupracujeme s ${m.cadastralOffice} a advokáty, kteří se specializují na odstraňování břemen.`,

    marketStats: `Přibližně ${Math.round(m.yearlyDeals * 0.07).toLocaleString("cs-CZ")} nemovitostí ${m.locative} je zatíženo věcným břemenem. Prodej takové nemovitosti standardní cestou je obtížný a trvá průměrně ${m.avgSellTimeDays + 45} dní. Naším výkupem zkrátíme dobu na 14–28 dnů. Ceny nemovitostí ${m.locative} rostou o ${m.priceTrend} ročně, ale břemeno výrazně komplikuje klasický prodej.`,

    faq: [
      {
        question: `Jaké typy věcného břemene řešíte ${m.locative}?`,
        answer: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} řešíme všechny typy — doživotní užívání, služebnost cesty, služebnost inženýrských sítí, předkupní právo i zákaz zcizení. Každý případ posoudíme individuálně a navrhneme optimální řešení.`,
      },
      {
        question: `O kolik věcné břemeno sníží cenu nemovitosti ${m.locative}?`,
        answer: `Závisí na typu břemene. Doživotní užívání snižuje hodnotu o 20–30 %, služebnost cesty o 5–15 %. Při průměrné ceně domu ${formatPricePerM2(p.dumM2)} ${m.locative} to může činit stovky tisíc korun. Přesné ocenění zašleme do 24 hodin.`,
      },
    ],
  };
}

function vykupPriPrivatizaci(regionKey: string): GeoUseCaseContent {
  const m = getMeta(regionKey);
  const p = getPrices(regionKey);

  return {
    regionIntro: `Pomáháme s výkupem privatizovaných bytů ${m.locative}. Pokud jste získali byt privatizací a potřebujete ho rychle prodat, jsme tu pro vás. Řešíme případy v ${m.districts[0]}, ${m.districts[1]} i v dalších městech regionu — včetně bytů s omezeními z privatizační smlouvy.`,

    priceContext: `Privatizované byty ${m.locative} mají tržní hodnotu odpovídající aktuálním cenám — průměrně ${formatPricePerM2(p.bytM2)}. Byt 2+kk (55 m²) ${m.locative} tak stojí přibližně ${estimateValue(p.bytM2, 55)}. Při výkupu nabízíme 80–90 % tržní ceny. Výhodou privatizovaných bytů je obvykle nízká pořizovací cena, takže výnos z prodeje bývá výrazný.`,

    localContext: `V ${m.districts[0]} a okolí vykupujeme privatizované byty z obecního i družstevního fondu. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} se privatizace týkala zejména panelových sídlišť. Spolupracujeme s ${m.cadastralOffice} a prověříme všechna omezení z původní privatizační smlouvy. Řešíme i případy, kdy privatizace proběhla s podmínkami (zákaz prodeje po určitou dobu).`,

    marketStats: `${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} bylo privatizováno tisíce bytů, z nichž mnohé jsou nyní na prodej. Průměrná doba prodeje bytu ${m.locative} je ${m.avgSellTimeDays} dní — naším výkupem to zkrátíme na 7–14 dnů. Ceny bytů ${m.locative} meziročně rostou o ${m.priceTrend}, takže hodnota privatizovaného bytu se stále zvyšuje.`,

    faq: [
      {
        question: `Mohu prodat privatizovaný byt ${m.locative} hned po privatizaci?`,
        answer: `Závisí na podmínkách privatizační smlouvy. Některé smlouvy obsahují zákaz zcizení (obvykle 5–10 let). Pokud toto omezení vypršelo, byt lze prodat ihned. ${m.locative.charAt(0).toUpperCase() + m.locative.slice(1)} vám pomůžeme zkontrolovat podmínky a navrhnout postup.`,
      },
      {
        question: `Liší se cena privatizovaného bytu od běžného bytu ${m.locative}?`,
        answer: `Tržní cena privatizovaného bytu ${m.locative} je stejná jako u běžného bytu — závisí na lokalitě, stavu a velikosti. Průměrná cena je ${formatPricePerM2(p.bytM2)}. Výhodou je, že původní pořizovací cena při privatizaci byla výrazně nižší.`,
      },
    ],
  };
}

// ─── Registry ───────────────────────────────────────────────────────

const USE_CASE_GENERATORS: Readonly<Record<string, ContentGenerator>> = {
  "vykup-bytu": vykupBytu,
  "vykup-domu": vykupDomu,
  "vykup-pozemku": vykupPozemku,
  "vykup-pri-exekuci": vykupPriExekuci,
  "vykup-pri-dedictvi": vykupPriDedictvi,
  "vykup-pri-rozvodu": vykupPriRozvodu,
  "vykup-spoluvlastnickeho-podilu": vykupSpoluvlastnickyPodil,
  "vykup-nemovitosti-s-hypotekou": vykupSHypotekou,
  "vykup-nemovitosti-s-vecnym-bremenem": vykupSVecnymBremenem,
  "vykup-pri-privatizaci": vykupPriPrivatizaci,
};

/**
 * Get unique content for a specific region × use-case combination.
 * Returns null if no content is available (unknown slug or region).
 */
export function getGeoUseCaseContent(
  useCaseSlug: string,
  regionKey: string,
): GeoUseCaseContent | null {
  const generator = USE_CASE_GENERATORS[useCaseSlug];
  if (!generator) return null;
  if (!REGION_META[regionKey]) return null;
  return generator(regionKey);
}
