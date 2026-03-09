import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AllRegionsSectionClient } from "@/components/all-regions-section-client";
import { TestimonialCard } from "@/components/testimonial-card";
import {
  getAllTestimonials,
  getCoveredSituations,
  getSituationLabel,
} from "@/data/testimonials";

export default function ReferencePage() {
  const testimonials = getAllTestimonials();
  const situations = getCoveredSituations();

  return (
    <>
      {/* Hero */}
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
            Reference našich klientů
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Přečtěte si příběhy lidí, kterým jsme pomohli vyřešit složité
            životní situace rychlým a férovým výkupem nemovitosti.
          </p>

          {/* Situation tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {situations.map((situation) => (
              <span
                key={situation}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200"
              >
                {getSituationLabel(situation)}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-extrabold text-[var(--theme-400)]">
                {testimonials.length}+
              </p>
              <p className="text-sm text-slate-400">spokojených klientů</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[var(--theme-400)]">
                {situations.length}
              </p>
              <p className="text-sm text-slate-400">typů situací</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[var(--theme-400)]">
                14
              </p>
              <p className="text-sm text-slate-400">krajů ČR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variant="light"
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-[var(--theme-900)] py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Řešíte podobnou situaci?
          </h2>
          <p className="mb-8 text-lg text-slate-300">
            Kontaktujte nás a do 24 hodin vám pošleme nezávaznou nabídku.
            Pomůžeme vám stejně jako stovkám klientů před vámi.
          </p>
          <Link
            href="/#kontakt"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--theme-600)] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[var(--theme-700)]"
          >
            Získat nezávaznou nabídku
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <AllRegionsSectionClient />
    </>
  );
}
