"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const GTM_ID = "GTM-PSS7C6RD";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
const SKLIK_ID = process.env.NEXT_PUBLIC_SKLIK_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

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

function pushConsentEvent(consent: ConsentState) {
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: "cookie_consent_update",
    cookie_consent: consent,
  });
}

/* ------------------------------------------------------------------ */
/*  Conversion events (fires on /dekujeme)                            */
/* ------------------------------------------------------------------ */

function ConversionEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/dekujeme") return;

    if (META_PIXEL_ID && window.fbq) {
      window.fbq("track", "Lead");
    }

    if (GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
      });
    }
  }, [pathname]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Partytown-powered tracking scripts (rendered after consent)       */
/* ------------------------------------------------------------------ */

function AnalyticsScripts({
  analytics,
  marketing,
}: {
  analytics: boolean;
  marketing: boolean;
}) {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) return null;

  return (
    <>
      {/* --- GTM (analytics or marketing) --- */}
      {(analytics || marketing) && (
        <Script
          id="gtm-worker"
          strategy="worker"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            `,
          }}
        />
      )}
      {(analytics || marketing) && (
        <Script
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          strategy="worker"
        />
      )}

      {/* --- GA4 --- */}
      {analytics && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="worker"
          />
          <Script
            id="ga4-init"
            strategy="worker"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `,
            }}
          />
        </>
      )}

      {/* --- Microsoft Clarity --- */}
      {analytics && CLARITY_ID && (
        <Script
          id="clarity-init"
          strategy="worker"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `,
          }}
        />
      )}

      {/* --- Meta Pixel --- */}
      {marketing && META_PIXEL_ID && (
        <>
          <Script
            id="meta-pixel"
            strategy="worker"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* --- Google Ads gtag --- */}
      {marketing && GOOGLE_ADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="worker"
          />
          <Script
            id="google-ads-gtag"
            strategy="worker"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `,
            }}
          />
        </>
      )}

      {/* --- Seznam Sklik retargeting --- */}
      {marketing && SKLIK_ID && (
        <Script
          id="sklik-retargeting"
          strategy="worker"
          dangerouslySetInnerHTML={{
            __html: `
              var seznam_retargeting_id = ${SKLIK_ID};
              (function(){var s=document.createElement("script");
              s.type="text/javascript";s.async=true;
              s.src="https://c.imedia.cz/retargeting.js";
              var ss=document.getElementsByTagName("script")[0];
              ss.parentNode.insertBefore(s,ss);})();
            `,
          }}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Cookie Consent Banner                                             */
/* ------------------------------------------------------------------ */

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [consentGiven, setConsentGiven] = useState<ConsentState | null>(null);

  useEffect(() => {
    const existing = getConsentCookie();
    if (existing) {
      pushConsentEvent(existing);
      setConsentGiven(existing);
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
      setConsentGiven(consent);
      setVisible(false);
    },
    [],
  );

  return (
    <>
      {/* Render Partytown scripts only after consent */}
      {consentGiven && (
        <AnalyticsScripts
          analytics={consentGiven.analytics}
          marketing={consentGiven.marketing}
        />
      )}
      <ConversionEvents />

      {visible && (
        <div className="fixed inset-x-0 bottom-0 z-[9999] p-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  🍪 Tento web používá cookies
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Používáme cookies pro základní fungování webu, měření
                  návštěvnosti a cílení reklamy. Své preference můžete kdykoliv
                  změnit.{" "}
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
      )}
    </>
  );
}
