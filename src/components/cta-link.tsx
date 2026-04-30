"use client";

import type { ReactElement, MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";

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
      className="cta-glow btn-ripple shadow-[var(--theme-600)]/25 hover:shadow-[var(--theme-600)]/30 group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-10 md:py-4 md:text-lg"
      aria-label={`${label} – výkup nemovitostí`}
    >
      {label}
      <ArrowRight
        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
