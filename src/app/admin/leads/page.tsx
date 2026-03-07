"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/* ---------- types ---------- */
interface Lead {
  lead_id: string;
  timestamp: string;
  ip: string;
  data: {
    type?: string;
    name?: string;
    phone: string;
    email?: string;
    property_type?: string;
    region: string;
    situation_type?: string;
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    gclid?: string;
  };
  crm_status: string;
  notes: string;
  status_updated_at: string | null;
}

interface AttributionData {
  total: number;
  bySource: Record<string, number>;
  byCampaign: Record<string, number>;
  regionSourceMatrix: Record<string, Record<string, number>>;
  avgScoreBySource: Record<string, number>;
  allSources: string[];
  allRegions: string[];
}

const STATUSES = ["new", "contacted", "won", "lost"] as const;
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

const SOURCE_COLORS: Record<string, string> = {
  google_ads: "#4285F4",
  google: "#34A853",
  seznam: "#CC0000",
  facebook: "#1877F2",
  direct: "#6B7280",
  callback: "#F59E0B",
  "quick-estimate": "#8B5CF6",
  ppc: "#EF4444",
  organic: "#10B981",
};

const PER_PAGE = 20;

type DatePreset = "7d" | "30d" | "custom";

/* ---------- Bar Chart (CSS-only) ---------- */
function BarChart({
  data,
  title,
  colorMap,
}: {
  data: Record<string, number>;
  title: string;
  colorMap?: Record<string, string>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-400">Zatim zadna data</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
      <div className="space-y-3">
        {entries.map(([key, value]) => {
          const pct = Math.round((value / max) * 100);
          const color = colorMap?.[key] ?? "#6366F1";
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">{key}</span>
                <span className="font-bold text-gray-900">{value}</span>
              </div>
              <div className="h-6 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="flex h-full items-center rounded-full px-2 text-xs font-semibold text-white transition-all duration-500"
                  style={{
                    width: `${Math.max(pct, 8)}%`,
                    backgroundColor: color,
                  }}
                >
                  {pct}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Score badges ---------- */
function ScoreBadge({ score }: { score: number }) {
  let color = "bg-gray-100 text-gray-700";
  if (score >= 60) color = "bg-green-100 text-green-800";
  else if (score >= 30) color = "bg-yellow-100 text-yellow-800";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${color}`}
    >
      {score}
    </span>
  );
}

/* ---------- component ---------- */
export default function AdminLeadsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [storedPw, setStoredPw] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"crm" | "attribution">("crm");

  // filters
  const [filterRegion, setFilterRegion] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // attribution state
  const [attribution, setAttribution] = useState<AttributionData | null>(null);
  const [attrLoading, setAttrLoading] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // check session
  useEffect(() => {
    const pw = sessionStorage.getItem("admin_password");
    if (pw) {
      setStoredPw(pw);
      setAuthed(true);
    }
  }, []);

  const fetchLeads = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setAuthed(false);
          sessionStorage.removeItem("admin_password");
          setError("Neplatne heslo");
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as { leads: Lead[] };
      setLeads(json.leads);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttribution = useCallback(
    async (pw: string) => {
      setAttrLoading(true);
      try {
        const params = new URLSearchParams();
        if (datePreset === "7d") params.set("days", "7");
        else if (datePreset === "30d") params.set("days", "30");
        else if (datePreset === "custom") {
          if (customFrom) params.set("from", customFrom);
          if (customTo) params.set("to", customTo);
        }

        const res = await fetch(
          `/api/admin/leads/attribution?${params.toString()}`,
          { headers: { "x-admin-password": pw } },
        );
        if (res.ok) {
          const json = (await res.json()) as AttributionData;
          setAttribution(json);
        }
      } catch {
        /* silent */
      } finally {
        setAttrLoading(false);
      }
    },
    [datePreset, customFrom, customTo],
  );

  useEffect(() => {
    if (authed && storedPw) fetchLeads(storedPw);
  }, [authed, storedPw, fetchLeads]);

  useEffect(() => {
    if (authed && storedPw && activeTab === "attribution") {
      fetchAttribution(storedPw);
    }
  }, [authed, storedPw, activeTab, fetchAttribution]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_password", password);
    setStoredPw(password);
    setAuthed(true);
  };

  const updateLead = async (
    leadId: string,
    update: { status?: string; notes?: string },
  ) => {
    await fetch("/api/admin/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": storedPw,
      },
      body: JSON.stringify({ lead_id: leadId, ...update }),
    });
    setLeads((prev) =>
      prev.map((l) =>
        l.lead_id === leadId
          ? {
              ...l,
              crm_status: update.status ?? l.crm_status,
              notes: update.notes ?? l.notes,
            }
          : l,
      ),
    );
  };

  /* ---------- filtered leads ---------- */
  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filterRegion && l.data.region !== filterRegion) return false;
      if (filterStatus && l.crm_status !== filterStatus) return false;
      if (filterDateFrom) {
        const d = new Date(l.timestamp);
        if (d < new Date(filterDateFrom)) return false;
      }
      if (filterDateTo) {
        const d = new Date(l.timestamp);
        if (d > new Date(filterDateTo + "T23:59:59")) return false;
      }
      return true;
    });
  }, [leads, filterRegion, filterStatus, filterDateFrom, filterDateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const regions = useMemo(
    () => [...new Set(leads.map((l) => l.data.region))].sort(),
    [leads],
  );

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    const total = filtered.length;
    const byStatus: Record<string, number> = {};
    for (const s of STATUSES) byStatus[s] = 0;
    for (const l of filtered)
      byStatus[l.crm_status] = (byStatus[l.crm_status] ?? 0) + 1;
    const convRate =
      total > 0 ? ((byStatus.won / total) * 100).toFixed(1) : "0";
    return { total, byStatus, convRate };
  }, [filtered]);

  /* ---------- login screen ---------- */
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
        >
          <h1 className="mb-4 text-xl font-bold">Admin - Leads CRM</h1>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded border px-3 py-2"
            autoFocus
          />
          <button
            type="submit"
            className="w-full rounded bg-brand-500 py-2 text-white transition hover:bg-brand-700"
          >
            Prihlasit
          </button>
        </form>
      </div>
    );
  }

  /* ---------- dashboard ---------- */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">Lead CRM Dashboard</h1>

        {/* Tab navigation */}
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-200 p-1">
          <button
            onClick={() => setActiveTab("crm")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "crm"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            CRM
          </button>
          <button
            onClick={() => setActiveTab("attribution")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "attribution"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Attribution Report
          </button>
        </div>

        {activeTab === "crm" && (
          <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
              <div className="rounded-lg bg-white p-4 shadow">
                <div className="text-sm text-gray-500">Celkem</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
              {STATUSES.map((s) => (
                <div key={s} className="rounded-lg bg-white p-4 shadow">
                  <div className="text-sm capitalize text-gray-500">{s}</div>
                  <div className="text-2xl font-bold">{stats.byStatus[s]}</div>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-lg bg-white p-4 shadow">
              <span className="mr-2 text-sm text-gray-500">
                Conversion rate:
              </span>
              <span className="font-bold text-green-700">
                {stats.convRate}%
              </span>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow">
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Region
                </label>
                <select
                  value={filterRegion}
                  onChange={(e) => {
                    setFilterRegion(e.target.value);
                    setPage(1);
                  }}
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="">Vse</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPage(1);
                  }}
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="">Vse</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Od</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => {
                    setFilterDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="rounded border px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Do</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => {
                    setFilterDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="rounded border px-2 py-1 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setFilterRegion("");
                  setFilterStatus("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setPage(1);
                }}
                className="text-sm text-brand-500 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <p className="text-gray-500">Nacitam...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg bg-white shadow">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-4 py-3">Datum</th>
                        <th className="px-4 py-3">Jmeno</th>
                        <th className="px-4 py-3">Telefon</th>
                        <th className="px-4 py-3">Region</th>
                        <th className="px-4 py-3">Typ</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((lead) => (
                        <>
                          <tr
                            key={lead.lead_id}
                            className="cursor-pointer border-b hover:bg-gray-50"
                            onClick={() =>
                              setExpandedId(
                                expandedId === lead.lead_id
                                  ? null
                                  : lead.lead_id,
                              )
                            }
                          >
                            <td className="whitespace-nowrap px-4 py-3">
                              {new Date(lead.timestamp).toLocaleDateString(
                                "cs",
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {lead.data.name ?? lead.data.type ?? "-"}
                            </td>
                            <td className="px-4 py-3">{lead.data.phone}</td>
                            <td className="px-4 py-3">{lead.data.region}</td>
                            <td className="px-4 py-3">
                              {lead.data.property_type ??
                                lead.data.source ??
                                "-"}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={lead.crm_status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  updateLead(lead.lead_id, {
                                    status: e.target.value,
                                  })
                                }
                                className={`rounded px-2 py-1 text-xs font-medium ${STATUS_COLORS[lead.crm_status] ?? ""}`}
                              >
                                {STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">
                              {lead.lead_id}
                            </td>
                          </tr>
                          {expandedId === lead.lead_id && (
                            <tr
                              key={`${lead.lead_id}-detail`}
                              className="bg-gray-50"
                            >
                              <td colSpan={7} className="px-4 py-4">
                                <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                  <div>
                                    <span className="text-gray-500">
                                      Email:
                                    </span>{" "}
                                    {lead.data.email || "-"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Situace:
                                    </span>{" "}
                                    {lead.data.situation_type || "-"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">IP:</span>{" "}
                                    {lead.ip}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Cas:</span>{" "}
                                    {new Date(lead.timestamp).toLocaleString(
                                      "cs",
                                    )}
                                  </div>
                                </div>
                                {/* UTM Attribution */}
                                {(lead.data.utm_source ||
                                  lead.data.utm_campaign ||
                                  lead.data.gclid) && (
                                  <div className="mb-4 rounded-md bg-indigo-50 p-3">
                                    <div className="mb-1 text-xs font-semibold text-indigo-700">
                                      Attribution
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
                                      {lead.data.utm_source && (
                                        <div>
                                          <span className="text-gray-500">
                                            Source:
                                          </span>{" "}
                                          {lead.data.utm_source}
                                        </div>
                                      )}
                                      {lead.data.utm_medium && (
                                        <div>
                                          <span className="text-gray-500">
                                            Medium:
                                          </span>{" "}
                                          {lead.data.utm_medium}
                                        </div>
                                      )}
                                      {lead.data.utm_campaign && (
                                        <div>
                                          <span className="text-gray-500">
                                            Campaign:
                                          </span>{" "}
                                          {lead.data.utm_campaign}
                                        </div>
                                      )}
                                      {lead.data.utm_content && (
                                        <div>
                                          <span className="text-gray-500">
                                            Content:
                                          </span>{" "}
                                          {lead.data.utm_content}
                                        </div>
                                      )}
                                      {lead.data.gclid && (
                                        <div>
                                          <span className="text-gray-500">
                                            GCLID:
                                          </span>{" "}
                                          {lead.data.gclid.slice(0, 12)}...
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <label className="mb-1 block text-xs text-gray-500">
                                    Poznamky
                                  </label>
                                  <textarea
                                    defaultValue={lead.notes}
                                    onBlur={(e) =>
                                      updateLead(lead.lead_id, {
                                        notes: e.target.value,
                                      })
                                    }
                                    rows={3}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                      {paginated.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Zadne leady
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                    >
                      &larr;
                    </button>
                    <span className="text-sm text-gray-600">
                      {page} / {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "attribution" && (
          <div className="space-y-6">
            {/* Date range filter */}
            <div className="flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow">
              <div className="flex gap-2">
                {(
                  [
                    ["7d", "7 dni"],
                    ["30d", "30 dni"],
                    ["custom", "Vlastni"],
                  ] as [DatePreset, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setDatePreset(key)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      datePreset === key
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {datePreset === "custom" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Od
                    </label>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="rounded border px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Do
                    </label>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="rounded border px-2 py-1 text-sm"
                    />
                  </div>
                </>
              )}
              <div className="text-sm text-gray-500">
                {attrLoading
                  ? "Nacitam..."
                  : attribution
                    ? `${attribution.total} leadu`
                    : ""}
              </div>
            </div>

            {attribution && (
              <>
                {/* Bar charts row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <BarChart
                    data={attribution.bySource}
                    title="Leady dle zdroje (utm_source)"
                    colorMap={SOURCE_COLORS}
                  />
                  <BarChart
                    data={attribution.byCampaign}
                    title="Leady dle kampane (utm_campaign)"
                    colorMap={{}}
                  />
                </div>

                {/* Average lead score by source */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-4 text-sm font-semibold text-gray-700">
                    Prumerny lead score dle zdroje
                  </h3>
                  {Object.keys(attribution.avgScoreBySource).length === 0 ? (
                    <p className="text-sm text-gray-400">Zatim zadna data</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                      {Object.entries(attribution.avgScoreBySource)
                        .sort((a, b) => b[1] - a[1])
                        .map(([source, score]) => (
                          <div
                            key={source}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {source}
                            </span>
                            <ScoreBadge score={score} />
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Region x Source matrix */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-4 text-sm font-semibold text-gray-700">
                    Region x Zdroj matice
                  </h3>
                  {attribution.allRegions.length === 0 ? (
                    <p className="text-sm text-gray-400">Zatim zadna data</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="px-3 py-2 text-left font-medium text-gray-600">
                              Region
                            </th>
                            {attribution.allSources.map((src) => (
                              <th
                                key={src}
                                className="px-3 py-2 text-center font-medium text-gray-600"
                              >
                                {src}
                              </th>
                            ))}
                            <th className="px-3 py-2 text-center font-bold text-gray-700">
                              Celkem
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {attribution.allRegions.map((region) => {
                            const row =
                              attribution.regionSourceMatrix[region] ?? {};
                            const rowTotal = Object.values(row).reduce(
                              (a, b) => a + b,
                              0,
                            );
                            return (
                              <tr key={region} className="border-b">
                                <td className="px-3 py-2 font-medium text-gray-800">
                                  {region}
                                </td>
                                {attribution.allSources.map((src) => {
                                  const val = row[src] ?? 0;
                                  return (
                                    <td
                                      key={src}
                                      className={`px-3 py-2 text-center ${val > 0 ? "font-semibold text-gray-900" : "text-gray-300"}`}
                                    >
                                      {val || "-"}
                                    </td>
                                  );
                                })}
                                <td className="px-3 py-2 text-center font-bold text-gray-900">
                                  {rowTotal}
                                </td>
                              </tr>
                            );
                          })}
                          {/* Totals row */}
                          <tr className="border-t-2 bg-gray-50 font-bold">
                            <td className="px-3 py-2 text-gray-700">Celkem</td>
                            {attribution.allSources.map((src) => (
                              <td
                                key={src}
                                className="px-3 py-2 text-center text-gray-900"
                              >
                                {attribution.bySource[src] ?? 0}
                              </td>
                            ))}
                            <td className="px-3 py-2 text-center text-indigo-700">
                              {attribution.total}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
