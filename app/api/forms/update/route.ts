import { connectDB } from "@/core/db/connectDb";
import { Form } from "@/features/form-builder/models/form-builder.model";
import { getApiAuthContext } from "@/lib/auth/api-auth";
import { AppError } from "@/lib/auth/appError";
import { FormFieldType, FormSettings } from "@/redux/features/form-builder/form.slice";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fields,
      title,
      description,
      slug,
      settings,
    }: {
      fields: FormFieldType[];
      title?: string;
      description?: string;
      slug?: string;
      settings?: FormSettings;
    } = body;

    const data = await getApiAuthContext(request);

    if (!fields) {
      throw new AppError("Form ID is required", 400);
    }

    if (!slug) {
      throw new AppError("Form slug is required", 400);
    }
    if (!title && !description) {
      throw new AppError("At least one of title or description must be provided", 400);
    }

    await connectDB();

    await Form.updateOne(
      { slug: slug, userId: data?.userId },

      {
        title: title,
        description: description,
        fields: fields,
        ...(settings && { settings }),
      },
    );

    return NextResponse.json({ message: "Form metadata updated successfully" }, { status: 200 });
  } catch (error) {
    return CatchErrorFunctionForRoute(error, "Update Form Meta");
  }
}
