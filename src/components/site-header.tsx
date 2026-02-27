import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav
        aria-label="Hlavní navigace"
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2"
      >
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center text-lg font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          aria-label="Výkup Regiony CZ — domovská stránka"
        >
          Výkup Regiony CZ
        </Link>
        <a
          href="tel:+420XXXXXXXXX"
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-brand-700 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          aria-label="Zavolat na +420 XXX XXX XXX"
        >
          +420 XXX XXX XXX
        </a>
      </nav>
    </header>
  );
}
