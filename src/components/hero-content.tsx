import type { ReactElement } from "react";
import { HeroImage } from "@/components/hero-image";
import { CtaLink } from "@/components/cta-link";
import { CallbackForm } from "@/components/callback-form";
import { Check, Phone, Mail, ArrowDown } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/contact-info";

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

      {/* Content — rendered visible at SSR; entrance polish via CSS,
          no JS dependency on the LCP path. */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 py-32 text-white md:px-12">
        <div className="hero-content max-w-4xl">
          {/* Eyebrow badges */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
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
          </div>

          {/* Heading */}
          <h1 className="text-display max-w-[900px] text-balance text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {h1}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-white/70">
            {description}
          </p>

          {/* Trust badges */}
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {badges.map((badge) => (
              <li
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(var(--theme-rgb-500),0.2)]">
                  <Check
                    className="h-3 w-3 text-[var(--theme-400)]"
                    aria-hidden="true"
                  />
                </span>
                {badge}
              </li>
            ))}
          </ul>

          {/* Hero CTAs — three tiers:
              1. Primary gradient CTA — submit form (most dominant)
              2. Email — preferred secondary path: teal-accented pill +
                 live "ping" indicator hinting active inbox. Placed
                 BEFORE phone so it gets first-scan priority.
              3. Phone — alt-tier fallback: neutral glass, dimmer.
              Hierarchy is communicated via colour, weight AND order
              (visual-hierarchy: not relying on a single channel). */}
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <CtaLink href="#kontakt" label={heroCta} regionName={regionName} />
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label={`Napsat e-mail na ${CONTACT_EMAIL} — odpovíme do 30 minut`}
              className="hero-email-pill group relative inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-base font-semibold text-white backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:px-7 md:py-3.5 md:text-lg"
            >
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <span
                  className="absolute right-0 top-0 inline-flex h-2 w-2 rounded-full bg-[var(--theme-400)] motion-safe:animate-ping"
                  aria-hidden="true"
                />
                <span
                  className="absolute right-0 top-0 inline-flex h-2 w-2 rounded-full bg-[var(--theme-400)]"
                  aria-hidden="true"
                />
                <Mail
                  className="h-4 w-4 text-[var(--theme-300)] transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
              </span>
              <span className="break-all">{CONTACT_EMAIL}</span>
            </a>
            <a
              href={`tel:${phone}`}
              aria-label={`Zavolat na číslo ${phone}`}
              className="hover:bg-white/12 group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-base font-medium text-white/85 backdrop-blur-sm transition-all hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:px-7 md:py-3.5 md:text-lg"
            >
              <Phone
                className="h-4 w-4 shrink-0 text-white/65 transition-transform group-hover:scale-110 group-hover:text-white/90"
                aria-hidden="true"
              />
              {phone}
            </a>
          </div>

          {/* Micro-hint anchored to the e-mail pill — explains WHY it is
              the preferred path. Keeps "why" close to the CTA so users
              decide without scrolling (progressive-disclosure). */}
          <p className="mt-3 flex items-center gap-2 text-xs text-white/65 sm:text-sm">
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--theme-rgb-400),0.15)]"
              aria-hidden="true"
            >
              <Mail className="h-3 w-3 text-[var(--theme-300)]" />
            </span>
            <span>
              <span className="font-semibold text-white/90">
                Odpovídáme do 30 minut
              </span>{" "}
              <span className="text-white/55">
                — e-mail je nejrychlejší, bez čekání ve frontě
              </span>
            </span>
          </p>

          {/* Callback form */}
          <div className="mt-6">
            <CallbackForm regionName={regionName} />
          </div>

          <p className="mt-4 text-sm text-white/40">
            Zálohu vyplácíme při podpisu smlouvy. Celý proces trvá 3–7 dní.
          </p>
        </div>
      </div>

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
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--theme-rgb-500),0.3)] to-transparent" />
    </section>
  );
}
