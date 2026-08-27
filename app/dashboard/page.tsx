import { FormsGrid } from "@/features/dashboard/components/FormsGrid";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { StatsCards } from "@/features/dashboard/components/StateCard";
import { SubmissionsTable } from "@/features/dashboard/components/SubmissionsTable";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <StatsCards />
      <FormsGrid />
      <SubmissionsTable />
    </DashboardShell>
  );
}
