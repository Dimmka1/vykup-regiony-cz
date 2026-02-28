"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

interface SiteHeaderProps {
  phone?: string;
}

export function SiteHeader({ phone = "+420 800 123 001" }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Hlavní navigace"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3"
      >
        <Link
          href="/"
          className={`inline-flex min-h-[44px] items-center text-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
            scrolled ? "text-slate-900" : "text-white"
          }`}
          aria-label="Výkup Nemovitostí — domovská stránka"
        >
          Výkup Nemovitostí
          <Link
            href="/jak-to-funguje"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:inline-flex ${
              scrolled ? "text-slate-700" : "text-white/80"
            }`}
          >
            Jak to funguje
          </Link>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/caste-dotazy"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:inline-flex ${
              scrolled ? "text-slate-700" : "text-white/80"
            }`}
          >
            Časté dotazy
          </Link>
          <Link
            href="/blog"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:inline-flex ${
              scrolled ? "text-slate-700" : "text-white/80"
            }`}
          >
            Blog
          </Link>
          <a
            href={`tel:${phone}`}
            className={`inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              scrolled ? "text-slate-600" : "text-white/80"
            }`}
            aria-label={`Zavolat na ${phone}`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{phone}</span>
          </a>
          <a
            href="#kontakt"
            className="inline-flex min-h-[44px] items-center rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            Nezávazná poptávka
          </a>
        </div>
      </nav>
    </header>
  );
}
