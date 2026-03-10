"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactElement,
} from "react";

/* ─── constants ─── */
const MIN_SPLATKA = 5_000;
const MAX_SPLATKA = 50_000;
const DEFAULT_SPLATKA = 15_000;

const MIN_ROKY = 1;
const MAX_ROKY = 30;
const DEFAULT_ROKY = 20;

/* ─── helpers ─── */
function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function pushGtmEvent(): void {
  if (typeof window === "undefined") return;
  const win = window as unknown as {
    dataLayer?: Array<Record<string, unknown>>;
  };
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push({ event: "mortgage_calculator_used" });
  }
}

/* ─── component ─── */
export function MortgageMotivator(): ReactElement {
  const [splatka, setSplatka] = useState(DEFAULT_SPLATKA);
  const [roky, setRoky] = useState(DEFAULT_ROKY);
  const [hasCalculated, setHasCalculated] = useState(false);
  const gtmFiredRef = useRef(false);

  const totalRemaining = splatka * roky * 12;

  /* fire GTM once when user interacts */
  const fireGtm = useCallback(() => {
    if (!gtmFiredRef.current) {
      gtmFiredRef.current = true;
      pushGtmEvent();
    }
  }, []);

  const handleSplatkaChange = useCallback(
    (value: number) => {
      setSplatka(value);
      setHasCalculated(true);
      fireGtm();
    },
    [fireGtm],
  );

  const handleRokyChange = useCallback(
    (value: number) => {
      setRoky(value);
      setHasCalculated(true);
      fireGtm();
    },
    [fireGtm],
  );

  /* animate bar width */
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    if (hasCalculated) {
      setBarWidth(0);
      const id = requestAnimationFrame(() => setBarWidth(100));
      return () => cancelAnimationFrame(id);
    }
  }, [hasCalculated, totalRemaining]);

  const scrollToForm = useCallback(() => {
    const el = document.getElementById("kontakt");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section className="section-md bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-6">
        {/* heading */}
        <div className="text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-600)]">
            Hypoteční kalkulačka
          </p>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            Kolik měsíčně splácíte hypotéku?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
            Zjistěte, kolik ještě zaplatíte bance — a jak se toho můžete zbavit
            do 48 hodin.
          </p>
        </div>

        {/* inputs */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {/* splátka */}
          <div>
            <label
              htmlFor="mortgage-splatka"
              className="block text-sm font-medium text-slate-700"
            >
              Měsíční splátka
            </label>
            <output
              htmlFor="mortgage-splatka"
              className="mt-1 block text-2xl font-bold text-[var(--theme-700)]"
            >
              {formatCzk(splatka)}
            </output>
            <input
              id="mortgage-splatka"
              type="range"
              min={MIN_SPLATKA}
              max={MAX_SPLATKA}
              step={1_000}
              value={splatka}
              onChange={(e) => handleSplatkaChange(Number(e.target.value))}
              className="mortgage-range mt-3 w-full"
              aria-label="Měsíční splátka hypotéky v Kč"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>{formatCzk(MIN_SPLATKA)}</span>
              <span>{formatCzk(MAX_SPLATKA)}</span>
            </div>
          </div>

          {/* roky */}
          <div>
            <label
              htmlFor="mortgage-roky"
              className="block text-sm font-medium text-slate-700"
            >
              Zbývající doba splácení
            </label>
            <output
              htmlFor="mortgage-roky"
              className="mt-1 block text-2xl font-bold text-[var(--theme-700)]"
            >
              {roky} {roky === 1 ? "rok" : roky < 5 ? "roky" : "let"}
            </output>
            <input
              id="mortgage-roky"
              type="range"
              min={MIN_ROKY}
              max={MAX_ROKY}
              step={1}
              value={roky}
              onChange={(e) => handleRokyChange(Number(e.target.value))}
              className="mortgage-range mt-3 w-full"
              aria-label="Zbývající doba splácení v letech"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>{MIN_ROKY} rok</span>
              <span>{MAX_ROKY} let</span>
            </div>
          </div>
        </div>

        {/* result visualization */}
        <div
          className={`mt-10 overflow-hidden rounded-2xl border transition-all duration-500 ${
            hasCalculated
              ? "border-[var(--theme-200)] bg-white shadow-lg"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          {/* remaining payments bar */}
          <div className="p-6 pb-4">
            <p className="text-sm font-medium text-slate-500">
              Celkem ještě zaplatíte bance
            </p>
            <p className="mt-1 text-3xl font-extrabold text-red-600 sm:text-4xl">
              {formatCzk(totalRemaining)}
            </p>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-700 ease-out"
                style={{ width: `${barWidth}%` }}
                role="progressbar"
                aria-valuenow={totalRemaining}
                aria-label="Vizualizace celkové částky zbývajících splátek"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {splatka.toLocaleString("cs-CZ")} Kč × {roky * 12} měsíců ={" "}
              {formatCzk(totalRemaining)}
            </p>
          </div>

          {/* divider */}
          <div className="relative border-t border-slate-100">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white px-3 py-0.5 text-xs font-semibold text-slate-400">
              vs
            </span>
          </div>

          {/* výkup benefit */}
          <div className="bg-gradient-to-b from-[var(--theme-50)] to-white p-6 pt-5">
            <p className="text-sm font-medium text-[var(--theme-600)]">
              S výkupem nemovitosti
            </p>
            <p className="mt-1 text-xl font-bold text-[var(--theme-800)] sm:text-2xl">
              Peníze do 48 hodin, žádné další splátky
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-[var(--theme-700)]">
                  ✓
                </span>
                Zbavíte se hypotéky — okamžitě
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-[var(--theme-700)]">
                  ✓
                </span>
                Ušetříte {formatCzk(totalRemaining)} na splátkách
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-[var(--theme-700)]">
                  ✓
                </span>
                Peníze na účtu do 48 hodin — bez čekání
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-[var(--theme-700)]">
                  ✓
                </span>
                Bez provize, právní servis zdarma
              </li>
            </ul>

            {/* CTA */}
            <button
              type="button"
              onClick={scrollToForm}
              className="cta-glow btn-ripple mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-4 text-lg font-semibold text-white transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 sm:w-auto"
            >
              Zbavte se hypotéky za 48 hodin
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
