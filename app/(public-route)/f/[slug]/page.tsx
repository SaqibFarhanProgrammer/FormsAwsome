import { headers } from "next/headers";
import { getPublicFormService, TrackFormViews } from "@/core/services/form/forms.service";
import FormUI from "@/features/form-builder/components/form-ui";
import { getUserIP } from "@/lib/auth/rateLimit";
import axios from "axios";

interface FormPageProps {
  params: Promise<{ slug: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { slug } = await params;

  const formData = await getPublicFormService(slug);
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/forms/set-visitor-id-in-cookie`,
  );

  console.log(res.data);

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
