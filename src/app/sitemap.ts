import type { MetadataRoute } from "next";
import { getDefaultRegion, listRegions } from "@/lib/config";

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "").split(":")[0];
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
      const normalizedHost = normalizeHost(host);
      if (isPublicHost(normalizedHost)) {
        hostToRegionKey.set(normalizedHost, region.key);
      }
    });
  });

  return Array.from(hostToRegionKey.entries())
    .sort(([hostA], [hostB]) => hostA.localeCompare(hostB))
    .map(([host, regionKey]) => ({
      url: `https://${host}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: host === "vykup-regiony.cz" ? 1 : 0.9,
      images: [`https://${host}/api/og/${regionKey}`],
    }));
}
