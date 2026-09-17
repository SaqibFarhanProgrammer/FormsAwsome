import { ViewSyncQueue } from "@/core/services/bullMQ/queue";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const job = await ViewSyncQueue.add("test-job", {
      slug: "test-form",
      visitorId: "test-visitor-123",
    });
    

    return NextResponse.json({
      success: true,
      jobId: job.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}