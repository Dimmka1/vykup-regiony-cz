import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const STORE_PATH = "/tmp/drip-leads.json";

export interface DripLead {
  email: string;
  created_at: string;
  drip_sent: number[];
}

export function getAllLeads(): DripLead[] {
  try {
    const raw = readFileSync(STORE_PATH, "utf-8").trim();
    if (!raw) return [];
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as DripLead);
  } catch {
    return [];
  }
}

export function addLead(email: string): void {
  const lead: DripLead = {
    email,
    created_at: new Date().toISOString(),
    drip_sent: [],
  };
  appendFileSync(STORE_PATH, JSON.stringify(lead) + "\n");
}

export function saveAllLeads(leads: DripLead[]): void {
  const data = leads.map((l) => JSON.stringify(l)).join("\n") + "\n";
  writeFileSync(STORE_PATH, data);
}
