"use client";

import { LiveViewerCount } from "@/components/live-viewer-count";
import { RecentInquiryBadge } from "@/components/recent-inquiry-badge";

interface SocialProofBarProps {
  regionNames: string[];
}

export function SocialProofBar({ regionNames }: SocialProofBarProps) {
  const regions = regionNames.map((name) => ({ name }));

  return (
    <div className="border-b border-slate-200 bg-white py-2.5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-6 sm:gap-6">
        <LiveViewerCount />
        <RecentInquiryBadge regions={regions} />
      </div>
    </div>
  );
}
