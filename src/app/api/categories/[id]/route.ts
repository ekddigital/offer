import { NextRequest, NextResponse } from "next/server";
import { db, Prisma } from "@/lib/db";
import { categoryUpdateSchema } from "@/lib/validation/categories";

type Ctx = { params: Promise<{ id: string }> };

// ============================================================================
// GET /api/categories/[id]
// ============================================================================
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const category = await db.category.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (err) {
    console.error("[GET /api/categories/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ============================================================================
// PATCH /api/categories/[id]
// ============================================================================
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = categoryUpdateSchema.parse(body);

    const category = await db.category.update({ where: { id }, data });
    return NextResponse.json(category);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }
    console.error("[PATCH /api/categories/[id]]", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/categories/[id]
// ============================================================================
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await db.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }
    console.error("[DELETE /api/categories/[id]]", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
