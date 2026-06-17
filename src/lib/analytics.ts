import { useEffect, useState } from "react";

export type ToolKey = "emails" | "meetings" | "tasks" | "research";

const STORAGE_KEY = "wpa_metrics_v1";
const EVENT_NAME = "wpa-metrics-changed";

const HOURS_PER: Record<ToolKey, number> = {
  emails: 0.25,
  meetings: 0.5,
  tasks: 0.1,
  research: 1.0,
};

export type Metrics = Record<ToolKey, number>;

const EMPTY: Metrics = { emails: 0, meetings: 0, tasks: 0, research: 0 };

export function getMetrics(): Metrics {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Metrics>) };
  } catch {
    return EMPTY;
  }
}

export function incrementMetric(key: ToolKey) {
  if (typeof window === "undefined") return;
  const current = getMetrics();
  const next = { ...current, [key]: current[key] + 1 };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function totalHoursSaved(m: Metrics): number {
  return (
    m.emails * HOURS_PER.emails +
    m.meetings * HOURS_PER.meetings +
    m.tasks * HOURS_PER.tasks +
    m.research * HOURS_PER.research
  );
}

export function useMetrics(): Metrics {
  const [metrics, setMetrics] = useState<Metrics>(EMPTY);
  useEffect(() => {
    const sync = () => setMetrics(getMetrics());
    sync();
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return metrics;
}