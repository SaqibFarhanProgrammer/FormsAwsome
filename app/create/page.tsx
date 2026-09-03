import { CreateFormClient } from "@/features/dashboard/components/CreateFormClient";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;

  if (!slug) {
    redirect(`/create?slug=untitled-form-${nanoid(10).toLowerCase()}`);
  }

  return <CreateFormClient />;
}
