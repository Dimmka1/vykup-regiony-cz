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
  };
  crm_status: string;
  notes: string;
  status_updated_at: string | null;
}

const STATUSES = ["new", "contacted", "won", "lost"] as const;
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

const PER_PAGE = 20;

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

  // filters
  const [filterRegion, setFilterRegion] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

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
          setError("Neplatné heslo");
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

  useEffect(() => {
    if (authed && storedPw) fetchLeads(storedPw);
  }, [authed, storedPw, fetchLeads]);

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
          <h1 className="mb-4 text-xl font-bold">Admin — Leads CRM</h1>
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
            Přihlásit
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
          <span className="mr-2 text-sm text-gray-500">Conversion rate:</span>
          <span className="font-bold text-green-700">{stats.convRate}%</span>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Region</label>
            <select
              value={filterRegion}
              onChange={(e) => {
                setFilterRegion(e.target.value);
                setPage(1);
              }}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="">Vše</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="">Vše</option>
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
          <p className="text-gray-500">Načítám...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg bg-white shadow">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3">Datum</th>
                    <th className="px-4 py-3">Jméno</th>
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
                            expandedId === lead.lead_id ? null : lead.lead_id,
                          )
                        }
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          {new Date(lead.timestamp).toLocaleDateString("cs")}
                        </td>
                        <td className="px-4 py-3">
                          {lead.data.name ?? lead.data.type ?? "—"}
                        </td>
                        <td className="px-4 py-3">{lead.data.phone}</td>
                        <td className="px-4 py-3">{lead.data.region}</td>
                        <td className="px-4 py-3">
                          {lead.data.property_type ?? lead.data.source ?? "—"}
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
                                <span className="text-gray-500">Email:</span>{" "}
                                {lead.data.email || "—"}
                              </div>
                              <div>
                                <span className="text-gray-500">Situace:</span>{" "}
                                {lead.data.situation_type || "—"}
                              </div>
                              <div>
                                <span className="text-gray-500">IP:</span>{" "}
                                {lead.ip}
                              </div>
                              <div>
                                <span className="text-gray-500">Čas:</span>{" "}
                                {new Date(lead.timestamp).toLocaleString("cs")}
                              </div>
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-gray-500">
                                Poznámky
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
                        Žádné leady
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
                  ←
                </button>
                <span className="text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
