"use client";

import { useRef, type ReactElement } from "react";
import { motion, useReducedMotion, useInView } from "@/components/motion";
import { HeroImage } from "@/components/hero-image";
import { CtaLink } from "@/components/cta-link";
import { CallbackForm } from "@/components/callback-form";
import { Check, Phone, ArrowDown } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

interface HeroContentProps {
  h1: string;
  description: string;
  locative: string;
  heroCta: string;
  phone: string;
  regionName: string;
  badges: readonly string[];
  imageSrc: string;
  imageAlt: string;
}

export function HeroContent({
  h1,
  description,
  locative,
  heroCta,
  phone,
  regionName,
  badges,
  imageSrc,
  imageAlt,
}: HeroContentProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-slate-950">
      {/* Background image with parallax */}
      <HeroImage
        src={imageSrc}
        alt={imageAlt}
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Content */}
      <motion.div
        ref={ref}
        variants={reduced ? undefined : containerVariants}
        initial={reduced ? false : "hidden"}
        animate={reduced ? false : inView ? "visible" : "hidden"}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 py-32 text-white md:px-12"
      >
        <div className="max-w-4xl">
          {/* Eyebrow badges */}
          <motion.div
            variants={reduced ? undefined : itemVariants}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-400)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--theme-400)]" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/90">
                {locative}
              </span>
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/60 backdrop-blur-sm">
              Přímý kupec · ne realitka
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={reduced ? undefined : itemVariants}
            className="text-display max-w-[900px] text-balance text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {h1}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={reduced ? undefined : itemVariants}
            className="mt-6 max-w-2xl text-balance text-lg leading-8 text-white/70"
          >
            {description}
          </motion.p>

          {/* Trust badges */}
          <motion.ul
            variants={reduced ? undefined : itemVariants}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {badges.map((badge) => (
              <li
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <span className="bg-[var(--theme-500)]/20 flex h-5 w-5 items-center justify-center rounded-full">
                  <Check
                    className="h-3 w-3 text-[var(--theme-400)]"
                    aria-hidden="true"
                  />
                </span>
                {badge}
              </li>
            ))}
          </motion.ul>

          {/* CTA buttons */}
          <motion.div
            variants={reduced ? undefined : itemVariants}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <CtaLink href="#kontakt" label={heroCta} regionName={regionName} />
            <a
              href={`tel:${phone}`}
              aria-label={`Zavolat na číslo ${phone}`}
              className="group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:px-8 md:py-4 md:text-lg"
            >
              <Phone
                className="h-4 w-4 text-[var(--theme-400)] transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              {phone}
            </a>
          </motion.div>

          {/* Callback form */}
          <motion.div
            variants={reduced ? undefined : itemVariants}
            className="mt-6"
          >
            <CallbackForm regionName={regionName} />
          </motion.div>

          <motion.p
            variants={reduced ? undefined : itemVariants}
            className="mt-4 text-sm text-white/40"
          >
            Zálohu vyplácíme při podpisu smlouvy. Celý proces trvá 3–7 dní.
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] uppercase tracking-[0.25em]">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="via-[var(--theme-500)]/30 absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent" />
    </section>
  );
}
