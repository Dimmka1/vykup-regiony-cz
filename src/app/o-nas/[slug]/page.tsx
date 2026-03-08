import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import { AUTHORS, getAuthorBySlug, getAuthorArticles } from "@/lib/authors";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `${author.name} — O nás | Výkupím Nemovitost`,
    description: author.bio.slice(0, 160),
    alternates: { canonical: `https://vykoupim-nemovitost.cz/o-nas/${slug}` },
  };
}

export default async function AuthorPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const host = await getRequestHost();
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = getAuthorArticles(author);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: "Výkupím Nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    url: `https://vykoupim-nemovitost.cz/o-nas/${author.slug}`,
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "O nás", href: "/o-nas/" + author.slug },
                { label: author.name, href: `/o-nas/${author.slug}` },
              ]}
            />
          </div>

          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
              {author.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {author.name}
              </h1>
              <p className="mt-1 text-lg text-slate-500">{author.jobTitle}</p>
            </div>
          </div>

          <div className="prose-article mt-10 rounded-2xl bg-white p-8 shadow-sm">
            {author.bio.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {author.credentials.length > 0 && (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-8">
              <h2 className="text-xl font-bold text-slate-900">
                Odbornost a zkušenosti
              </h2>
              <ul className="mt-4 space-y-2">
                {author.credentials.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="mt-1 text-emerald-600">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {articles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Články od {author.name}
              </h2>
              <div className="mt-6 space-y-4">
                {articles.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <time
                      dateTime={post.date}
                      className="text-sm text-slate-500"
                    >
                      {new Date(post.date).toLocaleDateString("cs-CZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
