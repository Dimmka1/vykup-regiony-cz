"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface BlogScrollTrackerProps {
  slug: string;
}

/**
 * VR-195: Fires blog_reader when user scrolls >50% on a blog article.
 */
export function BlogScrollTracker({ slug }: BlogScrollTrackerProps): null {
  useEffect(() => {
    let tracked = false;

    const handleScroll = (): void => {
      if (tracked) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total > 0.5) {
        tracked = true;
        trackEvent("blog_reader", { slug });
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return null;
}
