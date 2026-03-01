"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

interface SiteHeaderProps {
  phone?: string;
}

export function SiteHeader({ phone = "+420 800 123 001" }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`inline-flex min-h-[44px] items-center text-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
            aria-label="Výkup Nemovitostí — domovská stránka"
          >
            Výkup Nemovitostí
          </Link>
          <Link
            href="/jak-to-funguje"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 md:inline-flex ${
              scrolled ? "text-slate-700" : "text-white/80"
            }`}
          >
            Jak to funguje
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/caste-dotazy"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 md:inline-flex ${
              scrolled ? "text-slate-700" : "text-white/80"
            }`}
          >
            Časté dotazy
          </Link>
          <Link
            href="/blog"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 md:inline-flex ${
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
            <span className="hidden md:inline">{phone}</span>
          </a>
          <a
            href="#kontakt"
            className="hidden min-h-[44px] items-center rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 md:inline-flex"
          >
            Nezávazná poptávka
          </a>
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg p-2 transition md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X
                className={`h-6 w-6 ${scrolled ? "text-slate-900" : "text-white"}`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${scrolled ? "text-slate-900" : "text-white"}`}
              />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/jak-to-funguje"
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-teal-500"
              onClick={() => setMobileOpen(false)}
            >
              Jak to funguje
            </Link>
            <Link
              href="/caste-dotazy"
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-teal-500"
              onClick={() => setMobileOpen(false)}
            >
              Časté dotazy
            </Link>
            <Link
              href="/blog"
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-teal-500"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-slate-600"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
            <a
              href="#kontakt"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
              onClick={() => setMobileOpen(false)}
            >
              Nezávazná poptávka
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
