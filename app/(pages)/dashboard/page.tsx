import { FormsGrid } from "@/features/dashboard/components/FormsGrid";
import { StatsCards } from "@/features/dashboard/components/StateCard";
import { SubmissionsTable } from "@/features/dashboard/components/SubmissionsTable";

export default function DashboardPage() {
  return (
    <>
      <StatsCards />
      <FormsGrid />
      <SubmissionsTable />
    </>
  );
}
