"use client";

import { useEffect, useState } from "react";

export function FloatingDesktopCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const kontakt = document.getElementById("kontakt");
    let formInView = false;

    const observer = kontakt
      ? new IntersectionObserver(
          ([entry]) => {
            formInView = entry.isIntersecting;
            setVisible(window.scrollY > 500 && !formInView);
          },
          { threshold: 0.1 },
        )
      : null;

    if (kontakt && observer) observer.observe(kontakt);

    const onScroll = () => {
      setVisible(window.scrollY > 500 && !formInView);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#kontakt"
      onClick={(e) => {
        e.preventDefault();
        document
          .getElementById("kontakt")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      className="cta-glow btn-ripple fixed bottom-6 right-6 z-40 hidden rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-6 py-3 font-semibold text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:block"
      aria-label="Přejít na formulář kontaktu a získat nezávaznou nabídku"
    >
      Nezávazná nabídka →
    </a>
  );
}
