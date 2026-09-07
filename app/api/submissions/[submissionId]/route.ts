import { NextResponse } from "next/server";
import { deleteSubmissionService, getSubmissionService } from "@/core/services/form/forms.service";
import { CatchErrorFunctionForRoute } from "@/utils/catchErrorFunction";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  try {
    const { submissionId } = await params;
    const data = await getSubmissionService(submissionId);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to load submission"),
      "GET SUBMISSION ERROR",
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  try {
    const { submissionId } = await params;
    await deleteSubmissionService(submissionId);
    return NextResponse.json({ success: true, message: "Submission deleted successfully" });
  } catch (error: unknown) {
    return CatchErrorFunctionForRoute(
      error instanceof Error ? error : new Error("Unable to delete submission"),
      "DELETE SUBMISSION ERROR",
    );
  }
}
