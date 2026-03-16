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
  TrendingUp,
  MapPin,
  Building,
  Star,
  RefreshCw,
} from "lucide-react";

const HOME_CLIENT_COUNT = process.env.NEXT_PUBLIC_CLIENT_COUNT || "50";

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
  { label: "Garance ceny ve smlouvě", value: "100 %", icon: "ShieldCheck" },
] as const;

const ABOUT_STATS = [
  { value: "100%", label: "transparentnost" },
  { value: "0 Kč", label: "provize" },
  { value: "14", label: "krajů ČR" },
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
        <section className="bg-gradient-to-r from-emerald-50 to-teal-50 py-5">
          <div className="mx-auto max-w-[1400px] px-6">
            <Link
              href="/zpetny-najem"
              className="mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-white/80 px-6 py-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <RefreshCw
                  className="h-5 w-5 text-emerald-600"
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm font-semibold text-slate-800 sm:text-base">
                Možnost zpětného odkupu nemovitosti
              </span>
              <span className="ml-auto text-xs font-medium text-emerald-600">
                Zjistit více →
              </span>
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

      {/* ===== TRH V REGIONU ===== */}
      {region.marketAnalysis && (
        <section className="section-md bg-luxury-mesh relative overflow-hidden">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <ScrollReveal>
                <div className="lg:sticky lg:top-28">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <TrendingUp className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Trh {region.locative}
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
                  {region.marketAnalysis}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ===== JAK PROBÍHÁ VÝKUP ===== */}
      {region.localProcess && (
        <section className="section-md bg-luxury-warm">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <ScrollReveal>
                <div className="lg:sticky lg:top-28">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <Building className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Jak probíhá výkup {region.locative}
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
                  {region.localProcess}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ===== KDE VYKUPUJEME ===== */}
      {region.neighborhoodGuide && (
        <section className="section-md bg-luxury-mesh relative overflow-hidden">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <ScrollReveal>
                <div className="lg:sticky lg:top-28">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Kde vykupujeme {region.locative}
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
                  {region.neighborhoodGuide}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ===== TRUST METRICS — 3D FLOATING CARDS ===== */}
      <section className="bg-luxury-mesh noise-overlay section-lg relative overflow-hidden">
        <div className="orb orb-theme-1 -right-40 -top-40" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 left-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-600)]">
                Výsledky mluví za nás
              </p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                Proč nám klienti důvěřují
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Transparentní a férový výkup bez skrytých poplatků — od prvního
                kontaktu po peníze na účtu
              </p>
            </div>
          </ScrollReveal>
          <FloatingStats metrics={TRUST_METRICS} />
          <ScrollReveal delay={300}>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--theme-100)] bg-white/60 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)]">
                  <Star
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Férová cena stanovená na základě aktuálního trhu
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--theme-100)] bg-white/60 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)]">
                  <FileSignature
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Advokátní úschova kupní ceny pro vaši bezpečnost
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--theme-100)] bg-white/60 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)]">
                  <Banknote
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Záloha vyplacena ihned při podpisu smlouvy
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE — BUILDING TIMELINE ===== */}
      <section className="section-md bg-luxury-warm noise-overlay">
        <div className="container-wide">
          <ScrollReveal>
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Jak to funguje
                </h2>
                <p className="mt-2 text-slate-600">
                  Od prvního kontaktu k penězům na účtu — sledujte, jak vaše
                  budoucnost roste.
                </p>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/section-process.jpg"
                  alt="Proces výkupu nemovitosti – profesionální jednání"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-10">
            <BuildingTimeline steps={processSteps} />
          </div>

          <ScrollReveal>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/jak-to-funguje"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Zjistěte více o celém procesu výkupu nemovitostí"
              >
                Více o celém procesu →
              </Link>
              <Link
                href="/garance-vykupu"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Prohlédněte si naše garance výkupu"
              >
                Naše garance →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== ŘEŠÍME I SLOŽITÉ SITUACE ===== */}
      <section className="bg-luxury-dark relative overflow-hidden py-20 md:py-28">
        <div className="orb orb-theme-1 -left-40 -top-40" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 right-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Řešíme i složité situace
            </h2>
            <p className="mt-2 text-slate-300">
              Nemovitost s problémem? Žádný strach - máme řešení pro každou
              situaci.
            </p>
          </ScrollReveal>
          <div className="mt-8">
            <DoorCards situations={complexSituations} />
          </div>
          <ScrollReveal>
            <div className="mt-6 text-center">
              <Link
                href="/vykup-pri-exekuci"
                className="mr-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
                aria-label="Více informací o výkupu nemovitostí při exekuci"
              >
                Výkup při exekuci →
              </Link>
              <Link
                href="/vykup-pri-dedictvi"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
                aria-label="Více informací o výkupu nemovitostí při dědictví"
              >
                Výkup při dědictví →
              </Link>
              <Link
                href="/vykup-cinzovnich-domu"
                className="mr-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
                aria-label="Více informací o výkupu činžovních domů"
              >
                Výkup činžovních domů →
              </Link>
              <Link
                href="/vykup-pri-privatizaci"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
                aria-label="Více informací o výkupu při privatizaci"
              >
                Výkup při privatizaci →
              </Link>
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
          className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/50"
          aria-hidden="true"
        />
        <div className="relative px-6">
          <p className="text-center text-xl font-bold text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
            Pomáháme majitelům nemovitostí {region.locative} i po celé České
            republice
          </p>
        </div>
      </section>

      {/* ===== PROČ KLIENTI VOLÍ NÁS (USP) ===== */}
      <ParallaxSection offset={20}>
        <section className="section-md bg-gradient-to-br from-[var(--theme-700)] via-[var(--theme-800)] to-[var(--theme-900)] text-white">
          <div className="mx-auto max-w-[1400px] px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Proč klienti volí nás
              </h2>
            </ScrollReveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {region.uspPoints.map((point, idx) => (
                <ScrollReveal key={point} delay={idx * 100} as="li">
                  <div className="glass flex h-full items-start gap-3 rounded-2xl p-6">
                    <CheckCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-400)]"
                      aria-hidden="true"
                    />
                    <span className="text-white/90">{point}</span>
                  </div>
                </ScrollReveal>
              ))}
            </ul>
            <ScrollReveal delay={400}>
              <div className="mt-8 text-center">
                <Link
                  href="/zpetny-najem"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition hover:text-white"
                  aria-label="Zjistěte více o zpětném nájmu a možnosti odkupu nemovitosti"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Zpětný nájem — prodejte a zůstaňte bydlet →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>

      {/* ===== O NÁS ===== */}
      <section className="section-lg bg-luxury-mesh relative overflow-hidden">
        <div className="orb orb-theme-2 -left-40 top-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <ScrollReveal className="shadow-layered relative aspect-[4/3] rounded-3xl">
              <ParallaxImage
                src="/images/modern-living.jpg"
                alt="Moderní bydlení – transparentní výkup nemovitostí"
                className="aspect-[4/3] rounded-3xl"
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  O nás
                </h2>
                <p className="mt-4 leading-relaxed text-slate-700">
                  Specializujeme se na rychlý a férový výkup nemovitostí{" "}
                  {region.locative}. Nabízíme transparentní proces, férovou cenu
                  a kompletní právní servis zdarma. Jsme vám k dispozici osobně
                  i na dálku — {region.locative} zajistíme kompletní servis
                  včetně právního zastoupení.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {ABOUT_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="border-l-2 border-[var(--theme-500)] pl-4"
                    >
                      <p className="text-2xl font-bold text-[var(--theme-700)]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    href="/proc-my"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                    aria-label="Zjistěte proč si vybrat nás pro výkup nemovitostí"
                  >
                    Zjistěte více o nás →
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
        className="section-md relative overflow-hidden bg-slate-900"
        id="kontakt"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Získejte nezávaznou nabídku
              </h2>
              <p className="mt-3 text-lg text-slate-400">
                Vyplňte formulář a my vás kontaktujeme do 30 minut
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-2">
            <ScrollReveal delay={200}>
              <div className="flex flex-col justify-center">
                <div className="mb-8 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[var(--theme-400)] md:text-4xl">
                      <SlotCounter value={`${HOME_CLIENT_COUNT}+`} />
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      spokojených klientů
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[var(--theme-400)] md:text-4xl">
                      <SlotCounter value="14" />
                    </p>
                    <p className="mt-1 text-xs text-slate-400">krajů ČR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[var(--theme-400)] md:text-4xl">
                      <SlotCounter value="48h" />
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      peníze na účtu
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Co se stane po odeslání
                </h3>
                <ul className="mt-6 space-y-5">
                  {FORM_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--theme-600)] text-white">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-lg text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
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
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <LeadForm regionName={region.name} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <PropertyEstimator regionKey={region.key} />

      {/* ===== NEARBY REGIONS ===== */}
      {neighborRegions.length > 0 && (
        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Výkup nemovitostí v okolních krajích
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {neighborRegions.map((r) => (
                <a
                  key={r.key}
                  href={r.url}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[var(--theme-200)] hover:shadow-md"
                >
                  <MapPin className="h-5 w-5 shrink-0 text-[var(--theme-600)]" />
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

      {/* ===== REGION FAQ ===== */}
      {((region.regionFaq && region.regionFaq.length > 0) ||
        (region.additionalFaq && region.additionalFaq.length > 0)) && (
        <section className="section-md bg-gradient-to-b from-slate-50 to-white">
          <div className="container-narrow">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Otázky k výkupu {region.locative}
                </h2>
                <p className="mt-3 text-lg text-slate-600">
                  Odpovědi na nejčastější dotazy specifické pro váš region
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="mt-10">
                <FaqAccordion
                  items={[
                    ...(region.regionFaq ?? []),
                    ...(region.additionalFaq ?? []),
                  ]}
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section className="section-md">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Časté dotazy
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Vše, co potřebujete vědět o výkupu nemovitostí
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-10">
              <FaqAccordion items={[...regionalFaq, ...region.faq]} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PŮSOBÍME V CELÉ ČR — INTERACTIVE MAP ===== */}
      <section className="section-md relative overflow-hidden bg-slate-900">
        <div className="orb orb-theme-1 -left-40 top-10" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 -right-20"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <h2 className="mb-4 text-center text-2xl font-bold text-white sm:text-3xl">
              Působíme v celé České republice
            </h2>
            <p className="mb-10 text-center text-slate-400">
              Klikněte na kraj pro více informací
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <CzechMap currentRegion={region.key} />
          </ScrollReveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {allRegions.map((r) => (
              <a
                key={r.key}
                href={r.url}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-center text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
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
