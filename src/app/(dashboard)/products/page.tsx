import Link from "next/link";
import { db } from "@/lib/db";
import { ProductList } from "@/components/dashboard/product-list";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      supplier: { select: { name: true } },
    },
  });

  const totalCount = await db.product.count();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/new"
          className="rounded-lg border-2 border-[#A5F3FC] bg-[#A5F3FC] px-4 py-2 text-sm font-semibold text-[#0B1220] shadow-sm transition hover:border-[#67E8F9] hover:bg-[#67E8F9]"
        >
          + Add Product
        </Link>
      </div>

      <ProductList initialProducts={products} totalCount={totalCount} />
    </div>
  );
}
