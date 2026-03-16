import { getRegionByKey } from "@/lib/config";
import { getGeoUseCaseContent } from "@/data/geo-use-case-content";
import { REGION_PRICES, formatPricePerM2 } from "@/lib/price-data";
import { MapPin, TrendingUp, BarChart3, HelpCircle } from "lucide-react";

interface GeoRegionContentProps {
  /** Use-case slug, e.g. "vykup-bytu" */
  useCaseSlug: string;
  /** Region key from ?kraj= parameter */
  regionKey: string | null;
}

/**
 * Renders unique region-specific content on use-case pages when ?kraj= is present.
 * Includes: region intro, price context, local neighborhoods, market stats, and unique FAQ.
 *
 * VR-336: INDEXING BLOCKER fix — ensures ≥40% content differentiation between geo pages.
 */
export function GeoRegionContent({
  useCaseSlug,
  regionKey,
}: GeoRegionContentProps): React.ReactElement | null {
  if (!regionKey) return null;

  const region = getRegionByKey(regionKey);
  if (!region || region.key === "national") return null;

  const content = getGeoUseCaseContent(useCaseSlug, regionKey);
  if (!content) return null;

  const prices = REGION_PRICES[regionKey];

  return (
    <>
      {/* Region-specific intro & price section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            <MapPin className="mr-2 inline-block h-6 w-6 text-emerald-500" />
            {region.name}: místní přehled
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {content.regionIntro}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            {content.localContext}
          </p>
        </div>
      </section>

      {/* Price context with real numbers */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            <TrendingUp className="mr-2 inline-block h-6 w-6 text-emerald-500" />
            Aktuální ceny nemovitostí {region.locative}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {content.priceContext}
          </p>

          {prices && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Byty (Ø cena/m²)
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {formatPricePerM2(prices.bytM2)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Domy (Ø cena/m²)
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {formatPricePerM2(prices.dumM2)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Pozemky (Ø cena/m²)
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {formatPricePerM2(prices.pozemekM2)}
                </p>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-400">
            Zdroj: RealityMIX 02/2026, ČSÚ. Ceny jsou přibližné průměry za kraj.
          </p>
        </div>
      </section>

      {/* Market statistics */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            <BarChart3 className="mr-2 inline-block h-6 w-6 text-emerald-500" />
            Trh s nemovitostmi {region.locative} v číslech
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {content.marketStats}
          </p>

          {/* Region-specific rich content from regions.yml */}
          {region.marketAnalysis && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-900">
                Detailní analýza trhu
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {region.marketAnalysis}
              </p>
            </div>
          )}

          {region.neighborhoodGuide && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-900">
                Průvodce lokalitami {region.locative}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {region.neighborhoodGuide}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Region × use-case specific FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            <HelpCircle className="mr-2 inline-block h-6 w-6 text-emerald-500" />
            Časté dotazy — {region.name}
          </h2>
          <div className="mt-8 space-y-4">
            {content.faq.map((item, index) => (
              <details
                key={`geo-faq-${index}`}
                className="group rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-slate-900 marker:[content:''] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="ml-4 flex-shrink-0 text-emerald-500 transition-transform group-open:rotate-45">
                    ✚
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}

            {/* Additional FAQ from regions.yml */}
            {region.additionalFaq?.map((item, index) => (
              <details
                key={`additional-faq-${index}`}
                className="group rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-slate-900 marker:[content:''] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="ml-4 flex-shrink-0 text-emerald-500 transition-transform group-open:rotate-45">
                    ✚
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Local process info from regions.yml */}
      {region.localProcess && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-xl font-bold text-slate-900">
              Jak probíhá výkup {region.locative}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {region.localProcess}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
