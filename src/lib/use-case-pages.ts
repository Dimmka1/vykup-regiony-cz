/**
 * Central registry of use-case page slugs and their Czech labels.
 * Used by GeoRelatedPages for internal linking mesh (VR-308).
 */

export interface UseCasePage {
  /** URL path segment, e.g. "vykup-pri-exekuci" */
  readonly slug: string;
  /** Czech human-readable label */
  readonly label: string;
}

/**
 * All use-case pages that support ?kraj= geo-parameterization.
 * Order matters for display priority.
 */
export const USE_CASE_PAGES: readonly UseCasePage[] = [
  { slug: "vykup-pri-exekuci", label: "Výkup při exekuci" },
  { slug: "vykup-pri-dedictvi", label: "Výkup při dědictví" },
  { slug: "vykup-pri-rozvodu", label: "Výkup při rozvodu" },
  {
    slug: "vykup-spoluvlastnickeho-podilu",
    label: "Výkup spoluvlastnického podílu",
  },
  { slug: "vykup-nemovitosti-s-hypotekou", label: "Výkup s hypotékou" },
  {
    slug: "vykup-nemovitosti-s-vecnym-bremenem",
    label: "Výkup s věcným břemenem",
  },
  { slug: "vykup-bytu", label: "Výkup bytu" },
  { slug: "vykup-domu", label: "Výkup domu" },
  { slug: "vykup-pozemku", label: "Výkup pozemku" },
  { slug: "zpetny-najem", label: "Zpětný nájem" },
] as const;
