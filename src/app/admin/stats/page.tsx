"use client";

import { useState, useEffect, useCallback } from "react";

interface StatsData {
  leadsByDay: { date: string; count: number }[];
  leadsByRegion: { region: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  funnel: {
    step1_view: number;
    step2_property_type: number;
    step3_contact_info: number;
    step4_submit: number;
  };
  generatedAt: string;
  note: string;
}

function BarChart({
  items,
  labelKey,
  valueKey,
  color = "bg-brand-500",
}: {
  items: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  color?: string;
}) {
  const max = Math.max(...items.map((i) => Number(i[valueKey])));
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={String(item[labelKey])} className="flex items-center gap-3">
          <span className="w-44 truncate text-right text-sm text-gray-600">
            {String(item[labelKey])}
          </span>
          <div className="h-6 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`${color} h-full rounded-full transition-all duration-500`}
              style={{
                width: `${(Number(item[valueKey]) / max) * 100}%`,
              }}
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

function FunnelChart({ funnel }: { funnel: StatsData["funnel"] }) {
  const steps = [
    { label: "Zobrazení stránky", value: funnel.step1_view },
    { label: "Typ nemovitosti", value: funnel.step2_property_type },
    { label: "Kontaktní údaje", value: funnel.step3_contact_info },
    { label: "Odeslání", value: funnel.step4_submit },
  ];
  const max = steps[0].value;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const rate =
          i > 0 ? ((step.value / steps[i - 1].value) * 100).toFixed(1) : "100";
        const totalRate = ((step.value / max) * 100).toFixed(1);
        return (
          <div key={step.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{step.label}</span>
              <span className="text-gray-500">
                {step.value.toLocaleString("cs-CZ")}{" "}
                {i > 0 && (
                  <span className="text-xs">
                    ({rate}% z předchozího · {totalRate}% celkem)
                  </span>
                )}
              </span>
            </div>
            <div className="h-8 overflow-hidden rounded-full bg-gray-100">
              <div
                className="flex h-full items-center justify-end rounded-full bg-brand-500 pr-2 transition-all duration-700"
                style={{ width: `${(step.value / max) * 100}%` }}
              >
                {(step.value / max) * 100 > 15 && (
                  <span className="text-xs font-medium text-white">
                    {totalRate}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayChart({ data }: { data: StatsData["leadsByDay"] }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex h-40 items-end gap-[2px]">
      {data.map((d) => (
        <div
          key={d.date}
          className="group relative flex-1 rounded-t bg-brand-500 transition-colors hover:bg-brand-700"
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

  const fetchStats = useCallback(async (pwd: string) => {
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
  }, []);

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
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-lg bg-brand-500 px-4 py-2 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
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

        {/* Funnel */}
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Konverzní trychtýř formuláře
          </h2>
          <FunnelChart funnel={data.funnel} />
        </section>

        <p className="text-center text-xs text-gray-400">
          Data vygenerována:{" "}
          {new Date(data.generatedAt).toLocaleString("cs-CZ")}
        </p>
      </div>
    </div>
  );
}
