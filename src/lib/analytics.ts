export type AnalyticsEventName =
  | "lead_form_submit_success"
  | "lead_form_submit_error"
  | "form_submission_success"
  | "cta_click"
  | "scroll_50"
  | "whatsapp_click"
  | "exit_popup_shown"
  | "exit_popup_submit"
  | "callback_form_open"
  | "callback_form_submit_success"
  | "callback_form_submit_error"
  | "page_not_found"
  | "form_step_1_type"
  | "form_step_2_address"
  | "form_step_3_contact"
  | "form_step_submit"
  | "phone_click"
  | "lead_magnet_download"
  | "lead_magnet_submit"
  | "form_submit"
  | "quick_estimate_psc"
  | "quick_estimate_phone_submit"
  | "calculator_najem_used"
  | "calculator_estimate"
  | "calculator_lead";

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
