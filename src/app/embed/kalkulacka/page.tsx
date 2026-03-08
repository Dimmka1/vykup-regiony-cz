"use client";

import { useState, type ReactElement, type ChangeEvent } from "react";

/* ── Region price data (CZK/m², source: PRICE_RESEARCH) ── */

interface RegionOption {
  key: string;
  label: string;
  byt: number;
  dum: number;
  pozemek: number;
}

const REGIONS: RegionOption[] = [
  { key: "praha", label: "Praha", byt: 150_800, dum: 105_000, pozemek: 14_000 },
  {
    key: "stredocesky",
    label: "Středočeský kraj",
    byt: 86_500,
    dum: 60_000,
    pozemek: 5_500,
  },
  {
    key: "jihocesky",
    label: "Jihočeský kraj",
    byt: 72_000,
    dum: 48_000,
    pozemek: 3_000,
  },
  {
    key: "plzensky",
    label: "Plzeňský kraj",
    byt: 78_000,
    dum: 52_000,
    pozemek: 3_200,
  },
  {
    key: "karlovarsky",
    label: "Karlovarský kraj",
    byt: 42_000,
    dum: 32_000,
    pozemek: 1_800,
  },
  {
    key: "ustecky",
    label: "Ústecký kraj",
    byt: 40_000,
    dum: 28_000,
    pozemek: 1_800,
  },
  {
    key: "liberecky",
    label: "Liberecký kraj",
    byt: 68_000,
    dum: 45_000,
    pozemek: 2_500,
  },
  {
    key: "kralovehradecky",
    label: "Královéhradecký kraj",
    byt: 75_000,
    dum: 48_000,
    pozemek: 3_200,
  },
  {
    key: "pardubicky",
    label: "Pardubický kraj",
    byt: 72_000,
    dum: 46_000,
    pozemek: 2_800,
  },
  {
    key: "vysocina",
    label: "Kraj Vysočina",
    byt: 55_000,
    dum: 38_000,
    pozemek: 1_600,
  },
  {
    key: "jihomoravsky",
    label: "Jihomoravský kraj",
    byt: 91_000,
    dum: 58_000,
    pozemek: 5_000,
  },
  {
    key: "olomoucky",
    label: "Olomoucký kraj",
    byt: 70_000,
    dum: 42_000,
    pozemek: 2_200,
  },
  {
    key: "moravskoslezsky",
    label: "Moravskoslezský kraj",
    byt: 50_000,
    dum: 35_000,
    pozemek: 1_700,
  },
  {
    key: "zlinsky",
    label: "Zlínský kraj",
    byt: 68_000,
    dum: 44_000,
    pozemek: 2_400,
  },
];

type PropertyType = "byt" | "dum" | "pozemek";

const TYPE_LABELS: Record<PropertyType, string> = {
  byt: "Byt",
  dum: "Dům",
  pozemek: "Pozemek",
};

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EmbedKalkulackaPage(): ReactElement {
  const [regionIdx, setRegionIdx] = useState(0);
  const [propertyType, setPropertyType] = useState<PropertyType>("byt");
  const [area, setArea] = useState("");
  const [result, setResult] = useState<{ min: number; max: number } | null>(
    null,
  );

  function calculate(): void {
    const m2 = parseFloat(area);
    if (!m2 || m2 <= 0) return;
    const region = REGIONS[regionIdx];
    const pricePerM2 = region[propertyType];
    const market = m2 * pricePerM2;
    // Výkupní cena ~75 % tržní, range ±15 %
    const base = market * 0.75;
    setResult({ min: Math.round(base * 0.85), max: Math.round(base * 1.15) });
  }

  return (
    <div
      style={{
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: 400,
        margin: "0 auto",
        padding: "24px 20px",
        color: "#1e293b",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <h1
        style={{
          fontSize: 18,
          fontWeight: 700,
          margin: "0 0 16px",
          textAlign: "center",
          color: "#0f172a",
        }}
      >
        Kalkulačka ceny nemovitosti
      </h1>

      {/* Region */}
      <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
        Kraj
      </label>
      <select
        value={regionIdx}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setRegionIdx(Number(e.target.value));
          setResult(null);
        }}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          fontSize: 14,
          marginBottom: 12,
          background: "#fff",
        }}
      >
        {REGIONS.map((r, i) => (
          <option key={r.key} value={i}>
            {r.label}
          </option>
        ))}
      </select>

      {/* Type */}
      <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
        Typ nemovitosti
      </label>
      <select
        value={propertyType}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setPropertyType(e.target.value as PropertyType);
          setResult(null);
        }}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          fontSize: 14,
          marginBottom: 12,
          background: "#fff",
        }}
      >
        {(Object.keys(TYPE_LABELS) as PropertyType[]).map((k) => (
          <option key={k} value={k}>
            {TYPE_LABELS[k]}
          </option>
        ))}
      </select>

      {/* Area */}
      <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
        Plocha (m²)
      </label>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={10000}
        placeholder="např. 75"
        value={area}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setArea(e.target.value);
          setResult(null);
        }}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          fontSize: 14,
          marginBottom: 16,
          boxSizing: "border-box",
        }}
      />

      {/* Calculate button */}
      <button
        type="button"
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "#0d9488",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Spočítat orientační cenu
      </button>

      {/* Result */}
      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "#f0fdfa",
            borderRadius: 10,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 13, color: "#0f766e", marginBottom: 4 }}>
            Orientační výkupní cena
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#115e59" }}>
            {formatCzk(result.min)} – {formatCzk(result.max)}
          </div>
          <a
            href="https://vykoupim-nemovitost.cz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "10px 20px",
              background: "#0d9488",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Přesný odhad zdarma na&nbsp;vykoupim&#8209;nemovitost.cz →
          </a>
        </div>
      )}

      {/* Brand link */}
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
          fontSize: 12,
          color: "#94a3b8",
        }}
      >
        Powered by{" "}
        <a
          href="https://vykoupim-nemovitost.cz"
          rel="dofollow"
          target="_blank"
          style={{ color: "#0d9488", textDecoration: "none", fontWeight: 600 }}
        >
          Vykoupím Nemovitost
        </a>
      </div>
    </div>
  );
}
