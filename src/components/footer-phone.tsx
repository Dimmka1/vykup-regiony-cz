"use client";

import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";

export function FooterPhone() {
  return (
    <PhoneLink
      className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
    >
      {(phone) => (
        <>
          <Phone className="h-4 w-4 shrink-0" /> {phone}
        </>
      )}
    </PhoneLink>
  );
}
