import mongoose from "mongoose";
import { SubmissionType } from "../types/submissions.types";

const submissionSchema = new mongoose.Schema<SubmissionType>(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },
    formVersion: {
      type: Number,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // dynamic object
      required: true,
      default: {},
    },
    meta: {
      ip: { type: String },
      userAgent: { type: String },
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

submissionSchema.index({ formId: 1, createdAt: -1 });

export const Submission =
  mongoose.models.Submission || mongoose.model<SubmissionType>("Submission", submissionSchema);
