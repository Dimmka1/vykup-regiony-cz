import { Partytown } from "@qwik.dev/partytown/react";

/**
 * Renders the Partytown snippet inside <head>.
 * Forward config ensures dataLayer.push, fbq, and gtag calls
 * from the main thread are proxied into the web-worker.
 */
export function PartytownHead() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <Partytown debug={false} forward={["dataLayer.push", "fbq", "gtag"]} />
  );
}
