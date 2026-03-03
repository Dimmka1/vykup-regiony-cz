import Link from "next/link";
import { MapPin } from "lucide-react";
import { FooterPhone } from "@/components/footer-phone";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

const linkClass =
  "text-sm text-slate-400 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Služby */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Služby</h3>
            <nav aria-label="Služby" className="flex flex-col gap-2">
              <Link href="/vykup-pri-exekuci" className={linkClass}>
                Výkup při exekuci
              </Link>
              <Link href="/vykup-pri-dedictvi" className={linkClass}>
                Výkup při dědictví
              </Link>
              <Link href="/vykup-pri-rozvodu" className={linkClass}>
                Výkup při rozvodu
              </Link>
              <Link
                href="/vykup-spoluvlastnickeho-podilu"
                className={linkClass}
              >
                Výkup spoluvlastnického podílu
              </Link>
              <Link href="/vykup-nemovitosti-s-hypotekou" className={linkClass}>
                Výkup s hypotékou
              </Link>
              <Link
                href="/vykup-nemovitosti-s-vecnym-bremenem"
                className={linkClass}
              >
                Výkup s věcným břemenem
              </Link>
            </nav>
          </div>

          {/* Typy nemovitostí */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              Typy nemovitostí
            </h3>
            <nav aria-label="Typy nemovitostí" className="flex flex-col gap-2">
              <Link href="/vykup-bytu" className={linkClass}>
                Výkup bytů
              </Link>
              <Link href="/vykup-domu" className={linkClass}>
                Výkup domů
              </Link>
              <Link href="/vykup-pozemku" className={linkClass}>
                Výkup pozemků
              </Link>
            </nav>
          </div>

          {/* Informace */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Informace</h3>
            <nav aria-label="Informace" className="flex flex-col gap-2">
              <Link href="/kraje" className={linkClass}>
                Kde působíme
              </Link>
              <Link href="/reference" className={linkClass}>
                Reference
              </Link>
              <Link href="/caste-dotazy" className={linkClass}>
                Časté dotazy
              </Link>
              <Link href="/garance-vykupu" className={linkClass}>
                Garance výkupu
              </Link>
              <Link href="/blog" className={linkClass}>
                Blog
              </Link>
            </nav>
          </div>

          {/* Právní */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Právní</h3>
            <nav aria-label="Právní" className="flex flex-col gap-2">
              <Link href="/ochrana-osobnich-udaju" className={linkClass}>
                Ochrana osobních údajů
              </Link>
              <Link href="/cookies" className={linkClass}>
                Cookies
              </Link>
            </nav>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Kontakt</h3>
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-400">
                <MapPin className="h-4 w-4 shrink-0" /> Česká republika
              </span>
              <FooterPhone />
            </div>
          </div>
        </div>

        <RegionCrossLinks />

        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © 2026 Výkup Nemovitostí. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
