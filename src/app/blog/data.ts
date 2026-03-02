export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: "jak-rychle-prodat-nemovitost",
    title: "Jak rychle prodat nemovitost v roce 2026",
    excerpt:
      "Kompletní průvodce rychlým prodejem nemovitosti v roce 2026 — od přípravy až po předání klíčů. Praktické tipy, které vám ušetří čas i peníze.",
    date: "2026-03-01",
    readingTime: "7 min",
  },
  {
    slug: "vykup-nemovitosti-vs-realitni-kancelar",
    title: "Výkup nemovitosti vs realitní kancelář — co se vyplatí",
    excerpt:
      "Srovnání dvou nejčastějších způsobů prodeje nemovitosti. Kdy zvolit výkup a kdy realitní kancelář? Objektivní analýza výhod a nevýhod.",
    date: "2026-02-25",
    readingTime: "8 min",
  },
  {
    slug: "nemovitost-v-exekuci-pruvodce",
    title: "Nemovitost v exekuci — kompletní průvodce",
    excerpt:
      "Vše, co potřebujete vědět o prodeji nemovitosti zatížené exekucí. Právní možnosti, postup krok za krokem a jak získat co nejvíce.",
    date: "2026-02-20",
    readingTime: "9 min",
  },
  {
    slug: "jak-probiha-rychly-vykup",
    title: "Jak probíhá rychlý výkup nemovitosti",
    excerpt:
      "Kompletní průvodce procesem rychlého výkupu — od prvního kontaktu po vyplacení peněz. Co vás čeká a na co se připravit.",
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
    title: "Výkup nemovitosti v exekuci — co potřebujete vědět",
    excerpt:
      "Praktický průvodce prodejem nemovitosti zatížené exekucí. Jaké máte možnosti a jak celý proces funguje.",
    date: "2026-02-05",
    readingTime: "6 min",
  },
] as const;
