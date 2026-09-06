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
    },

    country: {
      type: String,
    },

    countryCode: {
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

export const FormView =
  mongoose.models.FormView || mongoose.model<FormViewType>("FormView", formViewSchema);
