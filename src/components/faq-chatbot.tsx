"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/* ───────── FAQ data ───────── */

interface FaqItem {
  question: string;
  answer: string;
  keywords: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Jak rychle dostanu nabídku?",
    answer:
      "Předběžnou nabídku na vaši nemovitost připravíme do 24 hodin od dodání základních údajů.",
    keywords: ["rychle", "nabídka", "doba", "jak dlouho", "čas", "24"],
  },
  {
    question: "Kolik za výkup zaplatím?",
    answer:
      "Neplatíte nic — žádné provize, žádné skryté poplatky. Veškeré náklady hradíme my.",
    keywords: [
      "kolik",
      "cena",
      "poplatek",
      "provize",
      "zaplatím",
      "stojí",
      "zdarma",
    ],
  },
  {
    question: "Vykupujete i nemovitosti s exekucí?",
    answer:
      "Ano, řešíme i nemovitosti zatížené exekucí, zástavou nebo dluhy. Pomůžeme vám s celým procesem.",
    keywords: ["exekuce", "dluh", "zástava", "zatížen"],
  },
  {
    question: "Mohu prodat podíl na nemovitosti?",
    answer:
      "Ano, podílové vlastnictví řešíme často — připravíme varianty podle dohody mezi spoluvlastníky.",
    keywords: ["podíl", "spoluvlastník", "spoluvlastnictví", "rozvod"],
  },
  {
    question: "Jak probíhá celý proces výkupu?",
    answer:
      "1) Pošlete nám údaje o nemovitosti. 2) Do 24h dostanete nabídku. 3) Dohodneme podmínky. 4) Podepíšeme smlouvu u notáře. 5) Peníze máte na účtu.",
    keywords: ["proces", "postup", "jak to funguje", "kroky", "probíhá"],
  },
  {
    question: "Ve kterých krajích působíte?",
    answer:
      "Působíme po celé České republice — od Prahy přes Středočeský kraj až po Moravu a Slezsko.",
    keywords: [
      "kraj",
      "kde",
      "oblast",
      "region",
      "město",
      "česko",
      "republika",
    ],
  },
  {
    question: "Vykupujete i domy a chalupy?",
    answer:
      "Ano, vykupujeme byty, rodinné domy, chalupy, chaty i komerční nemovitosti.",
    keywords: ["dům", "chalupa", "chata", "rodinný", "komerční", "typ"],
  },
  {
    question: "Je konzultace nezávazná?",
    answer: "Ano, první konzultace i ocenění jsou zcela nezávazné a zdarma.",
    keywords: ["konzultace", "nezávazn", "zdarma", "závazek"],
  },
  {
    question: "Řešíte nemovitosti s nájemníkem?",
    answer:
      "Ano, standardně oceňujeme i jednotky s nájemníkem a navrhneme bezpečný postup převodu bez výpadku nájmu.",
    keywords: ["nájemník", "nájemní", "pronájem", "nájem"],
  },
  {
    question: "Mohu řešit podpis mimo pracovní dny?",
    answer:
      "Ano, běžně domlouváme termíny i večer nebo o víkendu — přizpůsobíme se vašemu času.",
    keywords: ["víkend", "podpis", "termín", "večer", "pracovní"],
  },
  {
    question: "Kolik procent tržní ceny nabízíte?",
    answer:
      "Nabízíme obvykle 85–92 % tržní hodnoty, přičemž celý proces je výrazně rychlejší než klasický prodej.",
    keywords: ["procent", "tržní", "hodnota", "85", "92", "kolik dostanu"],
  },
  {
    question: "Řešíte i dědictví a pozůstalosti?",
    answer:
      "Ano, pomáháme s výkupem zděděných nemovitostí včetně koordinace mezi dědici.",
    keywords: ["dědictví", "pozůstalost", "dědit", "dědic", "zděděn"],
  },
];

const CATEGORIES = [
  { label: "💰 Cena a poplatky", indices: [1, 10] },
  { label: "⚡ Rychlost procesu", indices: [0, 4] },
  { label: "🏠 Typy nemovitostí", indices: [6, 8] },
  { label: "⚖️ Složité případy", indices: [2, 3, 11] },
  { label: "📍 Kde působíme", indices: [5] },
  { label: "📋 Obecné", indices: [7, 9] },
];

/* ───────── Types ───────── */

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  text: string;
  chips?: number[];
}

type CallbackState = "idle" | "form" | "submitting" | "success" | "error";

const SESSION_KEY = "faq-chatbot-dismissed";

/* ───────── Matching ───────── */

function findAnswer(input: string): FaqItem | null {
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  let bestMatch: FaqItem | null = null;
  let bestScore = 0;

  for (const item of FAQ_ITEMS) {
    let score = 0;
    for (const kw of item.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(normKw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

/* ───────── Component ───────── */

const CZ_PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

export function FaqChatbot(): ReactElement {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [callbackState, setCallbackState] = useState<CallbackState>("idle");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = () => ++idRef.current;

  // Scroll to bottom on new messages
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, callbackState]);

  // Init greeting
  useEffect(() => {
    if (open && messages.length === 0) {
      const categoryIndices = CATEGORIES.map((_, i) => i);
      setMessages([
        {
          id: nextId(),
          role: "bot",
          text: "Ahoj! 👋 Jak vám mohu pomoci? Vyberte téma nebo napište dotaz.",
          chips: categoryIndices,
        },
      ]);
    }
  }, [open, messages.length]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    sessionStorage.removeItem(SESSION_KEY);
    trackEvent("chatbot_interaction", { action: "open" });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  const addBotMessage = useCallback((text: string, chips?: number[]) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "bot", text, chips },
    ]);
  }, []);

  const handleCategoryClick = useCallback(
    (catIdx: number) => {
      const cat = CATEGORIES[catIdx];
      if (!cat) return;
      trackEvent("chatbot_interaction", {
        action: "question_click",
        category: cat.label,
      });

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: cat.label },
      ]);

      // Show questions from this category as chips
      const questionChips = cat.indices;
      addBotMessage(
        `Zde jsou časté dotazy k tématu "${cat.label.slice(2)}":`,
        questionChips,
      );
    },
    [addBotMessage],
  );

  const handleQuestionClick = useCallback(
    (faqIdx: number) => {
      const item = FAQ_ITEMS[faqIdx];
      if (!item) return;
      trackEvent("chatbot_interaction", {
        action: "question_click",
        question: item.question,
      });

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: item.question },
      ]);
      addBotMessage(item.answer);
    },
    [addBotMessage],
  );

  const showFallback = useCallback(() => {
    setCallbackState("form");
    addBotMessage(
      "Bohužel na toto nemám odpověď. Chcete, abychom vám zavolali? Nechte nám telefon a ozveme se.",
    );
  }, [addBotMessage]);

  const handleSend = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;

      trackEvent("chatbot_interaction", { action: "type", query: trimmed });
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: trimmed },
      ]);
      setInput("");

      const match = findAnswer(trimmed);
      if (match) {
        addBotMessage(match.answer);
      } else {
        showFallback();
      }
    },
    [input, addBotMessage, showFallback],
  );

  const handleCallbackSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!CZ_PHONE_REGEX.test(phone.trim())) {
        setPhoneError("Zadejte telefon ve formátu +420 xxx xxx xxx");
        return;
      }
      setPhoneError("");
      setCallbackState("submitting");
      trackEvent("chatbot_interaction", { action: "callback_submit" });

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "callback",
            phone: phone.trim(),
            source: "faq-chatbot",
          }),
        });
        if (!res.ok) throw new Error("API error");
        setCallbackState("success");
        addBotMessage("Děkujeme! Zavoláme vám zpět co nejdříve. 📞");
      } catch {
        setCallbackState("error");
        addBotMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
        setCallbackState("form");
      }
    },
    [phone, addBotMessage],
  );

  // Check dismissed state
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    setDismissed(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  if (!open && dismissed) {
    // Show button anyway (dismissed just means closed once, still show button)
  }

  return (
    <>
      {/* Floating button — positioned above potential WhatsApp button area */}
      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Otevřít chatbot"
          className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-600)] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 md:bottom-6 md:right-20"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:inset-auto sm:bottom-4 sm:right-4">
          {/* Backdrop on mobile */}
          <div
            className="absolute inset-0 bg-black/20 sm:hidden"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[500px] sm:w-[380px] sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-[var(--theme-600)] px-4 py-3 text-white">
              <span className="text-sm font-semibold">💬 FAQ Asistent</span>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Zavřít chatbot"
                className="rounded p-1 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "bot"
                        ? "bg-slate-100 text-slate-800"
                        : "ml-auto bg-[var(--theme-600)] text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* Chips */}
                  {msg.role === "bot" && msg.chips && msg.chips.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.chips.map((idx) => {
                        // Determine if it's a category chip or FAQ chip
                        const cat = CATEGORIES[idx];
                        const faq = FAQ_ITEMS[idx];
                        // If the message text contains "téma" it's category chips
                        const isCategory =
                          msg.text.includes("téma") ||
                          msg.text.includes("Ahoj");

                        if (isCategory && cat) {
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleCategoryClick(idx)}
                              className="rounded-full border border-[var(--theme-300)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--theme-700)] transition hover:bg-[var(--theme-50)]"
                            >
                              {cat.label}
                            </button>
                          );
                        }

                        if (!isCategory && faq) {
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleQuestionClick(idx)}
                              className="rounded-full border border-[var(--theme-300)] bg-white px-3 py-1.5 text-left text-xs font-medium text-[var(--theme-700)] transition hover:bg-[var(--theme-50)]"
                            >
                              {faq.question}
                            </button>
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Callback form */}
              {(callbackState === "form" || callbackState === "submitting") && (
                <form
                  onSubmit={handleCallbackSubmit}
                  className="flex gap-2 rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex-1">
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+420 xxx xxx xxx"
                      value={phone}
                      onChange={(e) => {
                        setPhone(
                          e.target.value.replace(/[^\d+\s]/g, "").slice(0, 20),
                        );
                        if (phoneError) setPhoneError("");
                      }}
                      className={`w-full rounded-lg border px-3 py-2 text-sm ${
                        phoneError ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                    {phoneError && (
                      <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={callbackState === "submitting"}
                    className="flex items-center gap-1 rounded-lg bg-[var(--theme-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--theme-700)] disabled:opacity-70"
                  >
                    <Phone className="h-4 w-4" />
                    Zavolat
                  </button>
                </form>
              )}
              <div ref={msgEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-slate-200 px-3 py-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Napište dotaz..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              />
              <button
                type="submit"
                aria-label="Odeslat"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-600)] text-white transition hover:bg-[var(--theme-700)]"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
