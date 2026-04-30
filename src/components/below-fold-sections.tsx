"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FaqAccordion } from "@/components/faq-accordion";
import { ParallaxImage } from "@/components/parallax-image";
import { ParallaxSection } from "@/components/parallax-section";
import { ComparisonCalculator } from "@/components/comparison-calculator";
import { CzechMap } from "@/components/czech-map";
import { BuildingTimeline } from "@/components/building-timeline";
import { FloatingStats } from "@/components/floating-stats";
import { DoorCards } from "@/components/door-cards";
import { LeadForm } from "@/components/lead-form";
import { SlotCounter } from "@/components/slot-counter";
import { PropertyEstimator } from "@/components/property-estimator";
import type { FaqItem, RegionConfig } from "@/lib/types";
import {
  Check,
  FileSignature,
  Banknote,
  CheckCircle,
  MapPin,
  Star,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface ProcessStep {
  title: string;
  eta: string;
  icon: string;
  description: string;
}

interface ComplexSituation {
  label: string;
  icon: string;
  description: string;
}

interface NeighborRegion {
  key: string;
  name: string;
  locative: string;
  url: string;
}

interface AllRegion {
  key: string;
  name: string;
  url: string;
}

const TRUST_METRICS = [
  { label: "Bez provize", value: "0 Kč", icon: "HandCoins" },
  { label: "Průměrná doba první nabídky", value: "24 h", icon: "Clock" },
  { label: "Právní servis zdarma", value: "V ceně", icon: "FileSignature" },
  { label: "Cena pevně ve smlouvě", value: "Bez srážek", icon: "ShieldCheck" },
] as const;

const ABOUT_STATS = [
  { value: "0 Kč", label: "provize a skrytých poplatků" },
  { value: "14", label: "krajů ČR" },
  { value: "48 h", label: "obvyklá splatnost" },
] as const;

const FORM_BENEFITS = [
  "Zavoláme vám do 30 minut",
  "Připravíme nezávaznou nabídku",
  "Nabídku dostanete do 24 hodin",
  "Vše zdarma a bez závazků",
] as const;

export interface BelowFoldProps {
  region: RegionConfig;
  processSteps: ProcessStep[];
  complexSituations: ComplexSituation[];
  regionalFaq: FaqItem[];
  neighborRegions: NeighborRegion[];
  allRegions: AllRegion[];
}

export function BelowFoldSections({
  region,
  processSteps,
  complexSituations,
  regionalFaq,
  neighborRegions,
  allRegions,
}: BelowFoldProps): ReactElement {
  return (
    <>
      {/* ===== ZPĚTNÝ ODKUP BADGE ===== */}
      <ScrollReveal>
        <section className="from-[var(--theme-50)]/80 bg-gradient-to-r to-white py-5">
          <div className="mx-auto max-w-[1400px] px-6">
            <Link
              href="/zpetny-najem"
              className="border-[var(--theme-200)]/60 group mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-sm transition-all hover:border-[var(--theme-300)] hover:shadow-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-50)] transition-colors group-hover:bg-[var(--theme-100)]">
                <RefreshCw
                  className="h-5 w-5 text-[var(--theme-600)]"
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm font-semibold text-slate-800 sm:text-base">
                Možnost zpětného odkupu nemovitosti
              </span>
              <ArrowRight
                className="ml-auto h-4 w-4 text-[var(--theme-600)] transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* ===== MARKET INFO ===== */}
      {region.marketInfo && (
        <ScrollReveal>
          <section className="bg-gradient-to-b from-slate-50 to-white py-10">
            <div className="mx-auto max-w-[1400px] px-6">
              <p className="text-center text-sm leading-relaxed text-slate-600 md:text-base">
                {region.marketInfo}
              </p>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ===== TRUST METRICS — REFINED CARDS ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-36">
        {/* Subtle background texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 118 110) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-600)]">
                Výsledky mluví za nás
              </p>
              <h2 className="section-heading text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
                Proč nám klienti důvěřují
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">
                Transparentní a férový výkup bez skrytých poplatků — od prvního
                kontaktu po peníze na účtu
              </p>
            </div>
          </ScrollReveal>
          <FloatingStats metrics={TRUST_METRICS} />
          <ScrollReveal delay={300}>
            <div className="mt-16 grid gap-5 sm:grid-cols-3">
              <div className="glass-card rounded-2xl p-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)]">
                  <Star
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-600">
                  Férová cena stanovená na základě aktuálního trhu
                </p>
              </div>
              <div className="glass-card rounded-2xl p-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)]">
                  <FileSignature
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-600">
                  Advokátní úschova kupní ceny pro vaši bezpečnost
                </p>
              </div>
              <div className="glass-card rounded-2xl p-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)]">
                  <Banknote
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-600">
                  Záloha vyplacena ihned při podpisu smlouvy
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE — BUILDING TIMELINE ===== */}
      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-600)]">
                  Jednoduchý proces
                </p>
                <h2 className="section-heading text-3xl text-slate-900 sm:text-4xl">
                  Jak to funguje
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-500">
                  Od prvního kontaktu k penězům na účtu — sledujte, jak vaše
                  budoucnost roste.
                </p>
              </div>
              <div className="shadow-elevated relative aspect-[16/10] overflow-hidden rounded-3xl">
                <Image
                  src="/images/section-process.jpg"
                  alt="Proces výkupu nemovitosti – profesionální jednání"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-12 pt-12">
            <BuildingTimeline steps={processSteps} />
          </div>

          <ScrollReveal>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <Link
                href="/jak-to-funguje"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Zjistěte více o celém procesu výkupu nemovitostí"
              >
                Více o celém procesu
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/garance-vykupu"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Prohlédněte si naše garance výkupu"
              >
                Naše garance
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== ŘEŠÍME I SLOŽITÉ SITUACE ===== */}
      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />
        <div className="orb orb-theme-1 -left-40 -top-40" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 right-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-400)]">
              Zkušenosti s každou situací
            </p>
            <h2 className="section-heading text-3xl text-white sm:text-4xl">
              Řešíme i složité situace
            </h2>
            <p className="mt-3 max-w-xl text-lg text-slate-400">
              Nemovitost s problémem? Žádný strach — máme řešení pro každou
              situaci.
            </p>
          </ScrollReveal>
          <div className="mt-10">
            <DoorCards situations={complexSituations} />
          </div>
          <ScrollReveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                { href: "/vykup-pri-exekuci", label: "Výkup při exekuci" },
                { href: "/vykup-pri-dedictvi", label: "Výkup při dědictví" },
                {
                  href: "/vykup-cinzovnich-domu",
                  label: "Výkup činžovních domů",
                },
                {
                  href: "/vykup-pri-privatizaci",
                  label: "Výkup při privatizaci",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
                  aria-label={`Více informací o ${link.label.toLowerCase()}`}
                >
                  {link.label}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== VISUAL BREAK: PROPERTY EXTERIOR ===== */}
      <section className="relative flex h-[350px] items-center justify-center overflow-hidden sm:h-[400px] lg:h-[450px]">
        <Image
          src="/images/property-exterior.jpg"
          alt={`Rezidenční nemovitost ${region.locative} – profesionální výkup`}
          fill
          loading="lazy"
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/85"
          aria-hidden="true"
        />
        <div className="relative px-6 text-center">
          <p className="section-heading text-2xl text-white drop-shadow-lg sm:text-3xl lg:text-4xl">
            Pomáháme majitelům nemovitostí {region.locative}
          </p>
          <p className="mt-3 text-base text-white/60">
            i po celé České republice
          </p>
        </div>
      </section>

      {/* ===== PROČ KLIENTI VOLÍ NÁS (USP) ===== */}
      <ParallaxSection offset={20}>
        <section className="bg-gradient-to-br from-[var(--theme-700)] via-[var(--theme-800)] to-[var(--theme-900)] py-20 text-white md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1400px] px-6">
            <ScrollReveal>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-300)]">
                Vaše výhody
              </p>
              <h2 className="section-heading text-3xl text-white sm:text-4xl">
                Proč klienti volí nás
              </h2>
            </ScrollReveal>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {region.uspPoints.map((point, idx) => (
                <ScrollReveal key={point} delay={idx * 100} as="li">
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.08]">
                    <CheckCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-300)]"
                      aria-hidden="true"
                    />
                    <span className="text-white/85">{point}</span>
                  </div>
                </ScrollReveal>
              ))}
            </ul>
            <ScrollReveal delay={400}>
              <div className="mt-10 text-center">
                <Link
                  href="/zpetny-najem"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
                  aria-label="Zjistěte více o zpětném nájmu a možnosti odkupu nemovitosti"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Zpětný nájem — prodejte a zůstaňte bydlet
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>

      {/* ===== O NÁS ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(var(--theme-rgb-100), 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(var(--theme-rgb-50), 0.4) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal className="shadow-elevated relative aspect-[4/3] overflow-hidden rounded-3xl">
              <ParallaxImage
                src="/images/modern-living.jpg"
                alt="Moderní bydlení – transparentní výkup nemovitostí"
                className="aspect-[4/3] rounded-3xl"
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-600)]">
                  Kdo jsme
                </p>
                <h2 className="section-heading text-3xl text-slate-900 sm:text-4xl">
                  O nás
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-500">
                  Specializujeme se na rychlý a férový výkup nemovitostí{" "}
                  {region.locative}. Nabízíme transparentní proces, férovou cenu
                  a kompletní právní servis zdarma. Jsme vám k dispozici osobně
                  i na dálku — {region.locative} zajistíme kompletní servis
                  včetně právního zastoupení.
                </p>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {ABOUT_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="border-l-2 border-[var(--theme-400)] pl-5"
                    >
                      <p className="text-3xl font-bold text-[var(--theme-700)]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/proc-my"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                    aria-label="Zjistěte proč si vybrat nás pro výkup nemovitostí"
                  >
                    Zjistěte více o nás
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON CALCULATOR ===== */}
      <ComparisonCalculator />

      {/* ===== LEAD FORM + CO SE STANE PO ODESLÁNÍ ===== */}
      <section
        className="relative overflow-hidden bg-slate-950 py-20 md:py-28"
        id="kontakt"
      >
        {/* Dot pattern background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        {/* Gradient accents */}
        <div
          className="bg-[var(--theme-700)]/10 pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="bg-[var(--theme-600)]/10 pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full blur-[100px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-400)]">
                Začněte zde
              </p>
              <h2 className="section-heading text-3xl text-white sm:text-4xl lg:text-5xl">
                Získejte nezávaznou nabídku
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Vyplňte formulář a my vás kontaktujeme do 30 minut
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-16 lg:grid-cols-2">
            <ScrollReveal delay={200}>
              <div className="flex flex-col justify-center">
                <div className="mb-10 grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[var(--theme-400)] md:text-5xl">
                      <SlotCounter value="0 Kč" />
                    </p>
                    <p className="mt-2 text-xs text-slate-400">provize</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[var(--theme-400)] md:text-5xl">
                      <SlotCounter value="14" />
                    </p>
                    <p className="mt-2 text-xs text-slate-400">krajů ČR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[var(--theme-400)] md:text-5xl">
                      <SlotCounter value="48h" />
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      peníze na účtu
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Co se stane po odeslání
                </h3>
                <ul className="mt-8 space-y-6">
                  {FORM_BENEFITS.map((benefit, idx) => (
                    <li key={benefit} className="flex items-start gap-4">
                      <span className="bg-[var(--theme-600)]/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[var(--theme-400)]">
                        {idx + 1}
                      </span>
                      <span className="text-lg text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <h3 className="text-lg font-semibold text-white">
                    Nezávazná konzultace zdarma
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Působíme {region.locative}:{" "}
                    {region.supportedCities.join(", ")}.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {region.legalDisclaimer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm lg:p-10">
                <LeadForm regionName={region.name} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <PropertyEstimator regionKey={region.key} />

      {/* ===== NEARBY REGIONS ===== */}
      {neighborRegions.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="section-heading mb-10 text-center text-2xl text-slate-900 sm:text-3xl">
              Výkup nemovitostí v okolních krajích
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {neighborRegions.map((r) => (
                <a
                  key={r.key}
                  href={r.url}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[var(--theme-200)] hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-50)] transition-colors group-hover:bg-[var(--theme-100)]">
                    <MapPin className="h-5 w-5 text-[var(--theme-600)]" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 group-hover:text-[var(--theme-700)]">
                      {r.name}
                    </span>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Výkup nemovitostí {r.locative}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ (merged regional + general) ===== */}
      <section className="bg-white py-20 md:py-28 lg:py-36">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-600)]">
                Odpovědi na vaše otázky
              </p>
              <h2 className="section-heading text-2xl text-slate-900 sm:text-3xl lg:text-4xl">
                Časté dotazy k výkupu {region.locative}
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Vše, co potřebujete vědět o výkupu nemovitostí
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-12">
              <FaqAccordion
                items={[
                  ...(region.regionFaq ?? []),
                  ...(region.additionalFaq ?? []),
                  ...regionalFaq,
                  ...region.faq,
                ]}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PŮSOBÍME V CELÉ ČR — INTERACTIVE MAP ===== */}
      <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />
        <div className="orb orb-theme-1 -left-40 top-10" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 -right-20"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[var(--theme-400)]">
              Celostátní pokrytí
            </p>
            <h2 className="section-heading mb-4 text-center text-2xl text-white sm:text-3xl lg:text-4xl">
              Působíme v celé České republice
            </h2>
            <p className="mb-12 text-center text-slate-400">
              Klikněte na kraj pro více informací
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <CzechMap currentRegion={region.key} />
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {allRegions.map((r) => (
              <a
                key={r.key}
                href={r.url}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
              >
                Výkup {r.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
