"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Github01Icon, Linkedin02Icon, Mail01Icon } from "hugeicons-react";
import ScrambleIn from "./fancy/text/scramble-in";
import CenterUnderline from "./fancy/text/underline-center";
import HalftoneField, { createFieldControls } from "./HalftoneField";
import TrackPlayer from "./TrackPlayer";

const experiences = [
  {
    year: "2026",
    company: "Launchpoint",
    role: "Founding Engineer",
    href: "https://apps.apple.com/us/app/launchpoint-make-money/id6479632197",
  },
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
  const controls = useRef(createFieldControls());
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="panel relative flex min-h-screen items-center py-8 sm:py-12"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <HalftoneField controls={controls} className="block h-full w-full" />
      </div>

      <div className="section-layout relative z-10 flex w-full flex-col gap-8 sm:gap-12">
        {/* Name and Experience Section */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* Left Side - Hero Content */}
          <div className="beat-in flex flex-1 flex-col justify-center gap-4">
            <div className="accent-line" aria-hidden />

            {/* px-based fluid size (24px -> 42px) so the heading keeps its designed
                scale regardless of the fluid root font-size */}
            <h1 className="flex flex-col text-[clamp(24px,calc(10px+3vw),42px)] leading-[1.05]">
              {heroLines.map((line, index) => (
                <ScrambleIn
                  key={index}
                  text={line}
                  scrambleSpeed={40}
                  scrambledLetterCount={3}
                />
              ))}
            </h1>
          </div>

          {/* Right Side - Experience */}
          <div className="flex flex-1 flex-col items-end justify-start lg:pt-[2.875rem]">
            <div className="space-y-3 sm:space-y-4">
              {experiences.map((exp, i) => (
                <div
                  key={`${exp.company}-${exp.year}`}
                  className="beat-in group grid grid-cols-[60px_1fr_1fr] gap-3 text-xs leading-tight sm:grid-cols-[80px_1fr_1fr] sm:gap-4 sm:text-[0.8rem]"
                  style={{ animationDelay: `${150 + i * 45}ms` }}
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

        {/* Slot for the field — the canvas behind is clipped to this box */}
        <div
          ref={panelRef}
          role="img"
          aria-label="Generative holographic halftone field"
          className="w-full rounded-lg"
          style={{ aspectRatio: `${1456 / 816}`, maxHeight: "40vh" }}
        />

        {/* Social Links */}
        <div className="beat-in flex justify-end gap-6" style={{ animationDelay: "450ms" }}>
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.name}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={social.name}
              >
                <Icon size={20} />
              </Link>
            );
          })}
        </div>
      </div>

      <TrackPlayer controls={controls} sectionRef={sectionRef} panelRef={panelRef} />
    </section>
  );
}
