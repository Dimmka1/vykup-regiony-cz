import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { safeJsonLd } from "@/lib/jsonld";
import { BLOG_POSTS } from "./data";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/blog" },
  title: "Blog | Výkup nemovitostí — rady a tipy",
  description:
    "Praktické rady a tipy pro prodej nemovitosti. Články o rychlém výkupu, exekucích, hypotékách a dalších tématech.",
};

function BlogJsonLd(): React.ReactElement {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog | Výkup nemovitostí — rady a tipy",
    description:
      "Praktické rady a tipy pro prodej nemovitosti. Články o rychlém výkupu, exekucích, hypotékách a dalších tématech.",
    url: "https://vykoupim-nemovitost.cz/blog",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: BLOG_POSTS.length,
      itemListElement: BLOG_POSTS.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://vykoupim-nemovitost.cz/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}

interface BlogCardProps {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly date: string;
  readonly readingTime: string;
}

function BlogCard({
  slug,
  title,
  excerpt,
  date,
  readingTime,
}: BlogCardProps): React.ReactElement {
  const formattedDate = new Date(date).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-emerald-200 sm:p-8">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <time dateTime={date}>{formattedDate}</time>
        <span>·</span>
        <span>{readingTime} čtení</span>
      </div>
      <h2 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-emerald-700 sm:text-xl">
        <Link href={`/blog/${slug}`}>{title}</Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 sm:text-base">
        {excerpt.length > 150 ? `${excerpt.slice(0, 150)}…` : excerpt}
      </p>
      <Link
        href={`/blog/${slug}`}
        className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
      >
        Číst dál
        <span className="ml-1 transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </article>
  );
}

export default function BlogPage(): React.ReactElement {
  return (
    <>
      <BlogJsonLd />
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
          </div>

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Blog o výkupu nemovitostí
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Praktické články a rady pro každého, kdo zvažuje prodej
              nemovitosti.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                readingTime={post.readingTime}
              />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
            <Link
              href="/caste-dotazy"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Časté dotazy
            </Link>
          </div>
        </div>
      </section>
      <LeadMagnetCta />
    </>
  );
}
