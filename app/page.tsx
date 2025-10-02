import Hero from "../components/Hero";
import About from "../components/About";
import GitHubCalendar from "../components/GitHubCalendar";

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

const levelMap: Record<ContributionLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function getContributions() {
  const res = await fetch(
    `https://github-contributions-api.deno.dev/appsicle.json`,
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
  if (!res.ok) {
    return null;
  }
  const data = await res.json();

  if (!data || !data.contributions) {
    return null;
  }

  const contributions = data.contributions
    .flat()
    .map((c: { date: string; contributionCount: number; contributionLevel: ContributionLevel }) => ({
      date: c.date,
      count: c.contributionCount,
      level: levelMap[c.contributionLevel as ContributionLevel],
    }))
    .filter((c: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }) => c.date); // Filter out any invalid entries

  return {
    total: data.totalContributions,
    contributions,
  };
}

export default async function Home() {
  const contributions = await getContributions();

  return (
    <main>
      <Hero />
      <section className="panel-alt py-20 sm:py-24">
        <div className="section-layout flex flex-col gap-10 text-left">
          <div className="accent-line" aria-hidden />
          <h2 className="text-2xl text-foreground">Activity</h2>
          <GitHubCalendar contributions={contributions} />
        </div>
      </section>
      <About />
    </main>
  );
}
