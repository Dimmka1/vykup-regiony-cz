"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
}

export function StaggerReveal({
  children,
  className = "",
}: StaggerRevealProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`stagger-reveal ${isVisible ? "stagger-reveal--visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
