"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon, Github } from "lucide-react";
import Link from "next/link";
import useResponsiveValue from "@/lib/hooks/useResponsiveValue";
import { memo, useMemo, useState } from "react";

type Contributions = {
  total: number;
  contributions: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
};

// PlantElement now renders lightweight SVGs for every growth stage.
// Using SVGs dramatically cuts the DOM node count and keeps visuals
// perfectly crisp at any resolution.
const PlantElement = memo(
  ({ level, size }: { level: number; size: number }) => {
    const dimension = Math.max(size * 0.9, 6);

    const svgProps = {
      width: dimension,
      height: dimension,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    };

    const Stage0 = (
      <svg {...svgProps} style={{ opacity: 0.9 }}>
        {/* Pot rim */}
        <circle cx="12" cy="12" r="11" fill="#E5D3C9" />
        {/* Soil */}
        <circle cx="12" cy="12" r="9" fill="#D4BBA9" />
      </svg>
    );

    const Stage1 = (
      <svg {...svgProps}>
        {/* Pot */}
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#6D4C41" />
        {/* Sprout */}
        <g transform="translate(12 11)">
          <ellipse
            cx="-2"
            cy="-2"
            rx="2.2"
            ry="1.2"
            fill="#66BB6A"
            transform="rotate(-35)"
          />
          <ellipse
            cx="2"
            cy="-2"
            rx="2.2"
            ry="1.2"
            fill="#66BB6A"
            transform="rotate(35)"
          />
        </g>
      </svg>
    );

    const Stage2 = (
      <svg {...svgProps}>
        {/* Pot */}
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#6D4C41" />
        {/* Growing Leaves */}
        <g transform="translate(12 10)">
          <ellipse
            cx="-3"
            cy="0"
            rx="3"
            ry="1.6"
            fill="#81C784"
            transform="rotate(-40)"
          />
          <ellipse
            cx="3"
            cy="0"
            rx="3"
            ry="1.6"
            fill="#81C784"
            transform="rotate(40)"
          />
          <ellipse cx="0" cy="-3" rx="2.5" ry="1.3" fill="#66BB6A" />
        </g>
      </svg>
    );

    const Stage3 = (
      <svg {...svgProps}>
        {/* Pot */}
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#5D4037" />
        {/* Leaves */}
        <g transform="translate(12 10)">
          <ellipse
            cx="-3.5"
            cy="0.5"
            rx="3"
            ry="1.6"
            fill="#66BB6A"
            transform="rotate(-45)"
          />
          <ellipse
            cx="3.5"
            cy="0.5"
            rx="3"
            ry="1.6"
            fill="#66BB6A"
            transform="rotate(45)"
          />
          <ellipse cx="0" cy="-3" rx="2.8" ry="1.4" fill="#4CAF50" />
        </g>
        {/* Bud */}
        <circle cx="12" cy="8" r="2.2" fill="#E91E63" />
        <circle cx="12" cy="8" r="1" fill="#F8BBD0" />
      </svg>
    );

    const Stage4 = (
      <svg {...svgProps}>
        {/* Pot */}
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#4E342E" />
        {/* Petals */}
        <ellipse cx="12" cy="5" rx="3" ry="1.6" fill="#F06292" />
        <ellipse
          cx="17"
          cy="8"
          rx="3"
          ry="1.6"
          fill="#F06292"
          transform="rotate(72 17 8)"
        />
        <ellipse
          cx="15"
          cy="15"
          rx="3"
          ry="1.6"
          fill="#F06292"
          transform="rotate(144 15 15)"
        />
        <ellipse
          cx="9"
          cy="15"
          rx="3"
          ry="1.6"
          fill="#F06292"
          transform="rotate(216 9 15)"
        />
        <ellipse
          cx="7"
          cy="8"
          rx="3"
          ry="1.6"
          fill="#F06292"
          transform="rotate(288 7 8)"
        />
        {/* Center */}
        <circle cx="12" cy="10" r="2.2" fill="#FFC1E3" />
        {/* Sparkle */}
        <g transform="translate(18 6) rotate(15)">
          <line
            x1="-1.2"
            y1="0"
            x2="1.2"
            y2="0"
            stroke="#FFD700"
            strokeWidth="0.6"
          />
          <line
            x1="0"
            y1="-1.2"
            x2="0"
            y2="1.2"
            stroke="#FFD700"
            strokeWidth="0.6"
          />
        </g>
      </svg>
    );

    // A tiny array lookup keeps this extremely fast.
    const stages = [Stage0, Stage1, Stage2, Stage3, Stage4];
    return stages[level] || Stage0;
  }
);

PlantElement.displayName = "PlantElement";

// Memoized Calendar Day Component
const CalendarDay = memo(
  ({
    day,
    cellIndex,
    blockSize,
    getPlantStage,
    getGardenShadow,
    dimmed,
  }: {
    day: any;
    cellIndex: number;
    blockSize: number;
    getPlantStage: (level: number) => any;
    getGardenShadow: (level: number) => string;
    dimmed: boolean;
  }) => {
    const stage = getPlantStage(day.level);

    return (
      <motion.div
        key={day.date}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: day.isCurrentYear ? (dimmed ? 0.2 : 1) : 0.4,
          scale: 1,
        }}
        transition={{
          duration: 0.2,
          delay: cellIndex * 0.003, // Reduced delay for better performance
          ease: "easeOut",
        }}
        className="rounded-lg relative overflow-hidden cursor-pointer"
        style={{
          width: blockSize + "px",
          height: blockSize + "px",
          backgroundColor: day.isCurrentYear
            ? stage.backgroundColor
            : "rgba(141, 110, 99, 0.3)",
          border: day.isCurrentYear
            ? stage.border
            : "2px solid rgba(109, 76, 65, 0.3)",
          boxShadow: day.isCurrentYear
            ? `0 2px 6px ${getGardenShadow(
                day.level
              )}, inset 0 1px 2px rgba(255, 255, 255, 0.3)`
            : "0 1px 3px rgba(109, 76, 65, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title={`${day.date}: ${day.count} contributions - ${
          day.isCurrentYear ? stage.description : "Dormant season"
        }`}
        whileHover={{
          scale: 1.1,
          y: -1,
          transition: {
            duration: 0,
          },
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 },
        }}
      >
        {/* Optimized plant content */}
        {day.isCurrentYear && (
          <motion.div
            className="relative z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: cellIndex * 0.003 + 0.1,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <PlantElement level={day.level} size={blockSize * 1.5} />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

CalendarDay.displayName = "CalendarDay";

// Custom Calendar Component with Performance Optimizations
const AnimatedGitHubCalendar = memo(
  ({ contributions }: { contributions: any[] }) => {
    // Smaller cells on very small viewports to ensure the calendar fits
    const blockSize = useResponsiveValue({ base: 4, sm: 6, md: 10, lg: 12 }, 4);
    const legendPlantSize = useResponsiveValue({ base: 22, sm: 30 }, 22);

    // Memoize expensive calculations
    const { weeks, getPlantStage, getGardenShadow } = useMemo(() => {
      // Create a grid for the current year
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, 0, 1);
      const endDate = new Date(currentYear, 11, 31);

      // Calculate weeks in the year
      const weeks = [];
      let currentWeek = [];
      let currentDate = new Date(startDate);

      // Start from the first day of the week that contains January 1st
      currentDate.setDate(currentDate.getDate() - currentDate.getDay());

      while (currentDate <= endDate || currentWeek.length > 0) {
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }

        const dateStr = currentDate.toISOString().split("T")[0];
        const contribution = contributions.find((c) => c.date === dateStr);

        currentWeek.push({
          date: dateStr,
          count: contribution?.count || 0,
          level: contribution?.level || 0,
          isCurrentYear: currentDate.getFullYear() === currentYear,
          month: currentDate.getMonth(),
          dayOfWeek: currentDate.getDay(),
        });

        currentDate.setDate(currentDate.getDate() + 1);

        if (currentDate > endDate && currentWeek.length === 7) {
          weeks.push(currentWeek);
          break;
        }
      }

      // Studio Ghibli Garden-inspired color and styling mapping
      const getPlantStage = (level: number) => {
        const stages = [
          {
            backgroundColor: "rgba(141, 110, 99, 0.4)",
            border: "1px solid #6D4C41",
            description: "Empty pot, ready for planting",
          },
          {
            backgroundColor: "#A5D6A7",
            border: "1px solid #66BB6A",
            description: "A tiny sprout emerges",
          },
          {
            backgroundColor: "#81C784",
            border: "1px solid #4CAF50",
            description: "Growing leaves and stem",
          },
          {
            backgroundColor: "#66BB6A",
            border: "1px solid #43A047",
            description: "Beautiful flower blooms",
          },
          {
            backgroundColor: "#4CAF50",
            border: "1px solid #2E7D32",
            description: "Magnificent full bloom!",
          },
        ];
        return stages[level] || stages[0];
      };

      // Get shadow color for garden depth
      const getGardenShadow = (level: number) => {
        const shadows = [
          "rgba(109, 76, 65, 0.3)",
          "rgba(76, 175, 80, 0.2)",
          "rgba(76, 175, 80, 0.3)",
          "rgba(67, 160, 71, 0.4)",
          "rgba(46, 125, 50, 0.5)",
        ];
        return shadows[level] || shadows[0];
      };

      return { weeks, getPlantStage, getGardenShadow };
    }, [contributions]);

    // ------------------- filter state --------------------
    const [filterMonth, setFilterMonth] = useState<number | null>(null);
    const [filterDay, setFilterDay] = useState<number | null>(null);

    const toggleMonth = (idx: number) =>
      setFilterMonth((prev) => (prev === idx ? null : idx));
    const toggleDay = (idx: number) =>
      setFilterDay((prev) => (prev === idx ? null : idx));

    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // ------------------- contribution stats -------------------
    const stats = useMemo(() => {
      if (!contributions?.length) return null;

      const days = contributions;

      const totalCommits = days.reduce((sum, d) => sum + d.count, 0);

      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const daysElapsed =
        Math.floor((today.getTime() - startOfYear.getTime()) / 86_400_000) + 1;

      const averagePerDay = totalCommits / daysElapsed;

      const maxCommitsDay = Math.max(...days.map((d) => d.count));

      const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

      let longestStreak = 0;
      let current = 0;
      for (const day of sortedDays) {
        if (day.count > 0) {
          current += 1;
          longestStreak = Math.max(longestStreak, current);
        } else {
          current = 0;
        }
      }

      let currentStreak = 0;
      for (let i = sortedDays.length - 1; i >= 0; i--) {
        if (sortedDays[i].count > 0) {
          currentStreak += 1;
        } else {
          break;
        }
      }

      return {
        totalCommits,
        averagePerDay,
        maxCommitsDay,
        currentStreak,
        longestStreak,
      };
    }, [contributions]);

    return (
      <div className="relative w-full">
        <div className="relative flex w-full flex-col items-center gap-4 p-2 sm:p-8">
          {/* ------------- Month filter buttons ------------- */}
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {monthLabels.map((month, index) => {
              const active = filterMonth === index;
              return (
                <motion.button
                  type="button"
                  key={month}
                  onClick={() => toggleMonth(index)}
                  className="text-center rounded-lg px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium focus:outline-none"
                  style={{
                    color: active ? "#fff" : "#5D4037",
                    backgroundColor: active
                      ? "rgba(93, 64, 55, 0.9)"
                      : "rgba(121, 85, 72, 0.15)",
                    textShadow: "0 1px 2px rgba(93, 64, 55, 0.1)",
                    backdropFilter: "blur(4px)",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  {month}
                </motion.button>
              );
            })}
          </div>

          {/* Calendar grid with nature aesthetic */}
          <div className="flex items-start gap-2">
            {/* ---------- Week-day filter buttons ----------- */}
            <div className="hidden sm:flex mr-1 flex-col gap-1 sm:mr-3 translate-y-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => {
                  const active = filterDay === index;
                  return (
                    <motion.button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(index)}
                      className="text-xs font-medium flex items-center justify-center rounded-md p-1 focus:outline-none"
                      style={{
                        height: blockSize + "px",
                        color: active
                          ? "rgba(31, 36, 171, 0.9)"
                          : "rgba(31, 36, 171, 0.5)",
                        textShadow: "0 1px 2px rgba(25, 118, 210, 0.1)",
                        backdropFilter: "blur(4px)",
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                    >
                      {day.charAt(0)}
                    </motion.button>
                  );
                }
              )}
            </div>

            {/* Weeks grid with enhanced nature styling */}
            <div
              className="flex-1 rounded-2xl p-2 sm:p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 248, 225, 0.85), rgba(245, 245, 220, 0.7))",
                boxShadow:
                  "inset 0 2px 4px rgba(139, 69, 19, 0.1), 0 4px 12px rgba(139, 69, 19, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(139, 69, 19, 0.15)",
              }}
            >
              <div className="flex w-full justify-center gap-px sm:gap-1">
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-px sm:gap-1"
                  >
                    {week.map((day, dayIndex) => {
                      const cellIndex = weekIndex * 7 + dayIndex;
                      const dimmed =
                        (filterMonth !== null && day.month !== filterMonth) ||
                        (filterDay !== null && day.dayOfWeek !== filterDay);
                      return (
                        <CalendarDay
                          key={day.date}
                          day={day}
                          cellIndex={cellIndex}
                          blockSize={blockSize || 4}
                          getPlantStage={getPlantStage}
                          getGardenShadow={getGardenShadow}
                          dimmed={dimmed}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contribution stats subtext */}
          {stats && (
            <motion.p
              className="self-start mt-3 ml-5 text-xs text-muted-foreground sm:text-sm"
              style={{ paddingLeft: (blockSize || 4) + 12 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              <span>{stats.totalCommits.toLocaleString()}</span> commits so far
              this year · Avg
              <span> {stats.averagePerDay.toFixed(1)}</span>
              /day
            </motion.p>
          )}

          {/* Simplified garden progression legend */}
          <motion.div
            className="flex flex-col items-center gap-2 mt-6 px-4 py-3 sm:flex-row sm:gap-6 sm:px-6 rounded-xl"
            style={{
              backgroundColor: "rgba(139, 69, 19, 0.08)",
              border: "1px solid rgba(139, 69, 19, 0.15)",
              backdropFilter: "blur(6px)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <span className="text-xs font-medium" style={{ color: "#5D4037" }}>
              Github Garden:
            </span>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((level) => {
                const stage = getPlantStage(level);
                return (
                  <div key={level} className="flex flex-col items-center gap-1">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-sm border flex items-center justify-center relative"
                      style={{
                        backgroundColor: stage.backgroundColor,
                        borderColor:
                          stage.border.match(/#[0-9A-F]{6}/i)?.[0] || "#6D4C41",
                        boxShadow: `0 2px 4px ${getGardenShadow(level)}`,
                      }}
                      title={stage.description}
                    >
                      <PlantElement
                        level={level}
                        size={legendPlantSize || 22}
                      />
                    </div>
                    <span
                      className="text-center"
                      style={{ color: "#5D4037", fontSize: "10px" }}
                    >
                      {level === 0
                        ? "Empty"
                        : level === 1
                        ? "Sprout"
                        : level === 2
                        ? "Growing"
                        : level === 3
                        ? "Blooming"
                        : "Full Bloom"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
);

AnimatedGitHubCalendar.displayName = "AnimatedGitHubCalendar";

export default function Hero({
  contributions,
}: {
  contributions: Contributions | null;
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
              {contributions?.contributions && (
                <AnimatedGitHubCalendar
                  contributions={contributions.contributions}
                />
              )}
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
