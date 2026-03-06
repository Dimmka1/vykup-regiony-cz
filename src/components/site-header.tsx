"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";

/** Region keys that have a dark hero - header stays transparent */
const REGION_KEYS = new Set([
  "praha",
  "stredocesky-kraj",
  "jihocesky-kraj",
  "plzensky-kraj",
  "karlovarsky-kraj",
  "ustecky-kraj",
  "liberecky-kraj",
  "kralovehradecky-kraj",
  "pardubicky-kraj",
  "vysocina",
  "jihomoravsky-kraj",
  "olomoucky-kraj",
  "moravskoslezsky-kraj",
  "zlinsky-kraj",
]);

interface SiteHeaderProps {
  phone?: string;
}

export function SiteHeader({ phone = "+420 776 424 145" }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Determine if this page needs a solid (always visible) header
  const isSolid =
    pathname !== "/" && !REGION_KEYS.has(pathname.replace(/^\//, ""));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For solid variant OR scrolled state: white bg + dark text
  const showSolid = isSolid || scrolled;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        showSolid
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
            className={`inline-flex min-h-[44px] items-center text-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 ${
              showSolid ? "text-slate-900" : "text-white"
            }`}
            aria-label="Výkup Nemovitostí - domovská stránka"
          >
            Výkup Nemovitostí
          </Link>
          <Link
            href="/jak-to-funguje"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:inline-flex ${
              showSolid ? "text-slate-700" : "text-white/80"
            }`}
          >
            Jak to funguje
          </Link>
          <Link
            href="/kraje"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:inline-flex ${
              showSolid ? "text-slate-700" : "text-white/80"
            }`}
          >
            Kde působíme
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/caste-dotazy"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:inline-flex ${
              showSolid ? "text-slate-700" : "text-white/80"
            }`}
          >
            Časté dotazy
          </Link>
          <Link
            href="/reference"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:inline-flex ${
              showSolid ? "text-slate-700" : "text-white/80"
            }`}
          >
            Reference
          </Link>
          <Link
            href="/blog"
            className={`hidden min-h-[44px] items-center text-sm font-medium transition-colors hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:inline-flex ${
              showSolid ? "text-slate-700" : "text-white/80"
            }`}
          >
            Blog
          </Link>
          <a
            href={`tel:${phone}`}
            className={`inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 ${
              showSolid ? "text-slate-600" : "text-white/80"
            }`}
            aria-label={`Zavolat na ${phone}`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden md:inline">{phone}</span>
          </a>
          <a
            href="#kontakt"
            className="cta-glow btn-ripple hidden min-h-[44px] items-center rounded-xl bg-[var(--theme-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:inline-flex"
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
                className={`h-6 w-6 ${showSolid ? "text-slate-900" : "text-white"}`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${showSolid ? "text-slate-900" : "text-white"}`}
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
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Jak to funguje
            </Link>
            <Link
              href="/kraje"
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Kde působíme
            </Link>
            <Link
              href="/caste-dotazy"
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Časté dotazy
            </Link>
            <Link
              href="/reference"
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Reference
            </Link>
            <Link
              href="/blog"
              className="min-h-[44px] text-sm font-medium text-slate-700 hover:text-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
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
              className="cta-glow btn-ripple inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--theme-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--theme-600)]"
              onClick={() => setMobileOpen(false)}
              aria-label="Přejít na nezávaznou poptávku výkupu nemovitosti"
            >
              Nezávazná poptávka
            </a>
          </div>
        </div>
      )}
      <div className="via-[var(--theme-500)]/20 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent" />
    </header>
  );
}
