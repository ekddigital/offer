import { z } from "zod";
import { InqStatus } from "@prisma/client";

// ============================================================================
// INQUIRY VALIDATION SCHEMAS
// ============================================================================

export const inquiryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  message: z.string().min(1).max(2000),
  productId: z.string().cuid().optional().nullable(),
});

export const inquiryUpdateSchema = z.object({
  status: z.nativeEnum(InqStatus),
});

export const inquiryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.nativeEnum(InqStatus).optional(),
});

export type InquiryCreate = z.infer<typeof inquiryCreateSchema>;
export type InquiryUpdate = z.infer<typeof inquiryUpdateSchema>;
export type InquiryQuery = z.infer<typeof inquiryQuerySchema>;
