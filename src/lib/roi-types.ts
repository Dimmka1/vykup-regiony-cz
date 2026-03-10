export const CHANNELS = [
  "google_ads",
  "sklik",
  "organic",
  "referral",
  "direct",
  "social",
  "other",
] as const;

export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABELS: Record<Channel, string> = {
  google_ads: "Google Ads",
  sklik: "Sklik",
  organic: "Organic",
  referral: "Referral",
  direct: "Direct",
  social: "Social",
  other: "Other",
};

export interface ChannelData {
  channel: Channel;
  spend: number;
  leads: number;
  deals: number;
  cpl: number | null;
  cpa: number | null;
}

export interface RoiResponse {
  month: string;
  channels: ChannelData[];
  totals: {
    spend: number;
    leads: number;
    deals: number;
    cpl: number | null;
    cpa: number | null;
  };
}

export interface SpendUpdate {
  month: string;
  channel: Channel;
  spend: number;
}

/**
 * Maps utm_source values to our canonical channel names.
 */
export function mapUtmToChannel(utmSource: string): Channel {
  const src = utmSource.toLowerCase().trim();

  if (
    src === "google" ||
    src === "google_ads" ||
    src === "googleads" ||
    src === "gclid"
  ) {
    return "google_ads";
  }
  if (src === "sklik" || src === "seznam" || src === "seznam.cz") {
    return "sklik";
  }
  if (
    src === "" ||
    src === "(direct)" ||
    src === "direct" ||
    src === "(none)"
  ) {
    return "direct";
  }
  if (
    src === "organic" ||
    src === "(organic)" ||
    src === "google_organic" ||
    src === "seo"
  ) {
    return "organic";
  }
  if (
    src === "facebook" ||
    src === "instagram" ||
    src === "fb" ||
    src === "ig" ||
    src === "social"
  ) {
    return "social";
  }
  if (src === "referral" || src === "(referral)") {
    return "referral";
  }

  return "other";
}
