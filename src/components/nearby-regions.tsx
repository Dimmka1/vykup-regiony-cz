import { MapPin } from "lucide-react";
import { getRegionByKey, getRegionUrl } from "@/lib/config";
import { getNeighborKeys } from "@/config/region-neighbors";

interface NearbyRegionsProps {
  regionKey: string;
  currentHost: string | null;
}

export function NearbyRegions({ regionKey, currentHost }: NearbyRegionsProps) {
  const neighborKeys = getNeighborKeys(regionKey, 5);
  if (neighborKeys.length === 0) return null;

  const neighbors = neighborKeys
    .map((key) => {
      const r = getRegionByKey(key);
      if (r.key !== key) return null;
      return r;
    })
    .filter(Boolean);

  if (neighbors.length === 0) return null;

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Výkup nemovitostí v okolních krajích
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {neighbors.map((r) => {
            if (!r) return null;
            const url = getRegionUrl(r.key, currentHost);
            return (
              <a
                key={r.key}
                href={url}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md"
              >
                <MapPin className="h-5 w-5 shrink-0 text-teal-600" />
                <div>
                  <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                    {r.name}
                  </span>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Výkup nemovitostí {r.locative}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
