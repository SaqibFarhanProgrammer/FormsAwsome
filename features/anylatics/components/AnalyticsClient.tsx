"use client";

import { AnalyticsOverview } from "./AnalyticsOverview";
import {
  LazyDeviceChart,
  LazyFormsPerformanceChart,
  LazySubmissionsChart,
  LazyViewsChart,
} from "@/components/lazy/LazyComponents";

export function AnalyticsClient() {
  return (
    <div className="space-y-6">
      <AnalyticsOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <LazySubmissionsChart />
        <LazyFormsPerformanceChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LazyDeviceChart />
        <LazyViewsChart />
      </div>
    </div>
  );
}
