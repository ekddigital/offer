/**
 * Pagination utility functions
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number,
) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
}

/**
 * Get pagination skip and take values for Prisma
 */
export function getPaginationParams(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take };
}

/**
 * Parse pagination from URL search params
 */
export function parsePaginationFromSearchParams(
  searchParams: URLSearchParams,
  defaultLimit = 20,
) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(
    1,
    Math.min(
      100,
      parseInt(searchParams.get("limit") || String(defaultLimit), 10),
    ),
  );

  return { page, limit };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> {
  return {
    data,
    pagination: calculatePagination(total, page, limit),
  };
}
