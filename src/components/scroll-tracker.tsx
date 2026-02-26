"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface ScrollTrackerProps {
  regionName: string;
}

export function ScrollTracker({ regionName }: ScrollTrackerProps): null {
  useEffect(() => {
    let isTracked = false;

    const handleScroll = (): void => {
      if (isTracked) {
        return;
      }

      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const currentPosition = window.scrollY + viewportHeight;
      const scrolledPercent = (currentPosition / fullHeight) * 100;

      if (scrolledPercent >= 50) {
        isTracked = true;
        trackEvent("scroll_50", {
          region: regionName,
          page: "home",
        });
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [regionName]);

  return null;
}
