"use client";

import { useEffect, useState, type ReactElement } from "react";
import { Quote } from "lucide-react";
import {
  getLastUseCaseCookie,
  USE_CASE_CONTENT,
  type UseCaseKey,
} from "@/lib/use-case-personalization";
import { trackEvent } from "@/lib/analytics";

interface PersonalizedHeroHeadlineProps {
  /** Default (non-personalized) h1 from region config */
  defaultH1: string;
  className?: string;
}

/**
 * Client component that reads the last_use_case cookie and swaps
 * the hero headline if a personalized variant exists.
 *
 * On SSR it renders the default h1. After hydration it checks the cookie
 * and may swap in a personalized headline (avoids layout shift via CSS transition).
 */
export function PersonalizedHeroHeadline({
  defaultH1,
  className,
}: PersonalizedHeroHeadlineProps): ReactElement {
  const [headline, setHeadline] = useState(defaultH1);

  useEffect(() => {
    const stored = getLastUseCaseCookie();
    if (stored) {
      const content = USE_CASE_CONTENT[stored];
      if (content) {
        setHeadline(content.headline);
      }
    }
  }, []);

  return <span className={className}>{headline}</span>;
}

interface PersonalizedHeroDescriptionProps {
  /** Default (non-personalized) description from region config */
  defaultDescription: string;
  className?: string;
}

/**
 * Client component that reads the cookie and shows personalized subtitle.
 */
export function PersonalizedHeroDescription({
  defaultDescription,
  className,
}: PersonalizedHeroDescriptionProps): ReactElement {
  const [description, setDescription] = useState(defaultDescription);

  useEffect(() => {
    const stored = getLastUseCaseCookie();
    if (stored) {
      const content = USE_CASE_CONTENT[stored];
      if (content) {
        setDescription(content.subtitle);
      }
    }
  }, []);

  return <span className={className}>{description}</span>;
}

/**
 * Client component that shows a personalized testimonial card
 * only if a matching use case cookie exists.
 * Also fires the GTM dataLayer event (AC-5).
 */
export function PersonalizedTestimonialCard(): ReactElement | null {
  const [useCase, setUseCase] = useState<UseCaseKey | null>(null);

  useEffect(() => {
    const stored = getLastUseCaseCookie();
    if (stored) {
      setUseCase(stored);

      // AC-5: push GTM dataLayer event
      trackEvent("personalized_hero" as Parameters<typeof trackEvent>[0], {
        use_case: stored,
      });
    }
  }, []);

  if (!useCase) return null;

  const content = USE_CASE_CONTENT[useCase];
  if (!content?.testimonial) return null;

  const { name, text, location } = content.testimonial;

  return (
    <div className="mt-6 max-w-lg rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <Quote
        className="mb-2 h-5 w-5 text-[var(--theme-400)]"
        aria-hidden="true"
      />
      <p className="text-sm italic leading-relaxed text-white/90">
        &ldquo;{text}&rdquo;
      </p>
      <p className="mt-3 text-xs font-semibold text-[var(--theme-300)]">
        {name}, {location}
      </p>
    </div>
  );
}
