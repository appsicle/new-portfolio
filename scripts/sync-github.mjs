// Writes the last year of GitHub contributions to data/github-contributions.json for the /stats page.
// Reads the same public calendar github.com/<login> shows, so the numbers match the profile.
// Falls back to the GraphQL API (needs `gh auth login`) if the page can't be read.
// Usage: node scripts/sync-github.mjs [login]
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LOGIN = process.argv[2] || "appsicle";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/github-contributions.json");

async function fromProfile() {
  const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, {
    headers: { "User-Agent": "portfolio-stats-sync" },
  });
  if (!res.ok) throw new Error(`profile calendar → ${res.status}`);
  const html = await res.text();

  // Tooltips carry the counts ("12 contributions on …" / "No contributions on …"), keyed by cell id.
  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = /^([\d,]+) contribution/.exec(m[2].trim());
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }
  const days = [];
  for (const m of html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)) {
    const attrs = Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]));
    days.push({ date: attrs["data-date"], count: counts.get(attrs.id) ?? 0, level: Number(attrs["data-level"] ?? 0) });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  const total = Number((/([\d,]+)\s+contributions?\s+in the last year/.exec(html.replace(/\s+/g, " "))?.[1] ?? "").replace(/,/g, ""));
  if (days.length < 300 || !counts.size) throw new Error("couldn't read the profile calendar");
  return { days, total: total || days.reduce((s, d) => s + d.count, 0), source: "profile" };
}

function fromApi() {
  const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
  const res = JSON.parse(execFileSync("gh", ["api", "graphql", "-f", `query=${query}`, "-f", `login=${LOGIN}`], { encoding: "utf8" }));
  const cal = res.data.user.contributionsCollection.contributionCalendar;
  const days = cal.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 }));
  return { days, total: cal.totalContributions, source: "api" };
}

let data;
try {
  data = await fromProfile();
} catch (err) {
  console.warn(`Profile calendar unavailable (${err.message}); using the GitHub API instead.`);
  data = fromApi();
}

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), login: LOGIN, total: data.total, days: data.days }) + "\n");
console.log(`Wrote ${data.days.length} days, ${data.total} contributions from the ${data.source} (${data.days[0]?.date} → ${data.days.at(-1)?.date})`);
