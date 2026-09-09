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

    visitorId: {
      type: String,
      index: true,
    },

    ip: {
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

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const FormView =
  mongoose.models.FormView || mongoose.model<FormViewType>("FormView", formViewSchema);

export const FormViews =
  mongoose.models.FormViews || mongoose.model<FormViewType>("FormViews", formViewSchema);
