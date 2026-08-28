"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Eye } from "lucide-react";

const data = [
  { time: "00:00", views: 12 },
  { time: "04:00", views: 8 },
  { time: "08:00", views: 45 },
  { time: "12:00", views: 78 },
  { time: "16:00", views: 65 },
  { time: "20:00", views: 92 },
  { time: "23:59", views: 34 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
};

export function ViewsChart() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Views Today</CardTitle>
            <CardDescription>Hourly view activity.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="time"
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
            <Line
              dataKey="views"
              type="monotone"
              stroke="var(--color-views)"
              strokeWidth={2.5}
              dot={{
                fill: "var(--color-views)",
                strokeWidth: 2,
                r: 4,
                stroke: "var(--background)",
              }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
