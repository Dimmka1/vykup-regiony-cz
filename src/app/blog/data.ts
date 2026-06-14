export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: "jak-zastavit-drazbu-nemovitosti",
    title: "Jak zastavit dražbu nemovitosti – legální možnosti a lhůty 2026",
    excerpt:
      "Hrozí vám exekuční dražba nemovitosti? Jak ji legálně zastavit: úhrada dluhu, odklad či zastavení exekuce, prodej z volné ruky i insolvence. Lhůty a postup.",
    date: "2026-06-14",
    readingTime: "10 min",
  },
  {
    slug: "dan-z-prodeje-nemovitosti-2026",
    title: "Daň z prodeje nemovitosti 2026 — kompletní průvodce",
    excerpt:
      "Kompletní průvodce daní z prodeje nemovitosti v roce 2026. Sazba 15 %, osvobození po 5/10 letech, výpočet daně, formulář přiznání a tipy jak daň snížit.",
    date: "2026-03-16",
    readingTime: "10 min",
  },
  {
    slug: "jake-dokumenty-potrebuji",
    title: "Jaké dokumenty potřebuji k výkupu nemovitosti?",
    excerpt:
      "Kompletní přehled dokumentů potřebných k prodeji nemovitosti přes výkupní firmu. List vlastnictví, kupní smlouva, občanský průkaz a další.",
    date: "2026-03-02",
    readingTime: "6 min",
  },
  {
    slug: "vykup-krok-za-krokem",
    title: "Výkup nemovitosti krok za krokem — jak to funguje",
    excerpt:
      "Podrobný průvodce celým procesem výkupu nemovitosti od prvního kontaktu po vyplacení peněz. Celý proces trvá jen 7–14 dní.",
    date: "2026-03-02",
    readingTime: "7 min",
  },
  {
    slug: "vykup-vs-drazba",
    title: "Výkup nemovitosti vs. dražba — co je výhodnější?",
    excerpt:
      "Srovnání výkupu nemovitosti a dražby. Čas, cena, jistota, náklady a stres — kompletní analýza obou variant.",
    date: "2026-03-02",
    readingTime: "7 min",
  },
  {
    slug: "kolik-stoji-vykup",
    title: "Kolik stojí výkup nemovitosti? Kompletní přehled nákladů",
    excerpt:
      "Zjistěte, kolik ve skutečnosti zaplatíte při výkupu nemovitosti. Srovnání s realitní kanceláří a dražbou.",
    date: "2026-03-02",
    readingTime: "6 min",
  },
  {
    slug: "jak-rychle-prodat-nemovitost",
    title: "Jak rychle prodat nemovitost (2026): 7 dnů vs. 6 měsíců",
    excerpt:
      "Návod jak prodat byt nebo dům za 7 dnů. Postup, ceny 2026, daně. Srovnání výkupu, realitky a dražby. Reálné případy z celé ČR.",
    date: "2026-03-01",
    readingTime: "7 min",
  },
  {
    slug: "vykup-nemovitosti-vs-realitni-kancelar",
    title: "Výkup nemovitosti vs realitní kancelář - co se vyplatí",
    excerpt:
      "Srovnání dvou nejčastějších způsobů prodeje nemovitosti. Kdy zvolit výkup a kdy realitní kancelář? Objektivní analýza výhod a nevýhod.",
    date: "2026-02-25",
    readingTime: "8 min",
  },
  {
    slug: "nemovitost-v-exekuci-pruvodce",
    title: "Nemovitost v exekuci - kompletní průvodce",
    excerpt:
      "Vše, co potřebujete vědět o prodeji nemovitosti zatížené exekucí. Právní možnosti, postup krok za krokem a jak získat co nejvíce.",
    date: "2026-02-20",
    readingTime: "9 min",
  },
  {
    slug: "jak-probiha-rychly-vykup",
    title: "Jak probíhá rychlý výkup nemovitosti",
    excerpt:
      "Kompletní průvodce procesem rychlého výkupu - od prvního kontaktu po vyplacení peněz. Co vás čeká a na co se připravit.",
    date: "2026-02-15",
    readingTime: "5 min",
  },
  {
    slug: "5-duvodu-proc-prodat",
    title: "5 důvodů proč prodat nemovitost přes výkupní firmu",
    excerpt:
      "Proč stále více majitelů volí rychlý výkup místo klasického prodeje přes realitku? Podívejte se na hlavní výhody.",
    date: "2026-02-10",
    readingTime: "4 min",
  },
  {
    slug: "vykup-v-exekuci",
    title: "Výkup nemovitosti v exekuci 2026 — postup, dokumenty, daně",
    excerpt:
      "Praktický návod, jak prodat nemovitost zatíženou exekucí: postup krok za krokem, dokumenty, daňové dopady, srovnání výkupu a dražby.",
    date: "2026-02-05",
    readingTime: "6 min",
  },
] as const;
