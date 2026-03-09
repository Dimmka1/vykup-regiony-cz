"use client";

import { trackEvent } from "@/lib/analytics";
import { Phone } from "lucide-react";
import type { ReactNode } from "react";

type PhoneClickLocation = "hero" | "floating" | "header";

interface PhoneLinkProps {
  phone: string;
  location: PhoneClickLocation;
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
  ariaLabel?: string;
}

export function PhoneLink({
  phone,
  location,
  className,
  children,
  showIcon = true,
  iconClassName = "h-4 w-4",
  ariaLabel,
}: PhoneLinkProps) {
  const handleClick = () => {
    trackEvent("phone_click", { location });
  };

  return (
    <a
      href={`tel:${phone}`}
      className={className}
      aria-label={ariaLabel ?? `Zavolat na ${phone}`}
      onClick={handleClick}
    >
      {showIcon && <Phone className={iconClassName} aria-hidden="true" />}
      {children}
    </a>
  );
}
