export type AnalyticsEventName =
  | "lead_form_submit_success"
  | "lead_form_submit_error"
  | "form_submission_success"
  | "cta_click"
  | "scroll_50"
  | "whatsapp_click"
  | "exit_popup_shown"
  | "exit_popup_submit";

type Primitive = string | number | boolean;

type AnalyticsEventPayload = Record<string, Primitive>;

interface DataLayerEvent extends AnalyticsEventPayload {
  event: AnalyticsEventName;
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

function getDataLayer(): DataLayerEvent[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  return window.dataLayer;
}

export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsEventPayload = {},
): void {
  const dataLayer = getDataLayer();
  if (!dataLayer) {
    return;
  }

  dataLayer.push({ event, ...payload });
}
