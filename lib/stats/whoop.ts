import "server-only";
import { readJson, TOKENS_PATH, writeJson } from "./store";
import type { Night } from "@/components/stats/types";

const API = "https://api.prod.whoop.com/developer";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";

type Tokens = { access_token: string; refresh_token: string; expires_at: number };
type Score = Record<string, unknown>;
type Sleep = {
  id: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: string;
  score: {
    stage_summary: {
      total_light_sleep_time_milli: number;
      total_slow_wave_sleep_time_milli: number;
      total_rem_sleep_time_milli: number;
    };
  };
};
type Recovery = { sleep_id: string; score_state: string; score: Score & { hrv_rmssd_milli?: number; resting_heart_rate?: number } };

/**
 * WHOOP rotates the refresh token on every use, and reusing an old one can end the whole session.
 * So the new pair is saved before anything else happens.
 */
async function accessToken(): Promise<string> {
  const saved = await readJson<Tokens>(TOKENS_PATH);
  if (!saved?.refresh_token) throw new Error("No WHOOP tokens in the store. Seed whoop/tokens.json first.");
  if (Date.now() < saved.expires_at) return saved.access_token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: saved.refresh_token,
      scope: "offline",
      client_id: process.env.WHOOP_CLIENT_ID ?? "",
      client_secret: process.env.WHOOP_CLIENT_SECRET ?? "",
    }),
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`WHOOP token refresh failed (${res.status}): ${JSON.stringify(body)}`);

  const next: Tokens = {
    access_token: body.access_token,
    refresh_token: body.refresh_token || saved.refresh_token,
    expires_at: Date.now() + (body.expires_in - 60) * 1000,
  };
  await writeJson(TOKENS_PATH, next);
  return next.access_token;
}

async function collect<T>(pathname: string, token: string, start: string): Promise<T[]> {
  const out: T[] = [];
  let next: string | undefined;
  for (let page = 0; page < 40; page++) {
    const url = new URL(API + pathname);
    url.searchParams.set("limit", "25");
    url.searchParams.set("start", start);
    if (next) url.searchParams.set("nextToken", next);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000));
      page--;
      continue;
    }
    if (!res.ok) throw new Error(`${pathname} → ${res.status} ${await res.text()}`);
    const body = (await res.json()) as { records?: T[]; next_token?: string };
    out.push(...(body.records ?? []));
    next = body.next_token;
    if (!next) break;
  }
  return out;
}

const offsetMinutes = (o: string) => {
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(o || "+00:00");
  return m ? (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +m[3]) : 0;
};
const localDate = (iso: string, o: string) => new Date(Date.parse(iso) + offsetMinutes(o) * 6e4).toISOString().slice(0, 10);
const stats = (v: number[]) => {
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, v.length - 1));
  return { mean, sd };
};

/** One row per night (dated by the morning you woke up): hours asleep and overnight stress. */
export async function fetchNights(days = 400): Promise<Night[]> {
  const token = await accessToken();
  const start = new Date(Date.now() - days * 864e5).toISOString();
  const [sleeps, recoveries] = await Promise.all([
    collect<Sleep>("/v2/activity/sleep", token, start),
    collect<Recovery>("/v2/recovery", token, start),
  ]);
  const recBySleep = new Map(recoveries.filter((r) => r.score_state === "SCORED").map((r) => [r.sleep_id, r.score]));

  const byDate = new Map<string, { date: string; sleep: number; hrv: number | null; rhr: number | null }>();
  for (const s of sleeps) {
    if (s.nap || s.score_state !== "SCORED") continue;
    const st = s.score.stage_summary;
    const ms = st.total_light_sleep_time_milli + st.total_slow_wave_sleep_time_milli + st.total_rem_sleep_time_milli;
    const rec = recBySleep.get(s.id);
    const night = {
      date: localDate(s.end, s.timezone_offset),
      sleep: Math.round((ms / 36e5) * 100) / 100,
      hrv: rec?.hrv_rmssd_milli ?? null,
      rhr: rec?.resting_heart_rate ?? null,
    };
    const prev = byDate.get(night.date);
    if (!prev || night.sleep > prev.sleep) byDate.set(night.date, night);
  }
  const nights = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Overnight stress, 0–3: how far HRV fell below and resting HR rose above the previous 30 nights.
  // A typical night lands near 1. WHOOP doesn't share a stress score through its API.
  return nights.map((n, i) => {
    const withVitals = (p: typeof n) => p.hrv != null && p.rhr != null;
    const prior = nights.slice(Math.max(0, i - 30), i).filter(withVitals);
    const base = prior.length >= 4 ? prior : nights.filter(withVitals);
    let stress: number | null = null;
    if (n.hrv != null && n.rhr != null && base.length >= 3) {
      const h = stats(base.map((p) => p.hrv as number));
      const r = stats(base.map((p) => p.rhr as number));
      const z = ((h.sd ? (h.mean - n.hrv) / h.sd : 0) + (r.sd ? (n.rhr - r.mean) / r.sd : 0)) / 2;
      stress = Math.round(Math.max(0, Math.min(3, 1 + z)) * 10) / 10;
    }
    // The site is public: publish only what the page shows.
    return { date: n.date, sleep: n.sleep, stress };
  });
}
