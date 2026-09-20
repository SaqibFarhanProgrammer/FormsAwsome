"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

function PanelSkeleton({ className = "min-h-48" }: { className?: string }) {
  return (
    <div className={`space-y-4 rounded-2xl border border-border p-6 ${className}`}>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function ChartSkeleton() {
  return <PanelSkeleton className="min-h-[300px]" />;
}

export const LazyDeviceChart = dynamic(
  () => import("@/features/anylatics/components/DeviceChart").then((module) => module.DeviceChart),
  { loading: ChartSkeleton },
);

export const LazyFormsPerformanceChart = dynamic(
  () =>
    import("@/features/anylatics/components/FormsPerformanceChart").then(
      (module) => module.FormsPerformanceChart,
    ),
  { loading: ChartSkeleton },
);

export const LazySubmissionsChart = dynamic(
  () =>
    import("@/features/anylatics/components/SubmissionsChart").then(
      (module) => module.SubmissionsChart,
    ),
  { loading: ChartSkeleton },
);

export const LazyViewsChart = dynamic(
  () => import("@/features/anylatics/components/ViewsChart").then((module) => module.ViewsChart),
  { loading: ChartSkeleton },
);

export const LazyDashboardSubmissionsTable = dynamic(
  () =>
    import("@/features/dashboard/components/SubmissionsTable").then(
      (module) => module.SubmissionsTable,
    ),
  { loading: () => <PanelSkeleton className="min-h-64" /> },
);

export const LazyProfileHeader = dynamic(
  () =>
    import("@/features/profile/components/ProfileHeader").then((module) => module.ProfileHeader),
  { loading: () => <PanelSkeleton className="min-h-56" /> },
);

export const LazyProfileStats = dynamic(
  () => import("@/features/profile/components/ProfileStats").then((module) => module.ProfileStats),
  { loading: () => <PanelSkeleton className="min-h-32" /> },
);

export const LazyQuickActions = dynamic(
  () => import("@/features/profile/components/QuickActions").then((module) => module.QuickActions),
  { loading: () => <PanelSkeleton className="min-h-40" /> },
);

export const LazyRecentActivity = dynamic(
  () =>
    import("@/features/profile/components/RecentActivity").then((module) => module.RecentActivity),
  { loading: () => <PanelSkeleton className="min-h-64" /> },
);

export const LazySettingsTabs = dynamic(
  () => import("@/features/settings/components/SettingsTabs").then((module) => module.SettingsTabs),
  { loading: () => <PanelSkeleton className="min-h-[420px]" /> },
);
