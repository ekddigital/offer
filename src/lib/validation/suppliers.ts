import { z } from "zod";

// ============================================================================
// SUPPLIER VALIDATION SCHEMAS
// ============================================================================

export const supplierCreateSchema = z.object({
  name: z.string().min(1).max(200),
  country: z.string().length(2).default("CN"),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  active: z.boolean().default(true),
});

export const supplierUpdateSchema = supplierCreateSchema.partial();

export type SupplierCreate = z.infer<typeof supplierCreateSchema>;
export type SupplierUpdate = z.infer<typeof supplierUpdateSchema>;
