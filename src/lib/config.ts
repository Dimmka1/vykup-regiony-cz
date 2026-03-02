import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import type { RegionConfig, RegionDataFile } from "@/lib/types";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const testimonialSchema = z.object({
  author: z.string().min(2),
  city: z.string().min(2),
  quote: z.string().min(20),
});

const regionSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  locative: z.string().min(2),
  title: z.string().min(10),
  description: z.string().min(20),
  h1: z.string().min(10),
  heroCta: z.string().min(4),
  phone: z.string().min(8),
  email: z.string().email(),
  primaryCity: z.string().min(2),
  supportedCities: z.array(z.string().min(2)).min(1),
  uspPoints: z.array(z.string().min(5)).min(3),
  faq: z.array(faqSchema).min(2),
  testimonials: z.array(testimonialSchema).min(2),
  legalDisclaimer: z.string().min(8),
  seoTitle: z.string().min(10),
  seoDescription: z.string().min(20),
  keywords: z.array(z.string().min(2)).min(1),
  hosts: z.array(z.string().min(4)).min(1),
});

const dataSchema = z.object({
  defaultRegion: z.string().min(2),
  regions: z.array(regionSchema).length(14),
});

function readYamlFile(): RegionDataFile {
  const filePath = path.join(process.cwd(), "src/data/regions.yml");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = parse(raw);
  const validated = dataSchema.parse(parsed);

  const keys = new Set<string>();
  const hosts = new Set<string>();

  validated.regions.forEach((region) => {
    if (keys.has(region.key)) {
      throw new Error(`Duplicate region key: ${region.key}`);
    }

    keys.add(region.key);

    region.hosts.forEach((host) => {
      const normalizedHost = host.toLowerCase();
      if (hosts.has(normalizedHost)) {
        throw new Error(`Duplicate host: ${normalizedHost}`);
      }
      hosts.add(normalizedHost);
    });
  });

  return validated;
}

const regionData = readYamlFile();

const regionByHost = new Map<string, RegionConfig>();
const regionByKey = new Map<string, RegionConfig>();

regionData.regions.forEach((region) => {
  regionByKey.set(region.key, region);
  region.hosts.forEach((host) => {
    regionByHost.set(host.toLowerCase(), region);
  });
});

export function getDefaultRegion(): RegionConfig {
  const defaultRegion = regionByKey.get(regionData.defaultRegion);
  if (!defaultRegion) {
    throw new Error("Default region is missing in config");
  }
  return defaultRegion;
}

export function getRegionByHost(host: string | null): RegionConfig {
  if (!host) {
    return getDefaultRegion();
  }

  const normalizedHost = host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
  return regionByHost.get(normalizedHost) ?? getDefaultRegion();
}

export function getRegionByKey(regionKey: string | null): RegionConfig {
  if (!regionKey) {
    return getDefaultRegion();
  }

  return regionByKey.get(regionKey) ?? getDefaultRegion();
}

export function listRegions(): RegionConfig[] {
  return regionData.regions;
}

const PRODUCTION_DOMAIN = "vykoupim-nemovitost.cz";

/** All region keys as a Set for fast lookup */
export const REGION_KEYS: Set<string> = new Set(
  regionData.regions.map((r) => r.key),
);

/**
 * Check if a hostname is a production domain (vykoupim-nemovitost.cz or subdomain).
 */
export function isProductionHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
  return (
    normalized === PRODUCTION_DOMAIN ||
    normalized.endsWith(`.${PRODUCTION_DOMAIN}`)
  );
}

/**
 * Get the production subdomain URL for a region.
 * Extracts the {x}.vykoupim-nemovitost.cz host from region's hosts array.
 */
export function getRegionSubdomainUrl(regionKey: string): string {
  const region = regionByKey.get(regionKey);
  if (!region) return `https://${PRODUCTION_DOMAIN}`;
  const subdomainHost = region.hosts.find(
    (h) =>
      h.endsWith(`.${PRODUCTION_DOMAIN}`) &&
      !h.startsWith("www.") &&
      !h.startsWith("dev."),
  );
  if (subdomainHost) return `https://${subdomainHost}`;
  // Praha root domain case
  if (region.hosts.includes(PRODUCTION_DOMAIN)) {
    return `https://praha.${PRODUCTION_DOMAIN}`;
  }
  return `https://${PRODUCTION_DOMAIN}`;
}

/**
 * Get the correct URL for a region based on current environment.
 * Production: subdomain URL. Dev/preview: path-based URL.
 */
export function getRegionUrl(
  regionKey: string,
  currentHost: string | null,
): string {
  if (isProductionHost(currentHost)) {
    return getRegionSubdomainUrl(regionKey);
  }
  // Dev/preview: use path-based routing
  return `/${regionKey}`;
}
