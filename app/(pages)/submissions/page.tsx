import { Suspense } from "react";
import { SubmissionsTable } from "@/features/dashboard/components/SubmissionsTable";
import { SubmissionsFilters } from "@/features/submissions/components/SubmissionsFilters";

export default function SubmissionsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <Suspense fallback={<div className="h-10 w-full rounded-xl bg-muted/40" />}>
        <SubmissionsFilters />
      </Suspense>
      <Suspense fallback={<div className="h-64 w-full rounded-xl bg-muted/40" />}>
        <SubmissionsTable />
      </Suspense>
    </div>
  );
}
