import { z } from "zod";

export const PARTIAL_LEAD_TTL = 48 * 60 * 60; // 48 hours in seconds
export const RECOVERY_MIN_AGE_MS = 60 * 60 * 1000; // 1 hour

export const partialLeadSchema = z.object({
  sessionId: z.string().uuid(),
  step: z.number().int().min(1).max(3),
  propertyType: z.string().optional(),
  situationType: z.string().optional(),
  region: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  smsConsent: z.boolean().optional(),
  consent: z.boolean().optional(),
});

export type PartialLeadData = z.infer<typeof partialLeadSchema>;

export interface StoredPartialLead extends PartialLeadData {
  createdAt: string;
  updatedAt: string;
  recoverySent: boolean;
}
