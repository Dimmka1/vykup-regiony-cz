"use client";

import dynamic from "next/dynamic";
import { useIdleLoad } from "@/hooks/use-idle-load";

const ExitIntentPopup = dynamic(
  () =>
    import("@/components/exit-intent-popup").then((mod) => mod.ExitIntentPopup),
  { ssr: false },
);

const CookieConsent = dynamic(
  () => import("@/components/cookie-consent").then((mod) => mod.CookieConsent),
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

/**
 * Non-critical layout components deferred until browser idle.
 * Exit-intent popup, cookie consent, tracking pixels, and SW registration
 * are not needed for initial interactivity — loading them idle improves INP/TBT.
 */
export function LazyLayoutExtras() {
  const ready = useIdleLoad();
  if (!ready) return null;
  return (
    <>
      <ExitIntentPopup />
      <TrackingPixels />
      <SwRegister />
      <CookieConsent />
    </>
  );
}
