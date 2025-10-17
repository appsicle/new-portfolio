"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github01Icon, Linkedin02Icon, Mail01Icon } from "hugeicons-react";
import ScrambleIn, { ScrambleInHandle } from "./fancy/text/scramble-in";
import PixelateSvgFilter from "./fancy/filter/pixelate-svg-filter";
import CenterUnderline from "./fancy/text/underline-center";
import { useMousePosition } from "@/lib/hooks/use-mouse-position";

const experiences = [
  {
    year: "2025",
    company: "Kashie",
    role: "Co-Founder (CTO)",
    href: "https://kashie.ai",
  },
  {
    year: "2025",
    company: "Parallel Distribution",
    role: "Founding Engineer",
    href: "https://paralleldistribution.com",
  },
  {
    year: "2021",
    company: "Microsoft",
    role: "Software Engineer",
    href: "https://microsoft.com",
  },
  {
    year: "2020",
    company: "Commit the Change, UCI",
    role: "Co-Founder",
    href: "https://ctc-uci.com",
  },
];

const heroLines = [
  "I'm Albert,",
  "a Software Engineer",
  "based in NYC."
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/appsicle",
    icon: Github01Icon,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/albertzhang100",
    icon: Linkedin02Icon,
  },
  {
    name: "Email",
    href: "mailto:aalbertzhang@gmail.com",
    icon: Mail01Icon,
  }
];

export default function Hero() {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(imageContainerRef);
  const [isHovering, setIsHovering] = useState(false);
  const scrambleRefs = useRef<(ScrambleInHandle | null)[]>([]);

  useEffect(() => {
    heroLines.forEach((_, index) => {
      const delay = index * 50;
      setTimeout(() => {
        scrambleRefs.current[index]?.start();
      }, delay);
    });
  }, []);

  // Calculate distance from center
  const getPixelSize = () => {
    if (!isHovering || !imageContainerRef.current) return 1;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate distance from center
    const distanceX = Math.abs(mousePosition.x - centerX);
    const distanceY = Math.abs(mousePosition.y - centerY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const currentDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Invert: closer to center = more pixelated
    const normalizedDistance = 1 - (currentDistance / maxDistance);
    const pixelSize = Math.min(Math.max(normalizedDistance * 64, 1), 64) / 3;

    return pixelSize;
  };

  const pixelSize = getPixelSize();

  return (
    <section className="panel flex min-h-screen items-center py-8 sm:py-12">
      <div className="section-layout flex w-full flex-col gap-8 sm:gap-12">
        {/* Name and Experience Section */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* Left Side - Hero Content */}
          <div className="flex flex-1 flex-col justify-center gap-4">
            <div className="accent-line animate-fade-in-up" aria-hidden />

            <h1 className="flex flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {heroLines.map((line, index) => (
                <ScrambleIn
                  key={index}
                  ref={(el) => {
                    scrambleRefs.current[index] = el;
                  }}
                  text={line}
                  scrambleSpeed={40}
                  scrambledLetterCount={3}
                  autoStart={false}
                />
              ))}
            </h1>
          </div>

          {/* Right Side - Experience */}
          <div className="flex flex-1 flex-col justify-center">
            <div className="animate-fade-in-up animate-delay-100 space-y-4 sm:space-y-6">
              {experiences.map((exp) => (
                <div
                  key={`${exp.company}-${exp.year}`}
                  className="group grid grid-cols-[60px_1fr_1fr] gap-3 text-xs sm:grid-cols-[80px_1fr_1fr] sm:gap-4 sm:text-sm"
                >
                  <span className="text-muted-foreground">{exp.year}</span>
                  <Link
                    href={exp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-200"
                  >
                    <CenterUnderline>{exp.company}</CenterUnderline>
                  </Link>
                  <span className="text-muted-foreground transition-opacity duration-200 group-hover:opacity-60">
                    {exp.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div
          ref={imageContainerRef}
          className="animate-fade-in-up animate-delay-200 relative w-full overflow-hidden rounded-lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <PixelateSvgFilter id="pixelate-filter" size={pixelSize} crossLayers />
          <Image
            src="/scenery.png"
            alt="Beautiful scenery with cherry blossoms"
            width={1920}
            height={1080}
            className="h-auto w-full object-cover transition-all duration-200"
            style={{ maxHeight: '40vh', filter: isHovering ? "url(#pixelate-filter)" : "none" }}
            priority
          />
        </div>

        {/* Social Links */}
        <div className="animate-fade-in-up animate-delay-300 flex justify-center gap-6">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.name}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="transition-opacity duration-200 hover:opacity-60"
                aria-label={social.name}
              >
                <Icon size={20} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
