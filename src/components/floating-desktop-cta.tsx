"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { waitForElement } from "@/lib/wait-for-element";

const SCROLL_THRESHOLD = 900;

export function FloatingDesktopCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let formInView = false;
    let scrolledPast = window.scrollY > SCROLL_THRESHOLD;

    const update = () => {
      setVisible(scrolledPast && !formInView);
    };

    const onScroll = () => {
      scrolledPast = window.scrollY > SCROLL_THRESHOLD;
      update();
    };

    // The form section is rendered inside a lazy (ssr: false) chunk —
    // wait for it to mount before attaching the IntersectionObserver.
    const stopWaiting = waitForElement<HTMLElement>("#kontakt", (kontakt) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          formInView = entry.isIntersecting;
          update();
        },
        { threshold: 0.1 },
      );
      observer.observe(kontakt);
      return () => observer.disconnect();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      stopWaiting();
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("floating_cta_click");
        document
          .getElementById("kontakt")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      className="cta-glow btn-ripple fixed bottom-6 right-6 z-40 hidden rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-6 py-3 font-semibold text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 lg:block"
      aria-label="Přejít na formulář kontaktu a získat nezávaznou nabídku"
    >
      Nezávazná poptávka →
    </button>
  );
}
