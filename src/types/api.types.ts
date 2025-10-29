// ==================== TIPOS GENÉRICOS ====================

export interface SucessResponse<T> {
	success: true;
	message?: string;
	data: T;
}
export interface ErrorResponse {
	success: false;
	error: string;
	code: string;
}

export type ApiResult<T> = SucessResponse<T> | ErrorResponse;
