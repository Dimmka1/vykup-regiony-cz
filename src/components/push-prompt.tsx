"use client";

import { useEffect, useState, useCallback } from "react";

const VISIT_COUNT_KEY = "vykup_visit_count";
const PUSH_DISMISSED_KEY = "vykup_push_dismissed";
const PUSH_SUBSCRIBED_KEY = "vykup_push_subscribed";
const DISMISS_DAYS = 30;
const SHOW_AFTER_VISITS = 2;
const SHOW_AFTER_MS = 60_000;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      return;
    }

    if (Notification.permission === "denied") return;
    if (localStorage.getItem(PUSH_SUBSCRIBED_KEY) === "1") return;

    const dismissedAt = localStorage.getItem(PUSH_DISMISSED_KEY);
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const daysSince =
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    const visitCount = parseInt(
      localStorage.getItem(VISIT_COUNT_KEY) || "0",
      10,
    );
    const newCount = visitCount + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(newCount));

    if (newCount >= SHOW_AFTER_VISITS) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, SHOW_AFTER_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setVisible(false);
        return;
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error("[push-prompt] VAPID public key not configured");
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      });

      const subJson = subscription.toJSON();

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        }),
      });

      if (res.ok) {
        localStorage.setItem(PUSH_SUBSCRIBED_KEY, "1");
      }
    } catch (error) {
      console.error("[push-prompt] Subscription failed:", error);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(PUSH_DISMISSED_KEY, new Date().toISOString());
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-[slideUp_0.3s_ease-out] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:bottom-6 sm:left-auto sm:right-6">
      <p className="mb-4 text-sm leading-relaxed text-slate-700">
        🏠 Chcete dostávat tipy o výkupu nemovitostí?
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="flex-1 rounded-lg bg-[var(--theme-500,#1a56db)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-600,#1648b8)] disabled:opacity-60"
        >
          {loading ? "…" : "Ano"}
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
        >
          Ne
        </button>
      </div>
    </div>
  );
}
