import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supplierUpdateSchema } from "@/lib/validation/suppliers";
import { Prisma } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

// ============================================================================
// GET /api/suppliers/[id]
// ============================================================================
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const supplier = await db.supplier.findUnique({
      where: { id },
      include: {
        products: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, slug: true, status: true },
        },
        _count: { select: { products: true } },
      },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(supplier);
  } catch (err) {
    console.error("[GET /api/suppliers/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ============================================================================
// PATCH /api/suppliers/[id]
// ============================================================================
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = supplierUpdateSchema.parse(body);

    const supplier = await db.supplier.update({ where: { id }, data });
    return NextResponse.json(supplier);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[PATCH /api/suppliers/[id]]", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/suppliers/[id]
// ============================================================================
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await db.supplier.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[DELETE /api/suppliers/[id]]", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
