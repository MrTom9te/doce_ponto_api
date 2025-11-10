// ==================== TIPOS GENÉRICOS ====================

/**
 * Interface base para todas as respostas da API.
 * Contém propriedades comuns como o status de sucesso e uma mensagem opcional.
 */
export interface BaseApiResponse {
  /** Indica se a operação foi bem-sucedida ou falhou. */
  success: boolean;
  /** Mensagem opcional descrevendo o resultado da operação (sucesso ou erro). */
  message?: string;
}

/**
 * Representa uma resposta de sucesso da API.
 * @template T O tipo de dado principal retornado.
 */
export interface SucessResponse<T> extends BaseApiResponse {
  /** Indica que a operação foi bem-sucedida. */
  success: true;
  /** O payload de dados da resposta. */
  data?: T;
}

/**
 * Representa uma resposta de erro da API.
 */
export interface ErrorResponse extends BaseApiResponse {
  /** Indica que a operação falhou. */
  success: false;
  /** Mensagem legível descrevendo o erro (específico para erros). */
  error: string;
  /** Código de erro padronizado para tratamento no frontend. */
  code: string;
}

/**
 * O resultado de uma chamada de API, que pode ser um sucesso ou um erro.
 * @template T O tipo de dado esperado em caso de sucesso.
 */
export type ApiResult<T> = SucessResponse<T> | ErrorResponse;
