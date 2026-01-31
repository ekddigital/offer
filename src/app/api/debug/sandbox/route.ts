import { NextResponse } from "next/server";
import { getSandboxEmails, clearSandboxEmails } from "@/lib/api/ekdsend";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const sandboxData = await getSandboxEmails(limit);

    return NextResponse.json({
      success: true,
      message: "Sandbox emails retrieved successfully",
      ...sandboxData,
    });
  } catch (error) {
    console.error("❌ Sandbox emails error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const result = await clearSandboxEmails();

    return NextResponse.json({
      success: true,
      message: "Sandbox emails cleared successfully",
      ...result,
    });
  } catch (error) {
    console.error("❌ Clear sandbox emails error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
