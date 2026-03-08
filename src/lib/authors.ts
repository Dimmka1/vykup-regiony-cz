import { BLOG_POSTS, type BlogPost } from "@/app/blog/data";

export interface Author {
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;
  credentials: string[];
  blogSlugs: string[];
}

export const AUTHORS: readonly Author[] = [
  {
    slug: "redakce",
    name: "Redakce Výkupím Nemovitost",
    jobTitle: "Redakční tým",
    bio: "Redakce Výkupím Nemovitost je tým zkušených odborníků na český realitní trh, kteří se specializují na problematiku výkupu nemovitostí, exekucí, dědických řízení a dalších složitých majetkových situací. Náš tým kombinuje více než patnáct let praktických zkušeností v oblasti oceňování a prodeje nemovitostí po celé České republice — od Prahy a Brna přes krajská města až po menší obce a vesnice.\n\nKaždý článek na našem blogu prochází důkladným redakčním procesem. Informace ověřujeme proti aktuální legislativě, konzultujeme s právníky specializujícími se na nemovitostní právo a doplňujeme o praktické zkušenosti z reálných transakcí. Naším cílem je poskytnout čtenářům srozumitelné, přesné a aktuální informace, které jim pomohou při rozhodování o prodeji nemovitosti.\n\nZaměřujeme se na témata, která jsou pro prodávající nejdůležitější: jak rychle a bezpečně prodat nemovitost, jaké dokumenty jsou potřeba, jaké jsou náklady a jak se vyhnout nejčastějším chybám. Pravidelně sledujeme vývoj na trhu, legislativní změny a nové trendy v oblasti realit, abychom naše články udržovali aktuální a relevantní.\n\nSpolupracujeme s advokáty, odhadci, daňovými poradci a dalšími profesionály, abychom mohli nabídnout komplexní pohled na každé téma. Věříme, že informovaný klient je spokojený klient — proto investujeme čas a úsilí do tvorby kvalitního obsahu, který přináší skutečnou hodnotu.",
    credentials: [
      "15+ let zkušeností na českém realitním trhu",
      "Spolupráce s advokáty a odhadci nemovitostí",
      "Stovky úspěšně realizovaných transakcí",
      "Specializace na výkup v exekuci a dědictví",
    ],
    blogSlugs: BLOG_POSTS.map((p) => p.slug),
  },
] as const;

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

export function getAuthorArticles(author: Author): BlogPost[] {
  return BLOG_POSTS.filter((p) => author.blogSlugs.includes(p.slug));
}

export const DEFAULT_AUTHOR = AUTHORS[0];
