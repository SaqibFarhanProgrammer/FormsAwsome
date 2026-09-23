import { getAllFormsService, getDashboardStatsService } from "@/core/services/form/forms.service";
import { LazyDashboardSubmissionsTable } from "@/components/lazy/LazyComponents";
import { FormsGrid } from "@/features/dashboard/components/FormsGrid";
import { StateCard } from "@/features/dashboard/components/StateCard";

export default async function DashboardPage() {
  const [allForms, stats] = await Promise.all([getAllFormsService(), getDashboardStatsService()]);

  return (
    <>
      <StateCard
        stats={[
          { label: "Total Forms", value: stats.totalForms.toLocaleString(), trend: "Owned" },
          {
            label: "Total Submissions",
            value: stats.totalSubmissions.toLocaleString(),
            trend: "All time",
          },
          {
            label: "Today's Submissions",
            value: stats.todaySubmissions.toLocaleString(),
            trend: "Today",
          },
          { label: "Total Views", value: stats.totalViews.toLocaleString(), trend: "All time" },
          {
            label: "Views Last Month",
            value: stats.lastMonthViews.toLocaleString(),
            trend: "Previous month",
          },
        ]}
      />
      <FormsGrid forms={allForms} />
      <LazyDashboardSubmissionsTable />
    </>
  );
}
