import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AllRegionsSectionClient } from "@/components/all-regions-section-client";
import { VideoTestimonialsSection } from "@/components/video-testimonials-section";

export default function ReferencePage() {
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
            Podívejte se na zkušenosti našich spokojených klientů s rychlým
            výkupem nemovitostí.
          </p>
        </div>
      </section>

      {/* AC-1: Video testimonials section with 3+ videos */}
      <VideoTestimonialsSection />

      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
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
    </>
  );
}
