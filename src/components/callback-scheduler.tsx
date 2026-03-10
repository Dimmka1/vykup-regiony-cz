"use client";

import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { Calendar, Clock, Phone, User, X, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type SchedulerStep =
  | "day"
  | "slot"
  | "contact"
  | "submitting"
  | "success"
  | "error";

const SLOT_START_HOUR = 9;
const SLOT_END_HOUR = 18;
const SLOT_INTERVAL_MINUTES = 30;
const WORKDAYS_AHEAD = 5;

const CZ_PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

const DAY_NAMES_CS: Record<number, string> = {
  0: "Ne",
  1: "Po",
  2: "Út",
  3: "St",
  4: "Čt",
  5: "Pá",
  6: "So",
};

const MONTH_NAMES_CS: Record<number, string> = {
  0: "ledna",
  1: "února",
  2: "března",
  3: "dubna",
  4: "května",
  5: "června",
  6: "července",
  7: "srpna",
  8: "září",
  9: "října",
  10: "listopadu",
  11: "prosince",
};

interface WorkDay {
  date: Date;
  label: string;
  iso: string;
  isToday: boolean;
}

function getWorkDays(): WorkDay[] {
  const days: WorkDay[] = [];
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  let current = new Date(now);

  // If past working hours today, start from tomorrow
  if (now.getHours() >= SLOT_END_HOUR) {
    current.setDate(current.getDate() + 1);
  }

  while (days.length < WORKDAYS_AHEAD) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const iso = current.toISOString().slice(0, 10);
      days.push({
        date: new Date(current),
        label: `${DAY_NAMES_CS[dayOfWeek]} ${current.getDate()}. ${MONTH_NAMES_CS[current.getMonth()]}`,
        iso,
        isToday: iso === todayStr,
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function getTimeSlots(dayIso: string): string[] {
  const slots: string[] = [];
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const isToday = dayIso === todayStr;

  for (let hour = SLOT_START_HOUR; hour < SLOT_END_HOUR; hour++) {
    for (let min = 0; min < 60; min += SLOT_INTERVAL_MINUTES) {
      // Skip past slots for today
      if (
        isToday &&
        (hour < now.getHours() + 1 ||
          (hour === now.getHours() + 1 && min <= now.getMinutes()))
      ) {
        continue;
      }
      const hh = hour.toString().padStart(2, "0");
      const mm = min.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }

  return slots;
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+\s]/g, "").slice(0, 20);
}

export function CallbackScheduler(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<SchedulerStep>("day");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const workDays = useMemo(() => getWorkDays(), []);
  const timeSlots = useMemo(
    () => (selectedDay ? getTimeSlots(selectedDay) : []),
    [selectedDay],
  );

  const selectedDayLabel = useMemo(
    () => workDays.find((d) => d.iso === selectedDay)?.label ?? "",
    [workDays, selectedDay],
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setStep("day");
    setSelectedDay("");
    setSelectedSlot("");
    setPhone("");
    setName("");
    setError("");
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDaySelect = useCallback((iso: string) => {
    setSelectedDay(iso);
    setStep("slot");
  }, []);

  const handleSlotSelect = useCallback((slot: string) => {
    setSelectedSlot(slot);
    setStep("contact");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (name.trim().length < 2) {
        setError("Zadejte své jméno (min. 2 znaky)");
        return;
      }

      if (!CZ_PHONE_REGEX.test(phone.trim())) {
        setError("Zadejte telefon ve formátu +420 xxx xxx xxx");
        return;
      }

      setError("");
      setStep("submitting");

      try {
        const response = await fetch("/api/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            day: selectedDay,
            slot: selectedSlot,
          }),
        });

        if (!response.ok) {
          throw new Error("API error");
        }

        trackEvent("callback_scheduled", {
          day: selectedDay,
          slot: selectedSlot,
        });

        setStep("success");
      } catch {
        setStep("error");
        setError("Odeslání se nepodařilo. Zkuste to prosím znovu.");
      }
    },
    [name, phone, selectedDay, selectedSlot],
  );

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="btn-ripple inline-flex items-center gap-2 rounded-xl border-2 border-amber-500 bg-amber-500/10 px-6 py-3.5 text-base font-bold text-amber-600 transition hover:bg-amber-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:text-amber-400"
      >
        <Calendar className="h-5 w-5" />
        Naplánovat hovor
      </button>
    );
  }

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          Vyberte si čas konzultace
        </h3>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Zavřít"
          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-5 flex gap-1">
        {(["day", "slot", "contact"] as const).map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= (step === "day" ? 0 : step === "slot" ? 1 : 2)
                ? "bg-[var(--theme-500)]"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Step: Day selection */}
      {step === "day" && (
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
            <Calendar className="h-4 w-4" />
            Vyberte den
          </p>
          <div className="grid grid-cols-1 gap-2">
            {workDays.map((day) => (
              <button
                key={day.iso}
                type="button"
                onClick={() => handleDaySelect(day.iso)}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-[var(--theme-400)] hover:bg-[var(--theme-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              >
                <span>{day.label}</span>
                {day.isToday && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    Dnes
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Slot selection */}
      {step === "slot" && (
        <div>
          <button
            type="button"
            onClick={() => setStep("day")}
            className="mb-3 text-sm text-[var(--theme-600)] transition hover:text-[var(--theme-800)]"
          >
            ← {selectedDayLabel}
          </button>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
            <Clock className="h-4 w-4" />
            Vyberte čas
          </p>
          {timeSlots.length === 0 ? (
            <p className="text-sm text-slate-500">
              Pro tento den nejsou dostupné žádné sloty. Vyberte jiný den.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSlotSelect(slot)}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-[var(--theme-400)] hover:bg-[var(--theme-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step: Contact info */}
      {(step === "contact" || step === "submitting" || step === "error") && (
        <div>
          <button
            type="button"
            onClick={() => setStep("slot")}
            className="mb-3 text-sm text-[var(--theme-600)] transition hover:text-[var(--theme-800)]"
          >
            ← {selectedDayLabel}, {selectedSlot}
          </button>
          <div className="mb-4 rounded-lg bg-[var(--theme-50)] px-3 py-2 text-sm text-[var(--theme-800)]">
            📅 {selectedDayLabel} v {selectedSlot}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label
                htmlFor="scheduler-name"
                className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700"
              >
                <User className="h-3.5 w-3.5" />
                Vaše jméno
              </label>
              <input
                id="scheduler-name"
                type="text"
                autoComplete="name"
                placeholder="Jan Novák"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="scheduler-phone"
                className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700"
              >
                <Phone className="h-3.5 w-3.5" />
                Telefon
              </label>
              <input
                id="scheduler-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+420 xxx xxx xxx"
                value={phone}
                onChange={(e) => {
                  setPhone(normalizePhone(e.target.value));
                  if (error) setError("");
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                required
              />
            </div>
            {error && (
              <p className="text-xs text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={step === "submitting"}
              className="cta-glow btn-ripple mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-3 text-base font-bold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
            >
              {step === "submitting" ? "Odesílám..." : "Potvrdit rezervaci"}
            </button>
          </form>
        </div>
      )}

      {/* Success */}
      {step === "success" && (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Rezervováno!</h4>
          <p className="text-sm text-slate-600">
            Zavoláme vám <strong>{selectedDayLabel}</strong> v{" "}
            <strong>{selectedSlot}</strong>. Těšíme se!
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-2 text-sm font-medium text-[var(--theme-600)] transition hover:text-[var(--theme-800)]"
          >
            Zavřít
          </button>
        </div>
      )}
    </div>
  );
}
