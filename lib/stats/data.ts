import "server-only";
import whoopSeed from "@/data/whoop-stats.json";
import githubSeed from "@/data/github-contributions.json";
import { readJson, STATS_PATH } from "./store";
import type { Contribution, Night } from "@/components/stats/types";

export type Stats = {
  updatedAt: string;
  github: { total: number; days: Contribution[] };
  nights: Night[];
};

/** Latest synced stats from the Blob store; the committed snapshot if the store is empty or unreachable. */
export async function loadStats(): Promise<Stats> {
  try {
    const stored = await readJson<Stats>(STATS_PATH);
    if (stored?.github?.days?.length) return stored;
  } catch (err) {
    console.error("[stats] reading the store failed; using the committed snapshot", err);
  }
  return {
    updatedAt: githubSeed.updatedAt,
    github: { total: githubSeed.total, days: githubSeed.days as Contribution[] },
    nights: whoopSeed.nights as Night[],
  };
}
