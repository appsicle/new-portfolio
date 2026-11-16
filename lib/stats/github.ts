import "server-only";
import type { Contribution } from "@/components/stats/types";

export const GITHUB_LOGIN = "appsicle";

/** Reads the same public calendar github.com/<login> shows, so the numbers match the profile. */
export async function fetchContributions(login = GITHUB_LOGIN): Promise<{ total: number; days: Contribution[] }> {
  const res = await fetch(`https://github.com/users/${login}/contributions`, {
    headers: { "User-Agent": "portfolio-stats-sync" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub calendar → ${res.status}`);
  const html = await res.text();

  // Tooltips carry the counts ("12 contributions on …" / "No contributions on …"), keyed by cell id.
  const counts = new Map<string, number>();
  for (const m of Array.from(html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g))) {
    const n = /^([\d,]+) contribution/.exec(m[2].trim());
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }
  const days: Contribution[] = [];
  for (const m of Array.from(html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g))) {
    const attrs = Object.fromEntries(Array.from(m[1].matchAll(/([\w-]+)="([^"]*)"/g)).map((a) => [a[1], a[2]]));
    days.push({ date: attrs["data-date"], count: counts.get(attrs.id) ?? 0, level: Number(attrs["data-level"] ?? 0) });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300 || !counts.size) throw new Error("Couldn't read the GitHub calendar; its markup may have changed.");

  const total = Number(/([\d,]+)\s+contributions?\s+in the last year/.exec(html.replace(/\s+/g, " "))?.[1]?.replace(/,/g, ""));
  return { total: total || days.reduce((s, d) => s + d.count, 0), days };
}
