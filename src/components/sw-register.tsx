"use client";

import { useEffect } from "react";

export function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed silently
      });

      // Fallback for browsers without Background Sync API:
      // on reconnect, tell SW to replay queued leads
      const onOnline = async () => {
        try {
          const reg = await navigator.serviceWorker.ready;
          const hasSync = "SyncManager" in window;
          if (hasSync) {
            await reg.sync.register("lead-form-sync");
          } else {
            reg.active?.postMessage({ type: "REPLAY_LEADS" });
          }
        } catch {
          // ignore
        }
      };
      window.addEventListener("online", onOnline);
      return () => window.removeEventListener("online", onOnline);
    }
  }, []);

  return null;
}
