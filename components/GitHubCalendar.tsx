import { memo } from "react";

type Contributions = {
  total: number;
  contributions: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
};

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
        <circle cx="12" cy="12" r="11" fill="#E5D3C9" />
        <circle cx="12" cy="12" r="9" fill="#D4BBA9" />
      </svg>
    );

    const Stage1 = (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#6D4C41" />
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
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#6D4C41" />
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
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#5D4037" />
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
        <circle cx="12" cy="8" r="2.2" fill="#E91E63" />
        <circle cx="12" cy="8" r="1" fill="#F8BBD0" />
      </svg>
    );

    const Stage4 = (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="11" fill="#8D6E63" />
        <circle cx="12" cy="12" r="9" fill="#4E342E" />
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
        <circle cx="12" cy="10" r="2.2" fill="#FFC1E3" />
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

    const stages = [Stage0, Stage1, Stage2, Stage3, Stage4];
    return stages[level] || Stage0;
  }
);

PlantElement.displayName = "PlantElement";

export default function GitHubCalendar({
  contributions,
}: {
  contributions: Contributions | null;
}) {
  if (!contributions?.contributions) {
    return null;
  }

  // Create a grid for the current year
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  // Calculate weeks in the year
  const weeks = [];
  let currentWeek = [];
  const currentDate = new Date(startDate);

  // Start from the first day of the week that contains January 1st
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  while (currentDate <= endDate || currentWeek.length > 0) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    const dateStr = currentDate.toISOString().split("T")[0];
    const contribution = contributions.contributions.find(
      (c) => c.date === dateStr
    );

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

  // Neon Lab grid mapping
  const getPlantStage = (level: number) => {
    const stages = [
      {
        backgroundColor: "rgba(39, 39, 42, 0.5)",
        border: "1px solid rgba(148,163,184,0.25)",
        description: "Idle",
      },
      {
        backgroundColor: "#22d3ee",
        border: "1px solid rgba(34,211,238,0.6)",
        description: "Warm-up",
      },
      {
        backgroundColor: "#34d399",
        border: "1px solid rgba(52,211,153,0.6)",
        description: "Flow",
      },
      {
        backgroundColor: "#a78bfa",
        border: "1px solid rgba(167,139,250,0.6)",
        description: "Surge",
      },
      {
        backgroundColor: "#f472b6",
        border: "1px solid rgba(244,114,182,0.6)",
        description: "Peak",
      },
    ];
    return stages[level] || stages[0];
  };

  // Shadow hues
  const getGardenShadow = (level: number) => {
    const shadows = [
      "rgba(0,0,0,0.25)",
      "rgba(34, 211, 238, 0.35)",
      "rgba(52, 211, 153, 0.35)",
      "rgba(167, 139, 250, 0.35)",
      "rgba(244, 114, 182, 0.4)",
    ];
    return shadows[level] || shadows[0];
  };

  // Default sizes
  const blockSize = 10;
  const legendPlantSize = 30;

  // Calculate stats
  const stats = (() => {
    const days = contributions.contributions;
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
  })();

  return (
    <div className="relative w-full">
      <div className="relative flex w-full flex-col items-center gap-4 p-2 sm:p-8">
        {/* Neon grid */}
        <div className="flex items-start gap-2">
          {/* Week-day labels */}
          <div className="hidden sm:flex mr-1 flex-col gap-1 sm:mr-3 translate-y-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="text-xs font-medium flex items-center justify-center rounded-md p-1"
                  style={{
                    height: blockSize + "px",
                    color: "rgba(148, 163, 184, 0.7)",
                  }}
                >
                  {day.charAt(0)}
                </div>
              )
            )}
          </div>

          {/* Weeks grid */}
          <div
            className="flex-1 rounded-2xl p-2 sm:p-4"
            style={{
              background:
                "linear-gradient(180deg, rgba(24,24,27,0.6), rgba(24,24,27,0.3))",
              boxShadow:
                "inset 0 2px 4px rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          >
            <div className="flex w-full justify-center gap-px sm:gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-px sm:gap-1">
                  {week.map((day) => {
                    const stage = getPlantStage(day.level);
                    return (
                      <div
                        key={day.date}
                        className="rounded-lg relative overflow-hidden cursor-pointer"
                        style={{
                          width: blockSize + "px",
                          height: blockSize + "px",
                          backgroundColor: day.isCurrentYear
                            ? stage.backgroundColor
                            : "rgba(39,39,42, 0.3)",
                          border: day.isCurrentYear
                            ? stage.border
                            : "2px solid rgba(148, 163, 184, 0.2)",
                          boxShadow: day.isCurrentYear
                            ? `0 2px 6px ${getGardenShadow(
                                day.level
                              )}, inset 0 1px 2px rgba(255, 255, 255, 0.3)`
                            : "0 1px 3px rgba(0, 0, 0, 0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: day.isCurrentYear ? 1 : 0.4,
                        }}
                        title={`${day.date}: ${day.count} contributions - ${
                          day.isCurrentYear
                            ? stage.description
                            : "Out of range"
                        }`}
                      >
                        {day.isCurrentYear && (
                          <div className="relative z-10">
                            <PlantElement
                              level={day.level}
                              size={blockSize * 1.5}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <p
          className="self-start mt-3 ml-5 text-xs text-muted-foreground sm:text-sm"
          style={{ paddingLeft: blockSize + 12 }}
        >
          <span>{stats.totalCommits.toLocaleString()}</span> commits so far this
          year · Avg
          <span> {stats.averagePerDay.toFixed(1)}</span>
          /day
        </p>

        {/* Legend */}
        <div
          className="flex flex-col items-center gap-2 mt-6 px-4 py-3 sm:flex-row sm:gap-6 sm:px-6 rounded-xl"
          style={{
            backgroundColor: "rgba(39,39,42, 0.4)",
            border: "1px solid rgba(148,163,184,0.2)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span className="text-xs font-medium" style={{ color: "#5D4037" }}>
            Contribution Levels:
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
                      borderColor: stage.border.match(/#[0-9A-F]{6}/i)?.[0] || "#64748b",
                      boxShadow: `0 2px 4px ${getGardenShadow(level)}`,
                    }}
                    title={stage.description}
                  >
                    <PlantElement level={level} size={legendPlantSize} />
                  </div>
                  <span
                    className="text-center"
                    style={{ color: "#94a3b8", fontSize: "10px" }}
                  >
                    {level === 0
                      ? "Idle"
                      : level === 1
                      ? "Warm"
                      : level === 2
                      ? "Flow"
                      : level === 3
                      ? "Surge"
                      : "Peak"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}