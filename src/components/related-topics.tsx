import Link from "next/link";
import { getRelatedPages } from "@/lib/clusters";

interface RelatedTopicsProps {
  slug: string;
}

export function RelatedTopics({
  slug,
}: RelatedTopicsProps): React.ReactElement | null {
  const pages = getRelatedPages(slug, 5);
  if (pages.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-slate-900">Související témata</h2>
      <nav aria-label="Související témata" className="mt-4 space-y-2">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="block rounded-xl border-l-4 border-emerald-500 bg-white py-3 pl-4 pr-4 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
          >
            <span className="font-semibold text-slate-900">{page.title}</span>
            <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
              {page.description}
            </p>
          </Link>
        ))}
      </nav>
    </section>
  );
}
