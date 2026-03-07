"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "@/components/motion";
import { ChevronDown } from "lucide-react";
import type { ReactElement } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps): ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "shadow-premium border-[var(--theme-200)] bg-white"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-5 text-left md:px-8 md:py-6"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? "Zavřít" : "Otevřít"} odpověď: ${item.question}`}
            >
              <span className="pr-4 text-base font-semibold text-slate-800 md:text-lg">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[var(--theme-600)]" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-100 px-6 pb-6 pt-4 md:px-8 md:pb-8">
                    <p className="text-base leading-relaxed text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
