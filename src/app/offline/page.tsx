import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Phone, RefreshCcw, WifiOff } from "lucide-react";

const PHONE_DISPLAY = "+420 776 424 145";
const PHONE_TEL = "+420776424145";
const SMS_BODY = encodeURIComponent(
  "Dobrý den, chtěl/a bych poptat výkup nemovitosti. Děkuji.",
);

export const metadata: Metadata = {
  title: "Nejste připojeni k internetu",
  description:
    "Zdá se, že jste offline. Zavolejte nebo nám napište SMS na +420 776 424 145.",
  robots: { index: false, follow: false },
};

export default function OfflinePage(): React.ReactElement {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <WifiOff className="h-8 w-8 text-slate-500" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        Nejste připojeni k&nbsp;internetu
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        Stránku se nepodařilo načíst. Zkontrolujte připojení a zkuste to znovu,
        nebo nám zavolejte či pošlete SMS — ozveme se vám zpět.
      </p>
      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Zkusit znovu
        </Link>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
            aria-label={`Zavolat na ${PHONE_DISPLAY}`}
          >
            <Phone
              className="h-4 w-4 text-[var(--theme-600)]"
              aria-hidden="true"
            />
            Zavolat
          </a>
          <a
            href={`sms:${PHONE_TEL}?body=${SMS_BODY}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
            aria-label={`Napsat SMS na ${PHONE_DISPLAY}`}
          >
            <MessageSquare
              className="h-4 w-4 text-[var(--theme-600)]"
              aria-hidden="true"
            />
            Napsat SMS
          </a>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Telefonní číslo:{" "}
          <strong className="text-slate-700">{PHONE_DISPLAY}</strong>
        </p>
      </div>
    </div>
  );
}
