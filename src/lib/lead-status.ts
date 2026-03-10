export const LEAD_STAGES = [
  "prijato",
  "posuzujeme",
  "nabidka",
  "jednani",
  "hotovo",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const STAGE_LABELS: Record<LeadStage, string> = {
  prijato: "Přijato",
  posuzujeme: "Posuzujeme",
  nabidka: "Nabídka",
  jednani: "Jednání",
  hotovo: "Hotovo",
};

export interface LeadStatusResponse {
  token: string;
  currentStage: LeadStage;
  stages: {
    stage: LeadStage;
    label: string;
    completedAt: string | null;
  }[];
  note?: string;
}

export function isValidStage(value: string): value is LeadStage {
  return (LEAD_STAGES as readonly string[]).includes(value);
}

export function generateLeadToken(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
