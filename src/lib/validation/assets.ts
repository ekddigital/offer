import { z } from "zod";

export const listAssetsSchema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().min(1).max(100).default(20),
  clientId: z.string().optional(),
  projectName: z.string().optional(),
  assetType: z.enum(["image", "video", "document", "other"]).optional(),
  search: z.string().optional(),
});

export type ListAssetsInput = z.infer<typeof listAssetsSchema>;
