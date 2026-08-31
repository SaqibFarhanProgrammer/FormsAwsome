import { FormsGrid } from "@/features/dashboard/components/FormsGrid";
import { StatsCards } from "@/features/dashboard/components/StateCard";
import { SubmissionsTable } from "@/features/dashboard/components/SubmissionsTable";

export default async function DashboardPage() {
  return (
    <>
      <StatsCards />
      <FormsGrid />
      <SubmissionsTable />
    </>
  );
}
