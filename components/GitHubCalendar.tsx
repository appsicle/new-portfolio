"use client";

import clsx from "clsx";
import { useMemo } from "react";

type Contributions = {
  total: number;
  contributions: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
};

type DayData = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  isCurrentYear: boolean;
  dayOfWeek: number;
};

const levelPalette = [
  "hsl(30 10% 88%)",
  "hsl(25 12% 65%)",
  "hsl(20 15% 45%)",
  "hsl(15 18% 30%)",
  "hsl(0 0% 20%)",
];

const levelLabels = ["None", "Low", "Medium", "High", "Very High"];

export default function GitHubCalendar({
  contributions,
}: {
  contributions: Contributions | null;
}) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const weeks = useMemo((): DayData[][] => {
    if (!contributions?.contributions) return [];

    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    const data: DayData[][] = [];
    const cursor = new Date(startDate);
    cursor.setDate(cursor.getDate() - cursor.getDay());
    let currentWeek: DayData[] = [];

    while (cursor <= endDate || currentWeek.length) {
      if (currentWeek.length === 7) {
        data.push(currentWeek);
        currentWeek = [];
      }

      const dateKey = cursor.toISOString().split("T")[0];
      const record = contributions.contributions.find((entry) => entry.date === dateKey);

      currentWeek.push({
        date: dateKey,
        count: record?.count ?? 0,
        level: record?.level ?? 0,
        isCurrentYear: cursor.getFullYear() === currentYear,
        dayOfWeek: cursor.getDay(),
      });

      cursor.setDate(cursor.getDate() + 1);

      if (cursor > endDate && currentWeek.length === 7) {
        data.push(currentWeek);
        currentWeek = [];
      }
    }

    return data;
  }, [contributions, currentYear]);

  const stats = useMemo(() => {
    if (!contributions?.contributions) return null;

    const days = contributions.contributions;
    const totalCommits = days.reduce((sum, day) => sum + day.count, 0);

    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysElapsed = Math.floor((today.getTime() - startOfYear.getTime()) / 86_400_000) + 1;
    const averagePerDay = totalCommits / daysElapsed;

    const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
    let longestStreak = 0;
    let running = 0;
    for (const day of sortedDays) {
      if (day.count > 0) {
        running += 1;
        longestStreak = Math.max(longestStreak, running);
      } else {
        running = 0;
      }
    }

    let currentStreak = 0;
    for (let index = sortedDays.length - 1; index >= 0; index -= 1) {
      if (sortedDays[index].count > 0) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    return { totalCommits, averagePerDay, longestStreak, currentStreak };
  }, [contributions]);

  if (!contributions?.contributions || !weeks.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
          <span>{stats.totalCommits.toLocaleString()} commits this year</span>
          <span>avg {stats.averagePerDay.toFixed(1)}/day</span>
          <span>current streak {stats.currentStreak}</span>
          <span>longest streak {stats.longestStreak}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3 overflow-x-auto pb-2">
          <div className="hidden sm:flex flex-col gap-1 pt-5 text-[0.65rem] tracking-[0.25em] text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="h-6 leading-6 text-center">
                {day.charAt(0)}
              </span>
            ))}
          </div>
          <div className="flex flex-1 gap-1.5">
            {weeks.map((week: DayData[], index: number) => (
              <div key={index} className="flex flex-col gap-1.5">
                {week.map((day: DayData) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} contributions`}
                    className={clsx("h-6 w-6 rounded-sm", {
                      "opacity-40": !day.isCurrentYear,
                    })}
                    style={{
                      backgroundColor: day.isCurrentYear
                        ? levelPalette[day.level]
                        : "transparent",
                      border: day.isCurrentYear ? "none" : "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className="h-3 w-3"
                style={{ backgroundColor: levelPalette[level] }}
                title={levelLabels[level]}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
