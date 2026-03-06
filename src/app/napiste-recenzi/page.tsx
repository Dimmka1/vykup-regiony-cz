"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";
import { StarRating } from "@/components/star-rating";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  rating: number;
  text: string;
  website: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  rating: 0,
  text: "",
  website: "",
};

export default function NapišteRecenziPage(): ReactElement {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const googleReviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (formData.name.trim().length < 2) {
      setErrorMessage("Zadejte prosím jméno.");
      return;
    }
    if (formData.rating === 0) {
      setErrorMessage("Vyberte prosím hodnocení.");
      return;
    }
    if (formData.text.trim().length < 10) {
      setErrorMessage("Napište prosím alespoň pár slov o vaší zkušenosti.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          rating: formData.rating,
          text: formData.text.trim(),
          website: formData.website,
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
    }
  };

  if (status === "success") {
    return (
      <>
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--theme-900)] pb-16 pt-28 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <nav aria-label="Drobečková navigace" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-slate-400">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Domů
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li className="font-medium text-white">Napište recenzi</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Děkujeme za vaši recenzi!
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-lg px-6 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--theme-100)]">
            <CheckCircle
              className="h-10 w-10 text-[var(--theme-600)]"
              aria-hidden="true"
            />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-slate-900">Děkujeme!</h2>
          <p className="mb-8 text-lg text-slate-600">
            Vaše recenze nám velmi pomáhá. Vážíme si vašeho času.
          </p>

          {googleReviewUrl ? (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--theme-700)] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[var(--theme-800)]"
            >
              Napište recenzi i na Google
              <ChevronRight className="h-4 w-4" />
            </a>
          ) : null}

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              Zpět na hlavní stránku
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <nav aria-label="Drobečková navigace" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Domů
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="font-medium text-white">Napište recenzi</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Napište recenzi
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Podělte se o svou zkušenost s&nbsp;naší službou. Vaše zpětná vazba
            nám pomáhá zlepšovat se.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-6 py-16">
        <form
          className="space-y-6 rounded-xl bg-white p-4 shadow sm:p-6"
          onSubmit={handleSubmit}
          aria-label="Formulář recenze"
        >
          <div>
            <label htmlFor="review-name" className="text-sm font-medium">
              Jméno
            </label>
            <input
              id="review-name"
              className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              placeholder="Vaše jméno"
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <span className="text-sm font-medium">Hodnocení</span>
            <div className="mt-2">
              <StarRating
                value={formData.rating}
                onChange={(rating) =>
                  setFormData((prev) => ({ ...prev, rating }))
                }
              />
            </div>
          </div>

          <div>
            <label htmlFor="review-text" className="text-sm font-medium">
              Vaše recenze
            </label>
            <textarea
              id="review-text"
              className="mt-1 min-h-[120px] w-full rounded border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              placeholder="Popište vaši zkušenost..."
              value={formData.text}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, text: e.target.value }))
              }
              required
            />
          </div>

          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="review-website">Website</label>
            <input
              id="review-website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, website: e.target.value }))
              }
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex min-h-11 w-full items-center justify-center rounded bg-[var(--theme-600)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {status === "submitting" ? "Odesílám..." : "Odeslat recenzi"}
          </button>

          {errorMessage ? (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </section>
    </>
  );
}
