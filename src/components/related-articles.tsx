import Link from "next/link";

export interface RelatedArticle {
  href: string;
  title: string;
  description: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({
  articles,
}: RelatedArticlesProps): React.ReactElement | null {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-slate-900">Související články</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">{article.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {article.description}
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-emerald-600">
              Číst více →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
