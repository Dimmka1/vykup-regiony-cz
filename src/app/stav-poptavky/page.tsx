"use client";

import type { ReactElement } from "react";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { LEAD_STAGES, STAGE_LABELS } from "@/lib/lead-status";
import type { LeadStage, LeadStatusResponse } from "@/lib/lead-status";

type FetchState =
  | { status: "loading" }
  | { status: "error"; code: string }
  | { status: "success"; data: LeadStatusResponse };

function StageIcon({
  state,
}: {
  state: "completed" | "current" | "upcoming";
}): ReactElement {
  if (state === "completed") {
    return <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />;
  }
  if (state === "current") {
    return (
      <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden="true" />
    );
  }
  return <Clock className="h-6 w-6 text-slate-400" aria-hidden="true" />;
}

function getStageState(
  stage: LeadStage,
  currentStage: LeadStage,
): "completed" | "current" | "upcoming" {
  const currentIndex = LEAD_STAGES.indexOf(currentStage);
  const stageIndex = LEAD_STAGES.indexOf(stage);

  if (stageIndex < currentIndex) return "completed";
  if (stageIndex === currentIndex) return "current";
  return "upcoming";
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function StatusTracker(): ReactElement {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [fetchState, setFetchState] = useState<FetchState>({
    status: "loading",
  });

  const fetchStatus = useCallback(async (leadToken: string) => {
    try {
      const res = await fetch(`/api/lead-status/${leadToken}`);
      if (!res.ok) {
        const body = (await res.json()) as { code?: string };
        setFetchState({
          status: "error",
          code: body.code ?? "UNKNOWN",
        });
        return;
      }
      const data = (await res.json()) as LeadStatusResponse;
      setFetchState({ status: "success", data });
    } catch {
      setFetchState({ status: "error", code: "NETWORK_ERROR" });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && token) {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "status_page_view" as never,
        lead_token: token,
      } as never);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !/^[a-f0-9]{12}$/.test(token)) {
      setFetchState({ status: "error", code: "INVALID_TOKEN" });
      return;
    }
    void fetchStatus(token);
  }, [token, fetchStatus]);

  if (fetchState.status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--theme-600)]" />
      </div>
    );
  }

  if (fetchState.status === "error") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle
            className="mx-auto mb-4 h-12 w-12 text-red-400"
            aria-hidden="true"
          />
          <h1 className="mb-2 text-xl font-bold text-slate-900">
            {fetchState.code === "NOT_FOUND"
              ? "Poptávka nenalezena"
              : fetchState.code === "INVALID_TOKEN"
                ? "Neplatný odkaz"
                : "Chyba při načítání"}
          </h1>
          <p className="text-slate-600">
            {fetchState.code === "NOT_FOUND"
              ? "Zkontrolujte prosím odkaz, který jste obdrželi."
              : fetchState.code === "INVALID_TOKEN"
                ? "Odkaz na stav poptávky je neplatný."
                : "Zkuste to prosím později."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded bg-[var(--theme-600)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--theme-700)]"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    );
  }

  const { data } = fetchState;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--theme-50)] to-white px-4 py-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Stav vaší poptávky
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Kód: {data.token.slice(0, 4)}…{data.token.slice(-4)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ol className="relative space-y-0">
            {data.stages.map((stageData, index) => {
              const state = getStageState(stageData.stage, data.currentStage);
              const isLast = index === data.stages.length - 1;

              return (
                <li
                  key={stageData.stage}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className={`absolute left-5 top-10 h-full w-0.5 -translate-x-1/2 ${
                        state === "completed" || state === "current"
                          ? "bg-[var(--theme-500)]"
                          : "bg-slate-200"
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      state === "completed"
                        ? "bg-[var(--theme-600)]"
                        : state === "current"
                          ? "bg-[var(--theme-500)] ring-4 ring-[var(--theme-100)]"
                          : "border-2 border-slate-200 bg-white"
                    }`}
                  >
                    <StageIcon state={state} />
                  </div>

                  {/* Label + timestamp */}
                  <div className="min-w-0 pt-1.5">
                    <p
                      className={`text-base font-semibold ${
                        state === "upcoming"
                          ? "text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {stageData.label}
                    </p>
                    {stageData.completedAt && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatTimestamp(stageData.completedAt)}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {data.note && (
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Poznámka: </span>
                {data.note}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Máte dotaz? Zavolejte nám na{" "}
            <a
              href="tel:+420776424145"
              className="font-semibold text-[var(--theme-600)] hover:underline"
            >
              +420 776 424 145
            </a>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-[var(--theme-600)] hover:underline"
          >
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function StavPoptavkyPage(): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--theme-600)]" />
        </div>
      }
    >
      <StatusTracker />
    </Suspense>
  );
}
