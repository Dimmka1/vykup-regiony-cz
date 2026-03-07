/**
 * Fraud scoring module for lead submissions.
 *
 * Returns a score 0-100; higher = more suspicious.
 * Leads with score >70 are flagged as fraudulent.
 */

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "dispostable.com",
  "mailnesia.com",
  "trashmail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "maildrop.cc",
  "10minutemail.com",
]);

/** Czech phone: +420 or 00420 prefix + 9 digits */
const CZ_PHONE_REGEX = /^(\+420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

/** Czech PSČ: 5 digits, optionally with a space after the 3rd */
const CZ_PSC_REGEX = /^\d{3}\s?\d{2}$/;

export interface FraudScoringInput {
  name?: string;
  email?: string;
  phone?: string;
  postalCode?: string;
  /** Time in ms between form mount and submit */
  fillTimeMs?: number;
}

export interface FraudScore {
  score: number;
  reasons: string[];
  isFraud: boolean;
}

export function calculateFraudScore(input: FraudScoringInput): FraudScore {
  let score = 0;
  const reasons: string[] = [];

  // Disposable email domain (+10)
  if (input.email) {
    const domain = input.email.split("@")[1]?.toLowerCase();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      score += 10;
      reasons.push("disposable_email");
    }
  }

  // Name too short: <2 chars (+20)
  if (input.name !== undefined && input.name.trim().length < 2) {
    score += 20;
    reasons.push("short_name");
  }

  // Fill time <3s (+30)
  if (
    input.fillTimeMs !== undefined &&
    input.fillTimeMs > 0 &&
    input.fillTimeMs < 3000
  ) {
    score += 30;
    reasons.push("fast_fill");
  }

  // PSČ doesn't match Czech format (+20)
  if (input.postalCode && !CZ_PSC_REGEX.test(input.postalCode.trim())) {
    score += 20;
    reasons.push("invalid_psc");
  }

  // Phone doesn't match Czech format (+30)
  if (input.phone && !CZ_PHONE_REGEX.test(input.phone.trim())) {
    score += 30;
    reasons.push("invalid_phone");
  }

  return {
    score: Math.min(score, 100),
    reasons,
    isFraud: score > 70,
  };
}
