"use client";

import { useEffect, useState, useCallback } from "react";

interface AnalyticsRow {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface AnalyticsData {
  rows: AnalyticsRow[];
  totals: {
    clicks: number;
    impressions: number;
    avgPosition: number;
  };
}

interface CoverageData {
  submitted: number;
  indexed: number;
  sitemaps: Array<{
    path: string;
    submitted: number;
    indexed: number;
    lastSubmitted: string;
  }>;
}

export default function SeoAdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [coverage, setCoverage] = useState<CoverageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);

    try {
      const headers = { "x-api-key": apiKey };

      const [analyticsRes, coverageRes] = await Promise.all([
        fetch("/api/admin/gsc?type=analytics", { headers }),
        fetch("/api/admin/gsc?type=coverage", { headers }),
      ]);

      if (!analyticsRes.ok || !coverageRes.ok) {
        throw new Error(
          `API error: analytics=${analyticsRes.status}, coverage=${coverageRes.status}`,
        );
      }

      const [analyticsData, coverageData] = await Promise.all([
        analyticsRes.json() as Promise<AnalyticsData>,
        coverageRes.json() as Promise<CoverageData>,
      ]);

      setAnalytics(analyticsData);
      setCoverage(coverageData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const stored = localStorage.getItem("admin_api_key");
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("admin_api_key", apiKey);
      fetchData();
    }
  }, [apiKey, fetchData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          SEO Dashboard — Google Search Console
        </h1>

        {/* API Key Input */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <label
            htmlFor="apiKey"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Admin API Key
          </label>
          <div className="flex gap-2">
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your ADMIN_API_KEY"
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={fetchData}
              disabled={loading || !apiKey}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Indexing Status Card */}
        {coverage && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              📊 Indexing Status
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {coverage.submitted}
                </div>
                <div className="text-sm text-blue-600">Submitted</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {coverage.indexed}
                </div>
                <div className="text-sm text-green-600">Indexed</div>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 text-center">
                <div className="text-3xl font-bold text-amber-700">
                  {coverage.submitted > 0
                    ? Math.round((coverage.indexed / coverage.submitted) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-amber-600">Coverage Rate</div>
              </div>
            </div>

            {/* Sitemaps */}
            {coverage.sitemaps.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-gray-600">
                  Sitemaps
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-3 py-2">Path</th>
                        <th className="px-3 py-2 text-right">Submitted</th>
                        <th className="px-3 py-2 text-right">Indexed</th>
                        <th className="px-3 py-2 text-right">Last Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coverage.sitemaps.map((s) => (
                        <tr key={s.path} className="border-t">
                          <td className="px-3 py-2 font-mono text-xs">
                            {s.path}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {s.submitted}
                          </td>
                          <td className="px-3 py-2 text-right">{s.indexed}</td>
                          <td className="px-3 py-2 text-right text-xs text-gray-500">
                            {s.lastSubmitted
                              ? new Date(s.lastSubmitted).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Queries Table */}
        {analytics && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              🔍 Top Queries (Last 30 days)
            </h2>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-purple-50 p-3 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {analytics.totals.clicks}
                </div>
                <div className="text-sm text-purple-600">Total Clicks</div>
              </div>
              <div className="rounded-lg bg-indigo-50 p-3 text-center">
                <div className="text-2xl font-bold text-indigo-700">
                  {analytics.totals.impressions.toLocaleString()}
                </div>
                <div className="text-sm text-indigo-600">Total Impressions</div>
              </div>
              <div className="rounded-lg bg-teal-50 p-3 text-center">
                <div className="text-2xl font-bold text-teal-700">
                  {analytics.totals.avgPosition}
                </div>
                <div className="text-sm text-teal-600">Avg Position</div>
              </div>
            </div>

            {analytics.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Query</th>
                      <th className="px-3 py-2 text-right">Clicks</th>
                      <th className="px-3 py-2 text-right">Impressions</th>
                      <th className="px-3 py-2 text-right">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.rows.map((row, i) => (
                      <tr key={row.query} className="border-t">
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{row.query}</td>
                        <td className="px-3 py-2 text-right">{row.clicks}</td>
                        <td className="px-3 py-2 text-right">
                          {row.impressions}
                        </td>
                        <td className="px-3 py-2 text-right">{row.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No query data available yet. This is normal for new sites.
              </p>
            )}
          </div>
        )}

        {!analytics && !coverage && !loading && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-lg text-gray-500">
              Enter your Admin API Key to load GSC data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
