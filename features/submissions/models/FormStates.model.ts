import mongoose, { ObjectId } from "mongoose";

type FormStatesType = {
  formid: string | mongoose.Types.ObjectId;
  totalSubmissions: number;
  totalViews: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const formStatesSchema = new mongoose.Schema<FormStatesType>(
  {
    formid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const FormStatesModel =
  mongoose.models.FormStates || mongoose.model<FormStatesType>("FormStates", formStatesSchema);
