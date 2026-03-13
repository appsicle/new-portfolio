"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Github01Icon, Linkedin02Icon, Mail01Icon } from "hugeicons-react";
import ScrambleIn, { ScrambleInHandle } from "./fancy/text/scramble-in";
import CenterUnderline from "./fancy/text/underline-center";
import HalftoneImage from "./HalftoneImage";

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
  const scrambleRefs = useRef<(ScrambleInHandle | null)[]>([]);

  useEffect(() => {
    heroLines.forEach((_, index) => {
      const delay = index * 50;
      setTimeout(() => {
        scrambleRefs.current[index]?.start();
      }, delay);
    });
  }, []);

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
                  <span className="text-muted-foreground">
                    {exp.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image - Halftone */}
        <HalftoneImage
          src="/scenery.png"
          alt="Scenery with halftone effect"
          className="animate-fade-in-up animate-delay-200 overflow-hidden rounded-lg"
          gridSize={6}
          maxHeight="40vh"
        />

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
                className=""
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
