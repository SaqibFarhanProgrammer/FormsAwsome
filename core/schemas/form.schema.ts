import { z } from "zod";

const fieldOptionSchema = z.object({
  label: z.string().trim().min(1).max(200),
  value: z.string().trim().min(1).max(200),
});

export const formFieldSchema = z.object({
  id: z.string().trim().min(1).max(100),
  type: z.string().trim().min(1).max(50),
  label: z.string().trim().min(1).max(200),
  placeholder: z.string().max(500).optional(),
  helperText: z.string().max(500).optional(),
  formType: z.string().max(100).optional(),
  uiType: z.string().max(100).optional(),
  required: z.boolean().optional(),
  validation: z
    .object({
      required: z.boolean().default(false),
      min: z.number().int().nonnegative().optional(),
      max: z.number().int().nonnegative().optional(),
      pattern: z.string().max(500).optional(),
    })
    .optional(),
  options: z.array(fieldOptionSchema).max(100).optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

const formSettingsSchema = z.object({
  submitButtonText: z.string().trim().min(1).max(100).optional(),
  successMessage: z.string().trim().min(1).max(500).optional(),
  redirectUrl: z.string().url().max(2048).nullable().optional(),
  notifyEmail: z.string().email().max(254).nullable().optional(),
});

export const createFormSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  fields: z.array(formFieldSchema).max(100),
  settings: formSettingsSchema.optional(),
});

export const updateFormSchema = createFormSchema
  .omit({ slug: true })
  .partial()
  .extend({ state: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional() });
