"use client";

import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";

interface HeroPhoneLinkProps {
  defaultPhone: string;
  region?: string;
  className?: string;
  /** Prefix before phone number (e.g. "Zavolat:") */
  label?: string;
  /** Static text instead of phone number (e.g. "Zavolat") */
  staticLabel?: string;
}

export function HeroPhoneLink({
  defaultPhone,
  region,
  className,
  label,
  staticLabel,
}: HeroPhoneLinkProps) {
  return (
    <PhoneLink defaultPhone={defaultPhone} region={region} className={className}>
      {(phone) =>
        staticLabel ? (
          staticLabel
        ) : label ? (
          <>
            <Phone className="h-5 w-5" />
            {label} {phone}
          </>
        ) : (
          phone
        )
      }
    </PhoneLink>
  );
}
