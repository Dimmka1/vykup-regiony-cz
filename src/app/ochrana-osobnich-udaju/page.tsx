import type { Metadata } from "next";
import { DynamicPhone } from "@/components/dynamic-phone";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/ochrana-osobnich-udaju",
  },
  title: "Ochrana osobních údajů",
  description:
    "Zásady ochrany osobních údajů a zpracování cookies na webu vykoupim-nemovitost.cz.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <div className="space-y-2 leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default function OchranaOsobnichUdajuPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <article className="mx-auto max-w-3xl space-y-8 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Ochrana osobních údajů
        </h1>

        <Section title="1. Správce údajů">
          <p>
            Správcem osobních údajů je{" "}
            <strong>
              fyzická osoba provozující webové stránky vykoupim-nemovitost.cz
            </strong>{" "}
            (dále jen &bdquo;správce&ldquo;).
          </p>
          <p>
            Kontaktní e-mail:{" "}
            <a
              href="mailto:info@vykoupim-nemovitost.cz"
              className="text-brand-700 underline hover:text-brand-500"
            >
              info@vykoupim-nemovitost.cz
            </a>
            <br />
            Telefon:{" "}
            <DynamicPhone className="text-brand-700 underline hover:text-brand-500" />
          </p>
        </Section>

        <Section title="2. Účel zpracování">
          <p>Osobní údaje zpracováváme za těmito účely:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Zpracování poptávky a poskytnutí nezávazné nabídky</li>
            <li>Komunikace s klientem</li>
            <li>Plnění smluvních povinností</li>
            <li>Zlepšování služeb a analýza návštěvnosti webu</li>
          </ul>
        </Section>

        <Section title="3. Právní základ">
          <p>Zpracování osobních údajů probíhá na základě:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Souhlasu subjektu údajů (čl. 6 odst. 1 písm. a) GDPR)</li>
            <li>
              Plnění smlouvy nebo opatření před uzavřením smlouvy (čl. 6 odst. 1
              písm. b) GDPR)
            </li>
            <li>Oprávněného zájmu správce (čl. 6 odst. 1 písm. f) GDPR)</li>
          </ul>
        </Section>

        <Section title="4. Práva subjektu údajů">
          <p>Jako subjekt údajů máte právo:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Na přístup ke svým osobním údajům</li>
            <li>Na opravu nepřesných údajů</li>
            <li>Na výmaz údajů (&bdquo;právo být zapomenut&ldquo;)</li>
            <li>Na omezení zpracování</li>
            <li>Na přenositelnost údajů</li>
            <li>Vznést námitku proti zpracování</li>
            <li>
              Podat stížnost u Úřadu pro ochranu osobních údajů (
              <a
                href="https://www.uoou.cz"
                className="text-brand-700 underline hover:text-brand-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.uoou.cz
              </a>
              )
            </li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          <p>
            Tento web používá cookies pro zajištění správného fungování webu a
            analýzu návštěvnosti. Cookies jsou malé textové soubory ukládané ve
            vašem prohlížeči.
          </p>
          <p>Používáme následující typy cookies:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Nezbytné cookies</strong> - nutné pro fungování webu
            </li>
            <li>
              <strong>Analytické cookies</strong> - pomáhají nám pochopit, jak
              web používáte
            </li>
          </ul>
          <p>
            Souhlas s cookies můžete kdykoli odvolat vymazáním cookies ve svém
            prohlížeči.
          </p>
        </Section>

        <Section title="6. Kontakt">
          <p>
            V případě dotazů ohledně zpracování osobních údajů nás kontaktujte:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              E-mail:{" "}
              <a
                href="mailto:info@vykoupim-nemovitost.cz"
                className="text-brand-700 underline hover:text-brand-500"
              >
                info@vykoupim-nemovitost.cz
              </a>
            </li>
            <li>
              Telefon:{" "}
              <a
                href="tel:+420776424145"
                className="text-brand-700 underline hover:text-brand-500"
              >
                +420 776 424 145
              </a>
            </li>
          </ul>
        </Section>

        <p className="border-t border-gray-100 pt-4 text-sm text-gray-500">
          Tyto zásady jsou platné od <strong>1.3.2026</strong> a mohou být
          průběžně aktualizovány.
        </p>
      </article>
    </main>
  );
}
