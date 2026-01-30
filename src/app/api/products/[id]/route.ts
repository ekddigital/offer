import { NextRequest, NextResponse } from "next/server";
import { db, Prisma } from "@/lib/db";
import { productUpdateSchema } from "@/lib/validation/products";

type Ctx = { params: Promise<{ id: string }> };

// ============================================================================
// GET /api/products/[id] - Get single product
// ============================================================================
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        inventory: true,
        assets: {
          orderBy: { sortOrder: "asc" },
          include: { asset: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("[GET /api/products/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// ============================================================================
// PATCH /api/products/[id] - Update product
// ============================================================================
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = productUpdateSchema.parse(body);

    const product = await db.product.update({
      where: { id },
      data: {
        ...data,
        price:
          data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    const prismaErr = err as Prisma.PrismaClientKnownRequestError | null;
    if (prismaErr?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[PATCH /api/products/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/products/[id] - Delete product
// ============================================================================
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    await db.product.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const prismaErr = err as Prisma.PrismaClientKnownRequestError | null;
    if (prismaErr?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[DELETE /api/products/[id]]", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
