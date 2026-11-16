"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { eachDayOfInterval, format, parseISO, subDays } from "date-fns";
import { Github01Icon, Moon02Icon, Pulse01Icon } from "hugeicons-react";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  type Activity,
} from "@/components/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";
import { GH_FILL, fmtHours, stressLabel, type Contribution, type Night } from "./types";

const WEEKS = 53;
const GAP = 4;

// GitHub's green for contributions, WHOOP's official Sleep color for sleep.
const TONE = {
  github: "text-[#1a7f37] dark:text-[#3fb950]",
  sleep: "text-[#7BA1BB]",
  stress: "text-[#bc4c00] dark:text-[#f0883e]",
};

type Hover = { date: string; x: number; y: number };

function TipRow({ icon: Icon, tone, children }: { icon: typeof Github01Icon; tone?: string; children: React.ReactNode }) {
  return (
    <span className={cn("flex items-center gap-2 tabular-nums", tone ?? "text-muted-foreground")}>
      <Icon size={14} className="shrink-0" />
      {children}
    </span>
  );
}

export default function SleepGraph({
  nights,
  contributions,
  totalContributions,
  end,
}: {
  nights: Night[];
  contributions: Contribution[];
  totalContributions: number;
  end: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [blockSize, setBlockSize] = useState(12);
  const [hover, setHover] = useState<Hover | null>(null);

  const nightBy = useMemo(() => new Map(nights.map((n) => [n.date, n])), [nights]);
  const ghBy = useMemo(() => new Map(contributions.map((c) => [c.date, c])), [contributions]);

  // One square per day, over the same span as GitHub's own calendar, shaded by contributions.
  const data: Activity[] = useMemo(() => {
    const last = parseISO(end);
    const first = contributions[0] ? parseISO(contributions[0].date) : subDays(last, 364);
    return eachDayOfInterval({ start: first, end: last }).map((d) => {
      const date = format(d, "yyyy-MM-dd");
      const c = ghBy.get(date);
      return { date, count: c?.count ?? 0, level: c?.level ?? 0 };
    });
  }, [ghBy, contributions, end]);

  // Size the squares so the whole year fits the column; narrow screens scroll to the latest weeks.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => {
      const parent = el.parentElement ?? el;
      const cs = getComputedStyle(parent);
      const w = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setBlockSize(Math.max(9, Math.min(15, Math.floor((w + GAP) / WEEKS - GAP))));
      requestAnimationFrame(() => {
        const scroller = el.querySelector<HTMLElement>("[data-graph-scroll]");
        if (scroller) scroller.scrollLeft = scroller.scrollWidth;
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  const radius = Math.max(2, Math.round(blockSize / 4));
  const show = (date: string, target: Element) => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    const r = target.getBoundingClientRect();
    // Keep the card inside the column near either edge.
    const x = Math.min(box.width - 120, Math.max(120, r.left - box.left + r.width / 2));
    setHover({ date, x, y: r.top - box.top });
  };

  const night = hover ? nightBy.get(hover.date) : undefined;
  const gh = hover ? ghBy.get(hover.date) : undefined;

  return (
    <div ref={wrapRef} className="relative w-full max-w-max">
      <ContributionGraph
        data={data}
        blockSize={blockSize}
        blockMargin={GAP}
        blockRadius={radius}
        fontSize={12}
        totalCount={totalContributions}
        className="beat-in mx-auto gap-4"
        onMouseLeave={() => setHover(null)}
      >
        <ContributionGraphCalendar
          data-graph-scroll=""
          className="pb-2 text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_title]:hidden"
        >
          {({ activity, dayIndex, weekIndex }) => (
            <ContributionGraphBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
              tabIndex={0}
              aria-label={`${format(parseISO(activity.date), "MMMM d")}: ${activity.count} ${
                activity.count === 1 ? "contribution" : "contributions"
              }`}
              className={cn(
                "outline-none transition-transform duration-200 [transform-box:fill-box] [transform-origin:center] hover:scale-[1.2] focus-visible:scale-[1.2]",
                GH_FILL[activity.level]
              )}
              onMouseEnter={(e) => show(activity.date, e.currentTarget)}
              onFocus={(e) => show(activity.date, e.currentTarget)}
              onBlur={() => setHover(null)}
            />
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="items-center gap-y-2 text-xs text-muted-foreground">
          <span>{totalContributions.toLocaleString()} contributions in the last year</span>
          <div className="ml-auto flex items-center gap-[3px]">
            <span className="mr-2">Less</span>
            {GH_FILL.map((fill) => (
              <svg key={fill} width={blockSize} height={blockSize} aria-hidden>
                <rect width={blockSize} height={blockSize} rx={radius} className={fill} />
              </svg>
            ))}
            <span className="ml-2">More</span>
          </div>
        </ContributionGraphFooter>
      </ContributionGraph>

      {/* Hover card: contributions, sleep and stress for that day */}
      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
          style={{ left: hover.x, top: hover.y - 10 }}
        >
          <motion.div
            key={hover.date}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14 }}
            className="flex flex-col gap-1.5 whitespace-nowrap rounded-xl border bg-background/90 px-3.5 py-3 text-xs leading-snug shadow-[0_8px_30px_rgb(0_0_0/0.18)] backdrop-blur"
          >
            <span className="mb-0.5 text-muted-foreground">{format(parseISO(hover.date), "EEE, MMM d")}</span>
            <TipRow icon={Github01Icon} tone={gh?.count ? TONE.github : undefined}>
              {gh?.count ?? 0} {gh?.count === 1 ? "contribution" : "contributions"}
            </TipRow>
            <TipRow icon={Moon02Icon} tone={night ? TONE.sleep : undefined}>
              {night ? `${fmtHours(night.sleep)} sleep` : "No sleep data"}
            </TipRow>
            <TipRow icon={Pulse01Icon} tone={night?.stress != null ? TONE.stress : undefined}>
              {night?.stress != null
                ? `${night.stress.toFixed(1)} / 3 stress · ${stressLabel(night.stress).toLowerCase()}`
                : "No stress data"}
            </TipRow>
          </motion.div>
        </div>
      )}
    </div>
  );
}
