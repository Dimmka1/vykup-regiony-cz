"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronRight, User } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { AllRegionsSectionClient } from "@/components/all-regions-section-client";

interface Review {
  name: string;
  region: string;
  text: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    name: "Martin Novák",
    region: "Praha",
    text: "Potřeboval jsem rychle prodat byt kvůli stěhování do zahraničí. Celý proces trval pouhých 10 dní a peníze byly na účtu přesně podle dohody. Profesionální přístup od začátku do konce.",
    rating: 5,
  },
  {
    name: "Jana Svobodová",
    region: "Brno",
    text: "Po rozvodu jsem potřebovala vyřešit společnou nemovitost co nejrychleji. Výkup proběhl bez komplikací a cena byla férová. Velmi děkuji za lidský přístup v těžké situaci.",
    rating: 5,
  },
  {
    name: "Petr Dvořák",
    region: "Ostrava",
    text: "Zdědil jsem dům po rodičích, který byl ve špatném stavu. Nikdo jiný mi nenabídl rozumnou cenu, ale tady se domluvili rychle a bez zbytečného smlouvání. Doporučuji.",
    rating: 4,
  },
  {
    name: "Lucie Černá",
    region: "Plzeň",
    text: "Měla jsem byt zatížený hypotékou a bála jsem se, že to bude problém. Vše vyřešili včetně komunikace s bankou. Za dva týdny bylo hotovo a já měla klid.",
    rating: 5,
  },
  {
    name: "Tomáš Procházka",
    region: "Olomouc",
    text: "Prodával jsem spoluvlastnický podíl na domě. Situace byla komplikovaná, ale poradili si s tím skvěle. Oceňuji hlavně transparentnost a férové jednání.",
    rating: 4,
  },
  {
    name: "Eva Marková",
    region: "Liberec",
    text: "Kvůli exekuci jsem potřebovala prodat nemovitost velmi rychle. Ozvali se mi do hodiny a do týdne bylo vše vyřízeno. Zachránili mi situaci, jsem moc vděčná.",
    rating: 5,
  },
];

const REGIONS = ["Vše", ...Array.from(new Set(REVIEWS.map((r) => r.region)))];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Hodnocení ${rating} z 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-100)] text-[var(--theme-700)]">
          <User className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{review.name}</p>
          <p className="text-sm text-slate-500">{review.region}</p>
        </div>
      </div>
      <StarRating rating={review.rating} />
      <p className="leading-relaxed text-slate-600">{review.text}</p>
    </article>
  );
}

export default function ReferencePage() {
  const [activeRegion, setActiveRegion] = useState("Vše");

  const filtered =
    activeRegion === "Vše"
      ? REVIEWS
      : REVIEWS.filter((r) => r.region === activeRegion);

  const avgRating =
    REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  const aggregateRatingLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Výkup Nemovitostí",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: REVIEWS.length,
      bestRating: "5",
      worstRating: "1",
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: r.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(aggregateRatingLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumbs */}
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
            Přečtěte si, co o nás říkají lidé, kterým jsme pomohli s rychlým
            výkupem nemovitosti po celé České republice.
          </p>

          {/* Aggregate stats */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-slate-600 text-slate-600"}`}
                />
              ))}
            </div>
            <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
            <span className="text-slate-400">z {REVIEWS.length} hodnocení</span>
          </div>
        </div>
      </section>

      {/* Příběhy klientů */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Příběhy klientů
        </h2>
        <p className="mb-8 text-slate-600">
          Podívejte se na detailní příběhy lidí, kterým jsme pomohli vyřešit
          složitou životní situaci rychlým výkupem nemovitosti.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/reference/exekuce-praha",
              title: "Exekuce na byt v Praze",
              name: "Paní N.",
              summary:
                "Prodej bytu při exekuci za 7 dní. Zachránila 950 000 Kč.",
              badge: "7 dní",
            },
            {
              href: "/reference/dedictvi-brno",
              title: "Zděděný dům v Brně",
              name: "Pan S.",
              summary: "4 spoluvlastníci, 2 v zahraničí. Vyřešeno za 14 dní.",
              badge: "14 dní",
            },
            {
              href: "/reference/rozvod-ostrava",
              title: "Rozvod a byt v Ostravě",
              name: "Paní K.",
              summary: "Rychlý prodej společného bytu při rozvodu za 10 dní.",
              badge: "10 dní",
            },
          ].map((cs) => (
            <Link
              key={cs.href}
              href={cs.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[var(--theme-200)] hover:shadow-md"
            >
              <span className="mb-2 inline-flex w-fit rounded-full bg-[var(--theme-100)] px-3 py-1 text-xs font-semibold text-[var(--theme-700)]">
                {cs.badge}
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                {cs.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{cs.name}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {cs.summary}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--theme-700)]">
                Číst příběh
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Filters + Reviews */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Region tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeRegion === region
                  ? "bg-[var(--theme-700)] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500">
            Pro tento region zatím nemáme žádné reference.
          </p>
        )}
      </section>

      <AllRegionsSectionClient />
    </>
  );
}
