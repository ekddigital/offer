import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoryCreateSchema } from "@/lib/validation/categories";

// ============================================================================
// GET /api/categories - List all categories (tree structure)
// ============================================================================
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { products: true, children: true } },
      },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/categories - Create a category
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = categoryCreateSchema.parse(body);

    const category = await db.category.create({ data });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err },
        { status: 400 },
      );
    }
    console.error("[POST /api/categories]", err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
