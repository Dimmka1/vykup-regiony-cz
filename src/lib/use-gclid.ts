/**
 * gclid capture utility (VR-206)
 *
 * Captures gclid from URL query param on landing,
 * persists in sessionStorage for form submission.
 */

const STORAGE_KEY = "gclid";

/** Call on page load to capture gclid from URL */
export function captureGclid(): void {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get("gclid");
    if (gclid) {
      sessionStorage.setItem(STORAGE_KEY, gclid);
    }
  } catch {
    /* SSR guard / storage unavailable */
  }
}

/** Get stored gclid value */
export function getGclid(): string {
  if (typeof window === "undefined") return "";

  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}
