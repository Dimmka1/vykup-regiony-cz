"use client";

import dynamic from "next/dynamic";

const CallbackScheduler = dynamic(
  () =>
    import("@/components/callback-scheduler").then((m) => m.CallbackScheduler),
  { ssr: false },
);

export function CallbackSchedulerLazy(): React.ReactElement {
  return <CallbackScheduler />;
}
