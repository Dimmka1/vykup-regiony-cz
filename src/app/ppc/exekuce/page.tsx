"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ExekuceFormData {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  urgencyLevel: string;
  consent: boolean;
  website: string;
}

const INITIAL_FORM: ExekuceFormData = {
  name: "",
  phone: "",
  email: "",
  propertyType: "byt",
  urgencyLevel: "mesice",
  consent: false,
  website: "",
};

const CZ_PHONE_REGEX = /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

function normalizePhone(rawPhone: string): string {
  return rawPhone.replace(/[^\d+\s]/g, "").slice(0, 16);
}

function ExekucePpcContent(): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();

  const utmSource = searchParams.get("utm_source") ?? "";
  const utmMedium = searchParams.get("utm_medium") ?? "";
  const utmCampaign = searchParams.get("utm_campaign") ?? "";
  const utmTerm = searchParams.get("utm_term") ?? "";
  const utmContent = searchParams.get("utm_content") ?? "";
  const gclid = searchParams.get("gclid") ?? "";

  const [formData, setFormData] = useState<ExekuceFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const isPhoneValid = useMemo(
    () => CZ_PHONE_REGEX.test(formData.phone.trim()),
    [formData.phone],
  );
  const isNameValid = formData.name.trim().length > 1;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      if (!isNameValid || !isPhoneValid || !formData.consent) {
        setErrorMessage(
          "Vyplňte prosím jméno, telefon a souhlas se zpracováním údajů.",
        );
        return;
      }

      setStatus("submitting");
      setErrorMessage("");

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            property_type: formData.propertyType,
            urgency_level: formData.urgencyLevel,
            consent_gdpr: formData.consent,
            website: formData.website,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_term: utmTerm,
            utm_content: utmContent,
            gclid: gclid,
            source: "ppc_exekuce",
          }),
        });

        if (!response.ok) {
          throw new Error("Lead API error");
        }

        trackEvent("lead_form_submit_success", {
          form_name: "ppc_exekuce_form",
          utm_source: utmSource,
        });

        try {
          localStorage.setItem("form_submitted", String(Date.now()));
        } catch {
          /* noop */
        }

        router.push("/dekujeme");
      } catch {
        trackEvent("lead_form_submit_error", {
          form_name: "ppc_exekuce_form",
        });
        setStatus("error");
        setErrorMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
      }
    },
    [
      formData,
      isNameValid,
      isPhoneValid,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      router,
    ],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal header */}
      <header className="border-b border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-5xl px-4">
          <span className="text-xl font-bold text-slate-900">
            Výkup Nemovitostí
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Hero */}
        <section className="mb-10 text-center sm:mb-14">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-800">
            ⚠️ Hrozí vám dražba nemovitosti?
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Nemovitost v exekuci?
            <br />
            <span className="text-[var(--theme-600)]">
              Máme řešení do 48 hodin
            </span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-slate-600">
            Vykoupíme vaši nemovitost zatíženou exekucí za férovou cenu.
            Uhradíme dluhy, vyplatíme vás a zajistíme právní servis — vše zdarma
            a bez provize.
          </p>
          <p className="mx-auto max-w-xl text-sm font-semibold text-orange-700">
            ⏰ Každý den čekání = ztráta hodnoty vaší nemovitosti
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Benefits + case study + urgency */}
          <div className="space-y-8">
            {/* Trust bullets */}
            <section aria-label="Proč nás zvolit">
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-2xl"
                    aria-hidden="true"
                  >
                    ⚡
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Řešení do 48 hodin
                    </h3>
                    <p className="text-sm text-slate-600">
                      Nabídku dostanete do 24 hodin, celý proces zvládneme za
                      dny, ne měsíce.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-2xl"
                    aria-hidden="true"
                  >
                    💰
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      80–90 % tržní hodnoty
                    </h3>
                    <p className="text-sm text-slate-600">
                      Na rozdíl od dražby (50–70 %) získáte férovou cenu. Dluhy
                      uhradíme z kupní ceny.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-2xl"
                    aria-hidden="true"
                  >
                    🛡️
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Vše vyřídíme za vás
                    </h3>
                    <p className="text-sm text-slate-600">
                      Komunikace s exekutorem, právník, odhad, smlouvy — vše na
                      naše náklady.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-2xl"
                    aria-hidden="true"
                  >
                    🤫
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      100% diskrétní
                    </h3>
                    <p className="text-sm text-slate-600">
                      Na rozdíl od veřejné dražby — o prodeji se nikdo nedozví.
                    </p>
                  </div>
                </li>
              </ul>
            </section>

            {/* Case study */}
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="mb-3 font-semibold text-slate-900">
                📋 Případ z praxe
              </h3>
              <p className="text-sm text-slate-600">
                <strong>Pan M. z Prahy</strong> — byt 3+kk, exekuce 1,2 mil. Kč,
                nařízená dražba za 6 týdnů.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-xs text-slate-500">Výkupem získal</p>
                  <p className="text-lg font-bold text-emerald-700">
                    + 2,9 mil. Kč
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-slate-500">Dražbou by dostal</p>
                  <p className="text-lg font-bold text-red-700">
                    + 1,1 mil. Kč
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-emerald-700">
                ✅ Ušetřil 1,8 mil. Kč oproti dražbě
              </p>
            </section>

            {/* Urgency block */}
            <section className="rounded-xl border-2 border-orange-200 bg-orange-50 p-5">
              <h3 className="mb-2 font-semibold text-orange-900">
                ⏰ Proč jednat HNED?
              </h3>
              <ul className="space-y-2 text-sm text-orange-800">
                <li>→ Exekutor může nařídit dražbu kdykoliv</li>
                <li>→ V dražbě přijdete o 30–50 % hodnoty nemovitosti</li>
                <li>→ Dražba je veřejná — dozví se sousedé i okolí</li>
                <li>→ Po dražbě nemáte nárok na zpětný nájem</li>
              </ul>
            </section>
          </div>

          {/* Right: Lead form */}
          <div>
            <form
              ref={formRef}
              className="space-y-4 rounded-xl bg-white p-5 shadow-lg sm:p-6"
              onSubmit={handleSubmit}
              aria-label="Formulář pro výkup při exekuci"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Získejte nabídku do 24 hodin
              </h2>
              <p className="text-sm text-slate-600">
                Nezávazně a zdarma. Ozveme se vám ještě dnes.
              </p>

              {/* Hidden UTM fields */}
              <input type="hidden" name="utm_source" value={utmSource} />
              <input type="hidden" name="utm_medium" value={utmMedium} />
              <input type="hidden" name="utm_campaign" value={utmCampaign} />
              <input type="hidden" name="utm_term" value={utmTerm} />
              <input type="hidden" name="utm_content" value={utmContent} />
              <input type="hidden" name="gclid" value={gclid} />

              <div>
                <label htmlFor="exekuce-name" className="text-sm font-medium">
                  Jméno a příjmení *
                </label>
                <input
                  id="exekuce-name"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="exekuce-phone" className="text-sm font-medium">
                  Telefon *
                </label>
                <input
                  id="exekuce-phone"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  placeholder="+420 777 123 456"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: normalizePhone(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="exekuce-email" className="text-sm font-medium">
                  E-mail
                </label>
                <input
                  id="exekuce-email"
                  type="email"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  placeholder="vas@email.cz"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="exekuce-property-type"
                  className="text-sm font-medium"
                >
                  Typ nemovitosti
                </label>
                <select
                  id="exekuce-property-type"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertyType: e.target.value,
                    }))
                  }
                >
                  <option value="byt">Byt</option>
                  <option value="dum">Dům</option>
                  <option value="pozemek">Pozemek</option>
                  <option value="podil">Podíl</option>
                  <option value="jine">Jiné</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="exekuce-urgency"
                  className="text-sm font-medium"
                >
                  Naléhavost situace
                </label>
                <select
                  id="exekuce-urgency"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  value={formData.urgencyLevel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      urgencyLevel: e.target.value,
                    }))
                  }
                >
                  <option value="dny">
                    🔴 Dražba za dny — potřebuji okamžitě
                  </option>
                  <option value="tydny">🟠 Dražba za týdny — spěchá</option>
                  <option value="mesice">
                    🟡 Mám ještě měsíce — chci začít řešit
                  </option>
                  <option value="info">🟢 Zatím zjišťuji informace</option>
                </select>
              </div>

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="exekuce-website">Website</label>
                <input
                  id="exekuce-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                />
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input
                  className="mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      consent: e.target.checked,
                    }))
                  }
                />
                Souhlasím se zpracováním osobních údajů pro účely zpětného
                kontaktu.
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex min-h-11 w-full items-center justify-center rounded bg-[var(--theme-600)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
              >
                {status === "submitting"
                  ? "Odesílám..."
                  : "🚀 Chci nezávaznou nabídku"}
              </button>

              <p className="text-center text-xs text-slate-500">
                Odpovídáme do 24 hodin. Bez závazků, bez poplatků.
              </p>

              {errorMessage ? (
                <p className="text-sm text-red-600" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        {/* Social proof */}
        <section className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Pomohli jsme desítkám klientů v exekuci zachránit jejich majetek
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-8 text-slate-700">
            <div>
              <p className="text-2xl font-bold">150+</p>
              <p className="text-xs text-slate-500">Vyřešených případů</p>
            </div>
            <div>
              <p className="text-2xl font-bold">85 %</p>
              <p className="text-xs text-slate-500">Průměrná výkupní cena</p>
            </div>
            <div>
              <p className="text-2xl font-bold">7 dnů</p>
              <p className="text-xs text-slate-500">Průměrná doba výplaty</p>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} Vykoupím Nemovitost. Všechna práva
            vyhrazena.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ExekucePpcPage(): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-500">Načítám…</p>
        </div>
      }
    >
      <ExekucePpcContent />
    </Suspense>
  );
}
