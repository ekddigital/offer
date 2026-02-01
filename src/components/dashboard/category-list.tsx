"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";

interface CategoryListProps {
  initialCategories: Array<{
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
    parent: { name: string } | null;
    _count: { products: number; children: number };
  }>;
  totalCount: number;
}

export function CategoryList({
  initialCategories,
  totalCount,
}: CategoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return initialCategories.slice(startIndex, endIndex);
  }, [currentPage, initialCategories, itemsPerPage]);

  return (
    <>
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
            {paginatedCategories.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No categories yet.
                </td>
              </tr>
            )}
            {paginatedCategories.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/categories/${c.id}`}
                    className="text-brand-secondary hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.parent?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {c._count.products}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {c._count.children}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {c.sortOrder}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCount > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    </>
  );
}
