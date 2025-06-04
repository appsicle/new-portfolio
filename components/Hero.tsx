"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import GitHubCalendar from "react-github-calendar";

const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "SQL",
  "Python",
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-background py-24 sm:py-32 lg:py-40"
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 z-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block"
            >
              <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
                Software Engineer
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-8 md:mb-10 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Albert Zhang
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <Badge variant="outline" className="px-3 py-1 text-xs">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
            <div className="mb-12 flex justify-center">
              <GitHubCalendar
                colorScheme="dark" // Consider changing to "light" if preferred for minimalist
                blockSize={10}
                username="appsicle"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Link href="#projects">
                <motion.button
                  className="flex items-center gap-2 mx-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium"
                  // Using Button component from ui/button would be more consistent
                  // For now, direct styling is applied as per instructions for this file
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work
                  <ArrowDownIcon size={16} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
