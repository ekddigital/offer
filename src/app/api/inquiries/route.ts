import { NextRequest, NextResponse } from "next/server";
import { db, Prisma } from "@/lib/db";
import {
  inquiryCreateSchema,
  inquiryQuerySchema,
  type InquiryQuery,
} from "@/lib/validation/inquiries";

// ============================================================================
// GET /api/inquiries - List inquiries with pagination
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = inquiryQuerySchema.parse(params);
    const query: InquiryQuery = {
      page: parsed.page,
      limit: parsed.limit,
      status: parsed.status,
    };

    const where: Prisma.InquiryWhereInput = {};
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      db.inquiry.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { id: true, name: true } },
        },
      }),
      db.inquiry.count({ where }),
    ]);

    return NextResponse.json({
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/inquiries]", err);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/inquiries - Create an inquiry (public endpoint)
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = inquiryCreateSchema.parse(body);

    const inquiry = await db.inquiry.create({ data });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err },
        { status: 400 },
      );
    }
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}
