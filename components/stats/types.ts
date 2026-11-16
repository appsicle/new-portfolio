export type Night = {
  /** Morning you woke up, YYYY-MM-DD */
  date: string;
  /** Hours asleep (light + deep + REM) */
  sleep: number;
  /** Overnight stress, 0–3 */
  stress: number | null;
};

export const fmtHours = (h: number | null | undefined) => {
  if (h == null || Number.isNaN(h)) return "—";
  const m = Math.round(h * 60);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
};

export const stressLabel = (s: number | null) =>
  s == null ? "—" : s < 0.75 ? "Low" : s < 1.5 ? "Normal" : s < 2.25 ? "Elevated" : "High";

/** GitHub's own contribution greens (levels 0–4), light and dark */
export const GH_FILL = [
  "!fill-[#ebedf0] dark:!fill-[#161b22]",
  "!fill-[#9be9a8] dark:!fill-[#0e4429]",
  "!fill-[#40c463] dark:!fill-[#006d32]",
  "!fill-[#30a14e] dark:!fill-[#26a641]",
  "!fill-[#216e39] dark:!fill-[#39d353]",
];

export type Contribution = {
  date: string;
  count: number;
  /** GitHub's own 0–4 shade */
  level: number;
};
