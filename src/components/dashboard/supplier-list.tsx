"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";

interface SupplierListProps {
  initialSuppliers: Array<{
    id: string;
    name: string;
    country: string;
    email: string | null;
    phone: string | null;
    active: boolean;
    _count: { products: number };
  }>;
  totalCount: number;
}

export function SupplierList({
  initialSuppliers,
  totalCount,
}: SupplierListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return initialSuppliers.slice(startIndex, endIndex);
  }, [currentPage, initialSuppliers, itemsPerPage]);

  return (
    <>
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
            {paginatedSuppliers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No suppliers yet.
                </td>
              </tr>
            )}
            {paginatedSuppliers.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/suppliers/${s.id}`}
                    className="text-brand-secondary hover:underline"
                  >
                    {s.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.country}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {s._count.products}
                </td>
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
