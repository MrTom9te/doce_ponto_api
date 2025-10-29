// ==================== PAGINAÇÃO ====================

import type { ErrorResponse } from "./api.types";

export interface PaginatedSuccessResponse<T> {
	success: boolean;
	data: T[];
	total: number;
	page: number;
}

export type PaginationResponse<T> = PaginatedSuccessResponse<T> | ErrorResponse;

export interface ListParams {
	page?: number;
	limit?: number;
}
