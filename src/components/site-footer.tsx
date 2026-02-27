import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold">Výkup Regiony CZ</p>
            <p className="mt-1 text-sm text-slate-400">IČO: [bude doplněno]</p>
          </div>
          <nav aria-label="Patička" className="flex gap-4 text-sm">
            <Link
              href="/ochrana-osobnich-udaju"
              className="inline-flex min-h-[44px] items-center text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Ochrana osobních údajů
            </Link>
            <Link
              href="/cookies"
              className="inline-flex min-h-[44px] items-center text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Cookies
            </Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © 2026 Výkup Regiony CZ. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
