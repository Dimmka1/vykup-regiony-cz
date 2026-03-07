"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

const DEFAULT_PHONE =
  process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+420 776 424 145";
const GOOGLE_PHONE =
  process.env.NEXT_PUBLIC_CALL_TRACKING_PHONE_GOOGLE || DEFAULT_PHONE;

interface DynamicPhoneProps {
  /** Override default phone (e.g. region-specific) */
  fallback?: string;
  /** Render function — receives { phone, href } */
  children?: (props: { phone: string; href: string }) => ReactNode;
  /** Optional className for the default <a> tag */
  className?: string;
  /** Extra content before phone text */
  prefix?: ReactNode;
}

/** Strips spaces/dashes for tel: href */
function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[\s\-()]/g, "")}`;
}

function DynamicPhoneInner({
  fallback,
  children,
  className,
  prefix,
}: DynamicPhoneProps) {
  const searchParams = useSearchParams();
  const utmSource = searchParams.get("utm_source");

  const phone =
    utmSource?.toLowerCase() === "google"
      ? GOOGLE_PHONE
      : fallback || DEFAULT_PHONE;

  const href = toTelHref(phone);

  if (children) {
    return <>{children({ phone, href })}</>;
  }

  return (
    <a href={href} className={className}>
      {prefix}
      {phone}
    </a>
  );
}

/**
 * DynamicPhone — shows different phone number based on utm_source.
 *
 * When utm_source=google → NEXT_PUBLIC_CALL_TRACKING_PHONE_GOOGLE
 * Otherwise → fallback prop or NEXT_PUBLIC_DEFAULT_PHONE
 *
 * Wrapped in Suspense because useSearchParams() requires it in Next.js App Router.
 */
export function DynamicPhone(props: DynamicPhoneProps) {
  const fallbackPhone = props.fallback || DEFAULT_PHONE;
  return (
    <Suspense
      fallback={
        props.children ? (
          props.children({
            phone: fallbackPhone,
            href: toTelHref(fallbackPhone),
          })
        ) : (
          <a href={toTelHref(fallbackPhone)} className={props.className}>
            {props.prefix}
            {fallbackPhone}
          </a>
        )
      }
    >
      <DynamicPhoneInner {...props} />
    </Suspense>
  );
}
