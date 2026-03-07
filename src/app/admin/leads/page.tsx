"use client";

import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

/* ── Types ─────────────────────────────────────────────────── */

interface LeadRow {
  lead_id: string;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  property_type: string;
  region: string;
  situation_type: string;
  gclid: string;
  lead_score: string;
  lead_tier: string;
  conversion_status: string;
  conversion_value: string;
  conversion_time: string;
}

type ActiveTab = "leads" | "conversions";

/* ── Admin Leads Page ──────────────────────────────────────── */

export default function AdminLeadsPage(): ReactElement {
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("leads");

  // Conversion form state
  const [convLeadId, setConvLeadId] = useState("");
  const [convValue, setConvValue] = useState("");
  const [convTime, setConvTime] = useState("");
  const [convStatus, setConvStatus] = useState<string>("");

  const fetchLeads = useCallback(async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { leads: LeadRow[] };
      setLeads(data.leads ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (token.trim()) {
        setIsAuthenticated(true);
        fetchLeads(token.trim());
      }
    },
    [token, fetchLeads],
  );

  const handleMarkConverted = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setConvStatus("");

      if (!convLeadId || !convValue || !convTime) {
        setConvStatus("Vyplňte všechna pole");
        return;
      }

      try {
        const res = await fetch("/api/admin/conversions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lead_id: convLeadId,
            conversion_value: Number(convValue),
            conversion_time: convTime,
          }),
        });

        const data = (await res.json()) as {
          ok: boolean;
          error?: string;
          message?: string;
        };

        if (data.ok) {
          setConvStatus(`✅ ${data.message}`);
          setConvLeadId("");
          setConvValue("");
          setConvTime("");
          fetchLeads(token);
        } else {
          setConvStatus(`❌ ${data.error ?? "Unknown error"}`);
        }
      } catch (err: unknown) {
        setConvStatus(
          `❌ ${err instanceof Error ? err.message : "Request failed"}`,
        );
      }
    },
    [convLeadId, convValue, convTime, token, fetchLeads],
  );

  const handleExportCSV = useCallback(() => {
    window.open(
      `/api/admin/conversions/export?token=${encodeURIComponent(token)}`,
      "_blank",
    );
  }, [token]);

  // Auto-fill current datetime for conversion
  useEffect(() => {
    if (!convTime) {
      setConvTime(new Date().toISOString().slice(0, 16));
    }
  }, [convTime]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-lg"
        >
          <h1 className="text-xl font-bold text-slate-900">Admin přístup</h1>
          <div>
            <label
              htmlFor="admin-token"
              className="text-sm font-medium text-slate-700"
            >
              API Token
            </label>
            <input
              id="admin-token"
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Zadejte ADMIN_API_SECRET"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Přihlásit
          </button>
        </form>
      </div>
    );
  }

  const convertedCount = leads.filter(
    (l) => l.conversion_status === "converted",
  ).length;
  const withGclid = leads.filter((l) => l.gclid?.trim()).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Lead Management
            </h1>
            <p className="text-sm text-slate-600">
              {leads.length} leadů · {withGclid} s GCLID · {convertedCount}{" "}
              konvertovaných
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            📥 Export GCLID CSV
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-slate-200 p-1">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "leads"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Leady ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("conversions")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "conversions"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Konverze ({convertedCount})
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Conversions Tab */}
        {activeTab === "conversions" && (
          <div className="space-y-6">
            {/* Mark as Converted form */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Označit lead jako konvertovaný
              </h2>
              <form
                onSubmit={handleMarkConverted}
                className="grid gap-4 sm:grid-cols-4"
              >
                <div>
                  <label
                    htmlFor="conv-lead-id"
                    className="text-xs font-medium text-slate-600"
                  >
                    Lead ID
                  </label>
                  <input
                    id="conv-lead-id"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={convLeadId}
                    onChange={(e) => setConvLeadId(e.target.value)}
                    placeholder="lead_abc123"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="conv-value"
                    className="text-xs font-medium text-slate-600"
                  >
                    Hodnota (CZK)
                  </label>
                  <input
                    id="conv-value"
                    type="number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={convValue}
                    onChange={(e) => setConvValue(e.target.value)}
                    placeholder="50000"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="conv-time"
                    className="text-xs font-medium text-slate-600"
                  >
                    Čas konverze
                  </label>
                  <input
                    id="conv-time"
                    type="datetime-local"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={convTime}
                    onChange={(e) => setConvTime(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Označit
                  </button>
                </div>
              </form>
              {convStatus && (
                <p className="mt-3 text-sm text-slate-700">{convStatus}</p>
              )}
            </div>

            {/* Export section */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Google Ads Offline Conversion Import
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                Exportuje CSV ve formátu Google Ads: Google Click ID, Conversion
                Name, Conversion Time, Conversion Value, Conversion Currency.
                Pouze leady s GCLID a statusem &quot;converted&quot;.
              </p>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                📥 Export GCLID CSV
              </button>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Načítám...</div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Žádné leady. Zkontrolujte Google Sheets konfiguraci.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Datum</th>
                    <th className="px-4 py-3">Jméno</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">Region</th>
                    <th className="px-4 py-3">Typ</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">GCLID</th>
                    <th className="px-4 py-3">Konverze</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead) => (
                    <tr key={lead.lead_id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs">
                        {lead.lead_id}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {lead.timestamp
                          ? new Date(lead.timestamp).toLocaleString("cs-CZ")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 font-medium">{lead.name}</td>
                      <td className="px-4 py-3">{lead.phone}</td>
                      <td className="px-4 py-3">{lead.region}</td>
                      <td className="px-4 py-3">{lead.property_type}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            lead.lead_tier === "hot"
                              ? "bg-red-100 text-red-700"
                              : lead.lead_tier === "warm"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lead.lead_score} {lead.lead_tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {lead.gclid?.trim() ? (
                          <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                            ✓ GCLID
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {lead.conversion_status === "converted" ? (
                          <span className="inline-block rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                            ✅ {lead.conversion_value} CZK
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveTab("conversions");
                              setConvLeadId(lead.lead_id);
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Označit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
