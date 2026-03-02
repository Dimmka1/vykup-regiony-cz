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
      className="fixed bottom-6 right-6 z-40 hidden rounded-full bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 md:block"
    >
      Nezávazná nabídka →
    </a>
  );
}
