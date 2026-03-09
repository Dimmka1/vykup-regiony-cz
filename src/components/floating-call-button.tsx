"use client";

import { PhoneLink } from "@/components/phone-link";

const PHONE_NUMBER = "+420 776 424 145";

export function FloatingCallButton() {
  return (
    <PhoneLink
      phone={PHONE_NUMBER}
      location="floating"
      showIcon
      iconClassName="h-6 w-6"
      ariaLabel={`Zavolat na ${PHONE_NUMBER}`}
      className="fixed bottom-6 left-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 supports-[padding:max(0px)]:bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] md:hidden"
    />
  );
}
