"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  trend: string;
  label: string;
  icon?: ReactNode;
}

const defaultStats: StatItem[] = [
  { value: "232", trend: "(420 New)", label: "Total Users" },
  { value: "87", trend: "(31 New)", label: "Total Agents" },
  { value: "22", trend: "(2 New)", label: "Total Categories" },
  { value: "18", trend: "(6 Recent)", label: "Total Articles" },
  { value: "3.8k", trend: "(1237 New)", label: "Total Subscriber" },
];

interface StateCardProps {
  className?: string;
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
  compact?: boolean;
}

export function StateCard({
  className,
  title = "Quick Overview",
  subtitle = "This is all over platform stats generated",
  stats: items = defaultStats,
  compact = false,
}: StateCardProps) {
  if (compact) {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {items.map((stat, index) => (
          <div
            key={stat.label || index}
            className="rounded-2xl border border-border/80 bg-card/80 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-3 p-5">
              <p className="text-lg font-medium text-foreground">{stat.label}</p>

              {stat.icon ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border/70">
                  {stat.icon}
                </div>
              ) : null}
            </div>

            <div className="px-5 pb-5">
              <p className="text-4xl font-black tracking-[-0.06em] text-foreground">{stat.value}</p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border/80 px-5 py-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="inline-block translate-y-[-0.5px]">
                  {stat.trend.startsWith("-") ? "▼" : "▲"}
                </span>
                <span>{stat.trend}</span>
              </div>

              <button className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl -hue-rotate-320 sa overflow-hidden p-6 sm:p-8",
        className,
      )}
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/39/09/8b/39098bb69bdfd0d18a184252b2353079.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent" />

      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      <div className="relative z-10">
        '
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-0.5 text-xs text-white">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((stat) => (
            <div
              key={stat.label}
              className="cursor-default rounded-2xl border border-border bg-background/80 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="rounded-lg bg-muted p-1">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-1">
                <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <svg
                    className="h-3 w-3 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {stat.trend}
                  </span>
                  <span className="text-xs text-muted-foreground">vs Last Week</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  View Details
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { StateCard as StatsCards };
