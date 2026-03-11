export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: "jak-vybrat-vykupni-firmu",
    title: "Jak vybrat seriózní výkupní firmu: 10 bodů kontrolního seznamu",
    excerpt:
      "Kompletní kontrolní seznam 10 kritérií, jak poznat seriózní výkupní firmu. Varovné signály, na co si dát pozor, a FAQ pro bezpečný prodej.",
    date: "2026-03-11",
    readingTime: "8 min",
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
    title: "Jak rychle prodat nemovitost v roce 2026",
    excerpt:
      "Kompletní průvodce rychlým prodejem nemovitosti v roce 2026 - od přípravy až po předání klíčů. Praktické tipy, které vám ušetří čas i peníze.",
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
    title: "Výkup nemovitosti v exekuci - co potřebujete vědět",
    excerpt:
      "Praktický průvodce prodejem nemovitosti zatížené exekucí. Jaké máte možnosti a jak celý proces funguje.",
    date: "2026-02-05",
    readingTime: "6 min",
  },
] as const;
