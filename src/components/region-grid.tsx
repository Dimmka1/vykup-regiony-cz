import type { ReactElement } from "react";
import { MapPin } from "lucide-react";
import { listRegions, getRegionUrl } from "@/lib/config";
import { ScrollReveal } from "@/components/scroll-reveal";

interface RegionGridProps {
  currentHost: string | null;
}

export function RegionGrid({ currentHost }: RegionGridProps): ReactElement {
  const regions = listRegions();

  return (
    <section className="section-md bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-[1400px] px-6">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-600)]">
              14 krajů České republiky
            </p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
              Vyberte svůj kraj
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Působíme po celé ČR — vyberte svůj region a získejte nabídku šitou
              na míru vašemu kraji
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {regions.map((region) => (
              <a
                key={region.key}
                href={getRegionUrl(region.key, currentHost)}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[var(--theme-300)] hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-50)] text-[var(--theme-600)] transition-colors group-hover:bg-[var(--theme-100)]">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-[var(--theme-700)]">
                    {region.name}
                  </p>
                  <p className="text-sm text-slate-500">{region.primaryCity}</p>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
