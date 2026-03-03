"use client";

import { useCallback, type AnchorHTMLAttributes, type ReactNode } from "react";
import { useTrackingPhone } from "@/hooks/use-tracking-phone";
import { trackPhoneClick } from "@/lib/phone-tracking";

interface PhoneLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  /** Default phone shown before hydration / without utm_source */
  defaultPhone?: string;
  /** Region name for GTM event */
  region?: string;
  /** Render prop – receives the resolved phone string */
  children: (phone: string) => ReactNode;
}

/**
 * Client component that renders a `tel:` link with DNI phone and GTM tracking.
 */
export function PhoneLink({
  defaultPhone,
  region,
  children,
  ...rest
}: PhoneLinkProps) {
  const { phone, utmSource } = useTrackingPhone(defaultPhone);

  const handleClick = useCallback(() => {
    trackPhoneClick(phone, utmSource, region);
  }, [phone, utmSource, region]);

  return (
    <a href={`tel:${phone.replace(/\s/g, "")}`} onClick={handleClick} {...rest}>
      {children(phone)}
    </a>
  );
}
