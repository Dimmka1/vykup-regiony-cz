import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, FileText, Search, Banknote } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import {
  generateAllPages,
  getPageBySlug,
  getRelatedPages,
  ALL_PROGRAMMATIC_SLUGS,
} from "@/data/programmatic-pages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ALL_PROGRAMMATIC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://vykoupim-nemovitost.cz/${slug}`,
    },
  };
}

const STEP_ICONS = [Phone, Search, FileText, Banknote];

export default async function ProgrammaticPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const related = getRelatedPages(slug, 6);
  const host = await getRequestHost();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Domů",
        item: "https://vykoupim-nemovitost.cz/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumbLabel,
        item: `https://vykoupim-nemovitost.cz/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      {/* Breadcrumbs */}
      <section className="bg-white pt-6">
        <div className="mx-auto max-w-3xl px-4">
          <Breadcrumbs
            items={[{ label: page.breadcrumbLabel, href: `/${slug}` }]}
          />
        </div>
      </section>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {page.h1}
          </h1>
          <p className="mt-2 text-lg font-medium text-emerald-600">
            Rychlé řešení bez provize
          </p>
          <div className="mt-8">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nezávaznou nabídku
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-lg leading-relaxed text-slate-700">{page.intro}</p>
        </div>
      </section>

      {/* Jak to funguje */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Jak to funguje</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {page.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Phone;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <Icon className="h-6 w-6 text-emerald-500" />
                  <h3 className="mt-3 font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Časté dotazy</h2>
          <div className="mt-8 space-y-4">
            {page.faq.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md"
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

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              {page.ctaTitle}
            </h2>
            <p className="mt-2 text-slate-600">{page.ctaText}</p>
            <div className="mt-6">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Chci nezávaznou nabídku
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related pages */}
      {related.length > 0 && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-xl font-bold text-slate-900">
              Související stránky
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {r.h1}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <LeadMagnetCta />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
