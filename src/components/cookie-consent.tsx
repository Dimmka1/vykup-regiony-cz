"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const GTM_ID = "GTM-PSS7C6RD";

function getConsentCookie(): ConsentState | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]*)/);
    if (match) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch {
    // ignore
  }
  return null;
}

function setConsentCookie(consent: ConsentState) {
  const value = encodeURIComponent(JSON.stringify(consent));
  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `cookie_consent=${value};expires=${expires};path=/;SameSite=Lax`;
}

function loadGTM() {
  if (document.getElementById("gtm-script")) return;
  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });
  document.head.appendChild(script);
}

function pushConsentEvent(consent: ConsentState) {
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: "cookie_consent_update",
    cookie_consent: consent,
  });
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getConsentCookie();
    if (existing) {
      pushConsentEvent(existing);
      if (existing.analytics || existing.marketing) {
        loadGTM();
      }
    } else {
      setVisible(true);
    }
  }, []);

  const saveConsent = useCallback(
    (analyticsVal: boolean, marketingVal: boolean) => {
      const consent: ConsentState = {
        necessary: true,
        analytics: analyticsVal,
        marketing: marketingVal,
        timestamp: new Date().toISOString(),
      };
      setConsentCookie(consent);
      pushConsentEvent(consent);
      if (analyticsVal || marketingVal) {
        loadGTM();
      }
      setVisible(false);
    },
    [],
  );

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-4">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              🍪 Tento web používá cookies
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Používáme cookies pro základní fungování webu, měření návštěvnosti
              a cílení reklamy. Své preference můžete kdykoliv změnit.{" "}
              <Link
                href="/cookies"
                className="underline hover:text-[var(--theme-600)]"
              >
                Více informací
              </Link>
            </p>
          </div>

          {showSettings && (
            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
              {/* Nezbytné */}
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Nezbytné
                  </span>
                  <p className="text-xs text-gray-500">
                    Nutné pro fungování webu. Nelze vypnout.
                  </p>
                </div>
              </label>

              {/* Analytické */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[var(--theme-600)] focus:ring-[var(--theme-500)]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Analytické
                  </span>
                  <p className="text-xs text-gray-500">
                    Měření návštěvnosti (Google Analytics). Pomáhají nám
                    zlepšovat web.
                  </p>
                </div>
              </label>

              {/* Marketingové */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[var(--theme-600)] focus:ring-[var(--theme-500)]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Marketingové
                  </span>
                  <p className="text-xs text-gray-500">
                    Cílení reklamy (Meta Pixel, Google Ads). Zobrazují
                    relevantní nabídky.
                  </p>
                </div>
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => saveConsent(true, true)}
              className="rounded-lg bg-[var(--theme-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
            >
              Přijmout vše
            </button>
            {showSettings ? (
              <button
                onClick={() => saveConsent(analytics, marketing)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              >
                Uložit nastavení
              </button>
            ) : (
              <button
                onClick={() => setShowSettings(true)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              >
                Nastavení
              </button>
            )}
            <button
              onClick={() => saveConsent(false, false)}
              className="text-sm text-gray-500 underline transition hover:text-gray-700"
            >
              Pouze nezbytné
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
