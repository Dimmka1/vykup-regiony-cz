/**
 * Hreflang helper.
 *
 * Next.js metadata's `alternates` field is REPLACED (not merged) when a page
 * defines it — so `metadata.alternates.languages` set on the root layout does
 * NOT propagate to pages that have their own `alternates: { canonical }`.
 *
 * Use `withHreflang` to wrap any page-level `alternates` so each rendered page
 * emits `<link rel="alternate" hreflang="cs" href="..."/>` and the matching
 * `x-default` link tag.
 */
import type { Metadata } from "next";

export const HREFLANG_LANGUAGES = {
  cs: "https://vykoupim-nemovitost.cz",
  "x-default": "https://vykoupim-nemovitost.cz",
} as const;

type Alternates = NonNullable<Metadata["alternates"]>;

export function withHreflang(alternates: Alternates): Alternates {
  return {
    ...alternates,
    languages: { ...HREFLANG_LANGUAGES, ...(alternates.languages ?? {}) },
  };
}
