import { connectDB } from "@/core/db/connectDb";
import { Form } from "@/features/form-builder/models/form-builder.model";
import { AppError } from "@/lib/auth/AppError";
import { CatchErrorFunctionForRoute } from "@/utils/CatchErrorFunction";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, title, description } = body;

    if (!formId) {
      throw new AppError("Form ID is required", 400);
    }

    if (!title && !description) {
      throw new AppError("At least one of title or description must be provided", 400);
    }

    await connectDB();

    await Form.updateOne(
      { _id: formId },
      {
        title: title,
        description: description,
      },
    );

    return NextResponse.json({ message: "Form metadata updated successfully" }, { status: 200 });
  } catch (error) {
    CatchErrorFunctionForRoute(error as Error, "Update Form Meta");
  }
}
