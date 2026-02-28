import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white">Výkup Nemovitostí</p>
            <p className="mt-1 text-sm text-slate-400">IČO: [bude doplněno]</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Česká republika
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +420 XXX XXX XXX
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@vykup-regiony.cz
              </span>
            </div>
          </div>
          <nav aria-label="Patička" className="flex flex-wrap gap-4 text-sm">
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
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © 2026 Výkup Nemovitostí. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
