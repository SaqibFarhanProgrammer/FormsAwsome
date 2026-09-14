import { z } from "zod";

export const analyticsQuerySchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .superRefine((filters, context) => {
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      context.addIssue({
        code: "custom",
        message: "startDate must be before endDate",
        path: ["startDate"],
      });
    }
  });

export const formIdentifierSchema = z.string().trim().min(1).max(100);
export const submissionDataSchema = z.record(z.string(), z.unknown());
