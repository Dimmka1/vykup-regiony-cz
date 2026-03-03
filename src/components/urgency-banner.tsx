"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface RegionInfo {
  key: string;
  name: string;
  locative: string;
}

const STORAGE_KEY = "urgency-banner-dismissed";

export function UrgencyBanner({ regions }: { regions: RegionInfo[] }) {
  const [visible, setVisible] = useState(false);
  const [regionName, setRegionName] = useState("");
  const [spots, setSpots] = useState(3);
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) || regions.length === 0) return;

    const slug = pathname?.split("/")[1] ?? "";
    const matched = regions.find((r) => r.key === slug);
    const region =
      matched ?? regions[Math.floor(Math.random() * regions.length)];

    setRegionName(region.locative || region.name);
    setSpots(Math.floor(Math.random() * 4) + 2);
    setVisible(true);
  }, [pathname, regions]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="relative bg-teal-600 px-4 py-1.5 text-center text-sm text-white">
      <span>
        📢 Volná kapacita {regionName}: ještě <strong>{spots} míst</strong>{" "}
        tento měsíc
      </span>
      <button
        onClick={dismiss}
        aria-label="Zavřít banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-white/80 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
