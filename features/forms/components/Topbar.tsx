"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Eye, Save, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "@/redux/features/create-form/form-create.slice";
import { setFormSlug } from "@/redux/features/form-builder/form.slice";
import { AppDispatch } from "@/redux/store";
import { Spinner } from "@/components/ui/Spinner";
import { showAlert } from "@/redux/features/global/alertSlice";
import { AppError } from "@/lib/auth/appError";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  selectFormTitle,
  selectFormDescription,
  selectFormSlug,
  selectFormSettings,
  selectFormFields,
} from "@/redux/features/form-builder/form.selectors";
import { useSelector as useFormCreateSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * TopBar Component
 *
 * Redux Subscriptions:
 * - formTitle (via selectFormTitle) - displays in header, used in createForm
 * - formDescription (via selectFormDescription) - used in createForm
 * - formSlug (via selectFormSlug) - used for form creation
 * - formSettings (via selectFormSettings) - used in createForm
 * - formFields (via selectFormFields) - used in createForm
 * - formCreate.isLoading (via custom selector) - shows loading state
 */
export function TopBar() {
  const title = useSelector(selectFormTitle);
  const description = useSelector(selectFormDescription);
  const slug = useSelector(selectFormSlug);
  const settings = useSelector(selectFormSettings);
  const fields = useSelector(selectFormFields);

  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const loading = useFormCreateSelector((state: RootState) => state.formCreate.isLoading);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const getPublicUrl = (formSlug: string) => `${window.location.origin}/f/${formSlug}`;

  const createCurrentForm = async () => {
    if (!slug) {
      throw new Error("Form slug is missing. Please reopen the create page.");
    }

    const result = await dispatch(
      createForm({ title, description, fields: fields ?? [], slug, settings }),
    ).unwrap();
    const createdSlug = result.data?.slug || slug;
    dispatch(setFormSlug(createdSlug));
    router.replace(`/create?slug=${createdSlug}`);
    return createdSlug;
  };

  const saveCurrentForm = async () => {
    if (!slug) return createCurrentForm();

    try {
      const response = await axios.put(`/api/forms/${slug}`, {
        title,
        description,
        fields: fields ?? [],
        settings,
      });
      const savedSlug = response.data.form?.slug || slug;
      dispatch(setFormSlug(savedSlug));
      router.replace(`/create?slug=${savedSlug}`);
      return savedSlug;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return createCurrentForm();
      }
      throw error;
    }
  };

  const handleCreateForm = async () => {
    try {
      setIsSaving(true);
      await createCurrentForm();
      dispatch(showAlert({ message: "Form created successfully", type: "success" }));
    } catch (error) {
      dispatch(showAlert({ message: getErrorMessage(error), type: "danger" }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveForm = async () => {
    try {
      setIsSaving(true);
      await saveCurrentForm();
      dispatch(showAlert({ message: "Form saved successfully", type: "success" }));
    } catch (error) {
      dispatch(showAlert({ message: getErrorMessage(error), type: "danger" }));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishForm = async () => {
    try {
      setIsSaving(true);
      const savedSlug = await saveCurrentForm();
      const response = await axios.post("/api/forms/publish-form", { slug: savedSlug });
      const publishedUrl = response.data.url || getPublicUrl(savedSlug);
      setShareUrl(publishedUrl);
      dispatch(showAlert({ message: "Form published successfully", type: "success" }));
    } catch (error) {
      dispatch(showAlert({ message: getErrorMessage(error), type: "danger" }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (!slug) {
      dispatch(showAlert({ message: "Save the form before sharing it.", type: "warning" }));
      return;
    }
    setShareUrl(getPublicUrl(slug));
  };

  const handlePreview = () => {
    if (!slug) {
      dispatch(showAlert({ message: "Save the form before previewing it.", type: "warning" }));
      return;
    }
    window.open(getPublicUrl(slug), "_blank", "noopener,noreferrer");
  };

  const getErrorMessage = (error: unknown) =>
    axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof AppError || error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

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
          <h1 className="text-sm font-semibold">{title || "Untitled Form"}</h1>
        </div>
        <Badge
          variant="secondary"
          className="rounded-lg text-xs bg-amber-50 text-amber-700 border-amber-200/50"
        >
          {shareUrl ? "Published" : "Draft"}
        </Badge>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handlePreview}>
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          size="sm"
          onClick={handleCreateForm}
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
          disabled={loading || isSaving}
        >
          {loading ? <Spinner className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          Create Form
        </Button>
        <Button
          size="sm"
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
          onClick={handleSaveForm}
          disabled={isSaving}
        >
          <Save className="w-4 h-4" />
          Save Form
        </Button>
        <Button
          size="sm"
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
          onClick={handlePublishForm}
          disabled={isSaving}
        >
          <Save className="w-4 h-4" />
          Publish
        </Button>
      </div>

      {shareUrl && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Share your form</h2>
                <p className="text-sm text-muted-foreground">Your form is live and ready.</p>
              </div>
              <button
                className="text-muted-foreground"
                onClick={() => setShareUrl(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="mb-4 flex justify-center rounded-xl bg-white p-4">
              <QRCodeCanvas value={shareUrl} size={190} includeMargin />
            </div>
            <div className="mb-4 rounded-lg border bg-muted/30 px-3 py-2 text-xs break-all text-muted-foreground">
              {shareUrl}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  dispatch(showAlert({ message: "Form URL copied", type: "success" }));
                }}
              >
                Copy URL
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(shareUrl, "_blank")}>
                Open
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={async () => {
                  if (navigator.share) {
                    await navigator.share({ url: shareUrl, title });
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                    dispatch(showAlert({ message: "Form URL copied", type: "success" }));
                  }
                }}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
