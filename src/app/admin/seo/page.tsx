"use client";

import { useState, useEffect, type FormEvent } from "react";
import type { SerpHistory, KeywordData } from "@/lib/serp-keywords";

export default function SeoAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SerpHistory | null>(null);
  const [loading, setLoading] = useState(false);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin2024";
    if (password === adminPw) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Nesprávné heslo");
    }
  }

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch("/api/admin/serp-history")
      .then((r) => r.json())
      .then((data: SerpHistory) => setHistory(data))
      .catch(() => setHistory({ snapshots: [] }))
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
        >
          <h1 className="mb-4 text-xl font-bold">SEO Dashboard</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo"
            className="mb-3 w-full rounded border px-3 py-2"
          />
          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Přihlásit
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Načítání...</p>
      </div>
    );
  }

  const snapshots = history?.snapshots ?? [];
  const latest = snapshots[snapshots.length - 1];
  const previous =
    snapshots.length >= 2 ? snapshots[snapshots.length - 2] : null;

  const prevMap = new Map<string, KeywordData>(
    previous?.keywords.map((k) => [k.keyword, k]) ?? [],
  );

  const totalImpressions =
    latest?.keywords.reduce((s, k) => s + k.impressions, 0) ?? 0;
  const totalClicks = latest?.keywords.reduce((s, k) => s + k.clicks, 0) ?? 0;
  const avgPosition = latest
    ? Math.round(
        (latest.keywords.reduce((s, k) => s + k.position, 0) /
          latest.keywords.length) *
          10,
      ) / 10
    : 0;

  function trend(current: number, prev: number | undefined): string {
    if (prev === undefined || prev === 0) return "→";
    if (current < prev) return "↑";
    if (current > prev) return "↓";
    return "→";
  }

  function trendColor(current: number, prev: number | undefined): string {
    if (prev === undefined || prev === 0) return "text-gray-500";
    if (current < prev) return "text-green-600";
    if (current > prev) return "text-red-600";
    return "text-gray-500";
  }

  const chartSnapshots = snapshots.slice(-12);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">📊 SEO SERP Dashboard</h1>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Celkem zobrazení</p>
            <p className="text-2xl font-bold">
              {totalImpressions.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Celkem kliků</p>
            <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Průměrná pozice</p>
            <p className="text-2xl font-bold">{avgPosition}</p>
          </div>
        </div>

        {latest && (
          <p className="mb-4 text-sm text-gray-500">
            Poslední data: {latest.date}
          </p>
        )}

        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Klíčové slovo</th>
                <th className="p-3 text-right">Pozice</th>
                <th className="p-3 text-center">Trend</th>
                <th className="p-3 text-right">Zobrazení</th>
                <th className="p-3 text-right">Kliky</th>
              </tr>
            </thead>
            <tbody>
              {(latest?.keywords ?? []).map((kw) => {
                const prev = prevMap.get(kw.keyword);
                return (
                  <tr key={kw.keyword} className="border-t">
                    <td className="p-3 font-medium">{kw.keyword}</td>
                    <td className="p-3 text-right">
                      {kw.position > 0 ? kw.position : "—"}
                    </td>
                    <td
                      className={`p-3 text-center text-lg font-bold ${trendColor(kw.position, prev?.position)}`}
                    >
                      {trend(kw.position, prev?.position)}
                    </td>
                    <td className="p-3 text-right">{kw.impressions}</td>
                    <td className="p-3 text-right">{kw.clicks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {chartSnapshots.length > 1 && (
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-bold">
              Trend pozic (posledních {chartSnapshots.length} týdnů)
            </h2>
            <div className="space-y-3">
              {(latest?.keywords ?? []).map((kw) => {
                const positions = chartSnapshots.map((s) => {
                  const found = s.keywords.find(
                    (k) => k.keyword === kw.keyword,
                  );
                  return found?.position ?? 0;
                });
                const maxPos = Math.max(...positions.filter((p) => p > 0), 50);
                return (
                  <div key={kw.keyword}>
                    <p className="mb-1 text-xs text-gray-600">{kw.keyword}</p>
                    <div className="flex h-8 items-end gap-1">
                      {positions.map((pos, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height:
                              pos > 0
                                ? `${Math.max(((maxPos - pos + 1) / maxPos) * 100, 5)}%`
                                : "2px",
                            backgroundColor:
                              pos === 0
                                ? "#e5e7eb"
                                : pos <= 3
                                  ? "#22c55e"
                                  : pos <= 10
                                    ? "#3b82f6"
                                    : pos <= 20
                                      ? "#f59e0b"
                                      : "#ef4444",
                          }}
                          title={`${chartSnapshots[i].date}: ${pos > 0 ? pos : "N/A"}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-green-500" /> Top 3
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-blue-500" /> Top 10
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-amber-500" /> Top 20
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-red-500" /> 20+
              </span>
            </div>
          </div>
        )}

        {snapshots.length === 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm">
            <p>
              Zatím žádná data. Cron job <code>/api/cron/serp-check</code> běží
              každé pondělí v 7:00 UTC.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
