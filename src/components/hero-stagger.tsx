"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";

interface HeroStaggerProps {
  children: ReactNode;
  delay: 1 | 2 | 3 | 4;
  className?: string;
  as?: "div" | "p" | "ul" | "h1" | "span";
}

export function HeroStagger({
  children,
  delay,
  className = "",
  as: Tag = "div",
}: HeroStaggerProps): ReactElement {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Tag
      className={`hero-stagger hero-stagger--delay-${delay} ${visible ? "hero-stagger--visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
