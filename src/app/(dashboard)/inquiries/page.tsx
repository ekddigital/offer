import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusColors = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REPLIED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CLOSED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default async function InquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Customer messages and product inquiries
          </p>
        </div>
      </div>

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
            {inquiries.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No inquiries yet.
                </td>
              </tr>
            )}
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/inquiries/${inq.id}`}
                    className="text-brand-secondary hover:underline"
                  >
                    {inq.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  <div>{inq.email}</div>
                  {inq.phone && <div>{inq.phone}</div>}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                  {inq.message.slice(0, 60)}...
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {inq.product?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[inq.status]}`}
                  >
                    {inq.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {inq.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
