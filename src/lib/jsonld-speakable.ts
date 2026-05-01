/**
 * Speakable schema helpers.
 *
 * Speakable is a structured-data type that explicitly tells voice assistants
 * and AI engines (Google AI Overview, Gemini, Assistant) which sections of
 * a page are the most extractable answer for a given query. In 2026 it has
 * become one of the clearest technical signals available for telling AI
 * retrieval systems precisely which part of your content to extract and cite.
 *
 * The pattern: render a regular page, mark the answer block with a stable
 * CSS selector (we use `data-speakable="quick-answer"` plus the H1 selector),
 * then inject SpeakableSpecification JSON-LD pointing at those selectors.
 *
 * We pin selectors to data-attributes (not class names) so visual refactors
 * can change Tailwind classes without breaking the speakable contract.
 */

interface SpeakableInput {
  /**
   * The canonical URL of the page (used as @id and url on the WebPage wrapper).
   */
  readonly pageUrl: string;
  /**
   * One-line page name (matches H1).
   */
  readonly name: string;
  /**
   * CSS selectors that point at the speakable block(s). Default targets the
   * page H1 and the quick-answer data attribute.
   */
  readonly cssSelector?: readonly string[];
  /**
   * Optional fallback to xpath if the consumer needs more precision.
   * Most pages don't need this.
   */
  readonly xpath?: readonly string[];
}

const DEFAULT_SELECTORS = ["h1", '[data-speakable="quick-answer"]'] as const;

/**
 * Build a WebPage JSON-LD with a SpeakableSpecification embedded.
 *
 * Why WebPage rather than a bare SpeakableSpecification: Google's docs
 * recommend embedding speakable inside the entity schema (Article / WebPage)
 * rather than a standalone block. Article-typed pages should compose this
 * with their existing Article schema rather than render both.
 */
export function buildSpeakableWebPageJsonLd(
  input: SpeakableInput,
): Record<string, unknown> {
  const selectors = input.cssSelector ?? DEFAULT_SELECTORS;

  const speakable: Record<string, unknown> = {
    "@type": "SpeakableSpecification",
    cssSelector: selectors,
  };
  if (input.xpath && input.xpath.length > 0) {
    speakable.xpath = input.xpath;
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": input.pageUrl,
    url: input.pageUrl,
    name: input.name,
    inLanguage: "cs-CZ",
    isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
    speakable,
  };
}

/**
 * Standalone SpeakableSpecification — for pages that already have a richer
 * primary schema (e.g. Article on blog posts) and just want to attach the
 * speakable block separately.
 */
export function buildSpeakableSpec(
  selectors: readonly string[] = DEFAULT_SELECTORS,
): Record<string, unknown> {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: selectors,
  };
}

/** Stable data-attribute used to mark the speakable Quick Answer block. */
export const SPEAKABLE_DATA_ATTR = "quick-answer";
