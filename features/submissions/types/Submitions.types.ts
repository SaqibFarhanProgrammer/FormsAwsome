import mongoose from "mongoose";

export type SubmissionMeta = {
  ip?: string;
  userAgent?: string;
};

export type SubmissionType = {
  formId: mongoose.Types.ObjectId | string; // Allow string for flexibility
  formVersion: number;
  data: [
    {
      field_id: string;
      value: any;
    },
  ];
  meta: SubmissionMeta;
};
