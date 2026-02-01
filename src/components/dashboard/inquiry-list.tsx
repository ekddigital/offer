"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";

interface InquiryListProps {
  initialInquiries: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    message: string;
    status: string;
    createdAt: Date;
    product: { name: string } | null;
  }>;
  totalCount: number;
}

const statusColors = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REPLIED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CLOSED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
} as const;

type InquiryStatus = keyof typeof statusColors;

export function InquiryList({
  initialInquiries,
  totalCount,
}: InquiryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const paginatedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return initialInquiries.slice(startIndex, endIndex);
  }, [currentPage, initialInquiries, itemsPerPage]);

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Contact</th>
              <th className="px-4 py-3 text-left font-medium">Message</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedInquiries.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No inquiries yet.
                </td>
              </tr>
            )}
            {paginatedInquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/inquiries/${inq.id}`}
                    className="text-brand-secondary hover:underline"
                  >
                    {inq.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="text-xs">{inq.email || "—"}</div>
                  {inq.phone && <div className="text-xs">{inq.phone}</div>}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                  {inq.message}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {inq.product?.name ?? "General"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[inq.status as InquiryStatus] || "bg-gray-100 text-gray-600"}`}
                  >
                    {inq.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {new Date(inq.createdAt).toLocaleDateString()}
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
