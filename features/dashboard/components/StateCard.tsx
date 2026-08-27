"use client";

import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  trend: string;
  label: string;
}

const stats: StatItem[] = [
  { value: "232", trend: "(420 New)", label: "Total Users" },
  { value: "87", trend: "(31 New)", label: "Total Agents" },
  { value: "22", trend: "(2 New)", label: "Total Categories" },
  { value: "18", trend: "(6 Recent)", label: "Total Articles" },
  { value: "3.8k", trend: "(1237 New)", label: "Total Subscriber" },
];

interface StatsCardsProps {
  className?: string;
}

export function StatsCards({ className }: StatsCardsProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl -hue-rotate-320 sa overflow-hidden p-6 sm:p-8",
        className,
      )}
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/1a/94/a7/1a94a7d985a92ef368a251b90fabcc96.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      <div className="relative z-10">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">Quick Overview</h2>
          <p className="text-xs text-white mt-0.5">This is all over platform stats generated</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/50 bg-white  p-4 shadow-lg hover:shadow-xl transition-all  cursor-default"
            >
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] font-medium text-emerald-600">{stat.trend}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
