"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";

type Contributions = {
  total: number;
  contributions: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
};

export default function Hero({
  contributions,
  children,
}: {
  contributions: Contributions | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Neon motion background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 animate-gradient-xy"
          style={{
            background:
              "radial-gradient(1200px 800px at 10% -10%, rgba(120,119,198,0.25) 0%, transparent 60%), radial-gradient(1000px 700px at 110% 20%, rgba(56,189,248,0.25) 0%, transparent 55%), radial-gradient(800px 600px at 30% 120%, rgba(34,197,94,0.2) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 60px)",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 z-10 relative">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl w-full"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-3 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Albert Zhang
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Software Engineer · Full‑Stack · Video/AI
            </motion.p>
            <motion.p
              className="text-xs sm:text-sm text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Everytime there is a new AI model, I ask it to rebuild this
              however it feels like. Currently: GPT-5
            </motion.p>
            <motion.div
              className="min-h-[120px] flex justify-center items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: contributions?.contributions ? 1 : 0,
                y: 0,
              }}
              transition={{ duration: 1.5, delay: 0.6 }}
            >
              {children}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
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
