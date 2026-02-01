import Link from "next/link";
import { db } from "@/lib/db";
import { SupplierList } from "@/components/dashboard/supplier-list";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await db.supplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const totalCount = await db.supplier.count();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Link
          href="/suppliers/new"
          className="rounded-lg border-2 border-[#A5F3FC] bg-[#A5F3FC] px-4 py-2 text-sm font-semibold text-[#0B1220] shadow-sm transition hover:bg-[#67E8F9] hover:border-[#67E8F9]"
        >
          + Add Supplier
        </Link>
      </div>

      <SupplierList initialSuppliers={suppliers} totalCount={totalCount} />
    </div>
  );
}
