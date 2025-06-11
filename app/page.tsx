import Hero from "../components/Hero";
import Projects from "../components/Projects";
import About from "../components/About";

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
    .map((c: any) => ({
      date: c.date,
      count: c.contributionCount,
      level: levelMap[c.contributionLevel as ContributionLevel],
    }))
    .filter((c: any) => c.date); // Filter out any invalid entries

  return {
    total: data.totalContributions,
    contributions,
  };
}

export default async function Home() {
  const contributions = await getContributions();

  return (
    <main className="bg-background text-foreground relative overflow-hidden">
      {/* Nature-inspired background elements for seamless flow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-10 w-2 h-2 rounded-full opacity-20"
          style={{ backgroundColor: '#4CAF50' }}
        />
        <div 
          className="absolute top-3/4 right-20 w-3 h-3 rounded-full opacity-15"
          style={{ backgroundColor: '#8BC34A' }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full opacity-25"
          style={{ backgroundColor: '#81C784' }}
        />
      </div>
      
      <Hero contributions={contributions} />
      <Projects />
      <About />
    </main>
  );
}
