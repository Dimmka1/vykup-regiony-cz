"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, X, ArrowRight } from "lucide-react";
import { REGION_KEY_LIST } from "@/lib/region-keys";

interface SiteHeaderProps {
  phone?: string;
}

export function SiteHeader({ phone = "+420 776 424 145" }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Determine if this page needs a solid (always visible) header
  const isSolid =
    pathname !== "/" && !REGION_KEY_LIST.has(pathname.replace(/^\//, ""));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For solid variant OR scrolled state: white bg + dark text
  const showSolid = isSolid || scrolled;

  const navLinkClass = `hidden min-h-[48px] items-center text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 lg:inline-flex ${
    showSolid
      ? "text-slate-600 hover:text-slate-900"
      : "text-white/60 hover:text-white"
  }`;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        showSolid
          ? "border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Hlavní navigace"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:h-24"
      >
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className={`inline-flex min-h-[48px] items-center gap-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 ${
              showSolid ? "text-slate-900" : "text-white"
            }`}
            aria-label="Výkup Nemovitostí - domovská stránka"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
              className="h-8 w-8 shrink-0"
              aria-hidden="true"
            >
              <circle
                cx="256"
                cy="256"
                r="256"
                fill="var(--theme-600, #10b981)"
              />
              <g transform="translate(256, 256) scale(5.12)">
                <path
                  d="M0,-30 L-28,0 L-20,0 L-20,22 L20,22 L20,0 L28,0 Z"
                  fill="white"
                />
                <rect
                  x="-7"
                  y="6"
                  width="14"
                  height="16"
                  rx="1"
                  fill="var(--theme-600, #10b981)"
                />
              </g>
            </svg>
            <span className="text-lg font-bold tracking-tight">
              Výkup Nemovitostí
            </span>
          </Link>
          <Link href="/jak-to-funguje" className={navLinkClass}>
            Jak to funguje
          </Link>
          <Link href="/kraje" className={navLinkClass}>
            Kde působíme
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/caste-dotazy" className={navLinkClass}>
            Časté dotazy
          </Link>
          <Link href="/blog" className={navLinkClass}>
            Blog
          </Link>
          <a
            href={`tel:${phone}`}
            className={`inline-flex min-h-[48px] items-center gap-1.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 ${
              showSolid ? "text-slate-600" : "text-white/60"
            }`}
            aria-label={`Zavolat na ${phone}`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">{phone}</span>
          </a>
          <a
            href="#kontakt"
            className="cta-glow btn-ripple shadow-[var(--theme-600)]/20 hover:shadow-[var(--theme-600)]/30 hidden min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-7 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-[var(--theme-500)] hover:to-[var(--theme-600)] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 lg:inline-flex"
          >
            Nezávazná poptávka
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg p-2 transition lg:hidden"
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
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-slate-200/60 bg-white/95 px-6 py-6 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/jak-to-funguje"
              className="flex min-h-[48px] items-center rounded-xl px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Jak to funguje
            </Link>
            <Link
              href="/kraje"
              className="flex min-h-[48px] items-center rounded-xl px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Kde působíme
            </Link>
            <Link
              href="/caste-dotazy"
              className="flex min-h-[48px] items-center rounded-xl px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Časté dotazy
            </Link>
            <Link
              href="/blog"
              className="flex min-h-[48px] items-center rounded-xl px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <div className="my-2 h-px bg-slate-100" />
            <a
              href={`tel:${phone}`}
              className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-slate-600"
            >
              <Phone className="h-4 w-4 text-[var(--theme-600)]" />
              {phone}
            </a>
            <a
              href="#kontakt"
              className="cta-glow btn-ripple mt-2 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-6 py-3 text-sm font-semibold text-white transition hover:from-[var(--theme-500)] hover:to-[var(--theme-600)]"
              onClick={() => setMobileOpen(false)}
              aria-label="Přejít na nezávaznou poptávku výkupu nemovitosti"
            >
              Nezávazná poptávka
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
