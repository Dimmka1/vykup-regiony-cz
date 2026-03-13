import Link from "next/link";
import { listRegions } from "@/lib/config";
import { USE_CASE_PAGES } from "@/lib/use-case-pages";

/**
 * Maximum number of "same use-case, different region" links to show.
 * Keeps the section compact while providing enough cross-linking for SEO.
 */
const MAX_REGION_LINKS = 6;

interface GeoRelatedPagesProps {
  /** Current use-case slug, e.g. "vykup-pri-exekuci" */
  currentSlug: string;
  /** Current region key from ?kraj= param, e.g. "praha" */
  currentKraj: string | null;
}

/**
 * Internal linking mesh for geo-parameterized pages (VR-308).
 *
 * Renders two groups of links:
 * 1. Same use-case, different regions (up to MAX_REGION_LINKS)
 * 2. Same region, different use-cases
 *
 * Only renders when a valid ?kraj= param is present.
 */
export function GeoRelatedPages({
  currentSlug,
  currentKraj,
}: GeoRelatedPagesProps): React.ReactElement | null {
  if (!currentKraj) return null;

  const allRegions = listRegions();
  const currentRegion = allRegions.find((r) => r.key === currentKraj);
  if (!currentRegion) return null;

  // 1. Same use-case, different regions — deterministic shuffle based on current region
  const otherRegions = allRegions
    .filter((r) => r.key !== currentKraj)
    .sort((a, b) => {
      // Use a simple hash to get a pseudo-random but stable order per region
      const hashA = simpleHash(`${currentKraj}-${a.key}`);
      const hashB = simpleHash(`${currentKraj}-${b.key}`);
      return hashA - hashB;
    })
    .slice(0, MAX_REGION_LINKS);

  // 2. Same region, different use-cases
  const otherUseCases = USE_CASE_PAGES.filter((uc) => uc.slug !== currentSlug);

  const hasRegionLinks = otherRegions.length > 0;
  const hasUseCaseLinks = otherUseCases.length > 0;

  if (!hasRegionLinks && !hasUseCaseLinks) return null;

  const currentUseCase = USE_CASE_PAGES.find((uc) => uc.slug === currentSlug);
  const useCaseLabel = currentUseCase?.label ?? currentSlug;

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <nav
          aria-label={`Související stránky: ${useCaseLabel} ${currentRegion.locative}`}
          className="space-y-8"
        >
          {hasRegionLinks && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {useCaseLabel} v dalších krajích
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {otherRegions.map((region) => (
                  <li key={region.key}>
                    <Link
                      href={`/${currentSlug}?kraj=${region.key}`}
                      className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {region.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasUseCaseLinks && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Další služby {currentRegion.locative}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {otherUseCases.map((uc) => (
                  <li key={uc.slug}>
                    <Link
                      href={`/${uc.slug}?kraj=${currentKraj}`}
                      className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {uc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>
    </section>
  );
}

/**
 * Simple numeric hash for deterministic but varied ordering.
 * Not cryptographic — just for stable shuffling.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
}
