import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await db.supplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  type SupplierWithCount = (typeof suppliers)[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Link
          href="/suppliers/new"
          className="rounded-lg bg-brand-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary-dark"
        >
          + Add Supplier
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Country</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-center font-medium">Products</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {suppliers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No suppliers yet.
                </td>
              </tr>
            )}
            {suppliers.map((s: SupplierWithCount) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/suppliers/${s.id}`}
                    className="text-brand-secondary hover:underline"
                  >
                    {s.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                    {s.country}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">{s._count.products}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      s.active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
