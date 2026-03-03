/**
 * Dynamic Number Insertion (DNI) for PPC attribution.
 * Maps utm_source to tracking phone numbers via env vars.
 */

const SOURCE_ENV_MAP: Record<string, string | undefined> = {
  google: process.env.NEXT_PUBLIC_PHONE_GOOGLE,
  seznam: process.env.NEXT_PUBLIC_PHONE_SEZNAM,
  facebook: process.env.NEXT_PUBLIC_PHONE_FACEBOOK,
};

const DEFAULT_PHONE =
  process.env.NEXT_PUBLIC_PHONE_DEFAULT ?? "+420 800 123 001";

/**
 * Returns the tracking phone number for a given utm_source.
 * Falls back to NEXT_PUBLIC_PHONE_DEFAULT (or hardcoded default).
 */
export function getTrackingPhone(utmSource?: string | null): string {
  if (!utmSource) return DEFAULT_PHONE;
  const normalized = utmSource.toLowerCase();
  return SOURCE_ENV_MAP[normalized] ?? DEFAULT_PHONE;
}

const UTM_SOURCE_KEY = "dni_utm_source";

/** Persist utm_source to sessionStorage so it survives navigation. */
export function persistUtmSource(utmSource: string): void {
  try {
    sessionStorage.setItem(UTM_SOURCE_KEY, utmSource);
  } catch {
    // SSR or storage unavailable
  }
}

/** Read persisted utm_source from sessionStorage. */
export function getPersistedUtmSource(): string | null {
  try {
    return sessionStorage.getItem(UTM_SOURCE_KEY);
  } catch {
    return null;
  }
}

/** Push phone_click event to GTM dataLayer. */
export function trackPhoneClick(
  phone: string,
  source: string | null,
  region?: string,
): void {
  const w = window as unknown as {
    dataLayer?: Record<string, unknown>[];
  };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({
    event: "phone_click",
    phone,
    source: source ?? "direct",
    region: region ?? "",
  });
}
