import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { AllRegionsSectionClient } from "@/components/all-regions-section-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reference | Vykoupím Nemovitost",
  description:
    "Přečtěte si skutečné reference od klientů, kterým jsme pomohli s rychlým výkupem nemovitostí v celé České republice.",
};

interface Testimonial {
  name: string;
  city: string;
  situation: string;
  quote: string;
  rating: 4 | 5;
}

const testimonials: Testimonial[] = [
  {
    name: "Jana Procházková",
    city: "Praha 4",
    situation: "Exekuce",
    quote:
      "Díky rychlému výkupu jsem se zbavila exekuce a mohla začít znovu. Celý proces trval jen 3 týdny a jednání bylo vždy férové a transparentní. Vřele doporučuji každému v podobné situaci.",
    rating: 5,
  },
  {
    name: "Martin Dvořák",
    city: "Brno",
    situation: "Rozvod",
    quote:
      "Při rozvodu jsme potřebovali rychle vyřešit společnou nemovitost. Nabídka přišla do 24 hodin a byla výrazně lepší, než jsem čekal. Ušetřilo nám to měsíce tahanic.",
    rating: 5,
  },
  {
    name: "Hana Šimková",
    city: "Ústí nad Labem",
    situation: "Dědictví",
    quote:
      "Zdědila jsem byt po babičce, ale neměla jsem prostředky na jeho opravu. Výkup proběhl hladce, peníze byly na účtu do týdne od podpisu smlouvy. Profesionální přístup.",
    rating: 5,
  },
  {
    name: "Petr Novotný",
    city: "Ostrava",
    situation: "Rychlý prodej",
    quote:
      "Potřeboval jsem prodat byt kvůli stěhování do zahraničí. Klasický prodej přes realitku by trval měsíce. Tady jsem měl hotovo za 14 dní. Bezproblémová komunikace od začátku do konce.",
    rating: 5,
  },
  {
    name: "Lucie Králová",
    city: "Plzeň",
    situation: "Exekuce",
    quote:
      "Měla jsem dluhy a hrozila mi dražba. Ozvala jsem se a během pár dní jsme se dohodli na ceně, která mi pomohla splatit závazky. Jednali se mnou s respektem, nikdo mě netlačil.",
    rating: 4,
  },
  {
    name: "Tomáš Veselý",
    city: "Liberec",
    situation: "Dědictví",
    quote:
      "S bratrem jsme zdědili dům, ale neshodli jsme se na jeho využití. Výkup byl pro nás ideální řešení — spravedlivá cena a žádné dohady. Celý proces trval pouhé 3 týdny.",
    rating: 5,
  },
  {
    name: "Eva Marková",
    city: "České Budějovice",
    situation: "Rozvod",
    quote:
      "Po rozvodu jsem chtěla rychle prodat dům a začít novou kapitolu. Ocenění bylo realistické, smlouva přehledná a peníze přišly včas. Konečně jsem měla klid.",
    rating: 5,
  },
  {
    name: "Jiří Kučera",
    city: "Hradec Králové",
    situation: "Rychlý prodej",
    quote:
      "Prodával jsem starší byt, který potřeboval rekonstrukci. Nikdo z kupujících nechtěl čekat. Zde mi dali férovou nabídku i bez oprav a vše vyřídili za dva týdny.",
    rating: 4,
  },
];

const averageRating =
  Math.round(
    (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) *
      10,
  ) / 10;

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

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <StarRating rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-slate-600">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="font-semibold text-slate-900">{testimonial.name}</p>
        <p className="text-sm text-slate-500">
          {testimonial.city} &middot; {testimonial.situation}
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
