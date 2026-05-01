/**
 * Stable slug generator for FAQ Question entities.
 *
 * Each FAQ Question gets its own @id of the form
 *   https://vykoupim-nemovitost.cz/<page>#q-<slug>
 * so AI engines can cite individual Q&A pairs as standalone entities
 * rather than only the whole FAQPage. Slug is derived from the Czech
 * question text, deterministic, ASCII-safe.
 */

const CZECH_DIACRITIC_MAP: Record<string, string> = {
  á: "a",
  č: "c",
  ď: "d",
  é: "e",
  ě: "e",
  í: "i",
  ň: "n",
  ó: "o",
  ř: "r",
  š: "s",
  ť: "t",
  ú: "u",
  ů: "u",
  ý: "y",
  ž: "z",
};

export function slugifyQuestion(text: string): string {
  let s = text.toLowerCase();
  for (const [from, to] of Object.entries(CZECH_DIACRITIC_MAP)) {
    s = s.replaceAll(from, to);
  }
  return s
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Build the @id URL for a FAQ Question on a given page path.
 *
 * @param pagePath - e.g. "/caste-dotazy" (no trailing slash)
 * @param question - the Question.name string
 */
export function buildQuestionId(pagePath: string, question: string): string {
  return `https://vykoupim-nemovitost.cz${pagePath}#q-${slugifyQuestion(question)}`;
}
