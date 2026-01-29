import { z } from "zod";
import { Status } from "@prisma/client";

// ============================================================================
// PRODUCT VALIDATION SCHEMAS
// ============================================================================

export const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  sku: z.string().max(50).optional(),
  status: z.nativeEnum(Status).default("DRAFT"),
  summary: z.string().max(500).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  currency: z.string().length(3).default("USD"),
  srcCountry: z.string().length(2).default("CN"),
  featured: z.boolean().default(false),
  categoryId: z.string().cuid().optional(),
  supplierId: z.string().cuid().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.nativeEnum(Status).optional(),
  featured: z.coerce.boolean().optional(),
  categoryId: z.string().cuid().optional(),
  q: z.string().max(100).optional(),
});

export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
