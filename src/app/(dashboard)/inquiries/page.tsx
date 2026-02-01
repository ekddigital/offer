import { db } from "@/lib/db";
import { InquiryList } from "@/components/dashboard/inquiry-list";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
    },
  });

  const totalCount = await db.inquiry.count();

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

      <InquiryList initialInquiries={inquiries} totalCount={totalCount} />
    </div>
  );
}
