import FormUI from "@/features/form-builder/components/form-ui";
import { templateTestFormList } from "@/features/form-builder/templates/template-test-forms";

interface PreviewPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { type } = await searchParams;
  const requestedType = type?.trim().toLowerCase();
  const formData =
    templateTestFormList.find(
      (form) =>
        form.type.toLowerCase() === requestedType ||
        form.templateType.toLowerCase() === requestedType,
    ) ||
    templateTestFormList.find((form) => form.type === "default_contact_form") ||
    templateTestFormList[0];

  if (!formData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <section className="w-full max-w-md rounded-2xl border border-black/10 p-8 text-center text-black">
          <h1 className="text-xl font-semibold">Preview unavailable</h1>
          <p className="mt-2 text-sm text-black/60">No test form templates are configured.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-10">
      <FormUI formData={formData} submitUrl="/api/f/preview" hasSubmitted={false} />
    </main>
  );
}
