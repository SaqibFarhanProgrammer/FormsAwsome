import mongoose from "mongoose";
import { FormViewType } from "../types/FormViews.types";

const formViewSchema = new mongoose.Schema<FormViewType>(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },
    ip: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    visitorId: {
      type: String,
      index: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    region: {
      type: String,
    },
    country: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    city: {
      type: String,
    },
    device: {
      type: String,
      enum: ["mobile", "tablet", "desktop", "tv", "bot", "unknown"],
      default: "unknown",
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

formViewSchema.index({ formId: 1, ip: 1 }, { unique: true });

export const FormView =
  mongoose.models.FormView || mongoose.model<FormViewType>("FormView", formViewSchema);
