import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold">Výkup Regiony CZ</p>
            <p className="mt-1 text-sm text-slate-400">IČO: [bude doplněno]</p>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/ochrana-osobnich-udaju"
              className="text-slate-300 hover:text-white"
            >
              Ochrana osobních údajů
            </Link>
            <Link href="/cookies" className="text-slate-300 hover:text-white">
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
