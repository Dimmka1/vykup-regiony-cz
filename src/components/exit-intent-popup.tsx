"use client";

import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { CZ_PHONE_REGEX, normalizePhone } from "@/lib/validation";

const LS_KEY_SHOWN = "exit_popup_shown";
const LS_KEY_FORM_SUBMITTED = "form_submitted";
const SCROLL_THRESHOLD = 0.6;
function getRegionFromUrl(): string {
  if (typeof window === "undefined") return "cesko";

  // 1. Subdomain: praha.vykoupim-nemovitost.cz → praha
  const hostParts = window.location.hostname.split(".");
  if (hostParts.length > 2) {
    const subdomain = hostParts[0];
    if (subdomain && subdomain !== "www") return subdomain;
  }

  // 2. Path: /praha/cokoliv → praha
  const pathSegment = window.location.pathname.split("/")[1];
  if (pathSegment && pathSegment.length > 1) return pathSegment;

  // 3. Query: ?region=praha → praha
  const params = new URLSearchParams(window.location.search);
  const regionParam = params.get("region");
  if (regionParam) return regionParam;

  // 4. Fallback
  return "cesko";
}

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

export function ExitIntentPopup(): ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const triggeredRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    if (triggeredRef.current || wasAlreadyShown() || wasFormSubmitted()) return;
    // Don't show if cookie consent banner is still visible
    try {
      if (!document.cookie.includes("cookie_consent=")) return;
    } catch {
      /* noop */
    }
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

  const handleClose = useCallback((): void => setVisible(false), []);

  // Focus trap: keep focus within the dialog
  useEffect(() => {
    if (!visible) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusFirst = () => {
      const firstEl = dialog.querySelector<HTMLElement>(focusableSelector);
      firstEl?.focus();
    };
    // Focus first element on open
    focusFirst();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, handleClose]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!CZ_PHONE_REGEX.test(phone.trim())) {
      setPhoneError("Zadejte telefon ve formátu +420 777 123 456");
      return;
    }

    setPhoneError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "callback",
          phone: phone.trim(),
          source: "exit_popup",
          region: getRegionFromUrl(),
        }),
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
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-b-none max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-2xl"
      >
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
              Nechte nám telefon a my vám zavoláme s nabídkou - nezávazně a
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
                  onChange={(e) => {
                    setPhone(normalizePhone(e.target.value));
                    if (phoneError) setPhoneError("");
                  }}
                  required
                />
                {phoneError && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {phoneError}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600" role="alert">
                  Nepodařilo se odeslat. Zkuste to znovu.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="min-h-12 w-full rounded-lg bg-[var(--theme-600)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
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
