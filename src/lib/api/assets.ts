import { env } from "@/lib/env";
import {
  listAssetsSchema,
  uploadAssetSchema,
  chunkedUploadInitSchema,
  chunkedUploadChunkSchema,
  chunkedUploadFinalizeSchema,
} from "@/lib/validation/assets";

const ASSETS_BASE_URL = env.ASSETS_BASE_URL;

/**
 * List assets with pagination and filtering
 */
export async function listAssets(input: unknown) {
  const payload = listAssetsSchema.parse(input);

  const searchParams = new URLSearchParams({
    page: payload.page.toString(),
    size: payload.size.toString(),
  });

  if (payload.clientId) searchParams.set("client_id", payload.clientId);
  if (payload.projectName)
    searchParams.set("project_name", payload.projectName);
  if (payload.assetType) searchParams.set("asset_type", payload.assetType);
  if (payload.search) searchParams.set("search", payload.search);

  const response = await fetch(
    `${ASSETS_BASE_URL}/api/v1/assets?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${env.ASSETS_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Assets API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Upload a single asset (for files < 15MB)
 */
export async function uploadAsset(input: unknown) {
  const payload = uploadAssetSchema.parse(input);

  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("client_id", payload.clientId);
  formData.append("project_name", payload.projectName);
  formData.append("asset_type", payload.assetType);

  const response = await fetch(`${ASSETS_BASE_URL}/api/v1/assets/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ASSETS_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Initialize chunked upload for large files (15MB+)
 */
export async function initializeChunkedUpload(input: unknown) {
  const payload = chunkedUploadInitSchema.parse(input);

  const response = await fetch(
    `${ASSETS_BASE_URL}/api/v1/assets/upload/terminal/initialize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.ASSETS_API_KEY}`,
      },
      body: JSON.stringify({
        filename: payload.filename,
        totalSize: payload.totalSize,
        mimeType: payload.mimeType,
        clientId: payload.clientId,
        projectName: payload.projectName,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Chunked upload init failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Upload a chunk in chunked upload process
 */
export async function uploadChunk(input: unknown) {
  const payload = chunkedUploadChunkSchema.parse(input);

  const formData = new FormData();
  formData.append("chunk", payload.chunk);
  formData.append("uploadId", payload.uploadId);
  formData.append("chunkId", payload.chunkId.toString());

  const response = await fetch(
    `${ASSETS_BASE_URL}/api/v1/assets/upload/terminal/chunk`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.ASSETS_API_KEY}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(`Chunk upload failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Finalize chunked upload
 */
export async function finalizeChunkedUpload(input: unknown) {
  const payload = chunkedUploadFinalizeSchema.parse(input);

  const response = await fetch(
    `${ASSETS_BASE_URL}/api/v1/assets/upload/terminal/finalize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.ASSETS_API_KEY}`,
      },
      body: JSON.stringify({ uploadId: payload.uploadId }),
    },
  );

  if (!response.ok) {
    throw new Error(`Upload finalization failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete an asset by ID
 */
export async function deleteAsset(assetId: string) {
  const response = await fetch(`${ASSETS_BASE_URL}/api/v1/assets/${assetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${env.ASSETS_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status}`);
  }

  return response.status === 204;
}

/**
 * Get asset download URL
 */
export function getAssetDownloadUrl(assetId: string) {
  return `${ASSETS_BASE_URL}/api/v1/assets/${assetId}/download`;
}

/**
 * Get public asset URL
 */
export function getPublicAssetUrl(
  clientId: string,
  projectName: string,
  assetType: string,
  filename: string,
) {
  return `${ASSETS_BASE_URL}/assets/${clientId}/${projectName}/${assetType}/${filename}`;
}

/**
 * Smart upload function that automatically chooses strategy based on file size
 */
export async function smartUploadAsset({
  file,
  clientId,
  projectName,
  assetType,
  onProgress,
}: {
  file: File;
  clientId: string;
  projectName: string;
  assetType: "image" | "video" | "document" | "other";
  onProgress?: (progress: number) => void;
}) {
  const MAX_SINGLE_UPLOAD_SIZE = 15 * 1024 * 1024; // 15MB

  if (file.size <= MAX_SINGLE_UPLOAD_SIZE) {
    // Single upload for files <= 15MB
    onProgress?.(50);
    const result = await uploadAsset({
      file,
      clientId,
      projectName,
      assetType,
    });
    onProgress?.(100);
    return result;
  } else {
    // Chunked upload for files > 15MB
    const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    // Initialize
    const { uploadId } = await initializeChunkedUpload({
      filename: file.name,
      totalSize: file.size,
      mimeType: file.type,
      clientId,
      projectName,
    });

    // Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      await uploadChunk({
        chunk,
        uploadId,
        chunkId: i,
      });

      const progress = Math.round(((i + 1) / totalChunks) * 90); // Reserve 10% for finalization
      onProgress?.(progress);
    }

    // Finalize
    const result = await finalizeChunkedUpload({ uploadId });
    onProgress?.(100);

    return result;
  }
}
