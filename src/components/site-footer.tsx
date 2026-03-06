import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

const linkClass =
  "text-sm text-slate-400 hover:text-white transition-colors duration-300";

function RegionCrossLinks() {
  const regions = listRegions();
  return (
    <div className="mt-12">
      <p className="mb-4 text-sm font-semibold text-slate-300">
        Výkup nemovitostí v regionech
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {regions.map((r) => (
          <li key={r.key}>
            <a
              href={getRegionSubdomainUrl(r.key)}
              className="text-slate-400 transition-colors duration-300 hover:text-white"
            >
              {r.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              Výkup Nemovitostí
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Rychlý a férový výkup nemovitostí v celé České republice. Nabídka
              do 24 hodin, peníze na účtu do 3 dnů.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Navigace</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/jak-to-funguje" className={linkClass}>
                Jak to funguje
              </Link>
              <Link href="/kraje" className={linkClass}>
                Kde působíme
              </Link>
              <Link href="/reference" className={linkClass}>
                Reference
              </Link>
              <Link href="/caste-dotazy" className={linkClass}>
                Časté dotazy
              </Link>
              <Link href="/blog" className={linkClass}>
                Blog
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Služby</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/vykup-pri-exekuci" className={linkClass}>
                Výkup při exekuci
              </Link>
              <Link href="/vykup-pri-dedictvi" className={linkClass}>
                Výkup při dědictví
              </Link>
              <Link href="/vykup-nemovitosti-s-hypotekou" className={linkClass}>
                Výkup s hypotékou
              </Link>
              <Link
                href="/vykup-spoluvlastnickeho-podilu"
                className={linkClass}
              >
                Výkup spoluvlastnického podílu
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Kontakt</h3>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4" /> Česká republika
              </span>
              <a
                href="tel:+420776424145"
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-white"
              >
                <Phone className="h-4 w-4" /> +420 776 424 145
              </a>
            </div>
          </div>
        </div>

        <RegionCrossLinks />

        <div
          className="mt-12 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"
          aria-hidden="true"
        />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
          <p>© 2026 Výkup Nemovitostí. Všechna práva vyhrazena.</p>
          <div className="flex gap-6">
            <Link
              href="/ochrana-osobnich-udaju"
              className="text-slate-400 transition-colors duration-300 hover:text-white"
            >
              Ochrana údajů
            </Link>
            <Link
              href="/cookies"
              className="text-slate-400 transition-colors duration-300 hover:text-white"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
