import type { Metadata } from "next";
import { DynamicPhone } from "@/components/dynamic-phone";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/cookies",
  },
  title: "Cookies",
  description: "Informace o používání cookies na webu vykoupim-nemovitost.cz.",
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

const COOKIES_TABLE = [
  {
    name: "cookie_consent",
    provider: "vykoupim-nemovitost.cz",
    purpose: "Uložení preferencí cookies",
    type: "Nezbytné",
    expiry: "1 rok",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Měření návštěvnosti",
    type: "Analytické",
    expiry: "2 roky",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    purpose: "Rozlišení uživatelů",
    type: "Analytické",
    expiry: "2 roky",
  },
  {
    name: "_gid",
    provider: "Google Analytics",
    purpose: "Rozlišení uživatelů",
    type: "Analytické",
    expiry: "24 hodin",
  },
  {
    name: "_gcl_au",
    provider: "Google Ads",
    purpose: "Konverzní měření",
    type: "Marketingové",
    expiry: "90 dní",
  },
  {
    name: "_fbp",
    provider: "Meta Pixel",
    purpose: "Cílení reklamy",
    type: "Marketingové",
    expiry: "90 dní",
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <article className="mx-auto max-w-3xl space-y-8 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Cookies</h1>

        <Section title="Co jsou cookies?">
          <p>
            Za účelem zlepšení služeb využívají naše stránky soubory cookies.
            Cookies jsou malé soubory, které ukládají informace ve Vašem
            prohlížeči.
          </p>
        </Section>

        <Section title="Co cookies dělají a jak je zakázat?">
          <p>
            Cookies jsou na stránkách vykoupim-nemovitost.cz užity za účelem
            měření návštěvnosti webu, cílení reklamy a přizpůsobení zobrazení
            webových stránek. Cookies pro měření návštěvnosti a přizpůsobení
            zobrazení webových stránek jsou zpracovávány na základě oprávněného
            zájmu správce. Cookies pro cílení reklamy jsou zpracovávány pouze na
            základě Vámi uděleného souhlasu.
          </p>
          <p>
            Informace shromážděné pomocí cookies nám neumožňují identifikovat
            Vaše jméno, kontaktní údaje nebo jiné osobní identifikační údaje,
            pokud se nám je nerozhodnete sami poskytnout.
          </p>
          <p>
            Webové stránky lze používat i v režimu, který neumožňuje sbírání
            údajů o chování návštěvníků webu — můžete stále používat naše webové
            stránky, ale přístup k některým funkcím a oblastem může být omezen.
            Přesný postup odmítnutí/zakázání cookies se liší v závislosti na
            používaném internetovém prohlížeči a naleznete jej v nápovědě svého
            prohlížeče.
          </p>
        </Section>

        <Section title="Kdo cookies využívá?">
          <p>
            Provozovatelem webové stránky vykoupim-nemovitost.cz je fyzická
            osoba provozující webové stránky vykoupim-nemovitost.cz. Vaše osobní
            údaje zpracováváme jako správce, tedy určujeme, jak budou osobní
            údaje zpracovávány a za jakým účelem, po jak dlouhou dobu a určujeme
            případné další zpracovatele.
          </p>
        </Section>

        <Section title="Kteří zpracovatelé to jsou?">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Google Analytics</strong> (Google Ireland Limited, Gordon
              House, Barrow Street, Dublin 4, Ireland) — měření návštěvnosti.
              Zásady:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--theme-600)] underline hover:text-[var(--theme-700)]"
              >
                policies.google.com/privacy
              </a>
            </li>
            <li>
              <strong>Google Ads</strong> (Google Ireland Limited) — remarketing
              a konverze. Zásady:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--theme-600)] underline hover:text-[var(--theme-700)]"
              >
                policies.google.com/privacy
              </a>
            </li>
            <li>
              <strong>Meta Pixel</strong> (Meta Platforms Ireland Limited,
              Merrion Road, Dublin 4, Ireland) — cílení reklamy na Facebooku a
              Instagramu. Zásady:{" "}
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--theme-600)] underline hover:text-[var(--theme-700)]"
              >
                facebook.com/privacy/policy
              </a>
            </li>
          </ul>
        </Section>

        <Section title="Jaké cookies naše weby využívají?">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="whitespace-nowrap py-2 pr-4 font-semibold text-gray-900">
                    Název
                  </th>
                  <th className="whitespace-nowrap py-2 pr-4 font-semibold text-gray-900">
                    Poskytovatel
                  </th>
                  <th className="whitespace-nowrap py-2 pr-4 font-semibold text-gray-900">
                    Účel
                  </th>
                  <th className="whitespace-nowrap py-2 pr-4 font-semibold text-gray-900">
                    Typ
                  </th>
                  <th className="whitespace-nowrap py-2 font-semibold text-gray-900">
                    Expirace
                  </th>
                </tr>
              </thead>
              <tbody>
                {COOKIES_TABLE.map((cookie) => (
                  <tr
                    key={cookie.name}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs text-gray-800">
                      {cookie.name}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4 text-gray-600">
                      {cookie.provider}
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      {cookie.purpose}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4 text-gray-600">
                      {cookie.type}
                    </td>
                    <td className="whitespace-nowrap py-2 text-gray-600">
                      {cookie.expiry}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Jak změnit nastavení cookies?">
          <p>
            Nastavení cookies můžete kdykoliv změnit kliknutím na tlačítko
            &bdquo;Nastavení cookies&ldquo; v patičce webu. Nebo je můžete
            zakázat přímo v nastavení Vašeho prohlížeče.
          </p>
        </Section>

        <Section title="Kontakt">
          <p>
            Pokud se na nás budete chtít obrátit ohledně zpracování cookies,
            kontaktujte nás na e-mailu{" "}
            <a
              href="mailto:info@vykoupim-nemovitost.cz"
              className="text-[var(--theme-600)] underline hover:text-[var(--theme-700)]"
            >
              info@vykoupim-nemovitost.cz
            </a>{" "}
            nebo na telefonu{" "}
            <DynamicPhone className="text-[var(--theme-600)] underline hover:text-[var(--theme-700)]" />
            .
          </p>
        </Section>
      </article>
    </main>
  );
}
