"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, Suspense } from "react";
import { MapPin, ChevronDown } from "lucide-react";

interface Region {
  key: string;
  name: string;
}

/**
 * On production domains, navigate to subdomain. On dev, use path-based.
 */
function getRegionHref(key: string): string {
  if (typeof window === "undefined") return `/${key}`;
  const host = window.location.hostname;
  if (
    host === "vykoupim-nemovitost.cz" ||
    host.endsWith(".vykoupim-nemovitost.cz")
  ) {
    // Map region key to subdomain - strip "-kraj" suffix for subdomain
    const subdomain = key.replace(/-kraj$/, "");
    return `https://${subdomain}.vykoupim-nemovitost.cz/`;
  }
  return `/${key}`;
}

function RegionSelectorInner({ regions }: { regions: Region[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Determine current region from URL path
  const pathSegment = pathname.split("/")[1] ?? "";
  const currentRegionKey =
    regions.find((r) => r.key === pathSegment)?.key ?? regions[0]?.key ?? "";

  const currentRegion = regions.find((r) => r.key === currentRegionKey);

  const handleSelect = useCallback(
    (key: string) => {
      setOpen(false);
      const href = getRegionHref(key);
      if (href.startsWith("https://")) {
        window.location.href = href;
      } else {
        router.push(href);
      }
    },
    [router],
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">
          {currentRegion?.name ?? "Kraj"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-1 max-h-72 w-56 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {regions.map((r) => (
              <li key={r.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={r.key === currentRegionKey}
                  onClick={() => handleSelect(r.key)}
                  className={`flex w-full items-center px-3 py-2 text-left text-sm transition hover:bg-[var(--theme-50)] ${
                    r.key === currentRegionKey
                      ? "bg-[var(--theme-50)] font-semibold text-[var(--theme-700)]"
                      : "text-slate-700"
                  }`}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function RegionSelector({ regions }: { regions: Region[] }) {
  return (
    <Suspense fallback={<div className="h-[44px] w-[44px]" />}>
      <RegionSelectorInner regions={regions} />
    </Suspense>
  );
}
