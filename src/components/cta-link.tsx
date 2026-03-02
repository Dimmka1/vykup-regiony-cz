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
      className="shadow-[var(--theme-600)]/25 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--theme-600)] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[var(--theme-700)]"
    >
      {label}
    </a>
  );
}
