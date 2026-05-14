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
      className="cta-glow btn-ripple group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-8 py-4 text-base font-bold text-white shadow-[0_10px_15px_-3px_rgba(var(--theme-rgb-600),0.25),0_4px_6px_-4px_rgba(var(--theme-rgb-600),0.20)] transition-all hover:shadow-[0_20px_25px_-5px_rgba(var(--theme-rgb-600),0.30),0_8px_10px_-6px_rgba(var(--theme-rgb-600),0.25)] md:px-10 md:py-4 md:text-lg"
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
