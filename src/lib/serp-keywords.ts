export const TRACKED_KEYWORDS = [
  "výkup nemovitostí",
  "výkup bytu",
  "výkup domu",
  "rychlý prodej nemovitosti",
  "vykoupíme nemovitost",
  "prodej nemovitosti rychle",
  "výkup nemovitostí Praha",
  "výkup nemovitostí Brno",
  "vykoupim nemovitost",
  "odkup nemovitosti",
] as const;

export interface KeywordData {
  keyword: string;
  position: number;
  impressions: number;
  clicks: number;
}

export interface SerpSnapshot {
  date: string;
  keywords: KeywordData[];
}

export interface SerpHistory {
  snapshots: SerpSnapshot[];
}
