// app/api/forms/publish/route.ts

import { connectDB } from "@/core/db/connectDb";
import { Form } from "@/features/form-builder/models/form-builder.model";
import { FormState } from "@/features/form-builder/types/form-builder.types";
import { getUserIdFromToken } from "@/lib/auth/jwt.lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    const form = await Form.findOne({ slug, userId });
    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    form.state = FormState.PUBLISHED;

    await form.save();

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const publishedUrl = `${origin}/f/${form.slug}`;

    return NextResponse.json(
      {
        message: "Form published successfully",
        url: publishedUrl,
        state: form.state,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Publish form error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
