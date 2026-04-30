import type { Metric } from "web-vitals";

interface WebVitalPayload {
  event: "web_vitals";
  web_vital_name: string;
  web_vital_value: number;
  web_vital_rating: string;
  web_vital_id: string;
  web_vital_delta: number;
}

function sendToDataLayer(metric: Metric): void {
  if (typeof window === "undefined") {
    return;
  }

  const dl = window.dataLayer ?? [];
  window.dataLayer = dl;

  const payload: WebVitalPayload = {
    event: "web_vitals",
    web_vital_name: metric.name,
    web_vital_value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value,
    ),
    web_vital_rating: metric.rating,
    web_vital_id: metric.id,
    web_vital_delta: Math.round(
      metric.name === "CLS" ? metric.delta * 1000 : metric.delta,
    ),
  };

  (dl as unknown[]).push(payload);
}

export function registerWebVitals(): void {
  void import("web-vitals").then(({ onCLS, onLCP, onINP, onTTFB, onFCP }) => {
    onCLS(sendToDataLayer);
    onLCP(sendToDataLayer);
    onINP(sendToDataLayer);
    onTTFB(sendToDataLayer);
    onFCP(sendToDataLayer);
  });
}
