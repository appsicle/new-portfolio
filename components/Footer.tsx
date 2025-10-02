import Link from "next/link";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/appsicle" },
  { label: "LinkedIn", href: "https://linkedin.com/in/albertzhang100" },
  { label: "Email", href: "mailto:aalbertzhang@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="panel-dark py-20 text-sm">
      <div className="section-layout flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <div className="accent-line" aria-hidden />
          <p className="text-base">Albert Zhang</p>
          <p className="text-xs tracking-[0.25em] text-white/60">
            I&apos;m a software engineer who builds functional, performant systems quickly.
          </p>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Albert Zhang. All rights reserved.</p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-white/80">
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
    </footer>
  );
}
