"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  PATH_TO_USE_CASE,
  setLastUseCaseCookie,
} from "@/lib/use-case-personalization";

/**
 * UseCaseTracker — invisible client component that sets a cookie
 * when the visitor lands on a use-case page.
 *
 * Drop it once in the root layout; it reacts to pathname changes.
 */
export function UseCaseTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    const useCase = PATH_TO_USE_CASE[pathname];
    if (useCase) {
      setLastUseCaseCookie(useCase);
    }
  }, [pathname]);

  return null;
}
