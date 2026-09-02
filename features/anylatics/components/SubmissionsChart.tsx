"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CalendarDays } from "lucide-react";

const weeklyData = [
  { day: "Mon", submissions: 45, views: 120 },
  { day: "Tue", submissions: 62, views: 180 },
  { day: "Wed", submissions: 38, views: 95 },
  { day: "Thu", submissions: 74, views: 210 },
  { day: "Fri", submissions: 56, views: 160 },
  { day: "Sat", submissions: 28, views: 80 },
  { day: "Sun", submissions: 35, views: 100 },
];

const monthlyData = [
  { day: "Jan", submissions: 320, views: 1200 },
  { day: "Feb", submissions: 450, views: 1800 },
  { day: "Mar", submissions: 380, views: 1500 },
  { day: "Apr", submissions: 520, views: 2100 },
  { day: "May", submissions: 480, views: 1900 },
  { day: "Jun", submissions: 610, views: 2400 },
  { day: "Jul", submissions: 540, views: 2200 },
  { day: "Aug", submissions: 620, views: 2600 },
];

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "var(--chart-1)",
  },
  views: {
    label: "Views",
    color: "var(--chart-2)",
  },
};

export function SubmissionsChart() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const data = period === "week" ? weeklyData : monthlyData;

  return (
    <Card className="lg:col-span-2 rounded-2xl border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Submissions Overview</CardTitle>
          <CardDescription>Track form submissions and views over time.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "week" ? "default" : "outline"}
            size="sm"
            className="rounded-xl text-xs h-8"
            onClick={() => setPeriod("week")}
          >
            <CalendarDays className="w-3.5 h-3.5 mr-1" />
            Week
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            size="sm"
            className="rounded-xl text-xs h-8"
            onClick={() => setPeriod("month")}
          >
            <CalendarDays className="w-3.5 h-3.5 mr-1" />
            Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-submissions)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-submissions)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="views"
              type="monotone"
              stroke="var(--color-views)"
              strokeWidth={2}
              fill="url(#fillViews)"
            />
            <Area
              dataKey="submissions"
              type="monotone"
              stroke="var(--color-submissions)"
              strokeWidth={2}
              fill="url(#fillSubmissions)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
