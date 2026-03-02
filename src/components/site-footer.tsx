import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

function RegionCrossLinks() {
  const regions = listRegions();
  return (
    <div className="mt-8">
      <p className="mb-3 text-sm font-semibold text-slate-300">
        Výkup nemovitostí v regionech
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {regions.map((r) => (
          <li key={r.key}>
            <a
              href={getRegionSubdomainUrl(r.key)}
              className="text-slate-400 transition hover:text-white"
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
    <footer className="bg-slate-900 pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white">Výkup Nemovitostí</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Česká republika
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +420 800 123 001
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@vykup-regiony.cz
              </span>
            </div>
          </div>
          <nav aria-label="Patička" className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/kraje"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Kde působíme
            </Link>
            <Link
              href="/reference"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Reference
            </Link>
            <Link
              href="/caste-dotazy"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Časté dotazy
            </Link>
            <Link
              href="/blog"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Blog
            </Link>
            <Link
              href="/vykup-pri-exekuci"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup při exekuci
            </Link>
            <Link
              href="/vykup-pri-dedictvi"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup při dědictví
            </Link>
            <Link
              href="/vykup-pri-rozvodu"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup při rozvodu
            </Link>
            <Link
              href="/vykup-spoluvlastnickeho-podilu"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup spoluvlastnického podílu
            </Link>
            <Link
              href="/vykup-nemovitosti-s-hypotekou"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup s hypotékou
            </Link>
            <Link
              href="/vykup-nemovitosti-s-vecnym-bremenem"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup s věcným břemenem
            </Link>
            <Link
              href="/vykup-bytu"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup bytů
            </Link>
            <Link
              href="/vykup-domu"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup domů
            </Link>
            <Link
              href="/vykup-pozemku"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Výkup pozemků
            </Link>
            <Link
              href="/ochrana-osobnich-udaju"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Ochrana osobních údajů
            </Link>
            <Link
              href="/cookies"
              className="inline-flex min-h-[44px] items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Cookies
            </Link>
          </nav>
        </div>
        <RegionCrossLinks />
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © 2026 Výkup Nemovitostí. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
