import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <Breadcrumbs items={[{ label: "Stránka nenalezena", href: "/404" }]} />

        <div className="mt-8">
          <span className="text-7xl font-bold text-slate-200">404</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Stránka nenalezena
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Omlouváme se, ale hledaná stránka neexistuje nebo byla přesunuta.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--theme-600)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            Zpět na hlavní stránku
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Nebo nám zavolejte:{" "}
          <a
            href="tel:+420776424145"
            className="font-medium text-[var(--theme-600)] transition-colors hover:text-[var(--theme-700)]"
          >
            +420 776 424 145
          </a>
        </p>
      </div>
    </section>
  );
}
