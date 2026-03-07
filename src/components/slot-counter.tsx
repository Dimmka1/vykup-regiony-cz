"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion, useInView } from "@/components/motion";

interface SlotCounterProps {
  value: string;
  className?: string;
}

/** Parse a value like "500+", "98%", "24h", "14", "0 Kč" into digits and suffix. */
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
  reduced: boolean | null;
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
      <motion.span
        className="absolute left-0 top-0 flex flex-col items-center"
        initial={reduced ? { y: `-${target * 1.15}em` } : { y: "0em" }}
        animate={animate ? { y: `-${target * 1.15}em` } : undefined}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 14,
          mass: 1,
          delay: reduced ? 0 : delay / 1000,
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
      </motion.span>
    </span>
  );
}

export function SlotCounter({ value, className = "" }: SlotCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const { digits, suffix } = useMemo(() => parseValue(value), [value]);

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline font-extrabold tabular-nums ${className}`}
      aria-label={value}
    >
      {inView ? (
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
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: digits.length * 0.12 + 0.3 }}
              className="ml-0.5"
            >
              {suffix}
            </motion.span>
          )}
        </>
      ) : (
        <span className="invisible">{value}</span>
      )}
    </span>
  );
}
