"use client";

import { REGION_SVG_PATHS } from "@/data/czech-map-paths";

const CZ_TO_KEY: Record<string, string> = {
  CZ10: "praha",
  CZ20: "stredocesky-kraj",
  CZ31: "jihocesky-kraj",
  CZ32: "plzensky-kraj",
  CZ41: "karlovarsky-kraj",
  CZ42: "ustecky-kraj",
  CZ51: "liberecky-kraj",
  CZ52: "kralovehradecky-kraj",
  CZ53: "pardubicky-kraj",
  CZ63: "vysocina",
  CZ64: "jihomoravsky-kraj",
  CZ71: "olomoucky-kraj",
  CZ72: "zlinsky-kraj",
  CZ80: "moravskoslezsky-kraj",
};

const REGION_LABELS: Record<string, string> = {
  CZ10: "Praha",
  CZ20: "Středočeský",
  CZ31: "Jihočeský",
  CZ32: "Plzeňský",
  CZ41: "Karlovarský",
  CZ42: "Ústecký",
  CZ51: "Liberecký",
  CZ52: "Královéhradecký",
  CZ53: "Pardubický",
  CZ63: "Vysočina",
  CZ64: "Jihomoravský",
  CZ71: "Olomoucký",
  CZ72: "Zlínský",
  CZ80: "Moravskoslezský",
};

const LABEL_CENTERS: Record<string, [number, number]> = {
  CZ42: [274.9, 145.1],
  CZ31: [363.6, 434.1],
  CZ64: [661.7, 432.8],
  CZ41: [138.5, 208.8],
  CZ52: [551.2, 160.2],
  CZ51: [455.7, 92.5],
  CZ80: [845.4, 294.8],
  CZ71: [727, 323.5],
  CZ53: [629.3, 283.6],
  CZ32: [207.4, 332.8],
  CZ10: [367.4, 231.8],
  CZ20: [438.4, 245.4],
  CZ63: [520.3, 358.9],
  CZ72: [803.3, 420.6],
};

const THEME_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
  "#84cc16",
  "#e11d48",
  "#0ea5e9",
  "#a855f7",
];

export function AboutMap(): React.ReactElement {
  const czIds = Object.keys(REGION_SVG_PATHS);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <svg
        viewBox="50 30 900 520"
        className="h-auto w-full"
        role="img"
        aria-label="Mapa České republiky se všemi 14 kraji, kde působíme"
      >
        {czIds.map((czId, i) => (
          <path
            key={czId}
            d={REGION_SVG_PATHS[czId]}
            fill={THEME_COLORS[i % THEME_COLORS.length]}
            fillOpacity={0.2}
            stroke={THEME_COLORS[i % THEME_COLORS.length]}
            strokeWidth={1.5}
            className="hover:fill-opacity-40 transition-all duration-300"
          />
        ))}
        {czIds.map((czId, i) => {
          const center = LABEL_CENTERS[czId];
          if (!center) return null;
          return (
            <g key={`label-${czId}`}>
              <circle
                cx={center[0]}
                cy={center[1]}
                r={6}
                fill={THEME_COLORS[i % THEME_COLORS.length]}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={center[0]}
                y={center[1] + 18}
                textAnchor="middle"
                className="fill-slate-700 text-[9px] font-semibold sm:text-[11px]"
              >
                {REGION_LABELS[czId] ?? czId}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
