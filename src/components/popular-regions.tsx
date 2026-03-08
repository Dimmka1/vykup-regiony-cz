import Link from "next/link";
import { MapPin } from "lucide-react";
import { getRegionSubdomainUrl, isProductionHost } from "@/lib/config";
import { ScrollReveal } from "@/components/scroll-reveal";

const POPULAR_REGIONS = [
  { key: "praha", name: "Praha", label: "Výkup v Praze" },
  { key: "jihomoravsky-kraj", name: "Brno", label: "Výkup v Brně" },
  { key: "moravskoslezsky-kraj", name: "Ostrava", label: "Výkup v Ostravě" },
  { key: "plzensky-kraj", name: "Plzeň", label: "Výkup v Plzni" },
  { key: "liberecky-kraj", name: "Liberec", label: "Výkup v Liberci" },
  { key: "olomoucky-kraj", name: "Olomouc", label: "Výkup v Olomouci" },
  {
    key: "jihocesky-kraj",
    name: "České Budějovice",
    label: "Výkup v Č. Budějovicích",
  },
  {
    key: "kralovehradecky-kraj",
    name: "Hradec Králové",
    label: "Výkup v Hradci",
  },
] as const;

interface PopularRegionsProps {
  currentHost: string | null;
}

export function PopularRegions({ currentHost }: PopularRegionsProps) {
  const isProd = isProductionHost(currentHost);

  return (
    <section className="section-md bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-[1400px] px-6">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-600)]">
              Populární lokality
            </p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Nejčastěji vykupujeme v těchto městech
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
              Působíme ve všech 14 krajích ČR. Zde jsou lokality, kde řešíme
              nejvíce výkupů.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {POPULAR_REGIONS.map((region, idx) => {
            const href = isProd
              ? getRegionSubdomainUrl(region.key)
              : `/${region.key}`;

            return (
              <ScrollReveal key={region.key} delay={idx * 50}>
                <a
                  href={href}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-[var(--theme-200)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-50)] text-[var(--theme-700)] transition-colors group-hover:bg-[var(--theme-100)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-[var(--theme-700)]">
                      {region.name}
                    </p>
                    <p className="text-xs text-slate-500">{region.label}</p>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>
        <ScrollReveal delay={400}>
          <div className="mt-8 text-center">
            <Link
              href="/kraje"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
            >
              Zobrazit všechny kraje →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
