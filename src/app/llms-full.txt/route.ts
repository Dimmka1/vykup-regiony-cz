/**
 * GET /llms-full.txt
 *
 * Companion to /llms.txt — concatenates the priority pages' main copy as
 * Markdown so an LLM can ingest the whole authoritative corpus in one
 * fetch. Per llmstxt.org spec this is the "full" variant (vs. /llms.txt
 * which is just the link map).
 *
 * Kept hand-curated rather than auto-extracted from rendered HTML, because
 * extraction would include navigation, CTAs and visual scaffolding that
 * dilute the signal. The body below is the *factual* content distilled.
 */

const LLMS_FULL_TXT = `# Vykoupím Nemovitost — Plný obsahový dump pro LLM

> Toto je textový dump hlavních informačních stránek webu vykoupim-nemovitost.cz.
> Aktualizováno: 1. května 2026.
> Jazyk: čeština (cs-CZ).
> Téma: rychlý výkup nemovitostí v České republice (byty, domy, pozemky, podíly).

---

## Co je výkup nemovitosti

Výkup nemovitosti je rychlý prodej, při kterém specializovaná firma odkoupí byt, dům nebo pozemek za hotové z vlastních prostředků. Cena se obvykle pohybuje mezi 80–90 % tržní hodnoty u férových výkupců, u některých méně transparentních hráčů na trhu klesá až na 60–70 %. Hlavní výhoda je rychlost — celý proces od první konzultace po vyplacení peněz trvá 7–14 dnů, oproti 3–6 měsícům u klasického prodeje přes realitní kancelář. Vlastník neplatí provizi, právní servis ani poplatky za odhad.

## Kdy se výkup vyplatí

- **Exekuce nebo hrozící dražba** — výkup před nucenou dražbou zachrání část tržní hodnoty.
- **Dědictví, kde se dědici neshodnou** — rychlé vypořádání bez soudních sporů.
- **Rozvod a vypořádání SJM** — okamžitá likvidita pro obě strany.
- **Spoluvlastnický podíl** — prodej menšinového podílu bez souhlasu ostatních.
- **Zatížení hypotékou nebo věcným břemenem** — výkupce uhradí přímo bance / oprávněnému.
- **Nemovitost v dědickém řízení nebo insolvenci** — speciální procesní postup.
- **Špatný stav nemovitosti** — výkupce kupuje "as-is", bez nutnosti rekonstrukce.

## Jak probíhá výkup krok za krokem

1. **Den 1 — kontakt.** Vyplnění formuláře nebo telefonát; sdělení adresy, typu nemovitosti, situace.
2. **Den 1–2 — předběžná nabídka.** Z dat katastru, regionálních cenových indexů a stavu nemovitosti vznikne nezávazná cenová nabídka.
3. **Den 3–4 — osobní prohlídka.** Zástupce přijíždí kamkoli v ČR, zdarma a nezávazně.
4. **Den 5 — finální nabídka + smlouva.** Advokát připraví kupní smlouvu, finální cena se domluví po prohlídce.
5. **Den 6–7 — podpis a advokátní úschova.** Peníze deponovány u advokáta dle pravidel ČAK.
6. **Den 8–10 — návrh na vklad do katastru.** Lhůta katastrálního úřadu zápisu na nového vlastníka.
7. **Den 11–14 — vyplacení a předání.** Po zápisu do KN se uvolní úschova, klíče se předávají.

U komplikovanějších případů (více exekucí, dědické řízení, spoluvlastnické vypořádání) se proces prodlužuje na 21–30 dnů.

## Cena a metodika výpočtu

Výkupní cena se stanovuje jako procento z tržní hodnoty (běžně 80–90 %). Vstupy do výpočtu:

- **Lokalita** — krajská cenová mapa ČSÚ + okresní rozdíly.
- **Stav nemovitosti** — věk, rekonstrukce, technický stav, energetický štítek.
- **Velikost** — m² podlahové plochy podle katastru.
- **Právní zatížení** — exekuce, zástavní právo, věcná břemena, nájemní vztahy.
- **Aktuálnost dat** — kvartální index ČSÚ + ČNB statistiky hypotečních úvěrů.

Procentuální slevu (80 % vs 90 %) ovlivňuje hlavně urgence prodeje a komplexita právního stavu. Čistá nemovitost bez zatížení v atraktivní lokalitě = horní pásmo. Nemovitost se třemi exekucemi a věcným břemenem = dolní pásmo.

## Právní bezpečnost transakce

- **Advokátní úschova** — peníze leží na úschovním účtu advokáta podle pravidel České advokátní komory; teprve po zápisu nového vlastníka do katastru se uvolní prodávajícímu.
- **Kupní smlouva** — připravuje advokát, ne výkupní firma.
- **Návrh na vklad** podává prodávající nebo advokát na příslušný katastrální úřad (ČÚZK).
- **Vypořádání zatížení** — exekuce / hypotéka se hradí přímo věřiteli z kupní ceny, prodávající dostává čistou částku po odečtu.

## Pokrytí a regiony

Pokrýváme všech 14 krajů České republiky:
Praha, Středočeský, Jihočeský, Plzeňský, Karlovarský, Ústecký, Liberecký, Královéhradecký, Pardubický, Vysočina, Jihomoravský, Olomoucký, Zlínský, Moravskoslezský.

Každý kraj má vlastní stránku s regionálními cenovými daty a místně specifickými informacemi (např. v Praze cena bytu 2+kk pohybuje kolem 110–145 tisíc Kč/m², ve Středočeském kraji kolem 65–85 tisíc Kč/m², v Ústeckém kraji 35–50 tisíc Kč/m²; údaje aktualizovány Q1 2026).

## Garance

- **Cena nezávazné nabídky platí 14 dnů.**
- **Žádná provize ani poplatky** — vše hradíme my.
- **Záloha až 500 000 Kč** k dispozici při podpisu smlouvy.
- **Plná částka do 14 dnů** od podpisu po zápisu do katastru.
- **Bez prohlídek cizími lidmi** — zachováváme diskrétnost.
- **Právní servis zajištěný advokátem.**

## Slovník hlavních pojmů

- **Exekuce** — nucený výkon rozhodnutí soudu nebo veřejnoprávního orgánu, vede ji soudní exekutor (Exekutorská komora ČR).
- **Dražba** — veřejný prodej zájemcům, regulováno zákonem o veřejných dražbách.
- **Věcné břemeno** — právní zatížení nemovitosti ve prospěch třetí osoby (např. doživotní užívání).
- **Spoluvlastnický podíl** — ideální zlomek vlastnictví; lze prodat samostatně.
- **Advokátní úschova** — depozitum peněz u advokáta dle pravidel ČAK.
- **Katastr nemovitostí** — vede ČÚZK; vlastnictví se mění zápisem do KN.
- **List vlastnictví (LV)** — výpis z KN dokládající vlastnictví.
- **PENB** — průkaz energetické náročnosti budovy, povinný při prodeji.
- **Vklad do katastru** — právní úkon, kterým se mění vlastnictví; lhůta katastru je obvykle 20–30 dnů.

## Citované zdroje

- Český úřad zeměměřický a katastrální (ČÚZK) — katastr nemovitostí, zápisy vlastnictví: https://www.cuzk.cz
- Finanční správa ČR — daň z příjmů z prodeje nemovitosti: https://www.financnisprava.cz
- Český statistický úřad (ČSÚ) — cenové statistiky realitního trhu: https://www.czso.cz
- Exekutorská komora ČR — Centrální evidence exekucí: https://www.ekcr.cz
- Česká advokátní komora — pravidla advokátní úschovy: https://www.cak.cz
- Insolvenční rejstřík (ISIR) — ověření insolvence: https://isir.justice.cz
- Občanský zákoník (89/2012 Sb.): https://www.zakonyprolidi.cz/cs/2012-89
- Česká národní banka (ČNB) — sazby a hypoteční trh: https://www.cnb.cz
`;

export async function GET(): Promise<Response> {
  return new Response(LLMS_FULL_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
