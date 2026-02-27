import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Výkup Regiony CZ
        </Link>
        <a
          href="tel:+420XXXXXXXXX"
          className="text-sm font-medium text-brand-700 hover:text-brand-500"
        >
          +420 XXX XXX XXX
        </a>
      </div>
    </header>
  );
}
