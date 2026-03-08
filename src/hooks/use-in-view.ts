"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
  threshold?: number;
}

/**
 * IntersectionObserver hook. Returns { ref, isInView }.
 * Drop-in replacement for framer-motion's useInView.
 */
export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {},
): { ref: RefObject<T | null>; isInView: boolean } {
  const { once = true, margin = "0px", threshold = 0 } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible && once) {
          observer.unobserve(el);
        }
      },
      { rootMargin: margin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, margin, threshold]);

  return { ref, isInView };
}
