"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2, Star, Upload } from "lucide-react";

export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "rating"
  | "date"
  | "multiple_choice"
  | "file_upload_image"
  | "file_upload_pdf"
  | "slider"
  | "URL"
  | "image";

export type FormFieldItem = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  options?: { label: string; value: string }[];
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

function buildSchema(fields: FormFieldItem[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny = z.string();

    switch (field.type) {
      case "email":
        schema = z.string().email("Invalid email");
        break;
      case "number":
        schema = z.coerce.number();
        if (field.validation.min !== undefined) {
          schema = (schema as z.ZodNumber).min(field.validation.min);
        }
        if (field.validation.max !== undefined) {
          schema = (schema as z.ZodNumber).max(field.validation.max);
        }
        break;
      case "URL":
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
          schema = (schema as z.ZodString).min(field.validation.min);
        }
        if (field.validation.max !== undefined) {
          schema = (schema as z.ZodString).max(field.validation.max);
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
      } else if (field.type === "date") {
        schema = schema.optional();
      } else {
        schema = (schema as z.ZodString).optional();
      }
    } else if (
      !["checkbox", "multiple_choice", "rating", "slider", "number", "date"].includes(field.type)
    ) {
      schema = (schema as z.ZodString).min(1, "This field is required");
    }

    shape[field.id] = schema;
  }

  return z.object(shape);
}

function buildDefaults(fields: FormFieldItem[]) {
  const defaults: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "checkbox" || field.type === "multiple_choice") {
      defaults[field.id] = [];
    } else if (["rating", "slider", "number"].includes(field.type)) {
      defaults[field.id] = undefined;
    } else {
      defaults[field.id] = "";
    }
  }

  return defaults;
}

function FieldLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {label}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  );
}

function FieldDescription({ text }: { text?: string }) {
  return text ? <p className="mt-1 text-xs text-muted-foreground">{text}</p> : null;
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
        : field.type === "URL"
          ? "url"
          : "text";

  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Input
        type={type}
        placeholder={field.placeholder || "Type here..."}
        {...register(field.id)}
        className="h-11 rounded-[0.45rem] border-input bg-background px-4 text-sm"
      />
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
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
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Textarea
        placeholder={field.placeholder || "Type here..."}
        {...register(field.id)}
        className="min-h-[120px] rounded-[0.45rem] border-input bg-background px-4 py-3 text-sm"
      />
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <select
        {...register(field.id)}
        defaultValue=""
        className="h-11 w-full rounded-[0.45rem] border border-input bg-background px-3 text-sm text-foreground outline-none"
      >
        <option value="" disabled>
          {field.placeholder || "Select an option"}
        </option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RadioField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-3">
      <FieldLabel label={field.label} required={field.validation.required} />
      <div className="space-y-2">
        {field.options?.map((option) => (
          <label key={option.value} className="flex items-center gap-3 text-sm text-foreground">
            <input type="radio" value={option.value} {...register(field.id)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CheckboxField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-3">
      <FieldLabel label={field.label} required={field.validation.required} />
      <div className="space-y-2">
        {field.options?.map((option) => (
          <label key={option.value} className="flex items-center gap-3 text-sm text-foreground">
            <input type="checkbox" value={option.value} {...register(field.id)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RatingField({
  field,
  register,
  error,
  setValue,
  watch,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
  setValue: (name: string, value: number, options?: Record<string, unknown>) => void;
  watch: (name: string) => number | undefined;
}) {
  const value = watch(field.id) || 0;

  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <div className="flex items-center gap-1 py-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(field.id, star, { shouldValidate: true })}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                star <= (value || 0)
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted-foreground/30",
              )}
            />
          </button>
        ))}
      </div>
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SliderField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <input
        type="range"
        min={field.validation.min || 0}
        max={field.validation.max || 100}
        step={1}
        {...register(field.id, { valueAsNumber: true })}
        className="w-full"
      />
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
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
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Input
        type="date"
        {...register(field.id)}
        className="h-11 rounded-[0.45rem] border-input bg-background px-4 text-sm"
      />
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FileField({
  field,
  register,
  error,
}: {
  field: FormFieldItem;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[0.45rem] border-2 border-dashed border-input bg-muted/30 px-4 py-8 text-sm text-muted-foreground">
        <Upload className="h-5 w-5" />
        <span>
          {field.placeholder || `Upload ${field.type === "file_upload_image" ? "image" : "file"}`}
        </span>
        <input type="file" className="hidden" {...register(field.id)} />
      </label>
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
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
    <div className="space-y-2">
      <FieldLabel label={field.label} required={field.validation.required} />
      <Input
        type="url"
        placeholder={field.placeholder || "https://example.com/image.jpg"}
        {...register(field.id)}
        className="h-11 rounded-[0.45rem] border-input bg-background px-4 text-sm"
      />
      <FieldDescription text={field.helperText} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

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
  switch (field.type) {
    case "short_text":
    case "email":
    case "number":
    case "URL":
      return <TextField field={field} register={register} error={error} />;
    case "long_text":
      return <TextAreaField field={field} register={register} error={error} />;
    case "dropdown":
      return <SelectField field={field} register={register} error={error} />;
    case "radio":
      return <RadioField field={field} register={register} error={error} />;
    case "checkbox":
    case "multiple_choice":
      return <CheckboxField field={field} register={register} error={error} />;
    case "rating":
      return (
        <RatingField
          field={field}
          register={register}
          error={error}
          setValue={setValue}
          watch={watch}
        />
      );
    case "slider":
      return <SliderField field={field} register={register} error={error} />;
    case "date":
      return <DateField field={field} register={register} error={error} />;
    case "file_upload_image":
    case "file_upload_pdf":
      return <FileField field={field} register={register} error={error} />;
    case "image":
      return <ImageUrlField field={field} register={register} error={error} />;
    default:
      return <TextField field={field} register={register} error={error} />;
  }
}

interface FormUIProps {
  formData: FormData;
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  className?: string;
  isSubmitting?: boolean;
}

export default function FormUI({
  formData,
  onSubmit,
  className,
  isSubmitting = false,
}: FormUIProps) {
  const schema = useMemo(() => buildSchema(formData.fields), [formData.fields]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(formData.fields),
    mode: "onBlur",
  });

  const { register, handleSubmit, setValue, watch, formState } = form;

  const submit = async (values: z.infer<typeof schema>) => {
    await onSubmit(values as Record<string, unknown>);
  };

  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{formData.title}</h1>
        {formData.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {formData.description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {formData.fields.map((field) => (
          <div key={field.id} className="rounded-[0.45rem]  bg-card p-5 ">
            <RenderField
              field={field}
              register={register}
              error={formState.errors[field.id]?.message as string | undefined}
              setValue={setValue}
              watch={watch}
            />
          </div>
        ))}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-[0.45rem] bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              formData.settings.submitButtonText || "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
