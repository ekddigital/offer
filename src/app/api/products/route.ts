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
    const result = productQuerySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const query = result.data;
    // Explicitly parse as numbers to avoid TypeScript 'unknown' errors
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

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
        skip: (page - 1) * limit,
        take: limit,
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
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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

    // Extract imageIds if present
    const { imageIds, ...productData } = body;

    const product = await db.product.create({
      data: {
        ...productData,
        price: productData.price ? new Prisma.Decimal(productData.price) : null,
      },
    });

    // If imageIds provided, create associations
    if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
      await db.prodAsset.createMany({
        data: imageIds.map((assetId: string, index: number) => ({
          productId: product.id,
          assetId,
          sortOrder: index,
        })),
      });
    }

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
