"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import GitHubCalendar from "react-github-calendar";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background py-24 sm:py-32 lg:py-40">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 z-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl w-full"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-3 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Albert Zhang
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Software Engineer & Full-Stack Developer
            </motion.p>

            <GitHubCalendar
              colorScheme="light"
              blockSize={15}
              blockMargin={3}
              username="appsicle"
              fontSize={15}
              year={2025}
              showWeekdayLabels={true}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Link href="#projects">
                <motion.button
                  className="group flex items-center gap-3 mx-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View My Work
                  <ArrowDownIcon
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
