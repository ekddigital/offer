import { z } from "zod";

export const listAssetsSchema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().min(1).max(100).default(20),
  clientId: z.string().optional(),
  projectName: z.string().optional(),
  assetType: z.enum(["image", "video", "document", "other"]).optional(),
  search: z.string().optional(),
});

export const uploadAssetSchema = z.object({
  file: z.instanceof(File),
  clientId: z.string().min(1, "Client ID is required"),
  projectName: z.string().min(1, "Project name is required"),
  assetType: z.enum(["image", "video", "document", "other"]),
});

export const chunkedUploadInitSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  totalSize: z.number().int().positive("Total size must be positive"),
  mimeType: z.string().min(1, "MIME type is required"),
  clientId: z.string().min(1, "Client ID is required"),
  projectName: z.string().min(1, "Project name is required"),
});

export const chunkedUploadChunkSchema = z.object({
  chunk: z.instanceof(Blob),
  uploadId: z.string().min(1, "Upload ID is required"),
  chunkId: z.number().int().min(0, "Chunk ID must be non-negative"),
});

export const chunkedUploadFinalizeSchema = z.object({
  uploadId: z.string().min(1, "Upload ID is required"),
});

export type ListAssetsInput = z.infer<typeof listAssetsSchema>;
export type UploadAssetInput = z.infer<typeof uploadAssetSchema>;
export type ChunkedUploadInitInput = z.infer<typeof chunkedUploadInitSchema>;
export type ChunkedUploadChunkInput = z.infer<typeof chunkedUploadChunkSchema>;
export type ChunkedUploadFinalizeInput = z.infer<
  typeof chunkedUploadFinalizeSchema
>;
