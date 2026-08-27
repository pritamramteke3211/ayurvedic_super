export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export type EntityId = string;
