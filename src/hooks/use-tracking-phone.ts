"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getTrackingPhone,
  persistUtmSource,
  getPersistedUtmSource,
} from "@/lib/phone-tracking";

/**
 * Returns the DNI phone number based on utm_source (URL param or sessionStorage).
 * @param fallback - default phone to show before hydration (avoids layout shift)
 */
export function useTrackingPhone(fallback?: string) {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(fallback ?? getTrackingPhone());
  const [utmSource, setUtmSource] = useState<string | null>(null);

  useEffect(() => {
    const paramSource = searchParams.get("utm_source");
    const source = paramSource ?? getPersistedUtmSource();

    if (paramSource) {
      persistUtmSource(paramSource);
    }

    setUtmSource(source);
    setPhone(getTrackingPhone(source));
  }, [searchParams]);

  return { phone, utmSource } as const;
}
