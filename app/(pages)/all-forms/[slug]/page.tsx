import { getSingleFormService } from "@/core/services/form/forms.service";
import { SingleFormView } from "@/features/form-builder/components/SingleFormView";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SingleFormPage({ params }: PageProps) {
  const slug = (await params).slug;
  const singleFormData = await getSingleFormService(slug);

  return <SingleFormView formData={singleFormData} />;
}
