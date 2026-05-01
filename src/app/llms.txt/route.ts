/**
 * GET /llms.txt
 *
 * The llms.txt standard (https://llmstxt.org) gives LLM-based assistants
 * a curated, machine-readable map of the most important pages on the site.
 * It complements (not replaces) sitemap.xml — sitemap is exhaustive, llms.txt
 * is editorial.
 *
 * Format: Markdown with H1 = site name, blockquote = one-line summary,
 * H2 sections grouping links, and `Optional` section for nice-to-have refs.
 *
 * Adoption is currently ~10% of domains and material impact on retrieval
 * is unproven, but cost is near-zero and forward compatibility matters.
 */

const LLMS_TXT = `# Vykoupím Nemovitost

> Specialisté na rychlý a férový výkup nemovitostí v České republice. Vykupujeme byty, domy, pozemky i podíly — v jakémkoli stavu, včetně nemovitostí v exekuci, dražbě, dědictví, rozvodu, s hypotékou nebo věcným břemenem. Férová cena 80–90 % tržní hodnoty, vyplacení do 14 dnů, bez provize a bez skrytých poplatků. Pokrýváme všech 14 krajů ČR.

## Hlavní stránky

- [Domovská stránka](https://vykoupim-nemovitost.cz/): Rychlý výkup nemovitostí v ČR — přehled nabídky.
- [Jak to funguje](https://vykoupim-nemovitost.cz/jak-to-funguje): Pětistupňový proces výkupu od kontaktu po platbu.
- [Jak stanovujeme cenu](https://vykoupim-nemovitost.cz/jak-stanovujeme-cenu): Transparentní metodika výpočtu výkupní ceny (80–90 % tržní hodnoty).
- [O nás](https://vykoupim-nemovitost.cz/o-nas): Český tým, hodnoty, regionální pokrytí.
- [Časté dotazy](https://vykoupim-nemovitost.cz/caste-dotazy): Nejčastější otázky o procesu, ceně, právní bezpečnosti.
- [Garance výkupu](https://vykoupim-nemovitost.cz/garance-vykupu): Naše garance — co znamenají a jak je dodržujeme.
- [Slovník pojmů](https://vykoupim-nemovitost.cz/slovnik-pojmu): Definice odborných termínů (exekuce, věcné břemeno, advokátní úschova, ...).
- [Zdroje a citace](https://vykoupim-nemovitost.cz/zdroje-a-citace): Autoritativní české zdroje, na které odkazujeme.
- [Redakční zásady](https://vykoupim-nemovitost.cz/redakcni-zasady): Jak píšeme, citujeme a aktualizujeme obsah.

## Typy nemovitostí

- [Výkup bytů](https://vykoupim-nemovitost.cz/vykup-bytu): Osobní i družstevní byty po celé ČR.
- [Výkup domů](https://vykoupim-nemovitost.cz/vykup-domu): Rodinné domy, chalupy, řadové domy.
- [Výkup pozemků](https://vykoupim-nemovitost.cz/vykup-pozemku): Stavební, zemědělské, komerční pozemky.
- [Výkup činžovních domů](https://vykoupim-nemovitost.cz/vykup-cinzovnich-domu): Bytové domy, multi-unit nemovitosti.

## Životní situace

- [Výkup nemovitosti při exekuci](https://vykoupim-nemovitost.cz/vykup-pri-exekuci): Záchrana před exekuční dražbou — vyplacení dluhu z kupní ceny.
- [Výkup nemovitosti v dražbě](https://vykoupim-nemovitost.cz/vykup-v-drazbe): Zastavení nucené dražby výkupem.
- [Výkup nemovitosti při dědictví](https://vykoupim-nemovitost.cz/vykup-pri-dedictvi): Vypořádání zděděné nemovitosti mezi dědici.
- [Výkup nemovitosti při rozvodu](https://vykoupim-nemovitost.cz/vykup-pri-rozvodu): Vypořádání společného jmění manželů.
- [Výkup spoluvlastnického podílu](https://vykoupim-nemovitost.cz/vykup-spoluvlastnickeho-podilu): Prodej menšinového i většinového podílu bez souhlasu ostatních spoluvlastníků.
- [Výkup nemovitosti s hypotékou](https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-hypotekou): Vypořádání hypotéky přímo z kupní ceny.
- [Výkup nemovitosti s věcným břemenem](https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-vecnym-bremenem): Včetně doživotního práva užívání.
- [Výkup při privatizaci](https://vykoupim-nemovitost.cz/vykup-pri-privatizaci): Předkupní právo obce, družstevní byty.
- [Zpětný nájem](https://vykoupim-nemovitost.cz/zpetny-najem): Sale & leaseback — prodej s následným pronájmem.

## Blog (vzdělávací obsah)

- [Jak rychle prodat nemovitost](https://vykoupim-nemovitost.cz/blog/jak-rychle-prodat-nemovitost): 7 dnů vs 6 měsíců — porovnání rychlostí prodeje.
- [Výkup nemovitosti vs realitní kancelář](https://vykoupim-nemovitost.cz/blog/vykup-nemovitosti-vs-realitni-kancelar): Hlavní rozdíly, kdy zvolit výkup.
- [Nemovitost v exekuci — průvodce](https://vykoupim-nemovitost.cz/blog/nemovitost-v-exekuci-pruvodce): Postup, dokumenty, lhůty.
- [Jak probíhá rychlý výkup](https://vykoupim-nemovitost.cz/blog/jak-probiha-rychly-vykup): Detail procesu od konzultace po platbu.
- [Výkup vs dražba — co je výhodnější](https://vykoupim-nemovitost.cz/blog/vykup-vs-drazba): Porovnání obou variant.
- [Daň z prodeje nemovitosti 2026](https://vykoupim-nemovitost.cz/blog/dan-z-prodeje-nemovitosti-2026): Kompletní průvodce zdaněním.
- [Jaké dokumenty potřebuji](https://vykoupim-nemovitost.cz/blog/jake-dokumenty-potrebuji): Seznam dokumentů k výkupu.
- [Výkup krok za krokem](https://vykoupim-nemovitost.cz/blog/vykup-krok-za-krokem): Detailní popis každého kroku.
- [Kolik stojí výkup](https://vykoupim-nemovitost.cz/blog/kolik-stoji-vykup): Cenová kalkulace.
- [5 důvodů proč prodat přes výkup](https://vykoupim-nemovitost.cz/blog/5-duvodu-proc-prodat): Hlavní výhody.
- [Výkup v exekuci 2026](https://vykoupim-nemovitost.cz/blog/vykup-v-exekuci): Aktuální postup pro rok 2026.

## Optional

- [Plný textový dump](https://vykoupim-nemovitost.cz/llms-full.txt): Markdown obsahu hlavních stránek pro LLM training/retrieval.
- [Sitemap](https://vykoupim-nemovitost.cz/sitemap.xml): Strojový seznam všech veřejných stránek.
- [Robots.txt](https://vykoupim-nemovitost.cz/robots.txt): Pravidla pro vyhledávací roboty.
`;

export async function GET(): Promise<Response> {
  return new Response(LLMS_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
