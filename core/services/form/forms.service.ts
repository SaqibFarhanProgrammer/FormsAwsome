// core/services/form/CreateForm.service.ts
import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/appError";
import { connectDB } from "@/core/db/connectDb";
import { getUserIdFromToken, verifyAccessToken } from "@/lib/auth/jwt.lib";
import { cookies } from "next/headers";
import {
  DeleteDataFromRedis,
  GetDataFromRedis,
  IsDataExitsInRedis,
  SetDataToRedisWithTTL,
} from "@/lib/redis/redis";
import { Submission } from "@/features/submissions/models/submission.model";
import { FormState } from "@/features/form-builder/types/form-builder.types";
import { Form } from "@/features/form-builder/models/form-builder.model";
import type { FormField } from "@/features/form-builder/models/form-builder.model";

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
    fields,
    settings: {
      submitButtonText: settings?.submitButtonText || "Submit",
      successMessage: settings?.successMessage || "Thank you for your submission!",
      redirectUrl: settings?.redirectUrl || null,
      notifyEmail: settings?.notifyEmail || null,
    },
  });

  const formData = {
    id: form._id,
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

  await connectDB();

  // Find form by ID or slug
  const isFormExit = await Form.findOne({ slug: formIdOrSlug });
  let form;
  if (!isFormExit) {
    form = await Form.findOne({ slug: formIdOrSlug });
  }

  if (!form) {
    throw new AppError("Form not found", 404);
  }

  // Check if user owns the form
  if (form.userId.toString() !== userid) {
    throw new AppError("Unauthorized to update this form", 403);
  }

  // Update fields
  if (title !== undefined) {
    form.title = title.trim();
  }

  if (description !== undefined) {
    form.description = description?.trim() || "";
  }

  if (fields !== undefined) {
    if (!Array.isArray(fields)) {
      throw new AppError("Fields must be an array", 400);
    }
    form.fields = fields;
  }

  if (settings !== undefined) {
    form.settings = {
      submitButtonText: settings?.submitButtonText || "Submit",
      successMessage: settings?.successMessage || "Thank you for your submission!",
      redirectUrl: settings?.redirectUrl || null,
      notifyEmail: settings?.notifyEmail || null,
    };
  }

  if (state !== undefined) {
    form.state = state;
  }

  // Increment version
  form.version += 1;

  await form.save();

  const formData = {
    id: form._id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    version: form.version,
    fields: form.fields,
    settings: form.settings,
    state: form.state,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  };

  // Clear old cache and set new cache
  const cacheKeyById = `form:${form._id}`;
  const cacheKeyBySlug = `form:slug:${form.slug}`;

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

  const cacheKey = `public:form:${slug}`;
  const cacheExists = await IsDataExitsInRedis(cacheKey);

  if (cacheExists) {
    const cachedForm = await GetDataFromRedis(cacheKey);
    if (cachedForm) {
      return JSON.parse(cachedForm);
    }
  }

  await connectDB();
  const form = await Form.findOne({
    slug,
    state: FormState.PUBLISHED,
  });

  if (!form) {
    throw new AppError("Form not found or not published", 404);
  }

  const formData = {
    id: form._id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    fields: form.fields,
    settings: form.settings,
  };

  // Cache for 1 hour
  await SetDataToRedisWithTTL(cacheKey, JSON.stringify(formData), 3600 * 5);

  return formData;
}
