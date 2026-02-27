import type { MetadataRoute } from "next";
import { getDefaultRegion, listRegions } from "@/lib/config";

function normalizeHost(host: string): string {
  return host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
}

function isPublicHost(host: string): boolean {
  return !host.endsWith(".localhost") && !host.includes("localhost");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const hostToRegionKey = new Map<string, string>();

  hostToRegionKey.set("vykup-regiony.cz", getDefaultRegion().key);

  listRegions().forEach((region) => {
    region.hosts.forEach((host) => {
      const normalized = normalizeHost(host);
      if (isPublicHost(normalized)) {
        hostToRegionKey.set(normalized, region.key);
      }
    });
  });

  return Array.from(hostToRegionKey.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([host]) => ({
      url: `https://${host}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: host === "vykup-regiony.cz" ? 1 : 0.9,
    }));
}
