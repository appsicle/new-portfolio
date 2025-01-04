"use client";

import * as React from "react";
import Link from "next/link";

const menuItems = [
  { name: "Projects", href: "#projects" },
  {
    name: "Resume",
    href: "https://docs.google.com/document/d/e/2PACX-1vThj05LkyKj_BboimiYdlOvSN_luOGZU8oZF0_4HflwukXAJGM6X_kOCGt8ISwlym6pd74ktOh9yd6q/pub",
  },
];

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AZ
          </Link>
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                locale={false}
                target='_blank'
                className="text-foreground hover:text-primary transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
