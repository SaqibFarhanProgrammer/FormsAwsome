"use client";

import { AnalyticsOverview } from "./AnalyticsOverview";
import { DeviceChart } from "./DeviceChart";
import { FormsPerformanceChart } from "./FormsPerformanceChart";
import { SubmissionsChart } from "./SubmissionsChart";
import { ViewsChart } from "./ViewsChart";

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
