"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "@/components/motion";

const REGION_PATHS: Record<string, string> = {
  praha:
    "M 245,175 C 248,170 255,168 260,170 265,173 262,180 255,182 248,180 Z",
  "stredocesky-kraj": "M 220,155 L 280,155 290,185 270,200 230,200 210,185 Z",
  "jihocesky-kraj": "M 200,200 L 280,200 290,250 250,270 190,250 Z",
  "plzensky-kraj": "M 140,160 L 200,160 210,200 190,240 140,230 120,190 Z",
  "karlovarsky-kraj": "M 100,120 L 150,115 160,155 140,170 100,160 Z",
  "ustecky-kraj": "M 150,100 L 220,95 230,130 220,155 150,155 140,130 Z",
  "liberecky-kraj": "M 230,90 L 290,85 300,120 280,140 240,135 Z",
  "kralovehradecky-kraj": "M 280,95 L 350,100 360,145 310,155 280,140 Z",
  "pardubicky-kraj": "M 290,145 L 370,145 380,185 330,195 280,185 Z",
  vysocina: "M 250,195 L 330,195 340,240 290,255 240,240 Z",
  "jihomoravsky-kraj": "M 300,235 L 390,230 400,280 350,295 290,280 Z",
  "olomoucky-kraj": "M 340,150 L 400,155 410,200 380,215 340,200 Z",
  "moravskoslezsky-kraj": "M 380,110 L 430,120 435,170 400,180 370,160 Z",
  "zlinsky-kraj": "M 370,200 L 420,195 430,240 390,255 360,240 Z",
};

const REGION_LABELS: Record<string, string> = {
  praha: "Praha",
  "stredocesky-kraj": "Středočeský",
  "jihocesky-kraj": "Jihočeský",
  "plzensky-kraj": "Plzeňský",
  "karlovarsky-kraj": "Karlovarský",
  "ustecky-kraj": "Ústecký",
  "liberecky-kraj": "Liberecký",
  "kralovehradecky-kraj": "Královéhradecký",
  "pardubicky-kraj": "Pardubický",
  vysocina: "Vysočina",
  "jihomoravsky-kraj": "Jihomoravský",
  "olomoucky-kraj": "Olomoucký",
  "moravskoslezsky-kraj": "Moravskoslezský",
  "zlinsky-kraj": "Zlínský",
};

/** Centers of each region for network dots */
const REGION_CENTERS: Record<string, [number, number]> = {
  praha: [255, 175],
  "stredocesky-kraj": [250, 178],
  "jihocesky-kraj": [245, 235],
  "plzensky-kraj": [165, 195],
  "karlovarsky-kraj": [125, 140],
  "ustecky-kraj": [185, 125],
  "liberecky-kraj": [265, 110],
  "kralovehradecky-kraj": [320, 125],
  "pardubicky-kraj": [330, 168],
  vysocina: [290, 222],
  "jihomoravsky-kraj": [345, 260],
  "olomoucky-kraj": [375, 180],
  "moravskoslezsky-kraj": [405, 145],
  "zlinsky-kraj": [395, 220],
};

/** Network connections between neighboring regions */
const CONNECTIONS: [string, string][] = [
  ["praha", "stredocesky-kraj"],
  ["stredocesky-kraj", "plzensky-kraj"],
  ["stredocesky-kraj", "ustecky-kraj"],
  ["stredocesky-kraj", "liberecky-kraj"],
  ["stredocesky-kraj", "pardubicky-kraj"],
  ["stredocesky-kraj", "vysocina"],
  ["stredocesky-kraj", "jihocesky-kraj"],
  ["plzensky-kraj", "karlovarsky-kraj"],
  ["plzensky-kraj", "jihocesky-kraj"],
  ["ustecky-kraj", "liberecky-kraj"],
  ["ustecky-kraj", "karlovarsky-kraj"],
  ["liberecky-kraj", "kralovehradecky-kraj"],
  ["kralovehradecky-kraj", "pardubicky-kraj"],
  ["pardubicky-kraj", "vysocina"],
  ["pardubicky-kraj", "olomoucky-kraj"],
  ["vysocina", "jihocesky-kraj"],
  ["vysocina", "jihomoravsky-kraj"],
  ["jihomoravsky-kraj", "olomoucky-kraj"],
  ["jihomoravsky-kraj", "zlinsky-kraj"],
  ["olomoucky-kraj", "moravskoslezsky-kraj"],
  ["olomoucky-kraj", "zlinsky-kraj"],
  ["moravskoslezsky-kraj", "zlinsky-kraj"],
];

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

  const handleMouseEnter = useCallback(
    (key: string, e: React.MouseEvent<SVGPathElement>) => {
      setHovered(key);
      const svg = svgRef.current;
      if (!svg) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      setTooltip({
        x: svgPt.x,
        y: svgPt.y - 15,
        label: REGION_LABELS[key] ?? key,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    setTooltip(null);
  }, []);

  const handleClick = useCallback((key: string) => {
    const el = document.getElementById("kontakt");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  /* Traveling dot animation: we cycle through connections */
  const [activeLine, setActiveLine] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % CONNECTIONS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [reduced]);

  const networkLines = useMemo(
    () =>
      CONNECTIONS.map(([a, b], i) => {
        const [x1, y1] = REGION_CENTERS[a];
        const [x2, y2] = REGION_CENTERS[b];
        return { x1, y1, x2, y2, active: i === activeLine, key: `${a}-${b}` };
      }),
    [activeLine],
  );

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <svg
        ref={svgRef}
        viewBox="70 60 400 260"
        className="h-auto w-full"
        role="img"
        aria-label="Interaktivní mapa krajů České republiky"
      >
        <defs>
          <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="map-glow-strong"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Network connections */}
        {networkLines.map((line) => (
          <g key={line.key}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--theme-500)"
              strokeOpacity={0.12}
              strokeWidth={0.8}
            />
            {line.active && !reduced && (
              <circle r="2.5" fill="var(--theme-400)" opacity={0.8}>
                <animateMotion
                  dur="1.6s"
                  repeatCount="1"
                  path={`M${line.x1},${line.y1} L${line.x2},${line.y2}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  dur="1.6s"
                  repeatCount="1"
                />
              </circle>
            )}
          </g>
        ))}

        {/* Network dots at centers */}
        {Object.entries(REGION_CENTERS).map(([key, [cx, cy]]) => (
          <circle
            key={`dot-${key}`}
            cx={cx}
            cy={cy}
            r={key === currentRegion ? 3.5 : 2}
            fill={
              key === currentRegion ? "var(--theme-400)" : "var(--theme-500)"
            }
            opacity={key === currentRegion ? 0.9 : 0.3}
          >
            {key === currentRegion && !reduced && (
              <animate
                attributeName="r"
                values="3;5;3"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}

        {/* Region paths */}
        {Object.entries(REGION_PATHS).map(([key, d]) => {
          const isCurrent = key === currentRegion;
          const isHovered = key === hovered;
          return (
            <motion.path
              key={key}
              d={d}
              fill={
                isCurrent
                  ? "var(--theme-500)"
                  : isHovered
                    ? "var(--theme-400)"
                    : "var(--theme-700)"
              }
              fillOpacity={isCurrent ? 0.6 : isHovered ? 0.5 : 0.15}
              stroke={
                isCurrent || isHovered ? "var(--theme-400)" : "var(--theme-500)"
              }
              strokeWidth={isCurrent || isHovered ? 2 : 0.8}
              strokeOpacity={isCurrent || isHovered ? 0.9 : 0.3}
              filter={
                isHovered
                  ? "url(#map-glow)"
                  : isCurrent
                    ? "url(#map-glow-strong)"
                    : undefined
              }
              className="cursor-pointer"
              whileHover={reduced ? undefined : { scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onMouseEnter={(e) =>
                handleMouseEnter(
                  key,
                  e as unknown as React.MouseEvent<SVGPathElement>,
                )
              }
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(key)}
              role="button"
              aria-label={`${REGION_LABELS[key]} – Vykupujeme zde`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClick(key);
              }}
            >
              {isCurrent && !reduced && (
                <animate
                  attributeName="fill-opacity"
                  values="0.5;0.7;0.5"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              )}
            </motion.path>
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <rect
                x={tooltip.x - 55}
                y={tooltip.y - 28}
                width={110}
                height={30}
                rx={6}
                fill="rgba(15,23,42,0.9)"
                stroke="var(--theme-500)"
                strokeWidth={1}
                strokeOpacity={0.5}
              />
              <text
                x={tooltip.x}
                y={tooltip.y - 17}
                textAnchor="middle"
                fill="white"
                fontSize="8"
                fontWeight="bold"
              >
                {tooltip.label}
              </text>
              <text
                x={tooltip.x}
                y={tooltip.y - 6}
                textAnchor="middle"
                fill="var(--theme-400)"
                fontSize="6"
              >
                Vykupujeme zde
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
