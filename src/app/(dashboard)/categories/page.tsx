import Link from "next/link";
import { db } from "@/lib/db";
import type { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

type CategoryWithRelations = Category & {
  parent: { name: string } | null;
  _count: { products: number; children: number };
};

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/categories/new"
          className="rounded-lg bg-brand-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary-dark"
        >
          + Add Category
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Parent</th>
              <th className="px-4 py-3 text-center font-medium">Products</th>
              <th className="px-4 py-3 text-center font-medium">Children</th>
              <th className="px-4 py-3 text-right font-medium">Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No categories yet.
                </td>
              </tr>
            )}
            {categories.map((c: CategoryWithRelations) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/categories/${c.id}`}
                    className="text-brand-secondary hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {c.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.parent?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">{c._count.products}</td>
                <td className="px-4 py-3 text-center">{c._count.children}</td>
                <td className="px-4 py-3 text-right">{c.sortOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
