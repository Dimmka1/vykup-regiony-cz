import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AllRegionsSectionClient } from "@/components/all-regions-section-client";
import { GoogleReviews } from "@/components/google-reviews";
import { fetchGoogleReviews } from "@/lib/google-reviews";
import { safeJsonLd } from "@/lib/jsonld";

const COMPANY_NAME = "Vykoupím Nemovitost";

export default async function ReferencePage() {
  const reviewsData = await fetchGoogleReviews();

  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <nav aria-label="Drobečková navigace" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Domů
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="font-medium text-white">Reference</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Reference
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Podívejte se, co o nás říkají naši klienti na Google.
          </p>
        </div>
      </section>

      {/* ===== GOOGLE REVIEWS ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <GoogleReviews />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Chcete nezávaznou nabídku?
        </h2>
        <p className="mb-8 text-slate-600">
          Kontaktujte nás a do 24 hodin vám pošleme první nabídku.
        </p>
        <Link
          href="/#kontakt"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--theme-700)] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[var(--theme-800)]"
        >
          Přejít na kontaktní formulář
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      <AllRegionsSectionClient />

      {reviewsData.totalReviews > 0 && reviewsData.rating > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: COMPANY_NAME,
              url: "https://vykoupim-nemovitost.cz/reference",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: reviewsData.rating.toString(),
                bestRating: "5",
                worstRating: "1",
                ratingCount: reviewsData.totalReviews.toString(),
              },
            }),
          }}
        />
      )}
    </>
  );
}
