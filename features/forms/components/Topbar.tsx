"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  CalendarDays,
  CheckSquare,
  Check,
  CircleDot,
  Eye,
  FileCheck2,
  GraduationCap,
  Headphones,
  Hash,
  HeartHandshake,
  ListFilter,
  Mail,
  Megaphone,
  MessageSquareText,
  Newspaper,
  PackageCheck,
  PenLine,
  Receipt,
  Save,
  Share2,
  ShieldCheck,
  Star,
  Ticket,
  Upload,
  UserRoundPlus,
  UsersRound,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "@/redux/features/create-form/form-create.slice";
import {
  FormTemplateType,
  setFormSlug,
  setFormTemplateType,
} from "@/redux/features/form-builder/form.slice";
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
import type { LucideIcon } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { getErrorMessage } from "@/utils/getErrorMessage";

const TEMPLATE_OPTIONS: Array<{
  value: FormTemplateType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}> = [
  {
    value: FormTemplateType.DEFAULT_CONTACT_FORM,
    title: "Contact Form",
    description: "Simple and focused contact form",
    icon: MessageSquareText,
    color: "bg-slate-100 text-slate-700",
  },
  {
    value: FormTemplateType.LEAD_CAPTURE,
    title: "Lead Capture",
    description: "Convert visitors into qualified leads",
    icon: Megaphone,
    color: "bg-sky-100 text-sky-700",
  },
  {
    value: FormTemplateType.CUSTOMER_FEEDBACK,
    title: "Customer Feedback",
    description: "Collect opinions and satisfaction ratings",
    icon: HeartHandshake,
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: FormTemplateType.EVENT_REGISTRATION,
    title: "Event Registration",
    description: "Register attendees for an event",
    icon: Ticket,
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: FormTemplateType.NEWSLETTER_SIGNUP,
    title: "Newsletter Signup",
    description: "Grow your email subscriber list",
    icon: Newspaper,
    color: "bg-lime-100 text-lime-700",
  },
  {
    value: FormTemplateType.EMPLOYEE_CHECKIN,
    title: "Employee Check-in",
    description: "Capture daily team mood and status",
    icon: UsersRound,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    value: FormTemplateType.WORKFLOW_REQUEST,
    title: "Workflow Request",
    description: "Collect and route internal requests",
    icon: BriefcaseBusiness,
    color: "bg-rose-100 text-rose-700",
  },
  {
    value: FormTemplateType.COMPANY_AUDIT,
    title: "Company Audit",
    description: "Review processes with a checklist",
    icon: ShieldCheck,
    color: "bg-violet-100 text-violet-700",
  },
  {
    value: FormTemplateType.JOB_APPLICATION,
    title: "Job Application",
    description: "Create a polished hiring application",
    icon: UserRoundPlus,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    value: FormTemplateType.LEAVE_REQUEST,
    title: "Leave Request",
    description: "Manage employee time-off requests",
    icon: CalendarDays,
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: FormTemplateType.EMPLOYEE_ONBOARDING,
    title: "Employee Onboarding",
    description: "Welcome and collect new-hire details",
    icon: Star,
    color: "bg-teal-100 text-teal-700",
  },
  {
    value: FormTemplateType.PRODUCT_ORDER,
    title: "Product Order",
    description: "Take orders with a clear summary",
    icon: PackageCheck,
    color: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    value: FormTemplateType.QUOTE_REQUEST,
    title: "Quote Request",
    description: "Understand scope and budget needs",
    icon: PenLine,
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: FormTemplateType.SUPPORT_TICKET,
    title: "Support Ticket",
    description: "Give customers a direct support channel",
    icon: Headphones,
    color: "bg-red-100 text-red-700",
  },
  {
    value: FormTemplateType.APPOINTMENT_BOOKING,
    title: "Appointment Booking",
    description: "Let people request a time slot",
    icon: CalendarDays,
    color: "bg-pink-100 text-pink-700",
  },
  {
    value: FormTemplateType.SURVEY_POLL,
    title: "Survey Poll",
    description: "Run a quick structured survey",
    icon: Check,
    color: "bg-green-100 text-green-700",
  },
  {
    value: FormTemplateType.COURSE_EVALUATION,
    title: "Course Evaluation",
    description: "Collect useful learning feedback",
    icon: GraduationCap,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: FormTemplateType.QUIZ_TEST,
    title: "Quiz Test",
    description: "Build a clear quiz or assessment",
    icon: Star,
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: FormTemplateType.NDA_AGREEMENT,
    title: "NDA Agreement",
    description: "Present a formal agreement workflow",
    icon: FileCheck2,
    color: "bg-slate-200 text-slate-700",
  },
  {
    value: FormTemplateType.EXPENSE_REIMBURSEMENT,
    title: "Expense Reimbursement",
    description: "Submit and review expense claims",
    icon: Receipt,
    color: "bg-emerald-100 text-emerald-700",
  },
];

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
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplateType>(
    fields[0]?.formType || FormTemplateType.DEFAULT_CONTACT_FORM,
  );

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
      if (axios.isAxiosError(error) && error.response?.status === 409 && slug) {
        try {
          await saveCurrentForm();
          dispatch(
            showAlert({ message: "Form already existed, so it was updated.", type: "success" }),
          );
          return;
        } catch (updateError) {
          dispatch(showAlert({ message: getErrorMessage(updateError), type: "danger" }));
          return;
        }
      }
      dispatch(showAlert({ message: getErrorMessage(error), type: "danger" }));
    } finally {
      setIsSaving(false);
    }
  };

  const openTemplatePicker = () => {
    setSelectedTemplate(fields[0]?.formType || FormTemplateType.DEFAULT_CONTACT_FORM);
    setIsTemplatePickerOpen(true);
  };

  const handleTemplateCreate = async () => {
    dispatch(setFormTemplateType(selectedTemplate));
    setIsTemplatePickerOpen(false);
    await handleCreateForm();
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
          onClick={openTemplatePicker}
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

      {isTemplatePickerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-template-picker-title"
          onClick={() => setIsTemplatePickerOpen(false)}
        >
          <div
            className="flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  New form
                </p>
                <h2
                  id="create-template-picker-title"
                  className="mt-1 text-xl font-bold text-foreground"
                >
                  Choose a form template
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a visual style before creating your form.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close template picker"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
                onClick={() => setIsTemplatePickerOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TEMPLATE_OPTIONS.map((template) => {
                  const Icon = template.icon;
                  const isSelected = template.value === selectedTemplate;

                  return (
                    <button
                      key={template.value}
                      type="button"
                      onClick={() => setSelectedTemplate(template.value)}
                      className={`group relative flex min-h-36 flex-col items-start rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg ${
                        isSelected
                          ? "border-primary bg-primary/[0.04] shadow-md ring-2 ring-primary/20"
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${template.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{template.title}</span>
                      <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {template.description}
                      </span>
                      {isSelected && (
                        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsTemplatePickerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl px-5"
                style={{ backgroundColor: "#432DD7" }}
                onClick={handleTemplateCreate}
                disabled={loading || isSaving}
              >
                {loading ? <Spinner className="mr-2 h-4 w-4 text-white" /> : null}
                Create Form
              </Button>
            </div>
          </div>
        </div>
      )}

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
