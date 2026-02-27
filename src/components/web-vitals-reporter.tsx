"use client";

import { useEffect } from "react";
import { registerWebVitals } from "@/lib/web-vitals";

export function WebVitalsReporter(): null {
  useEffect(() => {
    registerWebVitals();
  }, []);

  return null;
}
