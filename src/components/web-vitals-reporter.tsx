"use client";

import { useEffect } from "react";

/**
 * Reports Core Web Vitals (LCP, CLS, INP, TTFB) to GA4 via gtag().
 *
 * web-vitals library doesn't set any cookies — it only reads browser
 * Performance APIs. However, we only send metrics when gtag is loaded
 * (which requires analytics consent via cookie-consent.tsx).
 *
 * To view in GA4:
 *   1. GA4 → Reports → Realtime → Event name: "web_vitals"
 *   2. GA4 → Configure → Custom definitions → create custom dimensions for:
 *      - metric_name (event parameter: metric_name)
 *      - metric_id (event parameter: metric_id)
 *   3. Create custom metric for:
 *      - metric_value (event parameter: metric_value, unit: standard)
 *      - metric_delta (event parameter: metric_delta, unit: standard)
 *   4. GA4 → Explore → Free-form report filtering by event "web_vitals"
 */
function sendToGA4(metric: {
  name: string;
  value: number;
  id: string;
  delta: number;
}) {
  if (typeof window === "undefined") return;

  // Use dataLayer (GTM) as primary — works with existing GTM setup
  const dataLayer = (window as any).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push({
      event: "web_vitals",
      metric_name: metric.name,
      metric_value: Math.round(
        metric.name === "CLS" ? metric.delta * 1000 : metric.delta,
      ),
      metric_id: metric.id,
      metric_delta: metric.delta,
    });
    return;
  }

  // Fallback: direct gtag call
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("event", "web_vitals", {
      metric_name: metric.name,
      metric_value: Math.round(
        metric.name === "CLS" ? metric.delta * 1000 : metric.delta,
      ),
      metric_id: metric.id,
      metric_delta: metric.delta,
    });
  }
}

export function WebVitalsReporter() {
  useEffect(() => {
    import("web-vitals").then(({ onLCP, onCLS, onINP, onTTFB }) => {
      onLCP(sendToGA4);
      onCLS(sendToGA4);
      onINP(sendToGA4);
      onTTFB(sendToGA4);
    });
  }, []);

  return null;
}
