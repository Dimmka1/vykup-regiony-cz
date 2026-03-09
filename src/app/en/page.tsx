import type { ReactElement } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  CheckCircle,
  FileText,
  Search,
  Banknote,
} from "lucide-react";
import { EnLeadForm } from "@/components/en-lead-form";

const PHONE = "+420 776 424 145";
const EMAIL = "info@vykoupim-nemovitost.cz";

const TRUST_STATS = [
  { value: "500+", label: "Properties purchased" },
  { value: "48h", label: "Cash payment" },
  { value: "100%", label: "Contract in English" },
] as const;

const STEPS = [
  {
    icon: FileText,
    title: "1. Contact Us",
    description:
      "Fill in the form or call us. Tell us about your property — no obligation.",
  },
  {
    icon: Search,
    title: "2. Free Valuation",
    description:
      "Our expert will evaluate your property and prepare a fair cash offer within 48 hours.",
  },
  {
    icon: Banknote,
    title: "3. Cash Offer & Quick Closing",
    description:
      "Accept our offer, sign the contract (in English), and receive cash payment within days.",
  },
] as const;

const TESTIMONIAL = {
  name: "James R.",
  location: "Prague 5",
  text: "The entire process was smooth and professional. They handled everything in English, and I had the money in my account within a week. Highly recommended for any expat looking to sell quickly.",
};

export default function EnPage(): ReactElement {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <Link href="/en" className="text-xl font-bold text-slate-900">
            Property Buyout CZ
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{PHONE}</span>
            </a>
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              🇨🇿 Česky
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Selling Property in Prague?
                  <br />
                  <span className="text-blue-200">
                    Get a Cash Offer in 48 Hours
                  </span>
                </h1>
                <p className="mb-8 text-lg text-blue-100">
                  No fees. No agents. Direct purchase. We buy apartments,
                  houses, and land across Prague and the Czech Republic — fast
                  and hassle-free.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {TRUST_STATS.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold sm:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs text-blue-200 sm:text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div id="contact-form">
                <EnLeadForm />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl bg-white p-6 shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Why Expats Choose Us
            </h2>
            <div className="mx-auto grid max-w-3xl gap-4">
              {[
                "Full process available in English — contracts, communication, support",
                "No hidden fees, no agent commissions",
                "Cash payment within 48 hours of signing",
                "We handle all legal paperwork and cadastre registration",
                "Over 500 properties purchased across the Czech Republic",
                "Free, no-obligation property valuation",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-sm text-slate-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-8 text-2xl font-bold text-slate-900 sm:text-3xl">
              What Our Clients Say
            </h2>
            <blockquote className="rounded-2xl bg-white p-8 shadow-md">
              <p className="mb-4 text-lg italic text-slate-700">
                &ldquo;{TESTIMONIAL.text}&rdquo;
              </p>
              <footer className="text-sm font-medium text-slate-500">
                — {TESTIMONIAL.name}, {TESTIMONIAL.location}
              </footer>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 py-12 text-center text-white sm:py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Ready to Sell Your Property?
            </h2>
            <p className="mb-6 text-blue-100">
              Get in touch today for a free cash offer. No obligation, no fees.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact-form"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Fill in the Form
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Call Us: {PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
            <div>
              © {new Date().getFullYear()} Vykoupím Nemovitost. All rights
              reserved.
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-1 hover:text-slate-700"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-1 hover:text-slate-700"
              >
                <Phone className="h-4 w-4" />
                {PHONE}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
