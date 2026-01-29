# EKD Digital Assets API - Complete Usage Guide

> Upload, manage, and serve digital assets with intelligent upload strategies. Handles files from 1KB to 100MB+ with automatic optimization.

## Quick Setup

**1. Environment Variables (`.env.local`):**

```bash
# Assets API Configuration
ASSETS_API_KEY="ak_your_api_key_here"
ASSETS_BASE_URL="https://www.assets.andgroupco.com"
```

**2. Get Your API Key:**

Visit the Assets dashboard → API Keys section → Generate new key

**3. Verify Access:**

```bash
curl -H "Authorization: Bearer ak_your_api_key_here" \
  https://www.assets.andgroupco.com/api/v1/assets?page=1&size=5
```

## API Reference

### Base Information

- **Base URL:** `https://www.assets.andgroupco.com/api/v1/assets`
- **Authentication:** Bearer token (API Key)
- **Rate Limits:** 1000 requests/hour per key
- **Max File Size:** 500MB per file
- **Supported Formats:** Images, Videos, Documents, Archives, Code files

### URL Structure

```
/assets/{client_id}/{project_name}/{asset_type}/{filename}
```

**Example:**

```
/assets/ekdsend/mail-test/image/logo-2024.png
```

## Authentication

All API requests require authentication via Bearer token:

```typescript
headers: {
  "Authorization": "Bearer ak_your_api_key_here",
  "Content-Type": "application/json"
}
```

## Upload Strategies

The API automatically selects the optimal upload strategy based on file size:

### Small Files (<1MB) - Database Strategy

- **Method:** Direct database storage
- **Speed:** Instant (< 1 second)
- **Best for:** Icons, thumbnails, small documents

### Medium Files (1-15MB) - VPS Upload Strategy

- **Method:** File system storage + database backup
- **Speed:** Fast (2-10 seconds)
- **Best for:** Images, documents, small videos

### Large Files (15MB+) - Chunked Upload Strategy

- **Method:** Multi-part upload with progress tracking
- **Speed:** Optimized (shows progress)
- **Best for:** Videos, archives, large files

## Core Endpoints

### 1. Upload Asset

**Single File Upload (< 15MB):**

```typescript
// POST /api/v1/assets/upload
const formData = new FormData();
formData.append("file", file);
formData.append("client_id", "ekdsend");
formData.append("project_name", "mail-test");
formData.append("asset_type", "image"); // image|video|document|other

const response = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets/upload",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer ak_your_api_key_here",
    },
    body: formData,
  }
);

const result = await response.json();
```

**Response:**

```json
{
  "success": true,
  "id": "1a0c1ada-87ef-44db-a114-f07fe32d6a18",
  "name": "logo-2024.png",
  "size": 156723,
  "mime_type": "image/png",
  "download_url": "https://www.assets.andgroupco.com/api/v1/assets/1a0c1ada-87ef-44db-a114-f07fe32d6a18/download",
  "public_url": "/assets/ekdsend/mail-test/image/logo-2024.png",
  "algorithm_results": {
    "strategies_used": ["database_only"],
    "total_processing_time": "0.234s"
  }
}
```

**Large File Upload (15MB+):**

```typescript
// Step 1: Initialize chunked upload
const response = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets/upload/terminal/initialize",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer ak_your_api_key_here",
    },
    body: JSON.stringify({
      filename: file.name,
      totalSize: file.size,
      mimeType: file.type,
      clientId: "ekdsend",
      projectName: "mail-test",
    }),
  }
);

const { uploadId } = await response.json();

// Step 2: Upload chunks
const chunkSize = 4 * 1024 * 1024; // 4MB
const totalChunks = Math.ceil(file.size / chunkSize);

for (let i = 0; i < totalChunks; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const chunk = file.slice(start, end);

  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("uploadId", uploadId);
  formData.append("chunkId", i.toString());

  await fetch(
    "https://www.assets.andgroupco.com/api/v1/assets/upload/terminal/chunk",
    {
      method: "POST",
      headers: { Authorization: "Bearer ak_your_api_key_here" },
      body: formData,
    }
  );
}

// Step 3: Finalize upload
const finalResponse = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets/upload/terminal/finalize",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer ak_your_api_key_here",
    },
    body: JSON.stringify({ uploadId }),
  }
);
```

### 2. List Assets

```typescript
// GET /api/v1/assets
const response = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets?page=1&size=20&client_id=ekdsend",
  {
    headers: {
      Authorization: "Bearer ak_your_api_key_here",
    },
  }
);

const result = await response.json();
```

**Parameters:**

- `page` (optional): Page number (default: 1)
- `size` (optional): Items per page (default: 20, max: 100)
- `client_id` (optional): Filter by client
- `project_name` (optional): Filter by project
- `asset_type` (optional): Filter by type (image|video|document|other)
- `search` (optional): Search in filenames

**Response:**

```json
{
  "data": [
    {
      "id": "1a0c1ada-87ef-44db-a114-f07fe32d6a18",
      "name": "logo-2024.png",
      "client_id": "ekdsend",
      "project_name": "mail-test",
      "asset_type": "image",
      "size": 156723,
      "mime_type": "image/png",
      "created_at": "2024-11-21T10:30:00Z",
      "public_url": "/assets/ekdsend/mail-test/image/logo-2024.png"
    }
  ],
  "page": 1,
  "size": 20,
  "total": 1,
  "pages": 1
}
```

### 3. Get Asset Details

```typescript
// GET /api/v1/assets/{id}
const response = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets/1a0c1ada-87ef-44db-a114-f07fe32d6a18",
  {
    headers: {
      Authorization: "Bearer ak_your_api_key_here",
    },
  }
);

const asset = await response.json();
```

**Response:**

```json
{
  "id": "1a0c1ada-87ef-44db-a114-f07fe32d6a18",
  "name": "logo-2024.png",
  "filename": "logo-2024.png",
  "client_id": "ekdsend",
  "project_name": "mail-test",
  "asset_type": "image",
  "size": 156723,
  "file_size": 156723,
  "mime_type": "image/png",
  "created_at": "2024-11-21T10:30:00Z",
  "updated_at": "2024-11-21T10:30:00Z",
  "public_url": "/assets/ekdsend/mail-test/image/logo-2024.png",
  "file_hash": "sha256:abc123...",
  "checksum": "md5:def456..."
}
```

### 4. Download Asset

```typescript
// GET /api/v1/assets/{id}/download
const response = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets/1a0c1ada-87ef-44db-a114-f07fe32d6a18/download",
  {
    headers: {
      Authorization: "Bearer ak_your_api_key_here",
    },
  }
);

const blob = await response.blob();
const url = URL.createObjectURL(blob);

// Create download link
const link = document.createElement("a");
link.href = url;
link.download = "logo-2024.png";
link.click();
```

### 5. Delete Asset

```typescript
// DELETE /api/v1/assets/{id}
const response = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets/1a0c1ada-87ef-44db-a114-f07fe32d6a18",
  {
    method: "DELETE",
    headers: {
      Authorization: "Bearer ak_your_api_key_here",
    },
  }
);

// Returns 204 No Content on success
```

## Public Asset URLs

Assets can be accessed via public URLs without authentication:

```
https://www.assets.andgroupco.com/assets/{client_id}/{project_name}/{asset_type}/{filename}
```

**Examples:**

```
https://www.assets.andgroupco.com/assets/ekdsend/mail-test/image/logo-2024.png
https://www.assets.andgroupco.com/assets/wesustain/branding/video/intro-video.mp4
```

## Testing Your Integration

We've created a comprehensive test lab at: `/test-assets`

**Test Categories:**

1. **Small Files (<1MB)** - Database storage strategy
2. **Medium Files (1-15MB)** - VPS upload strategy
3. **Large Files (15-50MB)** - Chunked upload with progress
4. **Very Large Files (50MB+)** - Optimized chunked upload
5. **Authentication Tests** - API key validation
6. **Download Tests** - Asset retrieval
7. **Metadata Tests** - Asset information

**Available Test Files:**

```
/mail/test-files/
├── test-500kb.bin          # Small file test
├── test-2.5mb-document.pdf # Medium document test
├── test-5mb.bin            # Medium binary test
├── test-15mb-video.mp4     # Large video test
├── test-50mb-video.mp4     # Very large video test
└── test-100mb-large.bin    # Maximum size test
```

## CORS Proxy (Development)

For development, use the proxy route to avoid CORS issues:

```typescript
// /api/assets-proxy/route.ts (already implemented in mail/)

// Instead of direct API calls:
fetch("https://www.assets.andgroupco.com/api/v1/assets");

// Use proxy:
fetch("/api/assets-proxy?path=&page=1&size=10");
```

## Error Handling

### Common Error Codes

- **400 Bad Request:** Invalid request parameters
- **401 Unauthorized:** Invalid or missing API key
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Asset not found
- **413 Payload Too Large:** File exceeds size limits
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Server error

### Error Response Format

```json
{
  "error": "Authentication required",
  "code": 401,
  "details": "Invalid or missing authorization header"
}
```

### Robust Error Handling

```typescript
async function safeApiCall(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `API Error (${response.status}): ${error.error || error.message}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error: Please check your connection");
    }
    throw error;
  }
}
```

## Troubleshooting

### Common Issues

**1. CORS Errors:**

- Use the proxy route for development: `/api/assets-proxy`
- Ensure proper headers in production

**2. Upload Failures:**

- Check file size limits (500MB max)
- Verify API key permissions
- Ensure stable network connection for large files

**3. Authentication Errors:**

- Verify API key format: `ak_...`
- Check key permissions in dashboard
- Ensure Bearer token format: `Bearer ak_...`

**4. Asset Not Found (500 Error) - RESOLVED:**

- ✅ **Fixed:** Converted API endpoints to use raw SQL queries for production compatibility
- ✅ **Status:** Asset detail pages now working correctly in production
- ✅ **Technical Note:** Replaced Prisma client calls with raw SQL to match database field names

### Debug Mode

```typescript
const DEBUG = process.env.NODE_ENV === "development";

const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[Assets API Debug] ${message}`, data);
  }
};

// Use throughout your code
debugLog("Starting upload", { filename: file.name, size: file.size });
```

## Production Status

### ✅ Recent Fixes (November 2024)

- **Asset Detail Pages:** Fixed 500 errors by converting to raw SQL queries
- **Database Compatibility:** Resolved field name mismatches between Prisma schema and production database
- **Authentication:** Temporarily disabled signup functionality while preserving code for future re-enabling

### Current Production State

- **API Status:** ✅ Fully operational
- **Asset Viewing:** ✅ Working correctly
- **Upload System:** ✅ All strategies functional
- **Download System:** ✅ Working correctly
- **Authentication:** ✅ Login functional (signup temporarily disabled)

## Support & Resources

- **Test Lab:** `/test-assets` - Comprehensive testing interface
- **Dashboard:** `https://www.assets.andgroupco.com/dashboard`
- **API Keys:** `https://www.assets.andgroupco.com/api-keys`
- **Analytics:** `https://www.assets.andgroupco.com/analytics`

---

_This documentation is based on our comprehensive test suite. See `/mail/src/app/test-assets/page.tsx` and `/mail/src/app/api/assets-proxy/route.ts` for working implementation examples._
