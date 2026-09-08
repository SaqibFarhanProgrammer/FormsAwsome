// core/services/form/CreateForm.service.ts
import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/appError";
import { connectDB } from "@/core/db/connectDb";
import { getUserIdFromToken, verifyAccessToken } from "@/lib/auth/jwt.lib";
import { cookies } from "next/headers";
import { DeleteDataFromRedis, SetDataToRedisWithTTL } from "@/lib/redis/redis";
import { Submission } from "@/features/submissions/models/submission.model";
import { FormState } from "@/features/form-builder/types/form-builder.types";
import { Form } from "@/features/form-builder/models/form-builder.model";
import type { FormField } from "@/features/form-builder/models/form-builder.model";
import { Types } from "mongoose";
import { nanoid } from "@reduxjs/toolkit";

type IncomingField = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  formType?: string;
  uiType?: string;
  required?: boolean;
  validation?: FormField["validation"];
  options?: string[] | { label?: string; value?: string }[];
  defaultValue?: string | number | boolean;
  logic?: FormField["logic"];
};

function normalizeFields(fields: IncomingField[]) {
  return fields.map((field) => ({
    id: field.id,
    type: field.type,
    label: field.label,
    placeholder: field.placeholder,
    helperText: field.helperText,
    formType: field.formType,
    uiType: field.uiType,
    defaultValue: field.defaultValue,
    logic: field.logic,
    options: Array.isArray(field.options)
      ? field.options.map((option) =>
          typeof option === "string"
            ? { label: option, value: option }
            : {
                label: option.label ?? option.value ?? "",
                value: option.value ?? option.label ?? "",
              },
        )
      : [],
    validation: {
      required: field.validation?.required ?? field.required ?? false,
      min: field.validation?.min,
      max: field.validation?.max,
      pattern: field.validation?.pattern,
    },
  }));
}

export async function createFormService(request: NextRequest) {
  const body = await request.json();
  const { title, description, slug, fields, settings } = body;

  if (!title || !slug || !fields) {
    throw new AppError("Title, slug and fields are required", 400);
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new AppError("Access token not found", 401);
  }

  let payload;
  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    throw new AppError("Invalid access token", 401);
  }

  const userId = payload.userId;

  await connectDB();

  const existingForm = await Form.findOne({ slug });
  if (existingForm) {
    throw new AppError("Slug already exists", 409);
  }

  const form = await Form.create({
    title: title.trim() || "Untitled Form",
    description: description?.trim() || "",
    userId,
    slug: slug.toLowerCase().trim(),
    fields: normalizeFields(fields),
    settings: {
      submitButtonText: settings?.submitButtonText || "Submit",
      successMessage: settings?.successMessage || "Thank you for your submission!",
      redirectUrl: settings?.redirectUrl || null,
      notifyEmail: settings?.notifyEmail || null,
    },
  });

  const formData = {
    id: form._id.toString(),
    title: form.title,
    description: form.description,
    slug: form.slug,
    fields: form.fields,
    settings: form.settings,
    state: form.state,
  };

  return formData;
}

export async function getAllFormsService() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new AppError("Access token not found", 401);
  }

  let payload;
  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    throw new AppError("Invalid access token", 401);
  }

  const userId = payload.userId;
  // const cacheKey = `forms:user:${userId}`;

  // // Check Redis cache
  // const cacheExists = await IsDataExitsInRedis(cacheKey);
  // if (cacheExists) {
  //   const cachedForms = await GetDataFromRedis(cacheKey);
  //   if (cachedForms) {
  //     return JSON.parse(cachedForms);
  //   }
  // }

  // Get from DB
  await connectDB();
  const forms = await Form.find({ userId }).select("-fields -settings").sort({ createdAt: -1 });

  if (!forms || forms.length === 0) {
    return [];
  }

  const formsData = forms.map((form) => ({
    id: form._id.toString(),
    title: form.title,
    description: form.description,
    slug: form.slug,
    version: form.version,
    state: form.state,
    createdAt: form.createdAt.toString(),
    updatedAt: form.updatedAt.toString(),
  }));

  // Cache for 1 hour
  // await SetDataToRedisWithTTL(cacheKey, JSON.stringify(formsData), 3600);

  return formsData;
}

export async function getSingleFormService(formIdOrSlug: string) {
  if (!formIdOrSlug) {
    throw new AppError("Form ID or slug is required", 400);
  }

  // const cacheKeyById = `form:${formIdOrSlug}`;
  // const cacheKeyBySlug = `form:slug:${formIdOrSlug}`;

  // let cacheExists = await IsDataExitsInRedis(cacheKeyById);
  // if (cacheExists) {
  //   const cachedForm = await GetDataFromRedis(cacheKeyById);
  //   if (cachedForm) {
  //     return JSON.parse(cachedForm);
  //   }
  // }

  // cacheExists = await IsDataExitsInRedis(cacheKeyBySlug);
  // if (cacheExists) {
  //   const cachedForm = await GetDataFromRedis(cacheKeyBySlug);
  //   if (cachedForm) {
  //     return JSON.parse(cachedForm);
  //   }
  //      const userid = await getUserIdFromToken();

  const userid = await getUserIdFromToken();
  await connectDB();

  let form = null;

  try {
    form = await Form.findOne({
      userId: userid,
      $or: [{ slug: formIdOrSlug }],
    });
  } catch {
    form = await Form.findOne({ slug: formIdOrSlug });
  }

  if (!form) {
    form = await Form.findOne({ slug: formIdOrSlug });
  }

  if (!form) {
    throw new AppError("Form not found", 404);
  }

  const formData = {
    _id: form._id!.toString(),
    title: form.title,
    description: form.description,
    slug: form.slug,
    version: form.version,
    userId: form.userId.toString(),
    fields: form.fields.map((field: FormField) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder,
      helperText: field.helperText,
      formType: field.formType,
      uiType: field.uiType,
      options: field.options?.map((option: NonNullable<FormField["options"]>[number]) => ({
        label: option.label,
        value: option.value,
      })),
      validation: {
        required: field.validation.required,
        min: field.validation.min,
        max: field.validation.max,
        pattern: field.validation.pattern,
      },
    })),
    settings: {
      submitButtonText: form.settings.submitButtonText,
      successMessage: form.settings.successMessage,
      redirectUrl: form.settings.redirectUrl,
      notifyEmail: form.settings.notifyEmail,
    },
    state: form.state,
    createdAt: form.createdAt.toString(),
    updatedAt: form.updatedAt.toString(),
  };

  // // Cache for 24 hours
  // await SetDataToRedisWithTTL(cacheKeyById, JSON.stringify(formData), 86400);
  // await SetDataToRedisWithTTL(cacheKeyBySlug, JSON.stringify(formData), 86400);

  return formData;
}

export async function updateFormService(request: NextRequest, formIdOrSlug: string) {
  if (!formIdOrSlug) {
    throw new AppError("Form ID or slug is required", 400);
  }

  const body = await request.json();
  const { title, description, fields, settings, state } = body;

  const userid = await getUserIdFromToken();
  const newSlug = title.toLowerCase().replace(/ /g, "-") + "-" + userid + nanoid(); // Generate a new slug based on the title and user ID

  await connectDB();

  // Find form by ID or slug
  const isFormExit = await Form.findOne({ slug: formIdOrSlug });

  if (!isFormExit) {
    throw new AppError("Form not found", 404);
  }

  // Check if user owns the form
  if (isFormExit.userId.toString() !== userid) {
    throw new AppError("Unauthorized to update this form", 403);
  }

  // Update fields
  if (title !== undefined) {
    isFormExit.title = title.trim();
  }

  if (description !== undefined) {
    isFormExit.description = description?.trim() || "";
  }

  if (fields !== undefined) {
    if (!Array.isArray(fields)) {
      throw new AppError("Fields must be an array", 400);
    }
    isFormExit.fields = normalizeFields(fields);
  }

  if (settings !== undefined) {
    isFormExit.settings = {
      submitButtonText: settings?.submitButtonText || "Submit",
      successMessage: settings?.successMessage || "Thank you for your submission!",
      redirectUrl: settings?.redirectUrl || null,
      notifyEmail: settings?.notifyEmail || null,
    };
  }

  isFormExit.slug = newSlug; // Update slug to the new generated slug

  if (state !== undefined) {
    isFormExit.state = state;
  }

  // Increment version
  isFormExit.version += 1;

  await isFormExit.save();

  const formData = {
    id: isFormExit._id,
    title: isFormExit.title,
    description: isFormExit.description,
    slug: newSlug, // Return the new slug
    version: isFormExit.version,
    fields: isFormExit.fields,
    settings: isFormExit.settings,
    state: isFormExit.state,
    createdAt: isFormExit.createdAt,
    updatedAt: isFormExit.updatedAt,
  };

  // Clear old cache and set new cache
  const cacheKeyById = `form:${isFormExit._id}`;
  const cacheKeyBySlug = `form:slug:${isFormExit.slug}`;

  await SetDataToRedisWithTTL(cacheKeyById, JSON.stringify(formData), 86400);
  await SetDataToRedisWithTTL(cacheKeyBySlug, JSON.stringify(formData), 86400);

  return formData;
}

export async function deleteFormService(
  request: NextRequest,
  action: "delete" | "archive" = "delete",
) {
  const body = await request.json();
  const { slug } = body;

  if (!slug) {
    throw new AppError("Slug is required", 400);
  }

  if (!["delete", "archive"].includes(action)) {
    throw new AppError("Action must be delete or archive", 400);
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new AppError("Access token not found", 401);
  }

  const payload = verifyAccessToken(accessToken);

  const userId = payload.userId;

  await connectDB();

  const form = await Form.findOne({ slug });

  if (!form) {
    throw new AppError("Form not found", 404);
  }

  if (form.userId.toString() !== userId) {
    throw new AppError("Unauthorized to delete this form", 403);
  }

  const cacheKeyById = `form:${form._id}`;
  const cacheKeyBySlug = `form:slug:${slug}`;
  const userFormsCache = `forms:user:${userId}`;

  if (action === "delete") {
    // Delete all submissions
    await Submission.deleteMany({ formId: form._id });

    // Delete the form
    await Form.findByIdAndDelete(form._id);

    // Clear Redis cache
    await DeleteDataFromRedis(cacheKeyById);
    await DeleteDataFromRedis(cacheKeyBySlug);
    await DeleteDataFromRedis(userFormsCache);
  } else if (action === "archive") {
    // Archive the form
    form.state = "ARCHIVED";
    await form.save();

    // Clear cache
    await DeleteDataFromRedis(cacheKeyById);
    await DeleteDataFromRedis(cacheKeyBySlug);
    await DeleteDataFromRedis(userFormsCache);
  }

  return {
    message:
      action === "delete"
        ? "Form and all submissions deleted successfully"
        : "Form archived successfully",
    slug,
    action,
  };
}

export async function getPublicFormService(slug: string) {
  if (!slug) {
    throw new AppError("Slug is required", 400);
  }

  // const cacheKey = `public:form:${slug}`;
  // const cacheExists = await IsDataExitsInRedis(cacheKey);

  // if (cacheExists) {
  //   const cachedForm = await GetDataFromRedis(cacheKey);
  //   if (cachedForm) {
  //     return JSON.parse(cachedForm);
  //   }
  // }

  await connectDB();
  const form = await Form.findOne({ slug });

  if (!form) {
    throw new AppError("Form not found or not published", 404);
  }

  if (form.state !== FormState.PUBLISHED && !(await isFormOwner(form.userId.toString()))) {
    throw new AppError("Form not found or not published", 404);
  }

  const formData = {
    id: form._id.toString(),
    title: form.title,
    description: form.description,
    slug: form.slug,
    fields: form.fields.map((field: FormField) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder,
      helperText: field.helperText,
      formType: field.formType,
      uiType: field.uiType,
      options: field.options?.map((option: NonNullable<FormField["options"]>[number]) => ({
        label: option.label,
        value: option.value,
      })),
      validation: {
        required: field.validation.required,
        min: field.validation.min,
        max: field.validation.max,
        pattern: field.validation.pattern,
      },
    })),
    settings: {
      submitButtonText: form.settings.submitButtonText,
      successMessage: form.settings.successMessage,
      redirectUrl: form.settings.redirectUrl,
      notifyEmail: form.settings.notifyEmail,
    },
  };

  // Cache for 1 hour
  // await SetDataToRedisWithTTL(cacheKey, JSON.stringify(formData), 3600 * 5);

  return formData;
}

export async function submitFormService(
  slug: string,
  data: Record<string, unknown>,
  meta: { ip?: string; userAgent?: string } = {},
) {
  if (!slug || !data || typeof data !== "object" || Array.isArray(data)) {
    throw new AppError("A valid form submission is required", 400);
  }

  await connectDB();
  const form = await Form.findOne({ slug });

  if (!form) {
    throw new AppError("Form not found or not published", 404);
  }

  if (form.state !== FormState.PUBLISHED && !(await isFormOwner(form.userId.toString()))) {
    throw new AppError("Form not found or not published", 404);
  }

  const allowedFieldIds = new Set(form.fields.map((field: FormField) => field.id));
  const unknownFieldId = Object.keys(data).find((fieldId) => !allowedFieldIds.has(fieldId));
  if (unknownFieldId) {
    throw new AppError("Submission contains an invalid field", 400);
  }

  for (const field of form.fields) {
    const value = data[field.id];
    const isEmpty = value === undefined || value === null || value === "";

    if (field.validation.required && isEmpty) {
      throw new AppError(`${field.label} is required`, 400);
    }

    if (!isEmpty && typeof value === "string") {
      if (field.validation.min !== undefined && value.length < field.validation.min) {
        throw new AppError(`${field.label} is too short`, 400);
      }
      if (field.validation.max !== undefined && value.length > field.validation.max) {
        throw new AppError(`${field.label} is too long`, 400);
      }
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        throw new AppError(`${field.label} has an invalid format`, 400);
      }
    }
  }

  const submission = await Submission.create({
    formId: form._id,
    formVersion: form.version,
    data,
    meta,
  });

  return {
    id: submission._id.toString(),
    message: form.settings.successMessage || "Thank you for your submission!",
  };
}

async function isFormOwner(formUserId: string) {
  try {
    return (await getUserIdFromToken()).toString() === formUserId;
  } catch {
    return false;
  }
}

export async function getUserSubmissionsService() {
  const userId = await getUserIdFromToken();
  await connectDB();

  const forms = await Form.find({ userId }).select("_id title fields").lean();
  const formIds = forms.map((form) => form._id);
  const formMap = new Map(forms.map((form) => [form._id.toString(), form]));
  const submissions = await Submission.find({ formId: { $in: formIds } })
    .sort({ createdAt: -1 })
    .lean();

  return submissions.map((submission) => {
    const form = formMap.get(submission.formId.toString());
    const details = Object.entries(submission.data).map(([fieldId, value]) => ({
      label: form?.fields.find((field: FormField) => field.id === fieldId)?.label || fieldId,
      value: Array.isArray(value) ? value.join(", ") : String(value ?? ""),
    }));
    const name = details.find((detail) => detail.label.toLowerCase() === "name")?.value || "-";
    const email = details.find((detail) => detail.label.toLowerCase() === "email")?.value || "-";

    return {
      id: submission._id.toString(),
      form: form?.title || "Deleted form",
      name,
      email,
      date: submission.createdAt.toISOString(),
      status: "new" as const,
      details,
    };
  });
}

export async function getFormSubmissionsService(formIdOrSlug: string) {
  const userId = await getUserIdFromToken();
  await connectDB();

  const form = await findOwnedForm(formIdOrSlug, userId.toString());
  const submissions = await Submission.find({ formId: form._id }).sort({ createdAt: -1 }).lean();

  return submissions.map((submission) => ({
    id: submission._id.toString(),
    formId: form._id.toString(),
    form: form.title,
    data: submission.data,
    meta: submission.meta,
    createdAt: submission.createdAt,
  }));
}

export async function getSubmissionService(submissionId: string) {
  const userId = await getUserIdFromToken();
  await connectDB();

  const submission = await Submission.findById(submissionId).lean();
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const form = await findOwnedForm(submission.formId.toString(), userId.toString());
  return {
    id: submission._id.toString(),
    formId: form._id.toString(),
    form: form.title,
    data: submission.data,
    meta: submission.meta,
    createdAt: submission.createdAt,
  };
}

export async function deleteSubmissionService(submissionId: string) {
  const userId = await getUserIdFromToken();
  await connectDB();

  const submission = await Submission.findById(submissionId).select("formId");
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  await findOwnedForm(submission.formId.toString(), userId.toString());
  await Submission.deleteOne({ _id: submission._id });
}

async function findOwnedForm(formIdOrSlug: string, userId: string) {
  const form = await Form.findOne({
    userId,
    $or: [
      { slug: formIdOrSlug },
      ...(Types.ObjectId.isValid(formIdOrSlug) ? [{ _id: formIdOrSlug }] : []),
    ],
  });

  if (!form) {
    throw new AppError("Form not found", 404);
  }

  return form;
}
