// T018: API type definitions matching backend DTOs

/**
 * Generic paginated response wrapper
 * Matches backend PaginatedResponseDto<T>
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Error response structure
 * Matches backend ErrorResponseDto
 */
export interface ErrorResponse {
  error: string;
  field?: string;
}

/**
 * ProblemDetails response (RFC 7807)
 * Used by ErrorHandlingMiddleware
 */
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>; // For ValidationProblemDetails
}

/**
 * Common API error type
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  detail?: string;
}
