import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supplierCreateSchema } from "@/lib/validation/suppliers";

// ============================================================================
// GET /api/suppliers - List all suppliers
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    const activeOnly = req.nextUrl.searchParams.get("active") === "true";

    const suppliers = await db.supplier.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(suppliers);
  } catch (err) {
    console.error("[GET /api/suppliers]", err);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/suppliers - Create a supplier
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = supplierCreateSchema.parse(body);

    const supplier = await db.supplier.create({ data });
    return NextResponse.json(supplier, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err },
        { status: 400 },
      );
    }
    console.error("[POST /api/suppliers]", err);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 },
    );
  }
}
