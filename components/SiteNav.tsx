"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CenterUnderline from "./fancy/text/underline-center";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/stats", label: "Stats" },
];

// Sits opposite the theme toggle, on the same top line and side gutter.
export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Site"
      className="fixed top-6 z-50 flex items-center gap-6 text-xs leading-[18px] sm:text-[0.8rem]"
      style={{ left: "clamp(1.5rem, 12vw, 12rem)" }}
    >
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn("transition-colors duration-200", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <CenterUnderline>{label}</CenterUnderline>
          </Link>
        );
      })}
    </nav>
  );
}
