import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFeaturedTestimonials } from "@/data/testimonials";
import { TestimonialCard } from "@/components/testimonial-card";
import { ScrollReveal } from "@/components/scroll-reveal";

export function HomepageTestimonials() {
  const featured = getFeaturedTestimonials();

  return (
    <section className="section-md bg-luxury-dark relative overflow-hidden">
      <div className="orb orb-theme-1 -right-40 top-10" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px] px-6">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-400)]">
              Reference klientů
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Příběhy lidí, kterým jsme pomohli
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Každý případ je jiný, ale výsledek je vždy stejný — rychlé a
              férové řešení bez zbytečného stresu
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((testimonial, idx) => (
            <ScrollReveal key={testimonial.id} delay={idx * 100}>
              <TestimonialCard testimonial={testimonial} variant="dark" />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={600}>
          <div className="mt-10 text-center">
            <Link
              href="/reference"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Zobrazit všechny reference
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
