import Link from "next/link";
import { db } from "@/lib/db";
import { CategoryList } from "@/components/dashboard/category-list";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
  });

  const totalCount = await db.category.count();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/categories/new"
          className="rounded-lg border-2 border-[#A5F3FC] bg-[#A5F3FC] px-4 py-2 text-sm font-semibold text-[#0B1220] shadow-sm transition hover:bg-[#67E8F9] hover:border-[#67E8F9]"
        >
          + Add Category
        </Link>
      </div>

      <CategoryList initialCategories={categories} totalCount={totalCount} />
    </div>
  );
}
