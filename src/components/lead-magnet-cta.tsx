import Link from "next/link";

export function LeadMagnetCta(): React.ReactElement {
  return (
    <section className="my-12 rounded-2xl bg-gradient-to-r from-[var(--theme-50)] to-[var(--theme-100)] px-6 py-10 text-center sm:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 text-3xl">📚</div>
        <h2 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">
          Zdarma: Průvodce rychlým výkupem nemovitosti
        </h2>
        <p className="mb-6 text-slate-600">
          Stáhněte si PDF průvodce a dozvíte se vše o procesu výkupu — krok za
          krokem, bez závazků.
        </p>
        <Link
          href="/pruvodce-vykupem"
          className="inline-block rounded-xl bg-[var(--theme-600)] px-8 py-3 font-semibold text-white transition-colors hover:bg-[var(--theme-700)]"
        >
          Stáhnout zdarma →
        </Link>
      </div>
    </section>
  );
}
