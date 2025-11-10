// ==================== PAGINAÇÃO ====================

import type { BaseApiResponse, ErrorResponse } from "./api.types";

/**
 * Interface para os metadados de paginação.
 */
interface PaginationMetaData {
  /** O número total de itens disponíveis no banco de dados para a consulta. */
  total: number;
  /** O número da página atual retornada. */
  page: number;
}

/**
 * Representa uma resposta de sucesso para uma lista paginada de itens.
 * Estende BaseApiResponse e inclui metadados de paginação.
 * @template T O tipo de dado dos itens na lista.
 */
export interface PaginatedSuccessResponse<T>
  extends BaseApiResponse,
    PaginationMetaData {
  /** Indica que a operação foi bem-sucedida. */
  success: true; // Garante que seja um sucesso paginado
  /** Um array com os objetos de dados da página atual. */
  data: T[];
}

/**
 * O resultado de uma chamada de API para uma lista paginada, que pode ser um sucesso ou um erro.
 * @template T O tipo de dado esperado em caso de sucesso.
 */
export type PaginationResponse<T> = PaginatedSuccessResponse<T> | ErrorResponse;

/**
 * Parâmetros de consulta comuns para endpoints de listagem.
 */
export interface ListParams {
  /** O número da página a ser retornada (começa em 1). */
  page?: number;
  /** O número de itens por página. */
  limit?: number;
}
