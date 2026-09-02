import { getAllFormsService } from "@/core/services/Form/Forms.service";
import { FormsClient } from "@/features/forms/components/FormsClient";

export default async function FormsPage() {
  const AllForms: any[] = await getAllFormsService();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Forms</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your forms in one place.
          </p>
        </div>
      </div>
      <FormsClient forms={AllForms} />
    </div>
  );
}
