import Link from "next/link";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

const linkClass =
  "text-sm text-slate-400 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

function RegionCrossLinks() {
  const regions = listRegions();
  return (
    <div className="mt-14">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        Výkup nemovitostí v regionech
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
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

interface SiteFooterProps {
  phone?: string;
}

export function SiteFooter({ phone = "+420 776 424 145" }: SiteFooterProps) {
  return (
    <footer className="bg-slate-950 pb-[env(safe-area-inset-bottom)] text-white">
      {/* Top accent line */}
      <div className="via-[var(--theme-500)]/30 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        {/* Logo & description */}
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
                className="h-8 w-8 shrink-0"
                aria-hidden="true"
              >
                <circle
                  cx="256"
                  cy="256"
                  r="256"
                  fill="var(--theme-600, #10b981)"
                />
                <g transform="translate(256, 256) scale(5.12)">
                  <path
                    d="M0,-30 L-28,0 L-20,0 L-20,22 L20,22 L20,0 L28,0 Z"
                    fill="white"
                  />
                  <rect
                    x="-7"
                    y="6"
                    width="14"
                    height="16"
                    rx="1"
                    fill="var(--theme-600, #10b981)"
                  />
                </g>
              </svg>
              Výkup Nemovitostí
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Rychlý, férový a transparentní výkup nemovitostí po celé České
              republice. Bez provize, s právním servisem zdarma.
            </p>
          </div>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="bg-[var(--theme-600)]/20 flex h-10 w-10 items-center justify-center rounded-xl">
              <Phone className="h-5 w-5 text-[var(--theme-400)]" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Zavolejte nám</p>
              <p className="text-base font-semibold text-white">{phone}</p>
            </div>
          </a>
        </div>

        {/* Navigation grid */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {/* Služby */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Služby
            </h3>
            <nav aria-label="Služby" className="flex flex-col gap-3">
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
              <Link href="/vykup-cinzovnich-domu" className={linkClass}>
                Výkup činžovních domů
              </Link>
              <Link href="/vykup-pri-privatizaci" className={linkClass}>
                Výkup při privatizaci
              </Link>
            </nav>
          </div>

          {/* Typy nemovitostí */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Typy nemovitostí
            </h3>
            <nav aria-label="Typy nemovitostí" className="flex flex-col gap-3">
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
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Informace
            </h3>
            <nav aria-label="Informace" className="flex flex-col gap-3">
              <Link href="/kraje" className={linkClass}>
                Kde působíme
              </Link>
              <Link href="/caste-dotazy" className={linkClass}>
                Časté dotazy
              </Link>
              <Link href="/proc-my" className={linkClass}>
                Proč prodat nám
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
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Právní
            </h3>
            <nav aria-label="Právní" className="flex flex-col gap-3">
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
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Kontakt
            </h3>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--theme-500)]" />{" "}
                Česká republika
              </span>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Phone className="h-4 w-4 shrink-0 text-[var(--theme-500)]" />{" "}
                {phone}
              </a>
            </div>
          </div>
        </div>

        <RegionCrossLinks />

        {/* Bottom bar */}
        <div className="mt-14 border-t border-slate-800/60 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              © 2026 Výkup Nemovitostí. Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/ochrana-osobnich-udaju"
                className="text-xs text-slate-500 transition hover:text-slate-300"
              >
                Ochrana osobních údajů
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-slate-500 transition hover:text-slate-300"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
