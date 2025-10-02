import Link from "next/link";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/appsicle" },
  { label: "LinkedIn", href: "https://linkedin.com/in/albertzhang100" },
  { label: "Email", href: "mailto:aalbertzhang@gmail.com" },
];

export default function Hero() {
  return (
    <section className="panel py-20 sm:py-24">
      <div className="section-layout flex max-w-4xl flex-col gap-7 text-left">
        <div className="accent-line animate-fade-in-up" aria-hidden />
        <h1 className="animate-fade-in-up animate-delay-100 whitespace-nowrap text-4xl sm:text-6xl">Albert Zhang</h1>
        <p className="animate-fade-in-up animate-delay-200 text-base text-muted-foreground sm:text-lg">
          Software Engineer
        </p>
        <div className="animate-fade-in-up animate-delay-300 flex flex-wrap gap-4 text-sm">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-opacity duration-200 hover:opacity-60"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
