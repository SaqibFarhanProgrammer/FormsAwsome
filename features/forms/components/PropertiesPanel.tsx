"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { QRCodeCanvas } from "qrcode.react";

import {
  FormSettings,
  FormTemplateType,
  setFormTemplateType,
  updateField,
  updateFormMeta,
  updateFormSettings,
  duplicateField,
  removeField,
} from "@/redux/features/form-builder/form.slice";
import {
  Settings,
  Trash2,
  Copy,
  QrCode,
  ChevronRight,
  Share2,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  FileCheck2,
  GraduationCap,
  Headphones,
  HeartHandshake,
  Megaphone,
  MessageSquareText,
  Newspaper,
  PackageCheck,
  PenLine,
  Receipt,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  UserRoundPlus,
  UsersRound,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedField,
  selectFormTitle,
  selectFormDescription,
  selectFormSettings,
  selectFormFields,
} from "@/redux/features/form-builder/form.selectors";
import { useCallback, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { showAlert } from "@/redux/features/global/alertSlice";

interface PropertiesPanelProps {
  onClose: () => void;
}

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
    icon: Sparkles,
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
 * PropertiesPanel Component
 *
 * Displays properties for the currently selected field or form settings.
 *
 * Redux Subscriptions:
 * - selectedFieldId → selectedField (via selectSelectedField) - determines what to display
 * - formTitle, formDescription (via selectors) - used only in form settings view
 * - formSettings (via selectFormSettings) - used only in form settings view
 *
 * This component subscribes narrowly to prevent unnecessary re-renders:
 * - Only subscribes to selectedField, not the entire form state
 * - When a field's label changes, other unrelated components won't re-render
 */
export function PropertiesPanel({ onClose }: PropertiesPanelProps) {
  const dispatch = useDispatch();

  const selectedField = useSelector(selectSelectedField);

  // Only subscribe when needed for form settings
  const formTitle = useSelector(selectFormTitle);
  const formDescription = useSelector(selectFormDescription);
  const settings = useSelector(selectFormSettings);
  const fields = useSelector(selectFormFields);
  const formSlug = useSelector((state: import("@/redux/store").RootState) => state.form.formSlug);

  // Memoize the update callback to avoid unnecessary re-renders of dependents
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const handleUpdateField = useCallback(
    (id: string, updates: Partial<typeof selectedField>) => {
      dispatch(updateField({ id, ...updates }));
    },
    [dispatch],
  );

  const selectedTemplate =
    selectedField?.formType || fields[0]?.formType || FormTemplateType.DEFAULT_CONTACT_FORM;

  const handleTemplateSelect = (template: FormTemplateType) => {
    dispatch(setFormTemplateType(template));
    setTemplatePickerOpen(false);
  };

  if (!selectedField) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Form Settings</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={onClose}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings className="w-4 h-4" />
          <p className="text-xs">Configure what respondents see after submitting.</p>
        </div>
        <FormSettingsPanel
          title={formTitle}
          description={formDescription}
          settings={settings}
          slug={formSlug}
          onUpdateMeta={(updates) => dispatch(updateFormMeta(updates))}
          onUpdateSettings={(updates) => dispatch(updateFormSettings(updates))}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Field Properties
          </p>
          <h3 className="mt-1 text-[23px] font-bold text-foreground">
            {selectedField.label || "Untitled Field"}
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={onClose}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Selected Field Settings
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="label"
                className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                Label
              </Label>
              <Input
                id="label"
                value={selectedField.label}
                onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                className="h-11 rounded-xl border-border bg-background text-[13px]"
              />
            </div>

            {!["heading", "divider"].includes(selectedField.type) && (
              <div className="space-y-2">
                <Label
                  htmlFor="placeholder"
                  className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Placeholder
                </Label>
                <Input
                  id="placeholder"
                  value={selectedField.placeholder || ""}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, { placeholder: e.target.value })
                  }
                  placeholder="Enter placeholder..."
                  className="h-11 rounded-xl border-border bg-background text-[14px]"
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-2.5">
              <div className="space-y-0.5">
                <Label className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Required
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Respondents must fill this field
                </p>
              </div>
              <Switch
                checked={selectedField.required}
                onCheckedChange={(required) => handleUpdateField(selectedField.id, { required })}
              />
            </div>

            {!["heading", "divider", "checkbox", "radio", "toggle", "rating", "file"].includes(
              selectedField.type,
            ) && (
              <div className="space-y-2">
                <Label
                  htmlFor="default-value"
                  className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Default Value
                </Label>
                <Input
                  id="default-value"
                  value={String(selectedField.defaultValue ?? "")}
                  onChange={(e) =>
                    handleUpdateField(selectedField.id, {
                      defaultValue: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl border-border bg-background text-[13px]"
                />
              </div>
            )}

            {["select", "checkbox", "radio"].includes(selectedField.type) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Options
                  </p>
                </div>

                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedField.options ?? [])];
                          newOptions[index] = e.target.value;
                          handleUpdateField(selectedField.id, { options: newOptions });
                        }}
                        className="h-11 flex-1 rounded-xl border-border bg-background text-[14px]"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-lg p-0 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          handleUpdateField(selectedField.id, {
                            options: (selectedField.options ?? []).filter((_, i) => i !== index),
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl border-border bg-background text-xs font-medium"
                    onClick={() =>
                      handleUpdateField(selectedField.id, {
                        options: [...(selectedField.options ?? []), ""],
                      })
                    }
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Form Settings
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Form Template
              </Label>
              <button
                type="button"
                onClick={() => setTemplatePickerOpen(true)}
                className="flex min-h-12 w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-left transition hover:border-primary/50 hover:bg-muted/30"
              >
                <span className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                  {(() => {
                    const current = TEMPLATE_OPTIONS.find(
                      (option) => option.value === selectedTemplate,
                    );
                    if (!current) return null;
                    const Icon = current.icon;
                    return (
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${current.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    );
                  })()}
                  {TEMPLATE_OPTIONS.find((option) => option.value === selectedTemplate)?.title}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              <p className="text-[11px] text-muted-foreground">
                This template will be used for the complete form.
              </p>
            </div>

            <FormSettingInput
              label="Submit button text"
              value={settings.submitButtonText}
              onChange={(value) => dispatch(updateFormSettings({ submitButtonText: value }))}
            />
            <FormSettingInput
              label="Success message"
              value={settings.successMessage}
              onChange={(value) => dispatch(updateFormSettings({ successMessage: value }))}
            />
            <FormSettingInput
              label="Redirect URL (optional)"
              value={settings.redirectUrl}
              placeholder="https://example.com/thanks"
              onChange={(value) => dispatch(updateFormSettings({ redirectUrl: value }))}
            />
            <FormSettingInput
              label="Notification email (optional)"
              type="email"
              value={settings.notifyEmail}
              placeholder="you@example.com"
              onChange={(value) => dispatch(updateFormSettings({ notifyEmail: value }))}
            />
          </div>
        </div>

        {formSlug && <FormShareCard slug={formSlug} />}

        <div className="space-y-2 pt-2">
          <Button
            variant="default"
            className="w-full rounded-xl bg-primary text-[13px] font-semibold"
            onClick={() =>
              dispatch(
                showAlert({
                  message: "Use Publish in the top bar to publish this form.",
                  type: "warning",
                }),
              )
            }
          >
            Publish Form
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="rounded-xl text-[13px]"
              onClick={() => dispatch(duplicateField(selectedField.id))}
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              className="rounded-xl text-[13px] text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
              onClick={() => {
                dispatch(removeField(selectedField.id));
                onClose();
                dispatch(showAlert({ message: "Field deleted", type: "success" }));
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        </div>

        {templatePickerOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-picker-title"
            onClick={() => setTemplatePickerOpen(false)}
          >
            <div
              className="flex max-h-[min(720px,calc(100vh-2rem))] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-border px-6 py-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    Form appearance
                  </p>
                  <h2 id="template-picker-title" className="mt-1 text-xl font-bold text-foreground">
                    Choose a form template
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick a visual style. Your fields and settings will stay unchanged.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-xl p-0"
                  onClick={() => setTemplatePickerOpen(false)}
                  aria-label="Close template picker"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="overflow-y-auto p-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {TEMPLATE_OPTIONS.map((template) => {
                    const Icon = template.icon;
                    const isSelected = template.value === selectedTemplate;

                    return (
                      <button
                        key={template.value}
                        type="button"
                        onClick={() => handleTemplateSelect(template.value)}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormSettingInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border-border bg-background text-[14px]"
      />
    </div>
  );
}

function FormSettingsPanel({
  title,
  description,
  settings,
  slug,
  onUpdateMeta,
  onUpdateSettings,
}: {
  title: string;
  description: string;
  settings: FormSettings;
  slug: string | null;
  onUpdateMeta: (updates: { title?: string; description?: string }) => void;
  onUpdateSettings: (updates: Partial<FormSettings>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="form-title"
          className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground"
        >
          Form title
        </Label>
        <Input
          id="form-title"
          value={title}
          onChange={(event) => onUpdateMeta({ title: event.target.value })}
          className="h-11 rounded-xl border-border bg-background text-[13px]"
          placeholder="Untitled Form"
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="form-description"
          className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground"
        >
          Form description
        </Label>
        <Input
          id="form-description"
          value={description}
          onChange={(event) => onUpdateMeta({ description: event.target.value })}
          className="h-11 rounded-xl border-border bg-background text-[13px]"
          placeholder="Describe your form"
        />
      </div>
      <FormSettingInput
        label="Submit button text"
        value={settings.submitButtonText}
        onChange={(value) => onUpdateSettings({ submitButtonText: value })}
      />
      <FormSettingInput
        label="Success message"
        value={settings.successMessage}
        onChange={(value) => onUpdateSettings({ successMessage: value })}
      />
      <FormSettingInput
        label="Redirect URL (optional)"
        value={settings.redirectUrl}
        placeholder="https://example.com/thanks"
        onChange={(value) => onUpdateSettings({ redirectUrl: value })}
      />
      <FormSettingInput
        label="Notification email (optional)"
        type="email"
        value={settings.notifyEmail}
        placeholder="you@example.com"
        onChange={(value) => onUpdateSettings({ notifyEmail: value })}
      />
      {slug && <FormShareCard slug={slug} />}
    </div>
  );
}

function FormShareCard({ slug }: { slug: string }) {
  const dispatch = useDispatch();
  const [showQr, setShowQr] = useState(false);
  const url = typeof window === "undefined" ? `/f/${slug}` : `${window.location.origin}/f/${slug}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    dispatch(showAlert({ message: "Form URL copied", type: "success" }));
  };

  const shareForm = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Share form", url });
      return;
    }
    await copyUrl();
  };

  return (
    <Card className="rounded-xl border-border bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Share2 className="w-4 h-4 text-primary" />
          Share Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="break-all text-center text-xs text-muted-foreground">{url}</p>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 px-2 text-xs" onClick={copyUrl}>
            <Copy className="h-3.5 w-3.5" />
            Copy URL
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 px-2 text-xs" onClick={shareForm}>
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            variant={showQr ? "default" : "outline"}
            size="sm"
            className="gap-1.5 px-2 text-xs"
            onClick={() => setShowQr((visible) => !visible)}
          >
            <QrCode className="h-3.5 w-3.5" />
            QR Code
          </Button>
        </div>
        {showQr && (
          <div className="flex justify-center rounded-lg bg-background p-3">
            <QRCodeCanvas value={url} size={150} includeMargin />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
