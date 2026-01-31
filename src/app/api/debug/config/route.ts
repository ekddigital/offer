import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const config = {
      hasMailApiKey: !!env.ANDOFFER_MAIL_API_KEY,
      mailApiKeyLength: env.ANDOFFER_MAIL_API_KEY?.length || 0,
      defaultFromEmail: env.ANDOFFER_DEFAULT_FROM,
      hasAssetsApiKey: !!env.ASSETS_API_KEY,
      assetsBaseUrl: env.ASSETS_BASE_URL,
    };

    console.log("🔧 Configuration check:", config);

    return NextResponse.json({
      success: true,
      message: "Configuration checked successfully",
      config,
    });
  } catch (error) {
    console.error("❌ Configuration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
