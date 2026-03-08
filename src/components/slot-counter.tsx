"use client";

import { useEffect, useState, useMemo } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SlotCounterProps {
  value: string;
  className?: string;
}

function parseValue(val: string): { digits: string[]; suffix: string } {
  const match = val.match(/^([\d\s]+)(.*)/);
  if (!match) return { digits: [], suffix: val };
  const raw = match[1].replace(/\s/g, "");
  return { digits: raw.split(""), suffix: match[2].trim() };
}

function SlotDigit({
  digit,
  delay,
  reduced,
}: {
  digit: string;
  delay: number;
  reduced: boolean;
}) {
  const target = parseInt(digit, 10);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (reduced) {
      setAnimate(true);
      return;
    }
    const t = setTimeout(() => setAnimate(true), delay);
    return () => clearTimeout(t);
  }, [delay, reduced]);

  if (isNaN(target)) {
    return <span className="inline-block">{digit}</span>;
  }

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: "0.65em", height: "1.15em" }}
    >
      <span
        className="absolute left-0 top-0 flex flex-col items-center"
        style={{
          transform: animate
            ? `translateY(-${target * 1.15}em)`
            : "translateY(0em)",
          transition: reduced
            ? "none"
            : `transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span
            key={n}
            className="flex items-center justify-center"
            style={{ height: "1.15em", lineHeight: "1.15em" }}
            aria-hidden={n !== target}
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function SlotCounter({ value, className = "" }: SlotCounterProps) {
  const { ref, isInView } = useInView<HTMLSpanElement>({
    once: true,
    margin: "-60px",
  });
  const reduced = useReducedMotion();
  const { digits, suffix } = useMemo(() => parseValue(value), [value]);

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline font-extrabold tabular-nums ${className}`}
      aria-label={value}
    >
      {isInView ? (
        <>
          {digits.map((d, i) => (
            <SlotDigit
              key={`${i}-${d}`}
              digit={d}
              delay={i * 120}
              reduced={reduced}
            />
          ))}
          {suffix && (
            <span
              className="ml-0.5 inline-flex items-end self-end"
              style={{
                lineHeight: "1.15em",
                height: "1.15em",
                opacity: 0,
                animation: `fade-in 0.3s ease ${digits.length * 0.12 + 0.3}s forwards`,
              }}
            >
              {suffix}
            </span>
          )}
        </>
      ) : (
        <span className="invisible">{value}</span>
      )}
    </span>
  );
}
