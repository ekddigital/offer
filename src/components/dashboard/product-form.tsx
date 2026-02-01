"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

type ProductImage = {
  id: string;
  url: string;
  name: string;
  sortOrder: number;
};

type Props = {
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
  initial?: Partial<FormData> & { id?: string; images?: ProductImage[] };
};

export default function ProductForm({ categories, suppliers, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<ProductImage[]>(initial?.images || []);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: { progress: number; preview: string; name: string };
  }>({});

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
        imageIds: images.map((img) => img.id),
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError("");

    const filesArray = Array.from(files);

    try {
      // Create previews and track progress for each file
      const uploadPromises = filesArray.map(async (file) => {
        // Validate file size (max 15MB for regular upload)
        if (file.size > 15 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Max size is 15MB.`);
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file.`);
        }

        // Create preview URL
        const preview = URL.createObjectURL(file);
        const fileId = `${Date.now()}-${file.name}`;

        // Add to progress tracking
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { progress: 0, preview, name: file.name },
        }));

        const formData = new FormData();
        formData.append("file", file);

        // Simulate progress (since we can't track actual progress without XMLHttpRequest)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[fileId]?.progress || 0;
            if (current < 90) {
              return {
                ...prev,
                [fileId]: { ...prev[fileId], progress: current + 10 },
              };
            }
            return prev;
          });
        }, 200);

        try {
          const res = await fetch("/api/assets/upload", {
            method: "POST",
            body: formData,
          });

          clearInterval(progressInterval);

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Upload failed");
          }

          const data = await res.json();

          // Complete progress
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: { ...prev[fileId], progress: 100 },
          }));

          // Add to images
          setImages((prev) => [
            ...prev,
            {
              id: data.asset.id,
              url: data.asset.url,
              name: data.asset.name,
              sortOrder: prev.length,
            },
          ]);

          // Remove from progress after a delay
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              URL.revokeObjectURL(preview);
              return newProgress;
            });
          }, 1000);
        } catch (err) {
          clearInterval(progressInterval);
          // Remove from progress on error
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            URL.revokeObjectURL(preview);
            return newProgress;
          });
          throw err;
        }
      });

      await Promise.all(uploadPromises);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingImages(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];

    // Update sort orders
    newImages.forEach((img, idx) => {
      img.sortOrder = idx;
    });

    setImages(newImages);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCreatingCategory(true);
    setError("");

    try {
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          slug,
          description: `${newCategoryName} category`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create category");
      }

      const newCategory = await res.json();

      // Add to categories list and select it
      categories.push({ id: newCategory.id, name: newCategory.name });
      updateField("categoryId", newCategory.id);

      // Reset form
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setCreatingCategory(false);
    }
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#111827]"
    >
      {error && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20 dark:border-gray-600 dark:bg-[#1F2937] dark:text-white"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">Slug *</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 font-mono text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">SKU</label>
          <input
            type="text"
            placeholder="e.g., IPH17-PRO-256-BLK"
            value={form.sku}
            onChange={(e) => updateField("sku", e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 font-mono text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Stock Keeping Unit - unique identifier for inventory tracking
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              updateField("status", e.target.value as FormData["status"])
            }
            className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">Price</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
            />
            <select
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="w-24 rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-2 py-2.5 text-sm text-gray-900 dark:text-white"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
        </div>

        {/* Source Country */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Source Country
          </label>
          <input
            type="text"
            maxLength={2}
            value={form.srcCountry}
            onChange={(e) =>
              updateField("srcCountry", e.target.value.toUpperCase())
            }
            className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm uppercase focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">Category</label>
          {showNewCategory ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter new category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateCategory();
                  } else if (e.key === "Escape") {
                    setShowNewCategory(false);
                    setNewCategoryName("");
                  }
                }}
                className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory || !newCategoryName.trim()}
                  className="rounded-lg border-2 border-brand-accent bg-brand-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-accent-dark hover:border-brand-accent-dark disabled:opacity-50"
                >
                  {creatingCategory ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategoryName("");
                  }}
                  className="rounded-lg border-2 border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
                className="flex-1 rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="rounded-lg border-2 border-brand-accent bg-brand-accent px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-accent-dark hover:border-brand-accent-dark"
                title="Create new category"
              >
                + New
              </button>
            </div>
          )}
        </div>

        {/* Supplier */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Supplier{" "}
            <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
          </label>
          <select
            value={form.supplierId}
            onChange={(e) => updateField("supplierId", e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
          >
            <option value="">None (Default: China)</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Most products are sourced from China by default
          </p>
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">Summary</label>
        <input
          type="text"
          maxLength={500}
          value={form.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
        />
      </div>

      {/* Product Images Section */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Product Images
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload multiple images (max 15MB each). First image is the main
              product image.
            </p>
          </div>
          <label className="group cursor-pointer rounded-lg border-2 border-brand-accent bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-accent-dark hover:border-brand-accent-dark disabled:opacity-50">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {uploadingImages ? "Uploading..." : "Add Images"}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
            />
          </label>
        </div>

        {/* Show uploading images with progress */}
        {Object.entries(uploadProgress).length > 0 && (
          <div className="space-y-3">
            {Object.entries(uploadProgress).map(([fileId, data]) => (
              <div
                key={fileId}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={data.preview}
                    alt="Uploading"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {data.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-brand-accent transition-all duration-300"
                        style={{ width: `${data.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {data.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg border border-border bg-muted"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition group-hover:opacity-100">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      className="rounded bg-white/90 p-1.5 text-xs font-medium hover:bg-white"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      className="rounded bg-white/90 p-1.5 text-xs font-medium hover:bg-white"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="rounded bg-red-500 p-1.5 text-xs font-medium text-white hover:bg-red-600"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute left-2 top-2 rounded bg-brand-accent px-2 py-0.5 text-xs font-semibold text-white">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : Object.entries(uploadProgress).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 py-12">
            <svg
              className="mb-3 h-12 w-12 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No images uploaded yet
            </p>
          </div>
        ) : null}
      </div>

      {/* WhatsApp Contact Section */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">
          WhatsApp Integration
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Add WhatsApp contact options for buyers interested in this product.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* WhatsApp Contact */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Direct WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={form.whatsappContact}
              onChange={(e) => updateField("whatsappContact", e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          {/* WhatsApp Group */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              WhatsApp Group Link
            </label>
            <input
              type="url"
              placeholder="https://chat.whatsapp.com/..."
              value={form.whatsappGroup}
              onChange={(e) => updateField("whatsappGroup", e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1F2937] dark:text-white px-4 py-2.5 text-sm focus:border-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/20"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Featured Product</span>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Featured products appear prominently on the homepage
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border-2 border-brand-secondary bg-brand-secondary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-secondary-dark hover:border-brand-secondary-dark disabled:opacity-50 disabled:border-brand-secondary/50"
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
          className="rounded-lg border-2 border-gray-300 dark:border-gray-600 px-6 py-2.5 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-foreground/20"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
