import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      supplier: { select: { name: true } },
    },
  });

  type ProductWithRelations = (typeof products)[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/new"
          className="rounded-lg bg-brand-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary-dark"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Supplier</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p: ProductWithRelations) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/products/${p.id}`}
                    className="text-brand-secondary hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.sku ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : p.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.supplier?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {p.price ? `${p.currency} ${p.price}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
