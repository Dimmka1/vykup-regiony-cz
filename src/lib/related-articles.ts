import type { RelatedArticle } from "@/components/related-articles";

/** All linkable pages for cross-referencing */
const ALL_PAGES: Record<string, RelatedArticle> = {
  // Blog articles
  "blog/jak-rychle-prodat-nemovitost": {
    href: "/blog/jak-rychle-prodat-nemovitost",
    title: "Jak rychle prodat nemovitost v roce 2026",
    description:
      "Kompletní průvodce rychlým prodejem nemovitosti - od přípravy až po předání klíčů.",
  },
  "blog/vykup-nemovitosti-vs-realitni-kancelar": {
    href: "/blog/vykup-nemovitosti-vs-realitni-kancelar",
    title: "Výkup nemovitosti vs realitní kancelář",
    description:
      "Srovnání dvou nejčastějších způsobů prodeje. Kdy zvolit výkup a kdy realitku?",
  },
  "blog/nemovitost-v-exekuci-pruvodce": {
    href: "/blog/nemovitost-v-exekuci-pruvodce",
    title: "Nemovitost v exekuci - kompletní průvodce",
    description:
      "Vše o prodeji nemovitosti zatížené exekucí. Právní možnosti a postup krok za krokem.",
  },
  "blog/jak-probiha-rychly-vykup": {
    href: "/blog/jak-probiha-rychly-vykup",
    title: "Jak probíhá rychlý výkup nemovitosti",
    description:
      "Kompletní průvodce procesem rychlého výkupu - od prvního kontaktu po vyplacení.",
  },
  "blog/5-duvodu-proc-prodat": {
    href: "/blog/5-duvodu-proc-prodat",
    title: "5 důvodů proč prodat přes výkupní firmu",
    description:
      "Proč stále více majitelů volí rychlý výkup místo klasického prodeje?",
  },
  "blog/vykup-v-exekuci": {
    href: "/blog/vykup-v-exekuci",
    title: "Výkup nemovitosti v exekuci",
    description: "Praktický průvodce prodejem nemovitosti zatížené exekucí.",
  },
  "blog/jake-dokumenty-potrebuji": {
    href: "/blog/jake-dokumenty-potrebuji",
    title: "Jaké dokumenty potřebuji k výkupu nemovitosti?",
    description:
      "Kompletní přehled dokumentů potřebných k prodeji nemovitosti přes výkupní firmu.",
  },
  "blog/vykup-krok-za-krokem": {
    href: "/blog/vykup-krok-za-krokem",
    title: "Výkup nemovitosti krok za krokem",
    description:
      "Podrobný průvodce celým procesem výkupu od prvního kontaktu po vyplacení peněz.",
  },
  "blog/vykup-vs-drazba": {
    href: "/blog/vykup-vs-drazba",
    title: "Výkup nemovitosti vs. dražba",
    description: "Srovnání výkupu a dražby — čas, cena, jistota a náklady.",
  },
  "blog/kolik-stoji-vykup": {
    href: "/blog/kolik-stoji-vykup",
    title: "Kolik stojí výkup nemovitosti?",
    description:
      "Kompletní přehled nákladů při výkupu nemovitosti. Srovnání s realitkou a dražbou.",
  },
  // Use case pages
  "vykup-bytu": {
    href: "/vykup-bytu",
    title: "Výkup bytů",
    description: "Rychlý prodej bytu za hotové do 7 dnů bez provize.",
  },
  "vykup-domu": {
    href: "/vykup-domu",
    title: "Výkup domů",
    description: "Vykoupíme váš dům rychle a za férovou cenu.",
  },
  "vykup-pozemku": {
    href: "/vykup-pozemku",
    title: "Výkup pozemků",
    description: "Rychlý výkup stavebních i zemědělských pozemků.",
  },
  "vykup-pri-exekuci": {
    href: "/vykup-pri-exekuci",
    title: "Výkup při exekuci",
    description: "Pomůžeme vám prodat nemovitost zatíženou exekucí.",
  },
  "vykup-pri-rozvodu": {
    href: "/vykup-pri-rozvodu",
    title: "Výkup při rozvodu",
    description: "Rychlé vypořádání nemovitosti při rozvodu.",
  },
  "vykup-pri-dedictvi": {
    href: "/vykup-pri-dedictvi",
    title: "Výkup při dědictví",
    description: "Řešení zděděné nemovitosti bez komplikací.",
  },
  "vykup-nemovitosti-s-hypotekou": {
    href: "/vykup-nemovitosti-s-hypotekou",
    title: "Výkup s hypotékou",
    description: "Vykoupíme nemovitost i s nesplacenou hypotékou.",
  },
  "vykup-nemovitosti-s-vecnym-bremenem": {
    href: "/vykup-nemovitosti-s-vecnym-bremenem",
    title: "Výkup s věcným břemenem",
    description: "Nemovitost s věcným břemenem není překážkou.",
  },
  "vykup-spoluvlastnickeho-podilu": {
    href: "/vykup-spoluvlastnickeho-podilu",
    title: "Výkup spoluvlastnického podílu",
    description: "Odkoupíme váš podíl na nemovitosti rychle a férově.",
  },
  "zpetny-najem": {
    href: "/zpetny-najem",
    title: "Zpětný nájem",
    description: "Prodejte nemovitost a zůstaňte bydlet díky zpětnému nájmu.",
  },
  "vykup-cinzovnich-domu": {
    href: "/vykup-cinzovnich-domu",
    title: "Výkup činžovních domů",
    description:
      "Rychlý výkup bytového domu bez provize a bez starostí s nájemníky.",
  },
  "vykup-pri-privatizaci": {
    href: "/vykup-pri-privatizaci",
    title: "Výkup při privatizaci",
    description:
      "Prodej privatizovaného bytu rychle a bez právních komplikací.",
  },
};

/** Mapping: page key → array of related page keys */
const RELATED_MAP: Record<string, string[]> = {
  // Blog articles
  "blog/jak-rychle-prodat-nemovitost": [
    "blog/vykup-nemovitosti-vs-realitni-kancelar",
    "blog/jak-probiha-rychly-vykup",
    "blog/5-duvodu-proc-prodat",
    "vykup-bytu",
  ],
  "blog/vykup-nemovitosti-vs-realitni-kancelar": [
    "blog/jak-rychle-prodat-nemovitost",
    "blog/5-duvodu-proc-prodat",
    "blog/jak-probiha-rychly-vykup",
    "vykup-bytu",
  ],
  "blog/nemovitost-v-exekuci-pruvodce": [
    "blog/vykup-v-exekuci",
    "vykup-pri-exekuci",
    "blog/jak-rychle-prodat-nemovitost",
    "vykup-nemovitosti-s-hypotekou",
  ],
  "blog/jak-probiha-rychly-vykup": [
    "blog/jak-rychle-prodat-nemovitost",
    "blog/5-duvodu-proc-prodat",
    "blog/vykup-nemovitosti-vs-realitni-kancelar",
    "vykup-bytu",
  ],
  "blog/5-duvodu-proc-prodat": [
    "blog/vykup-nemovitosti-vs-realitni-kancelar",
    "blog/jak-probiha-rychly-vykup",
    "blog/nemovitost-v-exekuci-pruvodce",
    "vykup-domu",
  ],
  "blog/vykup-v-exekuci": [
    "blog/nemovitost-v-exekuci-pruvodce",
    "vykup-pri-exekuci",
    "blog/jak-probiha-rychly-vykup",
    "vykup-nemovitosti-s-hypotekou",
  ],
  "blog/jake-dokumenty-potrebuji": [
    "blog/vykup-krok-za-krokem",
    "blog/jak-probiha-rychly-vykup",
    "blog/kolik-stoji-vykup",
  ],
  "blog/vykup-krok-za-krokem": [
    "blog/jake-dokumenty-potrebuji",
    "blog/kolik-stoji-vykup",
    "blog/jak-probiha-rychly-vykup",
  ],
  "blog/vykup-vs-drazba": [
    "blog/vykup-v-exekuci",
    "blog/kolik-stoji-vykup",
    "blog/vykup-nemovitosti-vs-realitni-kancelar",
  ],
  "blog/kolik-stoji-vykup": [
    "blog/vykup-vs-drazba",
    "blog/vykup-nemovitosti-vs-realitni-kancelar",
    "blog/5-duvodu-proc-prodat",
  ],
  // Use case pages
  "vykup-bytu": [
    "blog/jak-rychle-prodat-nemovitost",
    "blog/jak-probiha-rychly-vykup",
    "blog/5-duvodu-proc-prodat",
    "vykup-domu",
  ],
  "vykup-domu": [
    "blog/jak-rychle-prodat-nemovitost",
    "blog/vykup-nemovitosti-vs-realitni-kancelar",
    "vykup-bytu",
    "vykup-pozemku",
  ],
  "vykup-pozemku": [
    "blog/jak-rychle-prodat-nemovitost",
    "blog/jak-probiha-rychly-vykup",
    "vykup-domu",
    "vykup-bytu",
  ],
  "vykup-pri-exekuci": [
    "blog/nemovitost-v-exekuci-pruvodce",
    "blog/vykup-v-exekuci",
    "vykup-nemovitosti-s-hypotekou",
    "zpetny-najem",
  ],
  "vykup-pri-rozvodu": [
    "blog/jak-rychle-prodat-nemovitost",
    "vykup-spoluvlastnickeho-podilu",
    "vykup-bytu",
    "vykup-pri-exekuci",
  ],
  "vykup-pri-dedictvi": [
    "blog/jak-rychle-prodat-nemovitost",
    "vykup-spoluvlastnickeho-podilu",
    "vykup-domu",
    "vykup-pri-rozvodu",
  ],
  "vykup-nemovitosti-s-hypotekou": [
    "blog/nemovitost-v-exekuci-pruvodce",
    "vykup-pri-exekuci",
    "blog/jak-probiha-rychly-vykup",
    "zpetny-najem",
  ],
  "vykup-nemovitosti-s-vecnym-bremenem": [
    "blog/vykup-nemovitosti-vs-realitni-kancelar",
    "vykup-nemovitosti-s-hypotekou",
    "zpetny-najem",
    "vykup-pri-exekuci",
  ],
  "vykup-spoluvlastnickeho-podilu": [
    "vykup-pri-rozvodu",
    "vykup-pri-dedictvi",
    "blog/jak-rychle-prodat-nemovitost",
    "vykup-bytu",
  ],
  "zpetny-najem": [
    "vykup-pri-exekuci",
    "vykup-nemovitosti-s-hypotekou",
    "blog/jak-rychle-prodat-nemovitost",
    "vykup-bytu",
  ],
  "vykup-cinzovnich-domu": [
    "vykup-domu",
    "vykup-spoluvlastnickeho-podilu",
    "blog/jak-probiha-rychly-vykup",
    "vykup-pri-dedictvi",
  ],
  "vykup-pri-privatizaci": [
    "vykup-bytu",
    "blog/jak-rychle-prodat-nemovitost",
    "vykup-spoluvlastnickeho-podilu",
    "vykup-pri-dedictvi",
  ],
};

/**
 * Get related articles for a given page key.
 * @param pageKey - e.g. "blog/jak-rychle-prodat-nemovitost" or "vykup-bytu"
 * @param limit - max articles to return (default 3)
 */
export function getRelatedArticles(
  pageKey: string,
  limit = 3,
): RelatedArticle[] {
  const keys = RELATED_MAP[pageKey] ?? [];
  return keys
    .map((key) => ALL_PAGES[key])
    .filter(Boolean)
    .slice(0, limit);
}
