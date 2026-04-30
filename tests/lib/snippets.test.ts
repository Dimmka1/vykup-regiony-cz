import { describe, it, expect } from "vitest";

interface Snippet {
  page: string;
  title: string;
  description: string;
}

/**
 * Source-of-truth snippets. When rewriting SEO copy in the matching
 * page files, also update this list — the assertions below guarantee
 * each snippet stays within Google's SERP rendering thresholds.
 */
const SNIPPETS: ReadonlyArray<Snippet> = [
  {
    page: "/vykup-pri-exekuci",
    title: "Výkup nemovitosti v exekuci — vyplaceno do 7 dnů, dluhy uhradíme",
    description:
      "Vykoupíme byt či dům zatížený exekucí — diskrétně, bez provize. Splatíme exekuci z kupní ceny, peníze na účtu do 48 h. 200+ vyřešených případů.",
  },
  {
    page: "/vykup-bytu",
    title: "Výkup bytů za hotové — nabídka do 24 h, vyplaceno do 14 dnů",
    description:
      "Rychlý odkup bytu po celé ČR — Praha, Brno, Ostrava i menší města. Bez provize, peníze na účtu do 14 dnů. Vykupujeme i byty s hypotékou nebo nájemníky.",
  },
  {
    page: "/vykup-domu",
    title: "Výkup rodinných domů — férová cena, vyplaceno do 7 dnů",
    description:
      "Vykoupíme rodinný dům v jakémkoli stavu. Staré domy, k rekonstrukci, se zástavou — bez provize. Nabídka do 24 h, peníze do 7 dnů.",
  },
  {
    page: "/blog/jak-rychle-prodat-nemovitost",
    title: "Jak rychle prodat nemovitost (2026): 7 dnů vs. 6 měsíců",
    description:
      "Návod jak prodat byt nebo dům za 7 dnů. Postup, ceny 2026, daně. Srovnání výkupu, realitky a dražby. Reálné případy z celé ČR.",
  },
  {
    page: "/blog/vykup-v-exekuci",
    title: "Výkup nemovitosti v exekuci 2026 — postup, dokumenty, daně",
    description:
      "Praktický návod, jak prodat nemovitost zatíženou exekucí: postup krok za krokem, dokumenty, daňové dopady, srovnání výkupu a dražby.",
  },
];

describe("SERP snippet lengths", () => {
  for (const s of SNIPPETS) {
    it(`${s.page}: title 20–65 chars, description 80–160 chars`, () => {
      expect(s.title.length).toBeGreaterThan(20);
      expect(s.title.length).toBeLessThanOrEqual(65);
      expect(s.description.length).toBeGreaterThan(80);
      expect(s.description.length).toBeLessThanOrEqual(160);
    });
  }
});
