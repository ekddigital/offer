import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const configUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  label: z.string().optional(),
});

const configBatchSchema = z.array(configUpdateSchema);

// ============================================================================
// GET /api/config - Get all site configs
// ============================================================================
export async function GET() {
  try {
    const configs = await db.siteConfig.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json(configs);
  } catch (err) {
    console.error("[GET /api/config]", err);
    return NextResponse.json(
      { error: "Failed to fetch configs" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/config - Update configs (batch upsert)
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = configBatchSchema.parse(body);

    await db.$transaction(
      items.map((item) =>
        db.siteConfig.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value, label: item.label },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("[POST /api/config]", err);
    return NextResponse.json(
      { error: "Failed to update configs" },
      { status: 500 }
    );
  }
}
