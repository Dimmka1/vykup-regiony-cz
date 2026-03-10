import { Landmark } from "lucide-react";
import { formatCapitalLabel, isCapitalEnabled } from "@/lib/capital";
import type { ReactElement } from "react";

interface CapitalBadgeProps {
  /** Visual variant for different page contexts */
  variant?: "hero" | "section" | "inline";
  className?: string;
}

/**
 * Displays a "Vlastní kapitál X mil. Kč" trust badge.
 * Renders nothing when NEXT_PUBLIC_CAPITAL_AMOUNT is empty/unset.
 */
export function CapitalBadge({
  variant = "hero",
  className = "",
}: CapitalBadgeProps): ReactElement | null {
  if (!isCapitalEnabled()) {
    return null;
  }

  const label = formatCapitalLabel();

  if (variant === "hero") {
    return (
      <li
        className={`glass inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm backdrop-blur-md ${className}`}
      >
        <Landmark
          className="h-4 w-4 text-[var(--theme-400)]"
          aria-hidden="true"
        />
        {label}
      </li>
    );
  }

  if (variant === "section") {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-[var(--theme-200)] bg-[var(--theme-50)] px-4 py-3 ${className}`}
      >
        <Landmark
          className="h-5 w-5 text-[var(--theme-600)]"
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-[var(--theme-800)]">
          {label}
        </span>
      </div>
    );
  }

  // inline
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Landmark
        className="h-4 w-4 text-[var(--theme-600)]"
        aria-hidden="true"
      />
      <span className="font-medium text-[var(--theme-700)]">{label}</span>
    </span>
  );
}
