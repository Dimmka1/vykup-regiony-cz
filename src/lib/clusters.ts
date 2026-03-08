/** Topical cluster definitions for internal linking mesh (VR-233) */

export interface ClusterPage {
  slug: string;
  href: string;
  title: string;
  description: string;
}

export interface Cluster {
  id: string;
  name: string;
  hubSlug: string;
  pages: ClusterPage[];
}

export const clusters: Cluster[] = [
  {
    id: "pravni-situace",
    name: "Právní situace",
    hubSlug: "vykup-pri-exekuci",
    pages: [
      {
        slug: "vykup-pri-exekuci",
        href: "/vykup-pri-exekuci",
        title: "Výkup při exekuci",
        description:
          "Pomůžeme vám prodat nemovitost zatíženou exekucí rychle a diskrétně.",
      },
      {
        slug: "vykup-pri-dedictvi",
        href: "/vykup-pri-dedictvi",
        title: "Výkup při dědictví",
        description:
          "Řešení zděděné nemovitosti bez komplikací a dlouhého čekání.",
      },
      {
        slug: "vykup-pri-rozvodu",
        href: "/vykup-pri-rozvodu",
        title: "Výkup při rozvodu",
        description:
          "Rychlé vypořádání nemovitosti při rozvodu bez zbytečných sporů.",
      },
      {
        slug: "vykup-nemovitosti-s-hypotekou",
        href: "/vykup-nemovitosti-s-hypotekou",
        title: "Výkup s hypotékou",
        description:
          "Vykoupíme nemovitost i s nesplacenou hypotékou — vyřešíme vše za vás.",
      },
      {
        slug: "vykup-nemovitosti-s-vecnym-bremenem",
        href: "/vykup-nemovitosti-s-vecnym-bremenem",
        title: "Výkup s věcným břemenem",
        description:
          "Nemovitost s věcným břemenem není překážkou pro rychlý výkup.",
      },
      {
        slug: "vykup-spoluvlastnickeho-podilu",
        href: "/vykup-spoluvlastnickeho-podilu",
        title: "Výkup spoluvlastnického podílu",
        description:
          "Odkoupíme váš podíl na nemovitosti rychle a za férovou cenu.",
      },
      {
        slug: "blog/nemovitost-v-exekuci-pruvodce",
        href: "/blog/nemovitost-v-exekuci-pruvodce",
        title: "Nemovitost v exekuci — průvodce",
        description:
          "Vše o prodeji nemovitosti zatížené exekucí. Právní možnosti a postup.",
      },
      {
        slug: "blog/vykup-v-exekuci",
        href: "/blog/vykup-v-exekuci",
        title: "Výkup nemovitosti v exekuci",
        description:
          "Praktický průvodce prodejem nemovitosti zatížené exekucí.",
      },
    ],
  },
  {
    id: "typy-nemovitosti",
    name: "Typy nemovitostí",
    hubSlug: "vykup-bytu",
    pages: [
      {
        slug: "vykup-bytu",
        href: "/vykup-bytu",
        title: "Výkup bytů",
        description:
          "Rychlý prodej bytu za hotové do 7 dnů bez provize a starostí.",
      },
      {
        slug: "vykup-domu",
        href: "/vykup-domu",
        title: "Výkup domů",
        description: "Vykoupíme váš dům rychle a za férovou cenu.",
      },
      {
        slug: "vykup-pozemku",
        href: "/vykup-pozemku",
        title: "Výkup pozemků",
        description:
          "Rychlý výkup stavebních i zemědělských pozemků v celé ČR.",
      },
      {
        slug: "zpetny-najem",
        href: "/zpetny-najem",
        title: "Zpětný nájem",
        description:
          "Prodejte nemovitost a zůstaňte bydlet díky zpětnému nájmu.",
      },
      {
        slug: "blog/jak-rychle-prodat-nemovitost",
        href: "/blog/jak-rychle-prodat-nemovitost",
        title: "Jak rychle prodat nemovitost",
        description:
          "Kompletní průvodce rychlým prodejem — od přípravy po předání klíčů.",
      },
      {
        slug: "blog/vykup-nemovitosti-vs-realitni-kancelar",
        href: "/blog/vykup-nemovitosti-vs-realitni-kancelar",
        title: "Výkup vs realitní kancelář",
        description: "Srovnání dvou nejčastějších způsobů prodeje nemovitosti.",
      },
    ],
  },
  {
    id: "regiony",
    name: "Regiony",
    hubSlug: "kraje",
    pages: [
      {
        slug: "kraje",
        href: "/kraje",
        title: "Výkup nemovitostí v krajích ČR",
        description:
          "Vykupujeme nemovitosti ve všech 14 krajích České republiky.",
      },
    ],
  },
  {
    id: "pruvodce",
    name: "Průvodce prodejem",
    hubSlug: "jak-to-funguje",
    pages: [
      {
        slug: "jak-to-funguje",
        href: "/jak-to-funguje",
        title: "Jak funguje výkup nemovitosti",
        description:
          "Celý proces výkupu v 5 jednoduchých krocích — od kontaktu po platbu.",
      },
      {
        slug: "pruvodce-vykupem",
        href: "/pruvodce-vykupem",
        title: "Průvodce rychlým výkupem",
        description:
          "Stáhněte si zdarma PDF průvodce rychlým výkupem nemovitosti.",
      },
      {
        slug: "garance-vykupu",
        href: "/garance-vykupu",
        title: "Garance výkupu",
        description: "Jaké garance poskytujeme při výkupu vaší nemovitosti.",
      },
      {
        slug: "caste-dotazy",
        href: "/caste-dotazy",
        title: "Časté dotazy",
        description: "Odpovědi na nejčastější otázky o výkupu nemovitostí.",
      },
      {
        slug: "blog/jak-probiha-rychly-vykup",
        href: "/blog/jak-probiha-rychly-vykup",
        title: "Jak probíhá rychlý výkup",
        description: "Kompletní průvodce procesem rychlého výkupu nemovitosti.",
      },
      {
        slug: "blog/5-duvodu-proc-prodat",
        href: "/blog/5-duvodu-proc-prodat",
        title: "5 důvodů proč prodat přes výkupní firmu",
        description:
          "Proč stále více majitelů volí rychlý výkup místo klasického prodeje?",
      },
    ],
  },
];

/** Slug-to-cluster index built once at import time */
const slugClusterMap = new Map<string, Cluster>();
for (const cluster of clusters) {
  for (const page of cluster.pages) {
    slugClusterMap.set(page.slug, cluster);
  }
}

/**
 * Get cluster id for a given page slug.
 * @param slug e.g. "vykup-pri-exekuci" or "blog/jak-rychle-prodat-nemovitost"
 */
export function getClusterForSlug(slug: string): string | null {
  return slugClusterMap.get(slug)?.id ?? null;
}

/**
 * Get related pages from the same cluster, excluding the current page.
 * Hub page is always included first (unless current page IS the hub).
 * @param slug current page slug
 * @param limit max pages to return (default 5)
 */
export function getRelatedPages(slug: string, limit = 5): ClusterPage[] {
  const cluster = slugClusterMap.get(slug);
  if (!cluster) return [];

  const others = cluster.pages.filter((p) => p.slug !== slug);
  if (others.length === 0) return [];

  // Put hub first if current page is not hub
  const isHub = slug === cluster.hubSlug;
  if (!isHub) {
    const hubIdx = others.findIndex((p) => p.slug === cluster.hubSlug);
    if (hubIdx > 0) {
      const [hub] = others.splice(hubIdx, 1);
      others.unshift(hub);
    }
  }

  return others.slice(0, limit);
}
