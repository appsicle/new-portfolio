import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { fetchContributions } from "@/lib/stats/github";
import { fetchNights } from "@/lib/stats/whoop";
import { loadStats, type Stats } from "@/lib/stats/data";
import { STATS_PATH, writeJson } from "@/lib/stats/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called daily by Vercel Cron (see vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Each source is synced on its own, so one failing keeps the other's last good data.
  const previous = await loadStats();
  const [github, nights] = await Promise.allSettled([fetchContributions(), fetchNights()]);
  const next: Stats = {
    updatedAt: new Date().toISOString(),
    github: github.status === "fulfilled" ? github.value : previous.github,
    nights: nights.status === "fulfilled" ? nights.value : previous.nights,
  };
  await writeJson(STATS_PATH, next);
  revalidatePath("/stats");

  const errors = [github, nights].flatMap((r) => (r.status === "rejected" ? [String(r.reason)] : []));
  if (errors.length) console.error("[stats] sync errors", errors);
  return NextResponse.json(
    { ok: errors.length === 0, contributions: next.github.total, nights: next.nights.length, errors },
    { status: errors.length === 2 ? 502 : 200 }
  );
}
