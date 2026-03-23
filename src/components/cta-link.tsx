"use client";

import type { ReactElement, MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";

interface CtaLinkProps {
  href: string;
  label: string;
  regionName: string;
}

export function CtaLink({
  href,
  label,
  regionName,
}: CtaLinkProps): ReactElement {
  const handleClick = (_event: MouseEvent<HTMLAnchorElement>): void => {
    trackEvent("cta_click", {
      cta_location: "hero",
      region: regionName,
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="cta-glow btn-ripple shadow-[var(--theme-600)]/25 inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-6 py-3 text-base font-bold text-white shadow-lg transition md:px-8 md:py-4 md:text-lg"
      aria-label={`${label} – výkup nemovitostí`}
    >
      {label}
    </a>
  );
}
