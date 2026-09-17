import mongoose from "mongoose";

export type FormViewType = {
  formId: mongoose.Types.ObjectId | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  count: number | string;
};

const FormViewSchema = new mongoose.Schema<FormViewType>(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

FormViewSchema.index({ formId: 1 });


export const FormViewModel = mongoose.models.FormViewModel || mongoose.model<FormViewType>("FormViewModel", FormViewSchema);
