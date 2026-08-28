import { SubmissionsTable } from "@/features/dashboard/components/SubmissionsTable";
import { SubmissionsFilters } from "@/features/submissions/components/SubmissionsFilters";

export default function SubmissionsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <SubmissionsFilters />
      <SubmissionsTable />
    </div>
  );
}
