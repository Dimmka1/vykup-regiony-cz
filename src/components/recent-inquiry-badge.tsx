"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface RegionInfo {
  name: string;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface RecentInquiryBadgeProps {
  regions: RegionInfo[];
}

interface InquiryState {
  region: string;
  minutes: number;
  visible: boolean;
}

export function RecentInquiryBadge({ regions }: RecentInquiryBadgeProps) {
  const [inquiry, setInquiry] = useState<InquiryState | null>(null);

  useEffect(() => {
    if (regions.length === 0) return;

    function pickInquiry(): InquiryState {
      const region = regions[randomBetween(0, regions.length - 1)].name;
      const minutes = randomBetween(2, 45);
      return { region, minutes, visible: true };
    }

    const initialTimeout = setTimeout(
      () => {
        setInquiry(pickInquiry());
      },
      randomBetween(3_000, 8_000),
    );

    const interval = setInterval(
      () => {
        setInquiry((prev) => (prev ? { ...prev, visible: false } : null));
        setTimeout(() => {
          setInquiry(pickInquiry());
        }, 500);
      },
      randomBetween(45_000, 90_000),
    );

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [regions]);

  if (!inquiry) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-700 transition-opacity duration-500 ${
        inquiry.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <MapPin className="h-4 w-4 text-amber-500" />
      <span>
        Poslední poptávka z{" "}
        <span className="font-medium">{inquiry.region}</span> před{" "}
        {inquiry.minutes} minutami
      </span>
    </div>
  );
}
