import { listRegions, getRegionUrl } from "@/lib/config";

interface RegionLinksSectionProps {
  currentHost?: string | null;
}

export function RegionLinksSection({ currentHost }: RegionLinksSectionProps) {
  const regions = listRegions();

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Pomáháme v celé ČR
        </h2>
        <p className="mb-6 text-sm text-slate-600">
          Rychlý výkup nemovitostí zajišťujeme ve všech 14 krajích České
          republiky.
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {regions.map((r) => (
            <li key={r.key}>
              <a
                href={getRegionUrl(r.key, currentHost ?? null)}
                className="text-teal-700 underline decoration-teal-300 underline-offset-2 transition hover:text-teal-900 hover:decoration-teal-500"
              >
                {r.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
