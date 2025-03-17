import Hero from "../components/Hero";
import Projects from "../components/Projects";
import About from "../components/About";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      
      {/* Divider */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
        <div className="absolute inset-0 grid-background opacity-20"></div>
      </div>
      
      <Projects />
      
      {/* Divider */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
        <div className="absolute inset-0 grid-background opacity-20"></div>
      </div>
      
      <About />
    </main>
  );
}
