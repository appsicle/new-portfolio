import Hero from "../components/Hero";
import Projects from "../components/Projects";
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
    <main className="bg-background text-foreground relative overflow-hidden">
      {/* Neon motion accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full opacity-40 bg-violet-400" />
        <div className="absolute top-3/4 right-20 w-3 h-3 rounded-full opacity-35 bg-cyan-300" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full opacity-40 bg-emerald-300" />
      </div>
      
      <Hero contributions={contributions}>
        <GitHubCalendar contributions={contributions} />
      </Hero>
      <Projects />
      <About />
    </main>
  );
}
