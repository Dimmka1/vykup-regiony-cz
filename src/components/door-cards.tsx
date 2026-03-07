"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useReducedMotion, useInView } from "@/components/motion";
import {
  Gavel,
  FileWarning,
  Landmark,
  ScrollText,
  Users,
  Link2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Gavel,
  FileWarning,
  Landmark,
  ScrollText,
  Users,
  Link2,
};

interface Situation {
  label: string;
  icon: string;
  description: string;
}

interface DoorCardsProps {
  situations: Situation[];
}

function DoorCard({
  situation,
  index,
}: {
  situation: Situation;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 1, y: 0 }
            : undefined
      }
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <div
        className="group relative h-56 cursor-pointer sm:h-64"
        style={{ perspective: "1000px" }}
        onClick={toggle}
        onMouseEnter={() => !reduced && setIsOpen(true)}
        onMouseLeave={() => !reduced && setIsOpen(false)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${situation.label} — klikněte pro více informací`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {/* Light spill behind door */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(ellipse at left center, rgba(var(--theme-rgb-400), 0.3), transparent 70%)`,
          }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />

        {/* Content behind the door */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--theme-900)] to-slate-900 p-6">
          <div>
            {(() => {
              const I = ICON_MAP[situation.icon];
              return I ? (
                <I
                  className="mb-3 h-6 w-6 text-[var(--theme-300)]"
                  aria-hidden="true"
                />
              ) : null;
            })()}
            <h3 className="text-lg font-bold text-white">{situation.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {situation.description}
            </p>
          </div>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-400)] transition hover:text-[var(--theme-300)]"
            onClick={(e) => e.stopPropagation()}
          >
            Řešit situaci →
          </a>
        </div>

        {/* The door */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
          animate={
            reduced
              ? { opacity: isOpen ? 0 : 1 }
              : { rotateY: isOpen ? -85 : 0 }
          }
          transition={
            reduced
              ? { duration: 0.2 }
              : { type: "spring", stiffness: 100, damping: 18 }
          }
        >
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--theme-400)] to-transparent" />
          <div className="flex h-full flex-col items-center justify-center p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              {(() => {
                const I = ICON_MAP[situation.icon];
                return I ? (
                  <I
                    className="h-7 w-7 text-[var(--theme-300)]"
                    aria-hidden="true"
                  />
                ) : null;
              })()}
            </span>
            <h3 className="mt-4 text-center text-lg font-bold text-white">
              {situation.label}
            </h3>
            <p className="mt-2 text-xs text-slate-400">Klikněte pro detail</p>

            {/* Door handle */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-8 w-2 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-lg" />
              <div className="mx-auto mt-0.5 h-1.5 w-3 rounded-full bg-yellow-500/60" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function DoorCards({ situations }: DoorCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {situations.map((situation, idx) => (
        <DoorCard key={situation.label} situation={situation} index={idx} />
      ))}
    </div>
  );
}
