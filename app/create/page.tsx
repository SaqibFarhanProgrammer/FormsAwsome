import { CreateFormClient } from "@/features/dashboard/components/CreateFormClient";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;

  const defaultSlug = dayjs().format("YYYY-MM-DD-HH-mm-ss");

  if (!slug) {
    redirect(`/create?slug=untitled-form-${defaultSlug.toLowerCase()}`);
  }

  return <CreateFormClient />;
}
