"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { getStoredFieldEvents } from "@/hooks/use-field-tracking";

interface AggRow {
  field_name: string;
  form_name: string;
  focus_count: number;
  blur_count: number;
  error_count: number;
  avg_time_ms: number;
  abandon_count: number;
}

type SortKey = keyof AggRow;

interface RawEvent {
  event: string;
  field_name: string;
  form_name: string;
  time_spent_ms?: number;
}

function aggregate(events: RawEvent[]): AggRow[] {
  const map = new Map<
    string,
    { focuses: number; blurs: number; errors: number; totalTime: number }
  >();

  for (const e of events) {
    const key = `${e.form_name}::${e.field_name}`;
    let row = map.get(key);
    if (!row) {
      row = { focuses: 0, blurs: 0, errors: 0, totalTime: 0 };
      map.set(key, row);
    }
    if (e.event === "form_field_focus") row.focuses++;
    if (e.event === "form_field_blur") {
      row.blurs++;
      row.totalTime += e.time_spent_ms ?? 0;
    }
    if (e.event === "form_field_error") row.errors++;
  }

  const rows: AggRow[] = [];
  for (const [key, v] of map) {
    const [form_name, field_name] = key.split("::");
    rows.push({
      field_name: field_name ?? "",
      form_name: form_name ?? "",
      focus_count: v.focuses,
      blur_count: v.blurs,
      error_count: v.errors,
      avg_time_ms: v.blurs > 0 ? Math.round(v.totalTime / v.blurs) : 0,
      abandon_count: Math.max(0, v.focuses - v.blurs),
    });
  }

  return rows;
}

export default function AdminStatsPage(): ReactElement {
  const [tab, setTab] = useState<"fields">("fields");
  const [rows, setRows] = useState<AggRow[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("abandon_count");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    setRows(aggregate(getStoredFieldEvents()));
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [rows, sortKey, sortAsc]);

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const handleClear = (): void => {
    try {
      localStorage.removeItem("vr245_field_events");
    } catch {
      /* noop */
    }
    setRows([]);
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "form_name", label: "Form" },
    { key: "field_name", label: "Field" },
    { key: "focus_count", label: "Focuses" },
    { key: "blur_count", label: "Blurs" },
    { key: "avg_time_ms", label: "Avg Time (ms)" },
    { key: "error_count", label: "Errors" },
    { key: "abandon_count", label: "Abandons" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Admin &mdash; Stats
      </h1>

      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-semibold transition ${
            tab === "fields"
              ? "border-b-2 border-[var(--theme-600)] text-[var(--theme-700)]"
              : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setTab("fields")}
        >
          Form Fields
        </button>
      </div>

      {tab === "fields" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {rows.length} field{rows.length !== 1 ? "s" : ""} tracked
              (client-side localStorage)
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              Clear data
            </button>
          </div>

          {rows.length === 0 ? (
            <p className="py-12 text-center text-slate-500">
              No field events collected yet. Interact with forms to generate
              data.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700 hover:text-slate-900"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        {sortKey === col.key ? (sortAsc ? " ↑" : " ↓") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((row, i) => (
                    <tr
                      key={`${row.form_name}-${row.field_name}-${i}`}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-800">
                        {row.form_name}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {row.field_name}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">
                        {row.focus_count}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">
                        {row.blur_count}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">
                        {row.avg_time_ms.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-2.5 ${row.error_count > 0 ? "font-semibold text-red-600" : "text-slate-600"}`}
                      >
                        {row.error_count}
                      </td>
                      <td
                        className={`px-4 py-2.5 ${row.abandon_count > 0 ? "font-semibold text-amber-600" : "text-slate-600"}`}
                      >
                        {row.abandon_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
