import type { Metadata } from "next";
import SleepGraph from "@/components/stats/SleepGraph";
import BandSpinner from "@/components/stats/BandSpinner";
import PoweredByWhoop from "@/components/stats/PoweredByWhoop";
import { loadStats } from "@/lib/stats/data";

export const metadata: Metadata = {
  title: "Stats · Albert Zhang",
  description: "A year of GitHub contributions, with my sleep and overnight stress from WHOOP.",
};

// The daily sync revalidates this page; the hourly window is a backstop.
export const revalidate = 3600;

export default async function StatsPage() {
  const { github, nights } = await loadStats();
  // The graph ends on GitHub's latest day, so the server and browser draw the same squares.
  const end = github.days.at(-1)?.date ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="panel flex min-h-screen flex-col">
      <section className="section-layout flex flex-1 items-center justify-center pb-10 pt-28 sm:pt-32">
        <SleepGraph nights={nights} contributions={github.days} totalContributions={github.total} end={end} />
      </section>
      <footer className="flex flex-col items-center gap-6 pb-10">
        <BandSpinner />
        <PoweredByWhoop />
      </footer>
    </div>
  );
}
