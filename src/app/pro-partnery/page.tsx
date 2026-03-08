import type { ReactElement } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/pro-partnery" },
  title: "Widget kalkulačky pro partnery",
  description:
    "Vložte si na web kalkulačku ceny nemovitostí zdarma. Embed kód a instrukce pro partnerské weby.",
};

const EMBED_CODE = `<iframe
  src="https://vykoupim-nemovitost.cz/embed/kalkulacka"
  width="400"
  height="500"
  frameborder="0"
  style="border:none; max-width:100%;"
  loading="lazy"
  title="Kalkulačka ceny nemovitosti"
></iframe>`;

export default function ProPartneryPage(): ReactElement {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        Kalkulačka pro partnery
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Nabídněte návštěvníkům vašeho webu orientační odhad ceny nemovitosti.
        Widget je zcela zdarma a snadno se vkládá pomocí jednoho řádku kódu.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Náhled</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <iframe
            src="/embed/kalkulacka"
            width={400}
            height={500}
            className="mx-auto block max-w-full rounded-lg border-0"
            title="Kalkulačka ceny nemovitosti — náhled"
            loading="lazy"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">
          Kód pro vložení
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Zkopírujte následující kód a vložte ho kamkoli na svůj web.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-5 text-sm leading-relaxed text-emerald-300">
          <code>{EMBED_CODE}</code>
        </pre>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Jak to funguje</h2>
        <ol className="mt-4 list-inside list-decimal space-y-3 text-slate-700">
          <li>Zkopírujte kód výše a vložte ho do HTML stránky svého webu.</li>
          <li>
            Widget se automaticky načte a zobrazí kalkulačku ceny nemovitosti.
          </li>
          <li>
            Návštěvníci zadají kraj, typ nemovitosti a plochu — ihned uvidí
            orientační cenu.
          </li>
          <li>
            Pro přesný odhad jsou přesměrováni na{" "}
            <a
              href="https://vykoupim-nemovitost.cz"
              className="font-medium text-[var(--theme-600)] underline"
            >
              vykoupim-nemovitost.cz
            </a>
            .
          </li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">
          Tipy pro přizpůsobení
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
          <li>
            Doporučená minimální šířka: <strong>320 px</strong>, ideální:{" "}
            <strong>400 px</strong>.
          </li>
          <li>Výška 500 px stačí pro většinu případů.</li>
          <li>
            Přidejte{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
              max-width: 100%
            </code>{" "}
            pro responzivní chování na mobilech.
          </li>
        </ul>
      </section>
    </div>
  );
}
