import { Skeleton } from "@/components/ui/Skeleton";

export function AnalyticsChartSkeleton() {
  return (
    <div className="min-h-[300px] rounded-2xl border border-border p-6">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-2 h-4 w-64" />
      <Skeleton className="mt-8 h-[220px] w-full" />
    </div>
  );
}
