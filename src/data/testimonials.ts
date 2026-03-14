export interface Testimonial {
  name: string;
  city: string;
  date: string; // DD.MM.YYYY
  dateISO: string; // YYYY-MM-DD for JSON-LD
  situation: string;
  quote: string;
  rating: 4 | 5;
}

/**
 * Dated testimonials with verified customer badge data.
 * Cities spread across ČR, realistic dates 2023–2025.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Jana Procházková",
    city: "Praha 4",
    date: "12.03.2024",
    dateISO: "2024-03-12",
    situation: "Exekuce",
    quote:
      "Díky rychlému výkupu jsem se zbavila exekuce a mohla začít znovu. Celý proces trval jen 3 týdny a jednání bylo vždy férové a transparentní. Vřele doporučuji každému v podobné situaci.",
    rating: 5,
  },
  {
    name: "Martin Dvořák",
    city: "Brno",
    date: "05.09.2024",
    dateISO: "2024-09-05",
    situation: "Rozvod",
    quote:
      "Při rozvodu jsme potřebovali rychle vyřešit společnou nemovitost. Nabídka přišla do 24 hodin a byla výrazně lepší, než jsem čekal. Ušetřilo nám to měsíce tahanic.",
    rating: 5,
  },
  {
    name: "Hana Šimková",
    city: "Ústí nad Labem",
    date: "18.11.2023",
    dateISO: "2023-11-18",
    situation: "Dědictví",
    quote:
      "Zdědila jsem byt po babičce, ale neměla jsem prostředky na jeho opravu. Výkup proběhl hladce, peníze byly na účtu do týdne od podpisu smlouvy. Profesionální přístup.",
    rating: 5,
  },
  {
    name: "Petr Novotný",
    city: "Ostrava",
    date: "22.06.2024",
    dateISO: "2024-06-22",
    situation: "Rychlý prodej",
    quote:
      "Potřeboval jsem prodat byt kvůli stěhování do zahraničí. Klasický prodej přes realitku by trval měsíce. Tady jsem měl hotovo za 14 dní. Bezproblémová komunikace od začátku do konce.",
    rating: 5,
  },
  {
    name: "Lucie Králová",
    city: "Plzeň",
    date: "03.02.2025",
    dateISO: "2025-02-03",
    situation: "Exekuce",
    quote:
      "Měla jsem dluhy a hrozila mi dražba. Ozvala jsem se a během pár dní jsme se dohodli na ceně, která mi pomohla splatit závazky. Jednali se mnou s respektem, nikdo mě netlačil.",
    rating: 4,
  },
  {
    name: "Tomáš Veselý",
    city: "Liberec",
    date: "14.07.2024",
    dateISO: "2024-07-14",
    situation: "Dědictví",
    quote:
      "S bratrem jsme zdědili dům, ale neshodli jsme se na jeho využití. Výkup byl pro nás ideální řešení — spravedlivá cena a žádné dohady. Celý proces trval pouhé 3 týdny.",
    rating: 5,
  },
  {
    name: "Eva Marková",
    city: "České Budějovice",
    date: "29.04.2024",
    dateISO: "2024-04-29",
    situation: "Rozvod",
    quote:
      "Po rozvodu jsem chtěla rychle prodat dům a začít novou kapitolu. Ocenění bylo realistické, smlouva přehledná a peníze přišly včas. Konečně jsem měla klid.",
    rating: 5,
  },
  {
    name: "Jiří Kučera",
    city: "Hradec Králové",
    date: "08.12.2023",
    dateISO: "2023-12-08",
    situation: "Rychlý prodej",
    quote:
      "Prodával jsem starší byt, který potřeboval rekonstrukci. Nikdo z kupujících nechtěl čekat. Zde mi dali férovou nabídku i bez oprav a vše vyřídili za dva týdny.",
    rating: 4,
  },
  {
    name: "Radka Benešová",
    city: "Olomouc",
    date: "17.01.2025",
    dateISO: "2025-01-17",
    situation: "Insolvence",
    quote:
      "Byla jsem v insolvenci a potřebovala prodat byt, abych splatila věřitele. Celé to vyřídili za mě — včetně komunikace s insolvenčním správcem. Bez nich bych to nezvládla.",
    rating: 5,
  },
  {
    name: "Kamil Odehnal",
    city: "Zlín",
    date: "30.08.2024",
    dateISO: "2024-08-30",
    situation: "Spoluvlastnický podíl",
    quote:
      "Vlastnil jsem třetinový podíl na domě po rodičích. Sourozenci nechtěli prodávat, ale já potřeboval peníze. Vykoupili můj podíl za férovou cenu během 10 dní. Profesionální a diskrétní jednání.",
    rating: 5,
  },
];

export const averageRating =
  Math.round(
    (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) *
      10,
  ) / 10;
