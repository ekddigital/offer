import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/dashboard/product-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories, suppliers] = await Promise.all([
    db.product.findUnique({ where: { id } }),
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

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm
        categories={categories}
        suppliers={suppliers}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku ?? "",
          status: product.status,
          summary: product.summary ?? "",
          description: product.description ?? "",
          price: product.price?.toString() ?? "",
          currency: product.currency,
          srcCountry: product.srcCountry,
          featured: product.featured,
          categoryId: product.categoryId ?? "",
          supplierId: product.supplierId ?? "",
        }}
      />
    </div>
  );
}
