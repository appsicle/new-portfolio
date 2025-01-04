"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from 'lucide-react';

const menuItems = [
  { name: "Projects", href: "#projects" },
  {
    name: "Resume",
    href: "https://docs.google.com/document/d/e/2PACX-1vThj05LkyKj_BboimiYdlOvSN_luOGZU8oZF0_4HflwukXAJGM6X_kOCGt8ISwlym6pd74ktOh9yd6q/pub",
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);

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
                locale={undefined}
                target="_blank"
                className="text-foreground hover:text-primary transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                locale={undefined}
                target="_blank"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-background transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

