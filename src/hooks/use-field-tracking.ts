"use client";

import { useCallback, useRef } from "react";

/* ── Field-Level Form Analytics (VR-245) ─────────────────────── */

const LS_KEY = "vr245_field_events";

interface FieldEvent {
  event: string;
  field_name: string;
  form_name: string;
  step?: number;
  time_spent_ms?: number;
  had_error?: boolean;
  region: string;
  timestamp: number;
}

type DLEvent = Record<string, string | number | boolean | undefined>;

function pushToDataLayer(evt: DLEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  (window.dataLayer as unknown as DLEvent[]).push(evt);
}

function getRegion(): string {
  if (typeof window === "undefined") return "cesko";
  const host = window.location.hostname.split(".");
  if (host.length > 2 && host[0] !== "www") return host[0];
  const seg = window.location.pathname.split("/")[1];
  if (seg && seg.length > 1) return seg;
  return "cesko";
}

function persistEvent(evt: FieldEvent): void {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr: FieldEvent[] = raw ? JSON.parse(raw) : [];
    arr.push(evt);
    if (arr.length > 2000) arr.splice(0, arr.length - 2000);
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  } catch {
    /* quota / private mode */
  }
}

export function getStoredFieldEvents(): FieldEvent[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * useFieldTracking — invisible field-level analytics.
 *
 * Returns `getFieldProps(fieldName, step?)` — spread onto any input/select.
 * Fires GTM dataLayer events and persists to localStorage for admin stats.
 */
export function useFieldTracking(formName: string) {
  const timers = useRef<Record<string, number>>({});
  const errorFlags = useRef<Record<string, boolean>>({});

  const getFieldProps = useCallback(
    (fieldName: string, step?: number) => {
      const region = getRegion();

      return {
        onFocus: () => {
          timers.current[fieldName] = Date.now();

          const evt: DLEvent = {
            event: "form_field_focus",
            field_name: fieldName,
            form_name: formName,
            region,
          };
          if (step !== undefined) evt.step = step;
          pushToDataLayer(evt);

          persistEvent({
            event: "form_field_focus",
            field_name: fieldName,
            form_name: formName,
            step,
            region,
            timestamp: Date.now(),
          });
        },
        onBlur: () => {
          const start = timers.current[fieldName];
          const timeSpent = start ? Date.now() - start : 0;
          delete timers.current[fieldName];

          const hadError = !!errorFlags.current[fieldName];

          const evt: DLEvent = {
            event: "form_field_blur",
            field_name: fieldName,
            form_name: formName,
            time_spent_ms: timeSpent,
            had_error: hadError,
            region,
          };
          if (step !== undefined) evt.step = step;
          pushToDataLayer(evt);

          persistEvent({
            event: "form_field_blur",
            field_name: fieldName,
            form_name: formName,
            step,
            time_spent_ms: timeSpent,
            had_error: hadError,
            region,
            timestamp: Date.now(),
          });
        },
        onInvalid: () => {
          errorFlags.current[fieldName] = true;

          const evt: DLEvent = {
            event: "form_field_error",
            field_name: fieldName,
            form_name: formName,
            region,
          };
          if (step !== undefined) evt.step = step;
          pushToDataLayer(evt);

          persistEvent({
            event: "form_field_error",
            field_name: fieldName,
            form_name: formName,
            step,
            region,
            timestamp: Date.now(),
          });
        },
      };
    },
    [formName],
  );

  const trackError = useCallback(
    (fieldName: string, step?: number) => {
      errorFlags.current[fieldName] = true;
      const region = getRegion();

      const evt: DLEvent = {
        event: "form_field_error",
        field_name: fieldName,
        form_name: formName,
        region,
      };
      if (step !== undefined) evt.step = step;
      pushToDataLayer(evt);

      persistEvent({
        event: "form_field_error",
        field_name: fieldName,
        form_name: formName,
        step,
        region,
        timestamp: Date.now(),
      });
    },
    [formName],
  );

  return { getFieldProps, trackError };
}
