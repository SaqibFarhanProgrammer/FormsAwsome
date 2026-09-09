"use client";

import { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { AppError } from "@/lib/auth/appError";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Slider } from "@/components/ui/Slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Loader2, Star, Upload, Check, FileImage, FileText, X, ArrowUpRight } from "lucide-react";

export type FieldType =
  | "heading"
  | "divider"
  | "toggle"
  | "short_text"
  | "text"
  | "long_text"
  | "textarea"
  | "email"
  | "phone"
  | "number"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "select"
  | "rating"
  | "date"
  | "multiple_choice"
  | "file_upload_image"
  | "file_upload_pdf"
  | "file"
  | "slider"
  | "URL"
  | "url"
  | "image";

export type FormFieldItem = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  formType?: string;
  uiType?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string | number | boolean;
  validation: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
};

export type FormSettings = {
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  notifyEmail?: string;
};

export type FormData = {
  _id?: string;
  title: string;
  description?: string;
  fields: FormFieldItem[];
  settings: FormSettings;
};

/* ─────────── Schema Builder ─────────── */
function buildSchema(fields: FormFieldItem[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny = z.string();

    switch (field.type) {
      case "heading":
      case "divider":
        schema = z.any().optional();
        break;
      case "toggle":
        schema = z.boolean();
        break;
      case "email":
        schema = z.string().email("Invalid email address");
        break;
      case "number":
        schema = z.preprocess(
          (value) =>
            value === "" || value === null || value === undefined ? undefined : Number(value),
          z
            .number({ error: "Please enter a number" })
            .refine((value) => !Number.isNaN(value), "Please enter a valid number")
            .min(field.validation.min ?? -Infinity, `Minimum value is ${field.validation.min}`)
            .max(field.validation.max ?? Infinity, `Maximum value is ${field.validation.max}`),
        );
        break;
      case "URL":
      case "url":
        schema = z.string().url("Invalid URL");
        break;
      case "date":
        schema = z.string();
        break;
      case "checkbox":
      case "multiple_choice":
        schema = z.array(z.string());
        break;
      case "rating":
      case "slider":
        schema = z.number();
        break;
      default:
        schema = z.string();
        if (field.validation.min !== undefined) {
          schema = (schema as z.ZodString).min(
            field.validation.min,
            `Minimum ${field.validation.min} characters required`,
          );
        }
        if (field.validation.max !== undefined) {
          schema = (schema as z.ZodString).max(
            field.validation.max,
            `Maximum ${field.validation.max} characters allowed`,
          );
        }
        break;
    }

    if (field.validation.pattern) {
      schema = (schema as z.ZodString).regex(
        new RegExp(field.validation.pattern),
        "Invalid format",
      );
    }

    if (!field.validation.required) {
      if (field.type === "checkbox" || field.type === "multiple_choice") {
        schema = (schema as z.ZodArray<z.ZodString>).optional();
      } else if (["rating", "slider", "number"].includes(field.type)) {
        schema = (schema as z.ZodNumber).optional();
      } else if (["date", "toggle"].includes(field.type)) {
        schema = schema.optional();
      } else {
        schema = (schema as z.ZodString).optional();
      }
    } else if (field.type === "checkbox" || field.type === "multiple_choice") {
      schema = (schema as z.ZodArray<z.ZodString>).min(1, "Select at least one option");
    } else if (field.type === "toggle") {
      schema = (schema as z.ZodBoolean).refine((value) => value === true, "This field is required");
    } else if (field.type === "date") {
      schema = (schema as z.ZodString).min(1, "This field is required");
    } else if (["rating", "slider", "number"].includes(field.type)) {
      schema = schema.refine(
        (value) => value !== undefined && value !== null && !Number.isNaN(value as number),
        "This field is required",
      );
    } else if (!["heading", "divider"].includes(field.type)) {
      schema = (schema as z.ZodString).min(1, "This field is required");
    }

    shape[field.id] = schema;
  }

  return z.object(shape);
}

function buildDefaults(fields: FormFieldItem[]) {
  const defaults: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "heading" || field.type === "divider") {
      defaults[field.id] = undefined;
    } else if (field.type === "checkbox" || field.type === "multiple_choice") {
      defaults[field.id] = [];
    } else if (field.type === "toggle") {
      defaults[field.id] = field.defaultValue ?? false;
    } else if (["rating", "slider", "number"].includes(field.type)) {
      defaults[field.id] = field.defaultValue ?? undefined;
    } else {
      defaults[field.id] = field.defaultValue ?? "";
    }
  }

  return defaults;
}

function getFieldTemplateType(fields: FormFieldItem[]) {
  return fields.find((field) => field.formType)?.formType || "default_contact_form";
}

function getFieldUiType(fields: FormFieldItem[]) {
  return fields.find((field) => field.uiType)?.uiType || "default";
}

const formTypeMeta: Record<string, { label: string; badge: string; shell: string }> = {
  default_contact_form: {
    label: "Default Contact Form",
    badge: "Contact",
    shell: "border-transparent bg-transparent",
  },
  company_audit: {
    label: "Company Audit",
    badge: "Audit",
    shell: "border-violet-200/70 bg-violet-50/40",
  },
  customer_feedback: {
    label: "Customer Feedback",
    badge: "Feedback",
    shell: "border-emerald-200/70 bg-emerald-50/40",
  },
  lead_capture: {
    label: "Lead Capture",
    badge: "Lead",
    shell: "border-sky-200/70 bg-sky-50/40",
  },
  event_registration: {
    label: "Event Registration",
    badge: "Event",
    shell: "border-amber-200/70 bg-amber-50/40",
  },
  employee_checkin: {
    label: "Employee Check-in",
    badge: "Check-in",
    shell: "border-cyan-200/70 bg-cyan-50/40",
  },
  workflow_request: {
    label: "Workflow Request",
    badge: "Workflow",
    shell: "border-rose-200/70 bg-rose-50/40",
  },
};

/* ─────────── Helpers ─────────── */
function FieldLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <Label className="mb-1.5 block text-sm font-medium text-black">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </Label>
  );
}

function FieldDescription({ text }: { text?: string }) {
  return text ? <p className="mt-1 text-xs text-black/50">{text}</p> : null;
}

function FieldError({ error }: { error?: string }) {
  return error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null;
}

/* ─────────── Field Components ─────────── */

function HeadingField({ field }: { field: FormFieldItem }) {
  return (
    <div className="py-1">
      <h2 className="text-lg font-semibold text-black">{field.label}</h2>
      {field.helperText && <p className="mt-0.5 text-xs text-black/50">{field.helperText}</p>}
    </div>
  );
}

function DividerField() {
  return <div className="my-1 border-t border-black/10" aria-hidden="true" />;
}

function ToggleField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormFieldItem;
  value: boolean;
  onChange: (val: boolean) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="space-y-0">
          <Label className="text-sm font-medium text-black">
            {field.label}
            {field.validation.required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          {field.helperText && <p className="text-xs text-black/50">{field.helperText}</p>}
        </div>
        <Switch
          checked={value}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-black scale-90"
        />
      </div>
      <FieldError error={error} />
    </div>
  );
}

function TextField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  const type =
    field.type === "number"
      ? "number"
      : field.type === "email"
        ? "email"
        : ["URL", "url"].includes(field.type)
          ? "url"
          : "text";

  return (
    <div className="space-y-1.5">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Input
        type={type}
        placeholder={field.placeholder || "Type here..."}
        {...register(field.id)}
        className="h-9 rounded-md border-black/15 bg-white px-3 text-sm text-black placeholder:text-black/40 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function TextAreaField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Textarea
        placeholder={field.placeholder || "Type here..."}
        {...register(field.id)}
        className="min-h-20 rounded-md border-black/15 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0 resize-y"
      />
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function SelectField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormFieldItem;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Select value={value || ""} onValueChange={(nextValue) => onChange(nextValue || "")}>
        <SelectTrigger className="h-9 rounded-md border-black/15 bg-white px-3 text-sm text-black focus:ring-0 focus:ring-offset-0 [&>span]:text-black/40 data-[state=open]:border-black">
          <SelectValue placeholder={field.placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent className="rounded-md border-black/10 bg-white">
          {field.options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm text-black focus:bg-black/5 focus:text-black"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function RadioField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormFieldItem;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <RadioGroup value={value || ""} onValueChange={onChange} className="space-y-1.5">
        {field.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2.5">
            <RadioGroupItem
              value={option.value}
              id={`${field.id}-${option.value}`}
              className="border-black/20 data-[state=checked]:border-black data-[state=checked]:bg-black"
            />
            <Label
              htmlFor={`${field.id}-${option.value}`}
              className="text-sm text-black cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function CheckboxField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormFieldItem;
  value: string[];
  onChange: (val: string[]) => void;
  error?: string;
}) {
  const toggleOption = useCallback(
    (optionValue: string) => {
      const current = value || [];
      if (current.includes(optionValue)) {
        onChange(current.filter((v) => v !== optionValue));
      } else {
        onChange([...current, optionValue]);
      }
    },
    [value, onChange],
  );

  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <div className="space-y-1.5">
        {field.options?.map((option) => {
          const isChecked = (value || []).includes(option.value);
          return (
            <div
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleOption(option.value)}
                className="border-black/20 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
              />
              <Label className="text-sm text-black cursor-pointer">{option.label}</Label>
            </div>
          );
        })}
      </div>
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function RatingField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormFieldItem;
  value: number;
  onChange: (val: number) => void;
  error?: string;
}) {
  const [hoverValue, setHoverValue] = useState<number>(0);
  const currentValue = value || 0;

  return (
    <div className="space-y-1.5">
      <FieldLabel label={field.label} required={field.validation.required} />
      <div className="flex items-center gap-0.5 py-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors duration-200",
                star <= (hoverValue || currentValue)
                  ? "fill-black text-black"
                  : "fill-transparent text-black/20",
              )}
            />
          </button>
        ))}
        {currentValue > 0 && <span className="ml-2 text-xs text-black/50">{currentValue} / 5</span>}
      </div>
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function SliderField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormFieldItem;
  value: number;
  onChange: (val: number) => void;
  error?: string;
}) {
  const min = field.validation.min ?? 0;
  const max = field.validation.max ?? 100;
  const currentValue = value ?? min;

  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Slider
        value={[currentValue]}
        onValueChange={(vals) => onChange(typeof vals === "number" ? vals : (vals[0] ?? min))}
        min={min}
        max={max}
        step={1}
        className="w-full [&_[role=slider]]:bg-black [&_[role=slider]]:border-black [&>span:first-child]:bg-black/10 [&>span:first-child>span]:bg-black"
      />
      <div className="flex items-center justify-between text-xs text-black/50">
        <span>{min}</span>
        <span className="text-black">{currentValue}</span>
        <span>{max}</span>
      </div>
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function DateField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Input
        type="date"
        {...register(field.id)}
        className="h-9 rounded-md border-black/15 bg-white px-3 text-sm text-black focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function FileField({
  field,
  register,
  error,
  watch,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
  watch: (name: string) => any;
}) {
  const fileValue = watch(field.id);
  const isImage = field.type === "file_upload_image";
  const fileName = fileValue?.[0]?.name;

  return (
    <div className="space-y-1.5">
      <FieldLabel label={field.label} required={field.validation.required} />
      <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-black/15 bg-black/[0.03] px-4 py-6 text-center transition-colors hover:border-black/40">
        {isImage ? (
          <FileImage className="h-5 w-5 text-black/50" />
        ) : (
          <FileText className="h-5 w-5 text-black/50" />
        )}
        <p className="text-xs text-black/50">
          {fileName ? fileName : field.placeholder || `Upload ${isImage ? "image" : "file"}`}
        </p>
        <input type="file" className="hidden" {...register(field.id)} />
      </label>
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

function ImageUrlField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel label={field.label} required={field.validation.required} />
      <div className="relative">
        <Input
          type="url"
          placeholder={field.placeholder || "https://example.com/image.jpg"}
          {...register(field.id)}
          className="h-9 rounded-md border-black/15 bg-white pl-9 pr-3 text-sm text-black placeholder:text-black/40 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Upload className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/40" />
      </div>
      <FieldDescription text={field.helperText} />
      <FieldError error={error} />
    </div>
  );
}

/* ─────────── Field Renderer ─────────── */
function RenderField({
  field,
  register,
  error,
  setValue,
  watch,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
  setValue: (name: string, value: any, options?: Record<string, unknown>) => void;
  watch: (name: string) => any;
}) {
  const value = watch(field.id);

  switch (field.type) {
    case "heading":
      return <HeadingField field={field} />;
    case "divider":
      return <DividerField />;
    case "toggle":
      return (
        <ToggleField
          field={field}
          value={value || false}
          onChange={(val) => setValue(field.id, val, { shouldValidate: true })}
          error={error}
        />
      );
    case "short_text":
    case "text":
    case "email":
    case "phone":
    case "number":
    case "URL":
    case "url":
      return <TextField field={field} register={register} error={error} />;
    case "long_text":
    case "textarea":
      return <TextAreaField field={field} register={register} error={error} />;
    case "dropdown":
    case "select":
      return (
        <SelectField
          field={field}
          value={value || ""}
          onChange={(val) => setValue(field.id, val, { shouldValidate: true })}
          error={error}
        />
      );
    case "radio":
      return (
        <RadioField
          field={field}
          value={value || ""}
          onChange={(val) => setValue(field.id, val, { shouldValidate: true })}
          error={error}
        />
      );
    case "checkbox":
    case "multiple_choice":
      return (
        <CheckboxField
          field={field}
          value={value || []}
          onChange={(val) => setValue(field.id, val, { shouldValidate: true })}
          error={error}
        />
      );
    case "rating":
      return (
        <RatingField
          field={field}
          value={value || 0}
          onChange={(val) => setValue(field.id, val, { shouldValidate: true })}
          error={error}
        />
      );
    case "slider":
      return (
        <SliderField
          field={field}
          value={value}
          onChange={(val) => setValue(field.id, val, { shouldValidate: true })}
          error={error}
        />
      );
    case "date":
      return <DateField field={field} register={register} error={error} />;
    case "file_upload_image":
    case "file_upload_pdf":
    case "file":
      return <FileField field={field} register={register} error={error} watch={watch} />;
    case "image":
      return <ImageUrlField field={field} register={register} error={error} />;
    default:
      return <TextField field={field} register={register} error={error} />;
  }
}

/* ─────────── Main Component ─────────── */
interface FormUIProps {
  formData: FormData & { hasSubmitted?: boolean };
  submitUrl: string;
  className?: string;
  isSubmitting?: boolean;
  hasSubmitted?: boolean;
}

export default function FormUI({
  formData,
  submitUrl,
  className,
  isSubmitting = false,
  hasSubmitted = false,
}: FormUIProps) {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const alreadySubmitted = hasSubmitted || Boolean(formData.hasSubmitted);

  const formType = useMemo(() => getFieldTemplateType(formData.fields), [formData.fields]);
  const uiType = useMemo(() => getFieldUiType(formData.fields), [formData.fields]);
  const fieldWrapClass =
    uiType === "card"
      ? "rounded-xl border border-black/10 bg-black/[0.03] p-3"
      : uiType === "structured"
        ? "rounded-xl border border-black/10 bg-black/[0.02] p-3"
        : uiType === "compact"
          ? "space-y-1.5"
          : "space-y-2";
  const shellClass =
    uiType === "card"
      ? "rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
      : uiType === "structured"
        ? "rounded-2xl border border-black/10 bg-white p-5"
        : uiType === "compact"
          ? "rounded-xl bg-white p-4"
          : "rounded-lg bg-white p-6";
  const widthClass =
    uiType === "structured" ? "max-w-2xl" : uiType === "card" ? "max-w-xl" : "max-w-md";

  const schema = useMemo(() => buildSchema(formData.fields), [formData.fields]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(formData.fields),
    mode: "onBlur",
  });

  const { register, handleSubmit, setValue, watch, formState } = form;

  const submit = async (values: z.infer<typeof schema>) => {
    setSubmitMessage(null);
    setSubmitError(null);

    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new AppError(result?.message || "Unable to submit the form", response.status);
      }

      setSubmitMessage(
        formData.settings.successMessage ||
          result?.data?.message ||
          "Thank you for your submission!",
      );
      form.reset();
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error, "Unable to submit the form"));
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className={cn("mx-auto w-full", widthClass, className)}>
        <div className={shellClass}>
          {alreadySubmitted ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
                <Check className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-xl font-semibold text-black">Already submitted</h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-black/50">
                You have already submitted the form.
              </p>
            </div>
          ) : submitMessage ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
                <Check className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-xl font-semibold text-black">Submission complete</h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-black/50">
                {submitMessage}
              </p>
              {formData.settings.redirectUrl && (
                <Button
                  type="button"
                  className="mt-6 gap-2 rounded-md bg-black text-sm text-white hover:bg-black/90"
                  onClick={() => window.location.assign(formData.settings.redirectUrl!)}
                >
                  Continue
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "mb-6 text-start rounded-xl border p-4",
                  formTypeMeta[formType]?.shell || "border-transparent bg-transparent",
                )}
              >
                <div className=" gap-3">
                  <h1 className="text-2xl text-start mr-10 font-semibold text-black">{formData.title}</h1>
                  </div>
                {formData.description && (
                  <p className="mt-2 text-[15px] font-medium text-black/60">
                    {formData.description}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit(submit)} className="space-y-4">
                {formData.fields.map((field) => (
                  <div key={field.id} className={fieldWrapClass}>
                    <RenderField
                      field={field}
                      register={register}
                      error={formState.errors[field.id]?.message as string | undefined}
                      setValue={setValue}
                      watch={watch}
                    />
                  </div>
                ))}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || formState.isSubmitting}
                    className="h-9 w-full rounded-md bg-black text-sm font-medium text-white hover:bg-black/90 transition-colors"
                  >
                    {isSubmitting || formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      formData.settings.submitButtonText || "Submit"
                    )}
                  </Button>

                  {submitError && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-600">
                      <X className="h-3.5 w-3.5" />
                      {submitError}
                    </div>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}