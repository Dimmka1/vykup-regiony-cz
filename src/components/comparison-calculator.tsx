"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactElement,
} from "react";
import {
  Check,
  Clock,
  Banknote,
  Users,
  ShieldCheck,
  TrendingUp,
  Lock,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ComparisonRow {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  vykup: string;
  realitka: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Provize",
    icon: Banknote,
    vykup: "0 %",
    realitka: "3–5 %",
  },
  {
    label: "Doba prodeje",
    icon: Clock,
    vykup: "7 dní",
    realitka: "3–6 měsíců",
  },
  {
    label: "Peníze na účtu",
    icon: TrendingUp,
    vykup: "Do 24 hodin",
    realitka: "Nejistý termín",
  },
  {
    label: "Jistota prodeje",
    icon: ShieldCheck,
    vykup: "100 %",
    realitka: "Nejistá",
  },
  {
    label: "Prohlídky",
    icon: Users,
    vykup: "Bez prohlídek",
    realitka: "Desítky prohlídek",
  },
];

const REALITKA_COMMISSION_MIN = 0.03;
const REALITKA_COMMISSION_MAX = 0.05;
const LEAD_COOKIE_NAME = "vn_lead";

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseInputValue(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(/,/g, ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function hasLeadCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${LEAD_COOKIE_NAME}=`));
}

function setLeadCookie(): void {
  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${LEAD_COOKIE_NAME}=1; expires=${expires}; path=/; SameSite=Lax`;
}

type GateState = "idle" | "preview" | "gate" | "submitting" | "full";

export function ComparisonCalculator(): ReactElement {
  const [rawValue, setRawValue] = useState("");
  const [gateState, setGateState] = useState<GateState>("idle");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const startTracked = useRef(false);

  const price = parseInputValue(rawValue);
  const commissionMin = Math.round(price * REALITKA_COMMISSION_MIN);
  const commissionMax = Math.round(price * REALITKA_COMMISSION_MAX);
  const netVykup = price;
  const netRealitkaMin = price - commissionMax;
  const netRealitkaMax = price - commissionMin;
  const savings = `${formatCzk(commissionMin)} – ${formatCzk(commissionMax)}`;

  const isReturningLead = hasLeadCookie();

  // Track calculator_start on first input
  useEffect(() => {
    if (price > 0 && !startTracked.current) {
      startTracked.current = true;
      trackEvent("calculator_start", { price });
    }
  }, [price]);

  // Transition to preview/full when price entered
  useEffect(() => {
    if (price > 0 && gateState === "idle") {
      if (isReturningLead) {
        setGateState("full");
        trackEvent("calculator_full_result", { price, returning: true });
      } else {
        setGateState("preview");
        trackEvent("calculator_preview", { price });
      }
    } else if (price === 0 && gateState !== "idle") {
      setGateState("idle");
    }
  }, [price, gateState, isReturningLead]);

  const handleGateSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError("");

      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();

      if (!trimmedEmail && !trimmedPhone) {
        setFormError("Vyplňte e-mail nebo telefon.");
        return;
      }

      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setFormError("Zadejte platný e-mail.");
        return;
      }

      if (
        trimmedPhone &&
        !/^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/.test(trimmedPhone)
      ) {
        setFormError("Zadejte platné telefonní číslo.");
        return;
      }

      setGateState("submitting");

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "calculator",
            source: "comparison-calculator",
            email: trimmedEmail,
            phone: trimmedPhone,
            price,
          }),
        });

        if (!res.ok) {
          throw new Error("API error");
        }

        trackEvent("calculator_gate_submit", { price });
        setLeadCookie();
        setGateState("full");
        trackEvent("calculator_full_result", { price });
      } catch {
        setFormError("Něco se pokazilo. Zkuste to prosím znovu.");
        setGateState("gate");
      }
    },
    [email, phone, price],
  );

  const showFullBreakdown = gateState === "full";
  const showGate =
    gateState === "preview" ||
    gateState === "gate" ||
    gateState === "submitting";

  return (
    <section className="py-16" id="srovnani">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Výkup vs. Realitka - kolik ušetříte?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
          Zadejte předpokládanou cenu nemovitosti a podívejte se na rozdíl.
        </p>

        {/* Price input */}
        <div className="mx-auto mt-8 max-w-md">
          <label
            htmlFor="comparison-price"
            className="block text-sm font-medium text-slate-700"
          >
            Odhadovaná cena nemovitosti
          </label>
          <div className="relative mt-1">
            <input
              id="comparison-price"
              type="text"
              inputMode="numeric"
              placeholder="např. 3 000 000"
              value={rawValue}
              onChange={(e) => setRawValue(e.target.value)}
              className="focus:ring-[var(--theme-500)]/30 block w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[var(--theme-500)] focus:outline-none focus:ring-2"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              Kč
            </span>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 bg-slate-50 text-center text-sm font-semibold">
            <div className="px-4 py-3 text-left text-slate-500">Kritérium</div>
            <div className="border-l border-slate-200 bg-[var(--theme-50)] px-4 py-3 text-[var(--theme-700)]">
              <span className="flex items-center justify-center gap-1">
                <Check className="h-4 w-4" /> Výkup
              </span>
            </div>
            <div className="border-l border-slate-200 px-4 py-3 text-slate-500">
              Realitka
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 border-t border-slate-100 text-sm"
            >
              <div className="flex items-center gap-2 px-4 py-3 text-slate-700">
                <row.icon className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
                {row.label}
              </div>
              <div className="bg-[var(--theme-50)]/50 flex items-center justify-center border-l border-slate-100 px-4 py-3 font-medium text-[var(--theme-700)]">
                {row.vykup}
              </div>
              <div className="flex items-center justify-center border-l border-slate-100 px-4 py-3 text-slate-500">
                {row.realitka}
              </div>
            </div>
          ))}

          {/* Net outcome row */}
          {price > 0 && (
            <div className="grid grid-cols-3 border-t-2 border-[var(--theme-200)] text-sm font-semibold">
              <div className="flex items-center px-4 py-4 text-slate-900">
                Čistý výnos
              </div>
              {showFullBreakdown ? (
                <>
                  <div className="flex flex-col items-center justify-center border-l border-[var(--theme-200)] bg-[var(--theme-50)] px-4 py-4 text-[var(--theme-700)]">
                    <span className="text-base sm:text-lg">
                      {formatCzk(netVykup)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-[var(--theme-200)] px-4 py-4 text-slate-500">
                    <span className="text-base sm:text-lg">
                      {formatCzk(netRealitkaMin)}
                    </span>
                    <span className="text-xs font-normal">
                      až {formatCzk(netRealitkaMax)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex select-none items-center justify-center border-l border-[var(--theme-200)] bg-[var(--theme-50)] px-4 py-4 text-[var(--theme-700)] blur-sm">
                    <span className="text-base sm:text-lg">
                      {formatCzk(netVykup)}
                    </span>
                  </div>
                  <div className="flex select-none items-center justify-center border-l border-[var(--theme-200)] px-4 py-4 text-slate-500 blur-sm">
                    <span className="text-base sm:text-lg">
                      {formatCzk(netRealitkaMin)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Savings preview (always visible when price > 0) */}
        {price > 0 && (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--theme-200)] bg-[var(--theme-50)] p-6 text-center">
            <p className="text-sm text-[var(--theme-700)]">
              S přímým výkupem ušetříte přibližně
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--theme-800)] sm:text-3xl">
              {savings}
            </p>
            <p className="mt-1 text-xs text-[var(--theme-600)]">
              oproti prodeji přes realitní kancelář
            </p>
          </div>
        )}

        {/* Lead capture gate */}
        {showGate && (
          <div className="mx-auto mt-6 max-w-lg">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-center gap-2 text-slate-700">
                <Lock className="h-5 w-5" />
                <span className="font-semibold">Detailní výpočet</span>
              </div>
              <p className="mb-4 text-center text-sm text-slate-600">
                Pro detailní výpočet zadejte kontakt — pošleme vám osobní
                kalkulaci
              </p>
              <form onSubmit={handleGateSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-[var(--theme-500)]/30 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--theme-500)] focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">nebo</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Telefon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="focus:ring-[var(--theme-500)]/30 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--theme-500)] focus:outline-none focus:ring-2"
                  />
                </div>
                {formError && (
                  <p className="text-center text-sm text-red-600">
                    {formError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={gateState === "submitting"}
                  className="w-full rounded-xl bg-[var(--theme-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-700)] disabled:opacity-50"
                >
                  {gateState === "submitting"
                    ? "Odesílám..."
                    : "Zobrazit detailní výpočet"}
                </button>
                <p className="text-center text-xs text-slate-400">
                  Odesláním souhlasíte se zpracováním osobních údajů.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
