"use client";

import { useCallback, useEffect, useState } from "react";
import { getPendingLeadsCount } from "@/lib/offline-leads";

export function OfflineSyncStatus() {
  const [pendingCount, setPendingCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const refreshCount = useCallback(async () => {
    try {
      const count = await getPendingLeadsCount();
      setPendingCount(count);
    } catch {
      // IndexedDB unavailable
    }
  }, []);

  useEffect(() => {
    refreshCount();

    // Listen for SW sync messages
    if ("serviceWorker" in navigator) {
      const handler = (event: MessageEvent) => {
        if (event.data?.type === "LEADS_SYNCED") {
          const count = event.data.count as number;
          setToast(
            count === 1
              ? "Poptávka byla úspěšně odeslána!"
              : `${count} poptávek bylo úspěšně odesláno!`,
          );
          setPendingCount(0);
          setTimeout(() => setToast(null), 5000);
        }
      };
      navigator.serviceWorker.addEventListener("message", handler);
      return () =>
        navigator.serviceWorker.removeEventListener("message", handler);
    }
  }, [refreshCount]);

  // Also listen for online event to refresh count
  useEffect(() => {
    const onOnline = () => {
      // Give SW sync a moment, then refresh
      setTimeout(refreshCount, 2000);
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [refreshCount]);

  return (
    <>
      {pendingCount > 0 ? (
        <div className="fixed bottom-4 left-4 z-50 rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 shadow-lg">
          ⏳ {pendingCount}{" "}
          {pendingCount === 1
            ? "poptávka čeká na odeslání"
            : "poptávek čeká na odeslání"}
        </div>
      ) : null}
      {toast ? (
        <div className="fixed bottom-4 right-4 z-50 animate-pulse rounded-xl bg-green-100 px-4 py-2 text-sm font-medium text-green-800 shadow-lg">
          ✅ {toast}
        </div>
      ) : null}
    </>
  );
}
