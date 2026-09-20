"use client";

import dynamic from "next/dynamic";

import { AnalyticsOverview } from "./AnalyticsOverview";
import { AnalyticsChartSkeleton } from "./AnalyticsChartSkeleton";

const DeviceChart = dynamic(() => import("./DeviceChart").then((module) => module.DeviceChart), {
  loading: () => <AnalyticsChartSkeleton />,
});
const FormsPerformanceChart = dynamic(
  () => import("./FormsPerformanceChart").then((module) => module.FormsPerformanceChart),
  { loading: () => <AnalyticsChartSkeleton /> },
);
const SubmissionsChart = dynamic(
  () => import("./SubmissionsChart").then((module) => module.SubmissionsChart),
  { loading: () => <AnalyticsChartSkeleton /> },
);
const ViewsChart = dynamic(() => import("./ViewsChart").then((module) => module.ViewsChart), {
  loading: () => <AnalyticsChartSkeleton />,
});

export function AnalyticsClient() {
  return (
    <div className="space-y-6">
      {/* KPI Overview Cards */}
      <AnalyticsOverview />

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SubmissionsChart />
        <FormsPerformanceChart />
      </div>

      {/* Secondary Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DeviceChart />
        <ViewsChart />
      </div>
    </div>
  );
}
