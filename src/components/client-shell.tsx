"use client";

import dynamic from "next/dynamic";

const ExitIntentPopup = dynamic(
  () =>
    import("@/components/exit-intent-popup").then((mod) => mod.ExitIntentPopup),
  { ssr: false },
);

const CookieConsent = dynamic(
  () => import("@/components/cookie-consent").then((mod) => mod.CookieConsent),
  { ssr: false },
);

const ScrollProgress = dynamic(
  () =>
    import("@/components/scroll-progress").then((mod) => mod.ScrollProgress),
  { ssr: false },
);

const TrackingPixels = dynamic(
  () =>
    import("@/components/tracking-pixels").then((mod) => mod.TrackingPixels),
  { ssr: false },
);

const SwRegister = dynamic(
  () => import("@/components/sw-register").then((mod) => mod.SwRegister),
  { ssr: false },
);

const WebVitalsReporter = dynamic(
  () =>
    import("@/components/web-vitals-reporter").then(
      (mod) => mod.WebVitalsReporter,
    ),
  { ssr: false },
);

export function ClientShell() {
  return (
    <>
      <ScrollProgress />
      <WebVitalsReporter />
      <ExitIntentPopup />
      <TrackingPixels />
      <SwRegister />
      <CookieConsent />
    </>
  );
}
