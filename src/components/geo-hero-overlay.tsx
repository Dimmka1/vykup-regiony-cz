"use client";

import { useEffect, useState, type ReactElement } from "react";
import { GEO_REGION_COOKIE } from "@/lib/geo-regions";
import Link from "next/link";

interface GeoRegionInfo {
  key: string;
  name: string;
  locative: string;
  h1: string;
  heroCta: string;
}

interface GeoHeroOverlayProps {
  /** All regions with display info */
  regions: GeoRegionInfo[];
  /** Current region key from routing */
  currentRegionKey: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Client component that personalizes hero text based on geo cookie.
 * Only renders overlay content when detected region differs from current.
 * The server-rendered hero remains as fallback (AC-3).
 */
export function GeoHeroOverlay({
  regions,
  currentRegionKey,
}: GeoHeroOverlayProps): ReactElement | null {
  const [geoRegion, setGeoRegion] = useState<GeoRegionInfo | null>(null);

  useEffect(() => {
    const cookieValue = getCookie(GEO_REGION_COOKIE);
    if (!cookieValue || cookieValue === currentRegionKey) return;

    const found = regions.find((r) => r.key === cookieValue);
    if (found) setGeoRegion(found);
  }, [regions, currentRegionKey]);

  if (!geoRegion) return null;

  return (
    <div className="mt-3">
      <p className="text-sm text-slate-300">
        Zobrazujeme nabídku pro <strong>{geoRegion.name}</strong>.{" "}
        <Link
          href="/kraje"
          className="text-[var(--theme-300)] underline underline-offset-2 hover:no-underline"
        >
          Nejste z tohoto kraje? Vyberte svůj kraj
        </Link>
      </p>
    </div>
  );
}
