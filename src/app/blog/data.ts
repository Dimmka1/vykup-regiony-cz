export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

export const BLOG_POSTS: readonly BlogPost[] = [
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
