import mongoose from "mongoose";

export type DeviceType = "mobile" | "tablet" | "desktop" | "tv" | "bot" | "unknown";

export type FormViewType = {
  formId: mongoose.Types.ObjectId | string;

  visitorId?: string;

  ip?: string;
  name?: string;
  email?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  city?: string;

  device?: DeviceType;

  browser?: string;
  os?: string;

  userAgent?: string;
  data?: Record<string, unknown>;
  submissionId?: mongoose.Types.ObjectId | string;

  createdAt?: Date;
};
