import { NextRequest, NextResponse } from "next/server";
import { db, Prisma } from "@/lib/db";
import { inquiryUpdateSchema } from "@/lib/validation/inquiries";

type Ctx = { params: Promise<{ id: string }> };

// ============================================================================
// GET /api/inquiries/[id]
// ============================================================================
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const inquiry = await db.inquiry.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(inquiry);
  } catch (err) {
    console.error("[GET /api/inquiries/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ============================================================================
// PATCH /api/inquiries/[id] - Update status
// ============================================================================
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = inquiryUpdateSchema.parse(body);

    const inquiry = await db.inquiry.update({ where: { id }, data });
    return NextResponse.json(inquiry);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[PATCH /api/inquiries/[id]]", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/inquiries/[id]
// ============================================================================
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await db.inquiry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[DELETE /api/inquiries/[id]]", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
