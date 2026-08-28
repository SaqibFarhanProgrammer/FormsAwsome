import { AnalyticsClient } from "@/features/anylatics/components/AnalyticsClient";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track form performance, submissions, and user engagement.
          </p>
        </div>
      </div>

      <AnalyticsClient />
    </div>
  );
}
