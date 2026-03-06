"use client";

import type { ReactElement, ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: ScrollRevealProps): ReactElement {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ delay });

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`scroll-reveal ${isVisible ? "scroll-reveal--visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
