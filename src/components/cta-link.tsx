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
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400"
    >
      {label}
    </a>
  );
}
