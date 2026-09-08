"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  CircleDot,
  Eye,
  Hash,
  ListFilter,
  Mail,
  Save,
  Share2,
  Star,
  Upload,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "@/redux/features/create-form/form-create.slice";
import { setFormSlug } from "@/redux/features/form-builder/form.slice";
import { AppDispatch } from "@/redux/store";
import { Spinner } from "@/components/ui/Spinner";
import { showAlert } from "@/redux/features/global/alertSlice";
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
import { getErrorMessage } from "@/utils/getErrorMessage";

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
  const [isPublished, setIsPublished] = useState(false);

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
    console.log(result);

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
      const publishedState = response.data.state || "PUBLISHED";
      setShareUrl(publishedUrl);
      setIsPublished(publishedState === "PUBLISHED");
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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = () => {
    if (!slug) {
      dispatch(showAlert({ message: "Save the form before previewing it.", type: "warning" }));
      return;
    }
    setIsPreviewOpen(true);
  };

  const renderPreviewField = (field: (typeof fields)[number]) => {
    const placeholder = field.placeholder || `Enter ${field.label.toLowerCase()}...`;
    const baseClass =
      "w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-[13px] text-muted-foreground";

    switch (field.type) {
      case "heading":
        return (
          <div className="space-y-1">
            <h3 className="text-[15px] font-semibold text-foreground">{field.label}</h3>
          </div>
        );
      case "divider":
        return <div className="border-t border-dashed border-border" />;
      case "long_text":
        return <div className={baseClass + " min-h-[88px]"}>{placeholder}</div>;
      case "email":
        return (
          <div className={baseClass + " flex items-center gap-2"}>
            <Mail className="h-4 w-4" />
            <span>{placeholder}</span>
          </div>
        );
      case "number":
        return (
          <div className={baseClass + " flex items-center gap-2"}>
            <Hash className="h-4 w-4" />
            <span>{placeholder}</span>
          </div>
        );
      case "dropdown":
        return (
          <div className={baseClass + " flex items-center justify-between gap-2"}>
            <span>{field.placeholder || "Select an option"}</span>
            <ListFilter className="h-4 w-4" />
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {(field.options?.length ? field.options : ["Option 1", "Option 2"]).map(
              (option, index) => (
                <label
                  key={`${field.id}-${index}`}
                  className="flex items-center gap-2.5 text-[13px] text-muted-foreground"
                >
                  <CircleDot className="h-4 w-4" />
                  <span>{option}</span>
                </label>
              ),
            )}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {(field.options?.length ? field.options : ["Option 1", "Option 2"]).map(
              (option, index) => (
                <label
                  key={`${field.id}-${index}`}
                  className="flex items-center gap-2.5 text-[13px] text-muted-foreground"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>{option}</span>
                </label>
              ),
            )}
          </div>
        );
      case "rating":
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 text-muted-foreground/80" fill="currentColor" />
            ))}
          </div>
        );
      case "date":
        return (
          <div className={baseClass + " flex items-center gap-2"}>
            <Calendar className="h-4 w-4" />
            <span>MM/DD/YYYY</span>
          </div>
        );
      case "toggle":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-11 items-center rounded-full bg-muted p-1">
              <div className="h-4 w-4 rounded-full bg-background shadow-sm" />
            </div>
            <span className="text-[13px] text-muted-foreground">{field.label}</span>
          </div>
        );
      case "file_upload_image":
      case "file_upload_pdf":
      case "image":
        return (
          <div className="flex min-h-[96px] w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-[13px] text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-5 w-5" />
              <span>Upload file</span>
            </div>
          </div>
        );
      default:
        return <div className={baseClass}>{placeholder}</div>;
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
          <h1 className="text-sm font-semibold">{title || "Untitled Form"}</h1>
        </div>
        <Badge
          variant="secondary"
          className={`rounded-lg text-xs border ${
            isPublished || shareUrl
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
              : "bg-amber-50 text-amber-700 border-amber-200/50"
          }`}
        >
          {isPublished || shareUrl ? "Published" : "Draft"}
        </Badge>
      </div>

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

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm">
          <div className="h-full overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-2xl">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Preview
                  </p>
                  <h2 className="text-lg font-semibold">{title || "Untitled Form"}</h2>
                </div>
                <button
                  type="button"
                  aria-label="Close preview"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:text-foreground"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-[28px] border border-border bg-background p-6 shadow-2xl md:p-8">
                <div className="mb-6 space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {title || "Untitled Form"}
                  </h3>
                  {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>

                <div className="space-y-5">
                  {fields.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
                      No fields added yet.
                    </div>
                  ) : (
                    fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        {field.type !== "divider" && (
                          <label className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                            {field.label || "Untitled field"}
                            {field.required && <span className="text-destructive">*</span>}
                          </label>
                        )}
                        {renderPreviewField(field)}
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-xl bg-primary/80 px-4 py-3 text-sm font-medium text-white opacity-80"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
