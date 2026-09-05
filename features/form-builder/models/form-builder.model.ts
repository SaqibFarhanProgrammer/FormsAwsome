import mongoose from "mongoose";
import { FormState } from "../types/form-builder.types";

export type FormField = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  options?: {
    label: string;
    value: string;
  }[];
  validation: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
};

export type FormType = {
  _id?: string | mongoose.Types.ObjectId;
  title: string;
  description?: string;
  userId: mongoose.Types.ObjectId | string;
  slug: string;
  version: number;
  fields: FormField[];
  settings: {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
    notifyEmail?: string;
  };
  state: FormState;
};

const formSchema = new mongoose.Schema<FormType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    fields: {
      type: [
        {
          id: { type: String, required: true },
          type: { type: String, required: true },
          label: { type: String, required: true },
          placeholder: { type: String },
          helperText: { type: String },
          options: [
            {
              label: { type: String, required: true },
              value: { type: String, required: true },
            },
          ],
          validation: {
            required: { type: Boolean, default: false },
            min: { type: Number },
            max: { type: Number },
            pattern: { type: String },
          },
        },
      ],
      default: [],
    },
    settings: {
      submitButtonText: { type: String, default: "Submit" },
      successMessage: { type: String, default: "Thank you for your submission!" },
      redirectUrl: { type: String },
      notifyEmail: { type: String },
    },
    state: {
      type: String,
      enum: Object.values(FormState),
      default: FormState.DRAFT,
    },
  },
  {
    timestamps: true,
  },
);

export const Form = mongoose.models.Form || mongoose.model<FormType>("Form", formSchema);
