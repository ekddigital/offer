import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { db } from "@/lib/db";

const ASSETS_BASE_URL = env.ASSETS_BASE_URL;
const ASSETS_API_KEY = env.ASSETS_API_KEY;

export async function POST(req: NextRequest) {
  try {
    // Check if Assets API is configured
    if (!ASSETS_API_KEY || ASSETS_API_KEY === "") {
      return NextResponse.json(
        {
          error:
            "Assets API not configured. Please set ASSETS_API_KEY in your .env.local file.",
        },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max size is 15MB." },
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    // Upload to Assets API
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("client_id", "andoffer");
    uploadFormData.append("project_name", "products");
    uploadFormData.append("asset_type", "image");

    const response = await fetch(`${ASSETS_BASE_URL}/api/v1/assets/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ASSETS_API_KEY}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Assets API error:", errorText);
      console.error("Assets API Key present:", !!ASSETS_API_KEY);
      console.error("Assets Base URL:", ASSETS_BASE_URL);

      // Parse error if JSON
      let errorMessage = "Upload to assets service failed";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return NextResponse.json(
        {
          error: `Assets API Error: ${errorMessage}. Please check your ASSETS_API_KEY configuration.`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Assets API returns: { success, id, name, size, mime_type, public_url, ... }
    // Use the full public URL from the Assets API
    const fullUrl = `${ASSETS_BASE_URL}${data.public_url}`;

    // Store asset reference in database
    const asset = await db.asset.create({
      data: {
        name: data.name,
        url: fullUrl,
        type: "IMAGE",
        mimeType: data.mime_type,
        size: data.size,
      },
    });

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        name: asset.name,
        url: asset.url,
        type: asset.type,
        size: asset.size,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
