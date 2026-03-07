/**
 * In-memory lead deduplication with 24h TTL.
 * On Vercel serverless this works within one cold start.
 * Better than nothing for MVP.
 */

interface DedupEntry {
  leadId: string;
  timestamp: number;
}

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Key: normalized phone or email → entry
const dedupMap = new Map<string, DedupEntry>();

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

/** Cleanup expired entries */
function cleanup(): void {
  const now = Date.now();
  for (const [key, entry] of dedupMap) {
    if (now - entry.timestamp > TTL_MS) {
      dedupMap.delete(key);
    }
  }
}

export interface DedupResult {
  isDuplicate: boolean;
  existingLeadId?: string;
}

/**
 * Check if a lead with the same phone or email was submitted in the last 24h.
 * Returns the existing lead_id if found.
 */
export function checkDuplicate(phone?: string, email?: string): DedupResult {
  cleanup();

  if (phone) {
    const phoneKey = `phone:${normalizeKey(phone)}`;
    const existing = dedupMap.get(phoneKey);
    if (existing) {
      return { isDuplicate: true, existingLeadId: existing.leadId };
    }
  }

  if (email && email.trim()) {
    const emailKey = `email:${normalizeKey(email)}`;
    const existing = dedupMap.get(emailKey);
    if (existing) {
      return { isDuplicate: true, existingLeadId: existing.leadId };
    }
  }

  return { isDuplicate: false };
}

/**
 * Register a lead in the dedup map so future submissions
 * with the same phone/email are detected as duplicates.
 */
export function registerLead(
  leadId: string,
  phone?: string,
  email?: string,
): void {
  const now = Date.now();

  if (phone) {
    dedupMap.set(`phone:${normalizeKey(phone)}`, {
      leadId,
      timestamp: now,
    });
  }

  if (email && email.trim()) {
    dedupMap.set(`email:${normalizeKey(email)}`, {
      leadId,
      timestamp: now,
    });
  }
}
