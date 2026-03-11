"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactElement,
  type FormEvent,
} from "react";
import { MapPin, ArrowRight, Loader2, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const CZ_POSTAL_CODE_REGEX = /^\d{3}\s?\d{2}$/;

function normalizePostalCode(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 5);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

/** Deterministic daily counter: seeded by date, returns 3-8 */
function getDailyRequestCount(): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  return 3 + (seed % 6); // 3-8
}

interface HeroMicroFormProps {
  regionName: string;
}

type MobileState = "button" | "input";

export function HeroMicroForm({
  regionName,
}: HeroMicroFormProps): ReactElement {
  const [psc, setPsc] = useState("");
  const [error, setError] = useState("");
  const [mobileState, setMobileState] = useState<MobileState>("button");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const dailyCount = getDailyRequestCount();

  useEffect(() => {
    if (mobileState === "input" && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileState]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = psc.trim();

      if (!CZ_POSTAL_CODE_REGEX.test(trimmed)) {
        setError("Zadejte PSČ ve formátu 123 45");
        return;
      }

      setError("");
      setIsSubmitting(true);

      trackEvent("hero_micro_form_submit", {
        psc: trimmed,
        region: regionName,
      });

      // Navigate to form section with PSČ pre-filled via URL param
      const digits = trimmed.replace(/\s/g, "");
      const url = new URL(window.location.href);
      url.searchParams.set("psc", digits);
      url.hash = "kontakt";
      window.history.replaceState(null, "", url.toString());

      // Dispatch custom event so LeadForm picks up the PSČ
      window.dispatchEvent(
        new CustomEvent("hero-psc-submit", { detail: { psc: trimmed } }),
      );

      // Scroll to form
      const formSection = document.getElementById("kontakt");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Reset after navigation
      setTimeout(() => setIsSubmitting(false), 1000);
    },
    [psc, regionName],
  );

  const handleMobileExpand = useCallback(() => {
    setMobileState("input");
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setPsc(normalizePostalCode(value));
      if (error) setError("");
    },
    [error],
  );

  return (
    <div className="w-full max-w-xl">
      {/* Desktop: inline PSČ field */}
      <form
        onSubmit={handleSubmit}
        className="hidden sm:block"
        aria-label="Rychlá poptávka – zadejte PSČ"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <label htmlFor="hero-psc-desktop" className="sr-only">
              PSČ vaší nemovitosti
            </label>
            <input
              ref={inputRef}
              id="hero-psc-desktop"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Zadejte PSČ (např. 150 00)"
              maxLength={6}
              value={psc}
              onChange={(e) => handleChange(e.target.value)}
              className="min-h-14 w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-base text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-[var(--theme-400)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-500)]"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cta-glow btn-ripple inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-3 text-base font-bold text-white shadow-lg transition hover:from-[var(--theme-500)] hover:to-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Zjistit cenu zdarma
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </form>

      {/* Mobile: expand button -> PSČ input */}
      <div className="sm:hidden">
        {mobileState === "button" ? (
          <button
            type="button"
            onClick={handleMobileExpand}
            className="cta-glow btn-ripple inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:from-[var(--theme-500)] hover:to-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Zjistit cenu zdarma
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="hero-micro-form-expand flex flex-col gap-2"
            aria-label="Rychlá poptávka – zadejte PSČ"
          >
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <label htmlFor="hero-psc-mobile" className="sr-only">
                PSČ vaší nemovitosti
              </label>
              <input
                ref={mobileInputRef}
                id="hero-psc-mobile"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="Zadejte PSČ (např. 150 00)"
                maxLength={6}
                value={psc}
                onChange={(e) => handleChange(e.target.value)}
                className="min-h-14 w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-base text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-[var(--theme-400)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-500)]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cta-glow btn-ripple inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:from-[var(--theme-500)] hover:to-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Zjistit cenu zdarma
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            {error && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Dynamic counter */}
      <div className="mt-3 flex items-center gap-1.5 text-sm text-white/70">
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>
          <strong className="font-semibold text-white/90">{dailyCount}</strong>{" "}
          poptávek dnes
        </span>
      </div>
    </div>
  );
}
