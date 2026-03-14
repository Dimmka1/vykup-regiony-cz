import Link from "next/link";
import { ChevronRight, Star, ShieldCheck } from "lucide-react";
import { AllRegionsSectionClient } from "@/components/all-regions-section-client";
import { testimonials, averageRating } from "@/data/testimonials";
import type { Testimonial } from "@/data/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reference | Vykoupím Nemovitost",
  description:
    "Přečtěte si skutečné reference od klientů, kterým jsme pomohli s rychlým výkupem nemovitostí v celé České republice.",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Hodnocení: ${rating} z 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Ověřený zákazník
    </span>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <StarRating rating={testimonial.rating} />
        <VerifiedBadge />
      </div>
      <blockquote className="mt-4 flex-1 text-slate-600">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="font-semibold text-slate-900">{testimonial.name}</p>
        <p className="text-sm text-slate-500">
          {testimonial.city}, {testimonial.date} &middot;{" "}
          {testimonial.situation}
        </p>
      </div>
    </article>
  );
}

export default function ReferencePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Vykoupím Nemovitost",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: testimonials.length.toString(),
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
      },
      datePublished: t.dateISO,
      reviewBody: t.quote,
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            Reference od našich klientů
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Přečtěte si, jak jsme pomohli desítkám klientů po celé České
            republice s rychlým a férovým výkupem nemovitostí.
          </p>

          {/* Summary stats */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{averageRating} / 5</span>
            </div>
            <span className="text-slate-400">
              {testimonials.length} hodnocení od spokojených klientů
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* CTA */}
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
    </>
  );
}
