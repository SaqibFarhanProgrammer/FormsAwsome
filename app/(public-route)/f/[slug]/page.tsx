import { headers } from "next/headers";
import { getPublicFormService } from "@/core/services/form/forms.service";
import FormUI from "@/features/form-builder/components/form-ui";

interface FormPageProps {
  params: Promise<{ slug: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const requestIp = forwardedFor?.split(",")[0]?.trim() || realIp || undefined;

  let formData: Awaited<ReturnType<typeof getPublicFormService>> | null = null;

  try {
    formData = await getPublicFormService(slug, { requestIp });
  } catch {}

  if (!formData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <section className="w-full max-w-md rounded-2xl  bg-white text-black p-8 text-center ">
          <h1 className="text-xl font-semibold">Form unavailable</h1>
          <p className="mt-2 text-sm text-black/90">
            This form does not exist, has not been published, or its link is outdated.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white   pt-10">
      <FormUI
        formData={formData}
        submitUrl={`/api/f/${slug}`}
        hasSubmitted={Boolean(formData!.hasSubmitted)}
      />
    </main>
  );
}
