"use client";

import { useEffect, useState } from "react";

/**
 * Delays rendering until the browser is idle (requestIdleCallback)
 * or after a fallback timeout. Keeps the main thread free during initial load.
 */
export function useIdleLoad(timeoutMs = 2000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), {
        timeout: timeoutMs,
      });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setReady(true), timeoutMs);
      return () => clearTimeout(id);
    }
  }, [timeoutMs]);

  return ready;
}
