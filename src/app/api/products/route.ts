import { NextRequest, NextResponse } from "next/server";
import { db, Prisma } from "@/lib/db";
import {
  productCreateSchema,
  productQuerySchema,
  type ProductQuery,
} from "@/lib/validation/products";

// ============================================================================
// GET /api/products - List products with pagination & filters
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const query: ProductQuery = productQuerySchema.parse(params);

    const where: Prisma.ProductWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.featured !== undefined) where.featured = query.featured;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { sku: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          supplier: { select: { id: true, name: true } },
          assets: {
            take: 1,
            orderBy: { sortOrder: "asc" },
            include: { asset: { select: { url: true } } },
          },
        },
      }),
      db.product.count({ where }),
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
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/products - Create a product
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = productCreateSchema.parse(body);

    const product = await db.product.create({
      data: {
        ...data,
        price: data.price ? new Prisma.Decimal(data.price) : null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err },
        { status: 400 },
      );
    }
    console.error("[POST /api/products]", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
