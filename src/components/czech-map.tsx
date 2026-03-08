"use client";

import { useState, useRef, useCallback } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
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
  praha: "Praha",
  "stredocesky-kraj": "Středočeský kraj",
  "jihocesky-kraj": "Jihočeský kraj",
  "plzensky-kraj": "Plzeňský kraj",
  "karlovarsky-kraj": "Karlovarský kraj",
  "ustecky-kraj": "Ústecký kraj",
  "liberecky-kraj": "Liberecký kraj",
  "kralovehradecky-kraj": "Královéhradecký kraj",
  "pardubicky-kraj": "Pardubický kraj",
  vysocina: "Vysočina",
  "jihomoravsky-kraj": "Jihomoravský kraj",
  "olomoucky-kraj": "Olomoucký kraj",
  "zlinsky-kraj": "Zlínský kraj",
  "moravskoslezsky-kraj": "Moravskoslezský kraj",
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

const REGIONS = Object.entries(REGION_SVG_PATHS).map(([czId, d]) => ({
  czId,
  key: CZ_TO_KEY[czId] ?? czId,
  d,
  label: REGION_LABELS[CZ_TO_KEY[czId] ?? ""] ?? czId,
  center: LABEL_CENTERS[czId] ?? [500, 285],
}));

interface CzechMapProps {
  currentRegion: string;
}

export function CzechMap({ currentRegion }: CzechMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  const handleMouseEnter = useCallback((key: string, czId: string) => {
    setHovered(key);
    const center = LABEL_CENTERS[czId];
    if (center) {
      setTooltip({
        x: center[0],
        y: center[1] - 25,
        label: REGION_LABELS[key] ?? key,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    setTooltip(null);
  }, []);

  const handleClick = useCallback((key: string) => {
    const SUBDOMAIN_MAP: Record<string, string> = {
      praha: "praha",
      "stredocesky-kraj": "stredocesky",
      "jihocesky-kraj": "jihocesky",
      "plzensky-kraj": "plzensky",
      "karlovarsky-kraj": "karlovarsky",
      "ustecky-kraj": "ustecky",
      "liberecky-kraj": "liberecky",
      "kralovehradecky-kraj": "kralovehradecky",
      "pardubicky-kraj": "pardubicky",
      vysocina: "vysocina",
      "jihomoravsky-kraj": "jihomoravsky",
      "olomoucky-kraj": "olomoucky",
      "zlinsky-kraj": "zlinsky",
      "moravskoslezsky-kraj": "moravskoslezsky",
    };
    const sub = SUBDOMAIN_MAP[key] ?? key;
    window.location.href = `https://${sub}.vykoupim-nemovitost.cz`;
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 570"
        className="h-auto w-full"
        role="img"
        aria-label="Interaktivní mapa krajů České republiky"
      >
        <defs>
          <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="map-glow-active"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {REGIONS.map((region) => {
          const isCurrent = region.key === currentRegion;
          const isHovered = region.key === hovered;

          return (
            <path
              key={region.czId}
              d={region.d}
              fill={
                isCurrent
                  ? "var(--theme-500)"
                  : isHovered
                    ? "var(--theme-400)"
                    : "var(--theme-600)"
              }
              fillOpacity={isCurrent ? 0.7 : isHovered ? 0.5 : 0.3}
              stroke={
                isCurrent || isHovered ? "var(--theme-400)" : "var(--theme-500)"
              }
              strokeWidth={isCurrent ? 2.5 : isHovered ? 2 : 1}
              strokeOpacity={isCurrent || isHovered ? 0.9 : 0.4}
              filter={
                isCurrent
                  ? "url(#map-glow-active)"
                  : isHovered
                    ? "url(#map-glow)"
                    : undefined
              }
              className="cursor-pointer transition-all duration-200"
              style={
                isCurrent && !reduced
                  ? {
                      transformOrigin: `${region.center[0]}px ${region.center[1]}px`,
                      animation: "pulse-scale 2.5s ease-in-out infinite",
                    }
                  : undefined
              }
              onMouseEnter={() => handleMouseEnter(region.key, region.czId)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(region.key)}
              role="button"
              aria-label={`${region.label} – Vykupujeme zde`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick(region.key);
                }
              }}
            />
          );
        })}

        {REGIONS.map((region) => {
          const isCurrent = region.key === currentRegion;
          return (
            <text
              key={`label-${region.czId}`}
              x={region.center[0]}
              y={region.center[1]}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isCurrent ? "white" : "rgba(255,255,255,0.7)"}
              fontSize={region.czId === "CZ10" ? "9" : "11"}
              fontWeight={isCurrent ? "bold" : "600"}
              className="pointer-events-none select-none"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
            >
              {region.label.replace(" kraj", "")}
            </text>
          );
        })}

        {tooltip && hovered !== currentRegion && (
          <g className="tooltip-fade-enter">
            <rect
              x={tooltip.x - 70}
              y={tooltip.y - 30}
              width={140}
              height={36}
              rx={8}
              fill="rgba(15,23,42,0.92)"
              stroke="var(--theme-500)"
              strokeWidth={1}
              strokeOpacity={0.6}
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 18}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
            >
              {tooltip.label}
            </text>
            <text
              x={tooltip.x}
              y={tooltip.y - 4}
              textAnchor="middle"
              fill="var(--theme-400)"
              fontSize="9"
            >
              Klikněte pro detail
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
