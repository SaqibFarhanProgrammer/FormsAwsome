import { getAllFormsService } from "@/core/services/Form/Forms.service";
import { FormsGrid } from "@/features/dashboard/components/FormsGrid";
import { StatsCards } from "@/features/dashboard/components/StateCard";
import { SubmissionsTable } from "@/features/dashboard/components/SubmissionsTable";

export default async function DashboardPage() {
  const AllForms: any[] = await getAllFormsService();

  return (
    <>
      <StatsCards />
      <FormsGrid forms={AllForms} />
      <SubmissionsTable />
    </>
  );
}
