import mongoose from "mongoose";

export type DeviceType = "mobile" | "tablet" | "desktop" | "tv" | "bot" | "unknown";

export type FormViewType = {
  formId: mongoose.Types.ObjectId | string;

  visitorId?: string;

  ip?: string;

  country?: string;
  countryCode?: string;

  device: DeviceType;

  browser?: string;
  os?: string;

  userAgent?: string;

  createdAt?: Date;
};
