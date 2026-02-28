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

const STATIC_PATHS = [
  { path: "/caste-dotazy", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/blog/jak-probiha-rychly-vykup", priority: 0.7 },
  { path: "/blog/5-duvodu-proc-prodat", priority: 0.7 },
  { path: "/blog/vykup-v-exekuci", priority: 0.7 },
  { path: "/vykup-pri-exekuci", priority: 0.8 },
  { path: "/vykup-pri-dedictvi", priority: 0.8 },
  { path: "/vykup-pri-rozvodu", priority: 0.8 },
  { path: "/vykup-spoluvlastnickeho-podilu", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-hypotekou", priority: 0.8 },
  { path: "/vykup-nemovitosti-s-vecnym-bremenem", priority: 0.8 },
  { path: "/vykup-bytu", priority: 0.8 },
  { path: "/vykup-domu", priority: 0.8 },
  { path: "/vykup-pozemku", priority: 0.8 },
] as const;

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

  const regionEntries: MetadataRoute.Sitemap = Array.from(
    hostToRegionKey.entries(),
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([host]) => ({
      url: `https://${host}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: host === "vykup-regiony.cz" ? 1 : 0.9,
    }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `https://vykup-regiony.cz${entry.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: entry.priority,
  }));

  return [...regionEntries, ...staticEntries];
}
