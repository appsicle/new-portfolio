import Hero from "../components/Hero";
import Projects from "../components/Projects";
import About from "../components/About";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Projects />
      <About />
    </main>
  );
}
