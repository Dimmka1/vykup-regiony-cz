import { RegionLinksSection } from "@/components/region-links-section";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BLOG_POSTS } from "./data";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/blog" },
  title: "Blog o výkupu nemovitostí",
  description:
    "Tipy, rady a novinky ze světa výkupu nemovitostí v České republice. Zjistěte vše o rychlém prodeji nemovitosti.",
};

export default function BlogPage(): React.ReactElement {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Blog o výkupu nemovitostí
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Praktické články a rady pro každého, kdo zvažuje prodej nemovitosti.
          </p>

          <div className="mt-10 space-y-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("cs-CZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{post.readingTime} čtení</span>
                </div>
                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  {post.title}
                </h2>
                <p className="mt-2 leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-emerald-600">
                  Číst článek →
                </span>
              </Link>
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
      <RegionLinksSection />
    </>
  );
}
