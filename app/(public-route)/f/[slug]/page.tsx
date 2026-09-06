import { getPublicFormService } from "@/core/services/form/forms.service";
import FormUI from "@/features/form-builder/components/form-ui";

interface FormPageProps {
  params: Promise<{ slug: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { slug } = await params;
  let formData: Awaited<ReturnType<typeof getPublicFormService>> | null = null;

  try {
    formData = await getPublicFormService(slug);
  } catch {}

  if (!formData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Form unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This form does not exist, has not been published, or its link is outdated.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <FormUI formData={formData} submitUrl={`/api/f/${slug}`} />
    </main>
  );
}
