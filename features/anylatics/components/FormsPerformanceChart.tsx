"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/Chart";
import { Trophy } from "lucide-react";

const data = [
  { form: "Contact", submissions: 342, views: 2100 },
  { form: "Newsletter", submissions: 891, views: 5400 },
  { form: "Event Reg", submissions: 51, views: 1200 },
  { form: "Feedback", submissions: 128, views: 3400 },
  { form: "Support", submissions: 67, views: 890 },
  { form: "Booking", submissions: 234, views: 1500 },
];

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "var(--chart-1)",
  },
  views: {
    label: "Views",
    color: "var(--chart-3)",
  },
};

export function FormsPerformanceChart() {
  return (
    <Card className="lg:col-span-1 rounded-2xl border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Top Forms</CardTitle>
            <CardDescription>Submissions by form.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              dataKey="form"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              width={70}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="submissions"
              fill="var(--color-submissions)"
              radius={[0, 6, 6, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
