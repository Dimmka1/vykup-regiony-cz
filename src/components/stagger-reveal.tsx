"use client";

import type { ReactNode } from "react";
import { motion } from "@/components/motion";
import { staggerContainer, staggerChild } from "@/lib/animations";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
}

export function StaggerReveal({
  children,
  className = "",
}: StaggerRevealProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}
