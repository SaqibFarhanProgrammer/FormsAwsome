"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Send, Eye, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Forms",
    value: "24",
    change: "+3",
    changeLabel: "this month",
    icon: FileText,
    trend: "up" as const,
  },
  {
    label: "Total Submissions",
    value: "1,284",
    change: "+128",
    changeLabel: "this week",
    icon: Send,
    trend: "up" as const,
  },
  {
    label: "Total Views",
    value: "8.4k",
    change: "+5.2%",
    changeLabel: "this week",
    icon: Eye,
    trend: "up" as const,
  },
  {
    label: "Conversion Rate",
    value: "15.1%",
    change: "+2.4%",
    changeLabel: "vs last month",
    icon: TrendingUp,
    trend: "up" as const,
  },
];

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="rounded-2xl border-border">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  {stat.change} {stat.changeLabel}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
