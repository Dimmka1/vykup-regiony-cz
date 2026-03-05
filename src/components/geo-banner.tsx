"use client";

import { useEffect, useState, type ReactElement } from "react";
import { GEO_REGION_COOKIE } from "@/lib/geo-regions";
import { MapPin, X } from "lucide-react";

interface GeoRegionInfo {
  key: string;
  name: string;
  locative: string;
  subdomainUrl: string;
}

interface GeoBannerProps {
  /** All regions with their subdomain URLs, passed from server */
  regions: GeoRegionInfo[];
  /** Current region key (from subdomain/path routing) */
  currentRegionKey: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function GeoBanner({
  regions,
  currentRegionKey,
}: GeoBannerProps): ReactElement | null {
  const [geoRegion, setGeoRegion] = useState<GeoRegionInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const cookieValue = getCookie(GEO_REGION_COOKIE);
    if (!cookieValue || cookieValue === currentRegionKey) return;

    const found = regions.find((r) => r.key === cookieValue);
    if (found) setGeoRegion(found);
  }, [regions, currentRegionKey]);

  if (!geoRegion || dismissed) return null;

  return (
    <div className="bg-[var(--theme-600)] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>
            Detekovali jsme vaši polohu: <strong>{geoRegion.name}</strong>.{" "}
            <a
              href={geoRegion.subdomainUrl}
              className="underline underline-offset-2 hover:no-underline"
            >
              Přejít na regionální stránku?
            </a>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 transition hover:bg-white/20"
          aria-label="Zavřít"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
