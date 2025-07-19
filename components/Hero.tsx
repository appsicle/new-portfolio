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
      {/* Extended nature-inspired background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 opacity-70"></div>
      <div
        className="absolute inset-0"
        style={{
          background: `
          radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(74, 144, 226, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.08) 0%, transparent 70%),
          radial-gradient(circle at 10% 80%, rgba(255, 193, 7, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 90% 20%, rgba(139, 69, 19, 0.06) 0%, transparent 50%)
        `,
        }}
      ></div>

      {/* Additional organic texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
          radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
          radial-gradient(circle at 85% 75%, rgba(76, 175, 80, 0.02) 1px, transparent 1px),
          radial-gradient(circle at 45% 60%, rgba(74, 144, 226, 0.02) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px, 80px 80px, 100px 100px",
        }}
      ></div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 z-10 relative">
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
              Software Engineer & Full-Stack Developer
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