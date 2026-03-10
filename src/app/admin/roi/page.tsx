"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CHANNELS,
  CHANNEL_LABELS,
  type Channel,
  type ChannelData,
  type RoiResponse,
} from "@/lib/roi-types";

function getMonthOptions(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7));
  }
  return months;
}

function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("cs-CZ") + " Kč";
}

function BarChart({ channels }: { channels: ChannelData[] }) {
  const withCpl = channels.filter((c) => c.cpl !== null && c.cpl > 0);
  if (withCpl.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Nedostatek dat pro graf CPL
      </div>
    );
  }

  const maxCpl = Math.max(...withCpl.map((c) => c.cpl ?? 0));

  const COLORS: Record<Channel, string> = {
    google_ads: "bg-blue-500",
    sklik: "bg-orange-500",
    organic: "bg-green-500",
    referral: "bg-purple-500",
    direct: "bg-gray-500",
    social: "bg-pink-500",
    other: "bg-yellow-500",
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">CPL by Channel</h3>
      <div className="space-y-2">
        {withCpl.map((c) => {
          const width = maxCpl > 0 ? ((c.cpl ?? 0) / maxCpl) * 100 : 0;
          return (
            <div key={c.channel} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-right text-sm font-medium text-gray-700">
                {CHANNEL_LABELS[c.channel]}
              </span>
              <div className="relative h-8 flex-1 rounded bg-gray-100">
                <div
                  className={`absolute left-0 top-0 h-full rounded ${COLORS[c.channel]} transition-all duration-500`}
                  style={{ width: `${Math.max(width, 2)}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">
                  {formatCurrency(c.cpl)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RoiDashboard() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<RoiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSpend, setEditingSpend] = useState<Record<Channel, string>>(
    {} as Record<Channel, string>,
  );
  const [saving, setSaving] = useState<Channel | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/roi?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setAuthenticated(false);
        setError("Neplatný token");
        return;
      }

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const roiData = (await res.json()) as RoiResponse;
      setData(roiData);
      setAuthenticated(true);

      // Initialize spend inputs
      const spendState: Record<string, string> = {};
      for (const ch of roiData.channels) {
        spendState[ch.channel] = ch.spend.toString();
      }
      setEditingSpend(spendState as Record<Channel, string>);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Chyba při načítání dat");
    } finally {
      setLoading(false);
    }
  }, [token, month]);

  useEffect(() => {
    if (authenticated) {
      void fetchData();
    }
  }, [month, authenticated, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchData();
  };

  const handleSpendSave = async (channel: Channel) => {
    const spend = parseFloat(editingSpend[channel] ?? "0");
    if (isNaN(spend) || spend < 0) return;

    setSaving(channel);
    try {
      const res = await fetch("/api/admin/roi", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ month, channel, spend }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Save failed");
      }

      // Refresh data
      await fetchData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Chyba při ukládání");
    } finally {
      setSaving(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 rounded-xl border bg-white p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-800">ROI Dashboard</h1>
          <p className="text-sm text-gray-500">Zadejte admin token</p>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin Secret"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Přihlásit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            📊 Multi-Channel ROI Dashboard
          </h1>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {getMonthOptions().map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="py-12 text-center text-gray-500">Načítám data…</div>
        )}

        {data && !loading && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-medium uppercase text-gray-500">
                  Total Spend
                </div>
                <div className="mt-1 text-xl font-bold text-gray-800">
                  {formatCurrency(data.totals.spend)}
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-medium uppercase text-gray-500">
                  Total Leads
                </div>
                <div className="mt-1 text-xl font-bold text-gray-800">
                  {data.totals.leads}
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-medium uppercase text-gray-500">
                  Total Deals
                </div>
                <div className="mt-1 text-xl font-bold text-gray-800">
                  {data.totals.deals}
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-medium uppercase text-gray-500">
                  Avg CPL
                </div>
                <div className="mt-1 text-xl font-bold text-blue-600">
                  {formatCurrency(data.totals.cpl)}
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-medium uppercase text-gray-500">
                  Avg CPA
                </div>
                <div className="mt-1 text-xl font-bold text-purple-600">
                  {formatCurrency(data.totals.cpa)}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Spend (Kč)</th>
                    <th className="px-4 py-3">Leads</th>
                    <th className="px-4 py-3">CPL</th>
                    <th className="px-4 py-3">Deals</th>
                    <th className="px-4 py-3">CPA</th>
                  </tr>
                </thead>
                <tbody>
                  {data.channels.map((ch) => (
                    <tr
                      key={ch.channel}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {CHANNEL_LABELS[ch.channel]}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={editingSpend[ch.channel] ?? "0"}
                            onChange={(e) =>
                              setEditingSpend((prev) => ({
                                ...prev,
                                [ch.channel]: e.target.value,
                              }))
                            }
                            className="w-28 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => void handleSpendSave(ch.channel)}
                            disabled={saving === ch.channel}
                            className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                          >
                            {saving === ch.channel ? "…" : "💾"}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{ch.leads}</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">
                        {formatCurrency(ch.cpl)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{ch.deals}</td>
                      <td className="px-4 py-3 font-semibold text-purple-600">
                        {formatCurrency(ch.cpa)}
                      </td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="border-t-2 bg-gray-50 font-bold">
                    <td className="px-4 py-3 text-gray-800">Total</td>
                    <td className="px-4 py-3 text-gray-800">
                      {formatCurrency(data.totals.spend)}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {data.totals.leads}
                    </td>
                    <td className="px-4 py-3 text-blue-600">
                      {formatCurrency(data.totals.cpl)}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {data.totals.deals}
                    </td>
                    <td className="px-4 py-3 text-purple-600">
                      {formatCurrency(data.totals.cpa)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bar Chart */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <BarChart channels={data.channels} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
