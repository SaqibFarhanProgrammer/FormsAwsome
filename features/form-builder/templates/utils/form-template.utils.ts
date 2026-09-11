"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import type { FormData, FormFieldItem } from "../../models/FormData";

/* ==========================================
   Form Validation Schema
   ========================================== */
export function buildSchema(fields: FormFieldItem[]) {
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
        if (field.validation.min !== undefined)
          schema = (schema as z.ZodString).min(
            field.validation.min,
            `Minimum ${field.validation.min} characters required`,
          );
        if (field.validation.max !== undefined)
          schema = (schema as z.ZodString).max(
            field.validation.max,
            `Maximum ${field.validation.max} characters allowed`,
          );
        break;
    }
    if (field.validation.pattern)
      schema = (schema as z.ZodString).regex(
        new RegExp(field.validation.pattern),
        "Invalid format",
      );

    if (!field.validation.required) {
      if (["checkbox", "multiple_choice", "rating", "slider", "number"].includes(field.type))
        schema = schema.optional();
      else if (!["heading", "divider"].includes(field.type)) schema = schema.optional();
    } else if (field.type === "checkbox" || field.type === "multiple_choice") {
      schema = (schema as z.ZodArray<z.ZodString>).min(1, "Select at least one option");
    } else if (field.type === "toggle") {
      schema = (schema as z.ZodBoolean).refine((v) => v === true, "This field is required");
    } else if (["rating", "slider", "number"].includes(field.type)) {
      schema = schema.refine(
        (v) => v !== undefined && v !== null && !Number.isNaN(v as number),
        "This field is required",
      );
    } else if (!["heading", "divider"].includes(field.type)) {
      schema = (schema as z.ZodString).min(1, "This field is required");
    }
    shape[field.id] = schema;
  }
  return z.object(shape);
}

export type TemplateValue = string | number | boolean | string[] | undefined;

export function buildDefaults(fields: FormFieldItem[]): Record<string, TemplateValue> {
  const defaults: Record<string, TemplateValue> = {};
  for (const field of fields) {
    if (field.type === "checkbox" || field.type === "multiple_choice") defaults[field.id] = [];
    else if (field.type === "toggle") defaults[field.id] = field.defaultValue ?? false;
    else if (["rating", "slider", "number"].includes(field.type))
      defaults[field.id] = field.defaultValue ?? undefined;
    else defaults[field.id] = field.defaultValue ?? "";
  }
  return defaults;
}

/* ==========================================
   Form Hook
   ========================================== */
export interface TemplateForm {
  values: Record<string, TemplateValue>;
  errors: Record<string, string>;
  setValue: (id: string, value: TemplateValue) => void;
  submit: () => Promise<void>;
  submitting: boolean;
  successMsg: string | null;
  submitError: string | null;
}

export function useTemplateForm(formData: FormData, submitUrl: string): TemplateForm {
  const schema = useMemo(() => buildSchema(formData.fields), [formData.fields]);
  const [values, setValues] = useState<Record<string, TemplateValue>>(() =>
    buildDefaults(formData.fields),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setValue = (id: string, value: TemplateValue) => setValues((p) => ({ ...p, [id]: value }));

  const submit = async () => {
    setSubmitError(null);
    const result = schema.safeParse(values);
    if (!result.success) {
      const map: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const k = String(issue.path[0]);
        if (!map[k]) map[k] = issue.message;
      }
      setErrors(map);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Unable to submit the form");
      setSuccessMsg(formData.settings.successMessage || "Thank you for your submission!");
      setValues(buildDefaults(formData.fields));
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Unable to submit the form");
    } finally {
      setSubmitting(false);
    }
  };

  return { values, errors, setValue, submit, submitting, successMsg, submitError };
}
