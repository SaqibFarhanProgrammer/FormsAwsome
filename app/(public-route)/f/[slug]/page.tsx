import FormUI, {
  type FormData as PublicFormData,
} from "@/features/form-builder/components/form-ui";
import { notFound } from "next/navigation";

const dummyFormData: PublicFormData = {
  _id: "dummy-form-for-testing",
  title: "Customer Feedback Form",
  description: "A test form for checking the public form experience.",
  settings: {
    submitButtonText: "Send Feedback",
    successMessage: "Thanks for your feedback!",
  },
  fields: [
    {
      id: "name",
      type: "short_text",
      label: "Full name",
      placeholder: "Enter your full name",
      validation: { required: true },
    },
    {
      id: "email",
      type: "email",
      label: "Email address",
      placeholder: "you@example.com",
      validation: { required: true },
    },
    {
      id: "rating",
      type: "rating",
      label: "How would you rate your experience?",
      validation: { required: true, min: 1, max: 5 },
    },
    {
      id: "feedback",
      type: "long_text",
      label: "Your feedback",
      placeholder: "Tell us what you think...",
      validation: { required: true, min: 10 },
    },
  ],
};

interface FormPageProps {
  params: Promise<{ slug: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <FormUI
        formData={dummyFormData}
        onSubmit={async (values) => {
          "use server";
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/${slug}/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
        }}
      />
    </main>
  );
}
