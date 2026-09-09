"use client";

import { Eye, FileText, Send, TrendingUp } from "lucide-react";

import { StateCard } from "@/features/dashboard/components/StateCard";

const stats = [
  {
    label: "Total Forms",
    value: "24",
    trend: "+3 this month",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: "Total Submissions",
    value: "1,284",
    trend: "+128 this week",
    icon: <Send className="h-4 w-4" />,
  },
  {
    label: "Total Views",
    value: "8.4k",
    trend: "+5.2% this week",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    label: "Conversion Rate",
    value: "15.1%",
    trend: "+2.4% vs last month",
    icon: <TrendingUp className="h-4 w-4" />,
  },
];

export function AnalyticsOverview() {
  return <StateCard compact stats={stats} className="lg:grid-cols-4" />;
}
