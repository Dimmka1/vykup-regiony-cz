import Link from "next/link";
import { generateAllPages } from "@/data/programmatic-pages";

interface ProgrammaticLinksBySituationProps {
  situationKey:
    | "exekuce"
    | "dedictvi"
    | "rozvod"
    | "hypoteka"
    | "insolvence"
    | "rychly-prodej";
}

export function ProgrammaticLinksBySituation({
  situationKey,
}: ProgrammaticLinksBySituationProps): React.ReactElement | null {
  const links = generateAllPages().filter(
    (page) => page.situation.key === situationKey,
  );

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-xl font-bold text-slate-900">Související stránky</h2>
        <p className="mt-2 text-sm text-slate-600">
          Vyberte typ nemovitosti pro přesnější řešení vaší situace.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {item.h1}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
