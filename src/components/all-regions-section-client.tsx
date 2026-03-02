"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const REGION_DATA: { key: string; name: string }[] = [
  { key: "praha", name: "Praha" },
  { key: "stredocesky-kraj", name: "Středočeský kraj" },
  { key: "jihocesky-kraj", name: "Jihočeský kraj" },
  { key: "plzensky-kraj", name: "Plzeňský kraj" },
  { key: "karlovarsky-kraj", name: "Karlovarský kraj" },
  { key: "ustecky-kraj", name: "Ústecký kraj" },
  { key: "liberecky-kraj", name: "Liberecký kraj" },
  { key: "kralovehradecky-kraj", name: "Královéhradecký kraj" },
  { key: "pardubicky-kraj", name: "Pardubický kraj" },
  { key: "vysocina", name: "Kraj Vysočina" },
  { key: "jihomoravsky-kraj", name: "Jihomoravský kraj" },
  { key: "olomoucky-kraj", name: "Olomoucký kraj" },
  { key: "moravskoslezsky-kraj", name: "Moravskoslezský kraj" },
  { key: "zlinsky-kraj", name: "Zlínský kraj" },
];

function getClientRegionUrl(regionKey: string): string {
  if (typeof window === "undefined") return `/${regionKey}`;
  const host = window.location.hostname;
  if (host.includes("vykoupim-nemovitost.cz")) {
    return `https://${regionKey}.vykoupim-nemovitost.cz/`;
  }
  return `/${regionKey}`;
}

export function AllRegionsSectionClient() {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const r of REGION_DATA) {
      map[r.key] = getClientRegionUrl(r.key);
    }
    setUrls(map);
  }, []);

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-center text-xl font-bold text-slate-900 sm:text-2xl">
          Pomáháme v celé ČR
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {REGION_DATA.map((r) => (
            <a
              key={r.key}
              href={urls[r.key] || `/${r.key}`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-[var(--theme-200)] hover:text-[var(--theme-700)]"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--theme-500)]" />
              {r.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
