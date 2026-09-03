import { connectDB } from "@/core/db/connectDb";
import { Form } from "@/features/form-builder/models/form-builder.model";
import { AppError } from "@/lib/auth/appError";
import { FormFieldType, FormSettings } from "@/redux/features/form-builder/form.slice";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    // incomming data

    // id
    // :
    // "FDlzZ7LQIAK4Vr7yZiH-e"
    // label
    // :
    // "Radio"
    // options
    // :
    // Array(1)
    // 0
    // :
    // "intermediate"
    // length
    // :
    // 1
    // [[Prototype]]
    // :
    // Array(0)
    // order
    // :
    // 3
    // placeholder
    // :
    // "Enter radio..."
    // required
    // :
    // false
    // type
    // :
    // "radio"

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
      { slug: slug },
      {
        title: title,
        description: description,
        fields: fields,
        ...(settings && { settings }),
      },
    );

    return NextResponse.json({ message: "Form metadata updated successfully" }, { status: 200 });
  } catch (error) {
    CatchErrorFunctionForRoute(error as Error, "Update Form Meta");
  }
}
