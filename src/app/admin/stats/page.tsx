"use client";

import { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StatsData {
  leadsByDay: { date: string; count: number }[];
  leadsByRegion: { region: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  generatedAt: string;
  note: string;
}

interface FunnelStep {
  step: string;
  label: string;
  count: number;
}

interface FunnelData {
  steps: FunnelStep[];
  period: string;
  region: string;
  generatedAt: string;
  source: "mock" | "google_sheets";
  note: string;
}

/* ------------------------------------------------------------------ */
/*  Region list (matches regions.yml)                                  */
/* ------------------------------------------------------------------ */

const REGIONS: { key: string; name: string }[] = [
  { key: "praha", name: "Praha" },
  { key: "stredocesky-kraj", name: "Středočeský kraj" },
  { key: "jihocesky-kraj", name: "Jihočeský kraj" },
  { key: "plzensky-kraj", name: "Plzeňský kraj" },
  { key: "karlovarsky-kraj", name: "Karlovarský kraj" },
  { key: "ustecky-kraj", name: "Ústecký kraj" },
  { key: "liberecky-kraj", name: "Liberecký kraj" },
  { key: "kralovehradecky-kraj", name: "Královéhradecký kraj" },
  { key: "pardubicky-kraj", name: "Pardubický kraj" },
  { key: "vysocina", name: "Vysočina" },
  { key: "jihomoravsky-kraj", name: "Jihomoravský kraj" },
  { key: "olomoucky-kraj", name: "Olomoucký kraj" },
  { key: "moravskoslezsky-kraj", name: "Moravskoslezský kraj" },
  { key: "zlinsky-kraj", name: "Zlínský kraj" },
];

/* ------------------------------------------------------------------ */
/*  Shared Chart Components                                            */
/* ------------------------------------------------------------------ */

function BarChart({
  items,
  labelKey,
  valueKey,
  color = "bg-blue-600",
}: {
  items: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  color?: string;
}) {
  const max = Math.max(...items.map((i) => Number(i[valueKey])), 1);
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={String(item[labelKey])} className="flex items-center gap-3">
          <span className="w-40 truncate text-right text-sm text-gray-600">
            {String(item[labelKey])}
          </span>
          <div className="h-6 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`${color} h-full rounded-full transition-all duration-500`}
              style={{ width: `${(Number(item[valueKey]) / max) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right text-sm font-medium">
            {item[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

function DayChart({ data }: { data: StatsData["leadsByDay"] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex h-40 items-end gap-[2px]">
      {data.map((d) => (
        <div
          key={d.date}
          className="group relative flex-1 rounded-t bg-blue-600 transition-colors hover:bg-blue-800"
          style={{ height: `${(d.count / max) * 100}%` }}
          title={`${d.date}: ${d.count} leads`}
        >
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100">
            {d.date}: {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form Funnel Component (VR-207)                                     */
/* ------------------------------------------------------------------ */

function FormFunnel({ password }: { password: string }) {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30d");
  const [region, setRegion] = useState("all");

  const fetchFunnel = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ period, region });
      const res = await fetch(`/api/admin/funnel?${params}`, {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `HTTP ${res.status}`);
        return;
      }
      setData(await res.json());
    } catch {
      setError("Nepodařilo se načíst data funnelu.");
    } finally {
      setLoading(false);
    }
  }, [password, period, region]);

  useEffect(() => {
    fetchFunnel();
  }, [fetchFunnel]);

  // Compute drop-off rates & find worst step
  const dropOffs =
    data?.steps.map((step, i) => {
      if (i === 0) return { ...step, dropOff: 0, isWorst: false };
      const prev = data.steps[i - 1].count;
      const dropOff = prev > 0 ? ((prev - step.count) / prev) * 100 : 0;
      return { ...step, dropOff, isWorst: false };
    }) ?? [];

  // Mark the step with the highest drop-off (skip step 0)
  if (dropOffs.length > 1) {
    let worstIdx = 1;
    for (let i = 2; i < dropOffs.length; i++) {
      if (dropOffs[i].dropOff > dropOffs[worstIdx].dropOff) {
        worstIdx = i;
      }
    }
    dropOffs[worstIdx].isWorst = true;
  }

  const maxCount = dropOffs.length > 0 ? dropOffs[0].count : 1;

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">🔻 Form Funnel</h2>

        <div className="flex flex-wrap gap-3">
          {/* Period filter */}
          <div className="flex overflow-hidden rounded-lg border border-gray-200">
            {(["7d", "30d", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p === "7d" ? "7 dní" : p === "30d" ? "30 dní" : "Vše"}
              </button>
            ))}
          </div>

          {/* Region filter */}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Všechny regiony</option>
            {REGIONS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="py-8 text-center text-gray-400">Načítání...</div>
      )}

      {data && data.source === "mock" && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          ⚠️ Zobrazena mock data. Pro reálná data nastavte{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">
            GOOGLE_SHEETS_ID
          </code>{" "}
          env proměnnou a připojte Google Sheets s partial submissions (VR-168).
        </div>
      )}

      {dropOffs.length > 0 && (
        <div className="space-y-4">
          {dropOffs.map((step, i) => {
            const widthPct = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
            const totalConversion =
              maxCount > 0 ? ((step.count / maxCount) * 100).toFixed(1) : "0";

            // Color logic: worst step = red/orange, others = blue
            const barColor = step.isWorst
              ? "bg-gradient-to-r from-red-500 to-orange-500"
              : "bg-blue-600";

            const dropOffColor = step.isWorst
              ? "text-red-600 font-bold"
              : "text-gray-500";

            return (
              <div key={step.step}>
                {/* Step label + counts */}
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-1">
                  <span className="text-sm font-medium text-gray-800">
                    {step.label}
                    {step.isWorst && (
                      <span className="ml-2 inline-block rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                        ⚠ Největší úbytek
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">
                      {step.count.toLocaleString("cs-CZ")}
                    </span>
                    {i > 0 && (
                      <>
                        {" "}
                        <span className={dropOffColor}>
                          (−{step.dropOff.toFixed(1)}%)
                        </span>
                        {" · "}
                        <span className="text-xs">
                          {totalConversion}% celkem
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {/* Bar */}
                <div className="h-9 overflow-hidden rounded-lg bg-gray-100">
                  <div
                    className={`${barColor} flex h-full items-center rounded-lg pr-3 transition-all duration-700 ease-out`}
                    style={{ width: `${Math.max(widthPct, 2)}%` }}
                  >
                    {widthPct > 12 && (
                      <span className="ml-auto text-xs font-medium text-white">
                        {totalConversion}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Drop-off arrow between steps */}
                {i < dropOffs.length - 1 && (
                  <div className="flex items-center justify-center py-1">
                    <span className="text-xs text-gray-400">▼</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Summary */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {dropOffs[0]?.count.toLocaleString("cs-CZ") ?? "—"}
                </div>
                <div className="text-xs text-gray-500">Zahájili formulář</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dropOffs[dropOffs.length - 1]?.count.toLocaleString(
                    "cs-CZ",
                  ) ?? "—"}
                </div>
                <div className="text-xs text-gray-500">Odeslali</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {maxCount > 0
                    ? (
                        (dropOffs[dropOffs.length - 1].count / maxCount) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </div>
                <div className="text-xs text-gray-500">Celková konverze</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {dropOffs.find((d) => d.isWorst)?.label.split(": ")[1] ?? "—"}
                </div>
                <div className="text-xs text-gray-500">
                  Nejslabší krok (−
                  {dropOffs.find((d) => d.isWorst)?.dropOff.toFixed(1) ?? "0"}
                  %)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {data && (
        <p className="mt-3 text-right text-xs text-gray-400">
          Vygenerováno: {new Date(data.generatedAt).toLocaleString("cs-CZ")}
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function AdminStatsPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) {
      setPassword(saved);
      fetchStats(saved);
    }
     
  }, []);

  const fetchStats = async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-password": pwd },
      });
      if (res.status === 503) {
        setError(
          "ADMIN_PASSWORD není nakonfigurováno na serveru. Nastavte env proměnnou ADMIN_PASSWORD.",
        );
        return;
      }
      if (res.status === 401) {
        sessionStorage.removeItem("admin_password");
        setError("Nesprávné heslo.");
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthenticated(true);
      sessionStorage.setItem("admin_password", pwd);
    } catch {
      setError("Nepodařilo se načíst data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(password);
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-center text-xl font-bold">
            Admin Dashboard
          </h1>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Načítání..." : "Přihlásit"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">📊 Analytics Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{data.note}</span>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_password");
                setAuthenticated(false);
                setData(null);
              }}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              Odhlásit
            </button>
          </div>
        </div>

        {/* Leads by Day */}
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Leady za posledních 30 dní
          </h2>
          <DayChart data={data.leadsByDay} />
          <p className="mt-2 text-right text-xs text-gray-400">
            Celkem:{" "}
            {data.leadsByDay
              .reduce((s, d) => s + d.count, 0)
              .toLocaleString("cs-CZ")}
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Leads by Region */}
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Leady podle regionu</h2>
            <BarChart
              items={data.leadsByRegion}
              labelKey="region"
              valueKey="count"
            />
          </section>

          {/* Leads by Source */}
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Leady podle zdroje</h2>
            <BarChart
              items={data.leadsBySource}
              labelKey="source"
              valueKey="count"
              color="bg-teal-500"
            />
          </section>
        </div>

        {/* ============================================================ */}
        {/* VR-207: Form Funnel Drop-off Visualization                    */}
        {/* ============================================================ */}
        <FormFunnel password={password} />

        <p className="text-center text-xs text-gray-400">
          Data vygenerována:{" "}
          {new Date(data.generatedAt).toLocaleString("cs-CZ")}
        </p>
      </div>
    </div>
  );
}
