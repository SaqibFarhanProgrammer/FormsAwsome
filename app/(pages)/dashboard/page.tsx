import { getAllFormsService } from "@/core/services/form/forms.service";
import { LazyDashboardSubmissionsTable } from "@/components/lazy/LazyComponents";
import { FormsGrid } from "@/features/dashboard/components/FormsGrid";
import { StateCard } from "@/features/dashboard/components/StateCard";

export default async function DashboardPage() {
  const AllForms: any[] = await getAllFormsService();

  return (
    <>
      <StateCard />
      <FormsGrid forms={AllForms} />
      <LazyDashboardSubmissionsTable />
    </>
  );
}
