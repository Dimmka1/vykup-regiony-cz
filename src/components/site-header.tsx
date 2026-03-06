"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";

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

const navLinks = [
  { href: "/jak-to-funguje", label: "Jak to funguje" },
  { href: "/kraje", label: "Kde působíme" },
  { href: "/caste-dotazy", label: "Časté dotazy" },
  { href: "/reference", label: "Reference" },
  { href: "/blog", label: "Blog" },
] as const;

interface SiteHeaderProps {
  phone?: string;
}

export function SiteHeader({ phone = "+420 776 424 145" }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  const isSolid =
    pathname !== "/" && !REGION_KEYS.has(pathname.replace(/^\//, ""));

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > 120) setHidden(y > lastY.current);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showSolid = isSolid || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"} ${showSolid ? "bg-white/80 shadow-sm backdrop-blur-xl" : "bg-transparent"}`}
    >
      <nav
        aria-label="Hlavní navigace"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8 lg:px-12"
      >
        <Link
          href="/"
          className={`inline-flex min-h-12 items-center text-xl font-bold tracking-tight ${showSolid ? "text-slate-900" : "text-white"}`}
        >
          Výkup Nemovitostí
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link-hover inline-flex min-h-12 items-center text-sm font-medium uppercase tracking-wide ${showSolid ? "text-slate-700" : "text-white/85"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${phone}`}
            className={`inline-flex min-h-12 items-center gap-1.5 text-sm font-medium ${showSolid ? "text-slate-600" : "text-white/80"}`}
            aria-label={`Zavolat na ${phone}`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">{phone}</span>
          </a>
          <a
            href="#kontakt"
            className="shadow-[var(--theme-600)]/30 hidden min-h-12 items-center rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg md:inline-flex"
          >
            Nezávazná poptávka
          </a>
          <button
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
          >
            <span className="relative h-5 w-6">
              <span
                className={`absolute left-0 h-0.5 w-6 rounded-full ${showSolid ? "bg-slate-900" : "bg-white"} transition-all duration-300 ${mobileOpen ? "top-2 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 rounded-full ${showSolid ? "bg-slate-900" : "bg-white"} transition-all duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 rounded-full ${showSolid ? "bg-slate-900" : "bg-white"} transition-all duration-300 ${mobileOpen ? "top-2 -rotate-45" : "top-4"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className="h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent"
        aria-hidden="true"
      />

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${mobileOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-slate-200/70 bg-white/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex min-h-12 items-center text-sm font-medium uppercase tracking-wide text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="#kontakt"
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-5 py-3 text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Nezávazná poptávka
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
