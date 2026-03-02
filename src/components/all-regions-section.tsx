import { MapPin } from "lucide-react";
import { listRegions, getRegionUrl } from "@/lib/config";

interface AllRegionsSectionProps {
  currentHost: string | null;
}

export function AllRegionsSection({ currentHost }: AllRegionsSectionProps) {
  const regions = listRegions();

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-center text-xl font-bold text-slate-900 sm:text-2xl">
          Pomáháme v celé ČR
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {regions.map((r) => {
            const url = getRegionUrl(r.key, currentHost);
            return (
              <a
                key={r.key}
                href={url}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-[var(--theme-200)] hover:text-[var(--theme-700)]"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--theme-500)]" />
                {r.name}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
