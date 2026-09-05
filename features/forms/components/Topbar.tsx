"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Eye, Save, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "@/redux/features/create-form/form-create.slice";
import { setFormSlug } from "@/redux/features/form-builder/form.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { Spinner } from "@/components/ui/Spinner";
import { showAlert } from "@/redux/features/global/alertSlice";
import { AppError } from "@/lib/auth/appError";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TopBar() {
  const title = useSelector((state: RootState) => state.form.formTitle);
  const description = useSelector((state: RootState) => state.form.formDescription);
  const slug = useSelector((state: RootState) => state.form.formSlug);
  const settings = useSelector((state: RootState) => state.form.settings);
  const { fields } = useSelector((state: RootState) => state.form);

  const loading = useSelector((state: RootState) => state.formCreate.isLoading);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleCreateForm = async () => {
    if (!slug) {
      dispatch(
        showAlert({
          message: "Form slug is missing. Please reopen the create page.",
          type: "danger",
        }),
      );
      return;
    }

    try {
      const result = await dispatch(
        createForm({
          title,
          description,
          fields: fields ?? [],
          slug,
          settings,
        }),
      ).unwrap();

      if (result.success) {
        const slug = result.data?.slug;
        if (slug) {
          dispatch(setFormSlug(slug));
          router.replace(`/create?slug=${slug}`);
        }
        dispatch(
          showAlert({
            message: "Form created successfully",
            type: "success",
          }),
        );
      }

      console.log("Form created:", result);
    } catch (error) {
      const message =
        error instanceof AppError
          ? error.message
          : typeof error === "string"
            ? error
            : "Unable to create the form. Please try again.";

      console.error("Create form failed:", error);
      dispatch(showAlert({ message, type: "danger" }));
    }
  };

  return (
    <div className="h-10 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/all-forms">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="h-6 w-px bg-border" />
        <div>
          <h1 className="text-sm font-semibold">Untitled Form</h1>
        </div>
        <Badge
          variant="secondary"
          className="rounded-lg text-xs bg-amber-50 text-amber-700 border-amber-200/50"
        >
          Draft
        </Badge>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          size="sm"
          onClick={handleCreateForm}
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
          disabled={loading}
        >
          {loading ? <Spinner className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          Create Form
        </Button>
        <Button
          size="sm"
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
        >
          <Save className="w-4 h-4" />
          Save Form
        </Button>
        <Button
          size="sm"
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
        >
          <Save className="w-4 h-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}
