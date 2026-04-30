"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
const SKLIK_ID = process.env.NEXT_PUBLIC_SKLIK_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function readConsent(): { analytics: boolean; marketing: boolean } {
  try {
    const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]*)/);
    if (!match) return { analytics: false, marketing: false };
    const parsed = JSON.parse(decodeURIComponent(match[1])) as {
      analytics?: boolean;
      marketing?: boolean;
    };
    return {
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return { analytics: false, marketing: false };
  }
}

/** Fires Meta Pixel Lead + Google Ads conversion on /dekujeme (only if marketing consent given) */
function useConversionEvents(marketingAllowed: boolean): void {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/dekujeme" || !marketingAllowed) return;

    if (META_PIXEL_ID && window.fbq) {
      window.fbq("track", "Lead");
    }

    if (GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
      });
    }
  }, [pathname, marketingAllowed]);
}

export function TrackingPixels(): React.ReactElement | null {
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    setMarketingAllowed(readConsent().marketing);
    const onConsent = () => setMarketingAllowed(readConsent().marketing);
    window.addEventListener("cookie-consent-changed", onConsent);
    return () =>
      window.removeEventListener("cookie-consent-changed", onConsent);
  }, []);

  useConversionEvents(marketingAllowed);

  if (!marketingAllowed) return null;

  return (
    <>
      {/* --- Meta Pixel --- */}
      {META_PIXEL_ID && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
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
      {GOOGLE_ADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-ads-gtag"
            strategy="afterInteractive"
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
      {SKLIK_ID && (
        <Script
          id="sklik-retargeting"
          strategy="afterInteractive"
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
