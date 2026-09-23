// core/services/form/CreateForm.service.ts
import { NextRequest } from "next/server";
import { AppError } from "@/lib/auth/appError";
import { connectDB } from "@/core/db/connectDb";
import { getUserIdFromToken, verifyAccessToken } from "@/lib/auth/jwt.lib";
import { cookies } from "next/headers";
import {
  ConnectionToRedis,
  DeleteDataFromRedis,
  GetDataFromRedis,
  SetDataToRedisWithTTL,
} from "@/lib/redis/redis";
import { Submission } from "@/features/submissions/models/submission.model";
import { FormView } from "@/features/submissions/models/FormViews.models";
import { FormState } from "@/features/form-builder/types/form-builder.types";
import { Form } from "@/features/form-builder/models/form-builder.model";
import type { FormField } from "@/features/form-builder/models/form-builder.model";
import { Types } from "mongoose";
import {
  analyticsQuerySchema,
  formIdentifierSchema,
  submissionDataSchema,
} from "@/core/schemas/submission.schema";
import { getUserIPFromServer } from "@/lib/auth/rateLimit";
import { FormStatesModel } from "@/features/submissions/models/FormStates.model";

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

type PublicFormPayload = {
  id: string;
  title: string;
  description?: string;
  slug: string;
  state: string | FormState;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    helperText?: string;
    formType?: string;
    uiType?: string;
    options?: Array<{ label: string; value: string }>;
    validation: {
      required: boolean;
      min?: number;
      max?: number;
      pattern?: string;
    };
  }>;
  settings: {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string | null;
    notifyEmail?: string | null;
  };
  hasSubmitted: boolean;
};

const FORM_CACHE_TTL_SECONDS = 60 * 5;
const FORM_SMALL_DATA_CACHE_TTL_SECONDS = 60 * 5;
const FORM_SUBMISSION_IP_TTL_SECONDS = 60 * 60 * 6;
const FORM_STATE_ANALYTICS_CACHE_TTL_SECONDS = 60 * 5;
const DASHBOARD_STATS_CACHE_TTL_SECONDS = 60 * 10;

function getPublicFormCacheKey(slug: string) {
  return `public:form:${slug}`;
}

function getFormSubmissionKey(slug: string, ip: string) {
  return `public:form:${slug}:submitted:${ip}`;
}

function getFormSubmissionsCacheKey(formId: string, userId: string) {
  return `form:${formId}:submissions:${userId}`;
}

function getFormAnalyticsCacheKey(
  formId: string,
  userId: string,
  filters: { startDate?: string; endDate?: string },
) {
  return `form:${formId}:analytics:${userId}:${filters.startDate ?? ""}:${filters.endDate ?? ""}`;
}

export type DashboardStats = {
  totalForms: number;
  totalSubmissions: number;
  todaySubmissions: number;
  totalViews: number;
  lastMonthViews: number;
};

export async function getDashboardStatsService(): Promise<DashboardStats> {
  const userId = (await getUserIdFromToken()).toString();
  const cacheKey = `dashboard:stats:v2:${userId}`;
  const cachedStats = await GetDataFromRedis(cacheKey);

  if (cachedStats) {
    const parsedStats = JSON.parse(cachedStats) as Partial<DashboardStats>;
    return {
      totalForms: parsedStats.totalForms ?? 0,
      totalSubmissions: parsedStats.totalSubmissions ?? 0,
      todaySubmissions: parsedStats.todaySubmissions ?? 0,
      totalViews: parsedStats.totalViews ?? 0,
      lastMonthViews: parsedStats.lastMonthViews ?? 0,
    };
  }

  await connectDB();
  const forms = await Form.find({ userId }).select("_id").lean();
  const formIds = forms.map((form) => form._id);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalSubmissions, todaySubmissions, totalViews, lastMonthViews] = await Promise.all([
    formIds.length ? Submission.countDocuments({ formId: { $in: formIds } }) : 0,
    formIds.length
      ? Submission.countDocuments({
          formId: { $in: formIds },
          createdAt: { $gte: startOfToday },
        })
      : 0,
    formIds.length ? FormView.countDocuments({ formId: { $in: formIds } }) : 0,
    formIds.length
      ? FormView.countDocuments({
          formId: { $in: formIds },
          createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        })
      : 0,
  ]);

  const stats = {
    totalForms: forms.length,
    totalSubmissions,
    todaySubmissions,
    totalViews,
    lastMonthViews,
  };
  await SetDataToRedisWithTTL(cacheKey, JSON.stringify(stats), DASHBOARD_STATS_CACHE_TTL_SECONDS);
  return stats;
}

async function recordUniqueFormView(formId: string, requestIp?: string) {
  if (!formId || !requestIp || !requestIp.trim()) {
    return;
  }

  const normalizedIp = requestIp.trim();

  try {
    await connectDB();
    const existingView = await FormView.findOne({ formId, ip: normalizedIp }).lean();

    if (existingView) {
      return;
    }

    await FormView.create({ formId, ip: normalizedIp });
  } catch (error: unknown) {
    const mongoError = error as { code?: number; message?: string };
    if (mongoError?.code === 11000) {
      return;
    }
    console.error("Failed to track unique form view:", mongoError?.message || error);
  }
}

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
  const cacheKey = `forms:user:${userId}`;

  const cachedForms = await GetDataFromRedis(cacheKey);
  if (cachedForms) {
    return JSON.parse(cachedForms);
  }

  await connectDB();
  const forms = await Form.find({ userId }).select("-fields -settings").sort({ createdAt: -1 });

  if (!forms || forms.length === 0) {
    await SetDataToRedisWithTTL(cacheKey, JSON.stringify([]), FORM_CACHE_TTL_SECONDS);
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

  await SetDataToRedisWithTTL(cacheKey, JSON.stringify(formsData), FORM_CACHE_TTL_SECONDS);

  return formsData;
}

export async function getSingleFormService(formIdOrSlug: string) {
  if (!formIdOrSlug) {
    throw new AppError("Form ID or slug is required", 400);
  }

  const cacheKeyById = `form:${formIdOrSlug}`;
  const cacheKeyBySlug = `form:slug:${formIdOrSlug}`;

  const cachedById = await GetDataFromRedis(cacheKeyById);
  if (cachedById) {
    return JSON.parse(cachedById);
  }

  const cachedBySlug = await GetDataFromRedis(cacheKeyBySlug);
  if (cachedBySlug) {
    return JSON.parse(cachedBySlug);
  }

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

  await SetDataToRedisWithTTL(cacheKeyById, JSON.stringify(formData), FORM_CACHE_TTL_SECONDS);
  await SetDataToRedisWithTTL(cacheKeyBySlug, JSON.stringify(formData), FORM_CACHE_TTL_SECONDS);

  return formData;
}

export async function updateFormService(request: NextRequest, formIdOrSlug: string) {
  if (!formIdentifierSchema.safeParse(formIdOrSlug).success) {
    throw new AppError("Form ID or slug is required", 400);
  }

  const body = await request.json();
  const { title, description, fields, settings, state } = body;

  const userid = await getUserIdFromToken();
  const newSlug = title ? title.toLowerCase().replace(/ /g, "-") + "-" + userid : undefined;

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

  if (newSlug) {
    isFormExit.slug = newSlug;
  }

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
    slug: isFormExit.slug,
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

export async function getPublicFormService(slug: string): Promise<PublicFormPayload> {
  if (!slug) {
    throw new AppError("Slug is required", 400);
  }

  const userip = await getUserIPFromServer();

  const cacheKey = getPublicFormCacheKey(slug);
  const cachedForm = await GetDataFromRedis(cacheKey);

  if (cachedForm) {
    const parsedCachedForm = JSON.parse(cachedForm) as Partial<PublicFormPayload>;

    if (parsedCachedForm.state !== FormState.PUBLISHED) {
      throw new AppError("Form not found or not published", 404);
    }

    if (userip && parsedCachedForm.id) {
      await recordUniqueFormView(parsedCachedForm.id, userip);
    }

    const hasSubmitted = userip
      ? Boolean(await GetDataFromRedis(getFormSubmissionKey(slug, userip)))
      : false;

    return {
      ...parsedCachedForm,
      hasSubmitted,
    } as PublicFormPayload;
  }

  await connectDB();
  const form = await Form.findOne({ slug });

  if (!form) {
    throw new AppError("Form not found or not published", 404);
  }

  if (form.state !== FormState.PUBLISHED && !(await isFormOwner(form.userId.toString()))) {
    throw new AppError("Form not found or not published", 404);
  }

  await recordUniqueFormView(form._id.toString(), userip);

  const formData = {
    id: form._id.toString(),
    title: form.title,
    description: form.description,
    slug: form.slug,
    state: form.state,
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

  await SetDataToRedisWithTTL(cacheKey, JSON.stringify(formData), FORM_CACHE_TTL_SECONDS);

  const hasSubmitted = userip
    ? Boolean(await GetDataFromRedis(getFormSubmissionKey(slug, userip)))
    : false;

  return {
    ...formData,
    hasSubmitted,
  };
}

export async function submitFormService(
  slug: string,
  data: Record<string, unknown>,
  ip: string | undefined,
  // meta: {
  //   ip?: string;
  //   userAgent?: string;
  //   region?: string;
  //   country?: string;
  //   countryCode?: string;
  //   city?: string;
  //   browser?: string;
  //   os?: string;
  //   device?: string;
  // } = {},
) {
  const parsedData = submissionDataSchema.safeParse(data);
  if (!slug || !parsedData.success) {
    throw new AppError("A valid form submission is required", 400);
  }
  data = parsedData.data;

  const normalizedIp = ip?.trim();
  const ipSubmissionKey = normalizedIp ? getFormSubmissionKey(slug, normalizedIp) : null;

  // if (ipSubmissionKey) {
  //   const existingSubmission = await GetDataFromRedis(ipSubmissionKey);
  //   if (existingSubmission) {
  //     throw new AppError("You have already submitted the form.", 409);
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
  });

  console.log(ip);

  const res = await FormStatesModel.findOne({ formid: form._id });

  let newFormStatesModelLEY = res;

  if (!res) {
    const newFormStatesModel = await FormStatesModel.create({
      formid: form._id,
      totalSubmissions: 1,
    });

    newFormStatesModelLEY = newFormStatesModel;
  }

  const newState = newFormStatesModelLEY && newFormStatesModelLEY.totalSubmissions + 1;
  newFormStatesModelLEY.totalSubmissions = newState;
  newFormStatesModelLEY.save();

  console.log(res);

  const ownerId = form.userId.toString();
  await Promise.all([
    DeleteDataFromRedis(getFormSubmissionsCacheKey(form._id.toString(), ownerId)),
    DeleteDataFromRedis(getFormAnalyticsCacheKey(form._id.toString(), ownerId, {})),
  ]);

  // const formViewPayload = {
  //   formId: form._id,
  //   ip: normalizedIp,
  //   name: typeof data.name === "string" ? data.name.trim() : undefined,
  //   email: typeof data.email === "string" ? data.email.trim() : undefined,
  //   region: meta.region || undefined,
  //   country: meta.country || undefined,
  //   countryCode: meta.countryCode || undefined,
  //   city: meta.city || undefined,
  //   device: meta.device || "unknown",
  //   browser: meta.browser || undefined,
  //   os: meta.os || undefined,
  //   userAgent: meta.userAgent || undefined,
  // };

  const existingView = normalizedIp
    ? await FormView.findOne({ formId: form._id, ip: normalizedIp }).lean()
    : null;

  if (ipSubmissionKey) {
    await SetDataToRedisWithTTL(
      ipSubmissionKey,
      JSON.stringify({
        formId: form._id.toString(),
        submittedAt: new Date().toISOString(),
        viewId: form?._id?.toString?.() ?? existingView?._id?.toString?.() ?? "",
      }),
      FORM_SUBMISSION_IP_TTL_SECONDS,
    );
  }

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

  const dataa = submissions.map((submission) => {
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

  return dataa;
}

export async function getFormSubmissionsService(formIdOrSlug: string) {
  if (!formIdentifierSchema.safeParse(formIdOrSlug).success) {
    throw new AppError("Form ID or slug is required", 400);
  }

  const userId = await getUserIdFromToken();
  await connectDB();

  const form = await findOwnedForm(formIdOrSlug, userId.toString());
  const cacheKey = getFormSubmissionsCacheKey(form._id.toString(), userId.toString());
  const cachedSubmissions = await GetDataFromRedis(cacheKey);
  if (cachedSubmissions) {
    return JSON.parse(cachedSubmissions);
  }

  const submissions = await Submission.find({ formId: form._id }).sort({ createdAt: -1 }).lean();

  const result = submissions.map((submission) => ({
    id: submission._id.toString(),
    formId: form._id.toString(),
    form: form.title,
    data: submission.data,
    meta: submission.meta,
    createdAt: submission.createdAt,
  }));
  await SetDataToRedisWithTTL(cacheKey, JSON.stringify(result), FORM_SMALL_DATA_CACHE_TTL_SECONDS);
  return result;
}

export async function getFormAnalyticsService(
  formIdOrSlug: string,
  filters: { startDate?: string; endDate?: string } = {},
) {
  if (!formIdentifierSchema.safeParse(formIdOrSlug).success) {
    throw new AppError("Form ID or slug is required", 400);
  }

  const parsedFilters = analyticsQuerySchema.safeParse(filters);
  if (!parsedFilters.success) {
    throw new AppError("Invalid analytics date filters", 400);
  }

  const userId = await getUserIdFromToken();
  await connectDB();

  const form = await findOwnedForm(formIdOrSlug, userId.toString());
  const cacheKey = getFormAnalyticsCacheKey(form._id.toString(), userId.toString(), filters);
  const cachedAnalytics = await GetDataFromRedis(cacheKey);
  if (cachedAnalytics) {
    return JSON.parse(cachedAnalytics);
  }
  const dateFilter =
    parsedFilters.data.startDate || parsedFilters.data.endDate
      ? {
          ...(parsedFilters.data.startDate && { $gte: parsedFilters.data.startDate }),
          ...(parsedFilters.data.endDate && { $lte: parsedFilters.data.endDate }),
        }
      : undefined;
  const submissionFilter = { formId: form._id, ...(dateFilter && { createdAt: dateFilter }) };

  const [totalViews, totalSubmissions, lastSubmission, todaySubmissions, weekSubmissions] =
    await Promise.all([
      FormView.countDocuments({ formId: form._id }),
      Submission.countDocuments(submissionFilter),
      Submission.findOne(submissionFilter).sort({ createdAt: -1 }).select("createdAt").lean(),
      Submission.countDocuments({
        ...submissionFilter,
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Submission.countDocuments({
        ...submissionFilter,
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 6)).setHours(0, 0, 0, 0),
        },
      }),
    ]);

  const conversionRate = totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 100) : 0;

  const result = {
    totalViews,
    totalSubmissions,
    conversionRate,
    avgTime: "—",
    lastSubmission: lastSubmission?.createdAt
      ? new Date(lastSubmission.createdAt).toLocaleString()
      : "No submissions yet",
    todaySubmissions,
    weekSubmissions,
  };
  await SetDataToRedisWithTTL(cacheKey, JSON.stringify(result), FORM_SMALL_DATA_CACHE_TTL_SECONDS);
  return result;
}

export async function getFormStateAnalyticsService(formIdOrSlug: string) {
  if (!formIdentifierSchema.safeParse(formIdOrSlug).success) {
    throw new AppError("Form ID or slug is required", 400);
  }

  const userId = await getUserIdFromToken();
  await connectDB();

  const form = await findOwnedForm(formIdOrSlug, userId.toString());
  const cacheKey = `form:${form._id.toString()}:mongo-analytics:${userId.toString()}`;
  const cachedAnalytics = await GetDataFromRedis(cacheKey);

  if (cachedAnalytics) {
    return JSON.parse(cachedAnalytics);
  }

  const [totalSubmissions, totalViews] = await Promise.all([
    Submission.countDocuments({ formId: form._id }),
    FormView.countDocuments({ formId: form._id }),
  ]);

  const result = {
    totalSubmissions,
    totalViews,
    conversionRate: totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 100) : 0,
    avgTime: "—",
    lastSubmission: "No submissions yet",
    todaySubmissions: 0,
    weekSubmissions: 0,
  };

  await SetDataToRedisWithTTL(
    cacheKey,
    JSON.stringify(result),
    FORM_STATE_ANALYTICS_CACHE_TTL_SECONDS,
  );

  return result;
}

export async function getSubmissionService(submissionId: string) {
  if (!Types.ObjectId.isValid(submissionId)) {
    throw new AppError("Submission not found", 404);
  }

  const userId = await getUserIdFromToken();
  await connectDB();

  const submission = await Submission.findById(submissionId).lean();
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const form = await findOwnedForm(submission.formId.toString(), userId.toString());
  const details = Object.entries(submission.data).map(([fieldId, value]) => ({
    label: form.fields.find((field: FormField) => field.id === fieldId)?.label || fieldId,
    value: Array.isArray(value) ? value.join(", ") : String(value ?? ""),
  }));

  return {
    id: submission._id.toString(),
    formId: form._id.toString(),
    form: form.title,
    details,
    meta: submission.meta,
    createdAt: submission.createdAt,
  };
}

export async function deleteSubmissionService(submissionId: string) {
  if (!Types.ObjectId.isValid(submissionId)) {
    throw new AppError("Submission not found", 404);
  }

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
export async function TrackFormViews(slug: string, visitorId: string) {
  if (!visitorId) {
    return;
  }

  const redis = await ConnectionToRedis();

  const IsVisitorExits = await redis.get(`formview:${slug}:visitor:${visitorId}`);

  const formViewVisitorKey = `formview:${slug}:visitor:${visitorId}`;

  const FormViewIdSlug = slug.split("-")[1];

  const result = await redis.set(formViewVisitorKey, "1", {
    EX: 60 * 60 * 24,
    NX: true,
  });

  if (result === "OK") {
    const exitingFormView = await FormStatesModel.findOne({
      formid: FormViewIdSlug,
    });

    const newCount = (exitingFormView?.totalViews ?? 0) + 1;

    if (exitingFormView) {
      exitingFormView.totalViews = newCount;
      await exitingFormView.save();
    }
  } else {
    console.log("Already viewed within 24h");
  }
}
