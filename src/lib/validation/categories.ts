import { z } from "zod";

// ============================================================================
// CATEGORY VALIDATION SCHEMAS
// ============================================================================

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().default(0),
  parentId: z.string().cuid().optional().nullable(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
