import Link from "next/link";

const skills = [
  "Remotion",
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "Node.js",
  "GraphQL",
  "SQL",
];

const experiences = [
  {
    company: "Kashie",
    range: "Aug 2025 – Present",
    roles: ["Co-Founder (CTO)"],
    href: "https://kashie.ai",
  },
  {
    company: "Parallel Distribution",
    range: "Jan 2025 – Jun 2025",
    roles: ["Founding Engineer"],
  },
  {
    company: "Microsoft",
    range: "Sep 2021 – Jan 2025",
    roles: ["Software Engineer"],
  },
  {
    company: "Commit the Change, UCI",
    range: "Mar 2020 – Jun 2021",
    roles: ["Co-Founder"],
    href: "https://ctc-uci.com",
  },
];

export default function About() {
  return (
    <section id="about" className="panel-muted py-20 sm:py-24">
      <div className="section-layout flex flex-col gap-10 text-left">
        <div className="accent-line" aria-hidden />
        <h2 className="text-2xl text-foreground">About</h2>

        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <div className="flex-1 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Experience</h3>
            <ul className="flex flex-col gap-4 text-sm text-foreground">
              {experiences.map((item) => (
                <li key={item.company} className="space-y-1">
                  <p className="text-xs tracking-[0.28em] text-muted-foreground">
                    {item.range}
                  </p>
                  <p className="text-sm uppercase tracking-[0.3em]">
                    {item.roles.join(" · ")}
                  </p>
                  {item.href ? (
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 transition-opacity duration-200 hover:opacity-60"
                    >
                      {item.company}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 sm:w-64">
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Skills</h3>
            <ul className="flex flex-wrap gap-2 text-xs">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-sm border border-border px-3 py-1.5 tracking-wide transition-colors duration-200 hover:border-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
