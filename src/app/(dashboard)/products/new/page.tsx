import { db } from "@/lib/db";
import ProductForm from "@/components/dashboard/product-form";

export default async function NewProductPage() {
  const [categories, suppliers] = await Promise.all([
    db.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.supplier.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">New Product</h1>
      <ProductForm categories={categories} suppliers={suppliers} />
    </div>
  );
}
