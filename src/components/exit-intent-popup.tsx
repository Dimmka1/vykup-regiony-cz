"use client";

import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const LS_KEY_SHOWN = "exit_popup_shown";
const LS_KEY_FORM_SUBMITTED = "form_submitted";
const CZ_PHONE_REGEX = /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
const SCROLL_THRESHOLD = 0.6;

function wasAlreadyShown(): boolean {
  try {
    return localStorage.getItem(LS_KEY_SHOWN) !== null;
  } catch {
    return false;
  }
}

function wasFormSubmitted(): boolean {
  try {
    return localStorage.getItem(LS_KEY_FORM_SUBMITTED) !== null;
  } catch {
    return false;
  }
}

function markShown(): void {
  try {
    localStorage.setItem(LS_KEY_SHOWN, String(Date.now()));
  } catch {
    /* SSR / private mode */
  }
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+\s]/g, "").slice(0, 16);
}

export function ExitIntentPopup(): ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const triggeredRef = useRef(false);

  const show = useCallback(() => {
    if (triggeredRef.current || wasAlreadyShown() || wasFormSubmitted()) return;
    triggeredRef.current = true;
    markShown();
    setVisible(true);
    trackEvent("exit_popup_shown");
  }, []);

  // Desktop: mouseleave with clientY < 0
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (e.clientY < 0) show();
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [show]);

  // Mobile: scroll > 60%
  useEffect(() => {
    const handler = (): void => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = docHeight - viewportHeight;
      if (scrollable > 0 && scrollY / scrollable > SCROLL_THRESHOLD) {
        show();
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [show]);

  const handleClose = (): void => setVisible(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!CZ_PHONE_REGEX.test(phone.trim())) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, source: "exit_popup" }),
      });
      if (!res.ok) throw new Error("API error");
      trackEvent("exit_popup_submit", { phone_provided: true });
      try {
        localStorage.setItem(LS_KEY_FORM_SUBMITTED, String(Date.now()));
      } catch {
        /* noop */
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Nezávazná nabídka zdarma"
    >
      {/* Mobile: bottom sheet style; Desktop: centered card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-b-none sm:rounded-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
          aria-label="Zavřít"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-[var(--theme-700)]">
              Děkujeme! Ozveme se vám co nejdříve.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-2 pr-8 text-xl font-bold text-slate-900">
              Počkejte! Získejte nezávaznou nabídku zdarma
            </h2>
            <p className="mb-5 text-sm text-slate-600">
              Nechte nám telefon a my vám zavoláme s nabídkou — nezávazně a
              zdarma.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="exit-phone" className="sr-only">
                  Telefon
                </label>
                <input
                  id="exit-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+420 777 123 456"
                  className="min-h-12 w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  value={phone}
                  onChange={(e) => setPhone(normalizePhone(e.target.value))}
                  required
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600" role="alert">
                  Nepodařilo se odeslat. Zkuste to znovu.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="min-h-12 w-full rounded-lg bg-amber-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
              >
                {status === "submitting" ? "Odesílám..." : "Zavoláme vám zpět"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
