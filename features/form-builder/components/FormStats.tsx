"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Eye, TrendingUp, Clock, CalendarDays } from "lucide-react";

const THEME = { primary: "#432DD7", secondary: "#6B5BFF" };

interface FormStatsProps {
  stats: {
    totalSubmissions: number;
    totalViews: number;
    conversionRate: number;
    avgTime: string;
    lastSubmission: string;
    todaySubmissions: number;
    weekSubmissions: number;
  };
}

export function FormStats({ stats }: FormStatsProps) {
  const items = [
    { icon: Send, label: "Total Submissions", value: stats.totalSubmissions.toLocaleString(), color: THEME.primary },
    { icon: Eye, label: "Total Views", value: stats.totalViews.toLocaleString(), color: THEME.secondary },
    { icon: TrendingUp, label: "Conversion Rate", value: `${stats.conversionRate}%`, color: "#10b981" },
    { icon: Clock, label: "Avg. Time", value: stats.avgTime, color: "#f59e0b" },
    { icon: CalendarDays, label: "Today", value: `+${stats.todaySubmissions}`, color: "#6366f1" },
    { icon: CalendarDays, label: "This Week", value: `+${stats.weekSubmissions}`, color: "#8b5cf6" },
  ];

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Form Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                >
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}