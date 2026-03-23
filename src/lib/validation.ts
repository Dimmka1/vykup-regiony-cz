/**
 * Shared Czech form validation patterns and normalizers.
 */

/** Matches Czech phone: optional +420/00420 prefix, 9 digits in groups of 3 */
export const CZ_PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

/** Matches Czech postal code: 3 digits, optional space, 2 digits */
export const CZ_POSTAL_CODE_REGEX = /^\d{3}\s?\d{2}$/;

/** Strip non-phone characters, cap length */
export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+\s]/g, "").slice(0, 20);
}

/** Format postal code as "XXX XX" */
export function normalizePostalCode(rawPostalCode: string): string {
  const digits = rawPostalCode.replace(/\D/g, "").slice(0, 5);
  if (digits.length <= 3) {
    return digits;
  }
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}
