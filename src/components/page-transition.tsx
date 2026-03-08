"use client";

/**
 * PageTransition - lightweight pass-through wrapper.
 * framer-motion AnimatePresence removed for bundle size.
 * Next.js App Router handles route transitions natively.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
