"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  slug: string;
  sku: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  summary: string;
  description: string;
  price: string;
  currency: string;
  srcCountry: string;
  featured: boolean;
  whatsappContact: string;
  whatsappGroup: string;
  categoryId: string;
  supplierId: string;
};

type Props = {
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
  initial?: Partial<FormData> & { id?: string };
};

export default function ProductForm({ categories, suppliers, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    sku: initial?.sku ?? "",
    status: initial?.status ?? "DRAFT",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    currency: initial?.currency ?? "USD",
    srcCountry: initial?.srcCountry ?? "CN",
    featured: initial?.featured ?? false,
    whatsappContact: initial?.whatsappContact ?? "",
    whatsappGroup: initial?.whatsappGroup ?? "",
    categoryId: initial?.categoryId ?? "",
    supplierId: initial?.supplierId ?? "",
  });

  const isEdit = !!initial?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const payload = {
        ...form,
        whatsappContact: form.whatsappContact || undefined,
        whatsappGroup: form.whatsappGroup || undefined,
        price: form.price ? parseFloat(form.price) : undefined,
        categoryId: form.categoryId || undefined,
        supplierId: form.supplierId || undefined,
      };

      const res = await fetch(
        isEdit ? `/api/products/${initial.id}` : "/api/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      router.push("/products");
      router.refresh();
    });
  };

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    updateField("name", name);
    if (!isEdit || !form.slug) {
      updateField(
        "slug",
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Slug *</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-mono text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">SKU</label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => updateField("sku", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-mono text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              updateField("status", e.target.value as FormData["status"])
            }
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Price</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            />
            <select
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="w-24 rounded-lg border border-input bg-background px-2 py-2.5 text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
        </div>

        {/* Source Country */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Source Country
          </label>
          <input
            type="text"
            maxLength={2}
            value={form.srcCountry}
            onChange={(e) =>
              updateField("srcCountry", e.target.value.toUpperCase())
            }
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm uppercase focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Supplier</label>
          <select
            value={form.supplierId}
            onChange={(e) => updateField("supplierId", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          >
            <option value="">None</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Summary</label>
        <input
          type="text"
          maxLength={500}
          value={form.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
        />
      </div>

      {/* WhatsApp Contact Section */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">
          WhatsApp Integration
        </h3>
        <p className="text-xs text-muted-foreground">
          Add WhatsApp contact options for buyers interested in this product.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* WhatsApp Contact */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Direct WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={form.whatsappContact}
              onChange={(e) => updateField("whatsappContact", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          {/* WhatsApp Group */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              WhatsApp Group Link
            </label>
            <input
              type="url"
              placeholder="https://chat.whatsapp.com/..."
              value={form.whatsappGroup}
              onChange={(e) => updateField("whatsappGroup", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Buyers can join this group for discussions
            </p>
          </div>
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={form.featured}
          onClick={() => updateField("featured", !form.featured)}
          className={`relative h-6 w-11 rounded-full transition-colors ${form.featured ? "bg-brand-accent" : "bg-muted"}`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
        <div>
          <span className="text-sm font-medium">Featured Product</span>
          <p className="text-xs text-muted-foreground">
            Featured products appear prominently on the homepage
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand-secondary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-secondary-dark disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
